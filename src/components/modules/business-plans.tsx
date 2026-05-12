'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import type { BusinessPlanData, ProposalType, ProposalSectionKey } from '@/lib/types';
import { toast } from 'sonner';

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
import { Progress } from '@/components/ui/progress';

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
  Building2,
  Rocket,
  Search,
  DollarSign,
  Cpu,
  UserCheck,
  Banknote,
  Wallet,
  AlertTriangle,
  ArrowRight,
  Map,
  LayoutGrid,
  Briefcase,
  Globe,
  Code,
  UsersRound,
  Scale,
  LogOut,
  Paperclip,
  LayoutTemplate,
  Clock,
} from 'lucide-react';

// Templates
import { businessPlanTemplates, type BusinessPlanTemplate } from '@/lib/templates/business-plan-templates';

// ── Section Metadata ────────────────────────────────────────────────

type SectionGroup = 'overview' | 'product' | 'business' | 'technical' | 'financial' | 'strategy';

interface SectionMeta {
  label: string;
  icon: React.ElementType;
  description: string;
  group: SectionGroup;
}

const SECTION_META: Record<ProposalSectionKey, SectionMeta> = {
  coverPage: { label: 'Cover Page', icon: FileText, description: 'Professional cover with company details', group: 'overview' },
  executiveSummary: { label: 'Executive Summary', icon: BookOpen, description: 'Critical — investor decides in 2-5 minutes', group: 'overview' },
  companyOverview: { label: 'Company Overview', icon: Building2, description: 'Background, registration, ownership, mission, vision', group: 'overview' },
  problemStatement: { label: 'Problem Statement', icon: AlertTriangle, description: 'Clear problem with specific data points', group: 'overview' },
  solutionProduct: { label: 'Solution / Product', icon: Rocket, description: 'Product, differentiation, value proposition', group: 'product' },
  marketAnalysis: { label: 'Market Analysis', icon: Target, description: 'TAM, SAM, SOM with specific numbers', group: 'product' },
  industryResearch: { label: 'Industry Research', icon: Search, description: 'Industry trends, drivers, and outlook', group: 'product' },
  competitorAnalysis: { label: 'Competitor Analysis', icon: Users, description: 'Competitive landscape with comparison table', group: 'product' },
  businessModel: { label: 'Business Model', icon: PieChart, description: 'How the company makes money', group: 'business' },
  revenueStreams: { label: 'Revenue Streams', icon: DollarSign, description: 'Detailed revenue breakdown and unit economics', group: 'business' },
  goToMarketStrategy: { label: 'Go-To-Market Strategy', icon: Map, description: 'Customer acquisition and distribution', group: 'business' },
  operationsPlan: { label: 'Operations Plan', icon: LayoutGrid, description: 'Workflow, staffing, scaling strategy', group: 'business' },
  technologySystem: { label: 'Technology / System', icon: Cpu, description: 'Architecture, AI systems, security, scalability', group: 'technical' },
  managementTeam: { label: 'Management Team', icon: UserCheck, description: 'Founders, expertise, advisors, leadership', group: 'technical' },
  financialForecast: { label: 'Financial Forecast', icon: TrendingUp, description: 'P&L, Cash Flow, Break-even, DSCR — CRITICAL for bank', group: 'financial' },
  fundingRequirement: { label: 'Funding Requirement', icon: Banknote, description: 'Amount needed, why, runway impact', group: 'financial' },
  useOfFunds: { label: 'Use of Funds', icon: Wallet, description: 'Detailed allocation table with percentages', group: 'financial' },
  riskAnalysis: { label: 'Risk Analysis', icon: Shield, description: 'Market, financial, operational, AI, cybersecurity risks', group: 'financial' },
  swotAnalysis: { label: 'SWOT Analysis', icon: Scale, description: 'Strengths, Weaknesses, Opportunities, Threats', group: 'strategy' },
  exitStrategy: { label: 'Exit Strategy', icon: LogOut, description: 'Acquisition, expansion, future valuation', group: 'strategy' },
  appendices: { label: 'Appendices', icon: Paperclip, description: 'Supporting documents and references', group: 'strategy' },
};

const SECTION_KEYS = Object.keys(SECTION_META) as ProposalSectionKey[];

