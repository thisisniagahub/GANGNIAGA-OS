'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import type { IdeaCanvasData, ValidationReport } from '@/lib/types';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Lightbulb,
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Trash2,
  Loader2,
  Shield,
  Search,
  Eye,
  ChevronRight,
  BarChart3,
  Edit,
  LayoutTemplate,
  Clock,
} from 'lucide-react';

// Templates
import { ideaCanvasTemplates, type IdeaCanvasTemplate } from '@/lib/templates/idea-canvas-templates';

// ─── Color Palette (emerald, teal, amber, rose, cyan) ───────────────────────
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

// ─── Status Config ───────────────────────────────────────────────────────────
type IdeaStatus = IdeaCanvasData['status'];

interface StatusConfig {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: React.ElementType;
}

const STATUS_CONFIG: Record<IdeaStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-500/30',
    icon: Edit,
  },
  validating: {
    label: 'Validating',
    bgClass: 'bg-cyan-500/15',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    borderClass: 'border-cyan-500/30',
    icon: Loader2,
  },
  validated: {
    label: 'AI Validated',
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-500/30',
    icon: CheckCircle2,
  },
  needs_rework: {
    label: 'Needs Rework',
    bgClass: 'bg-rose-500/15',
    textClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-500/30',
    icon: XCircle,
  },
};

// ─── Risk Level Config ───────────────────────────────────────────────────────
type RiskLevel = ValidationReport['riskLevel'];

