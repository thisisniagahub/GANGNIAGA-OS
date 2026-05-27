import { INITIAL_MOCK_STATE } from './fixtures/mockData';
import { create } from 'zustand';
import type { ModuleId, ChatMessage, KPIData, ChartDataPoint, AgentInfo, TaskInfo, WorkflowInfo, MemoryEntry, BusinessPlanData, ReportData, IdeaCanvasData, PlanReviewData, PlanActualData, IntegrationData, VarianceAlert, PitchDeckData, CitationData, OpenClawChannel, OpenClawGateway, OpenClawPlugin, OpenClawDelegate, OpenClawWebhook, OpenClawScheduledTask, OpenClawSession, OpenClawSoulConfig, CopilotSkill, CopilotMemory } from './types';

interface AppState {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;  // also closes mobile menu
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  copilotOpen: boolean;
  toggleCopilot: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  chatLoading: boolean;
  setChatLoading: (loading: boolean) => void;

  // Copilot Skills & Memory
  copilotSkills: CopilotSkill[];
  setCopilotSkills: (skills: CopilotSkill[]) => void;
  copilotMemories: CopilotMemory[];
  setCopilotMemories: (memories: CopilotMemory[]) => void;
  voiceRecording: boolean;
  setVoiceRecording: (recording: boolean) => void;
  copilotInitialized: boolean;
  setCopilotInitialized: (initialized: boolean) => void;

  // Dashboard
  kpis: KPIData[];
  revenueData: ChartDataPoint[];
  expenseData: ChartDataPoint[];

  // Agents
  agents: AgentInfo[];
  selectedAgent: string | null;
  setSelectedAgent: (id: string | null) => void;
  agentTasks: TaskInfo[];

  // Workflows
  workflows: WorkflowInfo[];
  
  // Memory
  memories: MemoryEntry[];
  
  // Business Plans
  plans: BusinessPlanData[];
  selectedPlan: string | null;
  setSelectedPlan: (id: string | null) => void;
  
  // Reports
  reports: ReportData[];

  // Forecasts
  forecastData: ChartDataPoint[];

  // ── NEW: Idea Canvas ──
  ideaCanvases: IdeaCanvasData[];
  selectedIdea: string | null;
  setSelectedIdea: (id: string | null) => void;

  // ── NEW: Plan Review ──
  planReviews: PlanReviewData[];
  selectedReview: string | null;
  setSelectedReview: (id: string | null) => void;

  // ── NEW: Plan vs Actuals ──
  planActuals: PlanActualData[];
  integrations: IntegrationData[];
  varianceAlerts: VarianceAlert[];

  // ── NEW: Pitch Deck ──
  pitchDecks: PitchDeckData[];
  selectedDeck: string | null;
  setSelectedDeck: (id: string | null) => void;

  // ── NEW: Citations ──
  citations: CitationData[];

  // ── CRUD for Plans ──
  updatePlan: (id: string, updates: Partial<BusinessPlanData>) => void;
  deletePlan: (id: string) => void;

  // ── CRUD for Reports ──
  addReport: (report: ReportData) => void;
  updateReport: (id: string, updates: Partial<ReportData>) => void;

  // ── CRUD for Workflows ──
  addWorkflow: (workflow: WorkflowInfo) => void;
  updateWorkflow: (id: string, updates: Partial<WorkflowInfo>) => void;

  // ── CRUD for Agents ──
  addAgent: (agent: AgentInfo) => void;
  updateAgent: (id: string, updates: Partial<AgentInfo>) => void;

  // ── CRUD for Plan Actuals ──
  addPlanActual: (data: PlanActualData) => void;
  updatePlanActual: (id: string, updates: Partial<PlanActualData>) => void;

  // ── CRUD for Integrations ──
  updateIntegration: (type: string, updates: Partial<IntegrationData>) => void;

  // ── CRUD for Pitch Decks ──
  updatePitchDeck: (id: string, updates: Partial<PitchDeckData>) => void;
  deletePitchDeck: (id: string) => void;

  // ── CRUD for Plan Reviews ──
  addPlanReview: (review: PlanReviewData) => void;

