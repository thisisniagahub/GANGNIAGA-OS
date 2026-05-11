import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skill = await db.skill.findFirst({
      where: { id, organizationId: ORG_ID },
    });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({
      skill: {
        ...skill,
        tags: skill.tags ? JSON.parse(skill.tags) : [],
      },
    });
  } catch (error) {
    console.error('Error getting skill:', error);
    return NextResponse.json({ error: 'Failed to get skill' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, content, category, triggerPhrase, tags, autoLearn, status, version } = body;

    const existing = await db.skill.findFirst({
      where: { id, organizationId: ORG_ID },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // If name is changing, regenerate slug
    let slug = existing.slug;
    if (name && name !== existing.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Check for slug conflict
      const conflict = await db.skill.findFirst({
        where: { slug, organizationId: ORG_ID, id: { not: id } },
      });
      if (conflict) {
        return NextResponse.json(
          { error: `A skill with slug "${slug}" already exists` },
          { status: 409 }
        );
      }
    }

    const skill = await db.skill.update({
      where: { id },
      data: {
        ...(name !== undefined && { name, slug }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(triggerPhrase !== undefined && { triggerPhrase }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(autoLearn !== undefined && { autoLearn }),
        ...(status !== undefined && { status }),
        ...(version !== undefined && { version }),
      },
    });

    return NextResponse.json({
      skill: {
        ...skill,
        tags: skill.tags ? JSON.parse(skill.tags) : [],
      },
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.skill.findFirst({
      where: { id, organizationId: ORG_ID },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await db.skill.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
