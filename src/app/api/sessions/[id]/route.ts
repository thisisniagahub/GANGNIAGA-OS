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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ORG_ID)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const session = mapSessionFromSupabase(data as Record<string, unknown>);
      return NextResponse.json({ session });
    } else if (db) {
      const session = await db.chatSession.findFirst({
        where: { id, organizationId: ORG_ID },
      });

      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json({
        session: {
          ...session,
          messages: JSON.parse(session.messages),
          memorySnapshot: session.memorySnapshot ? JSON.parse(session.memorySnapshot) : null,
          soulSnapshot: session.soulSnapshot ? JSON.parse(session.soulSnapshot) : null,
          skillsUsed: session.skillsUsed ? JSON.parse(session.skillsUsed) : [],
        },
      });
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, status, addMessage } = body;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ORG_ID)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!existing) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const updateData: Record<string, unknown> = {};

      if (title !== undefined) updateData.title = title;
      if (status !== undefined) updateData.status = status;

      // Add a message to the session
      if (addMessage) {
        const messages: unknown[] = Array.isArray((existing as Record<string, unknown>).messages)
          ? (existing as Record<string, unknown>).messages as unknown[]
          : [];
        messages.push({
          id: `msg_${Date.now()}`,
          ...addMessage,
          timestamp: new Date().toISOString(),
        });
        updateData.messages = messages; // JSONB — store directly
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const session = mapSessionFromSupabase(data as Record<string, unknown>);
      return NextResponse.json({ session });
    } else if (db) {
      const existing = await db.chatSession.findFirst({
        where: { id, organizationId: ORG_ID },
      });

      if (!existing) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const updateData: Record<string, unknown> = {};

      if (title !== undefined) updateData.title = title;
      if (status !== undefined) updateData.status = status;

      // Add a message to the session
      if (addMessage) {
        const messages = JSON.parse(existing.messages);
        messages.push({
          id: `msg_${Date.now()}`,
          ...addMessage,
          timestamp: new Date().toISOString(),
        });
        updateData.messages = JSON.stringify(messages);
      }

      const session = await db.chatSession.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        session: {
          ...session,
          messages: JSON.parse(session.messages),
          memorySnapshot: session.memorySnapshot ? JSON.parse(session.memorySnapshot) : null,
          soulSnapshot: session.soulSnapshot ? JSON.parse(session.soulSnapshot) : null,
          skillsUsed: session.skillsUsed ? JSON.parse(session.skillsUsed) : [],
        },
      });
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}
