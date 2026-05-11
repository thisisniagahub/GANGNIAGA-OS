'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Settings,
  User,
  Building2,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Monitor,
  Moon,
  Sun,
  Save,
  Camera,
  CheckCircle2,
  Link2,
  Unlink,
  Clock,
  AlertTriangle,
  LogOut,
  Fingerprint,
  Mail,
  FileText,
  BarChart3,
  DollarSign,
  MessageSquare,
  Hash,
  Send,
  Layout,
  Sparkles,
  Cpu,
  Zap,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Integration {
  id: string;
  name: string;
  category: 'accounting' | 'communication' | 'analytics';
  icon: React.ReactNode;
  status: 'connected' | 'available';
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const integrations: Integration[] = [
  { id: 'quickbooks', name: 'QuickBooks', category: 'accounting', icon: <DollarSign className="size-5" />, status: 'connected' },
  { id: 'xero', name: 'Xero', category: 'accounting', icon: <BarChart3 className="size-5" />, status: 'available' },
  { id: 'stripe', name: 'Stripe', category: 'accounting', icon: <DollarSign className="size-5" />, status: 'connected' },
  { id: 'paypal', name: 'PayPal', category: 'accounting', icon: <DollarSign className="size-5" />, status: 'available' },
  { id: 'slack', name: 'Slack', category: 'communication', icon: <Hash className="size-5" />, status: 'connected' },
  { id: 'telegram', name: 'Telegram', category: 'communication', icon: <Send className="size-5" />, status: 'available' },
  { id: 'discord', name: 'Discord', category: 'communication', icon: <MessageSquare className="size-5" />, status: 'available' },
  { id: 'email', name: 'Email', category: 'communication', icon: <Mail className="size-5" />, status: 'connected' },
  { id: 'google-analytics', name: 'Google Analytics', category: 'analytics', icon: <BarChart3 className="size-5" />, status: 'available' },
  { id: 'mixpanel', name: 'Mixpanel', category: 'analytics', icon: <BarChart3 className="size-5" />, status: 'available' },
  { id: 'posthog', name: 'PostHog', category: 'analytics', icon: <BarChart3 className="size-5" />, status: 'connected' },
];

const sessions = [
  { id: '1', device: 'Chrome on macOS', location: 'Kuala Lumpur, MY', lastActive: 'Active now', current: true },
  { id: '2', device: 'Safari on iPhone', location: 'Kuala Lumpur, MY', lastActive: '2 hours ago', current: false },
  { id: '3', device: 'Firefox on Windows', location: 'Singapore, SG', lastActive: '1 day ago', current: false },
];

const ASEAN_COUNTRIES = [
  { value: 'my', label: 'Malaysia' },
  { value: 'sg', label: 'Singapore' },
  { value: 'id', label: 'Indonesia' },
  { value: 'th', label: 'Thailand' },
  { value: 'ph', label: 'Philippines' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'mm', label: 'Myanmar' },
  { value: 'kh', label: 'Cambodia' },
  { value: 'la', label: 'Laos' },
  { value: 'bn', label: 'Brunei' },
];

const AI_MODELS = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-ultra', label: 'Gemini Ultra' },
];

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.04 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

// ─── Component ──────────────────────────────────────────────────────────────

