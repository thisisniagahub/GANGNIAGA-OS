import { NextRequest, NextResponse } from 'next/server';
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

// ─── GET: Fetch gateway status (combines DB + real OpenClaw) ────────────────

export async function GET() {
  try {
    const gateways = await db.openClawGateway.findMany({
      where: { organizationId: ORGANIZATION_ID },
      orderBy: { createdAt: 'desc' },
    });

    // Try to get real OpenClaw status
    const realStatus = await getRealGatewayStatus();

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

    const existing = await db.openClawGateway.findFirst({
      where: { organizationId: ORGANIZATION_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Gateway not found. Create one first.' },
        { status: 404 }
      );
    }

    // Execute real OpenClaw CLI command
    let cliResult: { stdout: string; stderr: string; exitCode: number };
    let newStatus: string;
    let message: string;

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
  } catch (error) {
    console.error('Failed to perform gateway action:', error);
    return NextResponse.json(
      { error: 'Failed to perform gateway action' },
      { status: 500 }
    );
  }
}
