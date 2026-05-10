import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

export async function GET() {
  try {
    const tasks = await db.openClawScheduledTask.findMany({
      where: { organizationId: ORGANIZATION_ID },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tasks);
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
  } catch (error) {
    console.error('Failed to delete scheduled task:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled task' },
      { status: 500 }
    );
  }
}