interface RiskConfig {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskConfig> = {
  low: { label: 'Low Risk', color: COLORS.emerald, bgClass: 'bg-emerald-500/15', textClass: 'text-emerald-600 dark:text-emerald-400' },
  medium: { label: 'Medium Risk', color: COLORS.amber, bgClass: 'bg-amber-500/15', textClass: 'text-amber-600 dark:text-amber-400' },
  high: { label: 'High Risk', color: COLORS.rose, bgClass: 'bg-rose-500/15', textClass: 'text-rose-600 dark:text-rose-400' },
  critical: { label: 'Critical Risk', color: '#dc2626', bgClass: 'bg-red-600/15', textClass: 'text-red-600 dark:text-red-400' },
};

// ─── Template Difficulty Config ────────────────────────────────────────────
const TEMPLATE_DIFFICULTY_CONFIG: Record<string, { label: string; className: string }> = {
  beginner: { label: 'Beginner', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
  intermediate: { label: 'Intermediate', className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  advanced: { label: 'Advanced', className: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' },
};

const TEMPLATE_CATEGORIES = [...new Set(ideaCanvasTemplates.map(t => t.category))];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score < 40) return COLORS.rose;
  if (score < 70) return COLORS.amber;
  return COLORS.emerald;
}

function getScoreLabel(score: number): string {
  if (score < 40) return 'Weak';
  if (score < 70) return 'Promising';
  return 'Strong';
}

// ─── Animation Variants ──────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Score Gauge Component (Circular SVG)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ScoreGauge({ score, size = 160 }: { score: number; size?: number }) {
  const color = getScoreColor(score);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          opacity={0.3}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
        {/* Glow effect */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          opacity={0.15}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground font-medium">{getScoreLabel(score)}</span>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Radar Chart Component (SVG)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function RadarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const size = 220;
  const center = size / 2;
  const maxRadius = 80;
  const levels = 4;
  const angleStep = (2 * Math.PI) / data.length;

  // Calculate points
  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Grid lines
  const gridLevels = Array.from({ length: levels }, (_, i) => i + 1);
  const axisLabels = data.map((d, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const labelRadius = maxRadius + 22;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      label: d.label,
      value: d.value,
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
      {/* Grid rings */}
      {gridLevels.map((level) => {
        const r = (level / levels) * maxRadius;
        const points = data.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="0.5"
            opacity={0.2}
          />
        );
      })}

      {/* Axis lines */}
      {data.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + maxRadius * Math.cos(angle)}
            y2={center + maxRadius * Math.sin(angle)}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="0.5"
            opacity={0.2}
          />
        );
      })}

      {/* Data polygon fill */}
      <polygon
        points={data.map((d, i) => {
          const p = getPoint(i, d.value);
          return `${p.x},${p.y}`;
        }).join(' ')}
        fill={COLORS.emerald}
        fillOpacity={0.15}
        stroke={COLORS.emerald}
        strokeWidth={1.5}
      />

      {/* Data points */}
      {data.map((d, i) => {
        const p = getPoint(i, d.value);
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={d.color} stroke="white" strokeWidth={1.5} />
            <circle cx={p.x} cy={p.y} r={7} fill={d.color} opacity={0.15} />
          </g>
        );
      })}

      {/* Axis labels */}
      {axisLabels.map((label, i) => (
        <g key={i}>
          <text
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            fontSize="8"
            fontWeight="500"
          >
            {label.label}
          </text>
          <text
            x={label.x}
            y={label.y + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7"
            fontWeight="700"
            fill={data[i].color}
          >
            {label.value}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function IdeaCanvasModule() {
  const { ideaCanvases, selectedIdea, setSelectedIdea } = useAppStore();

  const [viewMode, setViewMode] = useState<'canvas' | 'report'>('canvas');
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // New idea form state
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newTargetMarket, setNewTargetMarket] = useState('');
  const [newRevenueModel, setNewRevenueModel] = useState('');
  const [newCompetitiveEdge, setNewCompetitiveEdge] = useState('');

  // Edit state for current idea
  const [editProblem, setEditProblem] = useState('');
  const [editSolution, setEditSolution] = useState('');
  const [editTargetMarket, setEditTargetMarket] = useState('');
  const [editRevenueModel, setEditRevenueModel] = useState('');
  const [editCompetitiveEdge, setEditCompetitiveEdge] = useState('');
  const [editRisks, setEditRisks] = useState<string[]>([]);
  const [newRisk, setNewRisk] = useState('');

  // Template state
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');

  // Get selected idea
  const activeIdea = useMemo(
    () => ideaCanvases.find((ic) => ic.id === selectedIdea) ?? null,
    [ideaCanvases, selectedIdea]
  );

  // Sync edit fields when active idea changes
  useMemo(() => {
    if (activeIdea) {
      setEditProblem(activeIdea.problem);
      setEditSolution(activeIdea.solution);
      setEditTargetMarket(activeIdea.targetMarket);
      setEditRevenueModel(activeIdea.revenueModel);
      setEditCompetitiveEdge(activeIdea.competitiveEdge);
      setEditRisks([...activeIdea.risks]);
    }
  }, [activeIdea?.id]);

  // Handle idea selection
  const handleSelectIdea = useCallback(
    (id: string) => {
      setSelectedIdea(id);
      const idea = ideaCanvases.find((ic) => ic.id === id);
      if (idea?.validationReport) {
        setViewMode('report');
      } else {
        setViewMode('canvas');
      }
    },
    [ideaCanvases, setSelectedIdea]
  );

  // Handle new idea creation
  const handleCreateIdea = () => {
    if (!newTitle.trim()) return;

    // If template selected, pre-fill canvas from template sections
    let problem = newProblem;
    let solution = newSolution;
    let targetMarket = newTargetMarket;
    let revenueModel = newRevenueModel;
    let competitiveEdge = newCompetitiveEdge;

    if (useTemplate && selectedTemplateId) {
      const template = ideaCanvasTemplates.find(t => t.id === selectedTemplateId);
      if (template) {
        const sections = template.sections;
        // Map template sections to canvas fields
        const keyPartners = sections.find(s => s.title === 'Key Partners');
        const valueProps = sections.find(s => s.title === 'Value Propositions');
        const segments = sections.find(s => s.title === 'Customer Segments');
        const revenue = sections.find(s => s.title === 'Revenue Streams');
        const activities = sections.find(s => s.title === 'Key Activities');

        if (!problem && valueProps) problem = valueProps.prompts.join('. ');
        if (!solution && activities) solution = activities.prompts.slice(0, 3).join('. ');
        if (!targetMarket && segments) targetMarket = segments.prompts.join('. ');
        if (!revenueModel && revenue) revenueModel = revenue.prompts.slice(0, 3).join('. ');
        if (!competitiveEdge && valueProps) competitiveEdge = valueProps.prompts.slice(0, 2).join('. ');
      }
    }

    const newIdea: IdeaCanvasData = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      status: 'draft',
      problem,
      solution,
      targetMarket,
      revenueModel,
      competitiveEdge,
      risks: [],
      validationScore: 0,
      validationReport: null,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    useAppStore.setState({ ideaCanvases: [...ideaCanvases, newIdea] });
    setSelectedIdea(newIdea.id);
    setNewDialogOpen(false);
    // Reset form
    setNewTitle('');
    setNewProblem('');
    setNewSolution('');
    setNewTargetMarket('');
    setNewRevenueModel('');
    setNewCompetitiveEdge('');
    setUseTemplate(false);
    setSelectedTemplateId(null);
    setTemplateCategoryFilter('all');
    toast.success('Idea canvas created');
  };

  // Save canvas edits to store
  const handleSaveCanvas = useCallback(() => {
    if (!activeIdea) return;
    const updatedCanvases = ideaCanvases.map((ic) =>
      ic.id === activeIdea.id
        ? {
            ...ic,
            problem: editProblem,
            solution: editSolution,
            targetMarket: editTargetMarket,
            revenueModel: editRevenueModel,
            competitiveEdge: editCompetitiveEdge,
            risks: editRisks,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : ic
    );
    useAppStore.setState({ ideaCanvases: updatedCanvases });
    toast.success('Canvas saved successfully');
  }, [activeIdea, ideaCanvases, editProblem, editSolution, editTargetMarket, editRevenueModel, editCompetitiveEdge, editRisks]);

  // Delete idea from store
  const handleDeleteIdea = useCallback((id: string) => {
    const updatedCanvases = ideaCanvases.filter((ic) => ic.id !== id);
    useAppStore.setState({ ideaCanvases: updatedCanvases });
    if (selectedIdea === id) {
      setSelectedIdea(null);
    }
    toast.success('Idea deleted');
  }, [ideaCanvases, selectedIdea, setSelectedIdea]);

  // Handle AI validation
  const handleValidate = async () => {
    if (!activeIdea) return;
    setIsValidating(true);

    // Save current edits first
    const updatedCanvases = ideaCanvases.map((ic) =>
      ic.id === activeIdea.id
        ? {
            ...ic,
            problem: editProblem,
            solution: editSolution,
            targetMarket: editTargetMarket,
            revenueModel: editRevenueModel,
            competitiveEdge: editCompetitiveEdge,
            risks: editRisks,
            status: 'validating' as const,
          }
        : ic
    );
    useAppStore.setState({ ideaCanvases: updatedCanvases });

    try {
      const res = await fetch('/api/idea-canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId: activeIdea.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.validationReport) {
          const finalCanvases = useAppStore.getState().ideaCanvases.map((ic) =>
            ic.id === activeIdea.id
              ? {
                  ...ic,
                  status: 'validated' as const,
                  validationScore: data.validationReport.overallScore || 75,
                  validationReport: data.validationReport,
                  updatedAt: new Date().toISOString().split('T')[0],
                }
              : ic
          );
          useAppStore.setState({ ideaCanvases: finalCanvases });
          setViewMode('report');
          setIsValidating(false);
          return;
        }
      }
    } catch {
      // API failed, simulate validation
    }

    // Simulate validation result
    setTimeout(() => {
      const simulatedReport: ValidationReport = {
        overallScore: 75,
        marketViability: 80,
        problemClarity: 85,
        solutionFeasibility: 70,
        revenuePotential: 78,
        competitivePosition: 65,
        riskLevel: 'medium',
        strengths: ['Clear problem definition', 'Large target market', 'Unique competitive advantage'],
        weaknesses: ['Revenue model needs more detail', 'Competitive analysis incomplete'],
        recommendations: ['Strengthen revenue model documentation', 'Add detailed competitor comparison'],
        redFlags: ['High burn rate relative to revenue'],
        benchmarkComparison: [
          { metric: 'LTV:CAC Ratio', user: 5.2, benchmark: 3.0, status: 'above' },
          { metric: 'Market Growth', user: 22, benchmark: 15, status: 'above' },
          { metric: 'Team Size', user: 12, benchmark: 18, status: 'below' },
        ],
      };
      const finalCanvases = useAppStore.getState().ideaCanvases.map((ic) =>
        ic.id === activeIdea.id
          ? {
              ...ic,
              status: 'validated' as const,
              validationScore: 75,
              validationReport: simulatedReport,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : ic
      );
      useAppStore.setState({ ideaCanvases: finalCanvases });
      setIsValidating(false);
      setViewMode('report');
      toast.success('Idea validated! Score: 75/100');
    }, 2500);
  };

  // Add risk to edit list
  const handleAddRisk = () => {
    if (newRisk.trim()) {
      setEditRisks((prev) => [...prev, newRisk.trim()]);
      setNewRisk('');
    }
  };

  // Remove risk from edit list
  const handleRemoveRisk = (index: number) => {
    setEditRisks((prev) => prev.filter((_, i) => i !== index));
  };

  // Radar chart data from validation report
  const radarData = useMemo(() => {
    if (!activeIdea?.validationReport) return [];
    const r = activeIdea.validationReport;
    return [
      { label: 'Market Viability', value: r.marketViability, color: COLORS.emerald },
      { label: 'Problem Clarity', value: r.problemClarity, color: COLORS.teal },
      { label: 'Solution Fit', value: r.solutionFeasibility, color: COLORS.cyan },
      { label: 'Revenue Potential', value: r.revenuePotential, color: COLORS.amber },
      { label: 'Competitive Edge', value: r.competitivePosition, color: '#f97316' },
    ];
  }, [activeIdea?.validationReport]);

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
            <Lightbulb className="size-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">Idea Canvas & Validation</h2>
              {activeIdea?.status === 'validated' && (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
                  <CheckCircle2 className="size-3" />
                  AI Validated
                </Badge>
              )}
              {activeIdea?.status === 'draft' && (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 text-[10px]">
                  <Edit className="size-3" />
                  Draft
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Pressure-test your business idea before investing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <Plus className="size-3.5" />
                New Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lightbulb className="size-4 text-emerald-600" />
                  Create New Idea Canvas
                </DialogTitle>
                <DialogDescription>
                  Define your business idea across 5 key dimensions for AI validation.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  {/* Start from Template Toggle */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setUseTemplate(!useTemplate);
                        if (useTemplate) {
                          setSelectedTemplateId(null);
                        }
                      }}
                      className={`flex items-center gap-2 rounded-lg border p-3 w-full text-left transition-all duration-200 ${
                        useTemplate
                          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <LayoutTemplate className={`size-5 shrink-0 ${useTemplate ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${useTemplate ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                          Start from Template
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          Choose from {ideaCanvasTemplates.length} Malaysia-specific business model canvas templates
                        </p>
                      </div>
                      <div className={`h-5 w-9 rounded-full transition-colors flex items-center ${useTemplate ? 'bg-emerald-600 justify-end' : 'bg-muted justify-start'}`}>
                        <div className="h-4 w-4 rounded-full bg-white shadow-sm mx-0.5 transition-transform" />
                      </div>
                    </button>
                  </div>

                  {/* Template Gallery */}
                  <AnimatePresence>
                    {useTemplate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3">
                          {/* Category Filter */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => setTemplateCategoryFilter('all')}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                                templateCategoryFilter === 'all'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              All ({ideaCanvasTemplates.length})
                            </button>
                            {TEMPLATE_CATEGORIES.map(cat => {
                              const count = ideaCanvasTemplates.filter(t => t.category === cat).length;
                              return (
                                <button
                                  key={cat}
                                  onClick={() => setTemplateCategoryFilter(cat)}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                                    templateCategoryFilter === cat
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                  }`}
                                >
                                  {cat} ({count})
                                </button>
                              );
                            })}
                          </div>

                          {/* Template Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                            {ideaCanvasTemplates
                              .filter(t => templateCategoryFilter === 'all' || t.category === templateCategoryFilter)
                              .map(template => {
                                const diffConfig = TEMPLATE_DIFFICULTY_CONFIG[template.difficulty];
                                const isSelected = selectedTemplateId === template.id;
                                return (
                                  <motion.button
                                    key={template.id}
                                    onClick={() => {
                                      setSelectedTemplateId(isSelected ? null : template.id);
                                      if (!isSelected) {
                                        setNewTitle(template.name);
                                      }
                                    }}
                                    className={`flex flex-col gap-2 rounded-lg border p-3 text-left transition-all duration-200 ${
                                      isSelected
                                        ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-400 dark:border-emerald-700 dark:bg-emerald-950/30 dark:ring-emerald-600'
                                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/20'
                                    }`}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={`text-xs font-semibold leading-tight ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                                        {template.name}
                                      </p>
                                      {isSelected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600"
                                        >
                                          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        </motion.div>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                                      {template.description}
                                    </p>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 gap-0.5 border-muted-foreground/20 text-muted-foreground">
                                        {template.category}
                                      </Badge>
                                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${diffConfig.className}`}>
                                        {diffConfig.label}
                                      </Badge>
                                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                                        {template.sections.length} sections
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="border-t border-emerald-200 dark:border-emerald-800 pt-2 mt-1"
                                      >
                                        <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 mb-1.5">
                                          9 Canvas Sections:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {template.sections.slice(0, 5).map((s, i) => (
                                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                              {s.title}
                                            </span>
                                          ))}
                                          {template.sections.length > 5 && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                                              +{template.sections.length - 5} more
                                            </span>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </motion.button>
                                );
                              })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Idea Title</label>
                    <Input
                      placeholder="e.g., AI-Powered Inventory Optimizer for SMEs"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <AlertTriangle className="size-3 text-amber-500" />
                      Problem
                    </label>
                    <Textarea
                      placeholder="What problem are you solving?"
                      value={newProblem}
                      onChange={(e) => setNewProblem(e.target.value)}
                      className="min-h-20 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <Sparkles className="size-3 text-emerald-500" />
                      Solution
                    </label>
                    <Textarea
                      placeholder="How does your idea solve this problem?"
                      value={newSolution}
                      onChange={(e) => setNewSolution(e.target.value)}
                      className="min-h-20 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <Target className="size-3 text-teal-500" />
                      Target Market
                    </label>
                    <Textarea
                      placeholder="Who are your target customers?"
                      value={newTargetMarket}
                      onChange={(e) => setNewTargetMarket(e.target.value)}
                      className="min-h-20 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <TrendingUp className="size-3 text-cyan-500" />
                      Revenue Model
                    </label>
                    <Textarea
                      placeholder="How will you make money?"
                      value={newRevenueModel}
                      onChange={(e) => setNewRevenueModel(e.target.value)}
                      className="min-h-20 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Shield className="size-3 text-amber-500" />
                    Competitive Edge
                  </label>
                  <Textarea
                    placeholder="What makes your idea different or better?"
                    value={newCompetitiveEdge}
                    onChange={(e) => setNewCompetitiveEdge(e.target.value)}
                    className="min-h-16 resize-none"
                  />
                </div>
              </div>
              </ScrollArea>

              <DialogFooter className="gap-2 sm:gap-0 mt-2">
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  onClick={handleCreateIdea}
                  disabled={!newTitle.trim()}
                >
                  <Lightbulb className="size-3.5" />
                  {selectedTemplateId ? 'Create from Template' : 'Create Canvas'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* ── Main Layout: Left Panel + Right Panel ─────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* ── Left Panel (Idea List) ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full lg:w-1/3 shrink-0"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Your Ideas</CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  {ideaCanvases.length} idea{ideaCanvases.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full max-h-[calc(100vh-240px)]">
                <div className="px-4 pb-4 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {ideaCanvases.map((idea, i) => {
                      const isActive = selectedIdea === idea.id;
                      const statusCfg = STATUS_CONFIG[idea.status];
                      const StatusIcon = statusCfg.icon;
                      const scoreColor = getScoreColor(idea.validationScore);

                      return (
                        <motion.button
                          key={idea.id}
                          layout
                          custom={i}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                          onClick={() => handleSelectIdea(idea.id)}
                          className={cn(
                            'w-full text-left rounded-xl p-3 transition-all duration-200',
                            'border hover:shadow-md',
                            isActive
                              ? 'border-emerald-500/40 bg-emerald-500/5 shadow-sm'
                              : 'border-transparent hover:border-border hover:bg-muted/30'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {/* Score Circle */}
                            <div className="flex-shrink-0 mt-0.5">
                              {idea.validationScore > 0 ? (
                                <div className="relative size-11">
                                  <svg width="44" height="44" className="transform -rotate-90">
                                    <circle
                                      cx="22"
                                      cy="22"
                                      r="18"
                                      fill="none"
                                      stroke="hsl(var(--muted))"
                                      strokeWidth="3"
                                      opacity={0.25}
                                    />
                                    <circle
                                      cx="22"
                                      cy="22"
                                      r="18"
                                      fill="none"
                                      stroke={scoreColor}
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeDasharray={2 * Math.PI * 18}
                                      strokeDashoffset={2 * Math.PI * 18 - (idea.validationScore / 100) * 2 * Math.PI * 18}
                                      className="transition-all duration-700"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[11px] font-bold" style={{ color: scoreColor }}>
                                      {idea.validationScore}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="size-11 rounded-full bg-muted/50 flex items-center justify-center">
                                  <Lightbulb className="size-4 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>

                            {/* Title & Status */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{idea.title}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge
                                  className={cn(
                                    'gap-1 text-[9px] px-1.5 py-0 border',
                                    statusCfg.bgClass,
                                    statusCfg.textClass,
                                    statusCfg.borderClass
                                  )}
                                >
                                  <StatusIcon
                                    className={cn(
                                      'size-2.5',
                                      idea.status === 'validating' && 'animate-spin'
                                    )}
                                  />
                                  {statusCfg.label}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                  {idea.risks.length} risk{idea.risks.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <ChevronRight
                              className={cn(
                                'size-4 mt-1 transition-colors',
                                isActive ? 'text-emerald-500' : 'text-muted-foreground/40'
                              )}
                            />
                          </div>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>

                  {ideaCanvases.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                    >
                      <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                        <Lightbulb className="size-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-medium">No ideas yet</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Create your first idea canvas to get started
                      </p>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Right Panel (Canvas / Report) ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 min-w-0"
        >
          {activeIdea ? (
            <Card className="h-full flex flex-col">
              {/* Right Panel Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{activeIdea.title}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Created {activeIdea.createdAt} · Updated {activeIdea.updatedAt}
                    </CardDescription>
                  </div>
                  <Tabs
                    value={viewMode}
                    onValueChange={(v) => setViewMode(v as 'canvas' | 'report')}
                    className="self-start"
                  >
                    <TabsList className="h-8">
                      <TabsTrigger value="canvas" className="text-xs gap-1.5 px-3">
                        <Edit className="size-3" />
                        Canvas
                      </TabsTrigger>
                      <TabsTrigger
                        value="report"
                        className="text-xs gap-1.5 px-3"
                        disabled={!activeIdea.validationReport && !isValidating}
                      >
                        <BarChart3 className="size-3" />
                        Validation Report
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full max-h-[calc(100vh-280px)]">
                  <AnimatePresence mode="wait">
                    {/* ━━━ Canvas Mode ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                    {viewMode === 'canvas' && (
                      <motion.div
                        key="canvas"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 sm:p-6 space-y-5"
                      >
                        {/* 5-Field Canvas Form */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div variants={fadeIn} initial="hidden" animate="visible">
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1.5">
                                <AlertTriangle className="size-3.5 text-amber-500" />
                                Problem Statement
                              </label>
                              <Textarea
                                placeholder="What problem are you solving?"
                                value={editProblem}
                                onChange={(e) => setEditProblem(e.target.value)}
                                className="min-h-24 resize-none text-sm"
                              />
                            </div>
                          </motion.div>

                          <motion.div variants={fadeIn} initial="hidden" animate="visible">
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1.5">
                                <Sparkles className="size-3.5 text-emerald-500" />
                                Proposed Solution
                              </label>
                              <Textarea
                                placeholder="How does your idea solve this problem?"
                                value={editSolution}
                                onChange={(e) => setEditSolution(e.target.value)}
                                className="min-h-24 resize-none text-sm"
                              />
                            </div>
                          </motion.div>

                          <motion.div variants={fadeIn} initial="hidden" animate="visible">
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1.5">
                                <Target className="size-3.5 text-teal-500" />
                                Target Market
                              </label>
                              <Textarea
                                placeholder="Who are your target customers?"
                                value={editTargetMarket}
                                onChange={(e) => setEditTargetMarket(e.target.value)}
                                className="min-h-24 resize-none text-sm"
                              />
                            </div>
                          </motion.div>

                          <motion.div variants={fadeIn} initial="hidden" animate="visible">
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-1.5">
                                <TrendingUp className="size-3.5 text-cyan-500" />
                                Revenue Model
                              </label>
                              <Textarea
                                placeholder="How will you make money?"
                                value={editRevenueModel}
                                onChange={(e) => setEditRevenueModel(e.target.value)}
                                className="min-h-24 resize-none text-sm"
                              />
                            </div>
                          </motion.div>
                        </div>

                        {/* Competitive Edge (full width) */}
                        <motion.div variants={fadeIn} initial="hidden" animate="visible">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                              <Shield className="size-3.5 text-amber-500" />
                              Competitive Edge
                            </label>
                            <Textarea
                              placeholder="What makes your idea different or better than existing solutions?"
                              value={editCompetitiveEdge}
                              onChange={(e) => setEditCompetitiveEdge(e.target.value)}
                              className="min-h-20 resize-none text-sm"
                            />
                          </div>
                        </motion.div>

                        <Separator />

                        {/* Risks Section */}
                        <motion.div variants={fadeIn} initial="hidden" animate="visible">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium flex items-center gap-1.5">
                                <AlertTriangle className="size-3.5 text-rose-500" />
                                Identified Risks
                              </label>
                              <Badge variant="outline" className="text-[10px]">
                                {editRisks.length} risk{editRisks.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>

                            {/* Risk List */}
                            <div className="space-y-2">
                              <AnimatePresence mode="popLayout">
                                {editRisks.map((risk, i) => (
                                  <motion.div
                                    key={`${risk}-${i}`}
                                    layout
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-start gap-2 rounded-lg border bg-muted/30 p-2.5 group"
                                  >
                                    <AlertTriangle className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                                    <span className="text-sm flex-1">{risk}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-500 shrink-0"
                                      onClick={() => handleRemoveRisk(i)}
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>

                            {/* Add Risk Input */}
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Add a risk..."
                                value={newRisk}
                                onChange={(e) => setNewRisk(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddRisk();
                                }}
                                className="h-9 text-sm"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 gap-1"
                                onClick={handleAddRisk}
                                disabled={!newRisk.trim()}
                              >
                                <Plus className="size-3" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </motion.div>

                        <Separator />

                        {/* Save & Delete Buttons */}
                        <motion.div variants={fadeIn} initial="hidden" animate="visible">
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <Button
                              variant="outline"
                              size="lg"
                              className="w-full sm:w-auto gap-2"
                              onClick={handleSaveCanvas}
                            >
                              <CheckCircle2 className="size-4" />
                              Save Canvas
                            </Button>
                            <Button
                              variant="outline"
                              size="lg"
                              className="w-full sm:w-auto gap-2 text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                              onClick={() => handleDeleteIdea(activeIdea.id)}
                            >
                              <Trash2 className="size-4" />
                              Delete Idea
                            </Button>
                          </div>
                        </motion.div>

                        <Separator />

                        {/* Validate Button */}
                        <motion.div variants={fadeIn} initial="hidden" animate="visible">
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <Button
                              size="lg"
                              className={cn(
                                'w-full sm:w-auto gap-2 text-white',
                                isValidating
                                  ? 'bg-cyan-600 hover:bg-cyan-700'
                                  : 'bg-emerald-600 hover:bg-emerald-700'
                              )}
                              onClick={handleValidate}
                              disabled={isValidating}
                            >
                              {isValidating ? (
                                <>
                                  <Loader2 className="size-4 animate-spin" />
                                  AI Validating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="size-4" />
                                  Validate with AI
                                </>
                              )}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center sm:text-left">
                              AI will analyze your idea across 5 dimensions and provide an honest risk assessment
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* ━━━ Validation Report Mode ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                    {viewMode === 'report' && activeIdea.validationReport && (
                      <motion.div
                        key="report"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 sm:p-6 space-y-6"
                      >
                        {(() => {
                          const report = activeIdea.validationReport!;
                          const riskCfg = RISK_CONFIG[report.riskLevel];
                          const overallColor = getScoreColor(report.overallScore);

                          return (
                            <>
                              {/* ── Score Overview Row ──────────────────────────── */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Overall Score Gauge */}
                                <motion.div
                                  custom={0}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <Card className="h-full border-l-4" style={{ borderLeftColor: overallColor }}>
                                    <CardContent className="p-4 flex flex-col items-center">
                                      <p className="text-xs text-muted-foreground font-medium mb-3">
                                        Overall Validation Score
                                      </p>
                                      <div className="relative">
                                        <ScoreGauge score={report.overallScore} size={140} />
                                      </div>
                                      <Badge
                                        className={cn(
                                          'mt-3 gap-1 border',
                                          riskCfg.bgClass,
                                          riskCfg.textClass
                                        )}
                                        style={{ borderColor: riskCfg.color + '40' }}
                                      >
                                        <Shield className="size-3" />
                                        {riskCfg.label}
                                      </Badge>
                                    </CardContent>
                                  </Card>
                                </motion.div>

                                {/* Radar Chart */}
                                <motion.div
                                  custom={1}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <Card className="h-full">
                                    <CardContent className="p-4 flex flex-col items-center">
                                      <p className="text-xs text-muted-foreground font-medium mb-2">
                                        5-Dimension Analysis
                                      </p>
                                      <RadarChart data={radarData} />
                                    </CardContent>
                                  </Card>
                                </motion.div>

                                {/* Dimension Scores */}
                                <motion.div
                                  custom={2}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <Card className="h-full">
                                    <CardContent className="p-4 space-y-3">
                                      <p className="text-xs text-muted-foreground font-medium">
                                        Score Breakdown
                                      </p>
                                      {[
                                        { label: 'Market Viability', value: report.marketViability, color: COLORS.emerald },
                                        { label: 'Problem Clarity', value: report.problemClarity, color: COLORS.teal },
                                        { label: 'Solution Feasibility', value: report.solutionFeasibility, color: COLORS.cyan },
                                        { label: 'Revenue Potential', value: report.revenuePotential, color: COLORS.amber },
                                        { label: 'Competitive Position', value: report.competitivePosition, color: '#f97316' },
                                      ].map((dim) => (
                                        <div key={dim.label} className="space-y-1.5">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">{dim.label}</span>
                                            <span className="text-xs font-bold" style={{ color: dim.color }}>
                                              {dim.value}
                                            </span>
                                          </div>
                                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                            <motion.div
                                              initial={{ width: 0 }}
                                              animate={{ width: `${dim.value}%` }}
                                              transition={{ duration: 0.8, delay: 0.2 }}
                                              className="h-full rounded-full"
                                              style={{ backgroundColor: dim.color }}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              </div>

                              {/* ── Strengths & Weaknesses Row ──────────────────── */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Strengths */}
                                <motion.div
                                  custom={3}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <Card className="border-emerald-500/20 h-full">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="size-4" />
                                        Strengths
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      {report.strengths.map((s, i) => (
                                        <motion.div
                                          key={i}
                                          initial={{ opacity: 0, x: -8 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: i * 0.05 }}
                                          className="flex items-start gap-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2.5"
                                        >
                                          <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                          <span className="text-sm">{s}</span>
                                        </motion.div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                </motion.div>

                                {/* Weaknesses */}
                                <motion.div
                                  custom={4}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <Card className="border-amber-500/20 h-full">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                        <AlertTriangle className="size-4" />
                                        Weaknesses
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      {report.weaknesses.map((w, i) => (
                                        <motion.div
                                          key={i}
                                          initial={{ opacity: 0, x: -8 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: i * 0.05 }}
                                          className="flex items-start gap-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 p-2.5"
                                        >
                                          <AlertTriangle className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                                          <span className="text-sm">{w}</span>
                                        </motion.div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              </div>

                              {/* ── Red Flags Section ──────────────────────────── */}
                              {report.redFlags.length > 0 && (
                                <motion.div
                                  custom={5}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <Card className="border-rose-500/30 bg-rose-500/5">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                        <XCircle className="size-4" />
                                        Red Flags — Requires Immediate Attention
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      {report.redFlags.map((rf, i) => (
                                        <motion.div
                                          key={i}
                                          initial={{ opacity: 0, x: -8 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: i * 0.08 }}
                                          className="flex items-start gap-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3"
                                        >
                                          <XCircle className="size-4 text-rose-500 mt-0.5 shrink-0" />
                                          <span className="text-sm font-medium text-rose-700 dark:text-rose-300">{rf}</span>
                                        </motion.div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              )}

                              {/* ── Recommendations ────────────────────────────── */}
                              <motion.div
                                custom={6}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <ArrowRight className="size-4 text-teal-500" />
                                      AI Recommendations
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                      Actionable steps to improve your idea&apos;s viability
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {report.recommendations.map((rec, i) => (
                                        <motion.div
                                          key={i}
                                          initial={{ opacity: 0, y: 6 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: i * 0.06 }}
                                          className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                                        >
                                          <div className="flex items-center justify-center size-6 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 shrink-0">
                                            <span className="text-[10px] font-bold">{i + 1}</span>
                                          </div>
                                          <span className="text-sm">{rec}</span>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>

                              {/* ── Benchmark Comparison ───────────────────────── */}
                              <motion.div
                                custom={7}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <BarChart3 className="size-4 text-amber-500" />
                                      Benchmark Comparison
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                      How your idea stacks up against industry benchmarks
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {report.benchmarkComparison.map((bm, i) => {
                                        const isAbove = bm.status === 'above';
                                        const isBelow = bm.status === 'below';
                                        const statusColor = isAbove
                                          ? COLORS.emerald
                                          : isBelow
                                            ? COLORS.rose
                                            : COLORS.amber;
                                        const StatusIcon = isAbove
                                          ? TrendingUp
                                          : isBelow
                                            ? TrendingDown
                                            : Target;

                                        return (
                                          <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3"
                                          >
                                            <div
                                              className={cn(
                                                'flex items-center justify-center size-8 rounded-lg shrink-0',
                                                isAbove ? 'bg-emerald-500/15' : isBelow ? 'bg-rose-500/15' : 'bg-amber-500/15'
                                              )}
                                            >
                                              <StatusIcon
                                                className="size-4"
                                                style={{ color: statusColor }}
                                              />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium">{bm.metric}</span>
                                                <Badge
                                                  className={cn(
                                                    'text-[9px] px-1.5 border',
                                                    isAbove
                                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                                      : isBelow
                                                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                                  )}
                                                >
                                                  {isAbove ? 'Above' : isBelow ? 'Below' : 'At'} Benchmark
                                                </Badge>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                                                    <span>You: {bm.user}</span>
                                                    <span>Benchmark: {bm.benchmark}</span>
                                                  </div>
                                                  <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                                                    {/* Benchmark marker */}
                                                    <div
                                                      className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/40 z-10"
                                                      style={{ left: `${Math.min((bm.benchmark / (Math.max(bm.user, bm.benchmark) * 1.2)) * 100, 95)}%` }}
                                                    />
                                                    {/* User bar */}
                                                    <motion.div
                                                      initial={{ width: 0 }}
                                                      animate={{
                                                        width: `${Math.min((bm.user / (Math.max(bm.user, bm.benchmark) * 1.2)) * 100, 95)}%`,
                                                      }}
                                                      transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                                                      className="h-full rounded-full"
                                                      style={{ backgroundColor: statusColor }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </motion.div>
                                        );
                                      })}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>

                              {/* ── Actions ────────────────────────────────────── */}
                              <motion.div
                                custom={8}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col sm:flex-row items-center gap-3"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5"
                                  onClick={() => setViewMode('canvas')}
                                >
                                  <Edit className="size-3.5" />
                                  Edit Canvas
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                                  onClick={handleValidate}
                                  disabled={isValidating}
                                >
                                  {isValidating ? (
                                    <>
                                      <Loader2 className="size-3.5 animate-spin" />
                                      Re-validating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="size-3.5" />
                                      Re-validate with AI
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            </>
                          );
                        })()}
                      </motion.div>
                    )}

                    {/* ── Validating State ─────────────────────────────────── */}
                    {viewMode === 'report' && isValidating && !activeIdea.validationReport && (
                      <motion.div
                        key="validating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 sm:p-6"
                      >
                        <div className="flex flex-col items-center justify-center py-20">
                          <div className="relative">
                            <div className="size-20 rounded-full border-4 border-cyan-500/20 flex items-center justify-center">
                              <Loader2 className="size-8 text-cyan-500 animate-spin" />
                            </div>
                            <div className="absolute -inset-3 rounded-full border-2 border-cyan-500/10 animate-ping" />
                          </div>
                          <p className="text-sm font-medium mt-6">AI Validation in Progress</p>
                          <p className="text-xs text-muted-foreground mt-2 max-w-xs text-center">
                            Analyzing your idea across market viability, problem clarity, solution feasibility, revenue potential, and competitive position...
                          </p>
                          <div className="flex items-center gap-3 mt-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <motion.div
                                key={i}
                                className="size-2 rounded-full bg-cyan-500"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            /* ── Empty State ──────────────────────────────────────────────── */
            <Card className="h-full flex items-center justify-center">
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center max-w-sm"
                >
                  <div className="flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 mb-6">
                    <Lightbulb className="size-9 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Create Your First Idea</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Start by defining your business idea. Our AI will pressure-test it across 5 critical
                    dimensions and provide an honest risk assessment before you invest any money.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 flex-1">
                          <Plus className="size-4" />
                          New Idea Canvas
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full">
                    {[
                      { icon: Search, label: 'Market Viability', desc: 'Is there real demand?' },
                      { icon: Target, label: 'Problem Clarity', desc: 'Is the pain point clear?' },
                      { icon: Shield, label: 'Risk Assessment', desc: 'Honest red flags check' },
                    ].map((feat) => (
                      <div key={feat.label} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/30">
                        <feat.icon className="size-4 text-emerald-500" />
                        <span className="text-xs font-medium">{feat.label}</span>
                        <span className="text-[10px] text-muted-foreground">{feat.desc}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default IdeaCanvasModule;
