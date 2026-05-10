'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import type { PlanActualData, IntegrationData, VarianceAlert } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Database,
  Link2,
  Unlink,
  Loader2,
  Sparkles,
  Download,
  Bell,
  DollarSign,
  Activity,
  Shield,
  Info,
} from 'lucide-react';

// ─── Color Palette (emerald, rose, amber, cyan) ─────────────────────────
const COLORS = {
  emerald: '#10b981',
  emeraldLight: '#d1fae5',
  rose: '#f43f5e',
  roseLight: '#ffe4e6',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  cyan: '#06b6d4',
  cyanLight: '#cffafe',
  teal: '#14b8a6',
  tealLight: '#ccfbf1',
};

// ─── Formatting Helpers ──────────────────────────────────────────────────
function formatRM(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}RM${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}RM${(abs / 1_000).toFixed(1)}K`;
  return `${sign}RM${abs.toFixed(0)}`;
}

function formatRMFull(value: number): string {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    signDisplay: 'auto',
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function formatPeriod(period: string): string {
  const [year, month] = period.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('en', { month: 'short', year: '2-digit' });
}

// ─── Animation Variants ──────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─── Custom Recharts Tooltip ─────────────────────────────────────────────
function PlanActualTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} style={{ color: entry.color }} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {formatRM(entry.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Integration Icon Map ────────────────────────────────────────────────
const integrationMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  quickbooks: { label: 'QuickBooks', icon: Database, color: COLORS.emerald },
  xero: { label: 'Xero', icon: Database, color: COLORS.cyan },
  manual: { label: 'Manual Entry', icon: Activity, color: COLORS.amber },
};

// ─── Severity Config ─────────────────────────────────────────────────────
const severityConfig: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  critical: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', border: 'border-rose-500', icon: XCircle },
  warning: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', border: 'border-amber-500', icon: AlertTriangle },
  info: { color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', border: 'border-cyan-500', icon: Info },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function PlanActualsModule() {
  const { planActuals, integrations, varianceAlerts } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<PlanActualData['category']>('revenue');
  const [isSyncing, setIsSyncing] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [qbDialogOpen, setQbDialogOpen] = useState(false);
  const [xeroDialogOpen, setXeroDialogOpen] = useState(false);

  // ─── Filtered data by category ──────────────────────────────────
  const filteredData = useMemo(
    () => planActuals.filter((d) => d.category === selectedCategory),
    [planActuals, selectedCategory]
  );

  const tableFilteredData = useMemo(
    () => planActuals.filter((d) => d.category === selectedCategory),
    [planActuals, selectedCategory]
  );

  // ─── Chart data ─────────────────────────────────────────────────
  const chartData = useMemo(
    () =>
      filteredData.map((d) => ({
        name: formatPeriod(d.period),
        Planned: d.plannedAmount,
        Actual: d.actualAmount ?? 0,
        Variance: d.variance ?? 0,
      })),
    [filteredData]
  );

  // ─── KPI summaries ──────────────────────────────────────────────
  const kpiSummaries = useMemo(() => {
    const categories: PlanActualData['category'][] = ['revenue', 'expense', 'cashflow', 'profit'];
    return categories.map((cat) => {
      const items = planActuals.filter((d) => d.category === cat);
      const totalPlanned = items.reduce((s, d) => s + d.plannedAmount, 0);
      const totalActual = items.reduce((s, d) => s + (d.actualAmount ?? 0), 0);
      const totalVariance = totalActual - totalPlanned;
      const variancePercent = totalPlanned > 0 ? (totalVariance / totalPlanned) * 100 : 0;
      return { category: cat, totalPlanned, totalActual, totalVariance, variancePercent };
    });
  }, [planActuals]);

  const kpiMeta: Record<string, { label: string; icon: React.ElementType; color: string; bgLight: string }> = {
    revenue: { label: 'Revenue Variance', icon: TrendingUp, color: COLORS.emerald, bgLight: COLORS.emeraldLight },
    expense: { label: 'Expense Variance', icon: TrendingDown, color: COLORS.rose, bgLight: COLORS.roseLight },
    cashflow: { label: 'Cash Flow Variance', icon: DollarSign, color: COLORS.cyan, bgLight: COLORS.cyanLight },
    profit: { label: 'Profit Variance', icon: BarChart3, color: COLORS.teal, bgLight: COLORS.tealLight },
  };

  // ─── Can you afford to hire? calculator ─────────────────────────
  const hireCalculator = useMemo(() => {
    const cashflowItems = planActuals.filter((d) => d.category === 'cashflow');
    const totalActualCashflow = cashflowItems.reduce((s, d) => s + (d.actualAmount ?? 0), 0);
    const avgMonthlyCashflow = totalActualCashflow / Math.max(cashflowItems.length, 1);
    const newHireCost = 8000; // RM8K/month average
    const currentBurnRate = 187200;
    const currentCashPosition = 1680000;
    const runwayMonths = Math.max(Math.floor(currentCashPosition / currentBurnRate), 0);
    const runwayWithHire = Math.max(Math.floor(currentCashPosition / (currentBurnRate + newHireCost)), 0);
    const canAfford = avgMonthlyCashflow > newHireCost;
    const affordabilityScore = Math.min(Math.max((avgMonthlyCashflow / newHireCost) * 50, 0), 100);

    return {
      avgMonthlyCashflow,
      newHireCost,
      currentBurnRate,
      currentCashPosition,
      runwayMonths,
      runwayWithHire,
      canAfford,
      affordabilityScore,
    };
  }, [planActuals]);

  // ─── Active (non-dismissed) alerts ──────────────────────────────
  const activeAlerts = useMemo(
    () => varianceAlerts.filter((a) => !dismissedAlerts.has(a.id)),
    [varianceAlerts, dismissedAlerts]
  );

  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical');
  const warningAlerts = activeAlerts.filter((a) => a.severity === 'warning');
  const infoAlerts = activeAlerts.filter((a) => a.severity === 'info');

  // ─── Sync simulation ────────────────────────────────────────────
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(id));
  };

  // ─── Category label helper ──────────────────────────────────────
  const categoryLabel = (cat: string) => {
    const map: Record<string, string> = { revenue: 'Revenue', expense: 'Expense', cashflow: 'Cash Flow', profit: 'Profit' };
    return map[cat] ?? cat;
  };

  const sourceLabel = (src: string) => {
    const map: Record<string, string> = { manual: 'Manual', quickbooks: 'QuickBooks', xero: 'Xero' };
    return map[src] ?? src;
  };

  // ─── Variance color helpers ─────────────────────────────────────
  // For revenue/profit/cashflow: positive variance = good (green), negative = bad (red)
  // For expense: positive variance = bad (overspend, red), negative = good (underspend, green)
  const getVarianceColor = (category: string, variance: number | null) => {
    if (variance === null) return 'text-muted-foreground';
    if (category === 'expense') {
      return variance > 0 ? 'text-rose-500' : variance < 0 ? 'text-emerald-500' : 'text-muted-foreground';
    }
    return variance > 0 ? 'text-emerald-500' : variance < 0 ? 'text-rose-500' : 'text-muted-foreground';
  };

  const getVarianceBg = (category: string, variance: number | null) => {
    if (variance === null) return '';
    if (category === 'expense') {
      return variance > 0 ? 'bg-rose-500/10' : variance < 0 ? 'bg-emerald-500/10' : '';
    }
    return variance > 0 ? 'bg-emerald-500/10' : variance < 0 ? 'bg-rose-500/10' : '';
  };

  // ─── Last sync formatted ────────────────────────────────────────
  const formatLastSync = (iso: string | null) => {
    if (!iso) return 'Never';
    const d = new Date(iso);
    return d.toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ─── Header ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Plan vs Actuals</h2>
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="gap-1 text-xs animate-pulse">
                <AlertTriangle className="h-3 w-3" />
                {criticalAlerts.length} Critical
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time financial tracking against your forecasts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            className="gap-2"
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync Now
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* ─── Integration Bar ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {integrations.map((integration, i) => {
          const meta = integrationMeta[integration.type];
          const Icon = meta.icon;
          const isConnected = integration.status === 'connected';
          const isError = integration.status === 'error';

          return (
            <motion.div
              key={integration.type}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className={cn(
                'relative overflow-hidden',
                isConnected && 'border-l-4 border-l-emerald-500',
                isError && 'border-l-4 border-l-rose-500',
                !isConnected && !isError && 'border-l-4 border-l-muted'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${meta.color}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: meta.color }} />
                      </div>
                      <span className="font-semibold text-sm">{meta.label}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] gap-1',
                        isConnected && 'border-emerald-500/30 text-emerald-600 bg-emerald-500/10',
                        isError && 'border-rose-500/30 text-rose-600 bg-rose-500/10',
                        !isConnected && !isError && 'border-muted text-muted-foreground'
                      )}
                    >
                      {isConnected && <CheckCircle2 className="h-3 w-3" />}
                      {isError && <XCircle className="h-3 w-3" />}
                      {!isConnected && !isError && <Unlink className="h-3 w-3" />}
                      {isConnected ? 'Connected' : isError ? 'Error' : 'Disconnected'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Last sync: {formatLastSync(integration.lastSync)}</span>
                    <span className="capitalize">{integration.syncFrequency}</span>
                  </div>

                  {integration.type === 'quickbooks' && !isConnected && (
                    <Dialog open={qbDialogOpen} onOpenChange={setQbDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full gap-2 text-xs" variant="outline">
                          <Link2 className="h-3.5 w-3.5" />
                          Connect QuickBooks
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-emerald-500" />
                            Connect QuickBooks
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-muted-foreground">
                            Connect your QuickBooks account to automatically import actual financial data
                            and compare against your AI-generated forecasts.
                          </p>
                          <Separator />
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              Automatic monthly data sync
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              Real-time variance alerts
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              P&L and cash flow auto-import
                            </div>
                          </div>
                          <Button
                            className="w-full gap-2"
                            onClick={() => setQbDialogOpen(false)}
                          >
                            <Sparkles className="h-4 w-4" />
                            Authorize Connection
                          </Button>
                          <p className="text-[10px] text-muted-foreground text-center">
                            You will be redirected to QuickBooks OAuth for authorization
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {integration.type === 'xero' && !isConnected && (
                    <Dialog open={xeroDialogOpen} onOpenChange={setXeroDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full gap-2 text-xs" variant="outline">
                          <Link2 className="h-3.5 w-3.5" />
                          Connect Xero
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-cyan-500" />
                            Connect Xero
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-muted-foreground">
                            Connect your Xero account to seamlessly import actual financial data
                            and track variance against your AI-generated forecasts.
                          </p>
                          <Separator />
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                              Automatic bank feed reconciliation
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                              Invoice and expense tracking
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                              Multi-currency support (MYR, SGD, IDR)
                            </div>
                          </div>
                          <Button
                            className="w-full gap-2"
                            onClick={() => setXeroDialogOpen(false)}
                          >
                            <Sparkles className="h-4 w-4" />
                            Authorize Connection
                          </Button>
                          <p className="text-[10px] text-muted-foreground text-center">
                            You will be redirected to Xero OAuth for authorization
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {integration.type === 'manual' && (
                    <Button size="sm" className="w-full gap-2 text-xs" variant="secondary" disabled>
                      <Activity className="h-3.5 w-3.5" />
                      Manual Entry Active
                    </Button>
                  )}

                  {isConnected && integration.type !== 'manual' && (
                    <Button size="sm" className="w-full gap-2 text-xs" variant="ghost">
                      <Unlink className="h-3.5 w-3.5" />
                      Disconnect
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Main Tabs ─────────────────────────────────────────────── */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
            <BarChart3 className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="detailed" className="gap-1.5 text-xs sm:text-sm">
            <Activity className="h-3.5 w-3.5" />
            Detailed Table
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-1.5 text-xs sm:text-sm">
            <Bell className="h-3.5 w-3.5" />
            Variance Alerts
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-[20px] flex items-center justify-center text-[10px] px-1.5">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ━━━ Tab 1: Overview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TabsContent value="overview" className="space-y-6">
          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiSummaries.map((kpi, i) => {
              const meta = kpiMeta[kpi.category];
              const Icon = meta.icon;
              const isPositiveVariance = kpi.category === 'expense'
                ? kpi.totalVariance < 0
                : kpi.totalVariance > 0;

              return (
                <motion.div
                  key={kpi.category}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      selectedCategory === kpi.category && 'ring-2 ring-offset-2 ring-offset-background',
                      selectedCategory === kpi.category && kpi.category === 'revenue' && 'ring-emerald-500',
                      selectedCategory === kpi.category && kpi.category === 'expense' && 'ring-rose-500',
                      selectedCategory === kpi.category && kpi.category === 'cashflow' && 'ring-cyan-500',
                      selectedCategory === kpi.category && kpi.category === 'profit' && 'ring-teal-500'
                    )}
                    onClick={() => setSelectedCategory(kpi.category)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{meta.label}</p>
                          <p className="text-2xl font-bold" style={{ color: isPositiveVariance ? COLORS.emerald : COLORS.rose }}>
                            {formatRM(kpi.totalVariance)}
                          </p>
                        </div>
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: meta.bgLight }}
                        >
                          <Icon className="h-5 w-5" style={{ color: meta.color }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {isPositiveVariance ? (
                          <>
                            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-500">
                              {formatPercent(kpi.variancePercent)}
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
                            <span className="text-xs font-medium text-rose-500">
                              {formatPercent(kpi.variancePercent)}
                            </span>
                          </>
                        )}
                        <span className="text-xs text-muted-foreground ml-1">vs plan</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(Math.abs(kpi.variancePercent) * 3, 100)}%`,
                            backgroundColor: isPositiveVariance ? COLORS.emerald : COLORS.rose,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Composed Chart: Planned vs Actual */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">
                      {categoryLabel(selectedCategory)}: Plan vs Actual
                    </CardTitle>
                    <CardDescription>
                      Comparing AI-generated forecasts against actual monthly numbers
                    </CardDescription>
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={(v) => setSelectedCategory(v as PlanActualData['category'])}
                  >
                    <SelectTrigger className="w-[160px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="cashflow">Cash Flow</SelectItem>
                      <SelectItem value="profit">Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(v) => formatRM(v)}
                      />
                      <Tooltip content={<PlanActualTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="Planned"
                        name="Planned"
                        fill={COLORS.amber}
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                        fillOpacity={0.75}
                      />
                      <Bar
                        dataKey="Actual"
                        name="Actual"
                        fill={COLORS.emerald}
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                        fillOpacity={0.85}
                      />
                      <Line
                        type="monotone"
                        dataKey="Variance"
                        name="Variance"
                        stroke={COLORS.rose}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: COLORS.rose }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Variance Trend Area Chart */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Variance Trend</CardTitle>
                <CardDescription>
                  Period-over-period variance for {categoryLabel(selectedCategory).toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(v) => formatRM(v)}
                      />
                      <Tooltip content={<PlanActualTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="Variance"
                        name="Variance"
                        stroke={COLORS.rose}
                        fill={COLORS.rose}
                        fillOpacity={0.15}
                        strokeWidth={2.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ━━━ Tab 2: Detailed Table ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TabsContent value="detailed" className="space-y-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Detailed Plan vs Actual Breakdown</CardTitle>
                    <CardDescription>
                      Monthly comparison with variance analysis
                    </CardDescription>
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={(v) => setSelectedCategory(v as PlanActualData['category'])}
                  >
                    <SelectTrigger className="w-[160px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="cashflow">Cash Flow</SelectItem>
                      <SelectItem value="profit">Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[520px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Planned</TableHead>
                        <TableHead className="text-right">Actual</TableHead>
                        <TableHead className="text-right">Variance (RM)</TableHead>
                        <TableHead className="text-right">Variance (%)</TableHead>
                        <TableHead className="text-center">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableFilteredData.map((row, i) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {formatPeriod(row.period)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatRMFull(row.plannedAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.actualAmount !== null ? formatRMFull(row.actualAmount) : (
                              <span className="text-muted-foreground italic">Pending</span>
                            )}
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-right font-semibold',
                              getVarianceColor(row.category, row.variance),
                              getVarianceBg(row.category, row.variance),
                              'px-3 py-2 rounded'
                            )}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {row.variance !== null && row.variance > 0 ? (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              ) : row.variance !== null && row.variance < 0 ? (
                                <ArrowDownRight className="h-3.5 w-3.5" />
                              ) : null}
                              {row.variance !== null ? formatRMFull(row.variance) : '—'}
                            </div>
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-right font-semibold',
                              getVarianceColor(row.category, row.variancePercent)
                            )}
                          >
                            {row.variancePercent !== null ? formatPercent(row.variancePercent) : '—'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px]',
                                row.source === 'quickbooks' && 'border-emerald-500/30 text-emerald-600',
                                row.source === 'xero' && 'border-cyan-500/30 text-cyan-600',
                                row.source === 'manual' && 'border-amber-500/30 text-amber-600'
                              )}
                            >
                              {sourceLabel(row.source)}
                            </Badge>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Table Summary */}
                <Separator className="my-4" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(() => {
                    const items = tableFilteredData;
                    const totalPlanned = items.reduce((s, d) => s + d.plannedAmount, 0);
                    const totalActual = items.reduce((s, d) => s + (d.actualAmount ?? 0), 0);
                    const totalVariance = totalActual - totalPlanned;
                    const avgVariancePercent = items.length > 0
                      ? items.reduce((s, d) => s + (d.variancePercent ?? 0), 0) / items.filter(d => d.variancePercent !== null).length
                      : 0;
                    return (
                      <>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Total Planned</p>
                          <p className="text-sm font-bold">{formatRM(totalPlanned)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Total Actual</p>
                          <p className="text-sm font-bold">{formatRM(totalActual)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Net Variance</p>
                          <p className={cn('text-sm font-bold', getVarianceColor(selectedCategory, totalVariance))}>
                            {formatRM(totalVariance)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Avg Variance %</p>
                          <p className={cn('text-sm font-bold', getVarianceColor(selectedCategory, avgVariancePercent))}>
                            {formatPercent(avgVariancePercent)}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ━━━ Tab 3: Variance Alerts ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TabsContent value="alerts" className="space-y-6">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="border-rose-500/30 bg-rose-500/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
                      <XCircle className="h-4 w-4 text-rose-500" />
                    </div>
                    <CardTitle className="text-lg text-rose-600 dark:text-rose-400">Critical Alerts</CardTitle>
                    <Badge variant="destructive" className="animate-pulse">{criticalAlerts.length}</Badge>
                  </div>
                  <CardDescription>Requires immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {criticalAlerts.map((alert, i) => {
                    const config = severityConfig[alert.severity];
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          'rounded-lg border p-4',
                          config.bg,
                          'animate-pulse'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <config.icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.color)} />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="destructive" className="text-[10px]">
                                  {alert.type.replace(/_/g, ' ').toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">
                                  {formatPeriod(alert.period)}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">
                                  {categoryLabel(alert.category)}
                                </Badge>
                              </div>
                              <p className="text-sm">{alert.message}</p>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5 text-rose-500" />
                                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                                  {formatRMFull(alert.amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="shrink-0 text-xs"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Warning Alerts */}
          {warningAlerts.length > 0 && (
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="border-amber-500/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <CardTitle className="text-lg text-amber-600 dark:text-amber-400">Warnings</CardTitle>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">{warningAlerts.length}</Badge>
                  </div>
                  <CardDescription>Monitor closely — may escalate if unaddressed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {warningAlerts.map((alert, i) => {
                    const config = severityConfig[alert.severity];
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn('rounded-lg border p-4', config.bg)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <config.icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.color)} />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
                                  {alert.type.replace(/_/g, ' ').toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">
                                  {formatPeriod(alert.period)}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">
                                  {categoryLabel(alert.category)}
                                </Badge>
                              </div>
                              <p className="text-sm">{alert.message}</p>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                  {formatRMFull(alert.amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="shrink-0 text-xs"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Info Alerts */}
          {infoAlerts.length > 0 && (
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="border-cyan-500/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Info className="h-4 w-4 text-cyan-500" />
                    </div>
                    <CardTitle className="text-lg text-cyan-600 dark:text-cyan-400">Informational</CardTitle>
                    <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/30">{infoAlerts.length}</Badge>
                  </div>
                  <CardDescription>FYI — no immediate action required</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {infoAlerts.map((alert, i) => {
                    const config = severityConfig[alert.severity];
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn('rounded-lg border p-4', config.bg)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <config.icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.color)} />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/30 text-[10px]">
                                  {alert.type.replace(/_/g, ' ').toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">
                                  {formatPeriod(alert.period)}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">
                                  {categoryLabel(alert.category)}
                                </Badge>
                              </div>
                              <p className="text-sm">{alert.message}</p>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5 text-cyan-500" />
                                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                                  {formatRMFull(alert.amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="shrink-0 text-xs"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* No alerts message */}
          {activeAlerts.length === 0 && (
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold">All Clear</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      No active variance alerts. Your financials are tracking within acceptable thresholds.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ─── Can You Afford to Hire? ────────────────────────────── */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className={cn(
              'border-l-4',
              hireCalculator.canAfford ? 'border-l-emerald-500' : 'border-l-rose-500'
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg',
                    hireCalculator.canAfford ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                  )}>
                    <Shield className={cn(
                      'h-4 w-4',
                      hireCalculator.canAfford ? 'text-emerald-500' : 'text-rose-500'
                    )} />
                  </div>
                  <CardTitle className="text-lg">Can You Afford to Hire?</CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px]',
                      hireCalculator.canAfford
                        ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/10'
                        : 'border-rose-500/30 text-rose-600 bg-rose-500/10'
                    )}
                  >
                    {hireCalculator.canAfford ? 'AFFORDABLE' : 'CAUTION'}
                  </Badge>
                </div>
                <CardDescription>
                  Cash flow runway assessment based on actual financial data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Affordability Score */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Affordability Score</span>
                      <span className="font-semibold">{hireCalculator.affordabilityScore.toFixed(0)}%</span>
                    </div>
                    <Progress
                      value={hireCalculator.affordabilityScore}
                      className={cn(
                        'h-2',
                        hireCalculator.affordabilityScore >= 70 ? '[&>div]:bg-emerald-500' :
                        hireCalculator.affordabilityScore >= 40 ? '[&>div]:bg-amber-500' :
                        '[&>div]:bg-rose-500'
                      )}
                    />
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cash Position</p>
                    <p className="text-lg font-bold mt-1">{formatRM(hireCalculator.currentCashPosition)}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Monthly Cash Flow</p>
                    <p className={cn(
                      'text-lg font-bold mt-1',
                      hireCalculator.avgMonthlyCashflow >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    )}>
                      {formatRM(hireCalculator.avgMonthlyCashflow)}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">New Hire Cost</p>
                    <p className="text-lg font-bold mt-1 text-rose-500">{formatRM(hireCalculator.newHireCost)}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Burn Rate</p>
                    <p className="text-lg font-bold mt-1">{formatRM(hireCalculator.currentBurnRate)}/mo</p>
                  </div>
                </div>

                {/* Runway Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={cn(
                    'rounded-lg border p-4',
                    hireCalculator.runwayMonths >= 12 ? 'border-emerald-500/30 bg-emerald-500/5' :
                    hireCalculator.runwayMonths >= 6 ? 'border-amber-500/30 bg-amber-500/5' :
                    'border-rose-500/30 bg-rose-500/5'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Current Runway</span>
                    </div>
                    <p className={cn(
                      'text-3xl font-bold',
                      hireCalculator.runwayMonths >= 12 ? 'text-emerald-600 dark:text-emerald-400' :
                      hireCalculator.runwayMonths >= 6 ? 'text-amber-600 dark:text-amber-400' :
                      'text-rose-600 dark:text-rose-400'
                    )}>
                      {hireCalculator.runwayMonths} months
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Without new hire at {formatRM(hireCalculator.currentBurnRate)}/mo
                    </p>
                  </div>
                  <div className={cn(
                    'rounded-lg border p-4',
                    hireCalculator.runwayWithHire >= 12 ? 'border-emerald-500/30 bg-emerald-500/5' :
                    hireCalculator.runwayWithHire >= 6 ? 'border-amber-500/30 bg-amber-500/5' :
                    'border-rose-500/30 bg-rose-500/5'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Runway with New Hire</span>
                    </div>
                    <p className={cn(
                      'text-3xl font-bold',
                      hireCalculator.runwayWithHire >= 12 ? 'text-emerald-600 dark:text-emerald-400' :
                      hireCalculator.runwayWithHire >= 6 ? 'text-amber-600 dark:text-amber-400' :
                      'text-rose-600 dark:text-rose-400'
                    )}>
                      {hireCalculator.runwayWithHire} months
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      With hire at {formatRM(hireCalculator.currentBurnRate + hireCalculator.newHireCost)}/mo
                    </p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={cn(
                  'rounded-lg border p-4 flex items-start gap-3',
                  hireCalculator.canAfford
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-rose-500/20 bg-rose-500/5'
                )}>
                  <Sparkles className={cn(
                    'h-5 w-5 mt-0.5 shrink-0',
                    hireCalculator.canAfford ? 'text-emerald-500' : 'text-rose-500'
                  )} />
                  <div>
                    <p className={cn(
                      'font-semibold text-sm',
                      hireCalculator.canAfford ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    )}>
                      {hireCalculator.canAfford
                        ? 'Yes — Hiring is affordable at current cash flow levels'
                        : 'Caution — Hiring may strain cash flow at current levels'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hireCalculator.canAfford
                        ? `Your average monthly cash flow (RM${hireCalculator.avgMonthlyCashflow.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}) exceeds the estimated hire cost (RM${hireCalculator.newHireCost.toLocaleString()}/mo). Runway would decrease from ${hireCalculator.runwayMonths} to ${hireCalculator.runwayWithHire} months.`
                        : `Your average monthly cash flow (RM${hireCalculator.avgMonthlyCashflow.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}) does not comfortably cover the estimated hire cost (RM${hireCalculator.newHireCost.toLocaleString()}/mo). Consider waiting for improved cash flow or reducing the hire cost.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dismissed alerts info */}
          {dismissedAlerts.size > 0 && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setDismissedAlerts(new Set())}
              >
                Restore {dismissedAlerts.size} dismissed alert{dismissedAlerts.size > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
