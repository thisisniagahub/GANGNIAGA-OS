'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Workflow,
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  ArrowRight,
  GitBranch,
  Timer,
  AlertTriangle,
  Database,
  BarChart3,
  FileText,
  Bell,
  Globe,
  Settings2,
  ChevronDown,
  ChevronUp,
  Search,
  Eye,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkflowInfo, WorkflowStep } from '@/lib/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTypeBadge(type: WorkflowInfo['type']) {
  switch (type) {
    case 'scheduled':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
          <Calendar className="size-3" />
          Scheduled
        </Badge>
      );
    case 'event':
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
          <Zap className="size-3" />
          Event
        </Badge>
      );
    case 'recurring':
      return (
        <Badge className="bg-cyan-500/15 text-cyan-600 border-cyan-500/25 gap-1">
          <RotateCcw className="size-3" />
          Recurring
        </Badge>
      );
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
}

function getStatusBadge(status: WorkflowInfo['status']) {
  switch (status) {
    case 'running':
      return (
        <Badge className="bg-cyan-500/15 text-cyan-600 border-cyan-500/25 gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          Running
        </Badge>
      );
    case 'paused':
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
          <Pause className="size-3" />
          Paused
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="secondary" className="text-muted-foreground gap-1">
          <Clock className="size-3" />
          Pending
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 gap-1">
          <CheckCircle2 className="size-3" />
          Completed
        </Badge>
      );
    case 'failed':
      return (
        <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/25 gap-1">
          <XCircle className="size-3" />
          Failed
        </Badge>
      );
  }
}

function getTriggerLabel(triggerType: string) {
  const map: Record<string, { label: string; icon: React.ReactNode }> = {
    cron: { label: 'Cron', icon: <GitBranch className="size-3" /> },
    daily: { label: 'Daily', icon: <Calendar className="size-3" /> },
    manual: { label: 'Manual', icon: <Play className="size-3" /> },
    threshold: { label: 'Threshold', icon: <AlertTriangle className="size-3" /> },
    monthly: { label: 'Monthly', icon: <Calendar className="size-3" /> },
  };
  return map[triggerType] ?? { label: triggerType, icon: <Zap className="size-3" /> };
}

function getStepStatusIcon(status: WorkflowStep['status']) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="size-4 text-emerald-600" />;
    case 'running':
      return <Loader2 className="size-4 text-cyan-500 animate-spin" />;
    case 'pending':
      return <Clock className="size-4 text-amber-500" />;
    case 'failed':
      return <XCircle className="size-4 text-rose-500" />;
  }
}

function getStepTypeIcon(type: string) {
  switch (type) {
    case 'data':
      return <Database className="size-4" />;
    case 'analysis':
      return <BarChart3 className="size-4" />;
    case 'report':
      return <FileText className="size-4" />;
    case 'notification':
      return <Bell className="size-4" />;
    case 'browser':
      return <Globe className="size-4" />;
    case 'chart':
      return <BarChart3 className="size-4" />;
    case 'custom':
    default:
      return <Settings2 className="size-4" />;
  }
}

function getStepTypeLabel(type: string) {
  const map: Record<string, string> = {
    data: 'Data Collection',
    analysis: 'Analysis',
    report: 'Report',
    notification: 'Notification',
    browser: 'Browser',
    chart: 'Chart',
    custom: 'Custom',
  };
  return map[type] ?? 'Custom';
}

function getStepTypeColor(type: string) {
  switch (type) {
    case 'data':
      return 'bg-cyan-500/10 text-cyan-600';
    case 'analysis':
      return 'bg-amber-500/10 text-amber-600';
    case 'report':
      return 'bg-emerald-500/10 text-emerald-600';
    case 'notification':
      return 'bg-rose-500/10 text-rose-600';
    case 'browser':
      return 'bg-purple-500/10 text-purple-600';
    case 'chart':
      return 'bg-teal-500/10 text-teal-600';
    default:
      return 'bg-gray-500/10 text-gray-600';
  }
}

// ─── Mock execution history ──────────────────────────────────────────────────

interface ExecutionRecord {
  id: string;
  workflowName: string;
  workflowId: string;
  startedAt: string;
  completedAt: string;
  duration: string;
  status: 'completed' | 'failed' | 'running';
  stepsCompleted: number;
  stepsTotal: number;
}