  // ── Connected Financial Model ──
  updateFinancialAssumption: (key: string, value: number) => void;

  // ── OpenClaw Integration ──
  openclawGateway: OpenClawGateway;
  openclawChannels: OpenClawChannel[];
  openclawPlugins: OpenClawPlugin[];
  openclawDelegates: OpenClawDelegate[];
  openclawWebhooks: OpenClawWebhook[];
  openclawScheduledTasks: OpenClawScheduledTask[];
  openclawSessions: OpenClawSession[];
  openclawSoul: OpenClawSoulConfig;

  // OpenClaw CRUD
  updateOpenClawGateway: (updates: Partial<OpenClawGateway>) => void;
  addOpenClawChannel: (channel: OpenClawChannel) => void;
  updateOpenClawChannel: (id: string, updates: Partial<OpenClawChannel>) => void;
  removeOpenClawChannel: (id: string) => void;
  updateOpenClawPlugin: (id: string, updates: Partial<OpenClawPlugin>) => void;
  addOpenClawDelegate: (delegate: OpenClawDelegate) => void;
  updateOpenClawDelegate: (id: string, updates: Partial<OpenClawDelegate>) => void;
  addOpenClawWebhook: (webhook: OpenClawWebhook) => void;
  updateOpenClawWebhook: (id: string, updates: Partial<OpenClawWebhook>) => void;
  removeOpenClawWebhook: (id: string) => void;
  addOpenClawScheduledTask: (task: OpenClawScheduledTask) => void;
  updateOpenClawScheduledTask: (id: string, updates: Partial<OpenClawScheduledTask>) => void;
  removeOpenClawScheduledTask: (id: string) => void;
  updateOpenClawSoul: (updates: Partial<OpenClawSoulConfig>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: 'dashboard',
  setActiveModule: (module) => set({ activeModule: module, mobileMenuOpen: false }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  copilotOpen: false,
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  
  // Chat
  chatMessages: [
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to GangNiaga AI OS! I\'m your autonomous business assistant. I can help you create professional business proposals, validate ideas with AI, review plans like a lender, track plan vs actuals, and generate pitch decks. How can I assist you today?',
      timestamp: new Date().toISOString(),
    }
  ],
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
  chatLoading: false,
  setChatLoading: (loading) => set({ chatLoading: loading }),

  // Copilot Skills & Memory
  copilotSkills: [],
  setCopilotSkills: (skills) => set({ copilotSkills: skills }),
  copilotMemories: [],
  setCopilotMemories: (memories) => set({ copilotMemories: memories }),
  voiceRecording: false,
  setVoiceRecording: (recording) => set({ voiceRecording: recording }),
  copilotInitialized: false,
  setCopilotInitialized: (initialized) => set({ copilotInitialized: initialized }),

  // Dashboard KPIs
  kpis: INITIAL_MOCK_STATE.kpis,

  revenueData: INITIAL_MOCK_STATE.revenueData,

  expenseData: [
    { name: 'Payroll', value: 85000 },
    { name: 'Infrastructure', value: 32000 },
    { name: 'Marketing', value: 28000 },
    { name: 'Operations', value: 22000 },
    { name: 'R&D', value: 15000 },
    { name: 'Other', value: 5200 },
  ],

  // Agents
  agents: INITIAL_MOCK_STATE.agents,
  selectedAgent: null,
  setSelectedAgent: (id) => set({ selectedAgent: id }),
  agentTasks: [
    { id: '1', type: 'Market Analysis', status: 'completed', input: 'Analyze SaaS market trends Q4 2024', output: 'Market analysis complete. SaaS growth rate at 18% YoY...', duration: 12, createdAt: '10:30 AM' },
    { id: '2', type: 'Financial Forecast', status: 'completed', input: 'Generate Q1 2025 revenue forecast', output: 'Based on current trajectory, Q1 revenue projected at RM920K...', duration: 8, createdAt: '10:45 AM' },
    { id: '3', type: 'Competitor Research', status: 'running', input: 'Monitor competitor pricing changes', output: undefined, duration: undefined, createdAt: '11:00 AM' },
    { id: '4', type: 'KPI Report', status: 'pending', input: 'Generate weekly KPI summary', output: undefined, duration: undefined, createdAt: '11:15 AM' },
    { id: '5', type: 'Citation Verification', status: 'running', input: 'Verify market data sources for bank proposal', output: undefined, duration: undefined, createdAt: '11:20 AM' },
    { id: '6', type: 'Plan Consistency Check', status: 'pending', input: 'Cross-check narrative vs financials for Bank Loan Proposal', output: undefined, duration: undefined, createdAt: '11:30 AM' },
  ],

  // Workflows
  workflows: INITIAL_MOCK_STATE.workflows,

  // Memory
  memories: [
    { id: '1', type: 'workspace', category: 'Company Profile', content: 'GangNiaga is a SaaS startup founded in 2024, targeting Southeast Asian SME market with AI-powered business operations platform. Current team size: 12. Seed round: RM11.5M.', createdAt: '2024-01-10' },
    { id: '2', type: 'financial', category: 'Revenue Model', content: 'Primary revenue: SaaS subscriptions (Tier 1: RM199/mo, Tier 2: RM599/mo, Tier 3: RM1,999/mo). Secondary: Professional services and custom integrations.', createdAt: '2024-01-11' },
    { id: '3', type: 'user', category: 'User Preference', content: 'Dashboard layout preference: compact view with KPI cards. Favorite modules: Financial Forecasting, Agent Console.', createdAt: '2024-01-12' },
    { id: '4', type: 'workflow', category: 'Automation History', content: 'Weekly KPI reports have been successfully automated for 8 consecutive weeks. Average time saved: 4.5 hours/week.', createdAt: '2024-01-13' },
    { id: '5', type: 'agent', category: 'Agent Context', content: 'Business Analyst agent has been trained on Southeast Asian market data. Specializes in SaaS metrics and growth analysis.', createdAt: '2024-01-14' },
    { id: '6', type: 'workspace', category: 'Market Intelligence', content: 'Key competitors: LivePlan (traditional business planning), Notion (collaboration), Monday.com (project management). Differentiator: AI-autonomous execution.', createdAt: '2024-01-15' },
    { id: '7', type: 'financial', category: 'DSCR Status', content: 'Current Debt Service Coverage Ratio: 1.45x. Bank minimum requirement: 1.25x. Target: 1.50x. Improvement trajectory positive — up from 1.22x last quarter.', createdAt: '2024-01-15' },
  ],

  // Business Plans
  plans: [
    {
      id: '1',
      title: 'GangNiaga AI OS — Bank Loan Proposal (RM2M)',
      status: 'completed',
      proposalType: 'bank_loan',
      industry: 'SaaS / Software',
      sections: {
        coverPage: '**GANGNIAGA AI OS**\nAutonomous AI Business Operating System\n\nBusiness Proposal for Bank Financing\nLoan Amount: RM2,000,000\nPrepared: January 2025\n\nGangNiaga Sdn Bhd (Reg. No. 2024012345)',
        executiveSummary: '**GangNiaga AI OS** is Southeast Asia\'s first autonomous AI-powered business operating system, designed specifically for SMEs across the ASEAN region. We are seeking RM2,000,000 in term loan financing to accelerate product development and market expansion.\n\n**Key Highlights:**\n- Current MRR: RM620K (ARR: RM7.4M)\n- 18-month runway with current burn rate\n- DSCR: 1.45x (above bank minimum of 1.25x)\n- 97% of ASEAN businesses are SMEs, yet less than 15% use business planning software\n- Projected revenue growth: 132% YoY\n- Break-even projected: Q3 2025',
        companyOverview: '**Company Background:**\nGangNiaga Sdn Bhd was incorporated in January 2024 under the Companies Act 2016. The company operates as a SaaS platform providing AI-powered business planning, financial forecasting, and autonomous workflow execution.\n\n**Registration:** SSM Reg. No. 2024012345\n**Legal Structure:** Private Limited Company (Sdn Bhd)\n**Ownership:** CEO: 60% equity, CTO: 25% equity, ESOP Pool: 15% equity',
        problemStatement: '**70% of SMEs in Malaysia still perform financial forecasting manually.** This results in inaccurate projections, delayed decision-making, and increased business failure rates.',
        solutionProduct: '**GangNiaga AI OS** — An autonomous AI business operating system that plans, analyzes, automates, and executes real business workflows.\n\n**Core Capabilities:**\n- AI Business Plan Generator — Professional 21-section proposals in minutes\n- Financial Forecasting Engine — Revenue, expenses, cash flow, P&L with AI advisor\n- Multi-Agent System — Autonomous AI workers that execute business tasks\n- Browser Automation — AI agents that interact with websites and extract data',
        marketAnalysis: '**TAM:** USD12.4B — Southeast Asian SaaS market by 2027\n**SAM:** USD3.8B — ASEAN SME business management software\n**SOM:** USD190M — AI-powered business operations for ASEAN SMEs',
        competitorAnalysis: '**LivePlan** — Traditional business planning. Strength: Mature tools. Weakness: No AI.\n**Upmetrics** — AI-assisted planning. Strength: Modern UI. Weakness: No agent system.\n**Notion / Monday.com** — General productivity. Strength: Large user base. Weakness: Not for business planning.',
        businessModel: '**Revenue Model:**\n1. SaaS Subscriptions (70% of revenue) — Starter: RM199/mo, Professional: RM599/mo, Enterprise: RM1,999/mo\n2. AI Usage Billing (15%)\n3. Professional Services (10%)\n4. Marketplace Commissions (5%)',
        financialForecast: '**3-Year Financial Projections:**\n\n**Year 1 (2025):** Revenue: RM8.9M | Net Income: RM2.7M | DSCR: 1.45x\n**Year 2 (2026):** Revenue: RM22.4M | Net Income: RM10.6M | DSCR: 2.1x\n**Year 3 (2027):** Revenue: RM56.2M | Net Income: RM33.8M | DSCR: 2.87x',
        fundingRequirement: '**Funding Amount: RM2,000,000**\nType: Term Loan (5-year tenure)\nPurpose: Regional expansion across Southeast Asia',
        useOfFunds: '**Use of Funds Breakdown:**\n1. Product Development — RM750K (37.5%)\n2. Market Expansion — RM500K (25%)\n3. Sales & Marketing — RM350K (17.5%)\n4. Operations — RM250K (12.5%)\n5. Working Capital — RM150K (7.5%)',
        riskAnalysis: '**Risk Assessment:**\n- Market Risk (Medium): ASEAN adoption slower than projected\n- Financial Risk (Low-Medium): Revenue concentration in top accounts\n- Operational Risk (Low): Key person dependency\n- AI/Technology Risk (Medium): AI regulation changes',
        swotAnalysis: '**STRENGTHS:** AI-autonomous execution, ASEAN-first design, 500+ paying customers\n**WEAKNESSES:** Early-stage, limited brand recognition\n**OPPORTUNITIES:** 65M SMEs across ASEAN, AI adoption 28% CAGR\n**THREATS:** Global SaaS players expanding to SEA, AI regulatory uncertainty',
        exitStrategy: '**Potential Exit Scenarios:**\n1. Strategic Acquisition (Most Likely) — Target: Year 4-6, Valuation: 8-12x ARR\n2. Regional Expansion & Growth — Reach RM56M+ ARR by Year 3\n3. Secondary Sale — Early investors can exit via secondary transactions',
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'GangNiaga AI OS — Series A (VC Pitch)',
      status: 'in_progress',
      proposalType: 'venture_capital',
      industry: 'AI / ML',
      sections: {
        executiveSummary: 'Following strong seed-stage traction with RM7.4M ARR and 500+ customers, GangNiaga is raising USD5M Series A to dominate the ASEAN AI business operations market.',
        marketAnalysis: 'TAM: USD12.4B | SAM: USD3.8B | SOM: USD190M. AI adoption wave in ASEAN — 28% CAGR.',
      },
      createdAt: '2024-01-14',
      updatedAt: '2024-01-15',
    },
    {
      id: '3',
      title: 'MARA Business Grant — Youth Entrepreneurship',
      status: 'draft',
      proposalType: 'government_grant',
      industry: 'SaaS / Software',
      sections: {},
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
  ],
  selectedPlan: null,
  setSelectedPlan: (id) => set({ selectedPlan: id }),

  // Reports
  reports: [
    { id: '1', title: 'Q4 2024 Investor Update', type: 'investor', status: 'completed', format: 'pdf', createdAt: '2024-01-15' },
    { id: '2', title: 'Monthly KPI Summary — December', type: 'kpi', status: 'completed', format: 'pdf', createdAt: '2024-01-12' },
    { id: '3', title: 'Financial Report — FY 2024', type: 'financial', status: 'completed', format: 'xlsx', createdAt: '2024-01-10' },
    { id: '4', title: 'Board Presentation — Q4', type: 'board', status: 'completed', format: 'pdf', createdAt: '2024-01-08' },
    { id: '5', title: 'Operational Intelligence Weekly', type: 'operational', status: 'generating', format: 'pdf', createdAt: '2024-01-15' },
  ],

  // Forecasts
  forecastData: [
    { name: 'Jan', revenue: 186000, expenses: 142000, profit: 44000 },
    { name: 'Feb', revenue: 205000, expenses: 148000, profit: 57000 },
    { name: 'Mar', revenue: 237000, expenses: 155000, profit: 82000 },
    { name: 'Apr', revenue: 265000, expenses: 162000, profit: 103000 },
    { name: 'May', revenue: 298000, expenses: 170000, profit: 128000 },
    { name: 'Jun', revenue: 325000, expenses: 178000, profit: 147000 },
    { name: 'Jul', revenue: 352000, expenses: 185000, profit: 167000 },
    { name: 'Aug', revenue: 385000, expenses: 193000, profit: 192000 },
    { name: 'Sep', revenue: 410000, expenses: 200000, profit: 210000 },
    { name: 'Oct', revenue: 445000, expenses: 208000, profit: 237000 },
    { name: 'Nov', revenue: 478000, expenses: 216000, profit: 262000 },
    { name: 'Dec', revenue: 512000, expenses: 225000, profit: 287000 },
  ],

  // ── NEW: Idea Canvas ──
  ideaCanvases: INITIAL_MOCK_STATE.ideaCanvases,
  selectedIdea: null,
  setSelectedIdea: (id) => set({ selectedIdea: id }),

  // ── NEW: Plan Reviews ──
  planReviews: INITIAL_MOCK_STATE.planReviews,
  selectedReview: null,
  setSelectedReview: (id) => set({ selectedReview: id }),

  // ── NEW: Plan vs Actuals ──
  planActuals: INITIAL_MOCK_STATE.planActuals,
  integrations: [
    { type: 'quickbooks', status: 'disconnected', lastSync: null, syncFrequency: 'monthly' },
    { type: 'xero', status: 'disconnected', lastSync: null, syncFrequency: 'monthly' },
    { type: 'manual', status: 'connected', lastSync: '2024-01-15T10:30:00Z', syncFrequency: 'monthly' },
  ],
  varianceAlerts: [
    { id: 'va1', category: 'cashflow', period: '2025-03', type: 'cashflow_warning', message: 'Cash flow variance of -19.3% exceeds the 15% warning threshold. Actual cash flow was RM66.2K vs planned RM82K.', severity: 'critical', amount: -15800 },
    { id: 'va2', category: 'expense', period: '2025-03', type: 'expense_over', message: 'Expenses exceeded plan by 4.8% in March. Primary driver: unexpected infrastructure scaling costs.', severity: 'warning', amount: 7400 },
    { id: 'va3', category: 'revenue', period: '2025-03', type: 'revenue_drift', message: 'Revenue tracking 3.5% below plan. Monitor closely — if trend continues, break-even timeline may shift.', severity: 'info', amount: -8400 },
  ],

  // ── NEW: Pitch Decks ──
  pitchDecks: INITIAL_MOCK_STATE.pitchDecks as PitchDeckData[],
  selectedDeck: null,
  setSelectedDeck: (id) => set({ selectedDeck: id }),

  // ── NEW: Citations ──
  citations: INITIAL_MOCK_STATE.citations,

  // ── CRUD for Plans ──
  updatePlan: (id, updates) => set((s) => ({
    plans: s.plans.map((p) => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p),
  })),

  deletePlan: (id) => set((s) => ({
    plans: s.plans.filter((p) => p.id !== id),
    selectedPlan: s.selectedPlan === id ? null : s.selectedPlan,
  })),

  // ── CRUD for Reports ──
  addReport: (report) => set((s) => ({
    reports: [...s.reports, report],
  })),

  updateReport: (id, updates) => set((s) => ({
    reports: s.reports.map((r) => r.id === id ? { ...r, ...updates } : r),
  })),

  // ── CRUD for Workflows ──
  addWorkflow: (workflow) => set((s) => ({
    workflows: [...s.workflows, workflow],
  })),

  updateWorkflow: (id, updates) => set((s) => ({
    workflows: s.workflows.map((w) => w.id === id ? { ...w, ...updates } : w),
  })),

  // ── CRUD for Agents ──
  addAgent: (agent) => set((s) => ({
    agents: [...s.agents, agent],
  })),

  updateAgent: (id, updates) => set((s) => ({
    agents: s.agents.map((a) => a.id === id ? { ...a, ...updates } : a),
  })),

  // ── CRUD for Plan Actuals ──
  addPlanActual: (data) => set((s) => ({
    planActuals: [...s.planActuals, data],
  })),

  updatePlanActual: (id, updates) => set((s) => ({
    planActuals: s.planActuals.map((pa) => pa.id === id ? { ...pa, ...updates } : pa),
  })),

  // ── CRUD for Integrations ──
  updateIntegration: (type, updates) => set((s) => ({
    integrations: s.integrations.map((i) => i.type === type ? { ...i, ...updates } : i),
  })),

  // ── CRUD for Pitch Decks ──
  updatePitchDeck: (id, updates) => set((s) => ({
    pitchDecks: s.pitchDecks.map((d) => d.id === id ? { ...d, ...updates } : d),
  })),

  deletePitchDeck: (id) => set((s) => ({
    pitchDecks: s.pitchDecks.filter((d) => d.id !== id),
    selectedDeck: s.selectedDeck === id ? null : s.selectedDeck,
  })),

  // ── CRUD for Plan Reviews ──
  addPlanReview: (review) => set((s) => ({
    planReviews: [...s.planReviews, review],
  })),

  // ── Connected Financial Model ──
  updateFinancialAssumption: (key, value) => set((s) => {
    const updatedKpis = s.kpis.map((kpi) => {
      if (kpi.metric.toLowerCase().includes(key.toLowerCase())) {
        return {
          ...kpi,
          value,
          change: ((value - kpi.previousValue) / kpi.previousValue) * 100,
          trend: (value > kpi.previousValue ? 'up' : 'down') as 'up' | 'down' | 'neutral',
        };
      }
      return kpi;
    });
    return { kpis: updatedKpis };
  }),

  // ── OpenClaw Integration ──
  openclawGateway: {
    id: 'gw1',
    status: 'running',
    bindHost: '127.0.0.1',
    bindPort: 18789,
    uptime: 864000, // 10 days
    connectedClients: 3,
    activeChannels: 4,
    totalMessages: 12847,
    lastHealthCheck: new Date().toISOString(),
    version: '1.32.4',
    config: {
      authMode: 'loopback_only',
      logLevel: 'info',
      maxSessions: 50,
      sessionTimeout: 30,
    },
  },

  openclawChannels: INITIAL_MOCK_STATE.openclawChannels as OpenClawChannel[],

  openclawPlugins: INITIAL_MOCK_STATE.openclawPlugins,

  openclawDelegates: INITIAL_MOCK_STATE.openclawDelegates,

  openclawWebhooks: INITIAL_MOCK_STATE.openclawWebhooks as OpenClawWebhook[],

  openclawScheduledTasks: [
    {
      id: 'st1',
      name: 'Daily KPI Summary',
      cronExpression: '0 9 * * *',
      status: 'active',
      agentId: '1',
      prompt: 'Generate and distribute daily KPI summary to management team',
      channel: 'slack',
      lastRun: new Date(Date.now() - 86400000).toISOString(),
      nextRun: new Date(Date.now() + 43200000).toISOString(),
      runCount: 89,
      createdAt: '2024-10-01T00:00:00Z',
    },
    {
      id: 'st2',
      name: 'Weekly Investor Report',
      cronExpression: '0 10 * * 1',
      status: 'active',
      agentId: '2',
      prompt: 'Compile weekly investor update with financial highlights and milestones',
      channel: 'slack',
      lastRun: new Date(Date.now() - 604800000).toISOString(),
      nextRun: new Date(Date.now() + 172800000).toISOString(),
      runCount: 12,
      createdAt: '2024-11-01T00:00:00Z',
    },
    {
      id: 'st3',
      name: 'Competitor Price Check',
      cronExpression: '0 */6 * * *',
      status: 'active',
      agentId: '3',
      prompt: 'Check competitor pricing pages and report any changes',
      channel: null,
      lastRun: new Date(Date.now() - 21600000).toISOString(),
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      runCount: 245,
      createdAt: '2024-09-15T00:00:00Z',
    },
    {
      id: 'st4',
      name: 'Monthly Financial Review',
      cronExpression: '0 9 1 * *',
      status: 'active',
      agentId: '2',
      prompt: 'Run comprehensive monthly financial review including DSCR calculation and variance analysis',
      channel: 'whatsapp',
      lastRun: new Date(Date.now() - 2592000000).toISOString(),
      nextRun: new Date(Date.now() + 518400000).toISOString(),
      runCount: 4,
      createdAt: '2024-10-01T00:00:00Z',
    },
  ],

  openclawSessions: INITIAL_MOCK_STATE.openclawSessions,

  openclawSoul: INITIAL_MOCK_STATE.openclawSoul,

  // OpenClaw CRUD
  updateOpenClawGateway: (updates) => set((s) => ({
    openclawGateway: { ...s.openclawGateway, ...updates },
  })),

  addOpenClawChannel: (channel) => set((s) => ({
    openclawChannels: [...s.openclawChannels, channel],
  })),

  updateOpenClawChannel: (id, updates) => set((s) => ({
    openclawChannels: s.openclawChannels.map((ch) => ch.id === id ? { ...ch, ...updates } : ch),
  })),

  removeOpenClawChannel: (id) => set((s) => ({
    openclawChannels: s.openclawChannels.filter((ch) => ch.id !== id),
  })),

  updateOpenClawPlugin: (id, updates) => set((s) => ({
    openclawPlugins: s.openclawPlugins.map((pl) => pl.id === id ? { ...pl, ...updates } : pl),
  })),

  addOpenClawDelegate: (delegate) => set((s) => ({
    openclawDelegates: [...s.openclawDelegates, delegate],
  })),

  updateOpenClawDelegate: (id, updates) => set((s) => ({
    openclawDelegates: s.openclawDelegates.map((dl) => dl.id === id ? { ...dl, ...updates } : dl),
  })),

  addOpenClawWebhook: (webhook) => set((s) => ({
    openclawWebhooks: [...s.openclawWebhooks, webhook],
  })),

  updateOpenClawWebhook: (id, updates) => set((s) => ({
    openclawWebhooks: s.openclawWebhooks.map((wh) => wh.id === id ? { ...wh, ...updates } : wh),
  })),

  removeOpenClawWebhook: (id) => set((s) => ({
    openclawWebhooks: s.openclawWebhooks.filter((wh) => wh.id !== id),
  })),

  addOpenClawScheduledTask: (task) => set((s) => ({
    openclawScheduledTasks: [...s.openclawScheduledTasks, task],
  })),

  updateOpenClawScheduledTask: (id, updates) => set((s) => ({
    openclawScheduledTasks: s.openclawScheduledTasks.map((st) => st.id === id ? { ...st, ...updates } : st),
  })),

  removeOpenClawScheduledTask: (id) => set((s) => ({
    openclawScheduledTasks: s.openclawScheduledTasks.filter((st) => st.id !== id),
  })),

  updateOpenClawSoul: (updates) => set((s) => ({
    openclawSoul: { ...s.openclawSoul, ...updates },
  })),
}));
