import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';
import { getLocalSkills, getLocalSkillBySlug } from '@/lib/skills-loader';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // --- LEVEL 1: Retrieve Full Skill Detail by Slug ---
    if (slug) {
      // 1. Try local file registry first
      const localSkill = await getLocalSkillBySlug(slug);
      if (localSkill) {
        return NextResponse.json({ skill: localSkill });
      }

      // 2. Try Database (Supabase / Prisma)
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseServer();
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('slug', slug)
          .eq('organization_id', ORG_ID)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          return NextResponse.json({ skill: mapSkillFromSupabase(data) });
        }
      } else if (db) {
        const skill = await db.skill.findUnique({
          where: { slug },
        });

        if (skill && skill.organizationId === ORG_ID) {
          return NextResponse.json({
            skill: {
              ...skill,
              tags: skill.tags ? JSON.parse(skill.tags) : [],
            },
          });
        }
      }

      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // --- LEVEL 0: Compile Complete Skills Metadata list ---
    // 1. Load local filesystem skills (strip 'content' for Level 0 list view payload optimization)
    const rawLocalSkills = await getLocalSkills();
    const localSkills = rawLocalSkills.map(({ content, ...rest }) => ({
      ...rest,
      content: '', // Omitted for Level 0 list view
    }));

    // 2. Load database skills
    let dbSkills: any[] = [];
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('organization_id', ORG_ID)
        .order('category')
        .order('name');

      if (error) throw error;
      dbSkills = (data || []).map(mapSkillFromSupabase).map(({ content, ...rest }) => ({
        ...rest,
        content: '', // Omitted for Level 0
      }));
    } else if (db) {
      const skills = await db.skill.findMany({
        where: { organizationId: ORG_ID },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });

      dbSkills = skills.map((skill) => ({
        ...skill,
        tags: skill.tags ? JSON.parse(skill.tags) : [],
        content: '', // Omitted for Level 0
      }));
    }

    // 3. Combine list & deduplicate by slug (DB skills override/override local skills if conflict occurs)
    const combinedMap = new Map<string, any>();
    
    // Add local skills first
    for (const skill of localSkills) {
      combinedMap.set(skill.slug, skill);
    }
    // Database skills override local ones
    for (const skill of dbSkills) {
      combinedMap.set(skill.slug, skill);
    }

    const finalSkills = Array.from(combinedMap.values());

    return NextResponse.json({ skills: finalSkills });
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
          tags: tags || null,
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
