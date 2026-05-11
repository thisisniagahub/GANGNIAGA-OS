'use client';

import { useAppStore } from '@/lib/store';
import type { ModuleId } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Scale,
  Lightbulb,
  GitCompareArrows,
  Presentation,
  Search,
  PlusCircle,
  FlaskConical,
  Radio,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ElementType;
  accent: string;
  badgeCount?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Core',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'text-emerald-500' },
      { id: 'business-plans', label: 'Business Plans', icon: FileText, accent: 'text-amber-500' },
      { id: 'financials', label: 'Financials', icon: LineChart, accent: 'text-teal-500' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'idea-canvas', label: 'Idea Canvas', icon: Lightbulb, accent: 'text-emerald-500' },
      { id: 'plan-review', label: 'Plan Review', icon: Scale, accent: 'text-emerald-500' },
      { id: 'research', label: 'Research Agent', icon: Search, accent: 'text-emerald-500' },
    ],
  },
  {
    title: 'Automation',
    items: [
      { id: 'agents', label: 'Agent Console', icon: Bot, accent: 'text-cyan-500' },
      { id: 'workflows', label: 'Workflows', icon: Workflow, accent: 'text-rose-500' },
      { id: 'memory', label: 'Memory Engine', icon: Brain, accent: 'text-amber-500' },
    ],
  },
  {
    title: 'Connectivity',
    items: [
      { id: 'openclaw', label: 'OpenClaw Gateway', icon: Radio, accent: 'text-orange-500' },
    ],
  },
  {
    title: 'Output',
    items: [
      { id: 'pitch-deck', label: 'Pitch Deck', icon: Presentation, accent: 'text-teal-500' },
      { id: 'reports', label: 'Reports', icon: BarChart3, accent: 'text-emerald-500' },
      { id: 'plan-actuals', label: 'Plan vs Actuals', icon: GitCompareArrows, accent: 'text-cyan-500' },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings, accent: 'text-muted-foreground' },
    ],
  },
];

export default function Sidebar({ isMobile = false, onCloseMobile }: SidebarProps) {
  const { activeModule, setActiveModule, sidebarCollapsed, toggleSidebar, toggleCopilot, plans, agents, varianceAlerts, openclawChannels } = useAppStore();

  // Compute badge counts from store
  const plansCount = plans.length;
  const runningAgentsCount = agents.filter(a => a.status === 'running').length;
  const criticalAlertsCount = varianceAlerts.filter(a => a.severity === 'critical').length;

  const badgeMap: Record<string, number> = {
    'business-plans': plansCount,
    'agents': runningAgentsCount,
    'plan-actuals': criticalAlertsCount,
    'openclaw': openclawChannels.filter(c => c.status === 'connected').length,
  };

  const badgeColorMap: Record<string, string> = {
    'business-plans': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    'agents': 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
    'plan-actuals': 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    'openclaw': 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  };

  // On mobile, the sidebar is always "expanded" (never collapsed)
  const collapsed = isMobile ? false : sidebarCollapsed;

  const handleNavClick = (id: ModuleId) => {
    setActiveModule(id);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleCopilotClick = () => {
    toggleCopilot();
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={isMobile ? undefined : { width: collapsed ? 68 : 240 }}
        transition={isMobile ? undefined : { type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'bg-card/80 backdrop-blur-xl border-r border-border flex flex-col shrink-0 overflow-hidden',
          isMobile
            ? 'h-full w-[280px]'
            : 'h-screen relative z-40',
          isMobile && 'border-r-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
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

        {/* Nav Items with Grouping */}
        <ScrollArea className="flex-1 py-3">
          <nav className="px-3">
            {navGroups.map((group, groupIdx) => (
              <div key={group.title}>
                {/* Section Header */}
                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className={cn(
                        'px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60',
                        groupIdx === 0 && 'pt-1'
                      )}
                    >
                      {group.title}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed: thin separator between groups (desktop only) */}
                {collapsed && !isMobile && groupIdx > 0 && (
                  <div className="my-2 mx-2 border-t border-border/50" />
                )}

                {/* Nav Items */}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeModule === item.id;
                    const Icon = item.icon;
                    const badge = badgeMap[item.id];
                    const badgeColor = badgeColorMap[item.id] || 'bg-muted text-muted-foreground';

                    const button = (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                          'group relative',
                          isActive
                            ? 'bg-emerald-500/8 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-l-[3px] border-l-emerald-500 pl-[9px]'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                          collapsed && !isMobile && 'justify-center px-0 border-l-0 pl-0'
                        )}
                      >
                        {isActive && collapsed && !isMobile && (
                          <motion.div
                            layoutId="activeIndicatorCollapsed"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-emerald-500 to-teal-500"
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          />
                        )}
                        <Icon className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-colors',
                          isActive ? item.accent : 'group-hover:text-foreground'
                        )} />
                        <AnimatePresence>
                          {(!collapsed || isMobile) && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="whitespace-nowrap overflow-hidden flex-1 text-left"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {/* Badge */}
                        {badge > 0 && !collapsed && (
                          <span className={cn(
                            'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                            badgeColor
                          )}>
                            {badge}
                          </span>
                        )}
                        {/* Badge in collapsed mode (desktop) - dot indicator */}
                        {badge > 0 && collapsed && !isMobile && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
                        )}
                      </button>
                    );

                    if (collapsed && !isMobile) {
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            {button}
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {item.label}
                            {badge > 0 && (
                              <span className="ml-1.5 text-[10px] font-bold text-amber-500">({badge})</span>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return button;
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="border-t border-border p-3 space-y-2">
          {/* Quick Action Buttons — always visible on mobile, only when expanded on desktop */}
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="flex gap-2"
              >
                <button
                  onClick={() => handleNavClick('business-plans')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-semibold min-h-[36px]
                    bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20
                    hover:bg-emerald-500/20 transition-all"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  New Proposal
                </button>
                <button
                  onClick={() => handleNavClick('idea-canvas')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-semibold min-h-[36px]
                    bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20
                    hover:bg-amber-500/20 transition-all"
                >
                  <FlaskConical className="h-3.5 w-3.5" />
                  Validate Idea
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Copilot Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopilotClick}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px]',
                  'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20',
                  'hover:from-emerald-500/20 hover:to-teal-500/20 transition-all',
                  'text-emerald-600 dark:text-emerald-400',
                  collapsed && !isMobile && 'justify-center px-0'
                )}
              >
                <Sparkles className="h-[18px] w-[18px] shrink-0" />
                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap flex-1 text-left"
                    >
                      AI Copilot
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* ⌘K Badge */}
                {(!collapsed || isMobile) && (
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/5 px-1.5 font-mono text-[10px] font-medium text-emerald-500/70">
                    ⌘K
                  </kbd>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              AI Copilot (⌘K)
            </TooltipContent>
          </Tooltip>

          {/* Collapse Toggle — hidden on mobile */}
          {!isMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground min-h-[44px]',
                    'hover:bg-accent/50 hover:text-foreground transition-all',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  {collapsed ? (
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
                {collapsed ? 'Expand' : 'Collapse'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
