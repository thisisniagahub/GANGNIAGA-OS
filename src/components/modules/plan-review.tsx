'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type { PlanReviewData, Discrepancy, ReviewRecommendation, BusinessPlanData } from '@/lib/types';
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  Sparkles,
  Building2,
  TrendingUp,
  FileText,
  MessageSquare,
  ArrowRight,
  Search,
  ChevronRight,
  CircleDot,
  Gauge,
  AlertCircle,
  Info,
  Landmark,
  Scale,
} from 'lucide-react';

// ─── Color Palette ───
const COLORS = {
  emerald: '#10b981',
  emeraldLight: '#d1fae5',
  teal: '#14b8a6',
  tealLight: '#ccfbf1',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  rose: '#f43f5e',
  roseLight: '#ffe4e6',
  cyan: '#06b6d4',
  cyanLight: '#cffafe',
  red: '#ef4444',
};

// ─── Score color logic ───
function getScoreColor(score: number): string {
  if (score < 40) return COLORS.red;
  if (score < 70) return COLORS.amber;
  if (score < 85) return COLORS.emerald;
  return COLORS.teal;
}

function getScoreLabel(score: number): string {
  if (score < 40) return 'Poor';
  if (score < 70) return 'Needs Work';
  if (score < 85) return 'Good';
  return 'Excellent';
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Score Gauge Component (SVG Arc)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ScoreGauge({
  score,
  label,
  color,
  size = 140,
}: {
  score: number;
  label: string;
  color: string;
  size?: number;
}) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const gapAngle = 30;
  const totalAngle = 360 - gapAngle;
  const arcLength = (totalAngle / 360) * circumference;

  const startAngle = gapAngle / 2 + 90;
  const endAngle = 360 - gapAngle / 2 + 90;
  const progressAngle = startAngle + (score / 100) * totalAngle;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: size / 2 + radius * Math.cos(rad),
      y: size / 2 + radius * Math.sin(rad),
    };
  };

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const progressEnd = polarToCartesian(progressAngle);

  const describeArc = (
    startPt: { x: number; y: number },
    endPt: { x: number; y: number },
    largeArc: boolean
  ) =>
    `M ${startPt.x} ${startPt.y} A ${radius} ${radius} 0 ${largeArc ? 1 : 0} 1 ${endPt.x} ${endPt.y}`;

  const isLargeArc = totalAngle > 180;
  const isProgressLargeArc = score > 50;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <path
            d={describeArc(start, end, isLargeArc)}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.25}
          />
          {/* Progress arc */}
          {score > 0 && (
            <motion.path
              d={describeArc(start, progressEnd, isProgressLargeArc)}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          )}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {getScoreLabel(score)}
          </span>
        </div>
      </div>
      <span
        className="text-sm font-semibold"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Discrepancy Card Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function DiscrepancyCard({
  discrepancy,
  isExpanded,
  onToggle,
}: {
  discrepancy: Discrepancy;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const severityConfig = {
    critical: {
      borderColor: 'border-l-red-500',
      bgColor: 'bg-red-500/5',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      badgeVariant: 'destructive' as const,
      badgeClass: '',
      label: 'Critical',
    },
    warning: {
      borderColor: 'border-l-amber-500',
      bgColor: 'bg-amber-500/5',
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      badgeVariant: 'outline' as const,
      badgeClass: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10',
      label: 'Warning',
    },
    info: {
      borderColor: 'border-l-cyan-500',
      bgColor: 'bg-cyan-500/5',
      icon: Info,
      iconColor: 'text-cyan-500',
      badgeVariant: 'outline' as const,
      badgeClass: 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
      label: 'Info',
    },
  };

  const config = severityConfig[discrepancy.severity];
  const Icon = config.icon;

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'rounded-lg border border-l-4 p-4 transition-colors cursor-pointer',
        config.borderColor,
        config.bgColor,
        'hover:bg-accent/30'
      )}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.iconColor)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant={config.badgeVariant} className={cn('text-[10px] px-1.5', config.badgeClass)}>
                {config.label}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">
                {discrepancy.section}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {discrepancy.description}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-0.5"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 pt-3 border-t border-border/50">
              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      What your narrative says
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {discrepancy.narrativeClaim}
                  </p>
                </div>
                <div className="rounded-md bg-rose-500/5 border border-rose-500/20 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Gauge className="h-3.5 w-3.5 text-rose-500" />
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      What your financials show
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {discrepancy.financialReality}
                  </p>
                </div>
              </div>
              {/* Suggested Fix */}
              <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Suggested Fix
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {discrepancy.suggestedFix}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Recommendation Card Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function RecommendationCard({
  recommendation,
}: {
  recommendation: ReviewRecommendation;
}) {
  const priorityConfig = {
    high: {
      color: COLORS.rose,
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      label: 'High',
      icon: AlertTriangle,
    },
    medium: {
      color: COLORS.amber,
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      label: 'Medium',
      icon: AlertCircle,
    },
    low: {
      color: COLORS.emerald,
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      label: 'Low',
      icon: Info,
    },
  };

  const config = priorityConfig[recommendation.priority];
  const Icon = config.icon;

  return (
    <motion.div
      variants={staggerItem}
      className="rounded-lg border p-4 hover:bg-accent/20 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge variant="outline" className={cn('text-[10px] px-1.5', config.badgeClass)}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 bg-muted/50">
            {recommendation.category}
          </Badge>
        </div>
      </div>
      <p className="text-sm font-medium text-foreground mb-2 leading-relaxed">
        {recommendation.recommendation}
      </p>
      <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-border/50">
        <ArrowRight className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Impact: </span>
          {recommendation.impact}
        </p>
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Lender Persona Badge Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function LenderPersonaBadge({
  persona,
  size = 'default',
}: {
  persona: 'bank' | 'investor' | 'grant_officer';
  size?: 'sm' | 'default';
}) {
  const config = {
    bank: {
      icon: Building2,
      label: 'Bank',
      color: COLORS.emerald,
      bgClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    },
    investor: {
      icon: TrendingUp,
      label: 'Investor',
      color: COLORS.cyan,
      bgClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    },
    grant_officer: {
      icon: Landmark,
      label: 'Grant Officer',
      color: COLORS.amber,
      bgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    },
  };

  const c = config[persona];
  const Icon = c.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 font-medium',
        size === 'sm' ? 'text-[10px] px-1.5' : 'text-xs px-2 py-1',
        c.bgClass
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {c.label}
    </Badge>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Review Summary Card Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ReviewSummaryCard({
  review,
  isSelected,
  onClick,
}: {
  review: PlanReviewData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const plan = useAppStore((s) => s.plans.find((p) => p.id === review.planId));
  const scoreColor = getScoreColor(review.overallScore);

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'rounded-lg border p-4 cursor-pointer transition-all',
        isSelected
          ? 'border-emerald-500/50 bg-emerald-500/5 shadow-md shadow-emerald-500/10'
          : 'hover:bg-accent/30 hover:border-border'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {review.status === 'completed' && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            )}
            {review.status === 'running' && (
              <Loader2 className="h-4 w-4 text-amber-500 animate-spin shrink-0" />
            )}
            {review.status === 'pending' && (
              <CircleDot className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-sm font-semibold truncate">
              {plan?.title ?? `Plan #${review.planId}`}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <LenderPersonaBadge persona={review.lenderPersona} size="sm" />
            <span className="text-[10px] text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold" style={{ color: scoreColor }}>
            {review.overallScore}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Score
          </div>
        </div>
      </div>

      {review.discrepancies.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            {review.discrepancies.filter((d) => d.severity === 'critical').length > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 h-5">
                {review.discrepancies.filter((d) => d.severity === 'critical').length} Critical
              </Badge>
            )}
            {review.discrepancies.filter((d) => d.severity === 'warning').length > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                {review.discrepancies.filter((d) => d.severity === 'warning').length} Warning
              </Badge>
            )}
            {review.discrepancies.filter((d) => d.severity === 'info').length > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10">
                {review.discrepancies.filter((d) => d.severity === 'info').length} Info
              </Badge>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Plan Review Module
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function PlanReviewModule() {
  const { planReviews, selectedReview, setSelectedReview, plans } = useAppStore();
  const [expandedDiscrepancies, setExpandedDiscrepancies] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [newReviewDialogOpen, setNewReviewDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedPersona, setSelectedPersona] = useState<'bank' | 'investor' | 'grant_officer'>('bank');
  const [activeTab, setActiveTab] = useState('discrepancies');

  // Get the selected review
  const currentReview = useMemo(
    () => planReviews.find((r) => r.id === selectedReview) ?? planReviews[0] ?? null,
    [planReviews, selectedReview]
  );

  // Get linked plan
  const currentPlan = useMemo(
    () => (currentReview ? plans.find((p) => p.id === currentReview.planId) : null),
    [currentReview, plans]
  );

  // Toggle discrepancy expansion
  const toggleDiscrepancy = useCallback((id: string) => {
    setExpandedDiscrepancies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Run new review
  const handleRunReview = useCallback(async () => {
    if (!selectedPlanId) return;
    setIsRunning(true);
    try {
      const res = await fetch('/api/plan-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          lenderPersona: selectedPersona,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update the store with the new review
        const store = useAppStore.getState();
        useAppStore.setState({
          planReviews: [...store.planReviews, data.review],
          selectedReview: data.review.id,
        });
      }
    } catch (err) {
      console.error('Failed to run review:', err);
    } finally {
      setIsRunning(false);
      setNewReviewDialogOpen(false);
    }
  }, [selectedPlanId, selectedPersona]);

  // Auto-expand critical discrepancies
  useMemo(() => {
    if (currentReview) {
      const criticalIds = currentReview.discrepancies
        .filter((d) => d.severity === 'critical')
        .map((d) => d.id);
      setExpandedDiscrepancies(new Set(criticalIds));
    }
  }, [currentReview?.id]);

  // Severity counts
  const severityCounts = useMemo(() => {
    if (!currentReview) return { critical: 0, warning: 0, info: 0 };
    return {
      critical: currentReview.discrepancies.filter((d) => d.severity === 'critical').length,
      warning: currentReview.discrepancies.filter((d) => d.severity === 'warning').length,
      info: currentReview.discrepancies.filter((d) => d.severity === 'info').length,
    };
  }, [currentReview]);

  // Priority counts
  const priorityCounts = useMemo(() => {
    if (!currentReview) return { high: 0, medium: 0, low: 0 };
    return {
      high: currentReview.recommendations.filter((r) => r.priority === 'high').length,
      medium: currentReview.recommendations.filter((r) => r.priority === 'medium').length,
      low: currentReview.recommendations.filter((r) => r.priority === 'low').length,
    };
  }, [currentReview]);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20">
              <Scale className="h-5 w-5 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Plan Review Agent</h2>
          </div>
          <p className="text-muted-foreground text-sm mt-1 ml-12">
            Lender-grade analysis that cross-checks your narrative against financials
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Dialog open={newReviewDialogOpen} onOpenChange={setNewReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                <Eye className="h-4 w-4" />
                Run Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-emerald-500" />
                  New Plan Review
                </DialogTitle>
                <DialogDescription>
                  Select a business plan and lender persona to start the review.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Plan</label>
                  <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a business plan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{plan.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lender Persona</label>
                  <Select
                    value={selectedPersona}
                    onValueChange={(v) => setSelectedPersona(v as 'bank' | 'investor' | 'grant_officer')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Bank</span>
                          <span className="text-[10px] text-muted-foreground">— Strict DSCR & collateral focus</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="investor">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3.5 w-3.5 text-cyan-500" />
                          <span>Investor</span>
                          <span className="text-[10px] text-muted-foreground">— Growth & ROI focus</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="grant_officer">
                        <div className="flex items-center gap-2">
                          <Landmark className="h-3.5 w-3.5 text-amber-500" />
                          <span>Grant Officer</span>
                          <span className="text-[10px] text-muted-foreground">— Impact & compliance focus</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleRunReview}
                  disabled={!selectedPlanId || isRunning}
                  className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running Review...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Start AI Review
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* No review state */}
      {planReviews.length === 0 && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4">
                <Scale className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No Reviews Yet</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Run your first plan review to get lender-grade analysis that catches discrepancies between your narrative and financials.
              </p>
              <Button
                onClick={() => setNewReviewDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                <Eye className="h-4 w-4" />
                Run First Review
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {currentReview && (
        <>
          {/* ─── Review Selector (if multiple) ─── */}
          {planReviews.length > 1 && (
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Reviews</span>
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {planReviews.map((review) => (
                  <ReviewSummaryCard
                    key={review.id}
                    review={review}
                    isSelected={selectedReview === review.id || (!selectedReview && review.id === planReviews[0]?.id)}
                    onClick={() => setSelectedReview(review.id)}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ─── Score Dashboard ─── */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-emerald-500" />
                      Review Scores
                    </CardTitle>
                    <CardDescription>
                      {currentPlan?.title ?? `Plan #${currentReview.planId}`}
                      {' · '}
                      <LenderPersonaBadge persona={currentReview.lenderPersona} size="sm" />
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs px-2 py-1',
                        currentReview.status === 'completed' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                        currentReview.status === 'running' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
                        currentReview.status === 'pending' && 'bg-muted/50 text-muted-foreground'
                      )}
                    >
                      {currentReview.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {currentReview.status === 'running' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      {currentReview.status === 'pending' && <CircleDot className="h-3 w-3 mr-1" />}
                      {currentReview.status.charAt(0).toUpperCase() + currentReview.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-4">
                  <ScoreGauge
                    score={currentReview.narrativeScore}
                    label="Narrative"
                    color={getScoreColor(currentReview.narrativeScore)}
                  />
                  <ScoreGauge
                    score={currentReview.financialScore}
                    label="Financial"
                    color={getScoreColor(currentReview.financialScore)}
                  />
                  <ScoreGauge
                    score={currentReview.consistencyScore}
                    label="Consistency"
                    color={getScoreColor(currentReview.consistencyScore)}
                  />
                  <ScoreGauge
                    score={currentReview.overallScore}
                    label="Overall"
                    color={getScoreColor(currentReview.overallScore)}
                  />
                </div>

                {/* Score breakdown bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 pt-4 border-t border-border/50">
                  {[
                    { label: 'Narrative', score: currentReview.narrativeScore, color: getScoreColor(currentReview.narrativeScore) },
                    { label: 'Financial', score: currentReview.financialScore, color: getScoreColor(currentReview.financialScore) },
                    { label: 'Consistency', score: currentReview.consistencyScore, color: getScoreColor(currentReview.consistencyScore) },
                    { label: 'Overall', score: currentReview.overallScore, color: getScoreColor(currentReview.overallScore) },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-bold" style={{ color: item.color }}>
                          {item.score}/100
                        </span>
                      </div>
                      <Progress
                        value={item.score}
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── Main Tabs: Discrepancies & Recommendations ─── */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <TabsList className="flex flex-wrap h-auto gap-1 p-1">
                      <TabsTrigger value="discrepancies" className="gap-1.5 text-xs sm:text-sm">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Discrepancies
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 h-5">
                          {currentReview.discrepancies.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="recommendations" className="gap-1.5 text-xs sm:text-sm">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Recommendations
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 h-5">
                          {currentReview.recommendations.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="full-report" className="gap-1.5 text-xs sm:text-sm">
                        <FileText className="h-3.5 w-3.5" />
                        Full Report
                      </TabsTrigger>
                    </TabsList>

                    {/* Quick severity/priority filter badges */}
                    {activeTab === 'discrepancies' && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {severityCounts.critical > 0 && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 h-5 gap-1">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            {severityCounts.critical} Critical
                          </Badge>
                        )}
                        {severityCounts.warning > 0 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 h-5 gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                            <AlertCircle className="h-2.5 w-2.5" />
                            {severityCounts.warning} Warning
                          </Badge>
                        )}
                        {severityCounts.info > 0 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 h-5 gap-1 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10">
                            <Info className="h-2.5 w-2.5" />
                            {severityCounts.info} Info
                          </Badge>
                        )}
                      </div>
                    )}
                    {activeTab === 'recommendations' && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {priorityCounts.high > 0 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 h-5 gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30">
                            {priorityCounts.high} High
                          </Badge>
                        )}
                        {priorityCounts.medium > 0 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 h-5 gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                            {priorityCounts.medium} Medium
                          </Badge>
                        )}
                        {priorityCounts.low > 0 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 h-5 gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                            {priorityCounts.low} Low
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  {/* ── Discrepancies Tab ── */}
                  <TabsContent value="discrepancies" className="mt-0">
                    {currentReview.discrepancies.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3" />
                        <h4 className="text-sm font-semibold mb-1">No Discrepancies Found</h4>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          Your narrative and financials are perfectly aligned. Great job!
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="max-h-[520px]">
                        <motion.div
                          className="space-y-3 pr-2"
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                        >
                          {/* Sort: critical first */}
                          {[...currentReview.discrepancies]
                            .sort((a, b) => {
                              const order = { critical: 0, warning: 1, info: 2 };
                              return order[a.severity] - order[b.severity];
                            })
                            .map((d) => (
                              <DiscrepancyCard
                                key={d.id}
                                discrepancy={d}
                                isExpanded={expandedDiscrepancies.has(d.id)}
                                onToggle={() => toggleDiscrepancy(d.id)}
                              />
                            ))}
                        </motion.div>
                      </ScrollArea>
                    )}
                  </TabsContent>

                  {/* ── Recommendations Tab ── */}
                  <TabsContent value="recommendations" className="mt-0">
                    {currentReview.recommendations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Sparkles className="h-10 w-10 text-emerald-500 mb-3" />
                        <h4 className="text-sm font-semibold mb-1">No Recommendations</h4>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          Your plan meets all criteria. No improvements needed at this time.
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="max-h-[520px]">
                        <motion.div
                          className="space-y-3 pr-2"
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                        >
                          {/* Sort: high priority first */}
                          {[...currentReview.recommendations]
                            .sort((a, b) => {
                              const order = { high: 0, medium: 1, low: 2 };
                              return order[a.priority] - order[b.priority];
                            })
                            .map((r) => (
                              <RecommendationCard
                                key={r.id}
                                recommendation={r}
                              />
                            ))}
                        </motion.div>
                      </ScrollArea>
                    )}
                  </TabsContent>

                  {/* ── Full Report Tab ── */}
                  <TabsContent value="full-report" className="mt-0">
                    <div className="space-y-4">
                      {/* Report header */}
                      <div className="rounded-lg bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                            <Scale className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold">Plan Review Report</h3>
                            <p className="text-xs text-muted-foreground">
                              {currentPlan?.title ?? `Plan #${currentReview.planId}`}
                              {' · '}
                              {new Date(currentReview.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { label: 'Narrative', score: currentReview.narrativeScore },
                            { label: 'Financial', score: currentReview.financialScore },
                            { label: 'Consistency', score: currentReview.consistencyScore },
                            { label: 'Overall', score: currentReview.overallScore },
                          ].map((item) => (
                            <div key={item.label} className="text-center">
                              <div
                                className="text-2xl font-bold"
                                style={{ color: getScoreColor(item.score) }}
                              >
                                {item.score}
                              </div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Executive Summary */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-emerald-500" />
                          Executive Summary
                        </h4>
                        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                          <p>
                            This review was conducted from the perspective of a{' '}
                            <strong className="text-foreground">
                              {currentReview.lenderPersona === 'bank'
                                ? 'Bank Loan Officer'
                                : currentReview.lenderPersona === 'investor'
                                ? 'Venture Capital Investor'
                                : 'Government Grant Officer'}
                            </strong>
                            . The overall plan quality score is{' '}
                            <strong style={{ color: getScoreColor(currentReview.overallScore) }}>
                              {currentReview.overallScore}/100
                            </strong>
                            .
                          </p>
                          {severityCounts.critical > 0 && (
                            <p className="text-red-500 dark:text-red-400">
                              <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />
                              <strong>{severityCounts.critical} critical discrepancy{severityCounts.critical > 1 ? 'ies' : 'y'}</strong> found
                              — these must be resolved before submission.
                            </p>
                          )}
                          {severityCounts.warning > 0 && (
                            <p className="text-amber-600 dark:text-amber-400">
                              <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                              <strong>{severityCounts.warning} warning{severityCounts.warning > 1 ? 's' : ''}</strong> identified
                              — strongly recommended to address.
                            </p>
                          )}
                          {severityCounts.info > 0 && (
                            <p className="text-cyan-600 dark:text-cyan-400">
                              <Info className="h-3.5 w-3.5 inline mr-1" />
                              <strong>{severityCounts.info} informational note{severityCounts.info > 1 ? 's' : ''}</strong> for
                              improvement.
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Detailed findings */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Detailed Findings
                        </h4>
                        <div className="space-y-3">
                          {currentReview.discrepancies
                            .sort((a, b) => {
                              const order = { critical: 0, warning: 1, info: 2 };
                              return order[a.severity] - order[b.severity];
                            })
                            .map((d) => {
                              const sConfig = {
                                critical: { color: COLORS.red, label: 'CRITICAL' },
                                warning: { color: COLORS.amber, label: 'WARNING' },
                                info: { color: COLORS.cyan, label: 'INFO' },
                              };
                              const sc = sConfig[d.severity];
                              return (
                                <div key={d.id} className="rounded border border-border/50 p-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] px-1.5 font-bold"
                                      style={{
                                        borderColor: sc.color,
                                        color: sc.color,
                                        backgroundColor: `${sc.color}15`,
                                      }}
                                    >
                                      {sc.label}
                                    </Badge>
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {d.section}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground">{d.description}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div className="rounded bg-amber-500/5 border border-amber-500/15 p-2">
                                      <span className="font-semibold text-amber-600 dark:text-amber-400">Narrative: </span>
                                      {d.narrativeClaim}
                                    </div>
                                    <div className="rounded bg-rose-500/5 border border-rose-500/15 p-2">
                                      <span className="font-semibold text-rose-600 dark:text-rose-400">Financials: </span>
                                      {d.financialReality}
                                    </div>
                                  </div>
                                  <p className="text-xs">
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Fix: </span>
                                    {d.suggestedFix}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      <Separator />

                      {/* Recommendations summary */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-cyan-500" />
                          Recommendations Summary
                        </h4>
                        <div className="space-y-2">
                          {currentReview.recommendations
                            .sort((a, b) => {
                              const order = { high: 0, medium: 1, low: 2 };
                              return order[a.priority] - order[b.priority];
                            })
                            .map((r, idx) => (
                              <div key={r.id} className="flex items-start gap-2 text-sm">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="font-medium">{r.recommendation}</span>
                                  <span className="text-muted-foreground"> — {r.impact}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
