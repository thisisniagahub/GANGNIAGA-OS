'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import type { ModuleId } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  ChevronDown,
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
  Bell,
  LogOut,
  User,
  Building2,
  CreditCard,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavChild {
  id: ModuleId;
  label: string;
  icon: React.ElementType;
  accent: string;
  shortcut?: string;
}

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ElementType;
  accent: string;
  badgeCount?: number;
  children?: NavChild[];
  roles?: string[];
  shortcut?: string;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

// ─── Navigation Configuration ─────────────────────────────────────────────────

const navGroups: NavGroup[] = [
  {
    id: 'core',
    title: 'Core',
    defaultOpen: true,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'text-emerald-500', shortcut: '⌘1' },
      { id: 'business-plans', label: 'Business Plans', icon: FileText, accent: 'text-amber-500', shortcut: '⌘2' },
      { id: 'financials', label: 'Financials', icon: LineChart, accent: 'text-teal-500', shortcut: '⌘3' },
    ],
  },
  {
    id: 'intelligence',
    title: 'Intelligence',
    defaultOpen: true,
    items: [
      { id: 'idea-canvas', label: 'Idea Canvas', icon: Lightbulb, accent: 'text-emerald-500', shortcut: '⌘4' },
      { id: 'plan-review', label: 'Plan Review', icon: Scale, accent: 'text-emerald-500', shortcut: '⌘5' },
      { id: 'research', label: 'Research Agent', icon: Search, accent: 'text-emerald-500', shortcut: '⌘6' },
    ],
  },
  {
    id: 'automation',
    title: 'Automation',
    defaultOpen: true,
    items: [
      { id: 'agents', label: 'Agent Console', icon: Bot, accent: 'text-cyan-500', shortcut: '⌘7' },
      { id: 'workflows', label: 'Workflows', icon: Workflow, accent: 'text-rose-500', shortcut: '⌘8' },
      { id: 'memory', label: 'Memory Engine', icon: Brain, accent: 'text-amber-500', shortcut: '⌘9' },
    ],
  },
  {
    id: 'connectivity',
    title: 'Connectivity',
    defaultOpen: false,
    items: [
      { id: 'openclaw', label: 'OpenClaw Gateway', icon: Radio, accent: 'text-orange-500', shortcut: '⌘0' },
    ],
  },
  {
    id: 'output',
    title: 'Output',
    defaultOpen: false,
    items: [
      { id: 'pitch-deck', label: 'Pitch Deck', icon: Presentation, accent: 'text-teal-500' },
      { id: 'reports', label: 'Reports', icon: BarChart3, accent: 'text-emerald-500' },
      { id: 'plan-actuals', label: 'Plan vs Actuals', icon: GitCompareArrows, accent: 'text-cyan-500' },
    ],
  },
  {
    id: 'system',
    title: 'System',
    defaultOpen: false,
    items: [
      { id: 'settings', label: 'Settings', icon: Settings, accent: 'text-muted-foreground' },
    ],
  },
];

// ─── Badge Configuration ──────────────────────────────────────────────────────

