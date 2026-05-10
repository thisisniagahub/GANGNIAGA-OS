'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type {
  OpenClawChannel,
  OpenClawChannelType,
  OpenClawChannelStatus,
  OpenClawPlugin,
  OpenClawDelegate,
  OpenClawWebhook,
  OpenClawScheduledTask,
  OpenClawSoulConfig,
  DelegateTier,
  PluginCapability,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  MessageCircle,
  Send,
  MessageSquare,
  Hash,
  Shield,
  Globe,
  Grid3x3,
  Users,
  Radio,
  Server,
  Activity,
  Play,
  Square,
  RotateCcw,
  Heart,
  Clock,
  Wifi,
  WifiOff,
  Plus,
  Settings,
  Trash2,
  Pencil,
  Pause,
  Resume,
  Zap,
  Package,
  Store,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  Mail,
  Link2,
  Webhook,
  CalendarClock,
  FileText,
  Save,
  RotateCcw as ResetIcon,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Terminal,
  Bot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// ─── Channel Type Configuration ──────────────────────────────────────────────

interface ChannelTypeConfig {
  label: string;
  icon: React.ElementType;
  color: string; // tailwind text color
  bg: string; // tailwind bg
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardAccent: string;
}

const CHANNEL_TYPE_CONFIG: Record<OpenClawChannelType, ChannelTypeConfig> = {
  whatsapp: {
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-green-600',
    bg: 'bg-green-500/10',
    badgeBg: 'bg-green-500/15',
    badgeText: 'text-green-600',
    badgeBorder: 'border-green-500/25',
    cardAccent: 'rgb(22 163 74 / 0.5)',
  },
  telegram: {
    label: 'Telegram',
    icon: Send,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-500',
    badgeBorder: 'border-blue-500/25',
    cardAccent: 'rgb(59 130 246 / 0.5)',
  },
  discord: {
    label: 'Discord',
    icon: MessageSquare,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-500',
    badgeBorder: 'border-indigo-500/25',
    cardAccent: 'rgb(99 102 241 / 0.5)',
  },
  slack: {
    label: 'Slack',
    icon: Hash,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-500',
    badgeBorder: 'border-purple-500/25',
    cardAccent: 'rgb(168 85 247 / 0.5)',
  },
  signal: {
    label: 'Signal',
    icon: Shield,
    color: 'text-blue-600',
    bg: 'bg-blue-600/10',
    badgeBg: 'bg-blue-600/15',
    badgeText: 'text-blue-600',
    badgeBorder: 'border-blue-600/25',
    cardAccent: 'rgb(37 99 235 / 0.5)',
  },
  imessage: {
    label: 'iMessage',
    icon: MessageCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    badgeBg: 'bg-green-500/15',
    badgeText: 'text-green-500',
    badgeBorder: 'border-green-500/25',
    cardAccent: 'rgb(34 197 94 / 0.5)',
  },
  webchat: {
    label: 'WebChat',
    icon: Globe,
    color: 'text-teal-600',
    bg: 'bg-teal-500/10',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-600',
    badgeBorder: 'border-teal-500/25',
    cardAccent: 'rgb(13 148 136 / 0.5)',
  },
  matrix: {
    label: 'Matrix',
    icon: Grid3x3,
    color: 'text-green-600',
    bg: 'bg-green-500/10',
    badgeBg: 'bg-green-500/15',
    badgeText: 'text-green-600',
    badgeBorder: 'border-green-500/25',
    cardAccent: 'rgb(22 163 74 / 0.5)',
  },
  msteams: {
    label: 'MS Teams',
    icon: Users,
    color: 'text-violet-600',
    bg: 'bg-violet-500/10',
    badgeBg: 'bg-violet-500/15',
    badgeText: 'text-violet-600',
    badgeBorder: 'border-violet-500/25',
    cardAccent: 'rgb(139 92 246 / 0.5)',
  },
  googlechat: {
    label: 'Google Chat',
    icon: MessageSquare,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-600',
    badgeBorder: 'border-amber-500/25',
    cardAccent: 'rgb(217 119 6 / 0.5)',
  },
  line: {
    label: 'LINE',
    icon: MessageCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    badgeBg: 'bg-green-500/15',
    badgeText: 'text-green-500',
    badgeBorder: 'border-green-500/25',
    cardAccent: 'rgb(34 197 94 / 0.5)',
  },
  wechat: {
    label: 'WeChat',
    icon: MessageCircle,
    color: 'text-green-600',
    bg: 'bg-green-500/10',
    badgeBg: 'bg-green-500/15',
    badgeText: 'text-green-600',
    badgeBorder: 'border-green-500/25',
    cardAccent: 'rgb(22 163 74 / 0.5)',
  },
  zalo: {
    label: 'Zalo',
    icon: MessageCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-500',
    badgeBorder: 'border-blue-500/25',
    cardAccent: 'rgb(59 130 246 / 0.5)',
  },
  irc: {
    label: 'IRC',
    icon: Hash,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-500',
    badgeBorder: 'border-orange-500/25',
    cardAccent: 'rgb(249 115 22 / 0.5)',
  },
  feishu: {
    label: 'Feishu',
    icon: Send,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-500',
    badgeBorder: 'border-blue-500/25',
    cardAccent: 'rgb(59 130 246 / 0.5)',
  },
  nostr: {
    label: 'Nostr',
    icon: Radio,
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-600',
    badgeBorder: 'border-purple-500/25',
    cardAccent: 'rgb(147 51 234 / 0.5)',
  },
  mattermost: {
    label: 'Mattermost',
    icon: Hash,
    color: 'text-blue-600',
    bg: 'bg-blue-600/10',
    badgeBg: 'bg-blue-600/15',
    badgeText: 'text-blue-600',
    badgeBorder: 'border-blue-600/25',
    cardAccent: 'rgb(37 99 235 / 0.5)',
  },
  twitch: {
    label: 'Twitch',
    icon: MessageCircle,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-500',
    badgeBorder: 'border-purple-500/25',
    cardAccent: 'rgb(168 85 247 / 0.5)',
  },
  qqbot: {
    label: 'QQ Bot',
    icon: MessageCircle,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-500',
    badgeBorder: 'border-cyan-500/25',
    cardAccent: 'rgb(6 182 212 / 0.5)',
  },
  'nextcloud-talk': {
    label: 'Nextcloud Talk',
    icon: MessageCircle,
    color: 'text-blue-600',
    bg: 'bg-blue-600/10',
    badgeBg: 'bg-blue-600/15',
    badgeText: 'text-blue-600',
    badgeBorder: 'border-blue-600/25',
    cardAccent: 'rgb(37 99 235 / 0.5)',
  },
};

