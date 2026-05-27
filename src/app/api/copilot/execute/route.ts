import { NextRequest, NextResponse } from 'next/server';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Python code is required' }, { status: 400 });
    }

    // Scratch path inside workspace
    const tempDir = path.join(process.cwd(), 'scratch');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFile = path.join(tempDir, `exec_${Date.now()}.py`);
    fs.writeFileSync(tempFile, code, 'utf-8');

    let stdout = '';
    let stderr = '';
    let success = true;

    try {
      stdout = execFileSync('python', [tempFile], {
        cwd: process.cwd(),
        encoding: 'utf-8',
        timeout: 10000,
        env: { ...process.env } // pass environment variables safely
      });
    } catch (err: any) {
      success = false;
      stdout = err.stdout?.toString() || '';
      stderr = err.stderr?.toString() || err.message;
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }

    return NextResponse.json({
      success,
      stdout: stdout.trim(),
      stderr: stderr.trim()
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
