import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

function mapScheduledTaskRow(t: Record<string, unknown>) {
  return {
    id: t.id,
    name: t.name,
    cronExpression: t.cron_expression,
    status: t.status,
    agentId: t.agent_id,
    prompt: t.prompt,
    channel: t.channel,
    lastRun: t.last_run,
    nextRun: t.next_run,
    runCount: t.run_count,
    organizationId: t.organization_id,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_scheduled_tasks')
        .select('*')
        .eq('organization_id', ORGANIZATION_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching scheduled tasks:', error);
        return NextResponse.json(
          { error: 'Failed to fetch scheduled tasks' },
          { status: 500 }
        );
      }

      const parsed = (data || []).map((t: Record<string, unknown>) => mapScheduledTaskRow(t));

      return NextResponse.json(parsed);
    } else if (db) {
      const tasks = await db.openClawScheduledTask.findMany({
        where: { organizationId: ORGANIZATION_ID },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(tasks);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Failed to fetch scheduled tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cronExpression, agentId, prompt, channel, status, nextRun } = body;

    if (!name || !cronExpression) {
      return NextResponse.json(
        { error: 'Name and cronExpression are required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_scheduled_tasks')
        .insert({
          name,
          cron_expression: cronExpression,
          status: status || 'active',
          agent_id: agentId || null,
          prompt: prompt || null,
          channel: channel || null,
          next_run: nextRun ? new Date(nextRun).toISOString() : null,
          organization_id: ORGANIZATION_ID,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating scheduled task:', error);
        return NextResponse.json(
          { error: 'Failed to create scheduled task' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        mapScheduledTaskRow(data as Record<string, unknown>),
        { status: 201 }
      );
    } else if (db) {
      const task = await db.openClawScheduledTask.create({
        data: {
          name,
          cronExpression,
          status: status || 'active',
          agentId: agentId || null,
          prompt: prompt || null,
          channel: channel || null,
          nextRun: nextRun ? new Date(nextRun) : null,
          organizationId: ORGANIZATION_ID,
        },
      });

      return NextResponse.json(task, { status: 201 });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to create scheduled task:', error);
    return NextResponse.json(
      { error: 'Failed to create scheduled task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, cronExpression, status, agentId, prompt, channel, lastRun, nextRun, runCount } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Task id is required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_scheduled_tasks')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Scheduled task not found' },
          { status: 404 }
        );
      }

      // Build update object with snake_case keys
      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (cronExpression !== undefined) updateData.cron_expression = cronExpression;
      if (status !== undefined) updateData.status = status;
      if (agentId !== undefined) updateData.agent_id = agentId;
      if (prompt !== undefined) updateData.prompt = prompt;
      if (channel !== undefined) updateData.channel = channel;
      if (runCount !== undefined) updateData.run_count = runCount;
      if (lastRun !== undefined) {
        updateData.last_run = new Date(lastRun).toISOString();
      }
      if (nextRun !== undefined) {
        updateData.next_run = new Date(nextRun).toISOString();
      }

      const { data, error } = await supabase
        .from('openclaw_scheduled_tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating scheduled task:', error);
        return NextResponse.json(
          { error: 'Failed to update scheduled task' },
          { status: 500 }
        );
      }

      return NextResponse.json(mapScheduledTaskRow(data as Record<string, unknown>));
    } else if (db) {
      const existing = await db.openClawScheduledTask.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Scheduled task not found' },
          { status: 404 }
        );
      }

      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (cronExpression !== undefined) updateData.cronExpression = cronExpression;
      if (status !== undefined) updateData.status = status;
      if (agentId !== undefined) updateData.agentId = agentId;
      if (prompt !== undefined) updateData.prompt = prompt;
      if (channel !== undefined) updateData.channel = channel;
      if (runCount !== undefined) updateData.runCount = runCount;
      if (lastRun !== undefined) {
        updateData.lastRun = new Date(lastRun);
      }
      if (nextRun !== undefined) {
        updateData.nextRun = new Date(nextRun);
      }

      const task = await db.openClawScheduledTask.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json(task);
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to update scheduled task:', error);
    return NextResponse.json(
      { error: 'Failed to update scheduled task' },
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
        { error: 'Task id is required as query parameter' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_scheduled_tasks')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Scheduled task not found' },
          { status: 404 }
        );
      }

      const { error } = await supabase
        .from('openclaw_scheduled_tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting scheduled task:', error);
        return NextResponse.json(
          { error: 'Failed to delete scheduled task' },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'Scheduled task deleted successfully' });
    } else if (db) {
      const existing = await db.openClawScheduledTask.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Scheduled task not found' },
          { status: 404 }
        );
      }

      await db.openClawScheduledTask.delete({ where: { id } });

      return NextResponse.json({ message: 'Scheduled task deleted successfully' });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to delete scheduled task:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled task' },
      { status: 500 }
    );
  }
}