const GROUP_META: Record<SectionGroup, { label: string; icon: React.ElementType; color: string }> = {
  overview: { label: 'Overview', icon: BookOpen, color: 'emerald' },
  product: { label: 'Product & Market', icon: Rocket, color: 'cyan' },
  business: { label: 'Business Model', icon: PieChart, color: 'amber' },
  technical: { label: 'Technical & Team', icon: Cpu, color: 'teal' },
  financial: { label: 'Financial', icon: TrendingUp, color: 'rose' },
  strategy: { label: 'Strategy', icon: Scale, color: 'orange' },
};

const GROUP_ORDER: SectionGroup[] = ['overview', 'product', 'business', 'technical', 'financial', 'strategy'];

function getSectionsForGroup(group: SectionGroup): ProposalSectionKey[] {
  return SECTION_KEYS.filter((k) => SECTION_META[k].group === group);
}

// ── Proposal Type Config ─────────────────────────────────────────────

interface ProposalTypeConfig {
  label: string;
  color: string;
  icon: React.ElementType;
  focusHint: string;
}

const PROPOSAL_TYPE_CONFIG: Record<ProposalType, ProposalTypeConfig> = {
  bank_loan: { label: 'Bank Loan', color: 'emerald', icon: Building2, focusHint: 'Focus: Cash flow, stability, repayment, DSCR, collateral' },
  government_grant: { label: 'Government Grant', color: 'amber', icon: Building2, focusHint: 'Focus: Social impact, Bumiputera agenda, job creation, innovation' },
  angel_investor: { label: 'Angel Investor', color: 'rose', icon: UserCheck, focusHint: 'Focus: Team, vision, early traction, market potential' },
  venture_capital: { label: 'Venture Capital', color: 'cyan', icon: TrendingUp, focusHint: 'Focus: Growth, market size, scalability, technology moat' },
  sme_financing: { label: 'SME Financing', color: 'teal', icon: Wallet, focusHint: 'Focus: Revenue stability, business fundamentals, manageable risk' },
  corporate_partnership: { label: 'Corporate Partnership', color: 'orange', icon: Briefcase, focusHint: 'Focus: Mutual value, strategic alignment, integration potential' },
};

// ── Status Config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BusinessPlanData['status'], { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  in_progress: { label: 'In Progress', className: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700' },
};

const INDUSTRIES = [
  'SaaS / Software', 'E-Commerce', 'FinTech', 'HealthTech', 'EdTech',
  'AI / ML', 'Logistics', 'Real Estate', 'Agriculture', 'Retail',
  'Manufacturing', 'Food & Beverage', 'Construction', 'Other',
];

// ── Template Difficulty Config ───────────────────────────────────────

