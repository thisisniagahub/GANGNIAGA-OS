import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

export async function GET() {
  try {
    const skills = await db.skill.findMany({
      where: { organizationId: ORG_ID },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    // Parse JSON fields
    const parsed = skills.map((skill) => ({
      ...skill,
      tags: skill.tags ? JSON.parse(skill.tags) : [],
    }));

    return NextResponse.json({ skills: parsed });
  } catch (error) {
    console.error('Error listing skills:', error);
    return NextResponse.json({ error: 'Failed to list skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, content, category, triggerPhrase, tags, autoLearn } = body;

    if (!name || !description || !content) {
      return NextResponse.json(
        { error: 'name, description, and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check for duplicate slug
    const existing = await db.skill.findFirst({
      where: { slug, organizationId: ORG_ID },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A skill with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    const skill = await db.skill.create({
      data: {
        name,
        slug,
        description,
        content,
        category: category || 'general',
        triggerPhrase: triggerPhrase || null,
        tags: tags ? JSON.stringify(tags) : null,
        autoLearn: autoLearn ?? false,
        source: 'user_created',
        status: 'active',
        organizationId: ORG_ID,
      },
    });

    return NextResponse.json(
      {
        skill: {
          ...skill,
          tags: skill.tags ? JSON.parse(skill.tags) : [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
