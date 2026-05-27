'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Cpu, Database, Brain, GitFork, ArrowLeft, Terminal } from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const docItems: SidebarItem[] = [
  { label: 'Pengenalan & Quickstart', href: '/docs', icon: BookOpen },
  { label: 'Tutorial & Ciri-Ciri', href: '/docs/features-and-tutorials', icon: BookOpen },
  { label: 'Senibina & Zustand', href: '/docs/architecture', icon: GitFork },
  { label: 'Closed-Loop Skills', href: '/docs/skills', icon: Brain },
  { label: 'API & Skema DB', href: '/docs/api-and-db', icon: Database },
  { label: 'Integrasi MCP & Skrip', href: '/docs/custom-tools', icon: Cpu },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#04060a] text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Glow effects background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header */}
      <header className="h-16 border-b border-neutral-900 bg-[#04060a]/70 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-400 border border-neutral-800 hover:border-emerald-500/20 bg-neutral-950/50 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke App
          </Link>
          <div className="h-4 w-px bg-neutral-800" />
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-500" />
            <span className="font-bold text-sm tracking-tight text-white">GangNiaga Docs</span>
            <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full text-emerald-500">v1.0</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          Inspirasi Reka Bentuk: <span className="text-neutral-300 font-medium">Nous Hermes Agent Docs</span>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto flex z-10">
        {/* Left Docs Sidebar */}
        <aside className="w-64 border-r border-neutral-900 hidden md:block shrink-0 p-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-3 px-2">Dokumentasi Teras</h4>
              <nav className="space-y-1">
                {docItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-neutral-900/50 border border-transparent'
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-1 h-3 rounded-r-full bg-emerald-500" />
                      )}
                      <Icon className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-foreground')} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 px-6 md:px-12 py-10 overflow-y-auto max-w-[900px]">
          {children}
        </main>
      </div>
    </div>
  );
}
