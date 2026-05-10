'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Bot,
  Play,
  Pause,
  Square,
  RotateCcw,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Brain,
  Globe,
  LineChart,
  FileText,
  MessageSquare,
  Settings,
  Eye,
  Zap,
  AlertTriangle,
  DollarSign,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgentInfo, TaskInfo } from '@/lib/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function AgentIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'analysis':
      return <Brain className={className} />;
    case 'financial':
      return <DollarSign className={className} />;
    case 'research':
      return <Search className={className} />;
    case 'reporting':
      return <FileText className={className} />;
    case 'browser':
      return <Globe className={className} />;
    case 'crm':
      return <MessageSquare className={className} />;
    default:
      return <Bot className={className} />;
  }
}

function getStatusBadge(status: AgentInfo['status']) {
  switch (status) {
    case 'running':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Running
        </Badge>
      );
    case 'idle':
      return (
        <Badge variant="secondary" className="text-muted-foreground gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400" />
          Idle
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 gap-1">
          <CheckCircle2 className="size-3" />
          Completed
        </Badge>
      );
    case 'error':
      return (
        <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/25 gap-1">
          <AlertTriangle className="size-3" />
          Error
        </Badge>
      );
  }
}

function getTaskStatusBadge(status: TaskInfo['status']) {
  switch (status) {
    case 'running':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
          <Loader2 className="size-3 animate-spin" />
          Running
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
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

function getProgressValue(status: TaskInfo['status']) {
  switch (status) {
    case 'completed':
      return 100;
    case 'running':
      return 65;
    case 'pending':
      return 0;
    case 'failed':
      return 100;
  }
}

function getProgressColor(status: TaskInfo['status']) {
  switch (status) {
    case 'completed':
      return '[&>div]:bg-emerald-500';
    case 'running':
      return '[&>div]:bg-emerald-500';
    case 'pending':
      return '[&>div]:bg-amber-400';
    case 'failed':
      return '[&>div]:bg-rose-500';
  }
}

// ─── Mock agent capabilities per type ───────────────────────────────────────

function getAgentCapabilities(type: string): string[] {
  const map: Record<string, string[]> = {
    analysis: ['Data Analysis', 'Trend Detection', 'Anomaly Detection', 'Forecasting', 'Pattern Recognition'],
    financial: ['Revenue Forecasting', 'Expense Tracking', 'Cash Flow Analysis', 'Budget Planning', 'Risk Assessment'],
    research: ['Web Scraping', 'Competitor Analysis', 'Market Research', 'Industry Reports', 'Data Collection'],
    reporting: ['PDF Generation', 'Chart Creation', 'Template Rendering', 'Scheduled Reports', 'Data Aggregation'],
    browser: ['Web Navigation', 'Form Filling', 'Screenshot Capture', 'Data Extraction', 'Multi-tab Browsing'],
    crm: ['Contact Management', 'Email Drafting', 'Follow-up Scheduling', 'Lead Scoring', 'Pipeline Tracking'],
  };
  return map[type] ?? ['General Tasks'];
}

function getAgentMemories(type: string): { label: string; time: string }[] {
  const map: Record<string, { label: string; time: string }[]> = {
    analysis: [
      { label: 'Processed SaaS metrics for Q4 dashboard', time: '2 min ago' },
      { label: 'Detected revenue anomaly in Nov data', time: '1 hr ago' },
      { label: 'Updated growth model with latest inputs', time: '3 hrs ago' },
    ],
    financial: [
      { label: 'Generated monthly burn rate summary', time: '15 min ago' },
      { label: 'Re-calculated runway projection', time: '2 hrs ago' },
    ],
    research: [
      { label: 'Scraped competitor pricing from 5 sources', time: '5 min ago' },
      { label: 'Compiled Southeast Asian market data', time: '1 hr ago' },
      { label: 'Updated market trend database', time: '4 hrs ago' },
    ],
    reporting: [
      { label: 'Generated Q4 investor update PDF', time: '1 hr ago' },
      { label: 'Rendered KPI summary charts', time: '2 hrs ago' },
    ],
    browser: [
      { label: 'Navigated competitor pricing pages', time: '3 hrs ago' },
      { label: 'Captured screenshots of industry reports', time: '5 hrs ago' },
    ],
    crm: [
      { label: 'Failed to sync CRM contacts — API error', time: '30 min ago' },
      { label: 'Drafted follow-up email for lead #482', time: '1 hr ago' },
    ],
  };
  return map[type] ?? [];
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AgentsModule() {
  const { agents, selectedAgent, setSelectedAgent, agentTasks } = useAppStore();

  const selected = agents.find((a) => a.id === selectedAgent) ?? null;

  const runningCount = agents.filter((a) => a.status === 'running').length;
  const idleCount = agents.filter((a) => a.status === 'idle').length;
  const completedCount = agents.filter((a) => a.status === 'completed').length;
  const errorCount = agents.filter((a) => a.status === 'error').length;

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full gap-4">
        {/* ── Top Bar ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
              <Bot className="size-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Agent Control Center</h2>
              <p className="text-sm text-muted-foreground">Monitor and control your AI agents</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
              <Activity className="size-3" />
              {runningCount} Running
            </Badge>
            <Badge variant="secondary" className="text-muted-foreground gap-1">
              <Clock className="size-3" />
              {idleCount} Idle
            </Badge>
            <Badge className="bg-emerald-700/10 text-emerald-700 border-emerald-700/20 gap-1">
              <CheckCircle2 className="size-3" />
              {completedCount} Completed
            </Badge>
            <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/25 gap-1">
              <AlertTriangle className="size-3" />
              {errorCount} Error
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 ml-1">
                  <Zap className="size-3.5" />
                  Deploy Agent
                </Button>
              </TooltipTrigger>
              <TooltipContent>Deploy a new AI agent</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ── Main Split View ──────────────────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 min-h-0">
          {/* ── Left Panel: Agent List ─────────────────────────────────────── */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Agents</CardTitle>
              <CardDescription>{agents.length} agents deployed</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full max-h-[calc(100vh-260px)]">
                <div className="p-2 space-y-1">
                  <AnimatePresence mode="popLayout">
                    {agents.map((agent) => {
                      const isSelected = selectedAgent === agent.id;

                      return (
                        <motion.div
                          key={agent.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <button
                            onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                            className={`w-full text-left rounded-lg p-3 transition-colors border-2 ${
                              isSelected
                                ? 'border-emerald-500/50 bg-emerald-500/5'
                                : 'border-transparent hover:bg-muted/60'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon + Progress Ring */}
                              <div className="relative flex-shrink-0">
                                <div
                                  className={`flex items-center justify-center size-10 rounded-lg ${
                                    agent.status === 'running'
                                      ? 'bg-emerald-500/10 text-emerald-600'
                                      : agent.status === 'error'
                                        ? 'bg-rose-500/10 text-rose-600'
                                        : agent.status === 'completed'
                                          ? 'bg-emerald-700/10 text-emerald-700'
                                          : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  <AgentIcon type={agent.type} className="size-5" />
                                </div>
                                {/* Circular progress indicator */}
                                {agent.status === 'running' && (
                                  <svg
                                    className="absolute -top-0.5 -right-0.5 size-4 animate-spin"
                                    style={{ animationDuration: '3s' }}
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      className="text-emerald-500/30"
                                    />
                                    <path
                                      d="M12 2a10 10 0 0 1 10 10"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      className="text-emerald-500"
                                    />
                                  </svg>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-medium truncate">{agent.name}</span>
                                  {getStatusBadge(agent.status)}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="size-3" />
                                    {agent.tasksCompleted} tasks
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {agent.lastActivity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* ── Right Panel: Agent Detail ──────────────────────────────────── */}
          <Card className="flex flex-col overflow-hidden">
            {selected ? (
              <AgentDetail agent={selected} tasks={agentTasks} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mx-auto">
                    <Eye className="size-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Select an agent to inspect</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Click on any agent from the list to view details
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ─── Agent Detail Sub-component ─────────────────────────────────────────────

function AgentDetail({ agent, tasks }: { agent: AgentInfo; tasks: TaskInfo[] }) {
  const capabilities = getAgentCapabilities(agent.type);
  const memories = getAgentMemories(agent.type);

  return (
    <ScrollArea className="h-full max-h-[calc(100vh-220px)]">
      <div className="p-4 sm:p-6 space-y-5">
        {/* Agent Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center size-12 rounded-xl ${
                  agent.status === 'running'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : agent.status === 'error'
                      ? 'bg-rose-500/10 text-rose-600'
                      : agent.status === 'completed'
                        ? 'bg-emerald-700/10 text-emerald-700'
                        : 'bg-muted text-muted-foreground'
                }`}
              >
                <AgentIcon type={agent.type} className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold">{agent.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{agent.type} Agent</p>
              </div>
            </div>
            {getStatusBadge(agent.status)}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className="text-2xl font-bold">{agent.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tasks Done</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className="text-2xl font-bold">{tasks.filter((t) => t.status === 'running').length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Active</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className="text-2xl font-bold">{agent.lastActivity}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Last Active</p>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                  disabled={agent.status === 'running'}
                >
                  <Play className="size-3.5" />
                  Start
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start agent</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                  disabled={agent.status !== 'running'}
                >
                  <Pause className="size-3.5" />
                  Pause
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pause agent</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                  disabled={agent.status === 'idle'}
                >
                  <Square className="size-3.5" />
                  Stop
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop agent</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <RotateCcw className="size-3.5" />
                  Restart
                </Button>
              </TooltipTrigger>
              <TooltipContent>Restart agent</TooltipContent>
            </Tooltip>
          </div>
        </motion.div>

        <Separator />

        {/* Tabs: Tasks / Capabilities / Memory */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="tasks" className="gap-1.5">
              <Activity className="size-3.5" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="capabilities" className="gap-1.5">
              <Settings className="size-3.5" />
              Capabilities
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-1.5">
              <Brain className="size-3.5" />
              Memory
            </TabsTrigger>
          </TabsList>

          {/* ── Tasks Tab ────────────────────────────────────────────────── */}
          <TabsContent value="tasks" className="mt-3">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border bg-card p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {task.status === 'running' ? (
                          <Loader2 className="size-4 text-emerald-500 animate-spin" />
                        ) : task.status === 'completed' ? (
                          <CheckCircle2 className="size-4 text-emerald-600" />
                        ) : task.status === 'failed' ? (
                          <XCircle className="size-4 text-rose-500" />
                        ) : (
                          <Clock className="size-4 text-amber-500" />
                        )}
                        <span className="text-sm font-medium">{task.type}</span>
                      </div>
                      {getTaskStatusBadge(task.status)}
                    </div>

                    <p className="text-xs text-muted-foreground pl-6">{task.input}</p>

                    {/* Progress bar for running tasks */}
                    {task.status === 'running' && (
                      <div className="pl-6">
                        <Progress
                          value={getProgressValue(task.status)}
                          className={`h-1.5 ${getProgressColor(task.status)}`}
                        />
                      </div>
                    )}

                    {task.output && (
                      <div className="pl-6 mt-1 rounded-md bg-emerald-500/5 border border-emerald-500/10 p-2.5">
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">{task.output}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pl-6 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {task.createdAt}
                      </span>
                      {task.duration && (
                        <span className="flex items-center gap-1">
                          <Zap className="size-3" />
                          {task.duration}s
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* ── Capabilities Tab ──────────────────────────────────────────── */}
          <TabsContent value="capabilities" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="flex items-center gap-2.5 rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center justify-center size-8 rounded-md bg-emerald-500/10 text-emerald-600">
                    <Zap className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{cap}</span>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ── Memory Tab ────────────────────────────────────────────────── */}
          <TabsContent value="memory" className="mt-3">
            <div className="space-y-2">
              {memories.map((mem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center justify-center size-8 rounded-md bg-amber-500/10 text-amber-600 flex-shrink-0 mt-0.5">
                    <Brain className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{mem.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="size-3" />
                      {mem.time}
                    </p>
                  </div>
                </motion.div>
              ))}
              {memories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No recent memory entries
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

export default AgentsModule;
