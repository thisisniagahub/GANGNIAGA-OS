import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

function mapDelegateRow(d: Record<string, unknown>) {
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    displayName: d.display_name,
    tier: d.tier,
    status: d.status,
    channels: d.channels || [], // JSONB — already parsed
    principalName: d.principal_name,
    principalEmail: d.principal_email,
    standingOrders: d.standing_orders || [], // JSONB — already parsed
    tasksCompleted: d.tasks_completed,
    lastActivity: d.last_activity,
    organizationId: d.organization_id,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_delegates')
        .select('*')
        .eq('organization_id', ORGANIZATION_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching delegates:', error);
        return NextResponse.json(
          { error: 'Failed to fetch delegates' },
          { status: 500 }
        );
      }

      const parsed = (data || []).map((d: Record<string, unknown>) => mapDelegateRow(d));

      return NextResponse.json(parsed);
    } else if (db) {
      const delegates = await db.openClawDelegate.findMany({
        where: { organizationId: ORGANIZATION_ID },
        orderBy: { createdAt: 'desc' },
      });

      const parsed = delegates.map((d) => ({
        ...d,
        channels: d.channels ? JSON.parse(d.channels) : [],
        standingOrders: d.standingOrders ? JSON.parse(d.standingOrders) : [],
      }));

      return NextResponse.json(parsed);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Failed to fetch delegates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delegates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, displayName, tier, channels, principalName, principalEmail, standingOrders } = body;

    if (!name || !email || !displayName) {
      return NextResponse.json(
        { error: 'Name, email, and displayName are required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_delegates')
        .insert({
          name,
          email,
          display_name: displayName,
          tier: tier || 'tier1_readonly',
          status: 'setup',
          channels: channels || null, // JSONB — store directly
          principal_name: principalName || null,
          principal_email: principalEmail || null,
          standing_orders: standingOrders || null, // JSONB — store directly
          organization_id: ORGANIZATION_ID,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating delegate:', error);
        return NextResponse.json(
          { error: 'Failed to create delegate' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        mapDelegateRow(data as Record<string, unknown>),
        { status: 201 }
      );
    } else if (db) {
      const delegate = await db.openClawDelegate.create({
        data: {
          name,
          email,
          displayName,
          tier: tier || 'tier1_readonly',
          status: 'setup',
          channels: channels ? JSON.stringify(channels) : null,
          principalName: principalName || null,
          principalEmail: principalEmail || null,
          standingOrders: standingOrders ? JSON.stringify(standingOrders) : null,
          organizationId: ORGANIZATION_ID,
        },
      });

      return NextResponse.json(
        {
          ...delegate,
          channels: delegate.channels ? JSON.parse(delegate.channels) : [],
          standingOrders: delegate.standingOrders
            ? JSON.parse(delegate.standingOrders)
            : [],
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to create delegate:', error);
    return NextResponse.json(
      { error: 'Failed to create delegate' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, displayName, tier, status, channels, principalName, principalEmail, standingOrders, tasksCompleted } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Delegate id is required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_delegates')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Delegate not found' },
          { status: 404 }
        );
      }

      // Build update object with snake_case keys
      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (displayName !== undefined) updateData.display_name = displayName;
      if (tier !== undefined) updateData.tier = tier;
      if (status !== undefined) updateData.status = status;
      if (principalName !== undefined) updateData.principal_name = principalName;
      if (principalEmail !== undefined) updateData.principal_email = principalEmail;
      if (tasksCompleted !== undefined) updateData.tasks_completed = tasksCompleted;
      if (channels !== undefined) {
        updateData.channels = channels; // JSONB — store directly
      }
      if (standingOrders !== undefined) {
        updateData.standing_orders = standingOrders; // JSONB — store directly
      }

      const { data, error } = await supabase
        .from('openclaw_delegates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating delegate:', error);
        return NextResponse.json(
          { error: 'Failed to update delegate' },
          { status: 500 }
        );
      }

      return NextResponse.json(mapDelegateRow(data as Record<string, unknown>));
    } else if (db) {
      const existing = await db.openClawDelegate.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Delegate not found' },
          { status: 404 }
        );
      }

      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (displayName !== undefined) updateData.displayName = displayName;
      if (tier !== undefined) updateData.tier = tier;
      if (status !== undefined) updateData.status = status;
      if (principalName !== undefined) updateData.principalName = principalName;
      if (principalEmail !== undefined) updateData.principalEmail = principalEmail;
      if (tasksCompleted !== undefined) updateData.tasksCompleted = tasksCompleted;
      if (channels !== undefined) {
        updateData.channels = JSON.stringify(channels);
      }
      if (standingOrders !== undefined) {
        updateData.standingOrders = JSON.stringify(standingOrders);
      }

      const delegate = await db.openClawDelegate.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        ...delegate,
        channels: delegate.channels ? JSON.parse(delegate.channels) : [],
        standingOrders: delegate.standingOrders
          ? JSON.parse(delegate.standingOrders)
          : [],
      });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to update delegate:', error);
    return NextResponse.json(
      { error: 'Failed to update delegate' },
      { status: 500 }
    );
  }
}
