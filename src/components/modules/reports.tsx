'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Download,
  Plus,
  FileSpreadsheet,
  File,
  Table,
  BarChart3,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Send,
  Trash2,
  Shield,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ReportData } from '@/lib/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

type ReportType = ReportData['type'];
type ReportStatus = ReportData['status'];
type ReportFormat = ReportData['format'];

const TYPE_CONFIG: Record<
  ReportType,
  { label: string; icon: typeof FileText; badgeClass: string; iconBg: string; iconText: string }
> = {
  investor: {
    label: 'Investor',
    icon: Send,
    badgeClass: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25',
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-600',
  },
  board: {
    label: 'Board',
    icon: BarChart3,
    badgeClass: 'bg-amber-500/15 text-amber-600 border-amber-500/25',
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-600',
  },
  financial: {
    label: 'Financial',
    icon: FileSpreadsheet,
    badgeClass: 'bg-teal-500/15 text-teal-600 border-teal-500/25',
    iconBg: 'bg-teal-500/10',
    iconText: 'text-teal-600',
  },
  kpi: {
    label: 'KPI',
    icon: BarChart3,
    badgeClass: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/25',
    iconBg: 'bg-cyan-500/10',
    iconText: 'text-cyan-600',
  },
  operational: {
    label: 'Operational',
    icon: Table,
    badgeClass: 'bg-rose-500/15 text-rose-600 border-rose-500/25',
    iconBg: 'bg-rose-500/10',
    iconText: 'text-rose-600',
  },
};

