import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

/** Map a Supabase chat_session row (snake_case) to camelCase */
function mapSessionFromSupabase(s: Record<string, unknown>) {
  return {
    id: s.id as string,
    title: s.title as string | null,
    platform: (s.platform as string) || 'web',
    platformSessionId: (s.platform_session_id as string) ?? null,
    messages: Array.isArray(s.messages) ? s.messages : [],
    memorySnapshot: s.memory_snapshot ?? null,
    soulSnapshot: s.soul_snapshot ?? null,
    skillsUsed: Array.isArray(s.skills_used) ? s.skills_used : [],
    status: (s.status as string) || 'active',
    organizationId: s.organization_id as string,
    createdAt: s.created_at as string,
    updatedAt: s.updated_at as string,
  };
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('organization_id', ORG_ID)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const sessions = (data || []).map((s: Record<string, unknown>) => mapSessionFromSupabase(s));
      return NextResponse.json({ sessions });
    } else if (db) {
      const sessions = await db.chatSession.findMany({
        where: { organizationId: ORG_ID },
        orderBy: { updatedAt: 'desc' },
      });

      // Parse JSON fields for each session
      const parsed = sessions.map((session) => ({
        ...session,
        messages: JSON.parse(session.messages),
        memorySnapshot: session.memorySnapshot ? JSON.parse(session.memorySnapshot) : null,
        soulSnapshot: session.soulSnapshot ? JSON.parse(session.soulSnapshot) : null,
        skillsUsed: session.skillsUsed ? JSON.parse(session.skillsUsed) : [],
      }));

      return NextResponse.json({ sessions: parsed });
    }

    return NextResponse.json({ sessions: [] });
  } catch (error) {
    console.error('Error listing sessions:', error);
    return NextResponse.json({ error: 'Failed to list sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, platformSessionId, title } = body;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Get current memory snapshot for this org
      const { data: memories } = await supabase
        .from('agent_memory_v2')
        .select('key, content, type, importance')
        .eq('organization_id', ORG_ID)
        .order('importance', { ascending: false });

      const memorySnapshot = (memories || []).map((m: Record<string, unknown>) => ({
        key: m.key,
        content: m.content,
        type: m.type,
        importance: m.importance,
      }));

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          title: title || null,
          platform: platform || 'web',
          platform_session_id: platformSessionId || null,
          messages: [], // JSONB — store directly, no JSON.stringify
          memory_snapshot: memorySnapshot, // JSONB — store directly
          soul_snapshot: null,
          skills_used: [], // JSONB — store directly
          status: 'active',
          organization_id: ORG_ID,
        })
        .select()
        .single();

      if (error) throw error;

      const session = mapSessionFromSupabase(data as Record<string, unknown>);
      return NextResponse.json({ session }, { status: 201 });
    } else if (db) {
      // Get current memory snapshot for this org
      const memories = await db.agentMemoryV2.findMany({
        where: { organizationId: ORG_ID },
        orderBy: { importance: 'desc' },
      });

      const memorySnapshot = JSON.stringify(
        memories.map((m) => ({ key: m.key, content: m.content, type: m.type, importance: m.importance }))
      );

      const session = await db.chatSession.create({
        data: {
          title: title || null,
          platform: platform || 'web',
          platformSessionId: platformSessionId || null,
          messages: JSON.stringify([]),
          memorySnapshot,
          soulSnapshot: null,
          skillsUsed: JSON.stringify([]),
          status: 'active',
          organizationId: ORG_ID,
        },
      });

      return NextResponse.json(
        {
          session: {
            ...session,
            messages: [],
            memorySnapshot: JSON.parse(session.memorySnapshot || '[]'),
            skillsUsed: [],
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
