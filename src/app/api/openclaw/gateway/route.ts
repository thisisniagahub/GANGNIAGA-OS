import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const ORGANIZATION_ID = 'org1';
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw';

// ─── Helper: Call OpenClaw CLI ──────────────────────────────────────────────

async function openclawCLI(...args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const { stdout, stderr } = await execFileAsync(OPENCLAW_BIN, args, {
      timeout: 30000,
      env: { ...process.env, HOME: process.env.HOME || '/root' },
    });
    return { stdout, stderr, exitCode: 0 };
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; code?: number };
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.code || 1,
    };
  }
}

// ─── Helper: Check real Gateway status ───────────────────────────────────────

async function getRealGatewayStatus() {
  const { stdout, exitCode } = await openclawCLI('status', '--json');
  if (exitCode !== 0) {
    return { reachable: false, raw: null };
  }
  try {
    const data = JSON.parse(stdout);
    return { reachable: true, raw: data };
  } catch {
    return { reachable: false, raw: null };
  }
}

// ─── Helper: Map Supabase row to camelCase ──────────────────────────────────

function mapGatewayRow(gw: Record<string, unknown>) {
  return {
    id: gw.id,
    status: gw.status,
    bindHost: gw.bind_host,
    bindPort: gw.bind_port,
    uptime: gw.uptime,
    connectedClients: gw.connected_clients,
    activeChannels: gw.active_channels,
    totalMessages: gw.total_messages,
    lastHealthCheck: gw.last_health_check,
    version: gw.version,
    config: gw.config, // JSONB — already parsed
    organizationId: gw.organization_id,
    createdAt: gw.created_at,
    updatedAt: gw.updated_at,
  };
}

// ─── GET: Fetch gateway status (combines DB + real OpenClaw) ────────────────

export async function GET() {
  try {
    // Try to get real OpenClaw status
    const realStatus = await getRealGatewayStatus();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('openclaw_gateways')
        .select('*')
        .eq('organization_id', ORGANIZATION_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching gateway:', error);
        return NextResponse.json(
          { error: 'Failed to fetch gateway' },
          { status: 500 }
        );
      }

      const parsed = (data || []).map((gw: Record<string, unknown>) => ({
        ...mapGatewayRow(gw),
        _realGateway: realStatus.reachable
          ? {
              reachable: true,
              version: realStatus.raw?.version || null,
              channels: realStatus.raw?.channels || [],
              sessions: realStatus.raw?.sessions || [],
            }
          : { reachable: false },
      }));

      return NextResponse.json(parsed);
    } else if (db) {
      const gateways = await db.openClawGateway.findMany({
        where: { organizationId: ORGANIZATION_ID },
        orderBy: { createdAt: 'desc' },
      });

      const parsed = gateways.map((gw) => ({
        ...gw,
        config: gw.config ? JSON.parse(gw.config) : null,
        _realGateway: realStatus.reachable
          ? {
              reachable: true,
              version: realStatus.raw?.version || null,
              channels: realStatus.raw?.channels || [],
              sessions: realStatus.raw?.sessions || [],
            }
          : { reachable: false },
      }));

      return NextResponse.json(parsed);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Failed to fetch gateway:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gateway' },
      { status: 500 }
    );
  }
}

// ─── PATCH: Update gateway config ───────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Find existing gateway
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_gateways')
        .select('id')
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Gateway not found. Create one first.' },
          { status: 404 }
        );
      }

      // Build update object with snake_case keys
      const updateData: Record<string, unknown> = {};
      const allowedFields: Record<string, string> = {
        status: 'status',
        bindHost: 'bind_host',
        bindPort: 'bind_port',
        uptime: 'uptime',
        connectedClients: 'connected_clients',
        activeChannels: 'active_channels',
        totalMessages: 'total_messages',
        version: 'version',
      };

      for (const [bodyKey, dbKey] of Object.entries(allowedFields)) {
        if (body[bodyKey] !== undefined) {
          updateData[dbKey] = body[bodyKey];
        }
      }

      if (body.config !== undefined) {
        updateData.config = body.config; // JSONB — store directly
      }
      if (body.lastHealthCheck !== undefined) {
        updateData.last_health_check = new Date(body.lastHealthCheck).toISOString();
      }

      const { data, error } = await supabase
        .from('openclaw_gateways')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating gateway:', error);
        return NextResponse.json(
          { error: 'Failed to update gateway' },
          { status: 500 }
        );
      }

      return NextResponse.json(mapGatewayRow(data as Record<string, unknown>));
    } else if (db) {
      const existing = await db.openClawGateway.findFirst({
        where: { organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Gateway not found. Create one first.' },
          { status: 404 }
        );
      }

      const updateData: Record<string, unknown> = {};
      const allowedFields = [
        'status', 'bindHost', 'bindPort', 'uptime',
        'connectedClients', 'activeChannels', 'totalMessages', 'version',
      ];

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }

      if (body.config !== undefined) {
        updateData.config = JSON.stringify(body.config);
      }
      if (body.lastHealthCheck !== undefined) {
        updateData.lastHealthCheck = new Date(body.lastHealthCheck);
      }

      const gateway = await db.openClawGateway.update({
        where: { id: existing.id },
        data: updateData,
      });

      return NextResponse.json({
        ...gateway,
        config: gateway.config ? JSON.parse(gateway.config) : null,
      });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to update gateway:', error);
    return NextResponse.json(
      { error: 'Failed to update gateway' },
      { status: 500 }
    );
  }
}

