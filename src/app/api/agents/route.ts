import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

/** Map a Supabase agent_session row (snake_case) to camelCase */
function mapAgentFromSupabase(a: Record<string, unknown>) {
  return {
    id: a.id as string,
    name: a.name as string,
    type: (a.type as string) || 'general',
    status: (a.status as string) || 'idle',
    tasksCompleted: (a.tasks_completed as number) ?? 0,
    lastActivity: a.last_activity as string | null,
    config: a.config as unknown ?? null,
    organizationId: a.organization_id as string,
    createdAt: a.created_at as string,
    updatedAt: a.updated_at as string,
    tasks: [],
  };
}

/** Map a Supabase agent_task row (snake_case) to camelCase */
function mapTaskFromSupabase(t: Record<string, unknown>) {
  return {
    id: t.id as string,
    sessionId: t.session_id as string,
    type: t.type as string,
    status: (t.status as string) || 'pending',
    input: t.input as string | null,
    output: t.output as string | null,
    duration: t.duration as number | null,
    createdAt: t.created_at as string,
    updatedAt: t.updated_at as string,
  };
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      const { data: agents, error } = await supabase
        .from('agent_sessions')
        .select('*, tasks:agent_tasks(*)')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const mapped = (agents || []).map((agent: Record<string, unknown>) => {
        const mapped = mapAgentFromSupabase(agent);
        const tasks = Array.isArray(agent.tasks)
          ? (agent.tasks as Record<string, unknown>[]).map(mapTaskFromSupabase)
          : [];
        // Sort tasks by createdAt desc, take 10
        tasks.sort((a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return { ...mapped, tasks: tasks.slice(0, 10) };
      });

      return NextResponse.json({ agents: mapped });
    } else if (db) {
      const agents = await db.agentSession.findMany({
        orderBy: { updatedAt: 'desc' },
        include: { tasks: { take: 10, orderBy: { createdAt: 'desc' } } },
      });

      return NextResponse.json({ agents });
    }

    return NextResponse.json({ agents: [] });
  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, config } = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      const { data, error } = await supabase
        .from('agent_sessions')
        .insert({
          name: name || 'New Agent',
          type: type || 'general',
          status: 'idle',
          config: config || null, // JSONB — store directly, no JSON.stringify
          organization_id: 'org1',
        })
        .select()
        .single();

      if (error) throw error;

      const agent = mapAgentFromSupabase(data as Record<string, unknown>);
      return NextResponse.json({ agent });
    } else if (db) {
      const agent = await db.agentSession.create({
        data: {
          name: name || 'New Agent',
          type: type || 'general',
          status: 'idle',
          config: config ? JSON.stringify(config) : null,
          organizationId: 'default',
        },
      });

      return NextResponse.json({ agent });
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
  } catch (error) {
    console.error('Agent creation error:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
