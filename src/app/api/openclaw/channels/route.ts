import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

export async function GET() {
  try {
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
  } catch (error) {
    console.error('Failed to create channel:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}
