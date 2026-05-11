'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Brain,
  Search,
  Database,
  Clock,
  User,
  Building2,
  DollarSign,
  Workflow,
  Bot,
  Plus,
  Filter,
  Tag,
  Sparkles,
  Trash2,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { MemoryEntry } from '@/lib/types';

// ─── Type Configuration ─────────────────────────────────────────────────────

type MemoryType = MemoryEntry['type'];

interface TypeConfig {
  label: string;
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

const TYPE_CONFIG: Record<MemoryType, TypeConfig> = {
  user: {
    label: 'User',
    icon: User,
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-600',
    borderClass: 'border-amber-500/20',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-600',
    badgeBorder: 'border-amber-500/25',
  },
  workspace: {
    label: 'Workspace',
    icon: Building2,
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-600',
    borderClass: 'border-emerald-500/20',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-600',
    badgeBorder: 'border-emerald-500/25',
  },
  financial: {
    label: 'Financial',
    icon: DollarSign,
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-600',
    borderClass: 'border-teal-500/20',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-600',
    badgeBorder: 'border-teal-500/25',
  },
  workflow: {
    label: 'Workflow',
    icon: Workflow,
    bgClass: 'bg-cyan-500/10',
    textClass: 'text-cyan-600',
    borderClass: 'border-cyan-500/20',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-600',
    badgeBorder: 'border-cyan-500/25',
  },
  agent: {
    label: 'Agent',
    icon: Bot,
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-600',
    borderClass: 'border-rose-500/20',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-600',
    badgeBorder: 'border-rose-500/25',
  },
};

const MEMORY_TYPES: MemoryType[] = ['user', 'workspace', 'financial', 'workflow', 'agent'];

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}

// ─── Component ──────────────────────────────────────────────────────────────

