'use client';

import { useAppStore } from '@/lib/store';
import type { ModuleId } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  FileText,
  LineChart,
  Bot,
  Workflow,
  Brain,
  BarChart3,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ElementType;
  accent: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'text-emerald-500' },
  { id: 'business-plans', label: 'Business Plans', icon: FileText, accent: 'text-amber-500' },
  { id: 'financials', label: 'Financials', icon: LineChart, accent: 'text-teal-500' },
  { id: 'agents', label: 'Agent Console', icon: Bot, accent: 'text-cyan-500' },
  { id: 'workflows', label: 'Workflows', icon: Workflow, accent: 'text-rose-500' },
  { id: 'memory', label: 'Memory Engine', icon: Brain, accent: 'text-amber-500' },
  { id: 'reports', label: 'Reports', icon: BarChart3, accent: 'text-emerald-500' },
  { id: 'settings', label: 'Settings', icon: Settings, accent: 'text-muted-foreground' },
];

export default function Sidebar() {
  const { activeModule, setActiveModule, sidebarCollapsed, toggleSidebar, toggleCopilot } = useAppStore();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: sidebarCollapsed ? 68 : 240 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'h-screen bg-card/80 backdrop-blur-xl border-r border-border flex flex-col shrink-0 overflow-hidden',
          'relative z-40'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <h1 className="font-bold text-base tracking-tight whitespace-nowrap">GangNiaga</h1>
                <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase whitespace-nowrap">AI OS</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <ScrollArea className="flex-1 py-3">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = activeModule === item.id;
              const Icon = item.icon;

              const button = (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-accent/50 group relative',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                    sidebarCollapsed && 'justify-center px-0'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-emerald-500 to-teal-500"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                  <Icon className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-colors',
                    isActive ? item.accent : 'group-hover:text-foreground'
                  )} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      {button}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return button;
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="border-t border-border p-3 space-y-2">
          {/* AI Copilot Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleCopilot}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20',
                  'hover:from-emerald-500/20 hover:to-teal-500/20 transition-all',
                  'text-emerald-600 dark:text-emerald-400',
                  sidebarCollapsed && 'justify-center px-0'
                )}
              >
                <Sparkles className="h-[18px] w-[18px] shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap"
                    >
                      AI Copilot
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              AI Copilot
            </TooltipContent>
          </Tooltip>

          {/* Collapse Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground',
                  'hover:bg-accent/50 hover:text-foreground transition-all',
                  sidebarCollapsed && 'justify-center px-0'
                )}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">Collapse</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {sidebarCollapsed ? 'Expand' : 'Collapse'}
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
