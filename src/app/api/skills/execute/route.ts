import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';
import { getZAI } from '@/lib/zai';

const ORG_ID = 'org1';

/** Map a Supabase memory row (snake_case) to camelCase */
function mapMemoryFromSupabase(m: Record<string, unknown>) {
  return {
    id: m.id as string,
    type: (m.type as string) || 'memory',
    key: m.key as string,
    content: m.content as string,
    importance: (m.importance as number) ?? 5,
    charLimit: (m.char_limit as number) ?? 500,
    sessionId: (m.session_id as string) ?? null,
    organizationId: m.organization_id as string,
    createdAt: m.created_at as string,
    updatedAt: m.updated_at as string,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skillSlug, input, sessionId } = body;

    if (!skillSlug || !input) {
      return NextResponse.json(
        { error: 'skillSlug and input are required' },
        { status: 400 }
      );
    }

    // ── Resolve the skill ──
    let skill: {
      id: string;
      name: string;
      slug: string;
      category: string;
      version: string;
      content: string;
      usageCount: number;
    } | null = null;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      const { data, error } = await supabase
        .from('skills')
        .select('id, name, slug, category, version, content, usage_count')
        .eq('slug', skillSlug)
        .eq('organization_id', ORG_ID)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: `Active skill with slug "${skillSlug}" not found` },
          { status: 404 }
        );
      }

      const d = data as Record<string, unknown>;
      skill = {
        id: d.id as string,
        name: d.name as string,
        slug: d.slug as string,
        category: (d.category as string) || 'general',
        version: (d.version as string) || '1.0.0',
        content: d.content as string,
        usageCount: (d.usage_count as number) ?? 0,
      };
    } else if (db) {
      const found = await db.skill.findFirst({
        where: { slug: skillSlug, organizationId: ORG_ID, status: 'active' },
      });

      if (!found) {
        return NextResponse.json(
          { error: `Active skill with slug "${skillSlug}" not found` },
          { status: 404 }
        );
      }

      skill = found;
    }

    if (!skill) {
      return NextResponse.json(
        { error: `Active skill with slug "${skillSlug}" not found` },
        { status: 404 }
      );
    }

    // ── Get related memories for context (top 5 most important) ──
    let memoryContext = 'No prior memories.';
    let profileContext = '';

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      const { data: memData, error: memError } = await supabase
        .from('agent_memory_v2')
        .select('*')
        .eq('organization_id', ORG_ID)
        .eq('type', 'memory')
        .order('importance', { ascending: false })
        .limit(5);

      if (memError) throw memError;

      const memories = (memData || []).map(mapMemoryFromSupabase);
      if (memories.length > 0) {
        memoryContext = memories.map((m) => `- ${m.key}: ${m.content}`).join('\n');
      }

      const { data: profileData } = await supabase
        .from('agent_memory_v2')
        .select('*')
        .eq('organization_id', ORG_ID)
        .eq('type', 'user_profile')
        .maybeSingle();

      if (profileData) {
        const profile = mapMemoryFromSupabase(profileData as Record<string, unknown>);
        profileContext = `User Profile: ${profile.content}`;
      }
    } else if (db) {
      const memories = await db.agentMemoryV2.findMany({
        where: { organizationId: ORG_ID, type: 'memory' },
        orderBy: { importance: 'desc' },
        take: 5,
      });

      if (memories.length > 0) {
        memoryContext = memories.map((m) => `- ${m.key}: ${m.content}`).join('\n');
      }

      const userProfile = await db.agentMemoryV2.findFirst({
        where: { organizationId: ORG_ID, type: 'user_profile' },
      });

      if (userProfile) {
        profileContext = `User Profile: ${userProfile.content}`;
      }
    }

    // ── Use z-ai-web-dev-sdk to generate a response ──
    const zai = await getZAI();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are GangNiaga AI, a professional ASEAN SME business assistant. You are now using the skill "${skill.name}" (v${skill.version}).

## SKILL INSTRUCTIONS
${skill.content}

## RELEVANT MEMORIES
${memoryContext}

${profileContext}

Follow the skill instructions precisely. Apply the skill's knowledge to the user's input. Be thorough, professional, and data-driven. Use Malaysian business context where relevant. Format your response in clear markdown.`,
        },
        {
          role: 'user',
          content: input,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      return NextResponse.json({ error: 'No response generated' }, { status: 500 });
    }

    // ── Increment usage count and update lastUsedAt ──
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { error: updateError } = await supabase
        .from('skills')
        .update({
          usage_count: skill.usageCount + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq('id', skill.id);

      if (updateError) {
        console.error('Error updating skill usage count:', updateError);
      }
    } else if (db) {
      await db.skill.update({
        where: { id: skill.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });
    }

    // ── Update session skillsUsed if sessionId provided ──
    if (sessionId) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseServer();
        const { data: sessionData } = await supabase
          .from('chat_sessions')
          .select('skills_used')
          .eq('id', sessionId)
          .eq('organization_id', ORG_ID)
          .maybeSingle();

        if (sessionData) {
          const skillsUsed: string[] = Array.isArray((sessionData as Record<string, unknown>).skills_used)
            ? (sessionData as Record<string, unknown>).skills_used as string[]
            : [];
          if (!skillsUsed.includes(skill.id)) {
            skillsUsed.push(skill.id);
            await supabase
              .from('chat_sessions')
              .update({ skills_used: skillsUsed }) // JSONB
              .eq('id', sessionId);
          }
        }
      } else if (db) {
        const session = await db.chatSession.findFirst({
          where: { id: sessionId, organizationId: ORG_ID },
        });
        if (session) {
          const skillsUsed: string[] = session.skillsUsed ? JSON.parse(session.skillsUsed) : [];
          if (!skillsUsed.includes(skill.id)) {
            skillsUsed.push(skill.id);
            await db.chatSession.update({
              where: { id: sessionId },
              data: { skillsUsed: JSON.stringify(skillsUsed) },
            });
          }
        }
      }
    }

    return NextResponse.json({
      skill: {
        id: skill.id,
        name: skill.name,
        slug: skill.slug,
        category: skill.category,
      },
      response,
    });
  } catch (error) {
    console.error('Error executing skill:', error);
    return NextResponse.json({ error: 'Failed to execute skill' }, { status: 500 });
  }
}
