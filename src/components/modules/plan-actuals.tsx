'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type { PlanActualData, IntegrationData, VarianceAlert } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  Plus,
  Pencil,
  Trash2,
  UserPlus,
  ThumbsUp,
  ThumbsDown,
  Gauge,
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

// ─── Affordability Gauge SVG ─────────────────────────────────────────────
function AffordabilityGauge({ score }: { score: number }) {
  const radius = 60;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;
  const color = score >= 70 ? COLORS.emerald : score >= 40 ? COLORS.amber : COLORS.rose;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="160" height="90" viewBox="0 0 160 90">
        {/* Background arc */}
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: 'stroke-dasharray 1s ease-out' }}
        />
        {/* Score text */}
        <text
          x="80"
          y="72"
          textAnchor="middle"
          className="fill-foreground text-2xl font-bold"
          style={{ fontSize: '24px', fontWeight: 700 }}
        >
          {score.toFixed(0)}
        </text>
        <text
          x="80"
          y="87"
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: '10px' }}
        >
          out of 100
        </text>
      </svg>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function PlanActualsModule() {
  const { planActuals, integrations, varianceAlerts, addPlanActual, updatePlanActual } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<PlanActualData['category']>('revenue');
  const [isSyncing, setIsSyncing] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [qbDialogOpen, setQbDialogOpen] = useState(false);
  const [xeroDialogOpen, setXeroDialogOpen] = useState(false);

  // ─── Add/Edit Entry Dialog State ──────────────────────────────
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlanActualData | null>(null);
  const [entryCategory, setEntryCategory] = useState<PlanActualData['category']>('revenue');
  const [entryPeriod, setEntryPeriod] = useState('');
  const [entryPlannedAmount, setEntryPlannedAmount] = useState('');
  const [entryActualAmount, setEntryActualAmount] = useState('');
  const [entrySource, setEntrySource] = useState<PlanActualData['source']>('manual');

  // ─── Delete Confirmation ──────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<PlanActualData | null>(null);

  // ─── Hire Calculator State ────────────────────────────────────
  const [hireCost, setHireCost] = useState('8000');

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
    const newHireCost = parseFloat(hireCost) || 8000;
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
  }, [planActuals, hireCost]);

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
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Data synced successfully');
    }, 2000);
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

  // ─── Open Add Entry Dialog ──────────────────────────────────────
  const openAddDialog = useCallback(() => {
    setEditingEntry(null);
    setEntryCategory('revenue');
    setEntryPeriod('');
    setEntryPlannedAmount('');
    setEntryActualAmount('');
    setEntrySource('manual');
    setEntryDialogOpen(true);
  }, []);

  // ─── Open Edit Entry Dialog ─────────────────────────────────────
  const openEditDialog = useCallback((entry: PlanActualData) => {
    setEditingEntry(entry);
    setEntryCategory(entry.category);
    setEntryPeriod(entry.period);
    setEntryPlannedAmount(entry.plannedAmount.toString());
    setEntryActualAmount(entry.actualAmount !== null ? entry.actualAmount.toString() : '');
    setEntrySource(entry.source);
    setEntryDialogOpen(true);
  }, []);

  // ─── Handle Save Entry (Add or Edit) ────────────────────────────
  const handleSaveEntry = useCallback(() => {
    // Validate period format
    const periodRegex = /^\d{4}-\d{2}$/;
    if (!periodRegex.test(entryPeriod)) {
      toast.error('Period must be in YYYY-MM format (e.g. 2025-04)');
      return;
    }

    const plannedAmount = parseFloat(entryPlannedAmount);
    if (isNaN(plannedAmount) || plannedAmount <= 0) {
      toast.error('Planned amount must be a positive number');
      return;
    }

    const actualAmountRaw = entryActualAmount.trim();
    const actualAmount = actualAmountRaw !== '' ? parseFloat(actualAmountRaw) : null;

    if (actualAmountRaw !== '' && (isNaN(actualAmount!) || actualAmount! < 0)) {
      toast.error('Actual amount must be a non-negative number');
      return;
    }

    // Calculate variance
    const variance = actualAmount !== null ? actualAmount - plannedAmount : null;
    const variancePercent = variance !== null ? (variance / plannedAmount) * 100 : null;

    if (editingEntry) {
      // Update existing entry
      updatePlanActual(editingEntry.id, {
        category: entryCategory,
        period: entryPeriod,
        plannedAmount,
        actualAmount,
        variance,
        variancePercent,
        source: entrySource,
      });
      toast.success(`Entry for ${formatPeriod(entryPeriod)} updated successfully`);
    } else {
      // Create new entry
      const newEntry: PlanActualData = {
        id: `pa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category: entryCategory,
        period: entryPeriod,
        plannedAmount,
        actualAmount,
        variance,
        variancePercent,
        source: entrySource,
      };
      addPlanActual(newEntry);
      toast.success(`New ${categoryLabel(entryCategory)} entry for ${formatPeriod(entryPeriod)} added`);
    }

    setEntryDialogOpen(false);
  }, [editingEntry, entryCategory, entryPeriod, entryPlannedAmount, entryActualAmount, entrySource, addPlanActual, updatePlanActual]);

  // ─── Handle Delete Entry ────────────────────────────────────────
  const handleDeleteEntry = useCallback(() => {
    if (!deleteTarget) return;
    // Remove from store by filtering
    useAppStore.setState((s) => ({
      planActuals: s.planActuals.filter((pa) => pa.id !== deleteTarget.id),
    }));
    toast.success(`Entry for ${formatPeriod(deleteTarget.period)} deleted`);
    setDeleteTarget(null);
  }, [deleteTarget]);

  // ─── Handle Export ──────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const csvRows = [
      ['Category', 'Period', 'Planned (RM)', 'Actual (RM)', 'Variance (RM)', 'Variance (%)', 'Source'],
      ...planActuals.map((d) => [
        categoryLabel(d.category),
        d.period,
        d.plannedAmount.toString(),
        d.actualAmount?.toString() ?? 'Pending',
        d.variance?.toString() ?? '—',
        d.variancePercent?.toFixed(1) ?? '—',
        sourceLabel(d.source),
      ]),
    ];
    const csvContent = csvRows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-vs-actuals-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported as CSV');
  }, [planActuals]);

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
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={openAddDialog}
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
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
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* ─── Add/Edit Entry Dialog ────────────────────────────────── */}
      <Dialog open={entryDialogOpen} onOpenChange={setEntryDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingEntry ? (
                <>
                  <Pencil className="h-5 w-5 text-amber-500" />
                  Edit Plan vs Actual Entry
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-emerald-500" />
                  Add Plan vs Actual Entry
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {editingEntry
                ? 'Update the planned and actual amounts for this period.'
                : 'Enter planned and actual financial data for a specific period.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={entryCategory} onValueChange={(v) => setEntryCategory(v as PlanActualData['category'])}>
                <SelectTrigger>
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

            {/* Period */}
            <div className="space-y-2">
              <Label>Period (YYYY-MM)</Label>
              <Input
                placeholder="e.g. 2025-04"
                value={entryPeriod}
                onChange={(e) => setEntryPeriod(e.target.value)}
                maxLength={7}
              />
              <p className="text-[10px] text-muted-foreground">Format: YYYY-MM (e.g. 2025-04 for April 2025)</p>
            </div>

            {/* Planned Amount */}
            <div className="space-y-2">
              <Label>Planned Amount (RM)</Label>
              <Input
                type="number"
                placeholder="e.g. 250000"
                value={entryPlannedAmount}
                onChange={(e) => setEntryPlannedAmount(e.target.value)}
                min="0"
              />
            </div>

            {/* Actual Amount */}
            <div className="space-y-2">
              <Label>Actual Amount (RM) — optional</Label>
              <Input
                type="number"
                placeholder="Leave empty if pending"
                value={entryActualAmount}
                onChange={(e) => setEntryActualAmount(e.target.value)}
                min="0"
              />
              <p className="text-[10px] text-muted-foreground">Leave empty to mark as &quot;Pending&quot;</p>
            </div>

            {/* Source */}
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={entrySource} onValueChange={(v) => setEntrySource(v as PlanActualData['source'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="quickbooks">QuickBooks</SelectItem>
                  <SelectItem value="xero">Xero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auto-calculated variance preview */}
            {entryPlannedAmount && entryActualAmount && (
              <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Auto-calculated Variance</p>
                <div className="flex items-center gap-3 text-sm">
                  <span>
                    Variance:{' '}
                    <span className={cn(
                      'font-bold',
                      getVarianceColor(entryCategory, parseFloat(entryActualAmount) - parseFloat(entryPlannedAmount))
                    )}>
                      {formatRMFull(parseFloat(entryActualAmount) - parseFloat(entryPlannedAmount))}
                    </span>
                  </span>
                  <span>
                    ({formatPercent(((parseFloat(entryActualAmount) - parseFloat(entryPlannedAmount)) / parseFloat(entryPlannedAmount)) * 100)})
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setEntryDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSaveEntry}
            >
              {editingEntry ? (
                <>
                  <Pencil className="h-4 w-4" />
                  Update Entry
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Entry
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-500" />
              Delete Entry
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {deleteTarget ? categoryLabel(deleteTarget.category) : ''} entry for{' '}
              {deleteTarget ? formatPeriod(deleteTarget.period) : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEntry}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                            onClick={() => {
                              setQbDialogOpen(false);
                              toast.success('QuickBooks connection authorized');
                            }}
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
                            onClick={() => {
                              setXeroDialogOpen(false);
                              toast.success('Xero connection authorized');
                            }}
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
          <TabsTrigger value="hire" className="gap-1.5 text-xs sm:text-sm">
            <UserPlus className="h-3.5 w-3.5" />
            Hire Calculator
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
                      Monthly comparison with variance analysis — click a row to edit
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
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableFilteredData.map((row, i) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => openEditDialog(row)}
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
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-amber-500/10 hover:text-amber-600"
                                onClick={() => openEditDialog(row)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-rose-500/10 hover:text-rose-600"
                                onClick={() => setDeleteTarget(row)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
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

        {/* ━━━ Tab 3: Hire Calculator ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TabsContent value="hire" className="space-y-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className={cn(
              'border-l-4 overflow-hidden',
              hireCalculator.canAfford ? 'border-l-emerald-500' : 'border-l-rose-500'
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    hireCalculator.canAfford ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                  )}>
                    <UserPlus className={cn(
                      'h-5 w-5',
                      hireCalculator.canAfford ? 'text-emerald-500' : 'text-rose-500'
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Can You Afford to Hire?</CardTitle>
                    <CardDescription>
                      Cash flow runway assessment based on actual financial data
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* YES/NO Recommendation Banner */}
                <div className={cn(
                  'rounded-xl p-5 flex items-center gap-4',
                  hireCalculator.canAfford
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-rose-500/10 border border-rose-500/20'
                )}>
                  <div className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-full shrink-0',
                    hireCalculator.canAfford ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                  )}>
                    {hireCalculator.canAfford ? (
                      <ThumbsUp className="h-7 w-7 text-emerald-600" />
                    ) : (
                      <ThumbsDown className="h-7 w-7 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      'text-xl font-bold',
                      hireCalculator.canAfford ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    )}>
                      {hireCalculator.canAfford ? 'YES — You Can Afford to Hire' : 'NO — Hiring Is Not Recommended'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {hireCalculator.canAfford
                        ? `Your avg monthly cash flow (RM${hireCalculator.avgMonthlyCashflow.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}) comfortably exceeds the estimated hire cost.`
                        : `Your avg monthly cash flow (RM${hireCalculator.avgMonthlyCashflow.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}) does not comfortably cover the hire cost.`}
                    </p>
                  </div>
                </div>

                {/* Gauge + Editable Hire Cost Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Affordability Score Gauge */}
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-muted/20 p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Gauge className="h-4 w-4" />
                      Affordability Score
                    </div>
                    <AffordabilityGauge score={hireCalculator.affordabilityScore} />
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        hireCalculator.affordabilityScore >= 70
                          ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/10'
                          : hireCalculator.affordabilityScore >= 40
                            ? 'border-amber-500/30 text-amber-600 bg-amber-500/10'
                            : 'border-rose-500/30 text-rose-600 bg-rose-500/10'
                      )}
                    >
                      {hireCalculator.affordabilityScore >= 70
                        ? 'STRONG'
                        : hireCalculator.affordabilityScore >= 40
                          ? 'MODERATE'
                          : 'WEAK'}
                    </Badge>
                  </div>

                  {/* Editable Parameters */}
                  <div className="space-y-4">
                    {/* New Hire Cost (editable) */}
                    <div className="rounded-xl border p-4 space-y-3">
                      <Label className="text-sm font-medium">New Hire Cost (RM/month)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={hireCost}
                          onChange={(e) => setHireCost(e.target.value)}
                          min="0"
                          className="text-lg font-bold"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => {
                            setHireCost('8000');
                            toast.info('Hire cost reset to RM8,000/mo default');
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Default: RM8,000/mo (average Malaysian SME salary)</p>
                    </div>

                    {/* Current Monthly Cash Flow */}
                    <div className="rounded-xl border p-4">
                      <p className="text-sm text-muted-foreground">Current Monthly Cash Flow</p>
                      <p className={cn(
                        'text-2xl font-bold mt-1',
                        hireCalculator.avgMonthlyCashflow >= 0 ? 'text-emerald-500' : 'text-rose-500'
                      )}>
                        {formatRM(hireCalculator.avgMonthlyCashflow)}/mo
                      </p>
                    </div>
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

                {/* Runway Impact */}
                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Runway Impact</span>
                    <span className="font-semibold text-rose-500">
                      -{hireCalculator.runwayMonths - hireCalculator.runwayWithHire} months
                    </span>
                  </div>
                  <Progress
                    value={((hireCalculator.runwayMonths - hireCalculator.runwayWithHire) / hireCalculator.runwayMonths) * 100}
                    className="h-2 [&>div]:bg-rose-500"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Hiring would reduce your runway from {hireCalculator.runwayMonths} to {hireCalculator.runwayWithHire} months
                    (a reduction of {hireCalculator.runwayMonths - hireCalculator.runwayWithHire} months)
                  </p>
                </div>

                {/* Detailed Recommendation */}
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
                        ? 'Hiring is affordable at current cash flow levels'
                        : 'Hiring may strain cash flow at current levels'}
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
        </TabsContent>

        {/* ━━━ Tab 4: Variance Alerts ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
