'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import type { BusinessPlanData } from '@/lib/types';

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Lucide
import {
  FileText,
  Plus,
  Sparkles,
  Edit,
  Trash2,
  ChevronRight,
  BookOpen,
  Target,
  PieChart,
  Shield,
  TrendingUp,
  Lightbulb,
  Users,
  Loader2,
} from 'lucide-react';

// ── Types & Constants ──────────────────────────────────────────────

type SectionKey = keyof NonNullable<BusinessPlanData['sections']>;

const SECTION_META: Record<
  SectionKey,
  { label: string; icon: React.ElementType; description: string }
> = {
  executiveSummary: {
    label: 'Executive Summary',
    icon: BookOpen,
    description: 'High-level overview of your business plan',
  },
  marketAnalysis: {
    label: 'Market Analysis',
    icon: Target,
    description: 'Market size, trends, and opportunities',
  },
  swotAnalysis: {
    label: 'SWOT',
    icon: PieChart,
    description: 'Strengths, Weaknesses, Opportunities, Threats',
  },
  competitorAnalysis: {
    label: 'Competitor Analysis',
    icon: Users,
    description: 'Competitive landscape and positioning',
  },
  financialPlan: {
    label: 'Financial Plan',
    icon: TrendingUp,
    description: 'Revenue projections and unit economics',
  },
  riskAnalysis: {
    label: 'Risk Analysis',
    icon: Shield,
    description: 'Key risks and mitigation strategies',
  },
  recommendations: {
    label: 'Recommendations',
    icon: Lightbulb,
    description: 'Actionable next steps and priorities',
  },
};

const SECTION_KEYS = Object.keys(SECTION_META) as SectionKey[];

const STATUS_CONFIG: Record<
  BusinessPlanData['status'],
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className:
      'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  },
  in_progress: {
    label: 'In Progress',
    className:
      'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800',
  },
  completed: {
    label: 'Completed',
    className:
      'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  archived: {
    label: 'Archived',
    className:
      'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700',
  },
};

const INDUSTRIES = [
  'SaaS / Software',
  'E-Commerce',
  'FinTech',
  'HealthTech',
  'EdTech',
  'AI / ML',
  'Logistics',
  'Real Estate',
  'Agriculture',
  'Retail',
  'Manufacturing',
  'Other',
];

// ── Rich-text-like renderer ────────────────────────────────────────

function renderRichContent(text: string) {
  // Split by double-newline for paragraphs, then apply inline styles
  const paragraphs = text.split(/\n{2,}/);

  return paragraphs.map((para, pi) => {
    // Process inline patterns within each paragraph
    const parts: React.ReactNode[] = [];
    let remaining = para;

    // Process line-by-line within a paragraph for bullet handling
    const lines = remaining.split('\n');

    lines.forEach((line, li) => {
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
        // Bullet point
        const content = line.replace(/^[-•*]\s+/, '');
        parts.push(
          <li key={`b-${pi}-${li}`} className="ml-4 flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{processInline(content)}</span>
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        // Numbered list
        const content = line.replace(/^\d+\.\s+/, '');
        parts.push(
          <li key={`n-${pi}-${li}`} className="ml-4 flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {line.match(/^\d+/)?.[0]}.
            </span>
            <span>{processInline(content)}</span>
          </li>
        );
      } else {
        parts.push(
          <span key={`t-${pi}-${li}`}>
            {li > 0 ? <br /> : null}
            {processInline(line)}
          </span>
        );
      }
    });

    return (
      <p key={`p-${pi}`} className="text-sm leading-relaxed text-foreground/90">
        {parts}
      </p>
    );
  });
}

