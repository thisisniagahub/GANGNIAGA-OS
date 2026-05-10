'use client';

import { useState } from 'react';
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
} from '@/components/ui/dialog';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

// ─── Component ──────────────────────────────────────────────────────────────

export function ReportsModule() {
  const { reports } = useAppStore();
  const [filter, setFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReportType | ''>('');
  const [newFormat, setNewFormat] = useState<ReportFormat | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredReports =
    filter === 'all' ? reports : reports.filter((r) => r.type === filter);

  const completedCount = reports.filter((r) => r.status === 'completed').length;
  const generatingCount = reports.filter((r) => r.status === 'generating').length;
  const failedCount = reports.filter((r) => r.status === 'failed').length;

  const handleGenerate = () => {
    // Reset form
    setNewTitle('');
    setNewType('');
    setNewFormat('');
    setDateFrom('');
    setDateTo('');
    setDialogOpen(false);
  };

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
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="size-5 text-emerald-600" />
                  Generate New Report
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Report Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Title</label>
                  <Input
                    placeholder="e.g. Q1 2025 Investor Update"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                {/* Report Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
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
                  <label className="text-sm font-medium">Format</label>
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
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="From"
                    />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder="To"
                    />
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
                  <Button variant="outline" className="flex-1 gap-1.5" onClick={handleGenerate}>
                    <FileText className="size-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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

        {/* ── Reports Grid (shared across all tab values) ─────────────── */}
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
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                <AnimatePresence mode="popLayout">
                  {filteredReports.map((report, i) => (
                    <ReportCard key={report.id} report={report} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Report Card Sub-component ──────────────────────────────────────────────

function ReportCard({ report, index }: { report: ReportData; index: number }) {
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
            >
              <Eye className="size-3.5" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs flex-1 hover:bg-emerald-500/10 hover:text-emerald-600"
              disabled={report.status !== 'completed'}
            >
              <Download className="size-3.5" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs flex-1 hover:bg-amber-500/10 hover:text-amber-600"
            >
              <RefreshCw className="size-3.5" />
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ReportsModule;