// ─── POST: Gateway actions (start/stop/restart/health) via real OpenClaw CLI ─

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body as { action: 'start' | 'stop' | 'restart' | 'health' };

    if (!action || !['start', 'stop', 'restart', 'health'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be one of: start, stop, restart, health' },
        { status: 400 }
      );
    }

    // Execute real OpenClaw CLI command
    let cliResult: { stdout: string; stderr: string; exitCode: number };
    let newStatus: string;
    let message: string;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Find existing gateway
      const { data: existing, error: fetchError } = await supabase
        .from('openclaw_gateways')
        .select('*')
        .eq('organization_id', ORGANIZATION_ID)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Gateway not found. Create one first.' },
          { status: 404 }
        );
      }

      switch (action) {
        case 'start':
          cliResult = await openclawCLI('gateway', 'run', '--port', String(existing.bind_port || 18789), '&');
          newStatus = 'running';
          message = 'Gateway start command sent. Check status for confirmation.';
          break;
        case 'stop':
          cliResult = await openclawCLI('gateway', 'stop');
          newStatus = 'stopped';
          message = 'Gateway stop command sent.';
          break;
        case 'restart':
          cliResult = await openclawCLI('gateway', 'restart');
          newStatus = 'running';
          message = 'Gateway restart command sent.';
          break;
        case 'health':
          cliResult = await openclawCLI('health');
          const isHealthy = cliResult.exitCode === 0;
          newStatus = isHealthy ? 'running' : 'error';
          message = isHealthy ? 'Gateway is healthy' : 'Gateway health check failed';
          break;
      }

      // Update DB status
      const updatePayload: Record<string, unknown> = {
        status: newStatus,
        last_health_check: new Date().toISOString(),
      };

      if (newStatus === 'stopped') {
        updatePayload.connected_clients = 0;
        updatePayload.active_channels = 0;
        updatePayload.uptime = 0;
      }

      const { data, error } = await supabase
        .from('openclaw_gateways')
        .update(updatePayload)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating gateway status:', error);
      }

      return NextResponse.json({
        message,
        cliOutput: cliResult.stdout?.slice(0, 500) || '',
        cliErrors: cliResult.stderr?.slice(0, 500) || '',
        gateway: data ? mapGatewayRow(data as Record<string, unknown>) : null,
      });
    } else if (db) {
      const existing = await db.openClawGateway.findFirst({
        where: { organizationId: ORGANIZATION_ID },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Gateway not found. Create one first.' },
          { status: 404 }
        );
      }

      switch (action) {
        case 'start':
          cliResult = await openclawCLI('gateway', 'run', '--port', String(existing.bindPort || 18789), '&');
          newStatus = 'running';
          message = 'Gateway start command sent. Check status for confirmation.';
          break;
        case 'stop':
          cliResult = await openclawCLI('gateway', 'stop');
          newStatus = 'stopped';
          message = 'Gateway stop command sent.';
          break;
        case 'restart':
          cliResult = await openclawCLI('gateway', 'restart');
          newStatus = 'running';
          message = 'Gateway restart command sent.';
          break;
        case 'health':
          cliResult = await openclawCLI('health');
          const isHealthy = cliResult.exitCode === 0;
          newStatus = isHealthy ? 'running' : 'error';
          message = isHealthy ? 'Gateway is healthy' : 'Gateway health check failed';
          break;
      }

      // Update DB status
      const gateway = await db.openClawGateway.update({
        where: { id: existing.id },
        data: {
          status: newStatus,
          lastHealthCheck: new Date(),
          ...(newStatus === 'stopped'
            ? { connectedClients: 0, activeChannels: 0, uptime: 0 }
            : {}),
        },
      });

      return NextResponse.json({
        message,
        cliOutput: cliResult.stdout?.slice(0, 500) || '',
        cliErrors: cliResult.stderr?.slice(0, 500) || '',
        gateway: {
          ...gateway,
          config: gateway.config ? JSON.parse(gateway.config) : null,
        },
      });
    }

    return NextResponse.json(
      { error: 'No database configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to perform gateway action:', error);
    return NextResponse.json(
      { error: 'Failed to perform gateway action' },
      { status: 500 }
    );
  }
}