function processInline(text: string): React.ReactNode {
  // Bold: **text**
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={lastIndex}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <strong key={match.index} className="font-semibold text-foreground">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

// ── Sub-components ─────────────────────────────────────────────────

function StatusBadge({ status }: { status: BusinessPlanData['status'] }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.className}`}>
      {config.label}
    </Badge>
  );
}

function EmptySectionPlaceholder({
  sectionKey,
  onGenerate,
  loading,
}: {
  sectionKey: SectionKey;
  onGenerate: (key: SectionKey) => void;
  loading: boolean;
}) {
  const meta = SECTION_META[sectionKey];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
        <Icon className="h-8 w-8 text-emerald-500" />
      </div>
      <h3 className="mb-1 text-sm font-medium text-foreground">{meta.label}</h3>
      <p className="mb-6 max-w-xs text-xs text-muted-foreground">{meta.description}</p>
      <Button
        size="sm"
        onClick={() => onGenerate(sectionKey)}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        Generate with AI
      </Button>
    </motion.div>
  );
}

function SectionViewer({
  content,
  sectionKey,
  onRewrite,
  onGenerate,
  loading,
}: {
  content: string | undefined;
  sectionKey: SectionKey;
  onRewrite: (key: SectionKey) => void;
  onGenerate: (key: SectionKey) => void;
  loading: boolean;
}) {
  if (!content) {
    return <EmptySectionPlaceholder sectionKey={sectionKey} onGenerate={onGenerate} loading={loading} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 dark:from-card dark:to-emerald-950/10 dark:border-emerald-900/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {React.createElement(SECTION_META[sectionKey].icon, {
                className: 'h-4 w-4 text-emerald-600 dark:text-emerald-400',
              })}
              <CardTitle className="text-sm">{SECTION_META[sectionKey].label}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRewrite(sectionKey)}
              disabled={loading}
              className="h-7 gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              AI Rewrite
            </Button>
          </div>
          <CardDescription className="text-xs">
            {SECTION_META[sectionKey].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">{renderRichContent(content)}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function BusinessPlans() {
  const { plans, selectedPlan, setSelectedPlan } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [activeTab, setActiveTab] = useState<SectionKey>('executiveSummary');
  const [generatingSection, setGeneratingSection] = useState<SectionKey | null>(null);
  const [improving, setImproving] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
  const [editText, setEditText] = useState('');

  const selectedPlanData = plans.find((p) => p.id === selectedPlan) ?? null;

  // Simulated AI generation
  const simulateAI = useCallback(
    (duration = 1500) =>
      new Promise<void>((resolve) => setTimeout(resolve, duration)),
    []
  );

  const handleGenerateSection = useCallback(
    async (key: SectionKey) => {
      setGeneratingSection(key);
      await simulateAI(2000);
      setGeneratingSection(null);
    },
    [simulateAI]
  );

  const handleRewriteSection = useCallback(
    async (key: SectionKey) => {
      setGeneratingSection(key);
      await simulateAI(1800);
      setGeneratingSection(null);
    },
    [simulateAI]
  );

  const handleAIImprove = useCallback(async () => {
    setImproving(true);
    await simulateAI(2500);
    setImproving(false);
  }, [simulateAI]);

  const handleCreatePlan = useCallback(async () => {
    if (!newTitle.trim()) return;
    // Simulated — in a real app this would dispatch to the store
    setDialogOpen(false);
    setNewTitle('');
    setNewIndustry('');
  }, [newTitle]);

  const handleEditSection = useCallback(
    (key: SectionKey) => {
      const content = selectedPlanData?.sections[key] ?? '';
      setEditText(content);
      setEditingSection(key);
    },
    [selectedPlanData]
  );

  const handleSaveEdit = useCallback(() => {
    // In a real app, this would update the store
    setEditingSection(null);
    setEditText('');
  }, []);

  const completedSections = selectedPlanData
    ? SECTION_KEYS.filter((k) => selectedPlanData.sections[k]).length
    : 0;

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4 lg:gap-6">
      {/* ── Left Panel: Plan List ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full lg:w-1/3 shrink-0"
      >
        <Card className="h-full border-emerald-100/60 dark:border-emerald-900/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Business Plans
              </CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="h-7 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-500" />
                      Create Business Plan
                    </DialogTitle>
                    <DialogDescription>
                      Start a new plan from scratch or let AI generate one for you.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Plan Title</label>
                      <Input
                        placeholder="e.g. Series A Growth Strategy"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="border-emerald-200 focus-visible:border-emerald-400 dark:border-emerald-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Industry</label>
                      <Select value={newIndustry} onValueChange={setNewIndustry}>
                        <SelectTrigger className="w-full border-emerald-200 dark:border-emerald-800">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      size="sm"
                      onClick={handleCreatePlan}
                      disabled={!newTitle.trim()}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Generate with AI
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <ScrollArea className="h-[calc(100vh-260px)] max-h-[600px]">
              <div className="space-y-2 pr-1">
                <AnimatePresence mode="popLayout">
                  {plans.map((plan) => {
                    const isSelected = plan.id === selectedPlan;
                    const sectionCount = SECTION_KEYS.filter(
                      (k) => plan.sections[k]
                    ).length;

                    return (
                      <motion.div
                        key={plan.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          onClick={() => setSelectedPlan(isSelected ? null : plan.id)}
                          className={`w-full text-left rounded-xl border p-3 transition-all duration-200 group ${
                            isSelected
                              ? 'border-emerald-300 bg-emerald-50/80 shadow-sm dark:border-emerald-700 dark:bg-emerald-950/30'
                              : 'border-border hover:border-emerald-200 hover:bg-emerald-50/40 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isSelected
                                    ? 'text-emerald-900 dark:text-emerald-100'
                                    : 'text-foreground'
                                }`}
                              >
                                {plan.title}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <StatusBadge status={plan.status} />
                                <span className="text-[10px] text-muted-foreground">
                                  {sectionCount}/{SECTION_KEYS.length} sections
                                </span>
                              </div>
                            </div>
                            <ChevronRight
                              className={`h-4 w-4 shrink-0 mt-0.5 transition-transform ${
                                isSelected
                                  ? 'rotate-90 text-emerald-600 dark:text-emerald-400'
                                  : 'text-muted-foreground group-hover:text-emerald-500'
                              }`}
                            />
                          </div>
                          <p className="mt-2 text-[10px] text-muted-foreground">
                            Updated {plan.updatedAt}
                          </p>
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {plans.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No business plans yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Create your first plan to get started
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Right Panel: Plan Editor/Viewer ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex-1 min-w-0"
      >
        {!selectedPlanData ? (
          /* ── Empty State ── */
          <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed border-2 border-emerald-200/60 dark:border-emerald-800/40">
            <CardContent className="text-center py-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                  <Sparkles className="h-10 w-10 text-emerald-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Business Plan Intelligence
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                  Select a plan from the left to view and edit, or create a new AI-generated
                  business plan.
                </p>
                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> 7 Sections
                  </span>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> AI Powered
                  </span>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="flex items-center gap-1">
                    <Edit className="h-3.5 w-3.5" /> Editable
                  </span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        ) : (
          /* ── Plan Editor ── */
          <Card className="h-full border-emerald-100/60 dark:border-emerald-900/30">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base truncate">
                      {selectedPlanData.title}
                    </CardTitle>
                    <StatusBadge status={selectedPlanData.status} />
                  </div>
                  <CardDescription className="text-xs">
                    {completedSections} of {SECTION_KEYS.length} sections completed
                    &nbsp;&middot;&nbsp; Created {selectedPlanData.createdAt}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedSections / SECTION_KEYS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as SectionKey)}
                className="w-full"
              >
                <ScrollArea className="w-full">
                  <TabsList className="mb-4 w-max gap-1 bg-emerald-50/50 dark:bg-emerald-950/20">
                    {SECTION_KEYS.map((key) => {
                      const meta = SECTION_META[key];
                      const Icon = meta.icon;
                      const hasContent = !!selectedPlanData.sections[key];
                      return (
                        <TabsTrigger
                          key={key}
                          value={key}
                          className="gap-1.5 text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{meta.label}</span>
                          {hasContent && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 data-[state=active]:bg-white" />
                          )}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </ScrollArea>

                <AnimatePresence mode="wait">
                  {SECTION_KEYS.map((key) => (
                    <TabsContent key={key} value={key} className="mt-0">
                      {editingSection === key ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-3"
                        >
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={12}
                            className="text-sm resize-none border-emerald-200 focus-visible:border-emerald-400 dark:border-emerald-800"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSection(null)}
                              className="h-8 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="relative">
                          <SectionViewer
                            content={selectedPlanData.sections[key]}
                            sectionKey={key}
                            onRewrite={handleRewriteSection}
                            onGenerate={handleGenerateSection}
                            loading={generatingSection === key}
                          />
                          {selectedPlanData.sections[key] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSection(key)}
                              className="mt-2 h-7 gap-1.5 text-xs text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/30"
                            >
                              <Edit className="h-3 w-3" />
                              Edit manually
                            </Button>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </AnimatePresence>
              </Tabs>

              {/* Floating AI Improve button */}
              <motion.div
                className="fixed bottom-6 right-6 z-30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                <Button
                  onClick={handleAIImprove}
                  disabled={improving}
                  className="h-12 w-12 rounded-full shadow-lg shadow-emerald-500/25 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                  size="icon"
                >
                  {improving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                  <span className="sr-only">AI Improve</span>
                </Button>
                <AnimatePresence>
                  {!improving && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] text-background shadow-md"
                    >
                      AI Improve
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
