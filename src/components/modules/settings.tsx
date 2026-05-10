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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [activeTab, setActiveTab] = useState('profile');
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
  };

  const tabConfig = [
    { value: 'profile', label: 'Profile', icon: <User className="size-4" /> },
    { value: 'organization', label: 'Organization', icon: <Building2 className="size-4" /> },
    { value: 'security', label: 'Security', icon: <Shield className="size-4" /> },
    { value: 'appearance', label: 'Appearance', icon: <Palette className="size-4" /> },
    { value: 'integrations', label: 'Integrations', icon: <Globe className="size-4" /> },
    { value: 'notifications', label: 'Notifications', icon: <Bell className="size-4" /> },
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
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                        <Save className="size-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Organization Tab ─────────────────────────────────────────── */}
            {activeTab === 'organization' && (
              <motion.div key="organization" {...fadeIn} className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="size-4 text-emerald-600" />
                      Organization Details
                    </CardTitle>
                    <CardDescription>Manage your organization&apos;s information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Organization Name */}
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input
                        id="orgName"
                        defaultValue="GangNiaga Sdn Bhd"
                        className="border-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                      <Label>Industry</Label>
                      <Select defaultValue="saas">
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
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Company Size */}
                    <div className="space-y-2">
                      <Label>Company Size</Label>
                      <Select defaultValue="11-50">
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

                    {/* Country */}
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select defaultValue="my">
                        <SelectTrigger className="border-emerald-500/20 focus:border-emerald-500">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="my">Malaysia</SelectItem>
                          <SelectItem value="sg">Singapore</SelectItem>
                          <SelectItem value="id">Indonesia</SelectItem>
                          <SelectItem value="th">Thailand</SelectItem>
                          <SelectItem value="ph">Philippines</SelectItem>
                          <SelectItem value="vn">Vietnam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label>Organization Slug</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md border border-emerald-500/20 bg-muted/40 px-3 py-2 text-sm text-muted-foreground font-mono">
                          gangniaga-sdn-bhd
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Auto-generated
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Used in URLs and API references</p>
                    </div>

                    {/* Save */}
                    <div className="flex justify-end pt-2">
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                        <Save className="size-4" />
                        Save
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
                          {/* Preview card */}
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
                                    <div className="mt-2">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}

export default SettingsModule;