function getStatusBadge(status: ReportStatus) {
  switch (status) {
    case 'generating':
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
          <Loader2 className="size-3 animate-spin" />
          Generating
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

function getFormatIcon(format: ReportFormat) {
  switch (format) {
    case 'pdf':
      return <FileText className="size-3.5" />;
    case 'docx':
      return <File className="size-3.5" />;
    case 'xlsx':
      return <FileSpreadsheet className="size-3.5" />;
    case 'csv':
      return <Table className="size-3.5" />;
  }
}

function getFormatBadge(format: ReportFormat) {
  const cls: Record<ReportFormat, string> = {
    pdf: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    docx: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    xlsx: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    csv: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };
  return (
    <Badge variant="outline" className={`gap-1 text-xs ${cls[format]}`}>
      {getFormatIcon(format)}
      {format.toUpperCase()}
    </Badge>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── Section options for report generation ──────────────────────────────────
const SECTION_OPTIONS = [
  { id: 'executive_summary', label: 'Executive Summary', defaultChecked: true },
  { id: 'financial_overview', label: 'Financial Overview', defaultChecked: true },
  { id: 'kpi_dashboard', label: 'KPI Dashboard', defaultChecked: true },
  { id: 'market_analysis', label: 'Market Analysis', defaultChecked: false },
  { id: 'risk_assessment', label: 'Risk Assessment', defaultChecked: false },
];

// ─── Simulated Report Preview Content ───────────────────────────────────────
function getSimulatedPreview(report: ReportData) {
  const typeLabel = TYPE_CONFIG[report.type]?.label ?? report.type;
  return {
    sections: [
      {
        title: 'Executive Summary',
        content: `This ${typeLabel} report provides a comprehensive overview of GangNiaga AI OS performance for the reporting period. Key highlights include strong MRR growth of 11.1% month-over-month, maintaining a healthy DSCR of 1.45x, and continued expansion in the ASEAN SME market. The company is on track to achieve break-even by Q3 2025.`,
      },
      {
        title: 'Financial Overview',
        content: `Revenue: RM284,500 (vs target RM300,000)\nBurn Rate: RM187,200/month (down 4% from RM195,000)\nRunway: 18 months (up from 15 months)\nMRR: RM142,800 | ARR: RM1,713,600\nGross Margin: 82% (above 70% benchmark)\nCash Position: RM1,680,000`,
      },
      {
        title: 'KPI Dashboard',
        content: `• Monthly Revenue Growth: +11.1% ✓\n• MRR Growth: +11.1% ✓\n• Burn Rate Reduction: -4.0% ✓\n• DSCR: 1.45x (target 1.50x) △\n• Customer Churn: 3.2% (benchmark 2.5%) △\n• LTV:CAC Ratio: 7.5:1 (benchmark 3.0:1) ✓`,
      },
      {
        title: 'Recommendations',
        content: `1. Accelerate enterprise sales to close DSCR gap (1.45x → 1.50x)\n2. Implement churn reduction program targeting < 2.5%\n3. Begin Indonesia market entry preparation for Q2 2025\n4. Pursue SOC2 certification to unlock enterprise pipeline`,
      },
    ],
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ReportsModule() {
  const { reports, addReport, updateReport } = useAppStore();
  const [filter, setFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReportType | ''>('');
  const [newFormat, setNewFormat] = useState<ReportFormat | ''>('');
  const [dateRange, setDateRange] = useState('last_month');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>(
    SECTION_OPTIONS.filter((s) => s.defaultChecked).map((s) => s.id)
  );
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // ─── Preview Dialog ────────────────────────────────────────────
  const [previewReport, setPreviewReport] = useState<ReportData | null>(null);

  // ─── Delete Confirmation ───────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<ReportData | null>(null);

  const filteredReports =
    filter === 'all' ? reports : reports.filter((r) => r.type === filter);

  const completedCount = reports.filter((r) => r.status === 'completed').length;
  const generatingCount = reports.filter((r) => r.status === 'generating').length;
  const failedCount = reports.filter((r) => r.status === 'failed').length;

  // ─── Toggle section checkbox ────────────────────────────────────
  const toggleSection = useCallback((sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  // ─── Handle Generate Report ─────────────────────────────────────
  const handleGenerate = useCallback(() => {
    if (!newTitle.trim()) {
      toast.error('Please enter a report title');
      return;
    }
    if (!newType) {
      toast.error('Please select a report type');
      return;
    }
    if (!newFormat) {
      toast.error('Please select a format');
      return;
    }

    // Close dialog and start generation simulation
    setDialogOpen(false);
    setIsGenerating(true);
    setGeneratingProgress(0);

    // Create report with "generating" status
    const reportId = `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newReport: ReportData = {
      id: reportId,
      title: newTitle.trim(),
      type: newType as ReportType,
      status: 'generating',
      format: newFormat as ReportFormat,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addReport(newReport);

    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      setGeneratingProgress(Math.min(progress, 100));
    }, 300);

    // Complete after 3 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setGeneratingProgress(100);
      updateReport(reportId, { status: 'completed' });
      setIsGenerating(false);
      toast.success(`"${newTitle.trim()}" report generated successfully`);
    }, 3000);

    // Reset form
    setNewTitle('');
    setNewType('');
    setNewFormat('');
    setDateRange('last_month');
    setCustomDateFrom('');
    setCustomDateTo('');
    setSelectedSections(SECTION_OPTIONS.filter((s) => s.defaultChecked).map((s) => s.id));
  }, [newTitle, newType, newFormat, addReport, updateReport]);

  // ─── Handle Download ────────────────────────────────────────────
  const handleDownload = useCallback((report: ReportData) => {
    const preview = getSimulatedPreview(report);
    let content = '';

    switch (report.format) {
      case 'csv':
        content = 'Section,Content\n' +
          preview.sections.map((s) => `"${s.title}","${s.content.replace(/\n/g, ' ')}"`).join('\n');
        break;
      case 'xlsx':
      case 'docx':
        content = preview.sections
          .map((s) => `${'='.repeat(60)}\n${s.title}\n${'='.repeat(60)}\n${s.content}`)
          .join('\n\n');
        break;
      default: // pdf
        content = `${report.title}\n${'='.repeat(60)}\nGenerated: ${formatDate(report.createdAt)}\nFormat: ${report.format.toUpperCase()}\nType: ${TYPE_CONFIG[report.type]?.label ?? report.type}\n\n` +
          preview.sections
            .map((s) => `${'─'.repeat(40)}\n${s.title}\n${'─'.repeat(40)}\n${s.content}`)
            .join('\n\n');
    }

    const mimeType = report.format === 'csv' ? 'text/csv' : 'text/plain';
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '-').toLowerCase()}.${report.format}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Report downloaded as ${report.format.toUpperCase()}`);
  }, []);

  // ─── Handle Delete ──────────────────────────────────────────────
  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    useAppStore.setState((s) => ({
      reports: s.reports.filter((r) => r.id !== deleteTarget.id),
    }));
    toast.success(`"${deleteTarget.title}" deleted`);
    setDeleteTarget(null);
  }, [deleteTarget]);

  // ─── Handle Regenerate ──────────────────────────────────────────
  const handleRegenerate = useCallback((report: ReportData) => {
    updateReport(report.id, { status: 'generating' });
    toast.info(`Regenerating "${report.title}"...`);

    setTimeout(() => {
      updateReport(report.id, { status: 'completed' });
      toast.success(`"${report.title}" regenerated successfully`);
    }, 3000);
  }, [updateReport]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
            <FileText className="size-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Reporting Engine</h2>
            <p className="text-sm text-muted-foreground">Generate and manage business reports</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 gap-1">
            <CheckCircle2 className="size-3" />
            {completedCount} Completed
          </Badge>
          <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
            <Loader2 className="size-3 animate-spin" />
            {generatingCount} Generating
          </Badge>
          {failedCount > 0 && (
            <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/25 gap-1">
              <XCircle className="size-3" />
              {failedCount} Failed
            </Badge>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 ml-1">
                <Plus className="size-3.5" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="size-5 text-emerald-600" />
                  Generate New Report
                </DialogTitle>
                <DialogDescription>
                  Configure your report settings and generate with AI assistance
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Report Title */}
                <div className="space-y-2">
                  <Label>Report Title</Label>
                  <Input
                    placeholder="e.g. Q1 2025 Investor Update"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                {/* Report Type */}
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select value={newType} onValueChange={(v) => setNewType(v as ReportType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(TYPE_CONFIG) as ReportType[]).map((type) => {
                        const cfg = TYPE_CONFIG[type];
                        const Icon = cfg.icon;
                        return (
                          <SelectItem key={type} value={type}>
                            <span className="flex items-center gap-2">
                              <Icon className={`size-4 ${cfg.iconText}`} />
                              {cfg.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Format */}
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select value={newFormat} onValueChange={(v) => setNewFormat(v as ReportFormat)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {(['pdf', 'docx', 'xlsx', 'csv'] as ReportFormat[]).map((fmt) => (
                        <SelectItem key={fmt} value={fmt}>
                          <span className="flex items-center gap-2">
                            {getFormatIcon(fmt)}
                            {fmt.toUpperCase()}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="last_quarter">Last Quarter</SelectItem>
                      <SelectItem value="last_year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Input
                        type="date"
                        value={customDateFrom}
                        onChange={(e) => setCustomDateFrom(e.target.value)}
                        placeholder="From"
                      />
                      <Input
                        type="date"
                        value={customDateTo}
                        onChange={(e) => setCustomDateTo(e.target.value)}
                        placeholder="To"
                      />
                    </div>
                  )}
                </div>

                {/* Include Sections */}
                <div className="space-y-3">
                  <Label>Include Sections</Label>
                  <div className="space-y-2">
                    {SECTION_OPTIONS.map((section) => (
                      <div key={section.id} className="flex items-center gap-2">
                        <Checkbox
                          id={section.id}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={() => toggleSection(section.id)}
                        />
                        <Label htmlFor={section.id} className="text-sm font-normal cursor-pointer">
                          {section.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    className="flex-1 gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    onClick={handleGenerate}
                  >
                    <Sparkles className="size-4" />
                    Generate with AI
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={handleGenerate}
                  >
                    <FileText className="size-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Generation Progress Bar ─────────────────────────────────── */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-600">Generating report with AI...</p>
                    <Progress value={generatingProgress} className="mt-2 h-2 [&>div]:bg-amber-500" />
                  </div>
                  <span className="text-sm font-bold text-amber-600">{generatingProgress.toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Report Type Filter ──────────────────────────────────────────── */}
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="w-full sm:w-auto flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all" className="gap-1.5 text-xs">
            <FileText className="size-3.5" />
            All
          </TabsTrigger>
          <TabsTrigger value="investor" className="gap-1.5 text-xs">
            <Send className="size-3.5" />
            Investor
          </TabsTrigger>
          <TabsTrigger value="board" className="gap-1.5 text-xs">
            <BarChart3 className="size-3.5" />
            Board
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-1.5 text-xs">
            <FileSpreadsheet className="size-3.5" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="kpi" className="gap-1.5 text-xs">
            <BarChart3 className="size-3.5" />
            KPI
          </TabsTrigger>
          <TabsTrigger value="operational" className="gap-1.5 text-xs">
            <Table className="size-3.5" />
            Operational
          </TabsTrigger>
        </TabsList>

        {/* ── Reports Grid ───────────────────────────────────────────── */}
        <TabsContent value={filter} className="mt-4">
          {filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                <FileText className="size-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium">No reports found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {filter === 'all'
                  ? 'Generate your first report to get started'
                  : `No ${TYPE_CONFIG[filter as ReportType]?.label ?? ''} reports available`}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                <AnimatePresence mode="popLayout">
                  {filteredReports.map((report, i) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      index={i}
                      onPreview={setPreviewReport}
                      onDownload={handleDownload}
                      onDelete={setDeleteTarget}
                      onRegenerate={handleRegenerate}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Report Preview Dialog ────────────────────────────────────── */}
      <Dialog open={!!previewReport} onOpenChange={(open) => !open && setPreviewReport(null)}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="size-5 text-emerald-600" />
              Report Preview
            </DialogTitle>
            <DialogDescription>{previewReport?.title}</DialogDescription>
          </DialogHeader>

          {previewReport && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-5 py-2 pr-2">
                {/* Report Header */}
                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {TYPE_CONFIG[previewReport.type] && (
                      <Badge variant="outline" className={`text-xs ${TYPE_CONFIG[previewReport.type].badgeClass}`}>
                        {TYPE_CONFIG[previewReport.type].label}
                      </Badge>
                    )}
                    {getFormatBadge(previewReport.format)}
                    {getStatusBadge(previewReport.status)}
                  </div>
                  <h3 className="text-lg font-bold">{previewReport.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generated: {formatDate(previewReport.createdAt)}
                  </p>
                </div>

                {/* Simulated Report Sections */}
                {getSimulatedPreview(previewReport).sections.map((section, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-2"
                  >
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {section.title}
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line pl-4 leading-relaxed">
                      {section.content}
                    </p>
                    {idx < getSimulatedPreview(previewReport).sections.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setPreviewReport(null)}>
              Close
            </Button>
            {previewReport && previewReport.status === 'completed' && (
              <Button
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  handleDownload(previewReport);
                  setPreviewReport(null);
                }}
              >
                <Download className="size-4" />
                Download {previewReport.format.toUpperCase()}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-500" />
              Delete Report
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Report Card Sub-component ──────────────────────────────────────────────

function ReportCard({
  report,
  index,
  onPreview,
  onDownload,
  onDelete,
  onRegenerate,
}: {
  report: ReportData;
  index: number;
  onPreview: (report: ReportData) => void;
  onDownload: (report: ReportData) => void;
  onDelete: (report: ReportData) => void;
  onRegenerate: (report: ReportData) => void;
}) {
  const cfg = TYPE_CONFIG[report.type];
  const TypeIcon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Card className="group relative overflow-hidden hover:shadow-md transition-shadow">
        {/* Color accent bar at top */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            report.type === 'investor'
              ? 'bg-emerald-500'
              : report.type === 'board'
                ? 'bg-amber-500'
                : report.type === 'financial'
                  ? 'bg-teal-500'
                  : report.type === 'kpi'
                    ? 'bg-cyan-500'
                    : 'bg-rose-500'
          }`}
        />

        <CardHeader className="pb-3 pt-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`flex items-center justify-center size-9 rounded-lg flex-shrink-0 ${cfg.iconBg} ${cfg.iconText}`}
              >
                <TypeIcon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-semibold leading-tight truncate">
                  {report.title}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5 flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatDate(report.createdAt)}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 space-y-3">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className={`text-xs ${cfg.badgeClass}`}>
              {cfg.label}
            </Badge>
            {getStatusBadge(report.status)}
            {getFormatBadge(report.format)}
          </div>

          <Separator />

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs flex-1 hover:bg-emerald-500/10 hover:text-emerald-600"
              disabled={report.status !== 'completed'}
              onClick={() => onPreview(report)}
            >
              <Eye className="size-3.5" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs flex-1 hover:bg-emerald-500/10 hover:text-emerald-600"
              disabled={report.status !== 'completed'}
              onClick={() => onDownload(report)}
            >
              <Download className="size-3.5" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs flex-1 hover:bg-amber-500/10 hover:text-amber-600"
              onClick={() => onRegenerate(report)}
            >
              <RefreshCw className="size-3.5" />
              Regenerate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs hover:bg-rose-500/10 hover:text-rose-600"
              onClick={() => onDelete(report)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ReportsModule;
