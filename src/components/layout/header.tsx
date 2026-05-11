'use client';

import { useSyncExternalStore } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Sparkles, Search, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

const moduleTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Business Intelligence & KPI Overview' },
  'business-plans': { title: 'Business Plans', subtitle: 'AI-Powered Business Plan Intelligence' },
  financials: { title: 'Financials', subtitle: 'Forecasting Engine & Financial Analysis' },
  agents: { title: 'Agent Console', subtitle: 'AI Agent Control Center' },
  workflows: { title: 'Workflows', subtitle: 'Automation & Workflow Engine' },
  memory: { title: 'Memory Engine', subtitle: 'Persistent Organizational Intelligence' },
  reports: { title: 'Reports', subtitle: 'Reporting & Export Engine' },
  settings: { title: 'Settings', subtitle: 'Organization & User Configuration' },
  'idea-canvas': { title: 'Idea Canvas', subtitle: 'Idea Validation Engine' },
  'plan-review': { title: 'Plan Review', subtitle: 'Lender Persona Analysis' },
  'pitch-deck': { title: 'Pitch Deck', subtitle: 'Dynamic Deck Orchestrator' },
  research: { title: 'Research Agent', subtitle: 'Citation & Source Verification' },
  'plan-actuals': { title: 'Plan vs Actuals', subtitle: 'Variance Tracking System' },
  openclaw: { title: 'OpenClaw Gateway', subtitle: 'Multi-Channel Integration' },
};

export default function Header() {
  const { activeModule, toggleCopilot, mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const moduleInfo = moduleTitles[activeModule] || { title: 'Dashboard', subtitle: '' };

  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-3 md:px-6 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger menu — visible on mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <h2 className="font-semibold text-sm truncate">{moduleInfo.title}</h2>
          <p className="text-[11px] text-muted-foreground truncate hidden sm:block">{moduleInfo.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Search + Command Palette Hint — icon-only on mobile, full on desktop */}
        <Button variant="outline" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground border-border/50 bg-card/40">
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs hidden sm:inline">Search...</span>
          <kbd className="pointer-events-none ml-1 inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/60 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground hidden md:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Theme Toggle — hidden on very small screens */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {mounted ? (theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <Sun className="h-4 w-4" />}
        </Button>

        {/* Notifications — hidden on very small screens */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground relative hidden sm:inline-flex">
          <Bell className="h-4 w-4" />
          <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>

        {/* AI Copilot */}
        <Button
          onClick={toggleCopilot}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs font-medium hidden sm:inline">AI</span>
        </Button>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 ml-0 md:ml-1">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                  GN
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">GangNiaga User</span>
                <span className="text-xs text-muted-foreground">admin@gangniaga.ai</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Organization</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
