import { NextRequest, NextResponse } from 'next/server';
import { hermes } from '@/lib/hermes';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { history } = body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ success: false, error: 'Chat history array is required' }, { status: 400 });
    }

    // Format logs for LLM
    const logs = history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join('\n');

    const prompt = `You are a business psychologist and SME memory model analyzer.
Analyze the following conversation history between the user and a business AI.
Extract the user's:
1. Management style (e.g. risk-averse, growth-oriented, bootstrapping, data-driven)
2. Budget constraints / current financials
3. SME business goals

Respond ONLY with a valid JSON block matching this structure:
{
  "managementStyle": "extracted style",
  "budget": "extracted budget/financial notes",
  "goals": "extracted business goals"
}
Do not add any markdown formatting, thoughts, or comments. Just the pure raw JSON.

CONVERSATION LOGS:
${logs}`;

    const completion = await hermes.chatCompletion([
      { role: 'user', content: prompt }
    ]);

    const resultText = completion.choices?.[0]?.message?.content || '{}';
    let profileData;
    try {
      // Clean JSON string in case the LLM returned markdown blocks
      const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      profileData = JSON.parse(cleanJson);
    } catch {
      profileData = {
        managementStyle: 'Standard SME management',
        budget: 'Not specified',
        goals: 'Growth and stability'
      };
    }

    const contentString = `Management Style: ${profileData.managementStyle} | Budget: ${profileData.budget} | Goals: ${profileData.goals}`;
    
    // Bounded limit check
    const truncatedContent = contentString.substring(0, 1375);

    // Save to Database
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      const { data: existing } = await supabase
        .from('agent_memory_v2')
        .select('*')
        .eq('organization_id', ORG_ID)
        .eq('type', 'user_profile')
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('agent_memory_v2')
          .update({
            key: 'user_business_profile',
            content: truncatedContent,
            importance: 9,
            char_limit: 1375
          })
          .eq('id', (existing as Record<string, unknown>).id as string)
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ success: true, profile: profileData, memory: data });
      } else {
        const { data, error } = await supabase
          .from('agent_memory_v2')
          .insert({
            type: 'user_profile',
            key: 'user_business_profile',
            content: truncatedContent,
            importance: 9,
            char_limit: 1375,
            organization_id: ORG_ID
          })
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ success: true, profile: profileData, memory: data });
      }
    } else if (db) {
      const existing = await db.agentMemoryV2.findFirst({
        where: { organizationId: ORG_ID, type: 'user_profile' }
      });

      if (existing) {
        const updated = await db.agentMemoryV2.update({
          where: { id: existing.id },
          data: {
            key: 'user_business_profile',
            content: truncatedContent,
            importance: 9,
            charLimit: 1375
          }
        });
        return NextResponse.json({ success: true, profile: profileData, memory: updated });
      } else {
        const memory = await db.agentMemoryV2.create({
          data: {
            type: 'user_profile',
            key: 'user_business_profile',
            content: truncatedContent,
            importance: 9,
            charLimit: 1375,
            organizationId: ORG_ID
          }
        });
        return NextResponse.json({ success: true, profile: profileData, memory: memory });
      }
    }

    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
  } catch (error: any) {
    console.error('Error in memory analysis:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
