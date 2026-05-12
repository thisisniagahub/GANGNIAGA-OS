'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import type { PitchDeckData, PitchSlide, AnticipatedQuestion, BusinessPlanData } from '@/lib/types';
import { cn } from '@/lib/utils';

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Lucide icons
import {
  Presentation,
  Sparkles,
  FileText,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Link2,
  RefreshCw,
  Layers,
  ChevronRight,
  Send,
  Building2,
  TrendingUp,
  Landmark,
  LayoutTemplate,
  Clock,
  Users,
} from 'lucide-react';

// Templates
import { pitchDeckTemplates, type PitchDeckTemplate } from '@/lib/templates/pitch-deck-templates';

// ── Slide Type Config ────────────────────────────────────────────────

type SlideType = PitchSlide['type'];

interface SlideTypeConfig {
  label: string;
  color: string;
  icon: React.ElementType;
}

const SLIDE_TYPE_CONFIG: Record<SlideType, SlideTypeConfig> = {
  title: { label: 'Title', color: 'emerald', icon: Presentation },
  problem: { label: 'Problem', color: 'rose', icon: AlertTriangle },
  solution: { label: 'Solution', color: 'cyan', icon: Lightbulb },
  market: { label: 'Market', color: 'amber', icon: TrendingUp },
  business_model: { label: 'Business Model', color: 'teal', icon: Layers },
  financials: { label: 'Financials', color: 'emerald', icon: TrendingUp },
  team: { label: 'Team', color: 'amber', icon: Building2 },
  ask: { label: 'The Ask', color: 'cyan', icon: Send },
  appendix: { label: 'Appendix', color: 'gray', icon: FileText },
};

// ── Template Type Config ─────────────────────────────────────────────

type TemplateType = PitchDeckData['templateType'];

interface TemplateTypeConfig {
  label: string;
  color: string;
  icon: React.ElementType;
  description: string;
}

const TEMPLATE_TYPE_CONFIG: Record<TemplateType, TemplateTypeConfig> = {
  investor: { label: 'Investor', color: 'emerald', icon: TrendingUp, description: 'VC & angel — growth, market size, scalability' },
  bank: { label: 'Bank', color: 'teal', icon: Landmark, description: 'Loan — cash flow, DSCR, collateral, repayment' },
  grant: { label: 'Grant', color: 'amber', icon: Building2, description: 'Government — social impact, job creation, innovation' },
};

// ── Deck Status Config ───────────────────────────────────────────────

