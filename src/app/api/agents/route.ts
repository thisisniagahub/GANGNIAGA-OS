import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const agents = await db.agentSession.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { tasks: { take: 10, orderBy: { createdAt: 'desc' } } },
    });

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, config } = await request.json();

    const agent = await db.agentSession.create({
      data: {
        name: name || 'New Agent',
        type: type || 'general',
        status: 'idle',
        config: config ? JSON.stringify(config) : null,
        organizationId: 'default',
      },
    });

    return NextResponse.json({ agent });
  } catch (error) {
    console.error('Agent creation error:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