const TEMPLATE_DIFFICULTY_CONFIG: Record<string, { label: string; className: string }> = {
  beginner: { label: 'Beginner', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
  intermediate: { label: 'Intermediate', className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  advanced: { label: 'Advanced', className: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' },
};

const TEMPLATE_CATEGORIES = [...new Set(businessPlanTemplates.map(t => t.category))];

// ── Color utility ────────────────────────────────────────────────────

function typeColorClasses(color: string) {
  const map: Record<string, { bg: string; bgLight: string; text: string; border: string; bgHover: string; dot: string; gradientFrom: string; gradientTo: string }> = {
    emerald: { bg: 'bg-emerald-600', bgLight: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', bgHover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20', dot: 'bg-emerald-400', gradientFrom: 'from-emerald-400', gradientTo: 'to-teal-500' },
    amber: { bg: 'bg-amber-600', bgLight: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', bgHover: 'hover:bg-amber-50 dark:hover:bg-amber-950/20', dot: 'bg-amber-400', gradientFrom: 'from-amber-400', gradientTo: 'to-yellow-500' },
    rose: { bg: 'bg-rose-600', bgLight: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', bgHover: 'hover:bg-rose-50 dark:hover:bg-rose-950/20', dot: 'bg-rose-400', gradientFrom: 'from-rose-400', gradientTo: 'to-pink-500' },
    cyan: { bg: 'bg-cyan-600', bgLight: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', bgHover: 'hover:bg-cyan-50 dark:hover:bg-cyan-950/20', dot: 'bg-cyan-400', gradientFrom: 'from-cyan-400', gradientTo: 'to-teal-500' },
    teal: { bg: 'bg-teal-600', bgLight: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', bgHover: 'hover:bg-teal-50 dark:hover:bg-teal-950/20', dot: 'bg-teal-400', gradientFrom: 'from-teal-400', gradientTo: 'to-emerald-500' },
    orange: { bg: 'bg-orange-600', bgLight: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', bgHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20', dot: 'bg-orange-400', gradientFrom: 'from-orange-400', gradientTo: 'to-amber-500' },
  };
  return map[color] || map.emerald;
}

function groupColorClasses(group: SectionGroup) {
  const colorMap: Record<SectionGroup, string> = {
    overview: 'emerald', product: 'cyan', business: 'amber', technical: 'teal', financial: 'rose', strategy: 'orange',
  };
  return typeColorClasses(colorMap[group]);
}

// ── Rich-text-like renderer ──────────────────────────────────────────

function processInline(text: string): React.ReactNode {
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

function renderRichContent(text: string) {
  const paragraphs = text.split(/\n{2,}/);

  return paragraphs.map((para, pi) => {
    const parts: React.ReactNode[] = [];
    const lines = para.split('\n');

    lines.forEach((line, li) => {
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
        const content = line.replace(/^[-•*]\s+/, '');
        parts.push(
          <li key={`b-${pi}-${li}`} className="ml-4 flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{processInline(content)}</span>
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
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

// ── Sub-components ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: BusinessPlanData['status'] }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.className}`}>
      {config.label}
    </Badge>
  );
}

function ProposalTypeBadge({ type, size = 'sm' }: { type: ProposalType; size?: 'sm' | 'xs' }) {
  const cfg = PROPOSAL_TYPE_CONFIG[type];
  const colors = typeColorClasses(cfg.color);
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

function EmptySectionPlaceholder({
  sectionKey,
  onGenerate,
  loading,
  accentColor,
}: {
  sectionKey: ProposalSectionKey;
  onGenerate: (key: ProposalSectionKey) => void;
  loading: boolean;
  accentColor: string;
}) {
  const meta = SECTION_META[sectionKey];
  const Icon = meta.icon;
  const colors = typeColorClasses(accentColor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bgLight}`}>
        <Icon className={`h-7 w-7 ${colors.text}`} />
      </div>
      <h3 className="mb-1 text-sm font-medium text-foreground">{meta.label}</h3>
      <p className="mb-5 max-w-xs text-xs text-muted-foreground">{meta.description}</p>
      <Button
        size="sm"
        onClick={() => onGenerate(sectionKey)}
        disabled={loading}
        className={`${colors.bg} hover:opacity-90 text-white gap-2`}
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
  onEdit,
  loading,
  accentColor,
}: {
  content: string | undefined;
  sectionKey: ProposalSectionKey;
  onRewrite: (key: ProposalSectionKey) => void;
  onGenerate: (key: ProposalSectionKey) => void;
  onEdit: (key: ProposalSectionKey) => void;
  loading: boolean;
  accentColor: string;
}) {
  if (!content) {
    return <EmptySectionPlaceholder sectionKey={sectionKey} onGenerate={onGenerate} loading={loading} accentColor={accentColor} />;
  }

  const colors = typeColorClasses(accentColor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={`border ${colors.border} bg-gradient-to-br from-white to-white/50 dark:from-card dark:to-card ${colors.bgLight.replace('bg-', 'dark:from-').replace('/30', '/5')}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {React.createElement(SECTION_META[sectionKey].icon, {
                className: `h-4 w-4 ${colors.text}`,
              })}
              <CardTitle className="text-sm">{SECTION_META[sectionKey].label}</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(sectionKey)}
                className={`h-7 gap-1.5 text-xs ${colors.text} ${colors.bgHover}`}
              >
                <Edit className="h-3 w-3" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRewrite(sectionKey)}
                disabled={loading}
                className={`h-7 gap-1.5 text-xs ${colors.text} ${colors.bgHover}`}
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                AI Rewrite
              </Button>
            </div>
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

// ── Grouped Sections within a Tab ────────────────────────────────────

function GroupedSections({
  group,
  planData,
  onRewrite,
  onGenerate,
  onEdit,
  editingSection,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  generatingSection,
  accentColor,
}: {
  group: SectionGroup;
  planData: BusinessPlanData;
  onRewrite: (key: ProposalSectionKey) => void;
  onGenerate: (key: ProposalSectionKey) => void;
  onEdit: (key: ProposalSectionKey) => void;
  editingSection: ProposalSectionKey | null;
  editText: string;
  onEditTextChange: (val: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  generatingSection: ProposalSectionKey | null;
  accentColor: string;
}) {
  const sections = getSectionsForGroup(group);
  const gMeta = GROUP_META[group];
  const gColors = groupColorClasses(group);
  const GIcon = gMeta.icon;

  const completedInGroup = sections.filter((k) => planData.sections[k]).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className={`flex h-6 w-6 items-center justify-center rounded-md ${gColors.bgLight}`}>
          <GIcon className={`h-3.5 w-3.5 ${gColors.text}`} />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{gMeta.label}</h3>
        <span className="text-[10px] text-muted-foreground">
          {completedInGroup}/{sections.length} completed
        </span>
      </div>

      <div className="space-y-2">
        {sections.map((key) => {
          const meta = SECTION_META[key];
          const Icon = meta.icon;
          const hasContent = !!planData.sections[key];
          const isEditing = editingSection === key;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`overflow-hidden border transition-all duration-200 ${hasContent ? gColors.border : 'border-dashed border-muted-foreground/20'}`}>
                {isEditing ? (
                  <CardContent className="p-4 space-y-3">
                    <Textarea
                      value={editText}
                      onChange={(e) => onEditTextChange(e.target.value)}
                      rows={10}
                      className="text-sm resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={onCancelEdit} className="h-7 text-xs">
                        Cancel
                      </Button>
                      <Button size="sm" onClick={onSaveEdit} className={`h-7 gap-1.5 text-xs ${gColors.bg} text-white hover:opacity-90`}>
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                ) : hasContent ? (
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${gColors.text}`} />
                        <span className="text-sm font-medium">{meta.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(key)}
                          className={`h-6 gap-1 text-[10px] ${gColors.text} ${gColors.bgHover}`}
                        >
                          <Edit className="h-2.5 w-2.5" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRewrite(key)}
                          disabled={generatingSection === key}
                          className={`h-6 gap-1 text-[10px] ${gColors.text} ${gColors.bgHover}`}
                        >
                          {generatingSection === key ? (
                            <Loader2 className="h-2.5 w-2.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-2.5 w-2.5" />
                          )}
                          AI Rewrite
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
                      {renderRichContent(planData.sections[key]!)}
                    </div>
                  </CardContent>
                ) : (
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-sm text-muted-foreground">{meta.label}</span>
                        <span className="text-[10px] text-muted-foreground/60">— {meta.description}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onGenerate(key)}
                        disabled={generatingSection === key}
                        className={`h-6 gap-1 text-[10px] ${gColors.text} ${gColors.bgHover}`}
                      >
                        {generatingSection === key ? (
                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-2.5 w-2.5" />
                        )}
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────

export default function BusinessPlans() {
  const { plans, selectedPlan, setSelectedPlan } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newProposalType, setNewProposalType] = useState<ProposalType>('bank_loan');
  const [activeGroup, setActiveGroup] = useState<SectionGroup>('overview');
  const [generatingSection, setGeneratingSection] = useState<ProposalSectionKey | null>(null);
  const [editingSection, setEditingSection] = useState<ProposalSectionKey | null>(null);
  const [editText, setEditText] = useState('');
  const [expandedSection, setExpandedSection] = useState<ProposalSectionKey | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const abortGenerationRef = useRef(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');

  const selectedPlanData = plans.find((p) => p.id === selectedPlan) ?? null;

  const accentColor = selectedPlanData
    ? PROPOSAL_TYPE_CONFIG[selectedPlanData.proposalType].color
    : 'emerald';

  const accentColors = typeColorClasses(accentColor);

  const completedSections = selectedPlanData
    ? SECTION_KEYS.filter((k) => selectedPlanData.sections[k]).length
    : 0;

  const progressPercent = selectedPlanData
    ? Math.round((completedSections / SECTION_KEYS.length) * 100)
    : 0;

  // AI generation handler
  const handleGenerateSection = useCallback(
    async (key: ProposalSectionKey) => {
      if (!selectedPlanData) return;
      setGeneratingSection(key);
      try {
        const res = await fetch('/api/business-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: selectedPlanData.title,
            industry: selectedPlanData.industry,
            section: key,
            proposalType: selectedPlanData.proposalType,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            // Update the plan in the store
            const updatedPlans = plans.map((p) =>
              p.id === selectedPlanData.id
                ? { ...p, sections: { ...p.sections, [key]: data.content }, updatedAt: new Date().toISOString().split('T')[0] }
                : p
            );
            useAppStore.setState({ plans: updatedPlans });
          }
        }
      } catch (err) {
        console.error('Failed to generate section:', err);
      } finally {
        setGeneratingSection(null);
      }
    },
    [selectedPlanData, plans]
  );

  const handleRewriteSection = useCallback(
    async (key: ProposalSectionKey) => {
      await handleGenerateSection(key);
    },
    [handleGenerateSection]
  );

  const handleEditSection = useCallback(
    (key: ProposalSectionKey) => {
      const content = selectedPlanData?.sections[key] ?? '';
      setEditText(content);
      setEditingSection(key);
    },
    [selectedPlanData]
  );

  const handleSaveEdit = useCallback(() => {
    if (!selectedPlanData || !editingSection) return;
    const updatedPlans = plans.map((p) =>
      p.id === selectedPlanData.id
        ? { ...p, sections: { ...p.sections, [editingSection]: editText }, updatedAt: new Date().toISOString().split('T')[0] }
        : p
    );
    useAppStore.setState({ plans: updatedPlans });
    setEditingSection(null);
    setEditText('');
  }, [selectedPlanData, editingSection, editText, plans]);

  const handleCreatePlan = useCallback(() => {
    if (!newTitle.trim()) return;
    const newPlan: BusinessPlanData = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      status: 'draft',
      proposalType: newProposalType,
      industry: newIndustry || 'Other',
      sections: {},
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    useAppStore.setState({ plans: [...plans, newPlan] });
    setSelectedPlan(newPlan.id);
    setDialogOpen(false);
    setNewTitle('');
    setNewIndustry('');
    setNewProposalType('bank_loan');
    setUseTemplate(false);
    setSelectedTemplateId(null);
    setTemplateCategoryFilter('all');
  }, [newTitle, newIndustry, newProposalType, plans, setSelectedPlan]);

  const handleDeletePlan = useCallback(
    (id: string) => {
      const updatedPlans = plans.filter((p) => p.id !== id);
      useAppStore.setState({ plans: updatedPlans });
      if (selectedPlan === id) {
        setSelectedPlan(null);
      }
      toast.success('Proposal deleted', { description: 'The proposal has been permanently removed.' });
    },
    [plans, selectedPlan, setSelectedPlan]
  );

  const confirmDeletePlan = useCallback((id: string) => {
    setPlanToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleGenerateAllSections = useCallback(
    async () => {
      if (!selectedPlanData) return;
      const emptySections = SECTION_KEYS.filter((k) => !selectedPlanData.sections[k]);
      if (emptySections.length === 0) {
        toast.info('All sections completed', { description: 'There are no empty sections to generate.' });
        return;
      }
      setGeneratingAll(true);
      setGeneratedCount(0);
      abortGenerationRef.current = false;
      toast.info('Generating all sections', { description: `Starting generation for ${emptySections.length} empty sections...` });
      let successCount = 0;
      for (const key of emptySections) {
        if (abortGenerationRef.current) break;
        try {
          const res = await fetch('/api/business-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: selectedPlanData.title,
              industry: selectedPlanData.industry,
              section: key,
              proposalType: selectedPlanData.proposalType,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.content) {
              const currentPlans = useAppStore.getState().plans;
              const updatedPlans = currentPlans.map((p) =>
                p.id === selectedPlanData.id
                  ? { ...p, sections: { ...p.sections, [key]: data.content }, updatedAt: new Date().toISOString().split('T')[0] }
                  : p
              );
              useAppStore.setState({ plans: updatedPlans });
              successCount++;
              setGeneratedCount(successCount);
            }
          }
        } catch {
          // Continue with next section on error
        }
      }
      setGeneratingAll(false);
      toast.success('Bulk generation complete', { description: `Generated ${successCount} of ${emptySections.length} sections.` });
    },
    [selectedPlanData]
  );

  const handleCancelGeneration = useCallback(() => {
    abortGenerationRef.current = true;
    setGeneratingAll(false);
    toast.info('Generation cancelled');
  }, []);

  const handleUpdateProposalType = useCallback(
    (newType: ProposalType) => {
      if (!selectedPlanData) return;
      const updatedPlans = plans.map((p) =>
        p.id === selectedPlanData.id
          ? { ...p, proposalType: newType, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      );
      useAppStore.setState({ plans: updatedPlans });
      toast.success('Proposal type updated', { description: `Changed to ${PROPOSAL_TYPE_CONFIG[newType].label}` });
    },
    [selectedPlanData, plans]
  );

  const handleUpdateStatus = useCallback(
    (newStatus: BusinessPlanData['status']) => {
      if (!selectedPlanData) return;
      const updatedPlans = plans.map((p) =>
        p.id === selectedPlanData.id
          ? { ...p, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      );
      useAppStore.setState({ plans: updatedPlans });
      toast.success('Status updated', { description: `Changed to ${STATUS_CONFIG[newStatus].label}` });
    },
    [selectedPlanData, plans]
  );

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col">
      {/* ── Top Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between px-1 pb-4"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentColors.bgLight}`}>
            <FileText className={`h-5 w-5 ${accentColors.text}`} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              Business Proposal Builder
            </h1>
            <p className="text-[11px] text-muted-foreground">
              21 Sections · Professional Grade
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-950/20">
          <Sparkles className="h-3 w-3" />
          AI Powered
        </Badge>
      </motion.div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 gap-4 lg:gap-6 min-h-0">
        {/* ── Left Panel: Plan List ── */}
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
                  <FileText className={`h-4 w-4 ${accentColors.text}`} />
                  Proposals
                  <Badge variant="secondary" className="text-[10px] px-1.5">
                    {plans.length}
                  </Badge>
                </CardTitle>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className={`h-7 gap-1.5 ${accentColors.bg} hover:opacity-90 text-white text-xs`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New Proposal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        Create New Proposal
                      </DialogTitle>
                      <DialogDescription>
                        Build a professional 21-section business proposal tailored to your target audience.
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
                                Choose from {businessPlanTemplates.length} Malaysia-specific business plan templates with pre-built sections and prompts
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
                                    All ({businessPlanTemplates.length})
                                  </button>
                                  {TEMPLATE_CATEGORIES.map(cat => {
                                    const count = businessPlanTemplates.filter(t => t.category === cat).length;
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
                                  {businessPlanTemplates
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
                                              setNewIndustry(template.industry);
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
                                              <Clock className="h-2.5 w-2.5" />
                                              {template.estimatedTime}
                                            </span>
                                          </div>
                                          {isSelected && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: 'auto' }}
                                              className="border-t border-emerald-200 dark:border-emerald-800 pt-2 mt-1"
                                            >
                                              <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 mb-1.5">
                                                {template.sections.length} Sections Included:
                                              </p>
                                              <div className="flex flex-wrap gap-1">
                                                {template.sections.slice(0, 6).map((s, i) => (
                                                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                                    {s.title}
                                                  </span>
                                                ))}
                                                {template.sections.length > 6 && (
                                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                                                    +{template.sections.length - 6} more
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
                          <label className="text-sm font-medium">Proposal Title</label>
                          <Input
                            placeholder="e.g. Bank Loan Proposal — RM2M Expansion"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Proposal Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            {(Object.entries(PROPOSAL_TYPE_CONFIG) as [ProposalType, ProposalTypeConfig][]).map(([type, cfg]) => {
                              const TIcon = cfg.icon;
                              const tColors = typeColorClasses(cfg.color);
                              const isSelected = newProposalType === type;
                              return (
                                <button
                                  key={type}
                                  onClick={() => setNewProposalType(type)}
                                  className={`flex items-start gap-2 rounded-lg border p-2.5 text-left transition-all duration-200 ${
                                    isSelected
                                      ? `${tColors.border} ${tColors.bgLight} ring-1 ring-current ${tColors.text}`
                                      : 'border-border hover:border-muted-foreground/30'
                                  }`}
                                >
                                  <TIcon className={`h-4 w-4 mt-0.5 shrink-0 ${isSelected ? tColors.text : 'text-muted-foreground'}`} />
                                  <div className="min-w-0">
                                    <p className={`text-xs font-medium ${isSelected ? tColors.text : 'text-foreground'}`}>
                                      {cfg.label}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                                      {cfg.focusHint}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Industry</label>
                          <Select value={newIndustry} onValueChange={setNewIndustry}>
                            <SelectTrigger className="w-full">
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
                    </ScrollArea>

                    <DialogFooter className="gap-2 sm:gap-0 mt-2">
                      <DialogClose asChild>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        size="sm"
                        onClick={handleCreatePlan}
                        disabled={!newTitle.trim()}
                        className={`gap-2 ${accentColors.bg} hover:opacity-90 text-white`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {selectedTemplateId ? 'Create from Template' : 'Generate with AI'}
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
                    {plans.map((plan) => {
                      const isSelected = plan.id === selectedPlan;
                      const sectionCount = SECTION_KEYS.filter((k) => plan.sections[k]).length;
                      const planCfg = PROPOSAL_TYPE_CONFIG[plan.proposalType];
                      const planColors = typeColorClasses(planCfg.color);

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
                                ? `${planColors.border} ${planColors.bgLight} shadow-sm ring-1 ring-current/20`
                                : 'border-border hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-medium truncate ${isSelected ? planColors.text : 'text-foreground'}`}>
                                  {plan.title}
                                </p>
                                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                  <ProposalTypeBadge type={plan.proposalType} size="xs" />
                                  <StatusBadge status={plan.status} />
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                                    <motion.div
                                      className={`h-full rounded-full ${planColors.bg}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(sectionCount / SECTION_KEYS.length) * 100}%` }}
                                      transition={{ duration: 0.4 }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-muted-foreground shrink-0">
                                    {sectionCount}/21
                                  </span>
                                </div>
                              </div>
                              <ChevronRight
                                className={`h-4 w-4 shrink-0 mt-0.5 transition-transform ${
                                  isSelected
                                    ? `rotate-90 ${planColors.text}`
                                    : 'text-muted-foreground group-hover:text-foreground'
                                }`}
                              />
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {plans.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">No proposals yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Create your first proposal to get started
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
          {!selectedPlanData ? (
            /* ── Empty State: Show all 6 proposal types ── */
            <Card className="h-full min-h-[500px] flex items-center justify-center border-dashed border-2 border-muted-foreground/20">
              <CardContent className="py-10 px-6 w-full max-w-2xl">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center mb-8"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                    <Sparkles className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    Choose Your Proposal Type
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Select a target audience to get started, or pick an existing proposal from the left.
                    Each type emphasizes different sections and metrics.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.entries(PROPOSAL_TYPE_CONFIG) as [ProposalType, ProposalTypeConfig][]).map(([type, cfg], i) => {
                    const TIcon = cfg.icon;
                    const tColors = typeColorClasses(cfg.color);
                    return (
                      <motion.button
                        key={type}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        onClick={() => {
                          setNewProposalType(type);
                          setDialogOpen(true);
                        }}
                        className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200 group ${tColors.border} ${tColors.bgHover} hover:shadow-md`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tColors.bgLight} group-hover:scale-110 transition-transform`}>
                          <TIcon className={`h-5 w-5 ${tColors.text}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{cfg.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{cfg.focusHint}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowRight className={`h-3 w-3 ${tColors.text} group-hover:translate-x-1 transition-transform`} />
                          <span className={`text-[10px] ${tColors.text} font-medium`}>Start building</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* ── Plan Editor with Grouped Tabs ── */
            <Card className="h-full flex flex-col border-border/60">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <CardTitle className="text-base truncate">{selectedPlanData.title}</CardTitle>
                      {/* Proposal Type Switcher */}
                      <Select value={selectedPlanData.proposalType} onValueChange={(v) => handleUpdateProposalType(v as ProposalType)}>
                        <SelectTrigger className={`h-6 w-auto gap-1 text-[10px] border-0 px-1.5 py-0 ${accentColors.bgLight} ${accentColors.text} ${accentColors.border}`}>
                          {React.createElement(PROPOSAL_TYPE_CONFIG[selectedPlanData.proposalType].icon, { className: 'h-2.5 w-2.5' })}
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(PROPOSAL_TYPE_CONFIG) as [ProposalType, ProposalTypeConfig][]).map(([type, cfg]) => {
                            const TIcon = cfg.icon;
                            return (
                              <SelectItem key={type} value={type}>
                                <div className="flex items-center gap-2">
                                  <TIcon className="h-3.5 w-3.5" />
                                  <span>{cfg.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {/* Status Switcher */}
                      <Select value={selectedPlanData.status} onValueChange={(v) => handleUpdateStatus(v as BusinessPlanData['status'])}>
                        <SelectTrigger className="h-6 w-auto gap-1 text-[10px] border-0 px-1.5 py-0">
                          <StatusBadge status={selectedPlanData.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {(['draft', 'in_progress', 'completed', 'archived'] as const).map((s) => (
                            <SelectItem key={s} value={s}>
                              <div className="flex items-center gap-2">
                                <StatusBadge status={s} />
                                <span className="text-xs">{STATUS_CONFIG[s].label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className={`text-[10px] ${accentColors.text} mt-0.5`}>
                      {PROPOSAL_TYPE_CONFIG[selectedPlanData.proposalType].focusHint}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Generate All Sections Button */}
                    {generatingAll ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-950/30"
                        onClick={handleCancelGeneration}
                      >
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {generatedCount} generated...
                        <span className="text-[10px] text-muted-foreground">(Cancel)</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-7 gap-1.5 text-xs ${accentColors.text} ${accentColors.border} ${accentColors.bgHover}`}
                        onClick={handleGenerateAllSections}
                        disabled={completedSections === SECTION_KEYS.length}
                      >
                        <Sparkles className="h-3 w-3" />
                        Generate All
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      onClick={() => confirmDeletePlan(selectedPlanData.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Section Progress</span>
                    <span className={`text-[10px] font-semibold ${accentColors.text}`}>
                      {completedSections}/21 · {progressPercent}%
                    </span>
                  </div>
                  <Progress value={progressPercent} className={`h-2 ${accentColors.bgLight}`} />
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-1 min-h-0">
                {/* Grouped Tabs */}
                <Tabs
                  value={activeGroup}
                  onValueChange={(v) => setActiveGroup(v as SectionGroup)}
                  className="w-full flex flex-col h-full"
                >
                  <ScrollArea className="w-full shrink-0">
                    <TabsList className="mb-4 w-max gap-1 bg-muted/50">
                      {GROUP_ORDER.map((group) => {
                        const gMeta = GROUP_META[group];
                        const GIcon = gMeta.icon;
                        const gColors = groupColorClasses(group);
                        const sections = getSectionsForGroup(group);
                        const completed = sections.filter((k) => selectedPlanData.sections[k]).length;

                        return (
                          <TabsTrigger
                            key={group}
                            value={group}
                            className={`gap-1.5 text-xs data-[state=active]:${gColors.bg} data-[state=active]:text-white`}
                          >
                            <GIcon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{gMeta.label}</span>
                            <span className="text-[10px] opacity-60">{completed}/{sections.length}</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </ScrollArea>

                  <ScrollArea className="flex-1 max-h-[calc(100vh-400px)]">
                    <AnimatePresence mode="wait">
                      {GROUP_ORDER.map((group) => (
                        <TabsContent key={group} value={group} className="mt-0">
                          <motion.div
                            key={group}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <GroupedSections
                              group={group}
                              planData={selectedPlanData}
                              onRewrite={handleRewriteSection}
                              onGenerate={handleGenerateSection}
                              onEdit={handleEditSection}
                              editingSection={editingSection}
                              editText={editText}
                              onEditTextChange={setEditText}
                              onSaveEdit={handleSaveEdit}
                              onCancelEdit={() => {
                                setEditingSection(null);
                                setEditText('');
                              }}
                              generatingSection={generatingSection}
                              accentColor={accentColor}
                            />
                          </motion.div>
                        </TabsContent>
                      ))}
                    </AnimatePresence>
                  </ScrollArea>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Proposal
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this proposal? This action cannot be undone and all section content will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              className="gap-1.5 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (planToDelete) {
                  handleDeletePlan(planToDelete);
                  setPlanToDelete(null);
                  setDeleteDialogOpen(false);
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
