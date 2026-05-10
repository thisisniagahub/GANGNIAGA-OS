import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
  } catch (error) {
    console.error('Failed to delete channel:', error);
    return NextResponse.json(
      { error: 'Failed to delete channel' },
      { status: 500 }
    );
  }
}
