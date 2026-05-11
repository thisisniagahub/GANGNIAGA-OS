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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ORG_ID)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }

      return NextResponse.json({ skill: mapSkillFromSupabase(data as Record<string, unknown>) });
    } else if (db) {
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
    }

    return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
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

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('skills')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ORG_ID)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!existing) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }

      // If name is changing, regenerate slug
      let slug = (existing as Record<string, unknown>).slug as string;
      if (name && name !== (existing as Record<string, unknown>).name) {
        slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Check for slug conflict
        const { data: conflict } = await supabase
          .from('skills')
          .select('id')
          .eq('slug', slug)
          .eq('organization_id', ORG_ID)
          .neq('id', id)
          .maybeSingle();

        if (conflict) {
          return NextResponse.json(
            { error: `A skill with slug "${slug}" already exists` },
            { status: 409 }
          );
        }
      }

      // Build update payload — only include fields that were provided
      const updateData: Record<string, unknown> = {};
      if (name !== undefined) { updateData.name = name; updateData.slug = slug; }
      if (description !== undefined) updateData.description = description;
      if (content !== undefined) updateData.content = content;
      if (category !== undefined) updateData.category = category;
      if (triggerPhrase !== undefined) updateData.trigger_phrase = triggerPhrase;
      if (tags !== undefined) updateData.tags = tags; // JSONB — no stringify
      if (autoLearn !== undefined) updateData.auto_learn = autoLearn;
      if (status !== undefined) updateData.status = status;
      if (version !== undefined) updateData.version = version;

      const { data, error } = await supabase
        .from('skills')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ skill: mapSkillFromSupabase(data as Record<string, unknown>) });
    } else if (db) {
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
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
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

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('skills')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ORG_ID)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!existing) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }

      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;

      return NextResponse.json({ success: true });
    } else if (db) {
      const existing = await db.skill.findFirst({
        where: { id, organizationId: ORG_ID },
      });

      if (!existing) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }

      await db.skill.delete({ where: { id } });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'No database available' }, { status: 503 });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
