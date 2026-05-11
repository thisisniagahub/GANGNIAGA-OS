import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await db.chatSession.findFirst({
      where: { id, organizationId: ORG_ID },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      session: {
        ...session,
        messages: JSON.parse(session.messages),
        memorySnapshot: session.memorySnapshot ? JSON.parse(session.memorySnapshot) : null,
        soulSnapshot: session.soulSnapshot ? JSON.parse(session.soulSnapshot) : null,
        skillsUsed: session.skillsUsed ? JSON.parse(session.skillsUsed) : [],
      },
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, status, addMessage } = body;

    const existing = await db.chatSession.findFirst({
      where: { id, organizationId: ORG_ID },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;

    // Add a message to the session
    if (addMessage) {
      const messages = JSON.parse(existing.messages);
      messages.push({
        id: `msg_${Date.now()}`,
        ...addMessage,
        timestamp: new Date().toISOString(),
      });
      updateData.messages = JSON.stringify(messages);
    }

    const session = await db.chatSession.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      session: {
        ...session,
        messages: JSON.parse(session.messages),
        memorySnapshot: session.memorySnapshot ? JSON.parse(session.memorySnapshot) : null,
        soulSnapshot: session.soulSnapshot ? JSON.parse(session.soulSnapshot) : null,
        skillsUsed: session.skillsUsed ? JSON.parse(session.skillsUsed) : [],
      },
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}
