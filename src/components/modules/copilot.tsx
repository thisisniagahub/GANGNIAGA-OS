'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  X, Send, Bot, User, Sparkles, Loader2, Trash2, Mic, MicOff,
  Volume2, VolumeX, ImagePlus, Search, Zap, Brain, ChevronRight,
  ExternalLink, Copy, Check, Play, FileCode2, FolderTree,
  GitBranch, Database, Rocket, Code2, Wrench, Eye, Download,
  ChevronDown, ChevronUp, RefreshCw, MessageSquare, Terminal,
  BarChart3, Lightbulb, Shield, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ChatMessage, SearchResultItem } from '@/lib/types';

// ── Slash Command Parser ──
function parseSlashCommand(input: string): { type: string; args: string } | null {
  const match = input.match(/^\/(\w+)(?:\s+(.*))?$/);
  if (!match) return null;
  return { type: match[1], args: match[2] || '' };
}

// ── Audio Context for TTS ──
let currentAudio: HTMLAudioElement | null = null;

// ── Slash Command Definitions ──
interface SlashCommand {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
}

const SLASH_COMMANDS: SlashCommand[] = [
  { slug: 'edit', name: 'Edit File', description: 'Edit a project file using AI', category: 'code', icon: <FileCode2 className="h-3 w-3" />, color: 'emerald' },
  { slug: 'code', name: 'Generate Code', description: 'Generate code from description', category: 'code', icon: <Code2 className="h-3 w-3" />, color: 'emerald' },
  { slug: 'analyze', name: 'Analyze Code', description: 'Analyze a file for issues', category: 'code', icon: <Eye className="h-3 w-3" />, color: 'emerald' },
  { slug: 'fix', name: 'Fix Bug', description: 'AI-powered bug fixing', category: 'code', icon: <Wrench className="h-3 w-3" />, color: 'amber' },
  { slug: 'deploy', name: 'Deploy', description: 'Deploy the project', category: 'ops', icon: <Rocket className="h-3 w-3" />, color: 'rose' },
  { slug: 'git', name: 'Git Operations', description: 'Run git operations', category: 'ops', icon: <GitBranch className="h-3 w-3" />, color: 'orange' },
  { slug: 'db', name: 'Database', description: 'Database operations', category: 'ops', icon: <Database className="h-3 w-3" />, color: 'violet' },
  { slug: 'search', name: 'Web Search', description: 'Search the web for information', category: 'ai', icon: <Search className="h-3 w-3" />, color: 'cyan' },
  { slug: 'image', name: 'Image Generation', description: 'Generate an image from text prompt', category: 'ai', icon: <ImagePlus className="h-3 w-3" />, color: 'violet' },
  { slug: 'read', name: 'Read URL', description: 'Read web page content', category: 'ai', icon: <ExternalLink className="h-3 w-3" />, color: 'cyan' },
  { slug: 'vision', name: 'Vision', description: 'Analyze uploaded image', category: 'ai', icon: <Eye className="h-3 w-3" />, color: 'purple' },
  { slug: 'voice', name: 'Voice Input', description: 'Voice recording input', category: 'media', icon: <Mic className="h-3 w-3" />, color: 'red' },
  { slug: 'tts', name: 'Text to Speech', description: 'Convert text to speech', category: 'media', icon: <Volume2 className="h-3 w-3" />, color: 'red' },
  { slug: 'skills', name: 'List Skills', description: 'List all available skills', category: 'system', icon: <Zap className="h-3 w-3" />, color: 'emerald' },
  { slug: 'memory', name: 'Memory', description: 'View/manage copilot memory', category: 'system', icon: <Brain className="h-3 w-3" />, color: 'amber' },
  { slug: 'export', name: 'Export', description: 'Export conversation', category: 'system', icon: <Download className="h-3 w-3" />, color: 'teal' },
  { slug: 'workflow', name: 'Workflow', description: 'Trigger a workflow', category: 'automation', icon: <RefreshCw className="h-3 w-3" />, color: 'blue' },
  { slug: 'report', name: 'Report', description: 'Generate a report', category: 'business', icon: <BarChart3 className="h-3 w-3" />, color: 'teal' },
  { slug: 'forecast', name: 'Forecast', description: 'Run financial forecast', category: 'business', icon: <BarChart3 className="h-3 w-3" />, color: 'emerald' },
  { slug: 'validate', name: 'Validate', description: 'Validate business idea', category: 'business', icon: <Shield className="h-3 w-3" />, color: 'amber' },
];

// ── Context-aware Suggestions ──
const MODULE_SUGGESTIONS: Record<string, string[]> = {
  dashboard: [
    'Analyze my current KPIs',
    'Generate weekly report',
    "What's my burn rate trend?",
    'Show revenue forecast',
  ],
  'business-plans': [
    'Generate a bank loan proposal',
    'Review my plan for consistency',
    'Create pitch deck from this plan',
    '/forecast Run 3-year projections',
  ],
  financials: [
    'Run revenue forecast',
    'Calculate DSCR sensitivity',
    'What-if analysis on MRR growth',
    '/report financial',
  ],
  agents: [
    'Create a new agent',
    'Monitor agent tasks',
    'Deploy browser agent',
    'Show agent performance',
  ],
  workflows: [
    'Create automated workflow',
    'Schedule daily KPI report',
    'Set up revenue alert',
    'Review workflow status',
  ],
  memory: [
    'What do you remember about my business?',
    '/memory View all memories',
    'Summarize key business insights',
    'What are my financial priorities?',
  ],
  reports: [
    '/report investor',
    '/report kpi',
    'Generate board presentation',
    'Export financial summary',
  ],
  'idea-canvas': [
    '/validate my current idea',
    'Score my business model',
    'Compare against benchmarks',
    'Identify red flags',
  ],
  'plan-review': [
    'Review plan as bank lender',
    'Check narrative vs financial consistency',
    'Fix discrepancies in my plan',
    'Score my proposal for investor',
  ],
  'plan-actuals': [
    'Analyze variance trends',
    'Why is cash flow below plan?',
    'Can I afford a new hire?',
    'Forecast next quarter actuals',
  ],
  'pitch-deck': [
    'Generate investor pitch deck',
    'Create bank presentation',
    'Prepare anticipated questions',
    'Link data points to plan',
  ],
  research: [
    '/search ASEAN SME market size 2024',
    'Verify my citations',
    'Find competitor benchmarks',
    'Research Malaysian SME grants',
  ],
  openclaw: [
    'Show gateway status',
    'Configure WhatsApp channel',
    'List active sessions',
    'Review SOUL.md personality',
  ],
  settings: [
    'Connect QuickBooks integration',
    'Change AI model settings',
    'Update company profile',
    'Configure notifications',
  ],
};

