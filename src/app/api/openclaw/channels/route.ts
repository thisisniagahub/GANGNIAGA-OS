import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_channels')
        .select('*')
        .eq('organization_id', ORGANIZATION_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching channels:', error);
        return NextResponse.json(
          { error: 'Failed to fetch channels' },
          { status: 500 }
        );
      }

      // Map snake_case to camelCase and parse JSON fields
      const parsed = (data || []).map((ch: Record<string, unknown>) => ({
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
      }));

      return NextResponse.json(parsed);
    } else if (db) {
      const channels = await db.openClawChannel.findMany({
        where: { organizationId: ORGANIZATION_ID },
        orderBy: { createdAt: 'desc' },
      });

      // Parse JSON fields for each channel
      const parsed = channels.map((ch) => ({
        ...ch,
        config: ch.config ? JSON.parse(ch.config) : null,
      }));

      return NextResponse.json(parsed);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Failed to fetch channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, status, config, avatarUrl } = body;

    if (!type || !name) {
      return NextResponse.json(
        { error: 'Channel type and name are required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_channels')
        .insert({
          type,
          name,
          status: status || 'disconnected',
          config: config || null, // JSONB — store directly
          avatar_url: avatarUrl || null,
          organization_id: ORGANIZATION_ID,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating channel:', error);
        return NextResponse.json(
          { error: 'Failed to create channel' },
          { status: 500 }
        );
      }

      // Map snake_case to camelCase
      const channel = {
        id: data.id,
        type: data.type,
        name: data.name,
        status: data.status,
        lastMessage: data.last_message,
        lastMessageAt: data.last_message_at,
        messageCount: data.message_count,
        config: data.config, // JSONB — already parsed
        pairedAt: data.paired_at,
        avatarUrl: data.avatar_url,
        organizationId: data.organization_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return NextResponse.json(channel, { status: 201 });
    } else if (db) {
      const channel = await db.openClawChannel.create({
        data: {
          type,
          name,
          status: status || 'disconnected',
          config: config ? JSON.stringify(config) : null,
          avatarUrl: avatarUrl || null,
          organizationId: ORGANIZATION_ID,
        },
      });

      return NextResponse.json(
        {
          ...channel,
          config: channel.config ? JSON.parse(channel.config) : null,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to create channel:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}
