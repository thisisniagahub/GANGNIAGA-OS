import { NextRequest, NextResponse } from 'next/server';
import { getZAI, SOUL_PROMPT } from '@/lib/zai';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, systemPrompt } = body as {
      message?: string;
      history?: ChatMessage[];
      systemPrompt?: string;
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // 1. Fetch Bounded Memory Snapshot (MEMORY.md and USER.md Hermes Standard)
    let memoryBlock = '';
    try {
      let memories: Array<{ key: string; content: string }> = [];
      let userContent = '';

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseServer();
        const { data: memData } = await supabase
          .from('agent_memory_v2')
          .select('key, content')
          .eq('organization_id', ORG_ID)
          .eq('type', 'memory')
          .order('importance', { ascending: false });

        if (memData) {
          memories = memData;
        }

        const { data: profileData } = await supabase
          .from('agent_memory_v2')
          .select('content')
          .eq('organization_id', ORG_ID)
          .eq('type', 'user_profile')
          .maybeSingle();

        if (profileData) {
          userContent = profileData.content || '';
        }
      } else if (db) {
        const dbMems = await db.agentMemoryV2.findMany({
          where: { organizationId: ORG_ID, type: 'memory' },
          orderBy: { importance: 'desc' },
          select: { key: true, content: true },
        });
        memories = dbMems;

        const profile = await db.agentMemoryV2.findFirst({
          where: { organizationId: ORG_ID, type: 'user_profile' },
          select: { content: true },
        });
        if (profile) {
          userContent = profile.content || '';
        }
      }

      const memoryLines = memories.map(m => `- [${m.key}]: ${m.content}`).join('\n');
      if (memoryLines || userContent) {
        memoryBlock = `
§ MEMORY.md §
${memoryLines.substring(0, 2200)}

§ USER.md §
${userContent.substring(0, 1375)}
        `.trim();
      }
    } catch (memError) {
      console.error('[Chat API] Bounded memory compilation failed:', memError);
    }

    // 2. Build the system prompt
    const baseSystemPrompt = systemPrompt || SOUL_PROMPT;
    const effectiveSystemPrompt = memoryBlock 
      ? `${baseSystemPrompt}\n\n## Bounded Memory Snapshot\n${memoryBlock}`
      : baseSystemPrompt;

    // 3. Build messages array
    const messages: ChatMessage[] = [
      { role: 'system', content: effectiveSystemPrompt },
      ...(Array.isArray(history) ? history.slice(-20) : []),
      { role: 'user', content: message },
    ];

    // 4. Try connecting to Hermes Agent API Server (Nous Research)
    const hermesUrl = process.env.HERMES_API_URL || 'http://127.0.0.1:8642/v1';
    const hermesApiKey = process.env.HERMES_API_KEY || 'gangniaga-hermes-secret-key';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200); // Short timeout for loopback check

      const hermesResponse = await fetch(`${hermesUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hermesApiKey}`,
        },
        body: JSON.stringify({
          model: 'hermes-agent',
          messages,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (hermesResponse.ok) {
        const data = await hermesResponse.json();
        const response = data.choices?.[0]?.message?.content;
        if (response) {
          return NextResponse.json({
            response,
            usage: data.usage || null,
            provider: 'hermes-agent',
          });
        }
      }
    } catch (hermesError) {
      // Fallback silently to main getZAI client if Hermes daemon is not running
      console.log('[Chat API] Hermes server not reachable, falling back to default AI provider.');
    }

    // 5. Fallback Default Provider (ZAI / OpenAI / OpenRouter)
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response,
      usage: completion.usage || null,
      provider: 'default-fallback',
    });
  } catch (error) {
    console.error('[/api/ai/chat] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate chat response';
    const errorStatus = (error as any)?.status || 500;
    return NextResponse.json(
      { error: errorMessage },
      { status: errorStatus }
    );
  }
}
