import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { AlertCircle, FileText } from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function DocsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];
  const slug = slugParts.length > 0 ? slugParts[0] : 'index';

  // Map slugs to physical files under docs/
  const allowedSlugs = ['index', 'features-and-tutorials', 'architecture', 'skills', 'api-and-db', 'custom-tools'];
  if (!allowedSlugs.includes(slug)) {
    notFound();
  }

  const filePath = path.join(process.cwd(), 'docs', `${slug}.md`);

  let content = '';
  try {
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf8');
    } else {
      notFound();
    }
  } catch (error) {
    console.error('Failed to read doc file:', error);
    notFound();
  }

  // Simple frontmatter stripper
  const stripFrontmatter = (md: string) => {
    if (md.startsWith('---')) {
      const parts = md.split('---');
      if (parts.length >= 3) {
        return parts.slice(2).join('---').trim();
      }
    }
    return md;
  };

  const cleanContent = stripFrontmatter(content);

  return (
    <article className="prose prose-invert prose-emerald max-w-none">
      {/* Title Header area */}
      <div className="mb-8 pb-6 border-b border-neutral-900">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
          <FileText className="h-3.5 w-3.5" />
          <span>Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
          {slug === 'index' && 'Pengenalan & Quickstart'}
          {slug === 'features-and-tutorials' && 'Panduan Penggunaan & Tutorial Ciri-Ciri'}
          {slug === 'architecture' && 'Senibina & Reka Bentuk Sistem'}
          {slug === 'skills' && 'Sistem Kemahiran Autonomi (Skills Hub)'}
          {slug === 'api-and-db' && 'API & Model Pangkalan Data'}
          {slug === 'custom-tools' && 'Integrasi MCP & Alatan Khas'}
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          File source: <code className="text-emerald-500/80 font-mono">docs/{slug}.md</code>
        </p>
      </div>

      {/* React Markdown renderer with custom Tailwind/Obsidian classes */}
      <div className="docs-content space-y-6 text-sm text-neutral-300 leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h2 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2 border-l-2 border-emerald-500 pl-3">
                {children}
              </h2>
            ),
            h2: ({ children }) => (
              <h3 className="text-lg font-bold text-neutral-100 mt-6 mb-3">
                {children}
              </h3>
            ),
            h3: ({ children }) => (
              <h4 className="text-base font-semibold text-neutral-200 mt-4 mb-2">
                {children}
              </h4>
            ),
            p: ({ children }) => <p className="mb-4 text-neutral-300">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-neutral-300">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-neutral-300">{children}</ol>,
            li: ({ children }) => <li className="pl-1">{children}</li>,
            code: ({ className, children }) => {
              const match = /language-(\w+)/.exec(className || '');
              const inline = !match;
              if (inline) {
                return (
                  <code className="bg-neutral-900 border border-neutral-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-xs font-medium">
                    {children}
                  </code>
                );
              }
              return (
                <div className="relative my-4 group">
                  <div className="absolute right-3 top-3 text-[10px] font-mono text-muted-foreground/60 select-none uppercase">
                    {match[1]}
                  </div>
                  <pre className="bg-[#020306] border border-neutral-900 text-neutral-200 p-4 rounded-xl overflow-x-auto font-mono text-xs leading-normal">
                    <code>{children}</code>
                  </pre>
                </div>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 border border-neutral-900 rounded-xl">
                <table className="min-w-full divide-y divide-neutral-900 text-xs text-left bg-neutral-950/20">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-neutral-950/50 text-neutral-300 uppercase font-semibold">{children}</thead>,
            tbody: ({ children }) => <tbody className="divide-y divide-neutral-900">{children}</tbody>,
            tr: ({ children }) => <tr className="hover:bg-neutral-900/10 transition-colors">{children}</tr>,
            th: ({ children }) => <th className="px-4 py-3">{children}</th>,
            td: ({ children }) => <td className="px-4 py-3 text-neutral-300">{children}</td>,
            blockquote: ({ children }) => (
              <div className="my-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex gap-3 text-xs leading-normal">
                <AlertCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                <div className="font-medium italic">{children}</div>
              </div>
            ),
          }}
        >
          {cleanContent}
        </ReactMarkdown>
      </div>
    </article>
  );
}
