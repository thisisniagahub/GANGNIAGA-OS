import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

export async function GET() {
  try {
    // Get all memory entries
    const memories = await db.agentMemoryV2.findMany({
      where: { organizationId: ORG_ID, type: 'memory' },
      orderBy: { importance: 'desc' },
    });

    // Get user profile
    const userProfile = await db.agentMemoryV2.findFirst({
      where: { organizationId: ORG_ID, type: 'user_profile' },
    });

    return NextResponse.json({
      memories,
      userProfile: userProfile || null,
    });
  } catch (error) {
    console.error('Error getting memories:', error);
    return NextResponse.json({ error: 'Failed to get memories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, key, content, importance, charLimit, sessionId } = body;

    if (!key || !content) {
      return NextResponse.json(
        { error: 'key and content are required' },
        { status: 400 }
      );
    }

    const memType = type || 'memory';
    const memImportance = Math.min(10, Math.max(1, importance || 5));
    const memCharLimit = charLimit || 500;

    // For user_profile type, upsert (only one allowed)
    if (memType === 'user_profile') {
      const existing = await db.agentMemoryV2.findFirst({
        where: { organizationId: ORG_ID, type: 'user_profile' },
      });

      if (existing) {
        const updated = await db.agentMemoryV2.update({
          where: { id: existing.id },
          data: {
            key,
            content: content.substring(0, memCharLimit),
            importance: memImportance,
            charLimit: memCharLimit,
            sessionId: sessionId || null,
          },
        });
        return NextResponse.json({ memory: updated });
      }
    }

    // For memory type, check if key already exists
    const existingMemory = await db.agentMemoryV2.findFirst({
      where: { key, organizationId: ORG_ID, type: memType },
    });

    if (existingMemory) {
      // Update existing
      const updated = await db.agentMemoryV2.update({
        where: { id: existingMemory.id },
        data: {
          content: content.substring(0, memCharLimit),
          importance: memImportance,
          charLimit: memCharLimit,
          sessionId: sessionId || null,
        },
      });
      return NextResponse.json({ memory: updated });
    }

    // Create new
    const memory = await db.agentMemoryV2.create({
      data: {
        type: memType,
        key,
        content: content.substring(0, memCharLimit),
        importance: memImportance,
        charLimit: memCharLimit,
        sessionId: sessionId || null,
        organizationId: ORG_ID,
      },
    });

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating memory:', error);
    return NextResponse.json({ error: 'Failed to create/update memory' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 });
    }

    const existing = await db.agentMemoryV2.findFirst({
      where: { id, organizationId: ORG_ID },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Memory entry not found' }, { status: 404 });
    }

    await db.agentMemoryV2.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}