// ── Code Block Renderer ──
function CodeBlock({ language, code, filename }: { language: string; code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden my-2 bg-zinc-950">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3 text-emerald-400" />
          <span className="text-[11px] font-mono text-zinc-400">{language || 'text'}</span>
          {filename && (
            <>
              <span className="text-zinc-600">—</span>
              <span className="text-[11px] font-mono text-emerald-400">{filename}</span>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded hover:bg-zinc-800"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-zinc-400" />}
        </Button>
      </div>
      <pre className="p-3 overflow-x-auto text-[12px] leading-relaxed font-mono text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Tool Execution Panel ──
function ToolPanel({ toolResult }: { toolResult: NonNullable<ChatMessage['toolResult']> }) {
  const [expanded, setExpanded] = useState(true);

  const statusIcon = toolResult.status === 'running' ? (
    <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
  ) : toolResult.status === 'success' ? (
    <Check className="h-3.5 w-3.5 text-emerald-500" />
  ) : (
    <X className="h-3.5 w-3.5 text-rose-500" />
  );

  const statusColor = toolResult.status === 'running' ? 'border-amber-500/30 bg-amber-500/5' :
    toolResult.status === 'success' ? 'border-emerald-500/30 bg-emerald-500/5' :
    'border-rose-500/30 bg-rose-500/5';

  return (
    <div className={`rounded-lg border ${statusColor} overflow-hidden my-2`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors"
      >
        {statusIcon}
        <Wrench className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-medium">{toolResult.tool}</span>
        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
          {toolResult.status}
        </Badge>
        {toolResult.duration && (
          <span className="text-[10px] text-muted-foreground ml-auto">{toolResult.duration}ms</span>
        )}
        {expanded ? <ChevronUp className="h-3 w-3 text-muted-foreground ml-1" /> : <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />}
      </button>
      {expanded && (
        <div className="border-t border-border/50 px-3 py-2 space-y-1.5">
          {toolResult.input && (
            <div>
              <span className="text-[10px] text-muted-foreground font-medium">Input</span>
              <pre className="text-[11px] font-mono text-zinc-400 mt-0.5 max-h-24 overflow-y-auto whitespace-pre-wrap">{toolResult.input}</pre>
            </div>
          )}
          {toolResult.output && (
            <div>
              <span className="text-[10px] text-muted-foreground font-medium">Output</span>
              <pre className="text-[11px] font-mono text-zinc-300 mt-0.5 max-h-40 overflow-y-auto whitespace-pre-wrap">{toolResult.output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── File Edit Panel ──
function FileEditPanel({ fileEdit }: { fileEdit: NonNullable<ChatMessage['fileEdit']> }) {
  const [showContent, setShowContent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = fileEdit.diff || fileEdit.content || '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 overflow-hidden my-2">
      <div className="flex items-center gap-2 px-3 py-2">
        <FileCode2 className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">{fileEdit.path}</span>
        <Badge className="text-[9px] px-1.5 py-0 h-4 bg-emerald-500/15 text-emerald-600 border-emerald-500/30">edited</Badge>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded" onClick={handleCopy}>
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded" onClick={() => setShowContent(!showContent)}>
            {showContent ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      {showContent && (fileEdit.diff || fileEdit.content) && (
        <div className="border-t border-emerald-500/20 px-3 py-2">
          <pre className="text-[11px] font-mono text-zinc-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
            {fileEdit.diff || fileEdit.content}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── Mini File Browser ──
function FileBrowser({ onSelect, onClose }: { onSelect: (path: string) => void; onClose: () => void }) {
  const [files, setFiles] = useState<Array<{ name: string; isDirectory: boolean; path: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [currentDir, setCurrentDir] = useState('src');

  const loadDir = useCallback(async (dir: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/copilot/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'list_files', params: { directory: dir } }),
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setCurrentDir(dir);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDir('src');
  }, [loadDir]);

  return (
    <div className="border border-border rounded-lg bg-popover shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <FolderTree className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs font-medium font-mono">{currentDir}/</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <ScrollArea className="max-h-64">
        {loading ? (
          <div className="p-3 flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
            <span className="text-xs text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <div className="p-1">
            {currentDir !== 'src' && (
              <button
                onClick={() => {
                  const parent = currentDir.split('/').slice(0, -1).join('/') || 'src';
                  loadDir(parent);
                }}
                className="w-full text-left px-3 py-1.5 rounded-md hover:bg-accent flex items-center gap-2 text-xs"
              >
                <ChevronUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">..</span>
              </button>
            )}
            {files.map((f) => (
              <button
                key={f.path}
                onClick={() => {
                  if (f.isDirectory) {
                    loadDir(f.path);
                  } else {
                    onSelect(f.path);
                    onClose();
                  }
                }}
                className="w-full text-left px-3 py-1.5 rounded-md hover:bg-accent flex items-center gap-2 text-xs"
              >
                {f.isDirectory ? (
                  <FolderTree className="h-3 w-3 text-amber-500" />
                ) : (
                  <FileCode2 className="h-3 w-3 text-emerald-500" />
                )}
                <span className="font-mono">{f.name}</span>
              </button>
            ))}
            {files.length === 0 && (
              <p className="text-xs text-muted-foreground p-3 text-center">Empty directory</p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ── Render Message Content with code block detection ──
function RenderMessageContent({ content }: { content: string }) {
  const parts = useMemo(() => {
    const result: Array<{ type: 'text' | 'code'; content: string; language: string }> = [];
    const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', content: content.slice(lastIndex, match.index), language: '' });
      }
      result.push({ type: 'code', content: match[2].trim(), language: match[1] || 'text' });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      result.push({ type: 'text', content: content.slice(lastIndex), language: '' });
    }

    return result.length > 0 ? result : [{ type: 'text' as const, content, language: '' }];
  }, [content]);

  return (
    <>
      {parts.map((part, i) =>
        part.type === 'code' ? (
          <CodeBlock key={i} language={part.language} code={part.content} />
        ) : (
          <div key={i} className="whitespace-pre-wrap break-words">{part.content}</div>
        )
      )}
    </>
  );
}

export default function CopilotPanel() {
  const {
    copilotOpen, toggleCopilot, chatMessages, addChatMessage,
    chatLoading, setChatLoading, clearChat,
    copilotSkills, setCopilotSkills,
    copilotMemories, setCopilotMemories,
    voiceRecording, setVoiceRecording,
    copilotInitialized, setCopilotInitialized,
    activeModule,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [asrLoading, setAsrLoading] = useState(false);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  // ── Load Skills & Memory on mount ──
  useEffect(() => {
    if (!copilotOpen || copilotInitialized) return;

    const loadData = async () => {
      try {
        const [skillsRes, memoryRes] = await Promise.all([
          fetch('/api/skills'),
          fetch('/api/memory'),
        ]);

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          const skills = (skillsData.skills || []).map((s: Record<string, unknown>) => ({
            id: s.id as string,
            name: s.name as string,
            slug: s.slug as string,
            description: s.description as string,
            category: s.category as string || 'general',
            triggerPhrase: s.triggerPhrase as string || null,
            tags: Array.isArray(s.tags) ? s.tags as string[] : [],
          }));
          setCopilotSkills(skills);
        }
      } catch {
        // Skills load failed silently
      }

      try {
        const memoryRes = await fetch('/api/memory');
        if (memoryRes.ok) {
          const memData = await memoryRes.json();
          const mems = (memData.memories || []).map((m: Record<string, unknown>) => ({
            id: m.id as string,
            key: m.key as string,
            content: m.content as string,
            type: m.type as string || 'memory',
            importance: m.importance as number || 5,
          }));
          setCopilotMemories(mems);
        }
      } catch {
        // Memory load failed silently
      }

      setCopilotInitialized(true);
    };

    loadData();
  }, [copilotOpen, copilotInitialized, setCopilotSkills, setCopilotMemories, setCopilotInitialized]);

  // ── Auto-scroll ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, imageGenerating, searchLoading, streamingText]);

  // ── Focus input when opened ──
  useEffect(() => {
    if (copilotOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [copilotOpen]);

  // ── Click outside slash menu ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (slashMenuRef.current && !slashMenuRef.current.contains(e.target as Node)) {
        setShowSlashMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Auto-learn after every 5 messages ──
  const triggerAutoLearn = useCallback((messages: ChatMessage[]) => {
    if (messages.length > 0 && messages.length % 5 === 0) {
      fetch('/api/skills/auto-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          sessionId: 'web-copilot',
        }),
      }).catch(() => {
        // Auto-learn fails silently
      });
    }
  }, []);

  // ── Streaming effect ──
  const streamText = useCallback((text: string, messageId: string) => {
    setStreamingText('');
    let i = 0;
    const speed = 8; // ms per character
    const interval = setInterval(() => {
      if (i < text.length) {
        const chunkSize = Math.min(3, text.length - i);
        setStreamingText(text.slice(0, i + chunkSize));
        i += chunkSize;
      } else {
        clearInterval(interval);
        setStreamingText(null);
      }
    }, speed);
  }, []);

  // ── Execute Copilot Tool ──
  const executeTool = useCallback(async (tool: string, params: Record<string, string>): Promise<{ success: boolean; data?: unknown; error?: string }> => {
    const startTime = Date.now();
    try {
      const res = await fetch('/api/copilot/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, params }),
      });
      const data = await res.json();
      const duration = Date.now() - startTime;
      return { success: res.ok, data, error: res.ok ? undefined : data.error };
    } catch {
      return { success: false, error: 'Tool execution failed' };
    }
  }, []);

  // ── Send Chat Message to /api/ai/chat ──
  const sendChatMessage = useCallback(async (messageText: string, skillName?: string) => {
    if (!messageText.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      type: skillName ? 'skill' : 'text',
      skillName,
    };

    addChatMessage(userMessage);
    setInput('');
    setShowSlashMenu(false);
    setChatLoading(true);

    try {
      // Build memory context for system prompt
      const memoryContext = copilotMemories.length > 0
        ? `\n\n## User Memory Context\n${copilotMemories.map(m => `- ${m.key}: ${m.content}`).join('\n')}`
        : '';

      const moduleContext = `\n\n## Current Module\nThe user is currently viewing: ${activeModule}`;

      const systemPrompt = `You are GangNiaga AI Copilot — an advanced autonomous AI assistant with FULL PROJECT EDITING CAPABILITIES built into GangNiaga AI OS. You can:

1. **Code Operations**: Read, write, and edit any file in the project
2. **Project Management**: List files, search codebase, check git status
3. **Business Intelligence**: Generate business plans, financial forecasts, market analysis, pitch decks
4. **Database Operations**: Query and manage the database
5. **AI Capabilities**: Generate images, search the web, transcribe audio, text-to-speech
6. **Workflow Automation**: Create and manage automated workflows and AI agents
7. **Deploy Operations**: Deploy the project

When the user asks you to make changes, you should:
1. Analyze the request
2. Show what you're about to do
3. Execute the change
4. Confirm the result

You have access to all project files, the database, and external AI services. You are running on Next.js 16 with TypeScript, Tailwind CSS, Prisma ORM, and Zustand state management.${memoryContext}${moduleContext}`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          history: chatMessages.slice(-20).map(m => ({ role: m.role, content: m.content })),
          systemPrompt,
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();
      const responseText = data.response || 'I apologize, but I encountered an issue processing your request. Please try again.';

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
        type: 'text',
      };

      addChatMessage(assistantMessage);
      streamText(responseText, assistantMessage.id);

      // Trigger auto-learn
      const updatedMessages = [...chatMessages, userMessage, assistantMessage];
      triggerAutoLearn(updatedMessages);
    } catch {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m currently experiencing connectivity issues. Please try again in a moment.',
        timestamp: new Date().toISOString(),
        type: 'text',
      });
    } finally {
      setChatLoading(false);
    }
  }, [chatLoading, chatMessages, copilotMemories, activeModule, addChatMessage, setChatLoading, triggerAutoLearn, streamText]);

  // ── Handle Slash Commands ──
  const handleSlashCommand = useCallback(async (type: string, args: string) => {
    switch (type) {
      case 'image': {
        if (!args.trim()) {
          toast.error('Please provide an image description, e.g., /image Professional dashboard hero');
          return;
        }
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/image ${args.trim()}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Image Generation',
        };
        addChatMessage(userMsg);
        setImageGenerating(true);
        setChatLoading(true);

        try {
          const res = await fetch('/api/ai/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: args.trim() }),
          });

          if (!res.ok) throw new Error('Image generation failed');

          const data = await res.json();
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Here's the generated image for: "${args.trim()}"`,
            timestamp: new Date().toISOString(),
            type: 'image',
            imageBase64: data.image,
          });
        } catch {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'I couldn\'t generate that image. Please try again with a different description.',
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        } finally {
          setImageGenerating(false);
          setChatLoading(false);
        }
        break;
      }

      case 'search': {
        if (!args.trim()) {
          toast.error('Please provide a search query, e.g., /search ASEAN SME market size 2024');
          return;
        }
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/search ${args.trim()}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Web Search',
        };
        addChatMessage(userMsg);
        setSearchLoading(true);
        setChatLoading(true);

        try {
          const res = await fetch('/api/ai/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: args.trim() }),
          });

          if (!res.ok) throw new Error('Search failed');

          const data = await res.json();
          const results: SearchResultItem[] = Array.isArray(data.results)
            ? data.results.map((r: Record<string, unknown>) => ({
                title: r.title || r.name || 'Result',
                url: r.url || r.link || '#',
                snippet: r.snippet || r.content || '',
              }))
            : [];

          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: results.length > 0
              ? `Here are the search results for "${args.trim()}":`
              : `No results found for "${args.trim()}".`,
            timestamp: new Date().toISOString(),
            type: 'search',
            searchResults: results,
          });
        } catch {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Search failed. Please try again later.',
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        } finally {
          setSearchLoading(false);
          setChatLoading(false);
        }
        break;
      }

      case 'edit': {
        const parts = args.trim().split(/\s+/);
        const filePath = parts[0];
        const instruction = parts.slice(1).join(' ');

        if (!filePath) {
          toast.error('Usage: /edit <file> <instruction>');
          return;
        }

        // First read the file
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/edit ${args.trim()}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'File Edit',
        };
        addChatMessage(userMsg);
        setChatLoading(true);

        // Show running tool
        const toolMsgId = (Date.now() + 0.5).toString();
        addChatMessage({
          id: toolMsgId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          type: 'tool_result',
          toolResult: { tool: `read_file: ${filePath}`, status: 'running', input: `Path: ${filePath}` },
        });

        const readResult = await executeTool('read_file', { path: filePath });

        if (!readResult.success) {
          // Update tool status to error
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Failed to read file: ${readResult.error || 'Unknown error'}. Please check the file path.`,
            timestamp: new Date().toISOString(),
            type: 'text',
          });
          setChatLoading(false);
          return;
        }

        const fileData = readResult.data as { content: string; language: string };
        const editInstruction = instruction || 'Improve this code';

        // Send to AI with file content
        try {
          const memoryContext = copilotMemories.length > 0
            ? `\n\n## User Memory Context\n${copilotMemories.map(m => `- ${m.key}: ${m.content}`).join('\n')}`
            : '';

          const systemPrompt = `You are a code editing assistant. The user wants to edit a file. Apply the requested changes and return the COMPLETE updated file content. Only output the code, no explanations outside the code.${memoryContext}`;

          const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `Edit this file with the following instruction: "${editInstruction}"\n\nCurrent file content:\n\`\`\`${fileData.language}\n${fileData.content}\n\`\`\`\n\nReturn the COMPLETE updated file. Do not omit any parts.`,
              history: [],
              systemPrompt,
            }),
          });

          if (!response.ok) throw new Error('AI edit failed');

          const data = await response.json();
          const newContent = data.response || '';

          // Extract code from the response (handle if it's wrapped in code block)
          let codeContent = newContent;
          const codeMatch = newContent.match(/```(?:\w*)\n?([\s\S]*?)```/);
          if (codeMatch) {
            codeContent = codeMatch[1].trim();
          }

          // Write the file
          const writeResult = await executeTool('edit_file', { path: filePath, content: codeContent });

          if (writeResult.success) {
            addChatMessage({
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: `Successfully edited \`${filePath}\``,
              timestamp: new Date().toISOString(),
              type: 'file_edit',
              fileEdit: { path: filePath, content: codeContent.slice(0, 2000) },
            });
            toast.success(`File ${filePath} updated successfully`);
          } else {
            addChatMessage({
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: `Failed to write file: ${writeResult.error}`,
              timestamp: new Date().toISOString(),
              type: 'text',
            });
          }
        } catch {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'AI editing failed. Please try again.',
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        } finally {
          setChatLoading(false);
        }
        break;
      }

      case 'analyze': {
        const filePath = args.trim();
        if (!filePath) {
          toast.error('Usage: /analyze <file>');
          return;
        }

        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/analyze ${filePath}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Code Analysis',
        };
        addChatMessage(userMsg);
        setChatLoading(true);

        const startTime = Date.now();
        const result = await executeTool('analyze_code', { path: filePath });

        if (result.success) {
          const data = result.data as { lines: number; language: string; issues: string[]; suggestions: string[]; size: number };
          const duration = Date.now() - startTime;

          const analysisText = [
            `**Analysis of \`${filePath}\`** (${duration}ms)`,
            ``,
            `📊 **Stats**: ${data.lines} lines | ${data.language} | ${(data.size / 1024).toFixed(1)}KB`,
            ``,
            ...(data.issues.length > 0 ? [
              `⚠️ **Issues** (${data.issues.length}):`,
              ...data.issues.map((i: string) => `  - ${i}`),
              ``,
            ] : []),
            ...(data.suggestions.length > 0 ? [
              `💡 **Suggestions** (${data.suggestions.length}):`,
              ...data.suggestions.map((s: string) => `  - ${s}`),
            ] : []),
            ...(data.issues.length === 0 && data.suggestions.length === 0 ? ['✅ No issues found!'] : []),
          ].join('\n');

          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: analysisText,
            timestamp: new Date().toISOString(),
            type: 'tool_result',
            toolResult: {
              tool: 'analyze_code',
              status: 'success',
              input: filePath,
              output: `${data.issues.length} issues, ${data.suggestions.length} suggestions`,
              duration,
            },
          });
        } else {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Analysis failed: ${result.error}`,
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        }
        setChatLoading(false);
        break;
      }

      case 'git': {
        const subCmd = args.trim() || 'status';
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/git ${subCmd}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Git',
        };
        addChatMessage(userMsg);
        setChatLoading(true);

        const startTime = Date.now();

        if (subCmd === 'status') {
          const result = await executeTool('git_status', {});
          const duration = Date.now() - startTime;
          if (result.success) {
            const data = result.data as { status: string; branch: string };
            addChatMessage({
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `**Git Status** (branch: \`${data.branch}\`)\n\`\`\`\n${data.status || 'Working tree clean'}\n\`\`\``,
              timestamp: new Date().toISOString(),
              type: 'tool_result',
              toolResult: { tool: 'git_status', status: 'success', input: subCmd, output: data.status, duration },
            });
          } else {
            addChatMessage({
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `Git status failed: ${result.error}`,
              timestamp: new Date().toISOString(),
              type: 'text',
            });
          }
        } else if (subCmd === 'log') {
          const result = await executeTool('git_log', { count: '10' });
          const duration = Date.now() - startTime;
          if (result.success) {
            const data = result.data as { log: string };
            addChatMessage({
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `**Recent Git Log**\n\`\`\`\n${data.log}\n\`\`\``,
              timestamp: new Date().toISOString(),
              type: 'tool_result',
              toolResult: { tool: 'git_log', status: 'success', input: '10', output: data.log?.slice(0, 200), duration },
            });
          } else {
            addChatMessage({
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `Git log failed: ${result.error}`,
              timestamp: new Date().toISOString(),
              type: 'text',
            });
          }
        } else {
          await sendChatMessage(`Run git ${subCmd} and explain the result`);
        }
        setChatLoading(false);
        break;
      }

      case 'db': {
        const operation = args.trim() || 'schema';
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/db ${operation}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Database',
        };
        addChatMessage(userMsg);
        setChatLoading(true);

        const startTime = Date.now();
        if (operation === 'schema') {
          const result = await executeTool('db_schema', {});
          const duration = Date.now() - startTime;
          if (result.success) {
            const data = result.data as { schema: string };
            addChatMessage({
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `**Database Schema**\n\`\`\`prisma\n${data.schema.slice(0, 3000)}${data.schema.length > 3000 ? '\n... (truncated)' : ''}\n\`\`\``,
              timestamp: new Date().toISOString(),
              type: 'tool_result',
              toolResult: { tool: 'db_schema', status: 'success', input: operation, output: `${data.schema.length} chars`, duration },
            });
          } else {
            addChatMessage({
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `Database query failed: ${result.error}`,
              timestamp: new Date().toISOString(),
              type: 'text',
            });
          }
        } else {
          await sendChatMessage(`Database operation: ${operation}. Help me with this.`);
        }
        setChatLoading(false);
        break;
      }

      case 'deploy': {
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: '/deploy',
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Deploy',
        };
        addChatMessage(userMsg);
        setChatLoading(true);

        // Show running tool
        const toolMsgId = (Date.now() + 0.5).toString();
        addChatMessage({
          id: toolMsgId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          type: 'tool_result',
          toolResult: { tool: 'deploy', status: 'running', input: 'Full deployment' },
        });

        const startTime = Date.now();
        const result = await executeTool('deploy', {});
        const duration = Date.now() - startTime;

        if (result.success) {
          const data = result.data as { message: string; timestamp: string };
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `**Deployment Initiated** 🚀\n\n${data.message}\n\nTimestamp: ${data.timestamp}`,
            timestamp: new Date().toISOString(),
            type: 'tool_result',
            toolResult: { tool: 'deploy', status: 'success', input: 'Full deployment', output: data.message, duration },
          });
          toast.success('Deployment initiated');
        } else {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Deployment failed: ${result.error}`,
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        }
        setChatLoading(false);
        break;
      }

      case 'code': {
        if (!args.trim()) {
          toast.error('Usage: /code <description>');
          return;
        }
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/code ${args.trim()}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Code Generation',
        };
        addChatMessage(userMsg);
        setChatLoading(true);

        try {
          const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `Generate TypeScript code for: ${args.trim()}\n\nUse Next.js App Router patterns, TypeScript, and Tailwind CSS. Return the complete code with proper typing.`,
              history: [],
              systemPrompt: 'You are an expert code generator. Generate clean, well-typed TypeScript code. Always wrap code in proper markdown code blocks with the language identifier.',
            }),
          });

          if (!response.ok) throw new Error('Code generation failed');
          const data = await response.json();
          const codeResponse = data.response || '';

          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: codeResponse,
            timestamp: new Date().toISOString(),
            type: 'code',
            codeBlock: { language: 'typescript', code: codeResponse },
          });
        } catch {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Code generation failed. Please try again.',
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        } finally {
          setChatLoading(false);
        }
        break;
      }

      case 'fix': {
        if (!args.trim()) {
          toast.error('Usage: /fix <description>');
          return;
        }
        await sendChatMessage(`Fix this bug: ${args.trim()}. Analyze the problem, identify the root cause, and provide the fix with explanation.`, 'Bug Fix');
        break;
      }

      case 'read': {
        if (!args.trim()) {
          toast.error('Usage: /read <url>');
          return;
        }
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/read ${args.trim()}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Web Reader',
        };
        addChatMessage(userMsg);
        setChatLoading(true);

        try {
          const res = await fetch('/api/ai/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: args.trim() }),
          });

          if (!res.ok) throw new Error('Read failed');
          const data = await res.json();

          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `**Content from ${args.trim()}**\n\n${(data.content || data.html || 'No content extracted').slice(0, 3000)}`,
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        } catch {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Failed to read the web page. Please check the URL.',
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        } finally {
          setChatLoading(false);
        }
        break;
      }

      case 'skills': {
        const skillsList = SLASH_COMMANDS.map(c => `**/${c.slug}** — ${c.description}`).join('\n');
        const customSkills = copilotSkills.length > 0
          ? `\n\n**Custom Skills:**\n${copilotSkills.map(s => `**/${s.slug}** — ${s.description}`).join('\n')}`
          : '';
        addChatMessage({
          id: (Date.now()).toString(),
          role: 'assistant',
          content: `**Available Commands & Skills:**\n\n${skillsList}${customSkills}`,
          timestamp: new Date().toISOString(),
          type: 'text',
        });
        break;
      }

      case 'memory': {
        const memList = copilotMemories.length > 0
          ? copilotMemories.map(m => `- **${m.key}**: ${m.content.slice(0, 100)}`).join('\n')
          : 'No memories stored yet.';
        addChatMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: `**Copilot Memory** (${copilotMemories.length} entries)\n\n${memList}`,
          timestamp: new Date().toISOString(),
          type: 'text',
        });
        break;
      }

      case 'export': {
        const format = args.trim() || 'text';
        const exportContent = chatMessages.map(m =>
          `[${m.role.toUpperCase()}] ${m.timestamp}\n${m.content}\n`
        ).join('\n---\n\n');

        const blob = new Blob([exportContent], { type: format === 'json' ? 'application/json' : 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `copilot-export.${format === 'json' ? 'json' : 'txt'}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Conversation exported as ${format.toUpperCase()}`);
        break;
      }

      case 'report': {
        const reportType = args.trim() || 'investor';
        await sendChatMessage(`Generate a ${reportType} report for my business. Include executive summary, financial overview, KPI dashboard, and key recommendations.`, 'Report Generator');
        break;
      }

      case 'forecast': {
        await sendChatMessage('Run a comprehensive financial forecast based on current data. Include revenue projections, expense trends, cash flow analysis, and DSCR calculations for the next 12 months.', 'Forecast');
        break;
      }

      case 'validate': {
        await sendChatMessage('Validate my current business idea. Score it on market viability, problem clarity, solution feasibility, revenue potential, and competitive position. Include strengths, weaknesses, and red flags.', 'Idea Validation');
        break;
      }

      case 'workflow': {
        const workflowName = args.trim() || 'daily-kpi';
        await sendChatMessage(`Create and trigger the "${workflowName}" workflow. Design the steps, assign agents, and execute.`, 'Workflow');
        break;
      }

      case 'tts': {
        const text = args.trim() || 'Text to speech is ready. Type /tts followed by any text to hear it spoken aloud.';
        if (text) {
          playTTS(text, 'tts-demo');
        }
        break;
      }

      case 'vision': {
        toast.info('Vision analysis: Upload an image using the image button, then ask me to analyze it.');
        break;
      }

      default: {
        // Try matching a skill from the skills list
        const matchedSkill = copilotSkills.find(
          s => s.slug === type || s.triggerPhrase === `/${type}`
        );
        if (matchedSkill) {
          const fullPrompt = args.trim()
            ? `${matchedSkill.name}: ${args.trim()}`
            : `Run the ${matchedSkill.name} skill`;
          await sendChatMessage(fullPrompt, matchedSkill.name);
        } else {
          // Unknown slash command — send as regular message
          await sendChatMessage(`/${type} ${args}`.trim());
        }
        break;
      }
    }
  }, [addChatMessage, chatMessages, copilotSkills, sendChatMessage, setChatLoading, triggerAutoLearn, executeTool, copilotMemories, streamText]);

  // ── Main Send Handler ──
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || chatLoading) return;

    // Check for slash command
    const slashCmd = parseSlashCommand(trimmed);
    if (slashCmd) {
      await handleSlashCommand(slashCmd.type, slashCmd.args);
    } else {
      await sendChatMessage(trimmed);
    }
  }, [input, chatLoading, handleSlashCommand, sendChatMessage]);

  // ── Key Down Handler ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showSlashMenu) return;
      handleSend();
    }
    if (e.key === 'Escape') {
      setShowSlashMenu(false);
    }
  };

  // ── Input Change Handler (detect slash commands) ──
  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashFilter(value.slice(1).toLowerCase());
    } else {
      setShowSlashMenu(false);
    }
  };

  // ── Voice Recording ──
  const toggleVoiceRecording = async () => {
    if (voiceRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setVoiceRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setAsrLoading(true);
          setChatLoading(true);

          try {
            const res = await fetch('/api/ai/asr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64Audio, format: 'webm' }),
            });

            if (!res.ok) throw new Error('ASR failed');

            const data = await res.json();
            const transcription = typeof data.transcription === 'string'
              ? data.transcription
              : data.transcription?.text || data.transcription?.transcription || '';

            if (transcription) {
              const slashCmd = parseSlashCommand(transcription);
              if (slashCmd) {
                await handleSlashCommand(slashCmd.type, slashCmd.args);
              } else {
                await sendChatMessage(transcription);
              }
            } else {
              toast.error('Could not transcribe audio. Please try again.');
            }
          } catch {
            toast.error('Voice transcription failed. Please try again.');
          } finally {
            setAsrLoading(false);
            setChatLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setVoiceRecording(true);
      toast.info('Recording... Click the microphone again to stop.');
    } catch {
      toast.error('Microphone access denied. Please allow microphone permissions.');
    }
  };

  // ── TTS Playback ──
  const playTTS = async (text: string, messageId: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
      setPlayingMessageId(null);
    }

    if (playingMessageId === messageId) return;

    setTtsLoadingId(messageId);

    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 4096), voice: 'nova' }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onplay = () => setPlayingMessageId(messageId);
      audio.onended = () => {
        setPlayingMessageId(null);
        currentAudio = null;
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setPlayingMessageId(null);
        currentAudio = null;
        toast.error('Audio playback failed.');
      };

      await audio.play();
    } catch {
      toast.error('Failed to generate speech. Please try again.');
    } finally {
      setTtsLoadingId(null);
    }
  };

  const stopTTS = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    setPlayingMessageId(null);
  };

  // ── Filter commands for slash menu ──
  const filteredCommands = SLASH_COMMANDS.filter(c =>
    c.slug.includes(slashFilter) || c.name.toLowerCase().includes(slashFilter)
  );

  const filteredSkills = copilotSkills.filter(s =>
    s.slug.includes(slashFilter) || s.name.toLowerCase().includes(slashFilter)
  );

  const allCommands = [...filteredCommands, ...filteredSkills.map(s => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    category: s.category,
    icon: <Zap className="h-3 w-3" />,
    color: 'emerald',
  }))];

  // ── Context-aware suggestions ──
  const suggestions = MODULE_SUGGESTIONS[activeModule] || MODULE_SUGGESTIONS.dashboard;

  // ── Memory usage percentage ──
  const memoryPercent = copilotMemories.length > 0
    ? Math.min(100, Math.round((copilotMemories.length / 100) * 100))
    : 0;

  if (!copilotOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-card/95 backdrop-blur-xl border-l border-border z-50 flex flex-col shadow-2xl"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">GangNiaga AI Copilot</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">Online</span>
                </div>
                <span className="text-[10px] text-muted-foreground">|</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <Brain className="h-2.5 w-2.5 text-amber-500" />
                        <span className="text-[10px] text-muted-foreground">{copilotMemories.length} mem</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{copilotMemories.length} memories stored ({memoryPercent}% capacity)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-[10px] text-muted-foreground">|</span>
                <div className="flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5 text-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">{copilotSkills.length + SLASH_COMMANDS.length}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">|</span>
                <div className="flex items-center gap-1">
                  <Cpu className="h-2.5 w-2.5 text-cyan-500" />
                  <span className="text-[10px] text-muted-foreground">{activeModule}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowFileBrowser(!showFileBrowser)}>
                    <FolderTree className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Browse files</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearChat}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear chat</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleCopilot}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── File Browser ── */}
        <AnimatePresence>
          {showFileBrowser && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-border px-3 py-2"
            >
              <FileBrowser
                onSelect={(path) => {
                  setInput(`/edit ${path} `);
                  inputRef.current?.focus();
                }}
                onClose={() => setShowFileBrowser(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Quick Skills Bar ── */}
        <div className="border-b border-border px-3 py-2">
          <ScrollArea className="w-full">
            <div className="flex gap-1.5 pb-1" style={{ minWidth: 0 }}>
              {[
                { slug: 'edit', icon: <FileCode2 className="h-2.5 w-2.5" />, color: 'emerald' },
                { slug: 'code', icon: <Code2 className="h-2.5 w-2.5" />, color: 'emerald' },
                { slug: 'analyze', icon: <Eye className="h-2.5 w-2.5" />, color: 'amber' },
                { slug: 'git', icon: <GitBranch className="h-2.5 w-2.5" />, color: 'orange' },
                { slug: 'deploy', icon: <Rocket className="h-2.5 w-2.5" />, color: 'rose' },
                { slug: 'image', icon: <ImagePlus className="h-2.5 w-2.5" />, color: 'violet' },
                { slug: 'search', icon: <Search className="h-2.5 w-2.5" />, color: 'cyan' },
                { slug: 'db', icon: <Database className="h-2.5 w-2.5" />, color: 'violet' },
                { slug: 'skills', icon: <Zap className="h-2.5 w-2.5" />, color: 'emerald' },
                { slug: 'memory', icon: <Brain className="h-2.5 w-2.5" />, color: 'amber' },
                { slug: 'forecast', icon: <BarChart3 className="h-2.5 w-2.5" />, color: 'teal' },
                { slug: 'validate', icon: <Shield className="h-2.5 w-2.5" />, color: 'amber' },
              ].map((cmd) => (
                <button
                  key={cmd.slug}
                  onClick={() => {
                    if (cmd.slug === 'skills' || cmd.slug === 'memory') {
                      handleSlashCommand(cmd.slug, '');
                    } else if (cmd.slug === 'deploy') {
                      handleSlashCommand('deploy', '');
                    } else {
                      setInput(`/${cmd.slug} `);
                      inputRef.current?.focus();
                    }
                  }}
                  className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    cmd.color === 'emerald' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15' :
                    cmd.color === 'amber' ? 'border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15' :
                    cmd.color === 'cyan' ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/15' :
                    cmd.color === 'violet' ? 'border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-400 hover:bg-violet-500/15' :
                    cmd.color === 'rose' ? 'border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-400 hover:bg-rose-500/15' :
                    cmd.color === 'orange' ? 'border-orange-500/20 bg-orange-500/5 text-orange-700 dark:text-orange-400 hover:bg-orange-500/15' :
                    cmd.color === 'teal' ? 'border-teal-500/20 bg-teal-500/5 text-teal-700 dark:text-teal-400 hover:bg-teal-500/15' :
                    'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {cmd.icon}
                  /{cmd.slug}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* ── Messages ── */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {chatMessages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`max-w-[85%] space-y-1.5 ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}>
                  {/* Skill badge */}
                  {msg.skillName && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                      <Zap className="h-2.5 w-2.5 mr-0.5" />
                      {msg.skillName}
                    </Badge>
                  )}

                  {/* Message bubble */}
                  <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 border border-border'
                  }`}>
                    {msg.type === 'image' && msg.imageBase64 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{msg.content}</p>
                        <img
                          src={`data:image/png;base64,${msg.imageBase64}`}
                          alt="AI Generated"
                          className="rounded-lg max-w-full border border-border"
                          loading="lazy"
                        />
                      </div>
                    ) : msg.type === 'search' && msg.searchResults && msg.searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm">{msg.content}</p>
                        <div className="space-y-1.5">
                          {msg.searchResults.map((result, ri) => (
                            <div
                              key={ri}
                              className="p-2 rounded-lg bg-background/50 border border-border hover:border-emerald-500/30 transition-colors"
                            >
                              <div className="flex items-start gap-1.5">
                                <ExternalLink className="h-3 w-3 mt-0.5 text-emerald-500 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium truncate">{result.title}</p>
                                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{result.snippet}</p>
                                  {result.url && result.url !== '#' && (
                                    <p className="text-[10px] text-emerald-500 truncate mt-0.5">{result.url}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : msg.type === 'tool_result' && msg.toolResult ? (
                      <ToolPanel toolResult={msg.toolResult} />
                    ) : msg.type === 'file_edit' && msg.fileEdit ? (
                      <div className="space-y-2">
                        <p className="text-sm">{msg.content}</p>
                        <FileEditPanel fileEdit={msg.fileEdit} />
                      </div>
                    ) : msg.type === 'code' && msg.codeBlock ? (
                      <CodeBlock language={msg.codeBlock.language} code={msg.codeBlock.code} filename={msg.codeBlock.filename} />
                    ) : msg.role === 'assistant' && msg.type !== 'image' ? (
                      <RenderMessageContent content={msg.content} />
                    ) : (
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    )}
                  </div>

                  {/* Action buttons for assistant messages */}
                  {msg.role === 'assistant' && msg.type !== 'image' && msg.content && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {/* TTS Play button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => {
                                if (playingMessageId === msg.id) {
                                  stopTTS();
                                } else {
                                  playTTS(msg.content, msg.id);
                                }
                              }}
                              disabled={ttsLoadingId === msg.id}
                            >
                              {ttsLoadingId === msg.id ? (
                                <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
                              ) : playingMessageId === msg.id ? (
                                <VolumeX className="h-3 w-3 text-amber-500" />
                              ) : (
                                <Volume2 className="h-3 w-3 text-muted-foreground hover:text-emerald-500" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {playingMessageId === msg.id ? 'Stop audio' : 'Play audio'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Copy button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={async () => {
                                await navigator.clipboard.writeText(msg.content);
                                toast.success('Copied to clipboard');
                              }}
                            >
                              <Copy className="h-3 w-3 text-muted-foreground hover:text-emerald-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy response</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Re-run button for tool results */}
                      {msg.type === 'tool_result' && msg.toolResult && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full"
                                onClick={() => {
                                  if (msg.toolResult?.input) {
                                    sendChatMessage(`Run that again: ${msg.toolResult.input}`);
                                  }
                                }}
                              >
                                <RefreshCw className="h-3 w-3 text-muted-foreground hover:text-amber-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Run again</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* Apply button for code messages */}
                      {msg.type === 'code' && msg.codeBlock && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 rounded-full text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                                onClick={() => {
                                  toast.info('Code ready to apply. Use /edit to write to a file.');
                                }}
                              >
                                <FileCode2 className="h-3 w-3 mr-1" />
                                Apply
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Apply this code to a file</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Streaming text */}
            {streamingText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-muted/50 border border-border">
                  <RenderMessageContent content={streamingText} />
                  <span className="inline-block w-1.5 h-4 bg-emerald-500 animate-pulse ml-0.5 align-text-bottom" />
                </div>
              </motion.div>
            )}

            {/* Loading States */}
            {chatLoading && !imageGenerating && !searchLoading && !asrLoading && !streamingText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {imageGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <ImagePlus className="h-3.5 w-3.5 animate-pulse text-violet-500" />
                    <span className="text-xs text-muted-foreground">Generating image...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {searchLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 animate-pulse text-cyan-500" />
                    <span className="text-xs text-muted-foreground">Searching the web...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {asrLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                    <span className="text-xs text-muted-foreground">Transcribing audio...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Context-aware Suggestions ── */}
          {chatMessages.length <= 1 && !chatLoading && !streamingText && (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald-500" />
                Suggested for {activeModule}
              </p>
              <div className="grid gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="text-left text-xs px-3 py-2.5 rounded-lg border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* ── Slash Command Menu ── */}
        <AnimatePresence>
          {showSlashMenu && allCommands.length > 0 && (
            <motion.div
              ref={slashMenuRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="border-t border-border mx-3 mb-1 bg-popover rounded-lg shadow-lg overflow-hidden"
            >
              <ScrollArea className="max-h-56">
                <div className="p-1">
                  {allCommands.map((cmd) => (
                    <button
                      key={cmd.slug}
                      onClick={() => {
                        if (cmd.slug === 'deploy' || cmd.slug === 'skills' || cmd.slug === 'memory') {
                          setShowSlashMenu(false);
                          handleSlashCommand(cmd.slug, '');
                        } else {
                          setInput(`/${cmd.slug} `);
                          setShowSlashMenu(false);
                          inputRef.current?.focus();
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-accent flex items-center gap-2 transition-colors"
                    >
                      <div className="flex items-center justify-center h-5 w-5 rounded border border-border bg-muted/30">
                        {cmd.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium">/{cmd.slug}</span>
                        <span className="text-[11px] text-muted-foreground ml-2 truncate">{cmd.description}</span>
                      </div>
                      {cmd.category && (
                        <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3.5 ml-auto flex-shrink-0 ${
                          cmd.category === 'code' ? 'border-emerald-500/30 text-emerald-600' :
                          cmd.category === 'ai' ? 'border-violet-500/30 text-violet-600' :
                          cmd.category === 'ops' ? 'border-orange-500/30 text-orange-600' :
                          cmd.category === 'business' ? 'border-teal-500/30 text-teal-600' :
                          cmd.category === 'automation' ? 'border-cyan-500/30 text-cyan-600' :
                          'border-border'
                        }`}>
                          {cmd.category}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input Bar ── */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            {/* Voice Record Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-full shrink-0 ${
                      voiceRecording
                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600 animate-pulse'
                        : 'hover:bg-emerald-500/10 hover:text-emerald-500'
                    }`}
                    onClick={toggleVoiceRecording}
                    disabled={chatLoading || asrLoading}
                  >
                    {voiceRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{voiceRecording ? 'Stop recording' : 'Voice input (/voice)'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Text Input */}
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask GangNiaga AI... (type / for commands)"
                disabled={chatLoading}
                className="w-full bg-muted/30 border-border focus:border-emerald-500 pr-24 h-9 text-sm"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-emerald-500/10 hover:text-emerald-500"
                        onClick={() => {
                          setShowFileBrowser(!showFileBrowser);
                        }}
                        disabled={chatLoading}
                      >
                        <FolderTree className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Browse files</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-violet-500/10 hover:text-violet-500"
                        onClick={() => {
                          setInput('/image ');
                          inputRef.current?.focus();
                        }}
                        disabled={chatLoading}
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>/image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-cyan-500/10 hover:text-cyan-500"
                        onClick={() => {
                          setInput('/search ');
                          inputRef.current?.focus();
                        }}
                        disabled={chatLoading}
                      >
                        <Search className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>/search</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatLoading}
              size="icon"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shrink-0 h-9 w-9"
            >
              {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            GangNiaga AI Copilot — Advanced Project Intelligence
            {voiceRecording && (
              <span className="text-red-500 ml-1.5 animate-pulse">● Recording</span>
            )}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
