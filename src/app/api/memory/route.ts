import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

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

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Get all memory entries
      const { data: memData, error: memError } = await supabase
        .from('agent_memory_v2')
        .select('*')
        .eq('organization_id', ORG_ID)
        .eq('type', 'memory')
        .order('importance', { ascending: false });

      if (memError) throw memError;

      const memories = (memData || []).map(mapMemoryFromSupabase);

      // Get user profile
      const { data: profileData } = await supabase
        .from('agent_memory_v2')
        .select('*')
        .eq('organization_id', ORG_ID)
        .eq('type', 'user_profile')
        .maybeSingle();

      const userProfile = profileData ? mapMemoryFromSupabase(profileData as Record<string, unknown>) : null;

      return NextResponse.json({ memories, userProfile });
    } else if (db) {
      // Get all memory entries
      const memories = await db.agentMemoryV2.findMany({
        where: { organizationId: ORG_ID, type: 'memory' },
        orderBy: { importance: 'desc' },
      });

      // Get user profile
      const userProfile = await db.agentMemoryV2.findFirst({
        where: { organizationId: ORG_ID, type: 'user_profile' },
      });

      return NextResponse.json({
        memories,
        userProfile: userProfile || null,
      });
    }

    return NextResponse.json({ memories: [], userProfile: null });
  } catch (error) {
    console.error('Error getting memories:', error);
    return NextResponse.json({ error: 'Failed to get memories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, key, content, importance, charLimit, sessionId } = body;

    if (!key || !content) {
      return NextResponse.json(
        { error: 'key and content are required' },
        { status: 400 }
      );
    }

    const memType = type || 'memory';
    const memImportance = Math.min(10, Math.max(1, importance || 5));
    const memCharLimit = charLimit || 500;
    const truncatedContent = content.substring(0, memCharLimit);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // For user_profile type, upsert (only one allowed)
      if (memType === 'user_profile') {
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
              key,
              content: truncatedContent,
              importance: memImportance,
              char_limit: memCharLimit,
              session_id: sessionId || null,
            })
            .eq('id', (existing as Record<string, unknown>).id as string)
            .select()
            .single();

          if (error) throw error;
          return NextResponse.json({ memory: mapMemoryFromSupabase(data as Record<string, unknown>) });
        }
      }

      // For memory type, check if key already exists
      const { data: existingMemory } = await supabase
        .from('agent_memory_v2')
        .select('*')
        .eq('key', key)
        .eq('organization_id', ORG_ID)
        .eq('type', memType)
        .maybeSingle();

      if (existingMemory) {
        // Update existing
        const { data, error } = await supabase
          .from('agent_memory_v2')
          .update({
            content: truncatedContent,
            importance: memImportance,
            char_limit: memCharLimit,
            session_id: sessionId || null,
          })
          .eq('id', (existingMemory as Record<string, unknown>).id as string)
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ memory: mapMemoryFromSupabase(data as Record<string, unknown>) });
      }

      // Create new
      const { data, error } = await supabase
        .from('agent_memory_v2')
        .insert({
          type: memType,
          key,
          content: truncatedContent,
          importance: memImportance,
          char_limit: memCharLimit,
          session_id: sessionId || null,
          organization_id: ORG_ID,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ memory: mapMemoryFromSupabase(data as Record<string, unknown>) }, { status: 201 });
    } else if (db) {
      // For user_profile type, upsert (only one allowed)
      if (memType === 'user_profile') {
        const existing = await db.agentMemoryV2.findFirst({
          where: { organizationId: ORG_ID, type: 'user_profile' },
        });

        if (existing) {
          const updated = await db.agentMemoryV2.update({
            where: { id: existing.id },
            data: {
              key,
              content: truncatedContent,
              importance: memImportance,
              charLimit: memCharLimit,
              sessionId: sessionId || null,
            },
          });
          return NextResponse.json({ memory: updated });
        }
      }

      // For memory type, check if key already exists
      const existingMemory = await db.agentMemoryV2.findFirst({
        where: { key, organizationId: ORG_ID, type: memType },
      });

      if (existingMemory) {
        // Update existing
        const updated = await db.agentMemoryV2.update({
          where: { id: existingMemory.id },
          data: {
            content: truncatedContent,
            importance: memImportance,
            charLimit: memCharLimit,
            sessionId: sessionId || null,
          },
        });
        return NextResponse.json({ memory: updated });
      }

      // Create new
      const memory = await db.agentMemoryV2.create({
        data: {
          type: memType,
          key,
          content: truncatedContent,
          importance: memImportance,
          charLimit: memCharLimit,
          sessionId: sessionId || null,
          organizationId: ORG_ID,
        },
      });

      return NextResponse.json({ memory }, { status: 201 });
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
  } catch (error) {
    console.error('Error creating/updating memory:', error);
    return NextResponse.json({ error: 'Failed to create/update memory' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('agent_memory_v2')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORG_ID)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!existing) {
        return NextResponse.json({ error: 'Memory entry not found' }, { status: 404 });
      }

      const { error } = await supabase.from('agent_memory_v2').delete().eq('id', id);
      if (error) throw error;

      return NextResponse.json({ success: true });
    } else if (db) {
      const existing = await db.agentMemoryV2.findFirst({
        where: { id, organizationId: ORG_ID },
      });

      if (!existing) {
        return NextResponse.json({ error: 'Memory entry not found' }, { status: 404 });
      }

      await db.agentMemoryV2.delete({ where: { id } });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}