const DECK_STATUS_CONFIG: Record<PitchDeckData['status'], { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  generating: { label: 'Generating', className: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
};

// ── Difficulty Config ────────────────────────────────────────────────

const DIFFICULTY_CONFIG: Record<AnticipatedQuestion['difficulty'], { label: string; className: string }> = {
  easy: { label: 'Easy', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
  medium: { label: 'Medium', className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  hard: { label: 'Hard', className: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' },
};

// ── Template Difficulty Config ────────────────────────────────────────

const TEMPLATE_DIFFICULTY_CONFIG: Record<string, { label: string; className: string }> = {
  beginner: { label: 'Beginner', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
  intermediate: { label: 'Intermediate', className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  advanced: { label: 'Advanced', className: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' },
};

const PITCH_TEMPLATE_CATEGORIES = [...new Set(pitchDeckTemplates.map(t => t.category))];

// ── Color Utility ────────────────────────────────────────────────────

function colorClasses(color: string) {
  const map: Record<string, { bg: string; bgLight: string; text: string; border: string; bgHover: string; ring: string; gradient: string }> = {
    emerald: {
      bg: 'bg-emerald-600',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      bgHover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20',
      ring: 'ring-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-500',
    },
    rose: {
      bg: 'bg-rose-600',
      bgLight: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800',
      bgHover: 'hover:bg-rose-50 dark:hover:bg-rose-950/20',
      ring: 'ring-rose-500/20',
      gradient: 'from-rose-500 to-pink-500',
    },
    cyan: {
      bg: 'bg-cyan-600',
      bgLight: 'bg-cyan-50 dark:bg-cyan-950/30',
      text: 'text-cyan-700 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-800',
      bgHover: 'hover:bg-cyan-50 dark:hover:bg-cyan-950/20',
      ring: 'ring-cyan-500/20',
      gradient: 'from-cyan-500 to-teal-500',
    },
    amber: {
      bg: 'bg-amber-600',
      bgLight: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      bgHover: 'hover:bg-amber-50 dark:hover:bg-amber-950/20',
      ring: 'ring-amber-500/20',
      gradient: 'from-amber-500 to-yellow-500',
    },
    teal: {
      bg: 'bg-teal-600',
      bgLight: 'bg-teal-50 dark:bg-teal-950/30',
      text: 'text-teal-700 dark:text-teal-400',
      border: 'border-teal-200 dark:border-teal-800',
      bgHover: 'hover:bg-teal-50 dark:hover:bg-teal-950/20',
      ring: 'ring-teal-500/20',
      gradient: 'from-teal-500 to-emerald-500',
    },
    gray: {
      bg: 'bg-gray-600',
      bgLight: 'bg-gray-50 dark:bg-gray-950/30',
      text: 'text-gray-700 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-800',
      bgHover: 'hover:bg-gray-50 dark:hover:bg-gray-950/20',
      ring: 'ring-gray-500/20',
      gradient: 'from-gray-500 to-slate-500',
    },
  };
  return map[color] || map.emerald;
}

// ── Default slides for auto-generation ───────────────────────────────

function generateDefaultSlides(templateType: TemplateType): PitchSlide[] {
  const baseSlides: PitchSlide[] = [
    {
      id: `s-${Date.now()}-1`,
      order: 1,
      title: 'Your Company Name',
      type: 'title',
      content: 'Tagline / One-Liner\nFunding Round / Loan Request\nDate',
      linkedSection: 'coverPage',
    },
    {
      id: `s-${Date.now()}-2`,
      order: 2,
      title: 'The Problem',
      type: 'problem',
      content: 'What pain point exists?\nHow big is the problem?\nWho is affected?',
      dataPoints: { 'Market affected': 'TBD', 'Annual cost': 'TBD' },
      linkedSection: 'problemStatement',
    },
    {
      id: `s-${Date.now()}-3`,
      title: 'Our Solution',
      type: 'solution',
      order: 3,
      content: 'How does your product solve the problem?\nKey features and benefits\nWhy now?',
      linkedSection: 'solutionProduct',
    },
    {
      id: `s-${Date.now()}-4`,
      title: 'Market Opportunity',
      type: 'market',
      order: 4,
      content: 'TAM, SAM, SOM breakdown\nMarket trends and timing\nGrowth trajectory',
      dataPoints: { TAM: 'TBD', SAM: 'TBD', SOM: 'TBD' },
      linkedSection: 'marketAnalysis',
    },
    {
      id: `s-${Date.now()}-5`,
      title: 'Business Model',
      type: 'business_model',
      order: 5,
      content: 'Revenue model\nPricing strategy\nUnit economics',
      dataPoints: { 'LTV:CAC': 'TBD', 'Gross Margin': 'TBD' },
      linkedSection: 'businessModel',
    },
    {
      id: `s-${Date.now()}-6`,
      title: 'Financial Projections',
      type: 'financials',
      order: 6,
      content: '3-year revenue forecast\nKey financial metrics\nBreak-even timeline',
      dataPoints: { 'Year 1 Revenue': 'TBD', 'Year 2 Revenue': 'TBD', 'Year 3 Revenue': 'TBD' },
      linkedSection: 'financialForecast',
    },
    {
      id: `s-${Date.now()}-7`,
      title: 'The Ask',
      type: 'ask',
      order: 7,
      content: 'How much are you raising?\nUse of funds breakdown\nExpected outcomes',
      dataPoints: { 'Amount': 'TBD', 'Tenure': 'TBD' },
      linkedSection: 'fundingRequirement',
    },
  ];

  if (templateType === 'bank') {
    baseSlides.push({
      id: `s-${Date.now()}-8`,
      order: 8,
      title: 'Repayment & DSCR',
      type: 'financials',
      content: 'Debt Service Coverage Ratio analysis\nRepayment schedule\nCollateral overview',
      dataPoints: { 'DSCR': '1.45x', 'Tenure': '5 years' },
      linkedSection: 'financialForecast',
    });
  }

  if (templateType === 'investor') {
    baseSlides.push({
      id: `s-${Date.now()}-8`,
      order: 8,
      title: 'Team',
      type: 'team',
      content: 'Founders & key leadership\nRelevant experience\nAdvisory board',
      linkedSection: 'managementTeam',
    });
  }

  if (templateType === 'grant') {
    baseSlides.push({
      id: `s-${Date.now()}-8`,
      order: 8,
      title: 'Social Impact',
      type: 'solution',
      content: 'Community impact metrics\nJob creation potential\nInclusivity and accessibility',
      dataPoints: { 'Jobs created': 'TBD', 'Communities served': 'TBD' },
      linkedSection: 'executiveSummary',
    });
  }

  return baseSlides;
}

// ── Sub-components ───────────────────────────────────────────────────

function DeckStatusBadge({ status }: { status: PitchDeckData['status'] }) {
  const config = DECK_STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.className}`}>
      {config.label}
    </Badge>
  );
}

function TemplateTypeBadge({ type, size = 'sm' }: { type: TemplateType; size?: 'sm' | 'xs' }) {
  const cfg = TEMPLATE_TYPE_CONFIG[type];
  const colors = colorClasses(cfg.color);
  const Icon = cfg.icon;
  const sizeClasses = size === 'xs' ? 'text-[10px] px-1.5 py-0 gap-1' : 'text-xs px-2 py-0.5 gap-1.5';
  const iconSize = size === 'xs' ? 'h-2.5 w-2.5' : 'h-3 w-3';

  return (
    <Badge variant="outline" className={`${sizeClasses} ${colors.border} ${colors.text} ${colors.bgLight}`}>
      <Icon className={iconSize} />
      {cfg.label}
    </Badge>
  );
}

function SlideTypeBadge({ type }: { type: SlideType }) {
  const cfg = SLIDE_TYPE_CONFIG[type];
  const colors = colorClasses(cfg.color);
  const Icon = cfg.icon;

  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 gap-1 ${colors.border} ${colors.text} ${colors.bgLight}`}>
      <Icon className="h-2.5 w-2.5" />
      {cfg.label}
    </Badge>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: AnticipatedQuestion['difficulty'] }) {
  const config = DIFFICULTY_CONFIG[difficulty];
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.className}`}>
      {config.label}
    </Badge>
  );
}

// ── Slide Preview Card ───────────────────────────────────────────────

function SlidePreviewCard({
  slide,
  slideIndex,
  totalSlides,
  onPrev,
  onNext,
  onTitleChange,
  onContentChange,
  onSync,
  syncing,
  planTitle,
}: {
  slide: PitchSlide;
  slideIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onSync: () => void;
  syncing: boolean;
  planTitle: string | null;
}) {
  const cfg = SLIDE_TYPE_CONFIG[slide.type];
  const colors = colorClasses(cfg.color);
  const Icon = cfg.icon;

  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Slide Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlideTypeBadge type={slide.type} />
          <span className="text-xs text-muted-foreground">
            Slide {slideIndex + 1} of {totalSlides}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={slideIndex === 0}
            className="h-7 w-7 p-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={slideIndex === totalSlides - 1}
            className="h-7 w-7 p-0"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Mini Slide Preview */}
      <Card className={cn('overflow-hidden border-2', colors.border)}>
        {/* Slide Header Bar */}
        <div className={cn(
          'px-5 py-3 flex items-center gap-3',
          'bg-gradient-to-r',
          colors.gradient
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <Input
              value={slide.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-white/10 border-white/20 text-white font-semibold text-sm placeholder:text-white/50 focus:bg-white/20 h-7"
              placeholder="Slide title..."
            />
          </div>
          <div className="flex items-center gap-1.5">
            {slide.linkedSection && (
              <Badge className="bg-white/20 text-white border-0 text-[10px] gap-1">
                <Link2 className="h-2.5 w-2.5" />
                Synced
              </Badge>
            )}
          </div>
        </div>

        {/* Slide Body */}
        <CardContent className="p-5 space-y-4">
          {/* Content Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Slide Content</label>
            <Textarea
              value={slide.content}
              onChange={(e) => onContentChange(e.target.value)}
              rows={6}
              className="text-sm resize-none"
              placeholder="Enter slide content..."
            />
          </div>

          {/* Data Points */}
          {slide.dataPoints && Object.keys(slide.dataPoints).length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Data Points
              </label>
              <div className="rounded-lg border bg-muted/30 overflow-hidden">
                <table className="w-full text-xs">
                  <tbody>
                    {Object.entries(slide.dataPoints).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-muted/20' : ''}>
                        <td className="px-3 py-1.5 font-medium text-muted-foreground border-r border-border/50">
                          {key}
                        </td>
                        <td className={cn('px-3 py-1.5 font-semibold', colors.text)}>
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                * Data points auto-sync when financial assumptions change
              </p>
            </div>
          )}

          {/* Linked Section Indicator */}
          {slide.linkedSection && (
            <div className="flex items-center justify-between">
              <div className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 border',
                colors.bgLight,
                colors.border
              )}>
                <Link2 className={cn('h-3.5 w-3.5', colors.text)} />
                <span className="text-xs text-muted-foreground">Linked to:</span>
                <Badge variant="outline" className={cn('text-[10px] gap-1', colors.border, colors.text, colors.bgLight)}>
                  <FileText className="h-2.5 w-2.5" />
                  {slide.linkedSection}
                </Badge>
                {planTitle && (
                  <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                    from "{planTitle}"
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onSync}
                disabled={syncing}
                className={cn('h-7 gap-1.5 text-xs', colors.text, colors.bgHover, colors.border)}
              >
                {syncing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Sync from Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Anticipated Question Card ────────────────────────────────────────

function QuestionCard({
  question,
  isExpanded,
  onToggle,
}: {
  question: AnticipatedQuestion;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const diffColors = colorClasses(
    question.difficulty === 'easy' ? 'emerald' : question.difficulty === 'medium' ? 'amber' : 'rose'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn('overflow-hidden transition-all duration-200', isExpanded ? diffColors.border : 'border-border')}>
        <CardContent className="p-4 space-y-3">
          {/* Question Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg mt-0.5',
                diffColors.bgLight
              )}>
                <HelpCircle className={cn('h-3.5 w-3.5', diffColors.text)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">
                  {question.question}
                </p>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <DifficultyBadge difficulty={question.difficulty} />
                  <Badge variant="secondary" className="text-[10px] px-1.5">
                    {question.category}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={cn('h-7 gap-1 text-xs shrink-0', diffColors.text, diffColors.bgHover)}
            >
              {isExpanded ? 'Hide' : 'Show'} Answer
              <ChevronRight className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-90')} />
            </Button>
          </div>

          {/* Suggested Answer */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Separator className="mb-3" />
                <div className={cn('rounded-lg p-3 border', diffColors.bgLight, diffColors.border)}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className={cn('h-3.5 w-3.5', diffColors.text)} />
                    <span className={cn('text-xs font-medium', diffColors.text)}>Suggested Answer</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {question.suggestedAnswer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Slide Thumbnail Strip ────────────────────────────────────────────

function SlideThumbnailStrip({
  slides,
  currentIndex,
  onSelect,
}: {
  slides: PitchSlide[];
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-thin">
      {slides.map((slide, idx) => {
        const cfg = SLIDE_TYPE_CONFIG[slide.type];
        const colors = colorClasses(cfg.color);
        const isActive = idx === currentIndex;

        return (
          <button
            key={slide.id}
            onClick={() => onSelect(idx)}
            className={cn(
              'shrink-0 w-24 h-16 rounded-lg border-2 transition-all duration-200 text-left p-1.5 overflow-hidden',
              isActive
                ? cn(colors.border, colors.bgLight, 'ring-1', colors.ring)
                : 'border-border hover:border-muted-foreground/30'
            )}
          >
            <p className={cn(
              'text-[9px] font-semibold truncate',
              isActive ? colors.text : 'text-muted-foreground'
            )}>
              {slide.title}
            </p>
            <p className="text-[8px] text-muted-foreground/60 mt-0.5 truncate">
              {cfg.label}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <div className={cn(
                'h-0.5 flex-1 rounded-full',
                isActive ? colors.bg : 'bg-muted'
              )} />
              <span className="text-[7px] text-muted-foreground">{idx + 1}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function PitchDeckModule() {
  const { pitchDecks, selectedDeck, setSelectedDeck, plans } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlanId, setNewPlanId] = useState<string>('');
  const [newTemplateType, setNewTemplateType] = useState<TemplateType>('investor');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [regeneratingQuestions, setRegeneratingQuestions] = useState(false);
  const [activeTab, setActiveTab] = useState('slides');
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');

  const selectedDeckData = pitchDecks.find((d) => d.id === selectedDeck) ?? null;

  const templateColor = selectedDeckData
    ? TEMPLATE_TYPE_CONFIG[selectedDeckData.templateType].color
    : 'emerald';
  const accentColors = colorClasses(templateColor);

  // ── Handlers ─────────────────────────────────────────────────────

  const handleCreateDeck = useCallback(() => {
    if (!newTitle.trim()) return;

    const newDeck: PitchDeckData = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      status: 'draft',
      planId: newPlanId || null,
      templateType: newTemplateType,
      slides: generateDefaultSlides(newTemplateType),
      slideCount: newTemplateType === 'investor' ? 8 : 7,
      anticipatedQuestions: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    useAppStore.setState({ pitchDecks: [...pitchDecks, newDeck] });
    setSelectedDeck(newDeck.id);
    setDialogOpen(false);
    setNewTitle('');
    setNewPlanId('');
    setNewTemplateType('investor');
    setCurrentSlideIndex(0);
    setUseTemplate(false);
    setSelectedTemplateId(null);
    setTemplateCategoryFilter('all');
  }, [newTitle, newPlanId, newTemplateType, pitchDecks, setSelectedDeck]);

  const handleDeleteDeck = useCallback(
    (id: string) => {
      const updatedDecks = pitchDecks.filter((d) => d.id !== id);
      useAppStore.setState({ pitchDecks: updatedDecks });
      if (selectedDeck === id) {
        setSelectedDeck(null);
      }
    },
    [pitchDecks, selectedDeck, setSelectedDeck]
  );

  const handleGenerateDeck = useCallback(async () => {
    if (!selectedDeckData) return;
    setGenerating(true);

    try {
      const res = await fetch('/api/pitch-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId: selectedDeckData.id,
          title: selectedDeckData.title,
          templateType: selectedDeckData.templateType,
          planId: selectedDeckData.planId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.slides) {
          const updatedDecks = pitchDecks.map((d) =>
            d.id === selectedDeckData.id
              ? { ...d, slides: data.slides, slideCount: data.slides.length, status: 'completed' as const, anticipatedQuestions: data.anticipatedQuestions || d.anticipatedQuestions }
              : d
          );
          useAppStore.setState({ pitchDecks: updatedDecks });
        }
      }
    } catch (err) {
      console.error('Failed to generate deck:', err);
    } finally {
      setGenerating(false);
    }
  }, [selectedDeckData, pitchDecks]);

  const handleRegenerateQuestions = useCallback(async () => {
    if (!selectedDeckData) return;
    setRegeneratingQuestions(true);

    try {
      const res = await fetch('/api/pitch-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId: selectedDeckData.id,
          action: 'generate_questions',
          title: selectedDeckData.title,
          templateType: selectedDeckData.templateType,
          planId: selectedDeckData.planId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.anticipatedQuestions) {
          const updatedDecks = pitchDecks.map((d) =>
            d.id === selectedDeckData.id
              ? { ...d, anticipatedQuestions: data.anticipatedQuestions }
              : d
          );
          useAppStore.setState({ pitchDecks: updatedDecks });
        }
      }
    } catch (err) {
      console.error('Failed to regenerate questions:', err);
    } finally {
      setRegeneratingQuestions(false);
    }
  }, [selectedDeckData, pitchDecks]);

  const handleSyncSlide = useCallback(async () => {
    if (!selectedDeckData) return;
    setSyncing(true);

    // Simulate sync delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSyncing(false);
  }, [selectedDeckData]);

  const handleSlideTitleChange = useCallback(
    (value: string) => {
      if (!selectedDeckData) return;
      const updatedDecks = pitchDecks.map((d) => {
        if (d.id !== selectedDeckData.id) return d;
        const updatedSlides = d.slides.map((s, idx) =>
          idx === currentSlideIndex ? { ...s, title: value } : s
        );
        return { ...d, slides: updatedSlides };
      });
      useAppStore.setState({ pitchDecks: updatedDecks });
    },
    [selectedDeckData, pitchDecks, currentSlideIndex]
  );

  const handleSlideContentChange = useCallback(
    (value: string) => {
      if (!selectedDeckData) return;
      const updatedDecks = pitchDecks.map((d) => {
        if (d.id !== selectedDeckData.id) return d;
        const updatedSlides = d.slides.map((s, idx) =>
          idx === currentSlideIndex ? { ...s, content: value } : s
        );
        return { ...d, slides: updatedSlides };
      });
      useAppStore.setState({ pitchDecks: updatedDecks });
    },
    [selectedDeckData, pitchDecks, currentSlideIndex]
  );

  const linkedPlan = selectedDeckData?.planId
    ? plans.find((p) => p.id === selectedDeckData.planId)
    : null;

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between px-1 pb-4"
      >
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', accentColors.bgLight)}>
            <Presentation className={cn('h-5 w-5', accentColors.text)} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              Pitch Deck Orchestrator
              {selectedDeckData && (
                <TemplateTypeBadge type={selectedDeckData.templateType} size="xs" />
              )}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Auto-sync financials into investor-tested presentation templates
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-950/20">
            <Sparkles className="h-3 w-3" />
            AI Powered
          </Badge>
          {selectedDeckData && selectedDeckData.status === 'completed' && (
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          )}
        </div>
      </motion.div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 gap-4 lg:gap-6 min-h-0">
        {/* ── Left Panel: Deck List ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full lg:w-1/3 shrink-0"
        >
          <Card className="h-full flex flex-col border-border/60">
            <CardHeader className="pb-2 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Presentation className={cn('h-4 w-4', accentColors.text)} />
                  Pitch Decks
                  <Badge variant="secondary" className="text-[10px] px-1.5">
                    {pitchDecks.length}
                  </Badge>
                </CardTitle>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className={cn('h-7 gap-1.5', accentColors.bg, 'hover:opacity-90 text-white text-xs')}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New Deck
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        Create New Pitch Deck
                      </DialogTitle>
                      <DialogDescription>
                        Auto-generate slides from your business plan, tailored to your audience.
                      </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 -mx-6 px-6">
                      <div className="space-y-4 py-2">
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
                            <LayoutTemplate className={`h-5 w-5 shrink-0 ${useTemplate ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium ${useTemplate ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                                Start from Template
                              </p>
                              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                                Choose from {pitchDeckTemplates.length} Malaysia-specific pitch deck templates with pre-built slides
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
                                    All ({pitchDeckTemplates.length})
                                  </button>
                                  {PITCH_TEMPLATE_CATEGORIES.map(cat => {
                                    const count = pitchDeckTemplates.filter(t => t.category === cat).length;
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                                  {pitchDeckTemplates
                                    .filter(t => templateCategoryFilter === 'all' || t.category === templateCategoryFilter)
                                    .map(template => {
                                      const diffConfig = TEMPLATE_DIFFICULTY_CONFIG[template.difficulty];
                                      const isSelected = selectedTemplateId === template.id;
                                      const totalDuration = template.slides.reduce((acc, s) => {
                                        const mins = parseInt(s.duration) || 0;
                                        return acc + mins;
                                      }, 0);
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
                                              <Layers className="h-2.5 w-2.5" />
                                              {template.slides.length} slides
                                            </span>
                                            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                                              <Clock className="h-2.5 w-2.5" />
                                              ~{totalDuration} min
                                            </span>
                                          </div>
                                          {isSelected && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: 'auto' }}
                                              className="border-t border-emerald-200 dark:border-emerald-800 pt-2 mt-1 space-y-2"
                                            >
                                              <div className="flex items-center gap-1.5">
                                                <Users className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                                                  For: {template.targetAudience}
                                                </span>
                                              </div>
                                              <div className="flex flex-wrap gap-1">
                                                {template.slides.slice(0, 4).map((s, i) => (
                                                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                                    {s.title}
                                                  </span>
                                                ))}
                                                {template.slides.length > 4 && (
                                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                                                    +{template.slides.length - 4} more
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
                          <label className="text-sm font-medium">Deck Title</label>
                          <Input
                            placeholder="e.g. Series A Investor Pitch"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Link to Business Plan</label>
                          <Select value={newPlanId} onValueChange={setNewPlanId}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a plan (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {plans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground">
                            Linking a plan auto-syncs financial data to slides
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Template Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(Object.entries(TEMPLATE_TYPE_CONFIG) as [TemplateType, TemplateTypeConfig][]).map(
                              ([type, cfg]) => {
                                const TIcon = cfg.icon;
                                const tColors = colorClasses(cfg.color);
                                const isSelected = newTemplateType === type;
                                return (
                                  <button
                                    key={type}
                                    onClick={() => setNewTemplateType(type)}
                                    className={cn(
                                      'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all duration-200',
                                      isSelected
                                        ? cn(tColors.border, tColors.bgLight, 'ring-1 ring-current', tColors.text)
                                        : 'border-border hover:border-muted-foreground/30'
                                    )}
                                  >
                                    <TIcon className={cn('h-5 w-5', isSelected ? tColors.text : 'text-muted-foreground')} />
                                    <p className={cn('text-xs font-medium', isSelected ? tColors.text : 'text-foreground')}>
                                      {cfg.label}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground leading-tight line-clamp-2">
                                      {cfg.description}
                                    </p>
                                  </button>
                                );
                              }
                            )}
                          </div>
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
                        onClick={handleCreateDeck}
                        disabled={!newTitle.trim()}
                        className={cn('gap-2', accentColors.bg, 'hover:opacity-90 text-white')}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {selectedTemplateId ? 'Create from Template' : 'Create Deck'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="pt-0 flex-1 min-h-0">
              <ScrollArea className="h-[calc(100vh-300px)] max-h-[600px]">
                <div className="space-y-2 pr-1">
                  <AnimatePresence mode="popLayout">
                    {pitchDecks.map((deck) => {
                      const isSelected = deck.id === selectedDeck;
                      const deckCfg = TEMPLATE_TYPE_CONFIG[deck.templateType];
                      const deckColors = colorClasses(deckCfg.color);

                      return (
                        <motion.div
                          key={deck.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <button
                            onClick={() => {
                              setSelectedDeck(isSelected ? null : deck.id);
                              setCurrentSlideIndex(0);
                            }}
                            className={cn(
                              'w-full text-left rounded-xl border p-3 transition-all duration-200 group',
                              isSelected
                                ? cn(deckColors.border, deckColors.bgLight, 'shadow-sm ring-1 ring-current/20')
                                : 'border-border hover:border-muted-foreground/30'
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className={cn(
                                  'text-sm font-medium truncate',
                                  isSelected ? deckColors.text : 'text-foreground'
                                )}>
                                  {deck.title}
                                </p>
                                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                  <TemplateTypeBadge type={deck.templateType} size="xs" />
                                  <DeckStatusBadge status={deck.status} />
                                </div>
                                <div className="mt-2 flex items-center gap-3">
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Layers className="h-2.5 w-2.5" />
                                    {deck.slideCount} slides
                                  </span>
                                  {deck.anticipatedQuestions.length > 0 && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                      <HelpCircle className="h-2.5 w-2.5" />
                                      {deck.anticipatedQuestions.length} questions
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDeck(deck.id);
                                  }}
                                  className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                                <ChevronRight
                                  className={cn(
                                    'h-4 w-4 shrink-0 transition-transform',
                                    isSelected
                                      ? cn('rotate-90', deckColors.text)
                                      : 'text-muted-foreground group-hover:text-foreground'
                                  )}
                                />
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {pitchDecks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Presentation className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">No pitch decks yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Create your first deck to get started
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Right Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex-1 min-w-0"
        >
          {!selectedDeckData ? (
            /* ── Empty State ── */
            <Card className="h-full min-h-[500px] flex items-center justify-center border-dashed border-2 border-muted-foreground/20">
              <CardContent className="py-10 px-6 w-full max-w-lg text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <Presentation className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Pitch Deck Orchestrator</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Auto-sync financial data and business plans into investor-tested presentation templates
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-3">
                    {(Object.entries(TEMPLATE_TYPE_CONFIG) as [TemplateType, TemplateTypeConfig][]).map(
                      ([type, cfg]) => {
                        const TIcon = cfg.icon;
                        const tColors = colorClasses(cfg.color);
                        return (
                          <div key={type} className={cn('rounded-lg border p-3 text-center', tColors.border, tColors.bgLight)}>
                            <TIcon className={cn('h-5 w-5 mx-auto mb-1.5', tColors.text)} />
                            <p className={cn('text-xs font-medium', tColors.text)}>{cfg.label}</p>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{cfg.description}</p>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Select a deck from the left panel or create a new one
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            /* ── Deck Detail ── */
            <div className="h-full flex flex-col min-h-0">
              {/* Deck Header */}
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">
                    {selectedDeckData.title}
                  </h2>
                  <DeckStatusBadge status={selectedDeckData.status} />
                </div>
                {selectedDeckData.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={handleGenerateDeck}
                    disabled={generating}
                    className={cn('gap-1.5', accentColors.bg, 'hover:opacity-90 text-white')}
                  >
                    {generating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Generate with AI
                  </Button>
                )}
                {selectedDeckData.status === 'completed' && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                      <Download className="h-3.5 w-3.5" />
                      Export
                    </Button>
                  </div>
                )}
              </div>

              {/* Slide Thumbnail Strip */}
              {selectedDeckData.slides.length > 0 && (
                <div className="mb-3 shrink-0">
                  <SlideThumbnailStrip
                    slides={selectedDeckData.slides}
                    currentIndex={currentSlideIndex}
                    onSelect={setCurrentSlideIndex}
                  />
                </div>
              )}

              {/* Tabs: Slides / Questions */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <TabsList className="w-fit shrink-0 mb-3">
                  <TabsTrigger value="slides" className="gap-1.5 text-xs">
                    <Layers className="h-3.5 w-3.5" />
                    Slides ({selectedDeckData.slides.length})
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="gap-1.5 text-xs">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Questions ({selectedDeckData.anticipatedQuestions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="slides" className="flex-1 min-h-0 mt-0">
                  {selectedDeckData.slides.length > 0 ? (
                    <ScrollArea className="h-[calc(100vh-440px)] max-h-[500px]">
                      <AnimatePresence mode="wait">
                        <SlidePreviewCard
                          slide={selectedDeckData.slides[currentSlideIndex]}
                          slideIndex={currentSlideIndex}
                          totalSlides={selectedDeckData.slides.length}
                          onPrev={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                          onNext={() =>
                            setCurrentSlideIndex((i) =>
                              Math.min(selectedDeckData.slides.length - 1, i + 1)
                            )
                          }
                          onTitleChange={handleSlideTitleChange}
                          onContentChange={handleSlideContentChange}
                          onSync={handleSyncSlide}
                          syncing={syncing}
                          planTitle={linkedPlan?.title ?? null}
                        />
                      </AnimatePresence>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Layers className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">No slides yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Generate slides with AI or add them manually
                      </p>
                      <Button
                        size="sm"
                        onClick={handleGenerateDeck}
                        disabled={generating}
                        className={cn('mt-4 gap-1.5', accentColors.bg, 'hover:opacity-90 text-white')}
                      >
                        {generating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        Generate with AI
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="questions" className="flex-1 min-h-0 mt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className={cn('h-4 w-4', accentColors.text)} />
                      <span className="text-sm font-medium text-foreground">
                        Anticipated Questions from Funders
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerateQuestions}
                      disabled={regeneratingQuestions}
                      className={cn('h-7 gap-1.5 text-xs', accentColors.text, accentColors.bgHover, accentColors.border)}
                    >
                      {regeneratingQuestions ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      Regenerate Questions
                    </Button>
                  </div>

                  {selectedDeckData.anticipatedQuestions.length > 0 ? (
                    <ScrollArea className="h-[calc(100vh-480px)] max-h-[460px]">
                      <div className="space-y-3 pr-1">
                        {selectedDeckData.anticipatedQuestions.map((q) => (
                          <QuestionCard
                            key={q.id}
                            question={q}
                            isExpanded={expandedQuestion === q.id}
                            onToggle={() =>
                              setExpandedQuestion(expandedQuestion === q.id ? null : q.id)
                            }
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">No anticipated questions yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs">
                        Generate questions to prepare for funder scrutiny. Our AI analyzes your pitch deck and predicts what investors, banks, or grant officers will ask.
                      </p>
                      <Button
                        size="sm"
                        onClick={handleRegenerateQuestions}
                        disabled={regeneratingQuestions}
                        className={cn('mt-4 gap-1.5', accentColors.bg, 'hover:opacity-90 text-white')}
                      >
                        {regeneratingQuestions ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        Generate Questions
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
