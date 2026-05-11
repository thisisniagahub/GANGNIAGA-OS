import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw';

async function runOpenClaw(command: string, args: string[] = []): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const { stdout, stderr } = await execFileAsync(OPENCLAW_BIN, [command, ...args], {
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

/**
 * GET /api/openclaw/cli?command=status
 * Proxies CLI commands to the real OpenClaw installation
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const command = searchParams.get('command') || 'status';
    const argStr = searchParams.get('args') || '';
    const args = argStr ? argStr.split(',') : [];

    // Only allow safe read-only commands
    const allowedCommands = ['status', 'health', 'skills', 'channels', 'doctor', 'version'];
    if (!allowedCommands.includes(command)) {
      return NextResponse.json(
        { error: `Command "${command}" not allowed. Allowed: ${allowedCommands.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await runOpenClaw(command, args);

    let parsedOutput: unknown = result.stdout;
    try {
      parsedOutput = JSON.parse(result.stdout);
    } catch {
      // Keep as string if not valid JSON
    }

    return NextResponse.json({
      command,
      args,
      exitCode: result.exitCode,
      output: parsedOutput,
      errors: result.stderr?.slice(0, 1000) || '',
    });
  } catch (error) {
    console.error('Failed to run OpenClaw CLI:', error);
    return NextResponse.json(
      { error: 'Failed to run OpenClaw CLI' },
      { status: 500 }
    );
  }
}