export function MemoryModule() {
  const { memories } = useAppStore();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailMemory, setDetailMemory] = useState<MemoryEntry | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Add Memory form state
  const [newType, setNewType] = useState<MemoryType>('workspace');
  const [newCategory, setNewCategory] = useState('');
  const [newContent, setNewContent] = useState('');

  // Filter memories based on tab and search
  const filteredMemories = useMemo(() => {
    let result = memories;

    if (activeTab !== 'all') {
      result = result.filter((m) => m.type === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.content.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [memories, activeTab, searchQuery]);

  // Count per type
  const typeCounts = useMemo(() => {
    const counts: Record<MemoryType, number> = {
      user: 0,
      workspace: 0,
      financial: 0,
      workflow: 0,
      agent: 0,
    };
    for (const m of memories) {
      counts[m.type]++;
    }
    return counts;
  }, [memories]);

  // Simulated related memories
  const relatedMemories = useMemo(() => {
    if (!detailMemory) return [];
    return memories
      .filter(
        (m) =>
          m.id !== detailMemory.id &&
          (m.type === detailMemory.type || m.category === detailMemory.category)
      )
      .slice(0, 3);
  }, [detailMemory, memories]);

  const handleAddMemory = (withAI: boolean) => {
    if (!newCategory.trim() || !newContent.trim()) return;

    const newMemory: MemoryEntry = {
      id: Date.now().toString(),
      type: newType,
      category: newCategory.trim(),
      content: newContent.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    useAppStore.setState((s) => ({ memories: [...s.memories, newMemory] }));
    setAddDialogOpen(false);
    setNewType('workspace');
    setNewCategory('');
    setNewContent('');
    toast.success(withAI ? 'Memory saved with AI enhancement' : 'Memory saved');
  };

  const handleDeleteMemory = useCallback((id: string) => {
    useAppStore.setState((s) => ({ memories: s.memories.filter((m) => m.id !== id) }));
    if (detailMemory?.id === id) setDetailMemory(null);
    toast.success('Memory deleted');
  }, [detailMemory]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-amber-500/10">
            <Brain className="size-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Memory Engine</h2>
            <p className="text-sm text-muted-foreground">
              Persistent organizational intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-48 sm:w-56 h-9 text-sm"
            />
          </div>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="size-3.5" />
            Add Memory
          </Button>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {MEMORY_TYPES.map((type, i) => {
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
                className={`cursor-pointer transition-colors hover:border-${type === 'user' ? 'amber' : type === 'workspace' ? 'emerald' : type === 'financial' ? 'teal' : type === 'workflow' ? 'cyan' : 'rose'}-500/40`}
                onClick={() => setActiveTab(activeTab === type ? 'all' : type)}
              >
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center size-9 rounded-lg ${cfg.bgClass} ${cfg.textClass}`}
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
          <TabsTrigger value="all" className="gap-1.5">
            <Database className="size-3.5" />
            All
          </TabsTrigger>
          {MEMORY_TYPES.map((type) => {
            const cfg = TYPE_CONFIG[type];
            const Icon = cfg.icon;
            return (
              <TabsTrigger key={type} value={type} className="gap-1.5">
                <Icon className="size-3.5" />
                {cfg.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Shared content for all tabs */}
        {['all', ...MEMORY_TYPES].map((tab) => (
          <TabsContent key={tab} value={tab} className="flex-1 mt-3 min-h-0">
            <ScrollArea className="h-full max-h-[calc(100vh-380px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-1">
                <AnimatePresence mode="popLayout">
                  {filteredMemories.map((memory, i) => {
                    const cfg = TYPE_CONFIG[memory.type];
                    const Icon = cfg.icon;
                    return (
                      <motion.div
                        key={memory.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                      >
                        <Card
                          className="cursor-pointer group hover:shadow-md transition-shadow border-l-4"
                          style={{
                            borderLeftColor:
                              memory.type === 'user'
                                ? 'rgb(245 158 11 / 0.5)'
                                : memory.type === 'workspace'
                                  ? 'rgb(16 185 129 / 0.5)'
                                  : memory.type === 'financial'
                                    ? 'rgb(20 184 166 / 0.5)'
                                    : memory.type === 'workflow'
                                      ? 'rgb(6 182 212 / 0.5)'
                                      : 'rgb(244 63 94 / 0.5)',
                          }}
                          onClick={() => setDetailMemory(memory)}
                        >
                          <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex items-center justify-between gap-2">
                              <Badge
                                className={`${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} gap-1`}
                              >
                                <Icon className="size-3" />
                                {cfg.label}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMemory(memory.id);
                                }}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="px-4 pb-4 pt-0 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Tag className="size-3" />
                              <span>{memory.category}</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {truncateText(memory.content, 120)}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                              <Clock className="size-3" />
                              <span>{memory.createdAt}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {filteredMemories.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                >
                  <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                    <Filter className="size-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm font-medium">No memories found</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {searchQuery
                      ? 'Try a different search term'
                      : 'No memories in this category yet'}
                  </p>
                </motion.div>
              )}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Memory Detail Dialog ──────────────────────────────────────── */}
      <Dialog open={!!detailMemory} onOpenChange={(open) => !open && setDetailMemory(null)}>
        <DialogContent className="sm:max-w-lg">
          {detailMemory && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {(() => {
                    const cfg = TYPE_CONFIG[detailMemory.type];
                    const Icon = cfg.icon;
                    return (
                      <Badge className={`${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} gap-1`}>
                        <Icon className="size-3" />
                        {cfg.label}
                      </Badge>
                    );
                  })()}
                </div>
                <DialogTitle className="flex items-center gap-2">
                  <Tag className="size-4 text-muted-foreground" />
                  {detailMemory.category}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1.5">
                  <Clock className="size-3" />
                  Created on {detailMemory.createdAt}
                </DialogDescription>
              </DialogHeader>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <Eye className="size-3.5 text-muted-foreground" />
                    Full Content
                  </h4>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm leading-relaxed">{detailMemory.content}</p>
                  </div>
                </div>

                {relatedMemories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-amber-500" />
                      Related Memories
                    </h4>
                    <div className="space-y-2">
                      {relatedMemories.map((rel) => {
                        const relCfg = TYPE_CONFIG[rel.type];
                        const RelIcon = relCfg.icon;
                        return (
                          <button
                            key={rel.id}
                            onClick={() => setDetailMemory(rel)}
                            className="w-full text-left rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                className={`${relCfg.badgeBg} ${relCfg.badgeText} ${relCfg.badgeBorder} gap-1 text-[10px] px-1.5 py-0`}
                              >
                                <RelIcon className="size-2.5" />
                                {relCfg.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{rel.category}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {truncateText(rel.content, 80)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add Memory Dialog ─────────────────────────────────────────── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-4 text-amber-600" />
              Add New Memory
            </DialogTitle>
            <DialogDescription>
              Store a new piece of organizational intelligence in the memory engine.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={newType}
                onValueChange={(val) => setNewType(val as MemoryType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select memory type" />
                </SelectTrigger>
                <SelectContent>
                  {MEMORY_TYPES.map((type) => {
                    const cfg = TYPE_CONFIG[type];
                    const Icon = cfg.icon;
                    return (
                      <SelectItem key={type} value={type}>
                        <span className="flex items-center gap-2">
                          <Icon className={`size-3.5 ${cfg.textClass}`} />
                          {cfg.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                placeholder="e.g., Company Profile, Revenue Model..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Enter the memory content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
              onClick={() => handleAddMemory(true)}
              disabled={!newCategory.trim() || !newContent.trim()}
            >
              <Sparkles className="size-3.5" />
              Save with AI Enhancement
            </Button>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
              onClick={() => handleAddMemory(false)}
              disabled={!newCategory.trim() || !newContent.trim()}
            >
              <Database className="size-3.5" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MemoryModule;