// ─── Status Configuration ────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  icon: React.ElementType;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

const CHANNEL_STATUS_CONFIG: Record<OpenClawChannelStatus, StatusConfig> = {
  connected: {
    label: 'Connected',
    icon: Wifi,
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-600',
    badgeBorder: 'border-emerald-500/25',
  },
  disconnected: {
    label: 'Disconnected',
    icon: WifiOff,
    dotColor: 'bg-red-500',
    badgeBg: 'bg-red-500/15',
    badgeText: 'text-red-600',
    badgeBorder: 'border-red-500/25',
  },
  connecting: {
    label: 'Connecting',
    icon: Loader2,
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-600',
    badgeBorder: 'border-amber-500/25',
  },
  error: {
    label: 'Error',
    icon: XCircle,
    dotColor: 'bg-red-500',
    badgeBg: 'bg-red-500/15',
    badgeText: 'text-red-600',
    badgeBorder: 'border-red-500/25',
  },
  pending_approval: {
    label: 'Pending Approval',
    icon: Clock,
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-600',
    badgeBorder: 'border-amber-500/25',
  },
};

// ─── Tier Configuration ──────────────────────────────────────────────────────

interface TierConfig {
  label: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

const TIER_CONFIG: Record<DelegateTier, TierConfig> = {
  tier1_readonly: {
    label: 'Tier 1 — Read Only',
    description: 'Can only read messages and data',
    badgeBg: 'bg-gray-500/15',
    badgeText: 'text-gray-600',
    badgeBorder: 'border-gray-500/25',
  },
  tier2_send_behalf: {
    label: 'Tier 2 — Send on Behalf',
    description: 'Can read and send messages on behalf of principal',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-600',
    badgeBorder: 'border-amber-500/25',
  },
  tier3_proactive: {
    label: 'Tier 3 — Proactive',
    description: 'Can proactively initiate conversations and actions',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-600',
    badgeBorder: 'border-emerald-500/25',
  },
};

// ─── Capability Configuration ────────────────────────────────────────────────

const CAPABILITY_CONFIG: Record<PluginCapability, { label: string; color: string; bg: string }> = {
  text_inference: { label: 'Text Inference', color: 'text-emerald-600', bg: 'bg-emerald-500/15' },
  cli_backend: { label: 'CLI Backend', color: 'text-violet-600', bg: 'bg-violet-500/15' },
  speech: { label: 'Speech', color: 'text-pink-600', bg: 'bg-pink-500/15' },
  channel: { label: 'Channel', color: 'text-blue-600', bg: 'bg-blue-500/15' },
  tool: { label: 'Tool', color: 'text-amber-600', bg: 'bg-amber-500/15' },
  memory: { label: 'Memory', color: 'text-teal-600', bg: 'bg-teal-500/15' },
  automation: { label: 'Automation', color: 'text-cyan-600', bg: 'bg-cyan-500/15' },
};

const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  bundled: { label: 'Bundled', color: 'text-emerald-600', bg: 'bg-emerald-500/15' },
  clawhub: { label: 'ClawHub', color: 'text-amber-600', bg: 'bg-amber-500/15' },
  local: { label: 'Local', color: 'text-blue-600', bg: 'bg-blue-500/15' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days} days ${hours} hours ${minutes} minutes`;
}

function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return 'Never';
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = now - then;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function cronToHuman(cron: string): string {
  const parts = cron.split(' ');
  if (parts.length < 5) return cron;
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  if (minute === '0' && hour === '9' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return 'Every day at 9:00 AM';
  }
  if (minute === '0' && hour === '10' && dayOfMonth === '*' && month === '*' && dayOfWeek === '1') {
    return 'Every Monday at 10:00 AM';
  }
  if (minute === '0' && hour.startsWith('*/') && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const interval = hour.replace('*/', '');
    return `Every ${interval} hours`;
  }
  if (minute === '0' && hour === '9' && dayOfMonth === '1' && month === '*' && dayOfWeek === '*') {
    return '1st of every month at 9:00 AM';
  }
  if (minute === '*/5' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return 'Every 5 minutes';
  }
  if (minute === '0' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return 'Every hour';
  }
  return cron;
}

const ALL_CHANNEL_TYPES: OpenClawChannelType[] = [
  'whatsapp', 'telegram', 'discord', 'slack', 'signal',
  'imessage', 'webchat', 'matrix', 'msteams', 'googlechat',
  'line', 'wechat', 'zalo', 'irc', 'feishu', 'nostr',
  'mattermost', 'twitch', 'qqbot', 'nextcloud-talk',
];

const WEBHOOK_EVENTS = [
  'agent.complete',
  'message.received',
  'message.sent',
  'workflow.done',
  'workflow.failed',
  'channel.connected',
  'channel.disconnected',
  'delegate.action',
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function OpenClawModule() {
  const {
    openclawGateway,
    openclawChannels,
    openclawPlugins,
    openclawDelegates,
    openclawWebhooks,
    openclawScheduledTasks,
    updateOpenClawGateway,
    addOpenClawChannel,
    updateOpenClawChannel,
    removeOpenClawChannel,
    updateOpenClawPlugin,
    addOpenClawDelegate,
    updateOpenClawDelegate,
    addOpenClawWebhook,
    updateOpenClawWebhook,
    removeOpenClawWebhook,
    addOpenClawScheduledTask,
    updateOpenClawScheduledTask,
    removeOpenClawScheduledTask,
    updateOpenClawSoul,
    openclawSoul,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('gateway');

  // ── Gateway Config State ──
  const [editConfig, setEditConfig] = useState(openclawGateway.config);
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  // ── Channel Dialog ──
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [channelDetailOpen, setChannelDetailOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<OpenClawChannel | null>(null);
  const [newChannelType, setNewChannelType] = useState<OpenClawChannelType>('whatsapp');
  const [newChannelName, setNewChannelName] = useState('');

  // ── Delegate Dialog ──
  const [addDelegateOpen, setAddDelegateOpen] = useState(false);
  const [newDelegateName, setNewDelegateName] = useState('');
  const [newDelegateEmail, setNewDelegateEmail] = useState('');
  const [newDelegateDisplayName, setNewDelegateDisplayName] = useState('');
  const [newDelegateTier, setNewDelegateTier] = useState<DelegateTier>('tier1_readonly');

  // ── Webhook Dialog ──
  const [addWebhookOpen, setAddWebhookOpen] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookMethod, setNewWebhookMethod] = useState<'POST' | 'GET' | 'PUT'>('POST');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [newWebhookSecret, setNewWebhookSecret] = useState('');
  const [deleteWebhookId, setDeleteWebhookId] = useState<string | null>(null);

  // ── Scheduled Task Dialog ──
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCron, setNewTaskCron] = useState('');
  const [newTaskPrompt, setNewTaskPrompt] = useState('');
  const [newTaskChannel, setNewTaskChannel] = useState<OpenClawChannelType | ''>('');

  // ── SOUL.md State ──
  const [soulDraft, setSoulDraft] = useState<OpenClawSoulConfig>(openclawSoul);
  const [newRule, setNewRule] = useState('');

  // ── Health Check Loading ──
  const [healthChecking, setHealthChecking] = useState(false);

  // ── Gateway Handlers ──

  const handleGatewayAction = useCallback((action: 'start' | 'stop' | 'restart') => {
    if (action === 'stop') {
      updateOpenClawGateway({ status: 'stopped', uptime: 0, connectedClients: 0, activeChannels: 0 });
      toast.success('Gateway stopped');
    } else if (action === 'start') {
      updateOpenClawGateway({ status: 'running', uptime: 0 });
      toast.success('Gateway started');
    } else {
      updateOpenClawGateway({ status: 'starting' });
      setTimeout(() => {
        updateOpenClawGateway({ status: 'running', uptime: 0 });
        toast.success('Gateway restarted');
      }, 2000);
      toast.info('Restarting gateway...');
    }
  }, [updateOpenClawGateway]);

  const handleHealthCheck = useCallback(() => {
    setHealthChecking(true);
    setTimeout(() => {
      updateOpenClawGateway({ lastHealthCheck: new Date().toISOString() });
      setHealthChecking(false);
      toast.success('Health check passed');
    }, 1500);
  }, [updateOpenClawGateway]);

  const handleSaveConfig = useCallback(() => {
    updateOpenClawGateway({ config: editConfig });
    setIsEditingConfig(false);
    toast.success('Gateway configuration saved');
  }, [editConfig, updateOpenClawGateway]);

  // ── Channel Handlers ──

  const handleAddChannel = useCallback(() => {
    if (!newChannelName.trim()) return;
    const ch: OpenClawChannel = {
      id: `ch${Date.now()}`,
      type: newChannelType,
      name: newChannelName.trim(),
      status: 'disconnected',
      lastMessage: null,
      lastMessageAt: null,
      messageCount: 0,
      config: {},
      pairedAt: null,
      avatarUrl: null,
    };
    addOpenClawChannel(ch);
    setAddChannelOpen(false);
    setNewChannelName('');
    toast.success(`${CHANNEL_TYPE_CONFIG[newChannelType].label} channel added`);
  }, [newChannelType, newChannelName, addOpenClawChannel]);

  const handleRemoveChannel = useCallback((id: string) => {
    removeOpenClawChannel(id);
    setChannelDetailOpen(false);
    setSelectedChannel(null);
    toast.success('Channel removed');
  }, [removeOpenClawChannel]);

  // ── Plugin Handlers ──

  const handlePluginAction = useCallback((id: string, action: 'enable' | 'disable' | 'install' | 'uninstall') => {
    const statusMap: Record<string, OpenClawPlugin['status']> = {
      enable: 'enabled',
      disable: 'disabled',
      install: 'installed',
      uninstall: 'available',
    };
    updateOpenClawPlugin(id, {
      status: statusMap[action],
      ...(action === 'install' ? { installedAt: new Date().toISOString() } : {}),
      ...(action === 'uninstall' ? { installedAt: null } : {}),
    });
    toast.success(`Plugin ${action}d`);
  }, [updateOpenClawPlugin]);

  // ── Delegate Handlers ──

  const handleAddDelegate = useCallback(() => {
    if (!newDelegateName.trim() || !newDelegateEmail.trim()) return;
    const del: OpenClawDelegate = {
      id: `dl${Date.now()}`,
      name: newDelegateName.trim(),
      email: newDelegateEmail.trim(),
      displayName: newDelegateDisplayName.trim() || newDelegateName.trim(),
      tier: newDelegateTier,
      status: 'setup',
      channels: [],
      principalName: '',
      principalEmail: '',
      standingOrders: [],
      tasksCompleted: 0,
      lastActivity: null,
      createdAt: new Date().toISOString(),
    };
    addOpenClawDelegate(del);
    setAddDelegateOpen(false);
    setNewDelegateName('');
    setNewDelegateEmail('');
    setNewDelegateDisplayName('');
    setNewDelegateTier('tier1_readonly');
    toast.success('Delegate added');
  }, [newDelegateName, newDelegateEmail, newDelegateDisplayName, newDelegateTier, addOpenClawDelegate]);

  // ── Webhook Handlers ──

  const handleAddWebhook = useCallback(() => {
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) return;
    const wh: OpenClawWebhook = {
      id: `wh${Date.now()}`,
      name: newWebhookName.trim(),
      url: newWebhookUrl.trim(),
      method: newWebhookMethod,
      events: newWebhookEvents,
      status: 'active',
      lastTriggered: null,
      triggerCount: 0,
      secret: newWebhookSecret.trim() || null,
      headers: { 'Content-Type': 'application/json' },
      createdAt: new Date().toISOString(),
    };
    addOpenClawWebhook(wh);
    setAddWebhookOpen(false);
    setNewWebhookName('');
    setNewWebhookUrl('');
    setNewWebhookMethod('POST');
    setNewWebhookEvents([]);
    setNewWebhookSecret('');
    toast.success('Webhook added');
  }, [newWebhookName, newWebhookUrl, newWebhookMethod, newWebhookEvents, newWebhookSecret, addOpenClawWebhook]);

  const handleTestWebhook = useCallback((id: string) => {
    toast.info('Testing webhook...');
    setTimeout(() => {
      updateOpenClawWebhook(id, {
        lastTriggered: new Date().toISOString(),
        triggerCount: (openclawWebhooks.find(w => w.id === id)?.triggerCount ?? 0) + 1,
      });
      toast.success('Webhook test successful');
    }, 1500);
  }, [openclawWebhooks, updateOpenClawWebhook]);

  const handleDeleteWebhook = useCallback(() => {
    if (deleteWebhookId) {
      removeOpenClawWebhook(deleteWebhookId);
      setDeleteWebhookId(null);
      toast.success('Webhook deleted');
    }
  }, [deleteWebhookId, removeOpenClawWebhook]);

  // ── Scheduled Task Handlers ──

  const handleAddTask = useCallback(() => {
    if (!newTaskName.trim() || !newTaskCron.trim()) return;
    const task: OpenClawScheduledTask = {
      id: `st${Date.now()}`,
      name: newTaskName.trim(),
      cronExpression: newTaskCron.trim(),
      status: 'active',
      agentId: null,
      prompt: newTaskPrompt.trim(),
      channel: newTaskChannel || null,
      lastRun: null,
      nextRun: null,
      runCount: 0,
      createdAt: new Date().toISOString(),
    };
    addOpenClawScheduledTask(task);
    setAddTaskOpen(false);
    setNewTaskName('');
    setNewTaskCron('');
    setNewTaskPrompt('');
    setNewTaskChannel('');
    toast.success('Scheduled task created');
  }, [newTaskName, newTaskCron, newTaskPrompt, newTaskChannel, addOpenClawScheduledTask]);

  const handleToggleTask = useCallback((id: string, current: 'active' | 'paused') => {
    updateOpenClawScheduledTask(id, { status: current === 'active' ? 'paused' : 'active' });
    toast.success(current === 'active' ? 'Task paused' : 'Task resumed');
  }, [updateOpenClawScheduledTask]);

  const handleDeleteTask = useCallback((id: string) => {
    removeOpenClawScheduledTask(id);
    toast.success('Task deleted');
  }, [removeOpenClawScheduledTask]);

  // ── SOUL.md Handlers ──

  const handleSaveSoul = useCallback(() => {
    updateOpenClawSoul(soulDraft);
    toast.success('SOUL.md saved');
  }, [soulDraft, updateOpenClawSoul]);

  const handleResetSoul = useCallback(() => {
    setSoulDraft(openclawSoul);
    toast.info('SOUL.md reset to saved state');
  }, [openclawSoul]);

  const handleAddRule = useCallback(() => {
    if (!newRule.trim()) return;
    setSoulDraft(prev => ({ ...prev, rules: [...prev.rules, newRule.trim()] }));
    setNewRule('');
  }, [newRule]);

  const handleRemoveRule = useCallback((index: number) => {
    setSoulDraft(prev => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }));
  }, []);

  // ── Computed Values ──

  const connectedChannels = useMemo(() => openclawChannels.filter(c => c.status === 'connected').length, [openclawChannels]);
  const enabledPlugins = useMemo(() => openclawPlugins.filter(p => p.status === 'enabled').length, [openclawPlugins]);
  const activeDelegates = useMemo(() => openclawDelegates.filter(d => d.status === 'active').length, [openclawDelegates]);
  const activeTasks = useMemo(() => openclawScheduledTasks.filter(t => t.status === 'active').length, [openclawScheduledTasks]);

  // ── SOUL.md Preview ──

  const soulPreview = useMemo(() => {
    const lines = [
      '# SOUL.md',
      '',
      `## Personality`,
      soulDraft.personality,
      '',
      `## Tone`,
      soulDraft.tone,
      '',
      `## Language`,
      soulDraft.language,
      '',
      `## Specialty`,
      soulDraft.specialty,
      '',
      `## Greeting`,
      soulDraft.greeting,
      '',
      `## Rules`,
      ...soulDraft.rules.map((r, i) => `${i + 1}. ${r}`),
    ];
    return lines.join('\n');
  }, [soulDraft]);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full gap-4 p-1">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
            <Bot className="size-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">OpenClaw Integration</h2>
            <p className="text-sm text-muted-foreground">
              Multi-channel gateway, AI plugins, delegates & automation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1.5 px-3 py-1">
            <Activity className="size-3.5" />
            {connectedChannels} channels
          </Badge>
          <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1.5 px-3 py-1">
            <Package className="size-3.5" />
            {enabledPlugins} plugins
          </Badge>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="w-full">
          <TabsList className="w-full sm:w-auto self-start mb-0">
            <TabsTrigger value="gateway" className="gap-1.5">
              <Server className="size-3.5" />
              <span className="hidden sm:inline">Gateway</span>
            </TabsTrigger>
            <TabsTrigger value="channels" className="gap-1.5">
              <MessageCircle className="size-3.5" />
              <span className="hidden sm:inline">Channels</span>
            </TabsTrigger>
            <TabsTrigger value="plugins" className="gap-1.5">
              <Package className="size-3.5" />
              <span className="hidden sm:inline">Plugins</span>
            </TabsTrigger>
            <TabsTrigger value="delegates" className="gap-1.5">
              <Users className="size-3.5" />
              <span className="hidden sm:inline">Delegates</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-1.5">
              <Webhook className="size-3.5" />
              <span className="hidden sm:inline">Webhooks</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="gap-1.5">
              <CalendarClock className="size-3.5" />
              <span className="hidden sm:inline">Automation</span>
            </TabsTrigger>
            <TabsTrigger value="soul" className="gap-1.5">
              <Sparkles className="size-3.5" />
              <span className="hidden sm:inline">SOUL.md</span>
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 1: GATEWAY
        ══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="gateway" className="flex-1 mt-3 min-h-0 overflow-y-auto space-y-4">
          {/* Gateway Status Card */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="border-l-4" style={{ borderLeftColor: openclawGateway.status === 'running' ? 'rgb(16 185 129)' : openclawGateway.status === 'error' ? 'rgb(239 68 68)' : 'rgb(107 114 128)' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Server className="size-4 text-emerald-600" />
                    Gateway Status
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        'gap-1.5 px-3 py-1 text-sm',
                        openclawGateway.status === 'running'
                          ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25'
                          : openclawGateway.status === 'error'
                            ? 'bg-red-500/15 text-red-600 border-red-500/25'
                            : 'bg-gray-500/15 text-gray-600 border-gray-500/25'
                      )}
                    >
                      <span className={cn(
                        'inline-block size-2 rounded-full',
                        openclawGateway.status === 'running' ? 'bg-emerald-500 animate-pulse' :
                        openclawGateway.status === 'error' ? 'bg-red-500' :
                        openclawGateway.status === 'starting' ? 'bg-amber-500 animate-pulse' :
                        'bg-gray-400'
                      )} />
                      {openclawGateway.status.charAt(0).toUpperCase() + openclawGateway.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Bind Address', value: `${openclawGateway.bindHost}:${openclawGateway.bindPort}`, icon: Radio },
                    { label: 'Uptime', value: formatUptime(openclawGateway.uptime), icon: Clock },
                    { label: 'Connected Clients', value: String(openclawGateway.connectedClients), icon: Users },
                    { label: 'Active Channels', value: String(openclawGateway.activeChannels), icon: MessageCircle },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <stat.icon className="size-3" />
                        {stat.label}
                      </div>
                      <p className="text-sm font-semibold truncate">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Total Messages', value: openclawGateway.totalMessages.toLocaleString(), icon: Activity },
                    { label: 'Version', value: openclawGateway.version ?? 'N/A', icon: Zap },
                    { label: 'Last Health Check', value: formatRelativeTime(openclawGateway.lastHealthCheck), icon: Heart },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <stat.icon className="size-3" />
                        {stat.label}
                      </div>
                      <p className="text-sm font-semibold truncate">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {openclawGateway.status === 'running' ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1.5"
                      onClick={() => handleGatewayAction('stop')}
                    >
                      <Square className="size-3.5" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      onClick={() => handleGatewayAction('start')}
                    >
                      <Play className="size-3.5" />
                      Start
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => handleGatewayAction('restart')}
                    disabled={openclawGateway.status === 'starting'}
                  >
                    <RotateCcw className="size-3.5" />
                    Restart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={handleHealthCheck}
                    disabled={healthChecking}
                  >
                    {healthChecking ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Heart className="size-3.5" />
                    )}
                    Health Check
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gateway Configuration */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="size-4 text-amber-600" />
                    Gateway Configuration
                  </CardTitle>
                  {!isEditingConfig ? (
                    <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" onClick={() => { setEditConfig(openclawGateway.config); setIsEditingConfig(true); }}>
                      <Pencil className="size-3" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsEditingConfig(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs gap-1" onClick={handleSaveConfig}>
                        <Save className="size-3" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Auth Mode</Label>
                    {isEditingConfig ? (
                      <Select value={editConfig.authMode} onValueChange={(v) => setEditConfig(prev => ({ ...prev, authMode: v as OpenClawGateway['config']['authMode'] }))}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shared_secret">Shared Secret</SelectItem>
                          <SelectItem value="trusted_proxy">Trusted Proxy</SelectItem>
                          <SelectItem value="loopback_only">Loopback Only</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium">{openclawGateway.config.authMode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Log Level</Label>
                    {isEditingConfig ? (
                      <Select value={editConfig.logLevel} onValueChange={(v) => setEditConfig(prev => ({ ...prev, logLevel: v as OpenClawGateway['config']['logLevel'] }))}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium">{openclawGateway.config.logLevel.toUpperCase()}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Max Sessions</Label>
                    {isEditingConfig ? (
                      <Input type="number" value={editConfig.maxSessions} onChange={(e) => setEditConfig(prev => ({ ...prev, maxSessions: parseInt(e.target.value) || 1 }))} className="h-9 text-sm" />
                    ) : (
                      <p className="text-sm font-medium">{openclawGateway.config.maxSessions}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Session Timeout (minutes)</Label>
                    {isEditingConfig ? (
                      <Input type="number" value={editConfig.sessionTimeout} onChange={(e) => setEditConfig(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 1 }))} className="h-9 text-sm" />
                    ) : (
                      <p className="text-sm font-medium">{openclawGateway.config.sessionTimeout} min</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2: CHANNELS
        ══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="channels" className="flex-1 mt-3 min-h-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
                <Wifi className="size-3" />
                {connectedChannels} connected
              </Badge>
              <Badge className="bg-red-500/15 text-red-600 border-red-500/25 gap-1">
                <WifiOff className="size-3" />
                {openclawChannels.filter(c => c.status === 'disconnected' || c.status === 'error').length} offline
              </Badge>
            </div>
            <Dialog open={addChannelOpen} onOpenChange={setAddChannelOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <Plus className="size-3.5" />
                  Add Channel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Channel</DialogTitle>
                  <DialogDescription>Connect a new messaging platform to OpenClaw</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={newChannelType} onValueChange={(v) => setNewChannelType(v as OpenClawChannelType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ALL_CHANNEL_TYPES.map(type => {
                          const cfg = CHANNEL_TYPE_CONFIG[type];
                          const Icon = cfg.icon;
                          return (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <Icon className={cn('size-3.5', cfg.color)} />
                                {cfg.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="e.g., WhatsApp Business (+60...)" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddChannelOpen(false)}>Cancel</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5" onClick={handleAddChannel} disabled={!newChannelName.trim()}>
                    <Plus className="size-3.5" />
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="flex-1 max-h-[calc(100vh-320px)]">
            {openclawChannels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-1">
                <AnimatePresence mode="popLayout">
                  {openclawChannels.map((channel, i) => {
                    const cfg = CHANNEL_TYPE_CONFIG[channel.type];
                    const statusCfg = CHANNEL_STATUS_CONFIG[channel.status];
                    const Icon = cfg.icon;
                    const StatusIcon = statusCfg.icon;
                    return (
                      <motion.div
                        key={channel.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                      >
                        <Card
                          className="group cursor-pointer hover:shadow-md transition-all border-l-4"
                          style={{ borderLeftColor: cfg.cardAccent }}
                          onClick={() => { setSelectedChannel(channel); setChannelDetailOpen(true); }}
                        >
                          <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={cn('flex items-center justify-center size-8 rounded-lg', cfg.bg, cfg.color)}>
                                  <Icon className="size-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold leading-tight">{cfg.label}</p>
                                  <p className="text-xs text-muted-foreground truncate max-w-36">{channel.name.replace(`${cfg.label} `, '')}</p>
                                </div>
                              </div>
                              <Badge className={cn('gap-1 text-[10px]', statusCfg.badgeBg, statusCfg.badgeText, statusCfg.badgeBorder)}>
                                <StatusIcon className={cn('size-2.5', channel.status === 'connecting' ? 'animate-spin' : '')} />
                                {statusCfg.label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="px-4 pb-4 pt-1 space-y-2">
                            {channel.lastMessage && (
                              <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
                                <p className="text-xs text-muted-foreground truncate">
                                  {channel.lastMessage}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Activity className="size-3" />
                                {channel.messageCount.toLocaleString()} messages
                              </span>
                              {channel.pairedAt && (
                                <span className="flex items-center gap-1">
                                  <Clock className="size-3" />
                                  Paired {formatRelativeTime(channel.pairedAt)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="size-4 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                  <MessageCircle className="size-8 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium">No channels configured</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Add a channel to start messaging</p>
              </motion.div>
            )}
          </ScrollArea>

          {/* Channel Detail Dialog */}
          <Dialog open={channelDetailOpen} onOpenChange={setChannelDetailOpen}>
            <DialogContent className="sm:max-w-lg">
              {selectedChannel && (() => {
                const cfg = CHANNEL_TYPE_CONFIG[selectedChannel.type];
                const statusCfg = CHANNEL_STATUS_CONFIG[selectedChannel.status];
                const Icon = cfg.icon;
                return (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <div className={cn('flex items-center justify-center size-8 rounded-lg', cfg.bg, cfg.color)}>
                          <Icon className="size-4" />
                        </div>
                        {selectedChannel.name}
                      </DialogTitle>
                      <DialogDescription>
                        <Badge className={cn('gap-1 mt-1', statusCfg.badgeBg, statusCfg.badgeText, statusCfg.badgeBorder)}>
                          {statusCfg.label}
                        </Badge>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">Platform</p>
                          <p className="text-sm font-medium">{cfg.label}</p>
                        </div>
                        <div className="rounded-lg border p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">Messages</p>
                          <p className="text-sm font-medium">{selectedChannel.messageCount.toLocaleString()}</p>
                        </div>
                        <div className="rounded-lg border p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">Paired</p>
                          <p className="text-sm font-medium">{selectedChannel.pairedAt ? new Date(selectedChannel.pairedAt).toLocaleDateString() : 'Not paired'}</p>
                        </div>
                        <div className="rounded-lg border p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">Last Message</p>
                          <p className="text-sm font-medium">{formatRelativeTime(selectedChannel.lastMessageAt)}</p>
                        </div>
                      </div>
                      {Object.keys(selectedChannel.config).length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-medium">Configuration</p>
                          <div className="rounded-lg border p-3 space-y-1.5">
                            {Object.entries(selectedChannel.config).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{key}</span>
                                <span className="font-mono text-xs">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => handleRemoveChannel(selectedChannel.id)}>
                        <Trash2 className="size-3.5" />
                        Remove Channel
                      </Button>
                    </DialogFooter>
                  </>
                );
              })()}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 3: PLUGINS
        ══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="plugins" className="flex-1 mt-3 min-h-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
                <CheckCircle2 className="size-3" />
                {enabledPlugins} enabled
              </Badge>
              <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
                <Package className="size-3" />
                {openclawPlugins.length} total
              </Badge>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.info('ClawHub marketplace coming soon!')}>
              <Store className="size-3.5" />
              Browse ClawHub
            </Button>
          </div>

          <ScrollArea className="flex-1 max-h-[calc(100vh-320px)]">
            {openclawPlugins.length > 0 ? (
              <div className="space-y-3 pr-1">
                <AnimatePresence mode="popLayout">
                  {openclawPlugins.map((plugin, i) => {
                    const sourceCfg = SOURCE_CONFIG[plugin.source] ?? SOURCE_CONFIG.local;
                    return (
                      <motion.div
                        key={plugin.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                      >
                        <Card className="hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={cn(
                                  'flex items-center justify-center size-9 rounded-lg shrink-0',
                                  plugin.status === 'enabled' ? 'bg-emerald-500/10' :
                                  plugin.status === 'available' ? 'bg-muted' :
                                  plugin.status === 'error' ? 'bg-red-500/10' :
                                  'bg-amber-500/10'
                                )}>
                                  <Package className={cn(
                                    'size-4',
                                    plugin.status === 'enabled' ? 'text-emerald-600' :
                                    plugin.status === 'available' ? 'text-muted-foreground' :
                                    plugin.status === 'error' ? 'text-red-600' :
                                    'text-amber-600'
                                  )} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold">{plugin.name}</p>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                                      v{plugin.version}
                                    </Badge>
                                    <Badge className={cn('text-[10px] px-1.5 py-0 h-4 gap-0.5', sourceCfg.bg, sourceCfg.color)}>
                                      {plugin.source === 'bundled' ? <Zap className="size-2.5" /> : plugin.source === 'clawhub' ? <Store className="size-2.5" /> : <Terminal className="size-2.5" />}
                                      {sourceCfg.label}
                                    </Badge>
                                    <Badge className={cn(
                                      'text-[10px] px-1.5 py-0 h-4 gap-0.5',
                                      plugin.status === 'enabled' ? 'bg-emerald-500/15 text-emerald-600' :
                                      plugin.status === 'disabled' ? 'bg-gray-500/15 text-gray-600' :
                                      plugin.status === 'error' ? 'bg-red-500/15 text-red-600' :
                                      plugin.status === 'installed' ? 'bg-amber-500/15 text-amber-600' :
                                      'bg-blue-500/15 text-blue-600'
                                    )}>
                                      {plugin.status === 'enabled' ? <CheckCircle2 className="size-2.5" /> :
                                       plugin.status === 'disabled' ? <XCircle className="size-2.5" /> :
                                       plugin.status === 'error' ? <AlertTriangle className="size-2.5" /> :
                                       plugin.status === 'installed' ? <Clock className="size-2.5" /> :
                                       <Plus className="size-2.5" />}
                                      {plugin.status.charAt(0).toUpperCase() + plugin.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">by {plugin.author}</p>
                                  <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">{plugin.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {plugin.capabilities.map(cap => {
                                      const capCfg = CAPABILITY_CONFIG[cap];
                                      return (
                                        <Badge key={cap} className={cn('text-[10px] px-1.5 py-0 h-4 gap-0.5', capCfg.bg, capCfg.color)}>
                                          {capCfg.label}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {plugin.status === 'available' && (
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs gap-1" onClick={() => handlePluginAction(plugin.id, 'install')}>
                                    <Plus className="size-3" />
                                    Install
                                  </Button>
                                )}
                                {plugin.status === 'installed' && (
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs gap-1" onClick={() => handlePluginAction(plugin.id, 'enable')}>
                                    <ToggleRight className="size-3" />
                                    Enable
                                  </Button>
                                )}
                                {plugin.status === 'enabled' && (
                                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handlePluginAction(plugin.id, 'disable')}>
                                    <ToggleLeft className="size-3" />
                                    Disable
                                  </Button>
                                )}
                                {plugin.status === 'disabled' && (
                                  <>
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs gap-1" onClick={() => handlePluginAction(plugin.id, 'enable')}>
                                      <ToggleRight className="size-3" />
                                      Enable
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 gap-1" onClick={() => handlePluginAction(plugin.id, 'uninstall')}>
                                      <Trash2 className="size-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                  <Package className="size-8 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium">No plugins found</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Browse ClawHub for available plugins</p>
              </motion.div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 4: DELEGATES
        ══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="delegates" className="flex-1 mt-3 min-h-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
                <Users className="size-3" />
                {activeDelegates} active
              </Badge>
            </div>
            <Dialog open={addDelegateOpen} onOpenChange={setAddDelegateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <UserPlus className="size-3.5" />
                  Add Delegate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Delegate</DialogTitle>
                  <DialogDescription>Create a new delegate agent with specified permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="e.g., Finance Bot" value={newDelegateName} onChange={(e) => setNewDelegateName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="bot@gangniaga.ai" value={newDelegateEmail} onChange={(e) => setNewDelegateEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input placeholder="GangNiaga Finance Assistant" value={newDelegateDisplayName} onChange={(e) => setNewDelegateDisplayName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <Select value={newDelegateTier} onValueChange={(v) => setNewDelegateTier(v as DelegateTier)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(TIER_CONFIG).map(([key, cfg]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span className={cn('size-2 rounded-full', cfg.badgeBg)} />
                              {cfg.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDelegateOpen(false)}>Cancel</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5" onClick={handleAddDelegate} disabled={!newDelegateName.trim() || !newDelegateEmail.trim()}>
                    <Plus className="size-3.5" />
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="flex-1 max-h-[calc(100vh-320px)]">
            {openclawDelegates.length > 0 ? (
              <div className="space-y-3 pr-1">
                <AnimatePresence mode="popLayout">
                  {openclawDelegates.map((delegate, i) => {
                    const tierCfg = TIER_CONFIG[delegate.tier];
                    return (
                      <motion.div
                        key={delegate.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                      >
                        <Card className="hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0">
                                  <Bot className={cn('size-5', delegate.status === 'active' ? 'text-emerald-600' : 'text-muted-foreground')} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold">{delegate.name}</p>
                                    <Badge className={cn('text-[10px] px-1.5 py-0 h-4 gap-0.5', tierCfg.badgeBg, tierCfg.badgeText, tierCfg.badgeBorder)}>
                                      {tierCfg.label}
                                    </Badge>
                                    <Badge className={cn(
                                      'text-[10px] px-1.5 py-0 h-4 gap-0.5',
                                      delegate.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' :
                                      delegate.status === 'inactive' ? 'bg-gray-500/15 text-gray-600' :
                                      delegate.status === 'suspended' ? 'bg-red-500/15 text-red-600' :
                                      'bg-amber-500/15 text-amber-600'
                                    )}>
                                      {delegate.status.charAt(0).toUpperCase() + delegate.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                    <Mail className="size-3" />
                                    {delegate.email}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{delegate.displayName}</p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MessageCircle className="size-3" />
                                      {delegate.channels.length} channels
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Activity className="size-3" />
                                      {delegate.tasksCompleted} tasks
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="size-3" />
                                      {delegate.principalName}
                                    </span>
                                  </div>
                                  {delegate.channels.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {delegate.channels.map(ch => {
                                        const chCfg = CHANNEL_TYPE_CONFIG[ch];
                                        const ChIcon = chCfg.icon;
                                        return (
                                          <Badge key={ch} className={cn('text-[10px] px-1.5 py-0 h-4 gap-0.5', chCfg.badgeBg, chCfg.badgeText, chCfg.badgeBorder)}>
                                            <ChIcon className="size-2.5" />
                                            {chCfg.label}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  )}
                                  {delegate.standingOrders.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Standing Orders</p>
                                      {delegate.standingOrders.map((order, idx) => (
                                        <p key={idx} className="text-xs text-muted-foreground/80 flex items-start gap-1.5">
                                          <ChevronRight className="size-3 mt-0.5 shrink-0 text-amber-500" />
                                          {order}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                  <Users className="size-8 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium">No delegates configured</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Add a delegate to manage channels on your behalf</p>
              </motion.div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 5: WEBHOOKS
        ══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="webhooks" className="flex-1 mt-3 min-h-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
              <Webhook className="size-3" />
              {openclawWebhooks.filter(w => w.status === 'active').length} active
            </Badge>
            <Dialog open={addWebhookOpen} onOpenChange={setAddWebhookOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <Plus className="size-3.5" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Webhook</DialogTitle>
                  <DialogDescription>Create a new webhook integration</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="e.g., Slack Notification" value={newWebhookName} onChange={(e) => setNewWebhookName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input placeholder="https://..." value={newWebhookUrl} onChange={(e) => setNewWebhookUrl(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Method</Label>
                      <Select value={newWebhookMethod} onValueChange={(v) => setNewWebhookMethod(v as 'POST' | 'GET' | 'PUT')}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Secret (optional)</Label>
                      <Input placeholder="whsec_..." value={newWebhookSecret} onChange={(e) => setNewWebhookSecret(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Events</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {WEBHOOK_EVENTS.map(event => (
                        <label key={event} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newWebhookEvents.includes(event)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewWebhookEvents(prev => [...prev, event]);
                              } else {
                                setNewWebhookEvents(prev => prev.filter(ev => ev !== event));
                              }
                            }}
                            className="rounded border-muted-foreground/30"
                          />
                          <span className="font-mono text-[11px]">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddWebhookOpen(false)}>Cancel</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5" onClick={handleAddWebhook} disabled={!newWebhookName.trim() || !newWebhookUrl.trim()}>
                    <Plus className="size-3.5" />
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="flex-1 max-h-[calc(100vh-320px)]">
            {openclawWebhooks.length > 0 ? (
              <div className="space-y-3 pr-1">
                <AnimatePresence mode="popLayout">
                  {openclawWebhooks.map((webhook, i) => (
                    <motion.div
                      key={webhook.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                    >
                      <Card className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={cn(
                                'flex items-center justify-center size-9 rounded-lg shrink-0',
                                webhook.status === 'active' ? 'bg-emerald-500/10' : webhook.status === 'error' ? 'bg-red-500/10' : 'bg-muted'
                              )}>
                                <Webhook className={cn(
                                  'size-4',
                                  webhook.status === 'active' ? 'text-emerald-600' : webhook.status === 'error' ? 'text-red-600' : 'text-muted-foreground'
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-semibold">{webhook.name}</p>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                                    {webhook.method}
                                  </Badge>
                                  <Badge className={cn(
                                    'text-[10px] px-1.5 py-0 h-4 gap-0.5',
                                    webhook.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' :
                                    webhook.status === 'error' ? 'bg-red-500/15 text-red-600' :
                                    'bg-gray-500/15 text-gray-600'
                                  )}>
                                    {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate max-w-md">
                                  <Link2 className="size-3 inline mr-1" />
                                  {webhook.url}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {webhook.events.map(ev => (
                                    <Badge key={ev} className="bg-amber-500/15 text-amber-600 border-amber-500/25 text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                      <Zap className="size-2.5" />
                                      {ev}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Activity className="size-3" />
                                    {webhook.triggerCount} triggers
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    Last: {formatRelativeTime(webhook.lastTriggered)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleTestWebhook(webhook.id)}>
                                <Zap className="size-3" />
                                Test
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 gap-1" onClick={() => setDeleteWebhookId(webhook.id)}>
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                  <Webhook className="size-8 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium">No webhooks configured</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Add a webhook to receive event notifications</p>
              </motion.div>
            )}
          </ScrollArea>

          {/* Delete Webhook Confirm */}
          <AlertDialog open={!!deleteWebhookId} onOpenChange={() => setDeleteWebhookId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Webhook?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove the webhook integration. Any events configured for this endpoint will no longer be delivered.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteWebhook}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 6: AUTOMATION
        ══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="automation" className="flex-1 mt-3 min-h-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
                <CalendarClock className="size-3" />
                {activeTasks} active
              </Badge>
            </div>
            <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <Plus className="size-3.5" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Scheduled Task</DialogTitle>
                  <DialogDescription>Create a new cron-based automation task</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="e.g., Daily KPI Summary" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cron Expression</Label>
                    <Input placeholder="0 9 * * *" value={newTaskCron} onChange={(e) => setNewTaskCron(e.target.value)} />
                    {newTaskCron.trim() && (
                      <p className="text-xs text-muted-foreground">
                        {cronToHuman(newTaskCron.trim())}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Prompt</Label>
                    <Input placeholder="What should the agent do?" value={newTaskPrompt} onChange={(e) => setNewTaskPrompt(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Channel (optional)</Label>
                    <Select value={newTaskChannel} onValueChange={(v) => setNewTaskChannel(v as OpenClawChannelType | '')}>
                      <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {ALL_CHANNEL_TYPES.map(type => {
                          const cfg = CHANNEL_TYPE_CONFIG[type];
                          const Icon = cfg.icon;
                          return (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <Icon className={cn('size-3.5', cfg.color)} />
                                {cfg.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5" onClick={handleAddTask} disabled={!newTaskName.trim() || !newTaskCron.trim()}>
                    <Plus className="size-3.5" />
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="flex-1 max-h-[calc(100vh-320px)]">
            {openclawScheduledTasks.length > 0 ? (
              <div className="space-y-3 pr-1">
                <AnimatePresence mode="popLayout">
                  {openclawScheduledTasks.map((task, i) => {
                    const chCfg = task.channel ? CHANNEL_TYPE_CONFIG[task.channel] : null;
                    const ChIcon = chCfg?.icon ?? null;
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                      >
                        <Card className="hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={cn(
                                  'flex items-center justify-center size-9 rounded-lg shrink-0',
                                  task.status === 'active' ? 'bg-emerald-500/10' :
                                  task.status === 'paused' ? 'bg-amber-500/10' :
                                  task.status === 'error' ? 'bg-red-500/10' :
                                  'bg-gray-500/10'
                                )}>
                                  <CalendarClock className={cn(
                                    'size-4',
                                    task.status === 'active' ? 'text-emerald-600' :
                                    task.status === 'paused' ? 'text-amber-600' :
                                    task.status === 'error' ? 'text-red-600' :
                                    'text-gray-600'
                                  )} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold">{task.name}</p>
                                    <Badge className={cn(
                                      'text-[10px] px-1.5 py-0 h-4 gap-0.5',
                                      task.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' :
                                      task.status === 'paused' ? 'bg-amber-500/15 text-amber-600' :
                                      task.status === 'error' ? 'bg-red-500/15 text-red-600' :
                                      'bg-gray-500/15 text-gray-600'
                                    )}>
                                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                                      {task.cronExpression}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {cronToHuman(task.cronExpression)}
                                    </span>
                                  </div>
                                  {task.prompt && (
                                    <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-1">{task.prompt}</p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    {ChIcon && chCfg && (
                                      <span className="flex items-center gap-1">
                                        <ChIcon className={cn('size-3', chCfg.color)} />
                                        {chCfg.label}
                                      </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                      <Activity className="size-3" />
                                      {task.runCount} runs
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="size-3" />
                                      Last: {formatRelativeTime(task.lastRun)}
                                    </span>
                                    {task.nextRun && (
                                      <span className="flex items-center gap-1">
                                        <CalendarClock className="size-3" />
                                        Next: {formatRelativeTime(task.nextRun)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {task.status === 'active' && (
                                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleToggleTask(task.id, 'active')}>
                                    <Pause className="size-3" />
                                    Pause
                                  </Button>
                                )}
                                {task.status === 'paused' && (
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs gap-1" onClick={() => handleToggleTask(task.id, 'paused')}>
                                    <Play className="size-3" />
                                    Resume
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 gap-1" onClick={() => handleDeleteTask(task.id)}>
                                  <Trash2 className="size-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
                  <CalendarClock className="size-8 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium">No scheduled tasks</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Create a cron task to automate repetitive work</p>
              </motion.div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 7: SOUL.md
        ══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="soul" className="flex-1 mt-3 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor */}
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="size-4 text-amber-600" />
                      SOUL.md Editor
                    </CardTitle>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={handleResetSoul}>
                        <ResetIcon className="size-3" />
                        Reset
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs gap-1" onClick={handleSaveSoul}>
                        <Save className="size-3" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Personality</Label>
                    <Input
                      value={soulDraft.personality}
                      onChange={(e) => setSoulDraft(prev => ({ ...prev, personality: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Tone</Label>
                    <Input
                      value={soulDraft.tone}
                      onChange={(e) => setSoulDraft(prev => ({ ...prev, tone: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Language</Label>
                    <Input
                      value={soulDraft.language}
                      onChange={(e) => setSoulDraft(prev => ({ ...prev, language: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Specialty</Label>
                    <Input
                      value={soulDraft.specialty}
                      onChange={(e) => setSoulDraft(prev => ({ ...prev, specialty: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Greeting</Label>
                    <Input
                      value={soulDraft.greeting}
                      onChange={(e) => setSoulDraft(prev => ({ ...prev, greeting: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </div>

                  <Separator />

                  {/* Rules */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Rules</Label>
                    <div className="space-y-2">
                      {soulDraft.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-2 group">
                          <span className="text-xs text-muted-foreground mt-1.5 shrink-0 w-4">{idx + 1}.</span>
                          <p className="text-sm flex-1 leading-relaxed">{rule}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity shrink-0"
                            onClick={() => handleRemoveRule(idx)}
                          >
                            <XCircle className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a new rule..."
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        className="h-8 text-xs"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddRule(); }}
                      />
                      <Button size="sm" variant="outline" className="h-8 gap-1 shrink-0" onClick={handleAddRule} disabled={!newRule.trim()}>
                        <Plus className="size-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview */}
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="size-4 text-teal-600" />
                    SOUL.md Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[calc(100vh-340px)] overflow-y-auto">
                    {soulPreview.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return <p key={i} className="text-emerald-600 font-bold text-sm">{line}</p>;
                      }
                      if (line.startsWith('## ')) {
                        return <p key={i} className="text-amber-600 font-semibold mt-3 first:mt-0">{line}</p>;
                      }
                      if (line.match(/^\d+\./)) {
                        return <p key={i} className="text-muted-foreground pl-2">{line}</p>;
                      }
                      return <p key={i} className="text-foreground">{line}</p>;
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
