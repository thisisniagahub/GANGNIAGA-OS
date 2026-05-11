import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

function mapWebhookRow(wh: Record<string, unknown>) {
  return {
    id: wh.id,
    name: wh.name,
    url: wh.url,
    method: wh.method,
    events: wh.events || [], // JSONB — already parsed
    status: wh.status,
    lastTriggered: wh.last_triggered,
    triggerCount: wh.trigger_count,
    secret: wh.secret,
    headers: wh.headers || null, // JSONB — already parsed
    organizationId: wh.organization_id,
    createdAt: wh.created_at,
    updatedAt: wh.updated_at,
  };
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_webhooks')
        .select('*')
        .eq('organization_id', ORGANIZATION_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching webhooks:', error);
        return NextResponse.json(
          { error: 'Failed to fetch webhooks' },
          { status: 500 }
        );
      }

      const parsed = (data || []).map((wh: Record<string, unknown>) => mapWebhookRow(wh));

      return NextResponse.json(parsed);
    } else if (db) {
      const webhooks = await db.openClawWebhook.findMany({
        where: { organizationId: ORGANIZATION_ID },
        orderBy: { createdAt: 'desc' },
      });

      const parsed = webhooks.map((wh) => ({
        ...wh,
        events: wh.events ? JSON.parse(wh.events) : [],
        headers: wh.headers ? JSON.parse(wh.headers) : null,
      }));

      return NextResponse.json(parsed);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Failed to fetch webhooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, method, events, secret, headers } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_webhooks')
        .insert({
          name,
          url,
          method: method || 'POST',
          events: events || null, // JSONB — store directly
          status: 'active',
          secret: secret || null,
          headers: headers || null, // JSONB — store directly
          organization_id: ORGANIZATION_ID,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating webhook:', error);
        return NextResponse.json(
          { error: 'Failed to create webhook' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        mapWebhookRow(data as Record<string, unknown>),
        { status: 201 }
      );
    } else if (db) {
      const webhook = await db.openClawWebhook.create({
        data: {
          name,
          url,
          method: method || 'POST',
          events: events ? JSON.stringify(events) : null,
          status: 'active',
          secret: secret || null,
          headers: headers ? JSON.stringify(headers) : null,
          organizationId: ORGANIZATION_ID,
        },
      });

      return NextResponse.json(
        {
          ...webhook,
          events: webhook.events ? JSON.parse(webhook.events) : [],
          headers: webhook.headers ? JSON.parse(webhook.headers) : null,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to create webhook:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, url, method, events, status, secret, headers } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook id is required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_webhooks')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Webhook not found' },
          { status: 404 }
        );
      }

      // Build update object with snake_case keys
      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (url !== undefined) updateData.url = url;
      if (method !== undefined) updateData.method = method;
      if (status !== undefined) updateData.status = status;
      if (secret !== undefined) updateData.secret = secret;
      if (events !== undefined) {
        updateData.events = events; // JSONB — store directly
      }
      if (headers !== undefined) {
        updateData.headers = headers; // JSONB — store directly
      }

      const { data, error } = await supabase
        .from('openclaw_webhooks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating webhook:', error);
        return NextResponse.json(
          { error: 'Failed to update webhook' },
          { status: 500 }
        );
      }

      return NextResponse.json(mapWebhookRow(data as Record<string, unknown>));
    } else if (db) {
      const existing = await db.openClawWebhook.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Webhook not found' },
          { status: 404 }
        );
      }

      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (url !== undefined) updateData.url = url;
      if (method !== undefined) updateData.method = method;
      if (status !== undefined) updateData.status = status;
      if (secret !== undefined) updateData.secret = secret;
      if (events !== undefined) {
        updateData.events = JSON.stringify(events);
      }
      if (headers !== undefined) {
        updateData.headers = JSON.stringify(headers);
      }

      const webhook = await db.openClawWebhook.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        ...webhook,
        events: webhook.events ? JSON.parse(webhook.events) : [],
        headers: webhook.headers ? JSON.parse(webhook.headers) : null,
      });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to update webhook:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook id is required as query parameter' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_webhooks')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Webhook not found' },
          { status: 404 }
        );
      }

      const { error } = await supabase
        .from('openclaw_webhooks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting webhook:', error);
        return NextResponse.json(
          { error: 'Failed to delete webhook' },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'Webhook deleted successfully' });
    } else if (db) {
      const existing = await db.openClawWebhook.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Webhook not found' },
          { status: 404 }
        );
      }

      await db.openClawWebhook.delete({ where: { id } });

      return NextResponse.json({ message: 'Webhook deleted successfully' });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to delete webhook:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}
