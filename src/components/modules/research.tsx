'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type { CitationData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Globe,
  Shield,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Database,
  FileText,
  Building2,
  BarChart3,
  Sparkles,
  Plus,
  Filter,
  Eye,
  Bookmark,
  Link2,
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  Tag,
  Loader2,
  Verified,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Type Configuration ─────────────────────────────────────────────────────

type CitationType = CitationData['type'];

interface TypeConfig {
  label: string;
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardAccent: string;
}

const TYPE_CONFIG: Record<CitationType, TypeConfig> = {
  market_data: {
    label: 'Market Data',
    icon: BarChart3,
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-600',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-600',
    badgeBorder: 'border-emerald-500/25',
    cardAccent: 'rgb(16 185 129 / 0.5)',
  },
  industry_report: {
    label: 'Industry Report',
    icon: FileText,
    bgClass: 'bg-cyan-500/10',
    textClass: 'text-cyan-600',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-600',
    badgeBorder: 'border-cyan-500/25',
    cardAccent: 'rgb(6 182 212 / 0.5)',
  },
  benchmark: {
    label: 'Benchmark',
    icon: BarChart3,
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-600',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-600',
    badgeBorder: 'border-amber-500/25',
    cardAccent: 'rgb(245 158 11 / 0.5)',
  },
  government: {
    label: 'Government',
    icon: Building2,
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-600',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-600',
    badgeBorder: 'border-teal-500/25',
    cardAccent: 'rgb(20 184 166 / 0.5)',
  },
  financial: {
    label: 'Financial',
    icon: Database,
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-600',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-600',
    badgeBorder: 'border-rose-500/25',
    cardAccent: 'rgb(244 63 94 / 0.5)',
  },
};

const CITATION_TYPES: CitationType[] = ['market_data', 'industry_report', 'benchmark', 'government', 'financial'];

// ─── Geography Configuration ─────────────────────────────────────────────────

interface GeoConfig {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  flagEmoji: string;
}