export function SettingsModule() {
  const { integrations: storeIntegrations, updateIntegration } = useAppStore();

  const [activeTab, setActiveTab] = useState('company');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [density, setDensity] = useState<'compact' | 'normal' | 'comfortable'>('normal');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [notifications, setNotifications] = useState({
    agentTaskCompletion: true,
    workflowStatusChanges: true,
    financialAlerts: true,
    reportGeneration: false,
    weeklySummaries: true,
  });
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(
    new Set(integrations.filter((i) => i.status === 'connected').map((i) => i.id))
  );

  // ── Company Profile ──
  const [companyProfile, setCompanyProfile] = useState({
    name: 'GangNiaga Sdn Bhd',
    industry: 'saas',
    country: 'my',
    size: '11-50',
  });

  // ── Sync Frequency per integration ──
  const [syncFrequencies, setSyncFrequencies] = useState<Record<string, 'daily' | 'weekly' | 'monthly'>>({
    quickbooks: 'monthly',
    xero: 'monthly',
    stripe: 'weekly',
    paypal: 'monthly',
  });

  // ── Notification Preferences ──
  const [varianceThreshold, setVarianceThreshold] = useState(15);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<'critical_only' | 'warning_and_above' | 'all'>('warning_and_above');

  // ── AI Model Settings ──
  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4',
    verbosity: 'balanced' as 'concise' | 'balanced' | 'detailed',
    autoGenerate: true,
  });

  const toggleIntegration = (id: string) => {
    setConnectedIntegrations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    // Update the Zustand store for QuickBooks and Xero
    if (id === 'quickbooks' || id === 'xero') {
      const integrationType = id as 'quickbooks' | 'xero';
      const storeIntegration = storeIntegrations.find((i) => i.type === integrationType);
      const isConnected = connectedIntegrations.has(id);
      if (isConnected) {
        // Currently connected, disconnecting
        updateIntegration(integrationType, { status: 'disconnected', lastSync: null });
        toast.info(`${id === 'quickbooks' ? 'QuickBooks' : 'Xero'} disconnected`, {
          description: 'Data sync has been paused.',
        });
      } else {
        // Currently disconnected, connecting
        updateIntegration(integrationType, {
          status: 'connected',
          lastSync: new Date().toISOString(),
          syncFrequency: syncFrequencies[id] || 'monthly',
        });
        toast.success(`${id === 'quickbooks' ? 'QuickBooks' : 'Xero'} connected`, {
          description: 'Data sync is now active.',
        });
      }
    }
  };

  const handleSyncFrequencyChange = (id: string, frequency: 'daily' | 'weekly' | 'monthly') => {
    setSyncFrequencies((prev) => ({ ...prev, [id]: frequency }));
    // Update store for QuickBooks and Xero
    if (id === 'quickbooks' || id === 'xero') {
      updateIntegration(id as 'quickbooks' | 'xero', { syncFrequency: frequency });
      toast.success('Sync frequency updated', { description: `${id === 'quickbooks' ? 'QuickBooks' : 'Xero'} will sync ${frequency}.` });
    }
  };

  const handleSaveCompanyProfile = () => {
    toast.success('Company profile saved', {
      description: `${companyProfile.name} profile has been updated.`,
    });
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved', {
      description: `Variance threshold: ${varianceThreshold}%, Severity: ${alertSeverityFilter === 'critical_only' ? 'Critical only' : alertSeverityFilter === 'warning_and_above' ? 'Warning & above' : 'All alerts'}`,
    });
  };

  const handleSaveAiSettings = () => {
    toast.success('AI settings saved', {
      description: `Model: ${AI_MODELS.find((m) => m.value === aiSettings.model)?.label}, Verbosity: ${aiSettings.verbosity}`,
    });
  };

  const tabConfig = [
    { value: 'company', label: 'Company', icon: <Building2 className="size-4" /> },
    { value: 'profile', label: 'Profile', icon: <User className="size-4" /> },
    { value: 'security', label: 'Security', icon: <Shield className="size-4" /> },
    { value: 'appearance', label: 'Appearance', icon: <Palette className="size-4" /> },
    { value: 'integrations', label: 'Integrations', icon: <Globe className="size-4" /> },
    { value: 'notifications', label: 'Notifications', icon: <Bell className="size-4" /> },
    { value: 'ai', label: 'AI', icon: <Sparkles className="size-4" /> },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
          <Settings className="size-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full sm:w-auto flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg">
          {tabConfig.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-1.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs sm:text-sm"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 mt-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <AnimatePresence mode="wait">

            {/* ── Company Profile Tab ──────────────────────────────────────── */}
            {activeTab === 'company' && (
              <motion.div key="company" {...fadeIn} className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="size-4 text-emerald-600" />
                      Company Profile
                    </CardTitle>
                    <CardDescription>Your organization&apos;s information used across all proposals and reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Company Name */}
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={companyProfile.name}
                        onChange={(e) => setCompanyProfile((prev) => ({ ...prev, name: e.target.value }))}
                        className="border-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                      <Label>Industry</Label>
                      <Select
                        value={companyProfile.industry}
                        onValueChange={(v) => setCompanyProfile((prev) => ({ ...prev, industry: v }))}
                      >
                        <SelectTrigger className="border-emerald-500/20 focus:border-emerald-500">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS / Software</SelectItem>
                          <SelectItem value="fintech">Fintech</SelectItem>
                          <SelectItem value="ecommerce">E-Commerce</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="realestate">Real Estate</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="fandb">Food & Beverage</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select
                        value={companyProfile.country}
                        onValueChange={(v) => setCompanyProfile((prev) => ({ ...prev, country: v }))}
                      >
                        <SelectTrigger className="border-emerald-500/20 focus:border-emerald-500">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {ASEAN_COUNTRIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Company Size */}
                    <div className="space-y-2">
                      <Label>Company Size</Label>
                      <Select
                        value={companyProfile.size}
                        onValueChange={(v) => setCompanyProfile((prev) => ({ ...prev, size: v }))}
                      >
                        <SelectTrigger className="border-emerald-500/20 focus:border-emerald-500">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1–10 employees</SelectItem>
                          <SelectItem value="11-50">11–50 employees</SelectItem>
                          <SelectItem value="51-200">51–200 employees</SelectItem>
                          <SelectItem value="201-500">201–500 employees</SelectItem>
                          <SelectItem value="501-1000">501–1,000 employees</SelectItem>
                          <SelectItem value="1000+">1,000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Summary */}
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Company Summary</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>Company:</span>
                        <span className="font-medium text-foreground">{companyProfile.name}</span>
                        <span>Industry:</span>
                        <span className="font-medium text-foreground capitalize">{companyProfile.industry === 'fandb' ? 'Food & Beverage' : companyProfile.industry === 'saas' ? 'SaaS / Software' : companyProfile.industry}</span>
                        <span>Country:</span>
                        <span className="font-medium text-foreground">{ASEAN_COUNTRIES.find((c) => c.value === companyProfile.country)?.label}</span>
                        <span>Size:</span>
                        <span className="font-medium text-foreground">{companyProfile.size.replace('-', '–')} employees</span>
                      </div>
                    </div>

                    {/* Save */}
                    <div className="flex justify-end pt-2">
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                        onClick={handleSaveCompanyProfile}
                      >
                        <Save className="size-4" />
                        Save Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Profile Tab ──────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
              <motion.div key="profile" {...fadeIn} className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="size-4 text-emerald-600" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal details and avatar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <Avatar className="size-20 border-2 border-emerald-500/30">
                          <AvatarImage src="" alt="User avatar" />
                          <AvatarFallback className="bg-emerald-500/10 text-emerald-700 text-xl font-semibold">
                            AK
                          </AvatarFallback>
                        </Avatar>
                        <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="size-5 text-white" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Profile Photo</p>
                        <p className="text-xs text-muted-foreground">Click the avatar to upload a new photo</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Amir" className="border-emerald-500/20 focus:border-emerald-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Khairuddin" className="border-emerald-500/20 focus:border-emerald-500" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="amir@gangniaga.com"
                        className="border-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    {/* Role Badge */}
                    <div className="flex items-center gap-3">
                      <Label>Role</Label>
                      <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 gap-1.5">
                        <Key className="size-3" />
                        Administrator
                      </Badge>
                    </div>

                    {/* Save */}
                    <div className="flex justify-end pt-2">
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                        onClick={() => toast.success('Profile saved', { description: 'Your profile information has been updated.' })}
                      >
                        <Save className="size-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Security Tab ─────────────────────────────────────────────── */}
            {activeTab === 'security' && (
              <motion.div key="security" {...fadeIn} className="space-y-6 max-w-2xl">
                {/* MFA */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Fingerprint className="size-4 text-emerald-600" />
                      Multi-Factor Authentication
                    </CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Enable MFA</p>
                        <p className="text-xs text-muted-foreground">
                          Require a verification code in addition to your password
                        </p>
                      </div>
                      <Switch
                        checked={mfaEnabled}
                        onCheckedChange={setMfaEnabled}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                    {mfaEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                          <p className="text-sm font-medium text-emerald-700">MFA is enabled</p>
                          <p className="text-xs text-muted-foreground">
                            Your account is protected with an authenticator app.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Login Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Bell className="size-4 text-amber-600" />
                      Login Notifications
                    </CardTitle>
                    <CardDescription>Get notified about login activity on your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Email login alerts</p>
                        <p className="text-xs text-muted-foreground">
                          Receive an email when a new device logs into your account
                        </p>
                      </div>
                      <Switch
                        checked={loginNotifications}
                        onCheckedChange={setLoginNotifications}
                        className="data-[state=checked]:bg-amber-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Session Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Monitor className="size-4 text-emerald-600" />
                      Session Management
                    </CardTitle>
                    <CardDescription>Manage your active sessions and devices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sessions.map((session, i) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center justify-between gap-3 rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex items-center justify-center size-9 rounded-lg flex-shrink-0 ${
                              session.current ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <Monitor className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{session.device}</p>
                              {session.current && (
                                <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 text-[10px] px-1.5 py-0">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Globe className="size-3" />
                              {session.location} · {session.lastActive}
                            </p>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 gap-1 flex-shrink-0"
                          >
                            <LogOut className="size-3.5" />
                            <span className="hidden sm:inline">Revoke</span>
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Audit Log */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="size-4 text-amber-600" />
                      Audit Log
                    </CardTitle>
                    <CardDescription>Review account activity and changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-6 text-center">
                      <AlertTriangle className="size-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-amber-700">Audit log coming soon</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        We&apos;re building a comprehensive audit trail for all account activity
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Appearance Tab ───────────────────────────────────────────── */}
            {activeTab === 'appearance' && (
              <motion.div key="appearance" {...fadeIn} className="space-y-6 max-w-2xl">
                {/* Theme */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Palette className="size-4 text-emerald-600" />
                      Theme
                    </CardTitle>
                    <CardDescription>Choose your preferred appearance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light' as const, label: 'Light', icon: <Sun className="size-5" />, preview: 'bg-white border-gray-200' },
                        { value: 'dark' as const, label: 'Dark', icon: <Moon className="size-5" />, preview: 'bg-gray-900 border-gray-700' },
                        { value: 'system' as const, label: 'System', icon: <Monitor className="size-5" />, preview: 'bg-gradient-to-br from-white to-gray-900 border-gray-400' },
                      ].map((opt) => (
                        <motion.button
                          key={opt.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTheme(opt.value)}
                          className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                            theme === opt.value
                              ? 'border-emerald-500 shadow-md shadow-emerald-500/10'
                              : 'border-transparent hover:border-emerald-500/30'
                          }`}
                        >
                          <div
                            className={`mx-auto mb-3 h-16 w-full rounded-lg border ${opt.preview} flex items-center justify-center`}
                          >
                            <div
                              className={`${
                                opt.value === 'dark' ? 'text-gray-300' : opt.value === 'system' ? 'text-gray-600' : 'text-gray-600'
                              }`}
                            >
                              {opt.icon}
                            </div>
                          </div>
                          <p className="text-sm font-medium">{opt.label}</p>
                          {theme === opt.value && (
                            <motion.div
                              layoutId="theme-check"
                              className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-5 rounded-full bg-emerald-600 text-white"
                            >
                              <CheckCircle2 className="size-3" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sidebar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Layout className="size-4 text-amber-600" />
                      Sidebar
                    </CardTitle>
                    <CardDescription>Customize sidebar behavior</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Collapsed by default</p>
                        <p className="text-xs text-muted-foreground">
                          Start with a compact sidebar that expands on hover
                        </p>
                      </div>
                      <Switch
                        checked={sidebarCollapsed}
                        onCheckedChange={setSidebarCollapsed}
                        className="data-[state=checked]:bg-amber-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Density */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="size-4 text-emerald-600" />
                      Interface Density
                    </CardTitle>
                    <CardDescription>Adjust spacing and compactness of the UI</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'compact' as const, label: 'Compact', desc: 'Tighter spacing' },
                        { value: 'normal' as const, label: 'Normal', desc: 'Balanced spacing' },
                        { value: 'comfortable' as const, label: 'Comfortable', desc: 'Relaxed spacing' },
                      ].map((opt) => (
                        <motion.button
                          key={opt.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setDensity(opt.value)}
                          className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                            density === opt.value
                              ? 'border-emerald-500 shadow-md shadow-emerald-500/10'
                              : 'border-transparent hover:border-emerald-500/30 bg-muted/30'
                          }`}
                        >
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                          {density === opt.value && (
                            <motion.div
                              layoutId="density-check"
                              className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-5 rounded-full bg-emerald-600 text-white"
                            >
                              <CheckCircle2 className="size-3" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Integrations Tab ─────────────────────────────────────────── */}
            {activeTab === 'integrations' && (
              <motion.div key="integrations" {...fadeIn} className="space-y-6">
                {(['accounting', 'communication', 'analytics'] as const).map((category) => {
                  const items = integrations.filter((i) => i.category === category);
                  const categoryLabel = {
                    accounting: 'Accounting & Payments',
                    communication: 'Communication',
                    analytics: 'Analytics',
                  }[category];
                  const categoryIcon = {
                    accounting: <DollarSign className="size-4" />,
                    communication: <MessageSquare className="size-4" />,
                    analytics: <BarChart3 className="size-4" />,
                  }[category];
                  const categoryColor = {
                    accounting: 'text-emerald-600 bg-emerald-500/10',
                    communication: 'text-amber-600 bg-amber-500/10',
                    analytics: 'text-rose-600 bg-rose-500/10',
                  }[category];

                  return (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <span className={`flex items-center justify-center size-7 rounded-lg ${categoryColor}`}>
                            {categoryIcon}
                          </span>
                          {categoryLabel}
                        </CardTitle>
                        <CardDescription>
                          {items.filter((i) => connectedIntegrations.has(i.id)).length} of {items.length} connected
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                          variants={staggerContainer}
                          initial="initial"
                          animate="animate"
                        >
                          {items.map((integration) => {
                            const isConnected = connectedIntegrations.has(integration.id);
                            const isAccountingIntegration = category === 'accounting';
                            return (
                              <motion.div
                                key={integration.id}
                                variants={staggerItem}
                                transition={{ duration: 0.2 }}
                                className={`rounded-lg border p-3 transition-colors ${
                                  isConnected ? 'border-emerald-500/30 bg-emerald-500/5' : 'bg-card hover:bg-muted/40'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`flex items-center justify-center size-10 rounded-lg flex-shrink-0 ${
                                      isConnected
                                        ? 'bg-emerald-500/10 text-emerald-600'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    {integration.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium truncate">{integration.name}</p>
                                      <Badge
                                        className={`text-[10px] px-1.5 py-0 ${
                                          isConnected
                                            ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25'
                                            : 'bg-amber-500/15 text-amber-700 border-amber-500/25'
                                        }`}
                                      >
                                        {isConnected ? 'Connected' : 'Available'}
                                      </Badge>
                                    </div>
                                    <div className="mt-2 space-y-2">
                                      {/* Sync Frequency (only for accounting integrations when connected) */}
                                      {isAccountingIntegration && isConnected && (
                                        <div className="flex items-center gap-2">
                                          <Clock className="size-3 text-muted-foreground" />
                                          <Select
                                            value={syncFrequencies[integration.id] || 'monthly'}
                                            onValueChange={(v) => handleSyncFrequencyChange(integration.id, v as 'daily' | 'weekly' | 'monthly')}
                                          >
                                            <SelectTrigger className="h-6 text-[10px] w-[120px] border-emerald-500/20">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="daily">Daily</SelectItem>
                                              <SelectItem value="weekly">Weekly</SelectItem>
                                              <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      <Button
                                        size="sm"
                                        variant={isConnected ? 'outline' : 'default'}
                                        className={`gap-1.5 text-xs h-7 ${
                                          isConnected
                                            ? 'text-rose-600 border-rose-500/30 hover:bg-rose-500/10'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        }`}
                                        onClick={() => toggleIntegration(integration.id)}
                                      >
                                        {isConnected ? (
                                          <>
                                            <Unlink className="size-3" />
                                            Disconnect
                                          </>
                                        ) : (
                                          <>
                                            <Link2 className="size-3" />
                                            Connect
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </CardContent>
                    </Card>
                  );
                })}
              </motion.div>
            )}

            {/* ── Notifications Tab ────────────────────────────────────────── */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" {...fadeIn} className="space-y-6 max-w-2xl">
                {/* Variance Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertTriangle className="size-4 text-amber-600" />
                      Variance Alerts
                    </CardTitle>
                    <CardDescription>Configure when variance alerts are triggered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Variance Alert Threshold</p>
                          <p className="text-xs text-muted-foreground">Trigger alerts when actuals deviate from plan by this percentage</p>
                        </div>
                        <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/25 text-sm px-2.5 py-0.5">
                          {varianceThreshold}%
                        </Badge>
                      </div>
                      <Slider
                        value={[varianceThreshold]}
                        onValueChange={([v]) => setVarianceThreshold(v)}
                        min={5}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>5% (Sensitive)</span>
                        <span>30% (Tolerant)</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Alert Severity Filter</Label>
                      <Select
                        value={alertSeverityFilter}
                        onValueChange={(v) => setAlertSeverityFilter(v as 'critical_only' | 'warning_and_above' | 'all')}
                      >
                        <SelectTrigger className="border-emerald-500/20 focus:border-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical_only">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                              Critical only
                            </div>
                          </SelectItem>
                          <SelectItem value="warning_and_above">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              Warning & above
                            </div>
                          </SelectItem>
                          <SelectItem value="all">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              All alerts
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Only show alerts at or above the selected severity level</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Channels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Volume2 className="size-4 text-emerald-600" />
                      Notification Channels
                    </CardTitle>
                    <CardDescription>Choose how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10 flex-shrink-0 mt-0.5">
                          <Mail className="size-4 text-emerald-600" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Email notifications</p>
                          <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-amber-500/10 flex-shrink-0 mt-0.5">
                          <Bell className="size-4 text-amber-600" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Push notifications</p>
                          <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                        className="data-[state=checked]:bg-amber-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Toggles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Bell className="size-4 text-emerald-600" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Choose what you want to be notified about</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {[
                      {
                        key: 'agentTaskCompletion' as const,
                        label: 'Agent task completion',
                        desc: 'Get notified when an AI agent completes a task',
                        icon: <CheckCircle2 className="size-4 text-emerald-600" />,
                        color: 'data-[state=checked]:bg-emerald-600',
                      },
                      {
                        key: 'workflowStatusChanges' as const,
                        label: 'Workflow status changes',
                        desc: 'Receive updates when workflows start, pause, or complete',
                        icon: <Clock className="size-4 text-amber-600" />,
                        color: 'data-[state=checked]:bg-amber-600',
                      },
                      {
                        key: 'financialAlerts' as const,
                        label: 'Financial alerts',
                        desc: 'Important financial milestones and threshold alerts',
                        icon: <DollarSign className="size-4 text-emerald-600" />,
                        color: 'data-[state=checked]:bg-emerald-600',
                      },
                      {
                        key: 'reportGeneration' as const,
                        label: 'Report generation',
                        desc: 'Notify when a scheduled or manual report is ready',
                        icon: <FileText className="size-4 text-amber-600" />,
                        color: 'data-[state=checked]:bg-amber-600',
                      },
                      {
                        key: 'weeklySummaries' as const,
                        label: 'Weekly summaries',
                        desc: 'Receive a weekly digest of key metrics and activity',
                        icon: <BarChart3 className="size-4 text-emerald-600" />,
                        color: 'data-[state=checked]:bg-emerald-600',
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="flex items-center justify-between py-3">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center size-9 rounded-lg bg-muted flex-shrink-0 mt-0.5">
                              {item.icon}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications[item.key]}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                            }
                            className={item.color}
                          />
                        </div>
                        {i < 4 && <Separator />}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Save */}
                <div className="flex justify-end">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                    onClick={handleSaveNotifications}
                  >
                    <Save className="size-4" />
                    Save Preferences
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── AI Model Tab ─────────────────────────────────────────────── */}
            {activeTab === 'ai' && (
              <motion.div key="ai" {...fadeIn} className="space-y-6 max-w-2xl">
                {/* AI Model Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Cpu className="size-4 text-emerald-600" />
                      AI Model Configuration
                    </CardTitle>
                    <CardDescription>Configure which AI model powers your proposals and analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Default AI Model</Label>
                      <Select
                        value={aiSettings.model}
                        onValueChange={(v) => setAiSettings((prev) => ({ ...prev, model: v }))}
                      >
                        <SelectTrigger className="border-emerald-500/20 focus:border-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_MODELS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              <div className="flex items-center gap-2">
                                <Cpu className="size-3.5 text-muted-foreground" />
                                <span>{m.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">This model will be used for all AI-powered features unless overridden</p>
                    </div>

                    <Separator />

                    {/* Response Verbosity */}
                    <div className="space-y-3">
                      <Label>Response Verbosity</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'concise' as const, label: 'Concise', desc: 'Brief, to-the-point', icon: <Zap className="size-4 text-cyan-600" /> },
                          { value: 'balanced' as const, label: 'Balanced', desc: 'Moderate detail', icon: <Sparkles className="size-4 text-emerald-600" /> },
                          { value: 'detailed' as const, label: 'Detailed', desc: 'Comprehensive analysis', icon: <FileText className="size-4 text-amber-600" /> },
                        ].map((opt) => (
                          <motion.button
                            key={opt.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setAiSettings((prev) => ({ ...prev, verbosity: opt.value }))}
                            className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                              aiSettings.verbosity === opt.value
                                ? 'border-emerald-500 shadow-md shadow-emerald-500/10'
                                : 'border-transparent hover:border-emerald-500/30 bg-muted/30'
                            }`}
                          >
                            <div className="flex justify-center mb-2">{opt.icon}</div>
                            <p className="text-sm font-medium">{opt.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                            {aiSettings.verbosity === opt.value && (
                              <motion.div
                                layoutId="verbosity-check"
                                className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-5 rounded-full bg-emerald-600 text-white"
                              >
                                <CheckCircle2 className="size-3" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Auto-generate sections */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Auto-generate sections</p>
                        <p className="text-xs text-muted-foreground">
                          Automatically generate proposal sections when a new proposal is created
                        </p>
                      </div>
                      <Switch
                        checked={aiSettings.autoGenerate}
                        onCheckedChange={(checked) => setAiSettings((prev) => ({ ...prev, autoGenerate: checked }))}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* AI Usage Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="size-4 text-amber-600" />
                      AI Usage This Month
                    </CardTitle>
                    <CardDescription>Track your AI generation usage and remaining quota</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">47</p>
                        <p className="text-[10px] text-muted-foreground">Sections Generated</p>
                      </div>
                      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-400">12</p>
                        <p className="text-[10px] text-muted-foreground">AI Rewrites</p>
                      </div>
                      <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-center">
                        <p className="text-lg font-bold text-cyan-700 dark:text-cyan-400">141</p>
                        <p className="text-[10px] text-muted-foreground">Remaining Quota</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Save */}
                <div className="flex justify-end">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                    onClick={handleSaveAiSettings}
                  >
                    <Save className="size-4" />
                    Save AI Settings
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}

export default SettingsModule;
