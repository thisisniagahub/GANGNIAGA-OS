'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Users,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  FileText,
  Lightbulb,
  Eye,
  Bot,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// ── KPI Formatting Helpers ──────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `RM${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `RM${(value / 1_000).toFixed(1)}K`;
  }
  return `RM${value.toLocaleString()}`;
}

function formatKPIValue(value: number, unit: string): string {
  switch (unit) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return `${value}%`;
    case 'months':
      return `${value} months`;
    case 'ratio':
      return `${value.toFixed(2)}x`;
    default:
      return String(value);
  }
}

// ── Chart Colour Palette (no blue / indigo) ────────────────────────────

const CHART_COLORS = {
  emerald: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  cyan: '#22d3ee',
  teal: '#2dd4bf',
  orange: '#fb923c',
} as const;

const PIE_COLORS = [
  CHART_COLORS.emerald,
  CHART_COLORS.amber,
  CHART_COLORS.rose,
  CHART_COLORS.cyan,
  CHART_COLORS.teal,
  CHART_COLORS.orange,
];

// ── Chart Configs ───────────────────────────────────────────────────────

const revenueChartConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: CHART_COLORS.emerald },
  expenses: { label: 'Expenses', color: CHART_COLORS.rose },
  profit: { label: 'Profit', color: CHART_COLORS.cyan },
};

const expenseChartConfig: ChartConfig = {
  value: { label: 'Expenses' },
  Payroll: { label: 'Payroll', color: CHART_COLORS.emerald },
  Infrastructure: { label: 'Infrastructure', color: CHART_COLORS.amber },
  Marketing: { label: 'Marketing', color: CHART_COLORS.rose },
  Operations: { label: 'Operations', color: CHART_COLORS.cyan },
  'R&D': { label: 'R&D', color: CHART_COLORS.teal },
  Other: { label: 'Other', color: CHART_COLORS.orange },
};

const barChartConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: CHART_COLORS.emerald },
  expenses: { label: 'Expenses', color: CHART_COLORS.rose },
  profit: { label: 'Profit', color: CHART_COLORS.cyan },
};

// ── KPI Icon Mapping ────────────────────────────────────────────────────

const kpiIcons: Record<string, React.ElementType> = {
  'Monthly Revenue': DollarSign,
  'Burn Rate': Activity,
  Runway: Target,
  MRR: BarChart3,
  'Customer Churn': Users,
  ARR: Zap,
  DSCR: Shield,
};

// ── Animation Variants ──────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ── Hardcoded AI Insights ───────────────────────────────────────────────

const aiInsights = [
  {
    title: 'Revenue Growth Accelerating',
    description:
      'Monthly revenue has grown 11.1% MoM, outpacing the previous quarter average of 7.2%. Current trajectory suggests hitting the RM300K target within 6 weeks.',
    severity: 'positive' as const,
    icon: TrendingUp,
  },
  {
    title: 'DSCR Healthy at 1.45x',
    description:
      'Debt Service Coverage Ratio improved from 1.22x to 1.45x, above the bank minimum of 1.25x. Projected to reach 2.1x by Year 2 — strong position for loan approval.',
    severity: 'positive' as const,
    icon: Shield,
  },
  {
    title: 'Burn Rate Improving',
    description:
      'Burn rate decreased 4% from RM195K to RM187.2K, primarily driven by infrastructure cost optimization. Runway extended from 15 to 18 months.',
    severity: 'positive' as const,
    icon: ArrowDownRight,
  },
  {
    title: 'Break-even on Track — Q3 2025',
    description:
      'Profit margins expanded from 18.9% to 34.2%. At current trajectory, break-even by Q3 2025 without additional funding. Bank loan would accelerate this to Q2 2025.',
    severity: 'caution' as const,
    icon: Target,
  },
];

// ── Main Component ──────────────────────────────────────────────────────