const GEO_CONFIG: Record<string, GeoConfig> = {
  MY: {
    label: 'MY',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-600',
    borderClass: 'border-blue-500/25',
    flagEmoji: '🇲🇾',
  },
  SEA: {
    label: 'SEA',
    bgClass: 'bg-violet-500/10',
    textClass: 'text-violet-600',
    borderClass: 'border-violet-500/25',
    flagEmoji: '🌏',
  },
  Global: {
    label: 'Global',
    bgClass: 'bg-slate-500/10',
    textClass: 'text-slate-600',
    borderClass: 'border-slate-500/25',
    flagEmoji: '🌍',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCitation(c: CitationData): string {
  const parts: string[] = [c.source];
  if (c.dataPoint) parts.push(c.dataPoint);
  if (c.datePublished) parts.push(c.datePublished);
  if (c.url) parts.push(`[${c.url}]`);
  return parts.join(', ');
}

function getGeoConfig(geography: string | null): GeoConfig {
  if (!geography) return { label: 'N/A', bgClass: 'bg-gray-500/10', textClass: 'text-gray-500', borderClass: 'border-gray-500/25', flagEmoji: '🌐' };
  return GEO_CONFIG[geography] ?? { label: geography, bgClass: 'bg-gray-500/10', textClass: 'text-gray-500', borderClass: 'border-gray-500/25', flagEmoji: '🌐' };
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ResearchModule() {
  const { citations } = useAppStore();

  // Tab state
  const [activeTab, setActiveTab] = useState('library');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [geoFilter, setGeoFilter] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailCitation, setDetailCitation] = useState<CitationData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add citation form state
  const [newSource, setNewSource] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<CitationType>('market_data');
  const [newGeography, setNewGeography] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDataPoint, setNewDataPoint] = useState('');

  // Verification simulation state
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());

  // ── Computed Values ──────────────────────────────────────────────────────

  const typeCounts = useMemo(() => {
    const counts: Record<CitationType, number> = {
      market_data: 0,
      industry_report: 0,
      benchmark: 0,
      government: 0,
      financial: 0,
    };
    for (const c of citations) {
      counts[c.type]++;
    }
    return counts;
  }, [citations]);

  const verifiedCount = useMemo(() => citations.filter((c) => c.verified).length, [citations]);
  const unverifiedCitations = useMemo(() => citations.filter((c) => !c.verified), [citations]);
  const verificationRate = citations.length > 0 ? Math.round((verifiedCount / citations.length) * 100) : 0;

  const geographies = useMemo(() => {
    const geoSet = new Set<string>();
    for (const c of citations) {
      if (c.geography) geoSet.add(c.geography);
    }
    return Array.from(geoSet);
  }, [citations]);

  const geoCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of citations) {
      if (c.geography) {
        counts[c.geography] = (counts[c.geography] || 0) + 1;
      }
    }
    return counts;
  }, [citations]);

  // ── Filtered Citations ───────────────────────────────────────────────────

  const filteredCitations = useMemo(() => {
    let result = citations;

    if (typeFilter !== 'all') {
      result = result.filter((c) => c.type === typeFilter);
    }

    if (geoFilter !== 'all') {
      result = result.filter((c) => c.geography === geoFilter);
    }

    if (verifiedOnly) {
      result = result.filter((c) => c.verified);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.source.toLowerCase().includes(q) ||
          (c.dataPoint && c.dataPoint.toLowerCase().includes(q)) ||
          (c.geography && c.geography.toLowerCase().includes(q))
      );
    }

    return result;
  }, [citations, typeFilter, geoFilter, verifiedOnly, searchQuery]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCopyCitation = useCallback((c: CitationData) => {
    const text = formatCitation(c);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(c.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const handleVerify = useCallback((id: string) => {
    setVerifyingIds((prev) => new Set(prev).add(id));
    // Simulate AI verification
    setTimeout(() => {
      setVerifyingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      // In a real app, this would update the store
    }, 2000);
  }, []);

  const handleAddCitation = useCallback(() => {
    // In a real app, this would add to the store via API
    setAddDialogOpen(false);
    setNewSource('');
    setNewUrl('');
    setNewType('market_data');
    setNewGeography('');
    setNewDate('');
    setNewDataPoint('');
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
            <Shield className="size-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Bank-Grade Research Agent</h2>
            <p className="text-sm text-muted-foreground">
              Every insight cited. Every source verified. Bank-ready data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1.5 px-3 py-1">
            <Verified className="size-3.5" />
            50+ Verified Sources
          </Badge>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <Plus className="size-3.5" />
                Add Citation
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CITATION_TYPES.map((type, i) => {
          const cfg = TYPE_CONFIG[type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Card
                className="cursor-pointer transition-colors hover:shadow-sm"
                onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
              >
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <div
                    className={cn(
                      'flex items-center justify-center size-9 rounded-lg',
                      cfg.bgClass,
                      cfg.textClass
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{typeCounts[type]}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full sm:w-auto self-start">
          <TabsTrigger value="library" className="gap-1.5">
            <Database className="size-3.5" />
            Citation Library
          </TabsTrigger>
          <TabsTrigger value="verification" className="gap-1.5">
            <Shield className="size-3.5" />
            Verification Queue
          </TabsTrigger>
          <TabsTrigger value="sourcemap" className="gap-1.5">
            <Globe className="size-3.5" />
            Source Map
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Citation Library ─────────────────────────────────────── */}
        <TabsContent value="library" className="flex-1 mt-3 min-h-0 flex flex-col gap-3">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder='Search citations... (try "DSCR" or "Malaysia")'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {CITATION_TYPES.map((type) => {
                    const cfg = TYPE_CONFIG[type];
                    return (
                      <SelectItem key={type} value={type}>
                        {cfg.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={geoFilter} onValueChange={setGeoFilter}>
                <SelectTrigger className="w-32 h-9 text-sm">
                  <MapPin className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {geographies.map((geo) => (
                    <SelectItem key={geo} value={geo}>
                      {getGeoConfig(geo).flagEmoji} {geo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1.5 px-2 h-9 border rounded-md text-sm">
                <Checkbox
                  id="verified-only"
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                  className="size-3.5"
                />
                <label htmlFor="verified-only" className="text-xs text-muted-foreground cursor-pointer whitespace-nowrap">
                  Verified only
                </label>
              </div>
            </div>
          </div>

          {/* Citation Cards Grid */}
          <ScrollArea className="flex-1 max-h-[calc(100vh-420px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-1">
              <AnimatePresence mode="popLayout">
                {filteredCitations.map((citation, i) => {
                  const cfg = TYPE_CONFIG[citation.type];
                  const TypeIcon = cfg.icon;
                  const geoCfg = getGeoConfig(citation.geography);
                  return (
                    <motion.div
                      key={citation.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                    >
                      <Card
                        className="group hover:shadow-md transition-shadow border-l-4"
                        style={{ borderLeftColor: cfg.cardAccent }}
                      >
                        <CardHeader className="pb-2 pt-4 px-4">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Badge className={cn(cfg.badgeBg, cfg.badgeText, cfg.badgeBorder, 'gap-1')}>
                                <TypeIcon className="size-3" />
                                {cfg.label}
                              </Badge>
                              <Badge className={cn(geoCfg.bgClass, geoCfg.textClass, geoCfg.borderClass, 'gap-1')}>
                                <MapPin className="size-3" />
                                {geoCfg.flagEmoji} {geoCfg.label}
                              </Badge>
                            </div>
                            {citation.verified ? (
                              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
                                <CheckCircle2 className="size-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
                                <AlertTriangle className="size-3" />
                                Unverified
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 space-y-3">
                          <div>
                            <p className="text-sm font-medium leading-snug">
                              {citation.source}
                            </p>
                          </div>

                          {citation.dataPoint && (
                            <div className="rounded-md bg-muted/50 px-3 py-2">
                              <div className="flex items-start gap-1.5">
                                <Info className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {citation.dataPoint}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {citation.datePublished && (
                              <div className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                <span>{citation.datePublished}</span>
                              </div>
                            )}
                            {citation.url && (
                              <div className="flex items-center gap-1">
                                <Link2 className="size-3" />
                                <span className="truncate max-w-28">Source URL</span>
                              </div>
                            )}
                          </div>

                          <Separator />

                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1 flex-1"
                              onClick={() => setDetailCitation(citation)}
                            >
                              <Eye className="size-3" />
                              View Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                'h-7 text-xs gap-1 flex-1',
                                copiedId === citation.id
                                  ? 'text-emerald-600'
                                  : ''
                              )}
                              onClick={() => handleCopyCitation(citation)}
                            >
                              {copiedId === citation.id ? (
                                <>
                                  <CheckCircle2 className="size-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Bookmark className="size-3" />
                                  Copy Citation
                                </>
                              )}
                            </Button>
                            {citation.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs gap-1 flex-1"
                                onClick={() => window.open(citation.url!, '_blank')}
                              >
                                <ExternalLink className="size-3" />
                                Open
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredCitations.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                  <Search className="size-8 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium">No citations found</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {searchQuery
                    ? 'Try a different search term or adjust filters'
                    : 'Add a citation to get started'}
                </p>
              </motion.div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* ── Tab: Verification Queue ──────────────────────────────────── */}
        <TabsContent value="verification" className="flex-1 mt-3 min-h-0 flex flex-col gap-4">
          {/* Verification Progress */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="size-5 text-emerald-600" />
                    <h3 className="text-sm font-semibold">Verification Progress</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {verifiedCount} of {citations.length} citations verified ({verificationRate}%)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{verificationRate}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-3 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${verificationRate}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  {verifiedCount} Verified
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="size-3 text-amber-500" />
                  {unverifiedCitations.length} Pending
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Unverified Citations List */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full max-h-[calc(100vh-520px)]">
              {unverifiedCitations.length > 0 ? (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                        <TableHead className="hidden md:table-cell">Data Point</TableHead>
                        <TableHead className="hidden lg:table-cell">Geography</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unverifiedCitations.map((citation, i) => {
                        const cfg = TYPE_CONFIG[citation.type];
                        const TypeIcon = cfg.icon;
                        const geoCfg = getGeoConfig(citation.geography);
                        const isVerifying = verifyingIds.has(citation.id);
                        return (
                          <motion.tr
                            key={citation.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <TableCell>
                              <AlertTriangle className="size-4 text-amber-500" />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <p className="text-sm font-medium">{citation.source}</p>
                                {citation.datePublished && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    {citation.datePublished}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge className={cn(cfg.badgeBg, cfg.badgeText, cfg.badgeBorder, 'gap-1')}>
                                <TypeIcon className="size-3" />
                                {cfg.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <p className="text-xs text-muted-foreground max-w-48 truncate">
                                {citation.dataPoint || '—'}
                              </p>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge className={cn(geoCfg.bgClass, geoCfg.textClass, geoCfg.borderClass, 'gap-1')}>
                                <MapPin className="size-3" />
                                {geoCfg.flagEmoji} {geoCfg.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isVerifying}
                                onClick={() => handleVerify(citation.id)}
                              >
                                {isVerifying ? (
                                  <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="size-3.5" />
                                    Verify
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                >
                  <div className="flex items-center justify-center size-16 rounded-2xl bg-emerald-500/10 mb-4">
                    <CheckCircle2 className="size-8 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium">All citations verified!</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Your research data meets bank-grade standards
                  </p>
                </motion.div>
              )}
            </ScrollArea>
          </div>

          {/* AI Auto-Verification Banner */}
          <Card className="border-dashed">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
                <Sparkles className="size-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">AI Auto-Verification</p>
                <p className="text-xs text-muted-foreground">
                  The Citation Verifier agent automatically checks source URLs, cross-references data points,
                  and validates publication dates against known databases.
                </p>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
                <Loader2 className="size-3 animate-spin" />
                Running
              </Badge>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Source Map ──────────────────────────────────────────── */}
        <TabsContent value="sourcemap" className="flex-1 mt-3 min-h-0">
          <ScrollArea className="h-full max-h-[calc(100vh-380px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-1">
              {/* Geographic Distribution */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Globe className="size-4 text-emerald-600" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Sources mapped by region and geography
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {geographies.map((geo, i) => {
                    const geoCfg = getGeoConfig(geo);
                    const count = geoCounts[geo] || 0;
                    const percentage = citations.length > 0 ? Math.round((count / citations.length) * 100) : 0;
                    const geoCitations = citations.filter((c) => c.geography === geo);
                    const verifiedInGeo = geoCitations.filter((c) => c.verified).length;
                    return (
                      <motion.div
                        key={geo}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.08 }}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={cn(geoCfg.bgClass, geoCfg.textClass, geoCfg.borderClass, 'gap-1 text-sm px-2.5 py-0.5')}>
                              <MapPin className="size-3.5" />
                              {geoCfg.flagEmoji} {geo}
                            </Badge>
                            <span className="text-sm font-semibold">{count}</span>
                            <span className="text-xs text-muted-foreground">sources</span>
                          </div>
                          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
                            <CheckCircle2 className="size-3" />
                            {verifiedInGeo}/{count} verified
                          </Badge>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {geoCitations.map((c) => {
                            const tCfg = TYPE_CONFIG[c.type];
                            const TIcon = tCfg.icon;
                            return (
                              <Badge
                                key={c.id}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 gap-0.5"
                              >
                                <TIcon className={cn('size-2.5', tCfg.textClass)} />
                                {c.source.split(' — ')[0].split(' —')[0].substring(0, 20)}
                              </Badge>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Source Type Distribution */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="size-4 text-emerald-600" />
                    Source Type Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Breakdown of citations by source type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {CITATION_TYPES.map((type, i) => {
                    const cfg = TYPE_CONFIG[type];
                    const Icon = cfg.icon;
                    const count = typeCounts[type];
                    const percentage = citations.length > 0 ? Math.round((count / citations.length) * 100) : 0;
                    const typeCitations = citations.filter((c) => c.type === type);
                    const verifiedInType = typeCitations.filter((c) => c.verified).length;
                    return (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.08 }}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn('flex items-center justify-center size-7 rounded-md', cfg.bgClass, cfg.textClass)}>
                              <Icon className="size-3.5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{cfg.label}</p>
                              <p className="text-xs text-muted-foreground">{count} sources</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{percentage}%</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-0.5 justify-end">
                              <CheckCircle2 className="size-2.5 text-emerald-500" />
                              {verifiedInType} verified
                            </p>
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className={cn(
                              'h-full rounded-full',
                              type === 'market_data'
                                ? 'bg-emerald-500'
                                : type === 'industry_report'
                                  ? 'bg-cyan-500'
                                  : type === 'benchmark'
                                    ? 'bg-amber-500'
                                    : type === 'government'
                                      ? 'bg-teal-500'
                                      : 'bg-rose-500'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {typeCitations.map((c) => {
                            const geoCfg = getGeoConfig(c.geography);
                            return (
                              <Badge
                                key={c.id}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 gap-0.5"
                              >
                                <span className={cn('size-1.5 rounded-full', geoCfg.bgClass)} />
                                {c.geography || 'N/A'}
                              </Badge>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Stats Summary */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="size-4 text-emerald-600" />
                    Research Intelligence Summary
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Key metrics about your citation library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        label: 'Total Sources',
                        value: citations.length,
                        icon: Database,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-500/10',
                      },
                      {
                        label: 'Verified',
                        value: verifiedCount,
                        icon: CheckCircle2,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-500/10',
                      },
                      {
                        label: 'Regions Covered',
                        value: geographies.length,
                        icon: Globe,
                        color: 'text-cyan-600',
                        bg: 'bg-cyan-500/10',
                      },
                      {
                        label: 'Verification Rate',
                        value: `${verificationRate}%`,
                        icon: Shield,
                        color: verificationRate >= 80 ? 'text-emerald-600' : 'text-amber-600',
                        bg: verificationRate >= 80 ? 'bg-emerald-500/10' : 'bg-amber-500/10',
                      },
                    ].map((stat, i) => {
                      const StatIcon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className="rounded-lg border p-3 text-center space-y-2"
                        >
                          <div className={cn('flex items-center justify-center size-8 rounded-lg mx-auto', stat.bg, stat.color)}>
                            <StatIcon className="size-4" />
                          </div>
                          <p className="text-xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* ── Citation Detail Dialog ────────────────────────────────────── */}
      <Dialog open={!!detailCitation} onOpenChange={(open) => !open && setDetailCitation(null)}>
        <DialogContent className="sm:max-w-lg">
          {detailCitation && (() => {
            const cfg = TYPE_CONFIG[detailCitation.type];
            const TypeIcon = cfg.icon;
            const geoCfg = getGeoConfig(detailCitation.geography);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={cn(cfg.badgeBg, cfg.badgeText, cfg.badgeBorder, 'gap-1')}>
                      <TypeIcon className="size-3" />
                      {cfg.label}
                    </Badge>
                    <Badge className={cn(geoCfg.bgClass, geoCfg.textClass, geoCfg.borderClass, 'gap-1')}>
                      <MapPin className="size-3" />
                      {geoCfg.flagEmoji} {geoCfg.label}
                    </Badge>
                    {detailCitation.verified ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
                        <CheckCircle2 className="size-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
                        <AlertTriangle className="size-3" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    {detailCitation.source}
                  </DialogTitle>
                  <DialogDescription>
                    Citation details and formatted reference
                  </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="space-y-4">
                  {detailCitation.dataPoint && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <Info className="size-3.5 text-muted-foreground" />
                        Data Point
                      </h4>
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-sm leading-relaxed">{detailCitation.dataPoint}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {detailCitation.datePublished && (
                      <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <Calendar className="size-3" />
                          Published
                        </p>
                        <p className="text-sm font-medium">{detailCitation.datePublished}</p>
                      </div>
                    )}
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Tag className="size-3" />
                        Type
                      </p>
                      <p className="text-sm font-medium">{cfg.label}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <MapPin className="size-3" />
                        Geography
                      </p>
                      <p className="text-sm font-medium">{geoCfg.flagEmoji} {detailCitation.geography || 'N/A'}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Shield className="size-3" />
                        Verification
                      </p>
                      <p className={cn('text-sm font-medium flex items-center gap-1', detailCitation.verified ? 'text-emerald-600' : 'text-amber-600')}>
                        {detailCitation.verified ? (
                          <><CheckCircle2 className="size-3.5" /> Verified</>
                        ) : (
                          <><AlertTriangle className="size-3.5" /> Pending</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Bookmark className="size-3.5 text-muted-foreground" />
                      Formatted Citation
                    </h4>
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-sm leading-relaxed font-mono">
                        {formatCitation(detailCitation)}
                      </p>
                    </div>
                  </div>

                  {detailCitation.url && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <Link2 className="size-3.5 text-muted-foreground" />
                        Source URL
                      </h4>
                      <div className="rounded-lg border bg-muted/30 p-3 flex items-center gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {detailCitation.url}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 h-7 text-xs gap-1"
                          onClick={() => window.open(detailCitation.url!, '_blank')}
                        >
                          <ExternalLink className="size-3" />
                          Open
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => handleCopyCitation(detailCitation)}
                  >
                    {copiedId === detailCitation.id ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Bookmark className="size-3.5" />
                        Copy Citation
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ── Add Citation Dialog ────────────────────────────────────────── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-4 text-emerald-600" />
              Add New Citation
            </DialogTitle>
            <DialogDescription>
              Add a verified source to the bank-grade research library.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Name *</label>
              <Input
                placeholder="e.g., Statista — Digital Market Outlook"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                placeholder="https://example.com/report"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type *</label>
                <Select
                  value={newType}
                  onValueChange={(val) => setNewType(val as CitationType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITATION_TYPES.map((type) => {
                      const cfg = TYPE_CONFIG[type];
                      const Icon = cfg.icon;
                      return (
                        <SelectItem key={type} value={type}>
                          <span className="flex items-center gap-2">
                            <Icon className={cn('size-3.5', cfg.textClass)} />
                            {cfg.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Geography</label>
                <Select
                  value={newGeography}
                  onValueChange={setNewGeography}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MY">🇲🇾 MY — Malaysia</SelectItem>
                    <SelectItem value="SEA">🌏 SEA — Southeast Asia</SelectItem>
                    <SelectItem value="Global">🌍 Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Published</label>
                <Input
                  placeholder="e.g., 2024-06"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data Point</label>
                <Input
                  placeholder="e.g., SEA SaaS market USD12.4B"
                  value={newDataPoint}
                  onChange={(e) => setNewDataPoint(e.target.value)}
                />
              </div>
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              onClick={handleAddCitation}
              disabled={!newSource.trim()}
            >
              <Database className="size-3.5" />
              Add Citation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResearchModule;
