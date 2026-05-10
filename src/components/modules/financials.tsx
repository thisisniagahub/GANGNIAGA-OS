'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AreaChart,
  BarChart,
  LineChart,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  RefreshCw,
} from 'lucide-react';

// ─── Color Palette (emerald, amber, rose, cyan, teal) ───
const COLORS = {
  emerald: '#10b981',
  emeraldLight: '#d1fae5',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  rose: '#f43f5e',
  roseLight: '#ffe4e6',
  cyan: '#06b6d4',
  cyanLight: '#cffafe',
  teal: '#14b8a6',
  tealLight: '#ccfbf1',
};

const PIE_COLORS = [
  COLORS.emerald,
  COLORS.amber,
  COLORS.cyan,
  COLORS.teal,
  COLORS.rose,
  '#8b5cf6',
];

// ─── Formatting Helpers ───
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Animation Variants ───
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

// ─── Custom Tooltip ───
function CurrencyTooltip({ active, payload, label }: any) {
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
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Revenue Breakdown Data ───
const revenueBreakdown = [
  { name: 'SaaS Subscriptions', value: 178500, color: COLORS.emerald },
  { name: 'Professional Services', value: 63200, color: COLORS.cyan },
  { name: 'Custom Integrations', value: 42800, color: COLORS.teal },
];

// ─── P&L Data ───
const plData = [
  { label: 'Revenue', values: ['SaaS Subscriptions', '$178.5K', '62.7%'], bold: true, indent: false },
  { label: '', values: ['Professional Services', '$63.2K', '22.2%'], bold: false, indent: true },
  { label: '', values: ['Custom Integrations', '$42.8K', '15.1%'], bold: false, indent: true },
  { label: 'Total Revenue', values: ['', '$284.5K', '100%'], bold: true, indent: false },
  { label: 'Cost of Revenue', values: ['', '($42.7K)', '15.0%'], bold: true, indent: false },
  { label: 'Gross Profit', values: ['', '$241.8K', '85.0%'], bold: true, indent: false },
  { label: 'Operating Expenses', values: ['Payroll', '($85.0K)', '29.9%'], bold: true, indent: false },
  { label: '', values: ['Infrastructure', '($32.0K)', '11.2%'], bold: false, indent: true },
  { label: '', values: ['Marketing', '($28.0K)', '9.8%'], bold: false, indent: true },
  { label: '', values: ['Operations', '($22.0K)', '7.7%'], bold: false, indent: true },
  { label: '', values: ['R&D', '($15.0K)', '5.3%'], bold: false, indent: true },
  { label: 'Total Expenses', values: ['', '($187.2K)', '65.8%'], bold: true, indent: false },
  { label: 'Operating Income', values: ['', '$54.6K', '19.2%'], bold: true, indent: false },
  { label: 'Net Profit', values: ['', '$97.3K', '34.2%'], bold: true, indent: false },
];

// ─── Balance Sheet Data ───
const balanceSheetData = [
  { label: 'Assets', values: ['Current Assets', '', ''], bold: true, indent: false },
  { label: '', values: ['Cash & Equivalents', '$1,680K', ''], bold: false, indent: true },
  { label: '', values: ['Accounts Receivable', '$142K', ''], bold: false, indent: true },
  { label: '', values: ['Other Current Assets', '$38K', ''], bold: false, indent: true },
  { label: '', values: ['Total Current Assets', '$1,860K', ''], bold: true, indent: false },
  { label: '', values: ['Non-Current Assets', '$245K', ''], bold: true, indent: false },
  { label: 'Total Assets', values: ['', '$2,105K', ''], bold: true, indent: false },
  { label: 'Liabilities', values: ['Current Liabilities', '', ''], bold: true, indent: false },
  { label: '', values: ['Accounts Payable', '$67K', ''], bold: false, indent: true },
  { label: '', values: ['Deferred Revenue', '$124K', ''], bold: false, indent: true },
  { label: '', values: ['Total Current Liabilities', '$191K', ''], bold: true, indent: false },
  { label: '', values: ['Long-term Liabilities', '$85K', ''], bold: true, indent: false },
  { label: 'Total Liabilities', values: ['', '$276K', ''], bold: true, indent: false },
  { label: 'Equity', values: ['Common Stock', '$2,500K', ''], bold: true, indent: false },
  { label: '', values: ['Retained Earnings', '($671K)', ''], bold: false, indent: true },
  { label: 'Total Equity', values: ['', '$1,829K', ''], bold: true, indent: false },
  { label: 'Liabilities + Equity', values: ['', '$2,105K', ''], bold: true, indent: false },
];

// ─── Cash Flow Data ───
const cashFlowData = [
  { label: 'Operating Activities', values: ['Net Income', '$97.3K', ''], bold: true, indent: false },
  { label: '', values: ['Depreciation & Amortization', '$12.4K', ''], bold: false, indent: true },
  { label: '', values: ['Changes in Working Capital', '($18.2K)', ''], bold: false, indent: true },
  { label: '', values: ['Stock-based Compensation', '$8.5K', ''], bold: false, indent: true },
  { label: 'Cash from Operations', values: ['', '$100.0K', ''], bold: true, indent: false },
  { label: 'Investing Activities', values: ['Capital Expenditures', '($24.0K)', ''], bold: true, indent: false },
  { label: '', values: ['Investments', '($15.0K)', ''], bold: false, indent: true },
  { label: 'Cash from Investing', values: ['', '($39.0K)', ''], bold: true, indent: false },
  { label: 'Financing Activities', values: ['Loan Proceeds', '$0', ''], bold: true, indent: false },
  { label: '', values: ['Equity Raised', '$0', ''], bold: false, indent: true },
  { label: 'Cash from Financing', values: ['', '$0', ''], bold: true, indent: false },
  { label: 'Net Change in Cash', values: ['', '$61.0K', ''], bold: true, indent: false },
];

// ─── Risk & Insight Data ───
const riskIndicators = [
  { label: 'Cash Runway Risk', level: 'medium' as const, detail: '18 months runway at current burn' },
  { label: 'Revenue Concentration', level: 'high' as const, detail: '62.7% revenue from SaaS — diversification needed' },
  { label: 'Expense Growth Rate', level: 'low' as const, detail: 'Expenses growing slower than revenue (11.1% vs 4.2%)' },
  { label: 'Churn Rate', level: 'medium' as const, detail: '3.2% monthly churn — target is 2.0%' },
  { label: 'Market Volatility', level: 'low' as const, detail: 'Stable ASEAN market conditions' },
];

const optimizationSuggestions = [
  {
    title: 'Reduce Infrastructure Costs',
    impact: 'High',
    savings: '$8K-12K/mo',
    description: 'Migrate to reserved instances and optimize cloud resource allocation. Current utilization averages 47%.',
    color: COLORS.emerald,
  },
  {
    title: 'Improve SaaS Retention',
    impact: 'High',
    savings: '$15K-22K/mo',
    description: 'Implement proactive churn prevention. Reducing churn from 3.2% to 2.0% adds significant MRR retention.',
    color: COLORS.cyan,
  },
  {
    title: 'Scale Professional Services',
    impact: 'Medium',
    savings: '$10K-18K/mo',
    description: 'Professional services has highest margin but lowest revenue share. Invest in PS capacity and packaging.',
    color: COLORS.teal,
  },
  {
    title: 'Automate Operations',
    impact: 'Medium',
    savings: '$5K-8K/mo',
    description: 'Deploy AI agents for operational tasks. Potential to reduce operations spend by 25-35%.',
    color: COLORS.amber,
  },
];

const strategicRecommendations = [
  {
    title: 'Achieve Break-even by Q3 2025',
    timeline: '6-9 months',
    priority: 'Critical',
    description: 'At current trajectory, break-even projected in 7 months. Accelerate with expense optimization and revenue growth.',
  },
  {
    title: 'Prepare Series A Financial Package',
    timeline: '2-3 months',
    priority: 'High',
    description: 'Investor-grade financials show strong unit economics. LTV:CAC of 7.5:1 and improving margins strengthen position.',
  },
  {
    title: 'Expand to Indonesia Market',
    timeline: '4-6 months',
    priority: 'Medium',
    description: 'Market analysis shows strong product-market fit potential. Estimated 40% incremental ARR within 12 months of entry.',
  },
  {
    title: 'Build Financial Contingency Reserve',
    timeline: '3-5 months',
    priority: 'High',
    description: 'Target 6-month cash reserve. Current runway of 18 months provides buffer, but market uncertainty warrants caution.',
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function FinancialsModule() {
  const { revenueData, expenseData, forecastData } = useAppStore();
  const [period, setPeriod] = useState<'6' | '12' | '24'>('12');
  const [growthRate, setGrowthRate] = useState([11]);
  const [churnRate, setChurnRate] = useState([3.2]);
  const [arpu, setArpu] = useState('149');
  const [statementTab, setStatementTab] = useState('pl');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ─── Period-filtered data ───
  const filteredRevenueData = useMemo(() => {
    const months = period === '6' ? 6 : period === '12' ? 12 : 24;
    return revenueData.slice(-months);
  }, [revenueData, period]);

  const filteredForecastData = useMemo(() => {
    const months = period === '6' ? 6 : period === '12' ? 12 : 24;
    return forecastData.slice(-months);
  }, [forecastData, period]);

  // ─── Summary calculations ───
  const totalRevenue = useMemo(
    () => revenueData.reduce((sum, d) => sum + (d.revenue ?? 0), 0),
    [revenueData]
  );
  const totalExpenses = useMemo(
    () => expenseData.reduce((sum, d) => sum + d.value, 0),
    [expenseData]
  );
  const netProfit = totalRevenue - totalExpenses * 12;
  const profitMargin = ((netProfit / totalRevenue) * 100);

  const latestMonth = revenueData[revenueData.length - 1];
  const prevMonth = revenueData[revenueData.length - 2];
  const revenueChange = prevMonth
    ? (((latestMonth.revenue ?? 0) - (prevMonth.revenue ?? 0)) / (prevMonth.revenue ?? 1)) * 100
    : 0;
  const expenseChange = prevMonth
    ? (((latestMonth.expenses ?? 0) - (prevMonth.expenses ?? 0)) / (prevMonth.expenses ?? 1)) * 100
    : 0;

  // ─── Forecast with confidence bands ───
  const forecastWithBands = useMemo(() => {
    const base = filteredForecastData;
    return base.map((d, i) => {
      const factor = (i + 1) / base.length;
      const spread = 0.08 + factor * 0.12;
      return {
        ...d,
        revenueUpper: Math.round((d.revenue ?? 0) * (1 + spread)),
        revenueLower: Math.round((d.revenue ?? 0) * (1 - spread)),
      };
    });
  }, [filteredForecastData]);

  // ─── Revenue modeling ───
  const modeledRevenue = useMemo(() => {
    const rate = growthRate[0] / 100;
    const churn = churnRate[0] / 100;
    const arpuVal = parseFloat(arpu) || 149;
    const base = latestMonth.revenue ?? 284500;
    return Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(2025, i).toLocaleString('en', { month: 'short' });
      const net = rate - churn;
      const projected = Math.round(base * Math.pow(1 + net / 12, i + 1));
      const spread = 0.06 + (i / 12) * 0.14;
      return {
        name: monthName,
        projected,
        upper: Math.round(projected * (1 + spread)),
        lower: Math.round(projected * (1 - spread)),
        arpuRevenue: Math.round(arpuVal * (projected / arpuVal)),
      };
    });
  }, [growthRate, churnRate, arpu, latestMonth]);

  // ─── Expense trend data ───
  const expenseTrendData = useMemo(() => {
    return revenueData.map((d, i) => ({
      name: d.name,
      expenses: d.expenses ?? 0,
      expenseTarget: 170000 + i * 2000,
    }));
  }, [revenueData]);

  // ─── Donut chart data ───
  const donutData = expenseData.map((d) => ({
    name: d.name,
    value: d.value,
  }));
  const totalExpenseValue = expenseData.reduce((s, d) => s + d.value, 0);

  // ─── Refresh animation ───
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  // ─── Summary Cards ───
  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: revenueChange,
      icon: DollarSign,
      color: COLORS.emerald,
      bgColor: COLORS.emeraldLight,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses * 12),
      change: expenseChange,
      icon: TrendingDown,
      color: COLORS.rose,
      bgColor: COLORS.roseLight,
    },
    {
      title: 'Net Profit',
      value: formatCurrency(netProfit),
      change: ((netProfit / totalRevenue) * 100 > 30 ? 12.5 : -5.2),
      icon: TrendingUp,
      color: COLORS.teal,
      bgColor: COLORS.tealLight,
    },
    {
      title: 'Profit Margin',
      value: formatPercent(profitMargin),
      change: 3.8,
      icon: Target,
      color: COLORS.amber,
      bgColor: COLORS.amberLight,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Forecasting Engine</h2>
          <p className="text-muted-foreground text-sm mt-1">
            AI-powered financial analysis, forecasting, and strategic insights
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
            <BarChart3 className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1.5 text-xs sm:text-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            Revenue Modeling
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-1.5 text-xs sm:text-sm">
            <PieChartIcon className="h-3.5 w-3.5" />
            Expense Analysis
          </TabsTrigger>
          <TabsTrigger value="statements" className="gap-1.5 text-xs sm:text-sm">
            <Calculator className="h-3.5 w-3.5" />
            Financial Statements
          </TabsTrigger>
          <TabsTrigger value="advisor" className="gap-1.5 text-xs sm:text-sm">
            <Zap className="h-3.5 w-3.5" />
            Forecast Advisor
          </TabsTrigger>
        </TabsList>

        {/* ━━━ Tab 1: Overview ━━━ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{card.title}</p>
                        <p className="text-2xl font-bold">{card.value}</p>
                      </div>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: card.bgColor }}
                      >
                        <card.icon className="h-5 w-5" style={{ color: card.color }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {card.change >= 0 ? (
                        <>
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs font-medium text-emerald-500">
                            +{formatPercent(card.change)}
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
                          <span className="text-xs font-medium text-rose-500">
                            {formatPercent(card.change)}
                          </span>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground ml-1">vs prev month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Composed Chart */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Revenue, Expenses & Profit</CardTitle>
                    <CardDescription>Combined financial performance over time</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['6', '12', '24'] as const).map((p) => (
                      <Button
                        key={p}
                        size="sm"
                        variant={period === p ? 'default' : 'outline'}
                        onClick={() => setPeriod(p)}
                        className="text-xs h-8"
                      >
                        {p}M
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={filteredRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => formatCurrency(v)} />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill={COLORS.emerald} radius={[4, 4, 0, 0]} barSize={28} />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        name="Expenses"
                        fill={COLORS.rose}
                        stroke={COLORS.rose}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        stroke={COLORS.amber}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: COLORS.amber }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Forecast Preview */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Forecast Projection</CardTitle>
                <CardDescription>12-month forward-looking revenue forecast with confidence bands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastWithBands} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => formatCurrency(v)} />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenueUpper"
                        name="Upper Bound"
                        stroke="none"
                        fill={COLORS.emerald}
                        fillOpacity={0.12}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenueLower"
                        name="Lower Bound"
                        stroke="none"
                        fill="#ffffff"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Forecast Revenue"
                        stroke={COLORS.emerald}
                        fill={COLORS.emerald}
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

        {/* ━━━ Tab 2: Revenue Modeling ━━━ */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Chart */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Revenue Forecast with Confidence Bands</CardTitle>
                    <CardDescription>Projected revenue based on your model parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[340px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={modeledRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => formatCurrency(v)} />
                          <Tooltip content={<CurrencyTooltip />} />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="upper"
                            name="Upper Band"
                            stroke="none"
                            fill={COLORS.teal}
                            fillOpacity={0.1}
                          />
                          <Area
                            type="monotone"
                            dataKey="lower"
                            name="Lower Band"
                            stroke="none"
                            fill="#ffffff"
                            fillOpacity={0.8}
                          />
                          <Area
                            type="monotone"
                            dataKey="projected"
                            name="Projected Revenue"
                            stroke={COLORS.teal}
                            fill={COLORS.teal}
                            fillOpacity={0.12}
                            strokeWidth={2.5}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Revenue Breakdown */}
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Revenue Breakdown by Type</CardTitle>
                    <CardDescription>Current revenue distribution across streams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueBreakdown.map((item) => {
                        const pct = (item.value / revenueBreakdown.reduce((s, d) => s + d.value, 0)) * 100;
                        return (
                          <div key={item.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{item.name}</span>
                              <span className="text-sm font-semibold">{formatCurrency(item.value)} ({formatPercent(pct)})</span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right: Controls & AI Advisor */}
            <div className="space-y-6">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Model Parameters</CardTitle>
                    <CardDescription>Adjust forecast assumptions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Growth Rate</Label>
                        <span className="text-sm font-semibold text-emerald-600">{growthRate[0].toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={growthRate}
                        onValueChange={setGrowthRate}
                        min={0}
                        max={50}
                        step={0.5}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Churn Rate</Label>
                        <span className="text-sm font-semibold text-rose-600">{churnRate[0].toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={churnRate}
                        onValueChange={setChurnRate}
                        min={0}
                        max={15}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">ARPU ($)</Label>
                      <Input
                        type="number"
                        value={arpu}
                        onChange={(e) => setArpu(e.target.value)}
                        placeholder="149"
                        className="h-9"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-lg">AI Forecast Advisor</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-lg bg-background/60 p-3 text-sm space-y-2">
                      <p className="font-medium text-emerald-700 dark:text-emerald-400">
                        Positive Signal
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Revenue growth of {growthRate[0].toFixed(1)}% exceeds industry median of 8.5%. 
                        SaaS segment shows strong momentum with 11.1% MRR growth.
                      </p>
                    </div>
                    <div className="rounded-lg bg-background/60 p-3 text-sm space-y-2">
                      <p className="font-medium text-amber-700 dark:text-amber-400">
                        Watch Area
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Churn at {churnRate[0].toFixed(1)}% is above the 2% target. 
                        Each 0.5% reduction in churn adds ~${(modeledRevenue[11]?.projected * 0.005 / 1000).toFixed(0)}K to projected year-end revenue.
                      </p>
                    </div>
                    <div className="rounded-lg bg-background/60 p-3 text-sm space-y-2">
                      <p className="font-medium text-rose-700 dark:text-rose-400">
                        Risk Factor
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Revenue concentration risk: SaaS subscriptions represent 62.7% of revenue. 
                        Diversification into Professional Services recommended.
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button size="sm" className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white">
                        <Zap className="h-3.5 w-3.5" />
                        Generate Full Forecast Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* ━━━ Tab 3: Expense Analysis ━━━ */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown Pie/Donut */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                  <CardDescription>Monthly expense distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                          stroke="none"
                        >
                          {donutData.map((_, index) => (
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [formatCurrency(value), name]}
                          contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          iconSize={8}
                          formatter={(value) => (
                            <span className="text-xs text-muted-foreground">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Expense Trend */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Expense Trend</CardTitle>
                  <CardDescription>Monthly expenses vs target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={expenseTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => formatCurrency(v)} />
                        <Tooltip content={<CurrencyTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          name="Actual Expenses"
                          stroke={COLORS.rose}
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: COLORS.rose }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expenseTarget"
                          name="Target"
                          stroke={COLORS.amber}
                          strokeWidth={2}
                          strokeDasharray="6 3"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Expense Categories Table */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Expense Categories</CardTitle>
                <CardDescription>Detailed breakdown with amounts and percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                      <TableHead className="text-right">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseData.map((item, i) => {
                      const pct = (item.value / totalExpenseValue) * 100;
                      const trends = [3.2, -1.8, 5.4, 2.1, 8.6, -2.3];
                      const trend = trends[i] ?? 0;
                      return (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                              />
                              {item.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(item.value)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatPercent(pct)}
                          </TableCell>
                          <TableCell className="text-right">
                            {trend >= 0 ? (
                              <Badge variant="secondary" className="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 gap-1 text-xs">
                                <ArrowUpRight className="h-3 w-3" />
                                +{formatPercent(trend)}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 gap-1 text-xs">
                                <ArrowDownRight className="h-3 w-3" />
                                {formatPercent(trend)}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="font-bold border-t-2">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(totalExpenseValue)}
                      </TableCell>
                      <TableCell className="text-right font-mono">100.0%</TableCell>
                      <TableCell className="text-right">—</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ━━━ Tab 4: Financial Statements ━━━ */}
        <TabsContent value="statements" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/30">
                    <TrendingDown className="h-6 w-6 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Burn Rate</p>
                    <p className="text-xl font-bold">{formatCurrency(totalExpenses)}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <Target className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Runway</p>
                    <p className="text-xl font-bold">18 months</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Break-even Point</p>
                    <p className="text-xl font-bold">Jul 2025</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Statement Sub-tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={statementTab} onValueChange={setStatementTab}>
                <div className="border-b px-6 pt-4">
                  <TabsList className="bg-transparent h-auto p-0 gap-4">
                    <TabsTrigger
                      value="pl"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-0 pb-3 text-sm"
                    >
                      Profit & Loss
                    </TabsTrigger>
                    <TabsTrigger
                      value="balance"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-0 pb-3 text-sm"
                    >
                      Balance Sheet
                    </TabsTrigger>
                    <TabsTrigger
                      value="cashflow"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-0 pb-3 text-sm"
                    >
                      Cash Flow
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="pl" className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="pl"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Profit & Loss Statement</h3>
                          <p className="text-sm text-muted-foreground">For the period ending December 2024</p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Zap className="h-3.5 w-3.5" />
                          AI Analysis
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Line Item</TableHead>
                            <TableHead className="text-right">Detail</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">% of Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {plData.map((row, i) => (
                            <TableRow
                              key={i}
                              className={row.bold ? 'font-semibold' : ''}
                            >
                              <TableCell className={row.indent ? 'pl-8' : ''}>
                                {row.label}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground text-sm">
                                {row.values[0]}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {row.values[1]}
                              </TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">
                                {row.values[2]}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="balance" className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="balance"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Balance Sheet</h3>
                          <p className="text-sm text-muted-foreground">As of December 31, 2024</p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Zap className="h-3.5 w-3.5" />
                          AI Analysis
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Detail</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {balanceSheetData.map((row, i) => (
                            <TableRow
                              key={i}
                              className={row.bold ? 'font-semibold' : ''}
                            >
                              <TableCell className={row.indent ? 'pl-8' : ''}>
                                {row.label}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground text-sm">
                                {row.values[0]}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {row.values[1]}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="cashflow" className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="cashflow"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Cash Flow Statement</h3>
                          <p className="text-sm text-muted-foreground">For the period ending December 2024</p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Zap className="h-3.5 w-3.5" />
                          AI Analysis
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Detail</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cashFlowData.map((row, i) => (
                            <TableRow
                              key={i}
                              className={row.bold ? 'font-semibold' : ''}
                            >
                              <TableCell className={row.indent ? 'pl-8' : ''}>
                                {row.label}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground text-sm">
                                {row.values[0]}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {row.values[1]}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━ Tab 5: Forecast Advisor ━━━ */}
        <TabsContent value="advisor" className="space-y-6">
          {/* AI Insights Panel */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
                </div>
                <CardDescription>Autonomous analysis of your financial trajectory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg bg-background/60 p-4 space-y-2">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Revenue Trajectory</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+11.1%</p>
                    <p className="text-xs text-muted-foreground">
                      Strong upward trend. Revenue growing at 11.1% MoM, projecting {formatCurrency(forecastData[forecastData.length - 1]?.revenue ?? 0)} by year-end.
                    </p>
                  </div>
                  <div className="rounded-lg bg-background/60 p-4 space-y-2">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Burn Efficiency</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">65.8%</p>
                    <p className="text-xs text-muted-foreground">
                      Expense-to-revenue ratio improving. Burn rate decreased 4% MoM. On track for operational efficiency target.
                    </p>
                  </div>
                  <div className="rounded-lg bg-background/60 p-4 space-y-2">
                    <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">Break-even Timeline</p>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">7 months</p>
                    <p className="text-xs text-muted-foreground">
                      At current trajectory, break-even projected by July 2025. Scenario analysis suggests 5-9 month range.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Indicators */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Risk Indicators</CardTitle>
                <CardDescription>Key financial risk factors with severity assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskIndicators.map((risk, i) => (
                    <motion.div
                      key={risk.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            risk.level === 'high'
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                              : risk.level === 'medium'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          }
                          variant="outline"
                        >
                          {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{risk.label}</p>
                          <p className="text-xs text-muted-foreground">{risk.detail}</p>
                        </div>
                      </div>
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            risk.level === 'high'
                              ? COLORS.rose
                              : risk.level === 'medium'
                              ? COLORS.amber
                              : COLORS.emerald,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Optimization Suggestions */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Optimization Suggestions</CardTitle>
                <CardDescription>AI-identified opportunities to improve financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {optimizationSuggestions.map((suggestion, i) => (
                    <motion.div
                      key={suggestion.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold">{suggestion.title}</h4>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: `${suggestion.color}15`,
                            color: suggestion.color,
                          }}
                        >
                          {suggestion.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Est. savings: {suggestion.savings}
                        </span>
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                          Apply <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strategic Recommendations */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Strategic Recommendations</CardTitle>
                <CardDescription>Long-term financial strategy based on AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategicRecommendations.map((rec, i) => (
                    <motion.div
                      key={rec.title}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h4 className="text-sm font-semibold">{rec.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                rec.priority === 'Critical'
                                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                  : rec.priority === 'High'
                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                  : 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800'
                              }
                            >
                              {rec.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              <Target className="h-3 w-3 inline mr-1" />
                              {rec.timeline}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
