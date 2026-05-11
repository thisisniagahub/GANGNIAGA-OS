import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

function mapChannelRow(ch: Record<string, unknown>) {
  return {
    id: ch.id,
    type: ch.type,
    name: ch.name,
    status: ch.status,
    lastMessage: ch.last_message,
    lastMessageAt: ch.last_message_at,
    messageCount: ch.message_count,
    config: ch.config, // JSONB — already parsed
    pairedAt: ch.paired_at,
    avatarUrl: ch.avatar_url,
    organizationId: ch.organization_id,
    createdAt: ch.created_at,
    updatedAt: ch.updated_at,
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
        .from('openclaw_channels')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(mapChannelRow(data as Record<string, unknown>));
    } else if (db) {
      const channel = await db.openClawChannel.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!channel) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...channel,
        config: channel.config ? JSON.parse(channel.config) : null,
      });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to fetch channel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channel' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_channels')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      // Build update object with snake_case keys
      const updateData: Record<string, unknown> = {};
      const allowedFields: Record<string, string> = {
        type: 'type',
        name: 'name',
        status: 'status',
        lastMessage: 'last_message',
        messageCount: 'message_count',
        avatarUrl: 'avatar_url',
      };

      for (const [bodyKey, dbKey] of Object.entries(allowedFields)) {
        if (body[bodyKey] !== undefined) {
          updateData[dbKey] = body[bodyKey];
        }
      }

      if (body.config !== undefined) {
        updateData.config = body.config; // JSONB — store directly
      }
      if (body.lastMessageAt !== undefined) {
        updateData.last_message_at = new Date(body.lastMessageAt).toISOString();
      }
      if (body.pairedAt !== undefined) {
        updateData.paired_at = new Date(body.pairedAt).toISOString();
      }

      const { data, error } = await supabase
        .from('openclaw_channels')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating channel:', error);
        return NextResponse.json(
          { error: 'Failed to update channel' },
          { status: 500 }
        );
      }

      return NextResponse.json(mapChannelRow(data as Record<string, unknown>));
    } else if (db) {
      const existing = await db.openClawChannel.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      const updateData: Record<string, unknown> = {};
      const allowedFields = [
        'type',
        'name',
        'status',
        'lastMessage',
        'messageCount',
        'avatarUrl',
      ];

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }

      if (body.config !== undefined) {
        updateData.config = JSON.stringify(body.config);
      }
      if (body.lastMessageAt !== undefined) {
        updateData.lastMessageAt = new Date(body.lastMessageAt);
      }
      if (body.pairedAt !== undefined) {
        updateData.pairedAt = new Date(body.pairedAt);
      }

      const channel = await db.openClawChannel.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        ...channel,
        config: channel.config ? JSON.parse(channel.config) : null,
      });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to update channel:', error);
    return NextResponse.json(
      { error: 'Failed to update channel' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_channels')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      const { error } = await supabase
        .from('openclaw_channels')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting channel:', error);
        return NextResponse.json(
          { error: 'Failed to delete channel' },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'Channel deleted successfully' });
    } else if (db) {
      const existing = await db.openClawChannel.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      await db.openClawChannel.delete({ where: { id } });

      return NextResponse.json({ message: 'Channel deleted successfully' });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to delete channel:', error);
    return NextResponse.json(
      { error: 'Failed to delete channel' },
      { status: 500 }
    );
  }
}
