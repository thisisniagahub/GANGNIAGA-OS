import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

function mapPluginRow(p: Record<string, unknown>) {
  return {
    id: p.id,
    name: p.name,
    version: p.version,
    description: p.description,
    author: p.author,
    capabilities: p.capabilities, // JSONB — already parsed
    status: p.status,
    source: p.source,
    installedAt: p.installed_at,
    lastUpdated: p.last_updated,
    config: p.config, // JSONB — already parsed
    organizationId: p.organization_id,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_plugins')
        .select('*')
        .eq('organization_id', ORGANIZATION_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching plugins:', error);
        return NextResponse.json(
          { error: 'Failed to fetch plugins' },
          { status: 500 }
        );
      }

      const parsed = (data || []).map((p: Record<string, unknown>) => ({
        ...mapPluginRow(p),
        capabilities: p.capabilities || [],
        config: p.config || null,
      }));

      return NextResponse.json(parsed);
    } else if (db) {
      const plugins = await db.openClawPlugin.findMany({
        where: { organizationId: ORGANIZATION_ID },
        orderBy: { createdAt: 'desc' },
      });

      const parsed = plugins.map((p) => ({
        ...p,
        capabilities: p.capabilities ? JSON.parse(p.capabilities) : [],
        config: p.config ? JSON.parse(p.config) : null,
      }));

      return NextResponse.json(parsed);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Failed to fetch plugins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plugins' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, capabilities, config, name, version, description, author, source } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Plugin id is required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_plugins')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Plugin not found' },
          { status: 404 }
        );
      }

      // Build update object with snake_case keys
      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (version !== undefined) updateData.version = version;
      if (description !== undefined) updateData.description = description;
      if (author !== undefined) updateData.author = author;
      if (source !== undefined) updateData.source = source;
      if (status !== undefined) {
        updateData.status = status;
        // Set installedAt when status changes to installed/enabled
        if (['installed', 'enabled'].includes(status) && !existing.installed_at) {
          updateData.installed_at = new Date().toISOString();
        }
      }
      if (capabilities !== undefined) {
        updateData.capabilities = capabilities; // JSONB — store directly
      }
      if (config !== undefined) {
        updateData.config = config; // JSONB — store directly
      }
      updateData.last_updated = new Date().toISOString();

      const { data, error } = await supabase
        .from('openclaw_plugins')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating plugin:', error);
        return NextResponse.json(
          { error: 'Failed to update plugin' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ...mapPluginRow(data as Record<string, unknown>),
        capabilities: (data as Record<string, unknown>).capabilities || [],
        config: (data as Record<string, unknown>).config || null,
      });
    } else if (db) {
      const existing = await db.openClawPlugin.findFirst({
        where: { id, organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Plugin not found' },
          { status: 404 }
        );
      }

      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (version !== undefined) updateData.version = version;
      if (description !== undefined) updateData.description = description;
      if (author !== undefined) updateData.author = author;
      if (source !== undefined) updateData.source = source;
      if (status !== undefined) {
        updateData.status = status;
        // Set installedAt when status changes to installed/enabled
        if (['installed', 'enabled'].includes(status) && !existing.installedAt) {
          updateData.installedAt = new Date();
        }
      }
      if (capabilities !== undefined) {
        updateData.capabilities = JSON.stringify(capabilities);
      }
      if (config !== undefined) {
        updateData.config = JSON.stringify(config);
      }
      updateData.lastUpdated = new Date();

      const plugin = await db.openClawPlugin.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        ...plugin,
        capabilities: plugin.capabilities ? JSON.parse(plugin.capabilities) : [],
        config: plugin.config ? JSON.parse(plugin.config) : null,
      });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to update plugin:', error);
    return NextResponse.json(
      { error: 'Failed to update plugin' },
      { status: 500 }
    );
  }
}
