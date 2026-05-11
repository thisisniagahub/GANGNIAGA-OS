import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Tool definitions
const TOOLS: Record<string, { description: string; params: string[] }> = {
  edit_file: { description: 'Edit a project file using AI instruction', params: ['path', 'instruction', 'content'] },
  read_file: { description: 'Read a project file', params: ['path'] },
  list_files: { description: 'List project files', params: ['directory'] },
  search_code: { description: 'Search codebase for a query', params: ['query'] },
  run_command: { description: 'Run a shell command (safe allowlist only)', params: ['command'] },
  git_status: { description: 'Get git status', params: [] },
  git_log: { description: 'Get recent git log', params: ['count'] },
  db_schema: { description: 'Get database schema', params: [] },
  deploy: { description: 'Deploy the project', params: [] },
  analyze_code: { description: 'Analyze code for issues', params: ['path'] },
  generate_code: { description: 'Generate code from description', params: ['description', 'language'] },
};

function safePath(inputPath: string): string | null {
  const resolved = path.resolve(process.cwd(), inputPath);
  if (!resolved.startsWith(process.cwd())) return null;
  return resolved;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, params } = body as { tool: string; params?: Record<string, string> };

    if (!tool) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }

    const p = params || {};

    switch (tool) {
      case 'read_file': {
        if (!p.path) return NextResponse.json({ error: 'File path is required' }, { status: 400 });
        const filePath = safePath(p.path);
        if (!filePath) return NextResponse.json({ error: 'Access denied: path outside project' }, { status: 403 });
        if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'File not found' }, { status: 404 });
        try {
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            return NextResponse.json({ error: 'Path is a directory, not a file' }, { status: 400 });
          }
          if (stat.size > 500000) {
            return NextResponse.json({ error: 'File too large (max 500KB)' }, { status: 400 });
          }
          const content = fs.readFileSync(filePath, 'utf-8');
          const ext = path.extname(filePath).slice(1);
          return NextResponse.json({ success: true, content, path: p.path, language: ext, size: stat.size });
        } catch {
          return NextResponse.json({ error: 'Cannot read file (possibly binary)' }, { status: 400 });
        }
      }

      case 'edit_file': {
        if (!p.path || !p.content) {
          return NextResponse.json({ error: 'File path and content are required' }, { status: 400 });
        }
        const filePath = safePath(p.path);
        if (!filePath) return NextResponse.json({ error: 'Access denied: path outside project' }, { status: 403 });

        // Ensure parent directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const existed = fs.existsSync(filePath);
        const oldContent = existed ? fs.readFileSync(filePath, 'utf-8') : '';
        fs.writeFileSync(filePath, p.content, 'utf-8');

        return NextResponse.json({
          success: true,
          path: p.path,
          action: existed ? 'updated' : 'created',
          previousSize: oldContent.length,
          newSize: p.content.length,
        });
      }

      case 'list_files': {
        const dir = safePath(p.directory || 'src');
        if (!dir) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        if (!fs.existsSync(dir)) return NextResponse.json({ error: 'Directory not found' }, { status: 404 });

        const entries = fs.readdirSync(dir, { withFileTypes: true })
          .filter(d => !d.name.startsWith('.') && d.name !== 'node_modules')
          .map(d => ({
            name: d.name,
            isDirectory: d.isDirectory(),
            path: path.join(p.directory || 'src', d.name),
          }))
          .sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
          });

        return NextResponse.json({ success: true, files: entries, directory: p.directory || 'src' });
      }

      case 'search_code': {
        if (!p.query) return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        try {
          const result = execSync(
            `rg -l "${p.query.replace(/"/g, '\\"')}" --type-add 'tsx:*.tsx' --type-add 'jsx:*.jsx' -t ts -t tsx -t js -t jsx -t css -t html -t json src/ 2>/dev/null || true`,
            { cwd: process.cwd(), encoding: 'utf-8', timeout: 10000 }
          );
          const files = result.trim().split('\n').filter(Boolean).slice(0, 30);

          // Get snippet for first few files
          const snippets: Record<string, string> = {};
          for (const file of files.slice(0, 5)) {
            try {
              const snippetResult = execSync(
                `rg "${p.query.replace(/"/g, '\\"')}" -C 2 --max-count 1 "${file}" 2>/dev/null || true`,
                { cwd: process.cwd(), encoding: 'utf-8', timeout: 5000 }
              );
              snippets[file] = snippetResult.trim().slice(0, 500);
            } catch {
              snippets[file] = '';
            }
          }

          return NextResponse.json({ success: true, files, snippets, query: p.query, totalFiles: files.length });
        } catch {
          return NextResponse.json({ success: true, files: [], query: p.query, totalFiles: 0 });
        }
      }

      case 'git_status': {
        try {
          const status = execSync('git status --short', { cwd: process.cwd(), encoding: 'utf-8', timeout: 10000 });
          const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: process.cwd(), encoding: 'utf-8', timeout: 5000 }).trim();
          return NextResponse.json({ success: true, status: status.trim(), branch });
        } catch {
          return NextResponse.json({ error: 'Git not available' }, { status: 500 });
        }
      }

      case 'git_log': {
        try {
          const count = parseInt(p.count || '10', 10);
          const log = execSync(`git log --oneline -${Math.min(count, 50)}`, {
            cwd: process.cwd(), encoding: 'utf-8', timeout: 10000,
          });
          return NextResponse.json({ success: true, log: log.trim() });
        } catch {
          return NextResponse.json({ error: 'Git not available' }, { status: 500 });
        }
      }

      case 'db_schema': {
        try {
          const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
          if (!fs.existsSync(schemaPath)) {
            return NextResponse.json({ error: 'Prisma schema not found' }, { status: 404 });
          }
          const schema = fs.readFileSync(schemaPath, 'utf-8');
          return NextResponse.json({ success: true, schema });
        } catch {
          return NextResponse.json({ error: 'Cannot read schema' }, { status: 500 });
        }
      }

      case 'deploy': {
        return NextResponse.json({
          success: true,
          message: 'Deploy simulation: Project is ready for deployment. In production, this would trigger the CI/CD pipeline.',
          timestamp: new Date().toISOString(),
        });
      }

      case 'analyze_code': {
        if (!p.path) return NextResponse.json({ error: 'File path is required' }, { status: 400 });
        const filePath = safePath(p.path);
        if (!filePath) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'File not found' }, { status: 404 });

        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').length;
        const ext = path.extname(filePath).slice(1);

        // Simple analysis
        const issues: string[] = [];
        const suggestions: string[] = [];

        if (lines > 500) issues.push(`Large file (${lines} lines) — consider splitting into modules`);
        if (content.includes('console.log')) issues.push(`Contains ${content.split('console.log').length - 1} console.log statement(s) — remove for production`);
        if (content.includes('any')) issues.push(`Contains 'any' type(s) — use specific types for better safety`);
        if (content.includes('TODO') || content.includes('FIXME')) issues.push(`Contains ${((content.match(/TODO|FIXME/g) || []).length)} TODO/FIXME comment(s)`);
        if (ext === 'tsx' || ext === 'jsx') {
          if (!content.includes("'use client'") && !content.includes('"use client"')) {
            suggestions.push('Consider adding "use client" directive if this is a client component');
          }
        }
        if (!content.includes('export')) suggestions.push('No exports found — verify this is the intended structure');
        if (content.includes('useState') && !content.includes("'use client'") && !content.includes('"use client"')) {
          issues.push('Uses useState but missing "use client" directive');
        }

        return NextResponse.json({
          success: true,
          path: p.path,
          lines,
          language: ext,
          size: content.length,
          issues,
          suggestions,
        });
      }

      case 'generate_code': {
        // This is handled by the AI chat endpoint, but we provide a stub
        return NextResponse.json({
          success: true,
          message: 'Code generation is handled through the AI chat endpoint. Use the /code slash command for AI-powered code generation.',
        });
      }

      default:
        return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Tool execution failed',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    tools: Object.entries(TOOLS).map(([name, config]) => ({
      name,
      description: config.description,
      params: config.params,
    })),
  });
}
