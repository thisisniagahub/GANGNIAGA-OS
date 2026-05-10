import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

export async function GET() {
  try {
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
  } catch (error) {
    console.error('Failed to update plugin:', error);
    return NextResponse.json(
      { error: 'Failed to update plugin' },
      { status: 500 }
    );
  }
}