const executionHistory: ExecutionRecord[] = [
  { id: 'h1', workflowName: 'Weekly KPI Report', workflowId: '1', startedAt: '2024-01-15 09:00', completedAt: '2024-01-15 09:12', duration: '12m', status: 'completed', stepsCompleted: 4, stepsTotal: 4 },
  { id: 'h2', workflowName: 'Weekly KPI Report', workflowId: '1', startedAt: '2024-01-08 09:00', completedAt: '2024-01-08 09:15', duration: '15m', status: 'completed', stepsCompleted: 4, stepsTotal: 4 },
  { id: 'h3', workflowName: 'Competitor Monitoring', workflowId: '2', startedAt: '2024-01-15 08:30', completedAt: '2024-01-15 08:47', duration: '17m', status: 'running', stepsCompleted: 2, stepsTotal: 4 },
  { id: 'h4', workflowName: 'Competitor Monitoring', workflowId: '2', startedAt: '2024-01-14 08:30', completedAt: '2024-01-14 08:38', duration: '8m', status: 'completed', stepsCompleted: 4, stepsTotal: 4 },
  { id: 'h5', workflowName: 'Revenue Alert', workflowId: '3', startedAt: '2024-01-13 14:00', completedAt: '2024-01-13 14:03', duration: '3m', status: 'failed', stepsCompleted: 1, stepsTotal: 3 },
  { id: 'h6', workflowName: 'Weekly KPI Report', workflowId: '1', startedAt: '2024-01-01 09:00', completedAt: '2024-01-01 09:10', duration: '10m', status: 'completed', stepsCompleted: 4, stepsTotal: 4 },
  { id: 'h7', workflowName: 'Investor Update', workflowId: '4', startedAt: '2024-01-01 10:00', completedAt: '2024-01-01 10:22', duration: '22m', status: 'failed', stepsCompleted: 2, stepsTotal: 4 },
  { id: 'h8', workflowName: 'Competitor Monitoring', workflowId: '2', startedAt: '2024-01-13 08:30', completedAt: '2024-01-13 08:42', duration: '12m', status: 'completed', stepsCompleted: 4, stepsTotal: 4 },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function WorkflowsModule() {
  const { workflows } = useAppStore();
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'completed' | 'failed' | 'running'>('all');
  const [builderSteps, setBuilderSteps] = useState<WorkflowStep[]>([
    { id: 'b1', name: 'Collect Market Data', type: 'data', status: 'pending', agent: 'Market Researcher' },
    { id: 'b2', name: 'Analyze Trends', type: 'analysis', status: 'pending', agent: 'Business Analyst' },
    { id: 'b3', name: 'Generate Report', type: 'report', status: 'pending', agent: 'Report Generator' },
  ]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Stats
  const runningCount = workflows.filter((w) => w.status === 'running').length;
  const completedCount = workflows.filter((w) => w.status === 'completed').length;
  const failedCount = workflows.filter((w) => w.status === 'failed').length;
  const pendingCount = workflows.filter((w) => w.status === 'pending' || w.status === 'paused').length;

  // Filtered history
  const filteredHistory = useMemo(() => {
    if (historyFilter === 'all') return executionHistory;
    return executionHistory.filter((h) => h.status === historyFilter);
  }, [historyFilter]);

  // Builder step management
  const addBuilderStep = (afterIndex: number) => {
    const stepTypes = ['data', 'analysis', 'report', 'notification', 'browser', 'custom'];
    const stepNames: Record<string, string> = {
      data: 'Data Collection',
      analysis: 'Analysis Step',
      report: 'Report Generation',
      notification: 'Send Notification',
      browser: 'Browse Web',
      custom: 'Custom Step',
    };
    const randomType = stepTypes[Math.floor(Math.random() * stepTypes.length)];
    const newStep: WorkflowStep = {
      id: `b${Date.now()}`,
      name: stepNames[randomType],
      type: randomType,
      status: 'pending',
    };
    const updated = [...builderSteps];
    updated.splice(afterIndex + 1, 0, newStep);
    setBuilderSteps(updated);
  };

  const removeBuilderStep = (stepId: string) => {
    if (builderSteps.length <= 1) return;
    setBuilderSteps((prev) => prev.filter((s) => s.id !== stepId));
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-cyan-500/10">
            <Workflow className="size-5 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Workflow Engine</h2>
            <p className="text-sm text-muted-foreground">Automate and monitor your business workflows</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-cyan-500/15 text-cyan-600 border-cyan-500/25 gap-1">
            <Loader2 className="size-3" />
            {runningCount} Running
          </Badge>
          <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 gap-1">
            <CheckCircle2 className="size-3" />
            {completedCount} Done
          </Badge>
          <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/25 gap-1">
            <XCircle className="size-3" />
            {failedCount} Failed
          </Badge>
          <Badge variant="secondary" className="text-muted-foreground gap-1">
            <Clock className="size-3" />
            {pendingCount} Queued
          </Badge>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 ml-1">
                <Plus className="size-3.5" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Choose a template or start from scratch. The workflow builder lets you
                    chain data collection, analysis, reporting, and notification steps
                    into automated pipelines.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'KPI Report', icon: BarChart3, steps: 4 },
                    { name: 'Competitor Scan', icon: Search, steps: 3 },
                    { name: 'Revenue Alert', icon: AlertTriangle, steps: 3 },
                    { name: 'Blank Workflow', icon: Plus, steps: 0 },
                  ].map((template) => (
                    <button
                      key={template.name}
                      onClick={() => setCreateDialogOpen(false)}
                      className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-center size-9 rounded-md bg-emerald-500/10 text-emerald-600">
                        <template.icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {template.steps > 0 ? `${template.steps} steps` : 'Start empty'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Main Content Tabs ────────────────────────────────────────────── */}
      <Tabs defaultValue="active" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="active" className="gap-1.5">
            <Zap className="size-3.5" />
            Active Workflows
          </TabsTrigger>
          <TabsTrigger value="builder" className="gap-1.5">
            <GitBranch className="size-3.5" />
            Workflow Builder
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <Clock className="size-3.5" />
            Execution History
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Active Workflows ─────────────────────────────────────── */}
        <TabsContent value="active" className="flex-1 mt-3 min-h-0">
          <ScrollArea className="h-full max-h-[calc(100vh-240px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-1">
              <AnimatePresence mode="popLayout">
                {workflows.map((workflow, index) => (
                  <WorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    expanded={expandedWorkflow === workflow.id}
                    onToggleExpand={() =>
                      setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)
                    }
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── Tab 2: Workflow Builder ──────────────────────────────────────── */}
        <TabsContent value="builder" className="flex-1 mt-3 min-h-0">
          <ScrollArea className="h-full max-h-[calc(100vh-240px)]">
            <div className="max-w-2xl mx-auto py-4 pr-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Visual Workflow Builder</CardTitle>
                      <CardDescription className="mt-1">
                        Drag and connect steps to build your automated pipeline
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <GitBranch className="size-3" />
                      {builderSteps.length} steps
                    </Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4 sm:p-6">
                  {/* Workflow name input */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-500/10 text-emerald-600">
                      <Workflow className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Custom Workflow</p>
                      <p className="text-xs text-muted-foreground">New workflow — Untitled</p>
                    </div>
                  </div>

                  {/* Vertical step flow */}
                  <div className="space-y-0">
                    {builderSteps.map((step, idx) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.08 }}
                      >
                        {/* Step card */}
                        <div className="flex items-start gap-3">
                          {/* Connecting line + node */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div
                              className={`flex items-center justify-center size-8 rounded-full ${getStepTypeColor(step.type)} border-2 border-background shadow-sm`}
                            >
                              {getStepTypeIcon(step.type)}
                            </div>
                            {idx < builderSteps.length - 1 && (
                              <div className="w-0.5 h-6 bg-border" />
                            )}
                          </div>

                          {/* Step content card */}
                          <div className="flex-1 min-w-0 mb-2">
                            <div className="rounded-lg border bg-card p-3 hover:shadow-sm transition-shadow">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm font-medium truncate">{step.name}</span>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 flex-shrink-0">
                                    {getStepTypeLabel(step.type)}
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-muted-foreground hover:text-rose-500 flex-shrink-0"
                                  onClick={() => removeBuilderStep(step.id)}
                                  disabled={builderSteps.length <= 1}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                              {(step.agent || step.tool) && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <Zap className="size-3" />
                                  {step.agent ?? step.tool}
                                </p>
                              )}
                            </div>

                            {/* Add step button between steps */}
                            {idx < builderSteps.length - 1 && (
                              <div className="flex items-center justify-center -mt-0.5 mb-0.5">
                                <button
                                  onClick={() => addBuilderStep(idx)}
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-600 transition-colors py-1 px-2 rounded-md hover:bg-emerald-500/5"
                                >
                                  <Plus className="size-3" />
                                  Add Step
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add step at end */}
                  <div className="flex items-center justify-center mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                      onClick={() => addBuilderStep(builderSteps.length - 1)}
                    >
                      <Plus className="size-3.5" />
                      Add Final Step
                    </Button>
                  </div>

                  <Separator className="my-5" />

                  {/* Step type palette */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Step Types
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { type: 'data', label: 'Data Collection', icon: Database, color: 'bg-cyan-500/10 text-cyan-600' },
                        { type: 'analysis', label: 'Analysis', icon: BarChart3, color: 'bg-amber-500/10 text-amber-600' },
                        { type: 'report', label: 'Report', icon: FileText, color: 'bg-emerald-500/10 text-emerald-600' },
                        { type: 'notification', label: 'Notification', icon: Bell, color: 'bg-rose-500/10 text-rose-600' },
                        { type: 'browser', label: 'Browser', icon: Globe, color: 'bg-purple-500/10 text-purple-600' },
                        { type: 'custom', label: 'Custom', icon: Settings2, color: 'bg-gray-500/10 text-gray-600' },
                      ].map((stepType) => (
                        <button
                          key={stepType.type}
                          className="flex items-center gap-2.5 rounded-lg border p-2.5 text-left hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            const newStep: WorkflowStep = {
                              id: `b${Date.now()}`,
                              name: stepType.label,
                              type: stepType.type,
                              status: 'pending',
                            };
                            setBuilderSteps((prev) => [...prev, newStep]);
                          }}
                        >
                          <div className={`flex items-center justify-center size-7 rounded-md ${stepType.color}`}>
                            <stepType.icon className="size-3.5" />
                          </div>
                          <span className="text-xs font-medium">{stepType.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-5" />

                  {/* Save / Deploy */}
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      Save Draft
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                      <Play className="size-3.5" />
                      Deploy Workflow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── Tab 3: Execution History ─────────────────────────────────────── */}
        <TabsContent value="history" className="flex-1 mt-3 min-h-0">
          <ScrollArea className="h-full max-h-[calc(100vh-240px)]">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Execution History</CardTitle>
                    <CardDescription>Past workflow runs and their results</CardDescription>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['all', 'completed', 'failed', 'running'] as const).map((filter) => (
                      <Button
                        key={filter}
                        variant={historyFilter === filter ? 'default' : 'outline'}
                        size="sm"
                        className={`gap-1 text-xs h-7 ${
                          historyFilter === filter
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : ''
                        }`}
                        onClick={() => setHistoryFilter(filter)}
                      >
                        {filter === 'all' && <Eye className="size-3" />}
                        {filter === 'completed' && <CheckCircle2 className="size-3" />}
                        {filter === 'failed' && <XCircle className="size-3" />}
                        {filter === 'running' && <Loader2 className="size-3" />}
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <div className="divide-y">
                  <AnimatePresence mode="popLayout">
                    {filteredHistory.map((record, idx) => (
                      <motion.div
                        key={record.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                        className="flex items-center gap-4 px-4 sm:px-6 py-3 hover:bg-muted/30 transition-colors"
                      >
                        {/* Status icon */}
                        <div className="flex-shrink-0">
                          {record.status === 'completed' ? (
                            <CheckCircle2 className="size-5 text-emerald-600" />
                          ) : record.status === 'failed' ? (
                            <XCircle className="size-5 text-rose-500" />
                          ) : (
                            <Loader2 className="size-5 text-cyan-500 animate-spin" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{record.workflowName}</span>
                            {record.status === 'completed' && (
                              <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 text-[10px] px-1.5 py-0">
                                Success
                              </Badge>
                            )}
                            {record.status === 'failed' && (
                              <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/25 text-[10px] px-1.5 py-0">
                                Failed
                              </Badge>
                            )}
                            {record.status === 'running' && (
                              <Badge className="bg-cyan-500/15 text-cyan-600 border-cyan-500/25 text-[10px] px-1.5 py-0">
                                Running
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {record.startedAt}
                            </span>
                            <span className="flex items-center gap-1">
                              <Timer className="size-3" />
                              {record.duration}
                            </span>
                          </div>
                        </div>

                        {/* Steps progress */}
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-medium">
                              {record.stepsCompleted}/{record.stepsTotal}
                            </p>
                            <p className="text-[10px] text-muted-foreground">steps</p>
                          </div>
                          <Progress
                            value={(record.stepsCompleted / record.stepsTotal) * 100}
                            className={`w-16 h-1.5 ${
                              record.status === 'completed'
                                ? '[&>div]:bg-emerald-500'
                                : record.status === 'failed'
                                  ? '[&>div]:bg-rose-500'
                                  : '[&>div]:bg-cyan-500'
                            }`}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {record.status === 'failed' && (
                            <Button variant="ghost" size="icon" className="size-7 text-amber-600 hover:text-amber-700">
                              <RotateCcw className="size-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                            <Eye className="size-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredHistory.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground text-sm">
                      No execution records found for this filter.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Workflow Card Sub-component ─────────────────────────────────────────────

function WorkflowCard({
  workflow,
  expanded,
  onToggleExpand,
  index,
}: {
  workflow: WorkflowInfo;
  expanded: boolean;
  onToggleExpand: () => void;
  index: number;
}) {
  const steps = workflow.steps ?? [];
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const progressValue = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;
  const trigger = getTriggerLabel(workflow.triggerType);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`flex items-center justify-center size-9 rounded-lg flex-shrink-0 ${
                  workflow.status === 'running'
                    ? 'bg-cyan-500/10 text-cyan-600'
                    : workflow.status === 'failed'
                      ? 'bg-rose-500/10 text-rose-600'
                      : workflow.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : workflow.status === 'paused'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-muted text-muted-foreground'
                }`}
              >
                <Workflow className="size-4" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-semibold leading-tight truncate">
                  {workflow.name}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {getTypeBadge(workflow.type)}
                  <Badge variant="outline" className="text-[10px] gap-0.5 px-1.5 py-0">
                    {trigger.icon}
                    {trigger.label}
                  </Badge>
                </div>
              </div>
            </div>
            {getStatusBadge(workflow.status)}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Step Progress</span>
              <span className="font-medium">
                {completedSteps}/{steps.length} completed
              </span>
            </div>
            <Progress
              value={progressValue}
              className={`h-1.5 ${
                workflow.status === 'completed'
                  ? '[&>div]:bg-emerald-500'
                  : workflow.status === 'failed'
                    ? '[&>div]:bg-rose-500'
                    : workflow.status === 'running'
                      ? '[&>div]:bg-cyan-500'
                      : '[&>div]:bg-amber-400'
              }`}
            />
          </div>

          {/* Created date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            Created {workflow.createdAt}
          </div>

          {/* Expand/collapse step list */}
          {steps.length > 0 && (
            <>
              <button
                onClick={onToggleExpand}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
              >
                {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                {expanded ? 'Hide Steps' : 'Show Steps'} ({steps.length})
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0 pt-1">
                      {steps.map((step, stepIdx) => (
                        <div key={step.id} className="flex items-start gap-2">
                          {/* Connecting vertical line + status node */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2, delay: stepIdx * 0.06 }}
                              className={`${
                                step.status === 'running' ? 'animate-pulse' : ''
                              }`}
                            >
                              {getStepStatusIcon(step.status)}
                            </motion.div>
                            {stepIdx < steps.length - 1 && (
                              <div className="w-px h-5 bg-border" />
                            )}
                          </div>

                          {/* Step info */}
                          <div className="flex-1 min-w-0 pb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium truncate">{step.name}</span>
                              {stepIdx < steps.length - 1 && (
                                <ArrowRight className="size-3 text-muted-foreground/40 flex-shrink-0 hidden sm:block" />
                              )}
                            </div>
                            {(step.agent || step.tool) && (
                              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Zap className="size-2.5" />
                                {step.agent ?? step.tool}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          <Separator />

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {workflow.status === 'running' ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-amber-600 border-amber-500/30 hover:bg-amber-500/10 h-7 text-xs"
              >
                <Pause className="size-3" />
                Pause
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 h-7 text-xs"
                disabled={workflow.status === 'completed'}
              >
                <Play className="size-3" />
                Play
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 h-7 text-xs"
              disabled={workflow.status === 'pending'}
            >
              <Square className="size-3" />
              Stop
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 h-7 text-xs"
              disabled={workflow.status === 'pending'}
            >
              <RotateCcw className="size-3" />
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WorkflowsModule;
