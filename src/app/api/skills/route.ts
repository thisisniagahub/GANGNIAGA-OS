import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

/** Map a Supabase skill row (snake_case) to camelCase for the API response */
function mapSkillFromSupabase(s: Record<string, unknown>) {
  return {
    id: s.id as string,
    name: s.name as string,
    slug: s.slug as string,
    description: s.description as string,
    version: (s.version as string) || '1.0.0',
    category: (s.category as string) || 'general',
    content: s.content as string,
    triggerPhrase: (s.trigger_phrase as string) ?? null,
    tags: Array.isArray(s.tags) ? s.tags : [],
    usageCount: (s.usage_count as number) ?? 0,
    lastUsedAt: s.last_used_at as string | null,
    source: (s.source as string) || 'user_created',
    status: (s.status as string) || 'active',
    autoLearn: (s.auto_learn as boolean) ?? false,
    organizationId: s.organization_id as string,
    createdAt: s.created_at as string,
    updatedAt: s.updated_at as string,
  };
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('organization_id', ORG_ID)
        .order('category')
        .order('name');

      if (error) throw error;

      const skills = (data || []).map(mapSkillFromSupabase);
      return NextResponse.json({ skills });
    } else if (db) {
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
    }

    return NextResponse.json({ skills: [] });
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

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check for duplicate slug
      const { data: existing } = await supabase
        .from('skills')
        .select('id')
        .eq('slug', slug)
        .eq('organization_id', ORG_ID)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: `A skill with slug "${slug}" already exists` },
          { status: 409 }
        );
      }

      const { data, error } = await supabase
        .from('skills')
        .insert({
          name,
          slug,
          description,
          content,
          category: category || 'general',
          trigger_phrase: triggerPhrase || null,
          tags: tags || null, // JSONB — store directly, no JSON.stringify
          auto_learn: autoLearn ?? false,
          source: 'user_created',
          status: 'active',
          organization_id: ORG_ID,
        })
        .select()
        .single();

      if (error) throw error;

      const skill = mapSkillFromSupabase(data as Record<string, unknown>);
      return NextResponse.json({ skill }, { status: 201 });
    } else if (db) {
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
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
