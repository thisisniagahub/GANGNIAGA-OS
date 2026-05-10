import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

export async function GET() {
  try {
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
  } catch (error) {
    console.error('Failed to update delegate:', error);
    return NextResponse.json(
      { error: 'Failed to update delegate' },
      { status: 500 }
    );
  }
}