export default function Dashboard() {
  const kpis = useAppStore((s) => s.kpis);
  const revenueData = useAppStore((s) => s.revenueData);
  const expenseData = useAppStore((s) => s.expenseData);
  const { setActiveModule, toggleCopilot } = useAppStore();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* ── Top Section: KPI Cards ──────────────────────────────────── */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi, i) => {
            const Icon = kpiIcons[kpi.metric] ?? Activity;
            const isPositive =
              kpi.metric === 'Burn Rate'
                ? kpi.trend === 'down'
                : kpi.trend === 'up';
            const progress = Math.min((kpi.value / kpi.target) * 100, 100);

            return (
              <motion.div
                key={kpi.metric}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Card className="group relative overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm transition-colors hover:border-border hover:bg-card">
                  {/* subtle accent stripe */}
                  <div
                    className={`absolute inset-x-0 top-0 h-[2px] ${
                      isPositive
                        ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-500/0'
                        : 'bg-gradient-to-r from-rose-500/80 to-rose-500/0'
                    }`}
                  />

                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.metric}
                    </CardTitle>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Value + Change */}
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold tracking-tight">
                        {formatKPIValue(kpi.value, kpi.unit)}
                      </span>

                      <Badge
                        variant="secondary"
                        className={`gap-1 text-xs font-semibold ${
                          isPositive
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(kpi.change).toFixed(1)}%
                      </Badge>
                    </div>

                    {/* Progress toward target */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>
                          vs target {formatKPIValue(kpi.target, kpi.unit)}
                        </span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                        <motion.div
                          className={`h-full rounded-full ${
                            isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.08 }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Middle Section: Charts ──────────────────────────────────── */}
      <section
        aria-label="Financial Charts"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Revenue & Expenses Area Chart — 2/3 width */}
        <motion.div
          className="lg:col-span-2"
          initial="hidden"
          animate="visible"
          variants={scaleIn}
        >
          <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base font-semibold">
                  Revenue & Expenses
                </CardTitle>
                <Tabs defaultValue="area" className="w-fit">
                  <TabsList className="h-8">
                    <TabsTrigger value="area" className="text-xs">
                      Area
                    </TabsTrigger>
                    <TabsTrigger value="bar" className="text-xs">
                      Bar
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="area" className="w-full">
                <TabsContent value="area" className="mt-0">
                  <ChartContainer
                    config={revenueChartConfig}
                    className="h-[320px] w-full"
                  >
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="fillRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.emerald}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.emerald}
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fillExpenses"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.rose}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.rose}
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fillProfit"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.cyan}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.cyan}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) =>
                          `RM${(v / 1000).toFixed(0)}K`
                        }
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) =>
                              `RM${Number(value).toLocaleString()}`
                            }
                          />
                        }
                      />
                      <ChartLegend
                        content={<ChartLegendContent />}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={CHART_COLORS.emerald}
                        fill="url(#fillRevenue)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke={CHART_COLORS.rose}
                        fill="url(#fillExpenses)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke={CHART_COLORS.cyan}
                        fill="url(#fillProfit)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </TabsContent>

                <TabsContent value="bar" className="mt-0">
                  <ChartContainer
                    config={barChartConfig}
                    className="h-[320px] w-full"
                  >
                    <BarChart
                      data={revenueData}
                      margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) =>
                          `RM${(v / 1000).toFixed(0)}K`
                        }
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) =>
                              `RM${Number(value).toLocaleString()}`
                            }
                          />
                        }
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        dataKey="revenue"
                        fill={CHART_COLORS.emerald}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expenses"
                        fill={CHART_COLORS.rose}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="profit"
                        fill={CHART_COLORS.cyan}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Breakdown Pie Chart — 1/3 width */}
        <motion.div initial="hidden" animate="visible" variants={scaleIn}>
          <Card className="h-full border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={expenseChartConfig}
                className="mx-auto h-[320px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          `RM${Number(value).toLocaleString()}`
                        }
                        nameKey="name"
                      />
                    }
                  />
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {expenseData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ── Bottom Section: AI Insights ─────────────────────────────── */}
      <section aria-label="AI Insights">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
        >
          <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
                <CardTitle className="text-base font-semibold">
                  AI Insights
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                >
                  Auto-generated
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {aiInsights.map((insight, i) => {
                  const SeverityIcon = insight.icon;
                  return (
                    <motion.div
                      key={insight.title}
                      custom={7 + i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                    >
                      <div className="group rounded-xl border border-border/30 bg-muted/20 p-4 transition-colors hover:border-border/60 hover:bg-muted/30">
                        <div className="mb-2 flex items-start gap-2.5">
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                              insight.severity === 'positive'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : insight.severity === 'caution'
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            <SeverityIcon className="h-3.5 w-3.5" />
                          </div>
                          <h4 className="text-sm font-semibold leading-snug">
                            {insight.title}
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ── Bottom Section: Quick Actions ─────────────────────────────── */}
      <section aria-label="Quick Actions">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={11}
        >
          <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </div>
                <CardTitle className="text-base font-semibold">
                  Quick Actions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    key: 'create-proposal',
                    title: 'Create Proposal',
                    description: 'Start a new business proposal with AI assistance',
                    icon: FileText,
                    color: 'emerald' as const,
                    action: () => setActiveModule('business-plans'),
                  },
                  {
                    key: 'validate-idea',
                    title: 'Validate Idea',
                    description: 'Pressure-test your business idea with AI',
                    icon: Lightbulb,
                    color: 'amber' as const,
                    action: () => setActiveModule('idea-canvas'),
                  },
                  {
                    key: 'run-review',
                    title: 'Run Review',
                    description: 'Cross-check narrative vs financials like a lender',
                    icon: Eye,
                    color: 'teal' as const,
                    action: () => setActiveModule('plan-review'),
                  },
                  {
                    key: 'open-copilot',
                    title: 'Open Copilot',
                    description: 'Chat with GangNiaga AI assistant',
                    icon: Bot,
                    color: 'cyan' as const,
                    action: () => toggleCopilot(),
                  },
                ].map((item, i) => {
                  const colorMap = {
                    emerald: {
                      bg: 'bg-emerald-500/10',
                      text: 'text-emerald-400',
                      hover: 'hover:border-emerald-500/30 hover:bg-emerald-500/5',
                      stripe: 'from-emerald-500/80 to-emerald-500/0',
                    },
                    amber: {
                      bg: 'bg-amber-500/10',
                      text: 'text-amber-400',
                      hover: 'hover:border-amber-500/30 hover:bg-amber-500/5',
                      stripe: 'from-amber-500/80 to-amber-500/0',
                    },
                    teal: {
                      bg: 'bg-teal-500/10',
                      text: 'text-teal-400',
                      hover: 'hover:border-teal-500/30 hover:bg-teal-500/5',
                      stripe: 'from-teal-500/80 to-teal-500/0',
                    },
                    cyan: {
                      bg: 'bg-cyan-500/10',
                      text: 'text-cyan-400',
                      hover: 'hover:border-cyan-500/30 hover:bg-cyan-500/5',
                      stripe: 'from-cyan-500/80 to-cyan-500/0',
                    },
                  }[item.color];
                  const ItemIcon = item.icon;

                  return (
                    <motion.div
                      key={item.key}
                      custom={12 + i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                    >
                      <button
                        onClick={item.action}
                        className={`group relative w-full rounded-xl border border-border/30 bg-muted/20 p-4 text-left transition-colors ${colorMap.hover}`}
                      >
                        <div
                          className={`absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r ${colorMap.stripe} opacity-0 transition-opacity group-hover:opacity-100`}
                        />
                        <div className="mb-3 flex items-center gap-2.5">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorMap.bg}`}
                          >
                            <ItemIcon className={`h-4 w-4 ${colorMap.text}`} />
                          </div>
                          <h4 className="text-sm font-semibold">{item.title}</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