const badgeColorMap: Record<string, string> = {
  'business-plans': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'agents': 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  'plan-actuals': 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  'openclaw': 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Sidebar({ isMobile = false, onCloseMobile }: SidebarProps) {
  const {
    activeModule,
    setActiveModule,
    sidebarCollapsed,
    toggleSidebar,
    toggleCopilot,
    plans,
    agents,
    varianceAlerts,
    openclawChannels,
  } = useAppStore();

  // ── Expanded Groups State ──
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    navGroups.forEach((g) => {
      if (g.defaultOpen) initial.add(g.id);
    });
    return initial;
  });

  // ── Search State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Focused Index for Keyboard Nav ──
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // ── Compute Badge Counts ──
  const badgeMap: Record<string, number> = useMemo(() => ({
    'business-plans': plans.length,
    'agents': agents.filter((a) => a.status === 'running').length,
    'plan-actuals': varianceAlerts.filter((a) => a.severity === 'critical').length,
    'openclaw': openclawChannels.filter((c) => c.status === 'connected').length,
  }), [plans, agents, varianceAlerts, openclawChannels]);

  // ── Collapsed State (mobile always expanded) ──
  const collapsed = isMobile ? false : sidebarCollapsed;

  // ── Filter Navigation by Search ──
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return navGroups;
    const q = searchQuery.toLowerCase();
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  // ── Effective expanded groups: when searching, all matching groups are expanded ──
  const effectiveExpandedGroups = useMemo(() => {
    if (searchQuery.trim()) {
      return new Set(filteredGroups.map((g) => g.id));
    }
    return expandedGroups;
  }, [searchQuery, filteredGroups, expandedGroups]);

  // ── Flat list of visible nav items for keyboard navigation ──
  const flatItems = useMemo(() => {
    const items: NavItem[] = [];
    filteredGroups.forEach((group) => {
      if (effectiveExpandedGroups.has(group.id)) {
        group.items.forEach((item) => items.push(item));
      }
    });
    return items;
  }, [filteredGroups, effectiveExpandedGroups]);

  // ── Handlers ──
  const handleNavClick = useCallback(
    (id: ModuleId) => {
      setActiveModule(id);
      if (isMobile && onCloseMobile) onCloseMobile();
    },
    [setActiveModule, isMobile, onCloseMobile]
  );

  const handleCopilotClick = useCallback(() => {
    toggleCopilot();
    if (isMobile && onCloseMobile) onCloseMobile();
  }, [toggleCopilot, isMobile, onCloseMobile]);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }, []);

  // ── Keyboard Shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" to focus search
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        const active = document.activeElement;
        const tagName = active?.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') return;
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Escape to close mobile menu or blur search
      if (e.key === 'Escape') {
        if (searchFocused) {
          searchInputRef.current?.blur();
          setSearchFocused(false);
        }
        if (isMobile && onCloseMobile) onCloseMobile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, onCloseMobile, searchFocused]);

  // ── Keyboard Navigation within Sidebar ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchFocused && focusedIndex === -1) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < flatItems.length) {
          handleNavClick(flatItems[focusedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused, focusedIndex, flatItems, handleNavClick]);

  // ── Render Helpers ──

  const renderSearchBar = () => (
    <div className={cn('px-3 pb-2', collapsed && !isMobile && 'px-2')}>
      {collapsed && !isMobile ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => toggleSidebar()}
              className="w-full flex items-center justify-center h-9 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/50 transition-colors"
              aria-label="Search navigation"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            Search ({!isMobile && '/'})
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search modules..."
            className="h-8 pl-8 pr-8 text-xs bg-card/50 border-border/50 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
            aria-label="Search navigation items"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {!searchQuery && (
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-4 select-none items-center rounded border border-border/50 bg-muted/30 px-1 font-mono text-[9px] font-medium text-muted-foreground/60">
              /
            </kbd>
          )}
        </div>
      )}
    </div>
  );

  const renderNavItem = (item: NavItem, itemIndex: number) => {
    const isActive = activeModule === item.id;
    const Icon = item.icon;
    const badge = badgeMap[item.id];
    const badgeColor = badgeColorMap[item.id] || 'bg-muted text-muted-foreground';
    const isFocused = flatItems.indexOf(item) === focusedIndex;

    const buttonContent = (
      <motion.button
        onClick={() => handleNavClick(item.id)}
        data-nav-id={item.id}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[40px]',
          'group relative',
          isActive
            ? 'bg-emerald-500/8 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
          isFocused && !isActive && 'bg-accent/30 ring-1 ring-emerald-500/20',
          collapsed && !isMobile && 'justify-center px-0'
        )}
        whileHover={{ x: 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId={collapsed && !isMobile ? 'activeBarCollapsed' : 'activeBarExpanded'}
            className={cn(
              'absolute bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full',
              collapsed && !isMobile
                ? 'left-0 top-1/2 -translate-y-1/2 w-[3px] h-5'
                : 'left-0 top-1.5 bottom-1.5 w-[3px] rounded-l-lg'
            )}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          />
        )}

        {/* Icon with hover scale */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Icon
            className={cn(
              'h-[18px] w-[18px] shrink-0 transition-colors',
              isActive ? item.accent : 'group-hover:text-foreground'
            )}
          />
        </motion.div>

        {/* Label */}
        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap overflow-hidden flex-1 text-left"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge — expanded mode */}
        {badge > 0 && !collapsed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
              badgeColor
            )}
          >
            {badge}
            {/* Pulse dot for critical badges */}
            {item.id === 'plan-actuals' && badge > 0 && (
              <motion.span
                className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.span>
        )}

        {/* Shortcut hint — expanded mode */}
        {item.shortcut && !collapsed && !isMobile && !isActive && (
          <kbd className="pointer-events-none ml-auto text-[9px] font-mono text-muted-foreground/40 hidden lg:inline-flex">
            {item.shortcut}
          </kbd>
        )}

        {/* Badge dot — collapsed mode */}
        {badge > 0 && collapsed && !isMobile && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500"
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-amber-500"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.span>
        )}
      </motion.button>
    );

    // In collapsed mode (desktop), wrap with tooltip
    if (collapsed && !isMobile) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium flex items-center gap-2">
            {item.label}
            {badge > 0 && (
              <span className="text-[10px] font-bold text-amber-500">({badge})</span>
            )}
            {item.shortcut && (
              <span className="text-[9px] text-muted-foreground font-mono">{item.shortcut}</span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.id}>{buttonContent}</div>;
  };

  const renderNavGroup = (group: NavGroup, groupIdx: number) => {
    const isExpanded = effectiveExpandedGroups.has(group.id);
    const hasItems = group.items.length > 0;
    if (!hasItems) return null;

    // In collapsed mode, render items without group headers
    if (collapsed && !isMobile) {
      return (
        <div key={group.id}>
          {groupIdx > 0 && <div className="my-2 mx-2 border-t border-border/50" />}
          <div className="space-y-0.5 py-1">
            {group.items.map((item) => renderNavItem(item, 0))}
          </div>
        </div>
      );
    }

    return (
      <Collapsible
        key={group.id}
        open={isExpanded}
        onOpenChange={() => toggleGroup(group.id)}
      >
        {/* Section Header */}
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-1.5 px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground transition-colors',
              groupIdx === 0 && 'pt-1'
            )}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${group.title} section`}
          >
            <span className="flex-1 text-left">{group.title}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3 w-3 shrink-0" />
            </motion.div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent forceMount>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="space-y-0.5 px-1">
                  {group.items.map((item, idx) => renderNavItem(item, idx))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderUserProfile = () => {
    if (collapsed && !isMobile) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-full flex items-center justify-center py-2"
              aria-label="User profile — Admin"
            >
              <Avatar className="h-8 w-8 ring-2 ring-emerald-500/30">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                  GN
                </AvatarFallback>
              </Avatar>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            <div className="flex flex-col gap-0.5">
              <span>GangNiaga Admin</span>
              <span className="text-[10px] text-emerald-500 font-semibold">Pro Plan</span>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              'hover:bg-accent/50 min-h-[44px]'
            )}
            aria-label="Open user menu"
          >
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-emerald-500/30">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                GN
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium truncate">GangNiaga Admin</div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground truncate">admin@gangniaga.ai</span>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
              PRO
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">GangNiaga Admin</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">admin@gangniaga.ai</span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1 py-0 text-[8px] font-bold text-emerald-600 dark:text-emerald-400">
                  PRO
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Building2 className="mr-2 h-4 w-4" />
            Organization
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // ─── Main Render ──────────────────────────────────────────────────────────────

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={isMobile ? undefined : { width: collapsed ? 68 : 256 }}
        transition={
          isMobile
            ? undefined
            : { type: 'spring', damping: 25, stiffness: 300 }
        }
        className={cn(
          'bg-card/80 backdrop-blur-xl border-r border-border flex flex-col shrink-0 overflow-hidden',
          isMobile ? 'h-full w-[280px] border-r-0' : 'h-screen relative z-40'
        )}
      >
        {/* ── Logo Section ── */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
          <motion.div
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20"
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Zap className="h-5 w-5 text-white" />
          </motion.div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <h1 className="font-bold text-base tracking-tight whitespace-nowrap">
                  GangNiaga
                </h1>
                <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase whitespace-nowrap">
                  AI OS
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Search Bar ── */}
        {renderSearchBar()}

        {/* ── Navigation ── */}
        <ScrollArea className="flex-1 py-1" ref={navContainerRef}>
          <nav className="px-2" role="navigation" aria-label="Main navigation">
            {filteredGroups.length === 0 && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 py-8 text-center"
              >
                <Search className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">
                  No modules match &ldquo;{searchQuery}&rdquo;
                </p>
              </motion.div>
            )}
            {filteredGroups.map((group, groupIdx) =>
              renderNavGroup(group, groupIdx)
            )}
          </nav>
        </ScrollArea>

        {/* ── Bottom Section ── */}
        <div className="border-t border-border shrink-0">
          {/* Quick Action Buttons */}
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="px-3 pt-3 flex gap-2"
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
          <div className="px-3 pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={handleCopilotClick}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px]',
                    'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20',
                    'hover:from-emerald-500/20 hover:to-teal-500/20 transition-all',
                    'text-emerald-600 dark:text-emerald-400',
                    collapsed && !isMobile && 'justify-center px-0'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="h-[18px] w-[18px] shrink-0" />
                  </motion.div>
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
                  {(!collapsed || isMobile) && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/5 px-1.5 font-mono text-[10px] font-medium text-emerald-500/70">
                      ⌘K
                    </kbd>
                  )}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                AI Copilot (⌘K)
              </TooltipContent>
            </Tooltip>
          </div>

          {/* User Profile Section */}
          <div className="px-3 pt-2 pb-2">
            {renderUserProfile()}
          </div>

          {/* Collapse Toggle — hidden on mobile */}
          {!isMobile && (
            <div className="px-3 pb-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={toggleSidebar}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground min-h-[36px]',
                      'hover:bg-accent/50 hover:text-foreground transition-all',
                      collapsed && 'justify-center px-0'
                    )}
                    whileHover={{ x: collapsed ? 2 : -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                    {collapsed ? (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    ) : (
                      <>
                        <ChevronLeft className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap text-xs">Collapse</span>
                      </>
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {collapsed ? 'Expand' : 'Collapse'}
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
