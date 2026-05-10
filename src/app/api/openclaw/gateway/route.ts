import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

export async function GET() {
  try {
    const gateways = await db.openClawGateway.findMany({
      where: { organizationId: ORGANIZATION_ID },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = gateways.map((gw) => ({
      ...gw,
      config: gw.config ? JSON.parse(gw.config) : null,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to fetch gateway:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gateway' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Find the existing gateway for this org
    const existing = await db.openClawGateway.findFirst({
      where: { organizationId: ORGANIZATION_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Gateway not found. Create one first.' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'status',
      'bindHost',
      'bindPort',
      'uptime',
      'connectedClients',
      'activeChannels',
      'totalMessages',
      'version',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.config !== undefined) {
      updateData.config = JSON.stringify(body.config);
    }
    if (body.lastHealthCheck !== undefined) {
      updateData.lastHealthCheck = new Date(body.lastHealthCheck);
    }

    const gateway = await db.openClawGateway.update({
      where: { id: existing.id },
      data: updateData,
    });

    return NextResponse.json({
      ...gateway,
      config: gateway.config ? JSON.parse(gateway.config) : null,
    });
  } catch (error) {
    console.error('Failed to update gateway:', error);
    return NextResponse.json(
      { error: 'Failed to update gateway' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body as { action: 'start' | 'stop' | 'restart' };

    if (!action || !['start', 'stop', 'restart'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be one of: start, stop, restart' },
        { status: 400 }
      );
    }

    const existing = await db.openClawGateway.findFirst({
      where: { organizationId: ORGANIZATION_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Gateway not found. Create one first.' },
        { status: 404 }
      );
    }

    let newStatus: string;
    let message: string;

    switch (action) {
      case 'start':
        if (existing.status === 'running') {
          return NextResponse.json(
            { error: 'Gateway is already running' },
            { status: 400 }
          );
        }
        newStatus = 'running';
        message = 'Gateway started successfully';
        break;
      case 'stop':
        if (existing.status === 'stopped') {
          return NextResponse.json(
            { error: 'Gateway is already stopped' },
            { status: 400 }
          );
        }
        newStatus = 'stopped';
        message = 'Gateway stopped successfully';
        break;
      case 'restart':
        newStatus = 'running';
        message = 'Gateway restarted successfully';
        break;
    }

    const gateway = await db.openClawGateway.update({
      where: { id: existing.id },
      data: {
        status: newStatus,
        lastHealthCheck: new Date(),
        ...(action === 'start' || action === 'restart'
          ? { connectedClients: 0, activeChannels: 0 }
          : { connectedClients: 0, activeChannels: 0, uptime: 0 }),
      },
    });

    return NextResponse.json({
      message,
      gateway: {
        ...gateway,
        config: gateway.config ? JSON.parse(gateway.config) : null,
      },
    });
  } catch (error) {
    console.error('Failed to perform gateway action:', error);
    return NextResponse.json(
      { error: 'Failed to perform gateway action' },
      { status: 500 }
    );
  }
}
