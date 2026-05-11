'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Shield,
  Bot,
  Workflow,
  Brain,
  BarChart3,
  Target,
  Lightbulb,
  Presentation,
  Search,
  Settings,
  Plus,
  Sparkles,
  Download,
  Eye,
} from 'lucide-react';
import type { ModuleId } from '@/lib/types';

interface CommandAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  group: string;
}

const MODULES: { id: ModuleId; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'KPIs, charts & AI insights' },
  { id: 'business-plans', label: 'Business Plans', icon: FileText, description: '21-section professional proposals' },
  { id: 'financials', label: 'Financials', icon: TrendingUp, description: 'Forecasting, DSCR & bank metrics' },
  { id: 'plan-review', label: 'Plan Review', icon: Shield, description: 'Lender-grade narrative vs financials check' },
  { id: 'agents', label: 'Agent Console', icon: Bot, description: 'Monitor & control AI agents' },
  { id: 'workflows', label: 'Workflows', icon: Workflow, description: 'Automate business processes' },
  { id: 'memory', label: 'Memory Engine', icon: Brain, description: 'Persistent organizational intelligence' },
  { id: 'reports', label: 'Reports', icon: BarChart3, description: 'Generate investor & board reports' },
  { id: 'plan-actuals', label: 'Plan vs Actuals', icon: Target, description: 'Real-time variance tracking' },
  { id: 'idea-canvas', label: 'Idea Canvas', icon: Lightbulb, description: 'Validate business ideas with AI' },
  { id: 'pitch-deck', label: 'Pitch Deck', icon: Presentation, description: 'Auto-sync financials to slides' },
  { id: 'research', label: 'Research Agent', icon: Search, description: 'Bank-grade research & citations' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Configuration & integrations' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { setActiveModule, toggleCopilot } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  const quickActions: CommandAction[] = [
    {
      id: 'new-proposal',
      label: 'Create New Proposal',
      description: 'Start a new business proposal',
      icon: Plus,
      action: () => {
        setActiveModule('business-plans');
      },
      group: 'Quick Actions',
    },
    {
      id: 'validate-idea',
      label: 'Validate an Idea',
      description: 'Pressure-test a business idea with AI',
      icon: Sparkles,
      action: () => {
        setActiveModule('idea-canvas');
      },
      group: 'Quick Actions',
    },
    {
      id: 'run-review',
      label: 'Run Plan Review',
      description: 'Cross-check narrative vs financials',
      icon: Eye,
      action: () => {
        setActiveModule('plan-review');
      },
      group: 'Quick Actions',
    },
    {
      id: 'ai-copilot',
      label: 'Open AI Copilot',
      description: 'Chat with GangNiaga AI assistant',
      icon: Bot,
      action: () => {
        toggleCopilot();
      },
      group: 'Quick Actions',
    },
    {
      id: 'export-report',
      label: 'Export Report',
      description: 'Generate and download a report',
      icon: Download,
      action: () => {
        setActiveModule('reports');
      },
      group: 'Quick Actions',
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.id}
              onSelect={() => runCommand(action.action)}
            >
              <action.icon className="mr-2 h-4 w-4" />
              <span>{action.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {action.description}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          {MODULES.map((module) => (
            <CommandItem
              key={module.id}
              onSelect={() => runCommand(() => setActiveModule(module.id))}
            >
              <module.icon className="mr-2 h-4 w-4" />
              <span>{module.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {module.description}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default CommandPalette;
