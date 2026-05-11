import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

export async function GET() {
  try {
    const sessions = await db.chatSession.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { updatedAt: 'desc' },
    });

    // Parse JSON fields for each session
    const parsed = sessions.map((session) => ({
      ...session,
      messages: JSON.parse(session.messages),
      memorySnapshot: session.memorySnapshot ? JSON.parse(session.memorySnapshot) : null,
      soulSnapshot: session.soulSnapshot ? JSON.parse(session.soulSnapshot) : null,
      skillsUsed: session.skillsUsed ? JSON.parse(session.skillsUsed) : [],
    }));

    return NextResponse.json({ sessions: parsed });
  } catch (error) {
    console.error('Error listing sessions:', error);
    return NextResponse.json({ error: 'Failed to list sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, platformSessionId, title } = body;

    // Get current memory snapshot for this org
    const memories = await db.agentMemoryV2.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { importance: 'desc' },
    });

    const memorySnapshot = JSON.stringify(
      memories.map((m) => ({ key: m.key, content: m.content, type: m.type, importance: m.importance }))
    );

    const session = await db.chatSession.create({
      data: {
        title: title || null,
        platform: platform || 'web',
        platformSessionId: platformSessionId || null,
        messages: JSON.stringify([]),
        memorySnapshot,
        soulSnapshot: null,
        skillsUsed: JSON.stringify([]),
        status: 'active',
        organizationId: ORG_ID,
      },
    });

    return NextResponse.json(
      {
        session: {
          ...session,
          messages: [],
          memorySnapshot: JSON.parse(session.memorySnapshot || '[]'),
          skillsUsed: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
