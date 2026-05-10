import { create } from 'zustand';
import type { ModuleId, ChatMessage, KPIData, ChartDataPoint, AgentInfo, TaskInfo, WorkflowInfo, MemoryEntry, BusinessPlanData, ReportData, IdeaCanvasData, PlanReviewData, PlanActualData, IntegrationData, VarianceAlert, PitchDeckData, CitationData, OpenClawChannel, OpenClawGateway, OpenClawPlugin, OpenClawDelegate, OpenClawWebhook, OpenClawScheduledTask, OpenClawSession, OpenClawSoulConfig } from './types';

interface AppState {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  copilotOpen: boolean;
  toggleCopilot: () => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  chatLoading: boolean;
  setChatLoading: (loading: boolean) => void;

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
  setActiveModule: (module) => set({ activeModule: module }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  copilotOpen: false,
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
  
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

  // Dashboard KPIs
  kpis: [
    { metric: 'Monthly Revenue', value: 284500, previousValue: 256000, target: 300000, unit: 'currency', change: 11.1, trend: 'up' },
    { metric: 'Burn Rate', value: 187200, previousValue: 195000, target: 170000, unit: 'currency', change: -4.0, trend: 'down' },
    { metric: 'Runway', value: 18, previousValue: 15, target: 24, unit: 'months', change: 20.0, trend: 'up' },
    { metric: 'DSCR', value: 1.45, previousValue: 1.22, target: 1.50, unit: 'ratio', change: 18.9, trend: 'up' },
    { metric: 'MRR', value: 142800, previousValue: 128500, target: 160000, unit: 'currency', change: 11.1, trend: 'up' },
    { metric: 'ARR', value: 1713600, previousValue: 1542000, target: 2000000, unit: 'currency', change: 11.1, trend: 'up' },
  ],

  revenueData: [
    { name: 'Jan', revenue: 186000, expenses: 142000, profit: 44000 },
    { name: 'Feb', revenue: 205000, expenses: 148000, profit: 57000 },
    { name: 'Mar', revenue: 237000, expenses: 155000, profit: 82000 },
    { name: 'Apr', revenue: 218000, expenses: 161000, profit: 57000 },
    { name: 'May', revenue: 256000, expenses: 168000, profit: 88000 },
    { name: 'Jun', revenue: 284500, expenses: 187200, profit: 97300 },
    { name: 'Jul', revenue: 295000, expenses: 192000, profit: 103000 },
    { name: 'Aug', revenue: 312000, expenses: 198000, profit: 114000 },
    { name: 'Sep', revenue: 298000, expenses: 195000, profit: 103000 },
    { name: 'Oct', revenue: 335000, expenses: 201000, profit: 134000 },
    { name: 'Nov', revenue: 348000, expenses: 208000, profit: 140000 },
    { name: 'Dec', revenue: 365000, expenses: 215000, profit: 150000 },
  ],

  expenseData: [
    { name: 'Payroll', value: 85000 },
    { name: 'Infrastructure', value: 32000 },
    { name: 'Marketing', value: 28000 },
    { name: 'Operations', value: 22000 },
    { name: 'R&D', value: 15000 },
    { name: 'Other', value: 5200 },
  ],

  // Agents
  agents: [
    { id: '1', name: 'Business Analyst', type: 'analysis', status: 'running', tasksCompleted: 47, lastActivity: '2 min ago' },
    { id: '2', name: 'Financial Advisor', type: 'financial', status: 'idle', tasksCompleted: 32, lastActivity: '15 min ago' },
    { id: '3', name: 'Market Researcher', type: 'research', status: 'running', tasksCompleted: 28, lastActivity: '5 min ago' },
    { id: '4', name: 'Report Generator', type: 'reporting', status: 'completed', tasksCompleted: 156, lastActivity: '1 hour ago' },
    { id: '5', name: 'Browser Agent', type: 'browser', status: 'idle', tasksCompleted: 12, lastActivity: '3 hours ago' },
    { id: '6', name: 'CRM Assistant', type: 'crm', status: 'error', tasksCompleted: 8, lastActivity: '30 min ago' },
    { id: '7', name: 'Plan Review Agent', type: 'review', status: 'idle', tasksCompleted: 14, lastActivity: '10 min ago' },
    { id: '8', name: 'Citation Verifier', type: 'citation', status: 'running', tasksCompleted: 52, lastActivity: '1 min ago' },
  ],
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
  workflows: [
    { id: '1', name: 'Weekly KPI Report', type: 'scheduled', status: 'completed', triggerType: 'cron', steps: [
      { id: '1', name: 'Collect KPI Data', type: 'data', status: 'completed', agent: 'Business Analyst' },
      { id: '2', name: 'Generate Charts', type: 'chart', status: 'completed', tool: 'Analytics Tool' },
      { id: '3', name: 'Create Report', type: 'report', status: 'completed', agent: 'Report Generator' },
      { id: '4', name: 'Send to Slack', type: 'notification', status: 'completed', tool: 'Slack Tool' },
    ], createdAt: '2024-01-15' },
    { id: '2', name: 'Competitor Monitoring', type: 'event', status: 'running', triggerType: 'daily', steps: [
      { id: '1', name: 'Browse Competitor Sites', type: 'browser', status: 'completed', agent: 'Browser Agent' },
      { id: '2', name: 'Extract Pricing Data', type: 'data', status: 'running', agent: 'Market Researcher' },
      { id: '3', name: 'Analyze Changes', type: 'analysis', status: 'pending', agent: 'Business Analyst' },
      { id: '4', name: 'Update Dashboard', type: 'data', status: 'pending', tool: 'Analytics Tool' },
    ], createdAt: '2024-01-14' },
    { id: '3', name: 'Revenue Alert', type: 'event', status: 'paused', triggerType: 'threshold', steps: [
      { id: '1', name: 'Check Revenue', type: 'data', status: 'pending', agent: 'Financial Advisor' },
      { id: '2', name: 'Compare Target', type: 'analysis', status: 'pending', agent: 'Business Analyst' },
      { id: '3', name: 'Send Alert', type: 'notification', status: 'pending', tool: 'Email Tool' },
    ], createdAt: '2024-01-13' },
    { id: '4', name: 'Investor Update', type: 'scheduled', status: 'pending', triggerType: 'monthly', steps: [
      { id: '1', name: 'Compile Financials', type: 'data', status: 'pending', agent: 'Financial Advisor' },
      { id: '2', name: 'Generate Report', type: 'report', status: 'pending', agent: 'Report Generator' },
      { id: '3', name: 'Format PDF', type: 'report', status: 'pending', tool: 'PDF Tool' },
      { id: '4', name: 'Send Email', type: 'notification', status: 'pending', tool: 'Email Tool' },
    ], createdAt: '2024-01-12' },
  ],

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
  ideaCanvases: [
    {
      id: '1',
      title: 'GangNiaga AI OS — ASEAN SME Platform',
      status: 'validated',
      problem: '70% of ASEAN SMEs still use manual methods for business planning and financial forecasting. This leads to 60% failure rate within 3 years due to cash flow mismanagement.',
      solution: 'An AI-autonomous business operating system that plans, analyzes, and executes business workflows autonomously — replacing 7+ disconnected tools with 1 intelligent platform.',
      targetMarket: '65M SMEs across ASEAN, focusing initially on Malaysia (1.2M SMEs), then Indonesia (64M MSMEs) and Thailand (3.1M SMEs)',
      revenueModel: 'SaaS subscriptions (3 tiers: RM199-1,999/mo), AI usage billing, professional services, and marketplace commissions. Target LTV:CAC of 7.5:1.',
      competitiveEdge: 'Only platform offering autonomous AI agent execution (not just passive tools), ASEAN-first localization, integrated financial engine with DSCR calculations, and persistent AI memory.',
      risks: ['ASEAN market adoption may be slower than projected', 'AI regulation uncertainty in the region', 'Global SaaS competitors (Notion, Monday) expanding to SEA', 'Currency fluctuation risk (RM/USD)', 'Talent competition from big tech companies'],
      validationScore: 82,
      validationReport: {
        overallScore: 82,
        marketViability: 88,
        problemClarity: 90,
        solutionFeasibility: 75,
        revenuePotential: 85,
        competitivePosition: 72,
        riskLevel: 'medium',
        strengths: ['Massive underserved market (65M SMEs)', 'Clear pain point with quantifiable impact', 'Strong technical moat with multi-agent AI', 'First-mover advantage in ASEAN AI business tools'],
        weaknesses: ['Early-stage company (less than 2 years)', 'Revenue concentration in top accounts (28% MRR)', 'Team size too small for regional ambitions', 'No ISO/SOC2 certification yet'],
        recommendations: ['Prioritize bank partnership channel for distribution', 'Accelerate Indonesia market entry for larger TAM', 'Build compliance moat with SOC2 certification', 'Diversify revenue to reduce concentration risk'],
        redFlags: ['Burn rate of RM187K/month with only 18 months runway', 'No physical collateral for bank loan'],
        benchmarkComparison: [
          { metric: 'LTV:CAC Ratio', user: 7.5, benchmark: 3.0, status: 'above' },
          { metric: 'Monthly Growth Rate', user: 11.1, benchmark: 8.0, status: 'above' },
          { metric: 'Gross Margin', user: 82, benchmark: 70, status: 'above' },
          { metric: 'Churn Rate', user: 3.2, benchmark: 2.5, status: 'below' },
          { metric: 'Team Size / Revenue', user: 12, benchmark: 18, status: 'above' },
        ],
      },
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
    },
    {
      id: '2',
      title: 'QuickCommerce — AI Inventory Optimizer',
      status: 'draft',
      problem: 'SME retailers in Malaysia lose 15-25% of revenue annually due to stockouts and overstock situations.',
      solution: 'AI-powered inventory optimization that predicts demand patterns, automates reordering, and minimizes waste.',
      targetMarket: '450,000 retail SMEs in Malaysia',
      revenueModel: 'SaaS RM299/mo per outlet + transaction fees on automated orders',
      competitiveEdge: 'Local market data training, integration with local suppliers, Bahasa Melayu native',
      risks: ['Low digital adoption among traditional retailers', 'Supplier integration complexity'],
      validationScore: 0,
      validationReport: null,
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14',
    },
  ],
  selectedIdea: null,
  setSelectedIdea: (id) => set({ selectedIdea: id }),

  // ── NEW: Plan Reviews ──
  planReviews: [
    {
      id: '1',
      planId: '1',
      status: 'completed',
      lenderPersona: 'bank',
      narrativeScore: 85,
      financialScore: 78,
      consistencyScore: 72,
      overallScore: 78,
      discrepancies: [
        {
          id: 'd1',
          severity: 'warning',
          section: 'Financial Forecast vs Executive Summary',
          description: 'Executive summary states "132% YoY growth" but financial forecast shows 150% growth from Year 1 to Year 2',
          narrativeClaim: '132% YoY revenue growth',
          financialReality: 'Year 1 RM8.9M → Year 2 RM22.4M = 151.7% growth',
          suggestedFix: 'Align executive summary with financial projections — use "150%+" or adjust Year 2 projections',
        },
        {
          id: 'd2',
          severity: 'critical',
          section: 'Use of Funds vs Financial Forecast',
          description: 'Use of Funds allocates RM750K to product development but operations plan shows hiring 4 engineers at estimated RM480K/year — gap of RM270K unexplained',
          narrativeClaim: 'RM750K allocated to Product Development',
          financialReality: '4 engineers × RM10K/mo = RM480K/year — remaining RM270K not itemized',
          suggestedFix: 'Add detailed engineering budget breakdown showing RM480K salaries + RM270K tools/infrastructure',
        },
        {
          id: 'd3',
          severity: 'info',
          section: 'Market Analysis vs Revenue Streams',
          description: 'Market analysis targets 3 customer segments but revenue streams only detail 2 pricing tiers with significant overlap',
          narrativeClaim: '3 distinct target segments: startups, SMEs, enterprise',
          financialReality: 'Starter and Professional plans overlap for SME segment',
          suggestedFix: 'Consider restructuring tiers to clearly map to 3 segments',
        },
      ],
      recommendations: [
        { id: 'r1', priority: 'high', category: 'Consistency', recommendation: 'Fix growth rate discrepancy between executive summary and financial projections', impact: 'Critical for bank credibility — lenders will catch this immediately' },
        { id: 'r2', priority: 'high', category: 'Detail', recommendation: 'Add detailed engineering budget breakdown in Use of Funds section', impact: 'Shows financial discipline and planning rigor' },
        { id: 'r3', priority: 'medium', category: 'Bank Requirements', recommendation: 'Add collateral section — banks need to know what secures the RM2M loan', impact: 'Essential for loan approval — missing collateral discussion is a red flag' },
        { id: 'r4', priority: 'medium', category: 'DSCR', recommendation: 'Add sensitivity analysis showing DSCR under worst-case scenario', impact: 'Banks want to see DSCR remains above 1.25x even in downside case' },
        { id: 'r5', priority: 'low', category: 'Presentation', recommendation: 'Add personal guarantees section from CEO/CTO', impact: 'Strengthens lender confidence in management commitment' },
      ],
      fullReport: null,
      createdAt: '2024-01-15',
    },
  ],
  selectedReview: null,
  setSelectedReview: (id) => set({ selectedReview: id }),

  // ── NEW: Plan vs Actuals ──
  planActuals: [
    { id: '1', category: 'revenue', period: '2025-01', plannedAmount: 186000, actualAmount: 191200, variance: 5200, variancePercent: 2.8, source: 'manual' },
    { id: '2', category: 'revenue', period: '2025-02', plannedAmount: 205000, actualAmount: 212400, variance: 7400, variancePercent: 3.6, source: 'manual' },
    { id: '3', category: 'revenue', period: '2025-03', plannedAmount: 237000, actualAmount: 228600, variance: -8400, variancePercent: -3.5, source: 'manual' },
    { id: '4', category: 'expense', period: '2025-01', plannedAmount: 142000, actualAmount: 148900, variance: 6900, variancePercent: 4.9, source: 'manual' },
    { id: '5', category: 'expense', period: '2025-02', plannedAmount: 148000, actualAmount: 151200, variance: 3200, variancePercent: 2.2, source: 'manual' },
    { id: '6', category: 'expense', period: '2025-03', plannedAmount: 155000, actualAmount: 162400, variance: 7400, variancePercent: 4.8, source: 'manual' },
    { id: '7', category: 'cashflow', period: '2025-01', plannedAmount: 44000, actualAmount: 42300, variance: -1700, variancePercent: -3.9, source: 'manual' },
    { id: '8', category: 'cashflow', period: '2025-02', plannedAmount: 57000, actualAmount: 61200, variance: 4200, variancePercent: 7.4, source: 'manual' },
    { id: '9', category: 'cashflow', period: '2025-03', plannedAmount: 82000, actualAmount: 66200, variance: -15800, variancePercent: -19.3, source: 'manual' },
    { id: '10', category: 'profit', period: '2025-01', plannedAmount: 44000, actualAmount: 42300, variance: -1700, variancePercent: -3.9, source: 'manual' },
    { id: '11', category: 'profit', period: '2025-02', plannedAmount: 57000, actualAmount: 61200, variance: 4200, variancePercent: 7.4, source: 'manual' },
    { id: '12', category: 'profit', period: '2025-03', plannedAmount: 82000, actualAmount: 66200, variance: -15800, variancePercent: -19.3, source: 'manual' },
  ],
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
  pitchDecks: [
    {
      id: '1',
      title: 'GangNiaga AI OS — Bank Loan Pitch',
      status: 'completed',
      planId: '1',
      templateType: 'bank',
      slides: [
        { id: 's1', order: 1, title: 'GangNiaga AI OS', type: 'title', content: 'Autonomous AI Business Operating System\nBank Loan Proposal — RM2,000,000\nJanuary 2025', linkedSection: 'coverPage' },
        { id: 's2', order: 2, title: 'The Problem', type: 'problem', content: '70% of ASEAN SMEs use manual methods for business planning\n60% fail within 3 years due to cash flow mismanagement\n15+ hours/week wasted on tasks that could be automated', dataPoints: { 'SMEs using manual methods': '70%', '3-year failure rate': '60%', 'Hours wasted weekly': '15+' }, linkedSection: 'problemStatement' },
        { id: 's3', order: 3, title: 'Our Solution', type: 'solution', content: 'AI-autonomous platform that plans, analyzes, and executes\nMulti-agent system with persistent memory\n21-section professional proposal generator\nIntegrated financial engine with DSCR calculations', linkedSection: 'solutionProduct' },
        { id: 's4', order: 4, title: 'Market Opportunity', type: 'market', content: 'TAM: USD12.4B — SAM: USD3.8B — SOM: USD190M\n65M SMEs across ASEAN\nAI adoption growing 28% CAGR', dataPoints: { 'TAM': 'USD12.4B', 'SAM': 'USD3.8B', 'SOM': 'USD190M', 'ASEAN SMEs': '65M' }, linkedSection: 'marketAnalysis' },
        { id: 's5', order: 5, title: 'Business Model', type: 'business_model', content: 'SaaS Subscriptions: 70% of revenue\nAI Usage Billing: 15%\nProfessional Services: 10%\nMarketplace: 5%\n\nLTV:CAC Ratio: 7.5:1', dataPoints: { 'LTV:CAC': '7.5:1', 'MRR': 'RM193K', 'Gross Margin': '82%' }, linkedSection: 'businessModel' },
        { id: 's6', order: 6, title: 'Financial Projections', type: 'financials', content: 'Year 1: RM8.9M revenue | DSCR 1.45x\nYear 2: RM22.4M revenue | DSCR 2.1x\nYear 3: RM56.2M revenue | DSCR 2.87x\n\nBreak-even: Q3 2025', dataPoints: { 'Year 1 Revenue': 'RM8.9M', 'Year 2 Revenue': 'RM22.4M', 'Year 3 Revenue': 'RM56.2M', 'DSCR Current': '1.45x' }, linkedSection: 'financialForecast' },
        { id: 's7', order: 7, title: 'The Ask', type: 'ask', content: 'Seeking RM2,000,000 term loan (5-year tenure)\n\nUse of Funds:\n- Product Development: 37.5%\n- Market Expansion: 25%\n- Sales & Marketing: 17.5%\n- Operations: 12.5%\n- Working Capital: 7.5%', dataPoints: { 'Loan Amount': 'RM2M', 'Tenure': '5 years', 'DSCR': '1.45x' }, linkedSection: 'fundingRequirement' },
      ],
      slideCount: 7,
      anticipatedQuestions: [
        { id: 'q1', question: 'What happens to DSCR if revenue drops 30%?', category: 'Financial', suggestedAnswer: 'Even with a 30% revenue reduction, DSCR remains above 1.0x due to our low fixed cost structure. We\'d implement cost-cutting measures within 30 days to restore DSCR above 1.25x.', difficulty: 'hard' },
        { id: 'q2', question: 'What collateral backs this loan?', category: 'Collateral', suggestedAnswer: 'We offer the following collateral: intellectual property (AI platform), equipment and infrastructure deposits, personal guarantees from CEO and CTO, and the company\'s receivables portfolio.', difficulty: 'hard' },
        { id: 'q3', question: 'Why hasn\'t a bigger company built this?', category: 'Competitive', suggestedAnswer: 'Global SaaS companies build for Western markets with Western assumptions. ASEAN SMEs have unique needs: multi-currency, local compliance, language localization, and cultural business practices. Our AI memory engine learns these nuances.', difficulty: 'medium' },
        { id: 'q4', question: 'How do you plan to use the loan proceeds?', category: 'Use of Funds', suggestedAnswer: '37.5% for product development (bank-grade compliance features, 4 additional engineers), 25% for market expansion (Indonesia and Thailand entry), 17.5% for sales and marketing, 12.5% for operations infrastructure, and 7.5% for working capital buffer.', difficulty: 'easy' },
      ],
      createdAt: '2024-01-15',
    },
  ],
  selectedDeck: null,
  setSelectedDeck: (id) => set({ selectedDeck: id }),

  // ── NEW: Citations ──
  citations: [
    { id: 'c1', source: 'Statista — Digital Market Outlook Southeast Asia', url: 'https://statista.com/outlook/digital/sea', type: 'market_data', geography: 'SEA', datePublished: '2024-06', dataPoint: 'SEA SaaS market size USD12.4B by 2027', verified: true, createdAt: '2024-01-10' },
    { id: 'c2', source: 'World Bank — Malaysia Economic Monitor', url: 'https://worldbank.org/malaysia-monitor', type: 'government', geography: 'MY', datePublished: '2024-03', dataPoint: '97% of Malaysian businesses are SMEs', verified: true, createdAt: '2024-01-10' },
    { id: 'c3', source: 'DOSM — Department of Statistics Malaysia', url: 'https://dosm.gov.my', type: 'government', geography: 'MY', datePublished: '2023-12', dataPoint: '1.2M SMEs in Malaysia contributing 38% to GDP', verified: true, createdAt: '2024-01-10' },
    { id: 'c4', source: 'Google-Temasek-Bain e-Conomy SEA Report', url: 'https://bain.com/sea-digital-economy', type: 'industry_report', geography: 'SEA', datePublished: '2024-11', dataPoint: 'AI adoption in SEA growing at 28% CAGR', verified: true, createdAt: '2024-01-11' },
    { id: 'c5', source: 'SME Corp Malaysia — SME Annual Report', url: 'https://smecorp.gov.my/report', type: 'government', geography: 'MY', datePublished: '2023-10', dataPoint: '60% of SME failures due to cash flow mismanagement', verified: true, createdAt: '2024-01-11' },
    { id: 'c6', source: 'McKinsey Digital — Southeast Asia Tech Report', url: 'https://mckinsey.com/sea-tech', type: 'industry_report', geography: 'SEA', datePublished: '2024-08', dataPoint: 'Only 15% of ASEAN SMEs use business planning software', verified: true, createdAt: '2024-01-12' },
    { id: 'c7', source: 'Bank Negara Malaysia — Financial Stability Review', url: 'https://bnm.gov.my/fsr', type: 'financial', geography: 'MY', datePublished: '2024-09', dataPoint: 'Minimum DSCR 1.25x required for SME term loan approval', verified: true, createdAt: '2024-01-12' },
    { id: 'c8', source: 'Gartner — SaaS Market Forecast APAC', url: 'https://gartner.com/saas-apac', type: 'market_data', geography: 'SEA', datePublished: '2024-05', dataPoint: 'SaaS growth rate in APAC: 18% YoY', verified: false, createdAt: '2024-01-13' },
    { id: 'c9', source: 'OECD — SME and Entrepreneurship Outlook', url: 'https://oecd.org/sme-outlook', type: 'benchmark', geography: 'Global', datePublished: '2024-04', dataPoint: 'SME digitalization benchmark: 45% adoption rate', verified: true, createdAt: '2024-01-14' },
    { id: 'c10', source: 'IDC — ASEAN Cloud and AI Survey', url: 'https://idc.com/asean-cloud-ai', type: 'industry_report', geography: 'SEA', datePublished: '2024-07', dataPoint: 'Indonesia MSME market: 64M entities, growing 12% annually', verified: true, createdAt: '2024-01-14' },
  ],

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

  openclawChannels: [
    {
      id: 'ch1',
      type: 'whatsapp',
      name: 'WhatsApp Business (+6012345678)',
      status: 'connected',
      lastMessage: 'Terima kasih atas maklumat tersebut',
      lastMessageAt: new Date(Date.now() - 300000).toISOString(),
      messageCount: 5230,
      config: { phoneNumber: '+6012345678', businessName: 'GangNiaga AI' },
      pairedAt: '2024-11-15T08:00:00Z',
      avatarUrl: null,
    },
    {
      id: 'ch2',
      type: 'telegram',
      name: 'Telegram (@GangNiagaBot)',
      status: 'connected',
      lastMessage: 'Show me the Q4 financial summary',
      lastMessageAt: new Date(Date.now() - 900000).toISOString(),
      messageCount: 3120,
      config: { botToken: '***', username: '@GangNiagaBot' },
      pairedAt: '2024-10-20T10:30:00Z',
      avatarUrl: null,
    },
    {
      id: 'ch3',
      type: 'discord',
      name: 'Discord (GangNiaga Server)',
      status: 'connected',
      lastMessage: 'New investor inquiry from #funding channel',
      lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
      messageCount: 2890,
      config: { serverId: 'gn-2024', channelName: 'business-ops' },
      pairedAt: '2024-09-05T14:00:00Z',
      avatarUrl: null,
    },
    {
      id: 'ch4',
      type: 'slack',
      name: 'Slack (Workspace)',
      status: 'disconnected',
      lastMessage: 'Integration disconnected — re-auth required',
      lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
      messageCount: 0,
      config: { workspace: 'gangniaga.slack.com' },
      pairedAt: null,
      avatarUrl: null,
    },
    {
      id: 'ch5',
      type: 'webchat',
      name: 'WebChat (Website Widget)',
      status: 'connected',
      lastMessage: 'Hi, I need help with business plan pricing',
      lastMessageAt: new Date(Date.now() - 600000).toISOString(),
      messageCount: 1607,
      config: { widgetId: 'wc-gn-001', domain: 'gangniaga.ai' },
      pairedAt: '2024-12-01T09:00:00Z',
      avatarUrl: null,
    },
    {
      id: 'ch6',
      type: 'signal',
      name: 'Signal (+6012345678)',
      status: 'pending_approval',
      lastMessage: null,
      lastMessageAt: null,
      messageCount: 0,
      config: { phoneNumber: '+6012345678' },
      pairedAt: null,
      avatarUrl: null,
    },
  ],

  openclawPlugins: [
    {
      id: 'pl1',
      name: 'Web Search',
      version: '2.4.1',
      description: 'Real-time web search and content extraction for AI agents',
      author: 'OpenClaw Team',
      capabilities: ['tool', 'automation'],
      status: 'enabled',
      source: 'bundled',
      installedAt: '2024-10-01T00:00:00Z',
      lastUpdated: '2025-01-10T00:00:00Z',
      config: { maxResults: 10, timeout: 30000 },
    },
    {
      id: 'pl2',
      name: 'Memory Wiki',
      version: '1.8.0',
      description: 'Persistent knowledge base with semantic search and auto-indexing',
      author: 'OpenClaw Team',
      capabilities: ['memory', 'tool'],
      status: 'enabled',
      source: 'bundled',
      installedAt: '2024-10-01T00:00:00Z',
      lastUpdated: '2025-01-05T00:00:00Z',
      config: { maxEntries: 10000, indexInterval: 300 },
    },
    {
      id: 'pl3',
      name: 'Webhooks',
      version: '1.3.2',
      description: 'Outgoing webhook integration for workflow automation',
      author: 'OpenClaw Team',
      capabilities: ['automation', 'tool'],
      status: 'enabled',
      source: 'bundled',
      installedAt: '2024-10-01T00:00:00Z',
      lastUpdated: '2024-12-20T00:00:00Z',
      config: { maxRetries: 3, timeout: 10000 },
    },
    {
      id: 'pl4',
      name: 'Voice Call',
      version: '0.9.4',
      description: 'Voice calling and speech-to-text for AI phone interactions',
      author: 'ClawHub Community',
      capabilities: ['speech', 'channel'],
      status: 'installed',
      source: 'clawhub',
      installedAt: '2024-12-15T00:00:00Z',
      lastUpdated: '2024-12-15T00:00:00Z',
      config: { provider: 'twilio', language: 'en-US' },
    },
    {
      id: 'pl5',
      name: 'Image Generation',
      version: '1.1.0',
      description: 'AI image generation for pitch decks and marketing materials',
      author: 'ClawHub Community',
      capabilities: ['tool', 'automation'],
      status: 'installed',
      source: 'clawhub',
      installedAt: '2025-01-02T00:00:00Z',
      lastUpdated: '2025-01-02T00:00:00Z',
      config: { model: 'dall-e-3', size: '1024x1024' },
    },
    {
      id: 'pl6',
      name: 'PDF Tool',
      version: '2.0.3',
      description: 'PDF generation, parsing, and manipulation for business documents',
      author: 'OpenClaw Team',
      capabilities: ['tool', 'automation'],
      status: 'enabled',
      source: 'bundled',
      installedAt: '2024-10-01T00:00:00Z',
      lastUpdated: '2025-01-08T00:00:00Z',
      config: { template: 'business-pro' },
    },
    {
      id: 'pl7',
      name: 'Code Execution',
      version: '1.5.1',
      description: 'Sandboxed code execution for data analysis and automation scripts',
      author: 'OpenClaw Team',
      capabilities: ['cli_backend', 'tool'],
      status: 'enabled',
      source: 'bundled',
      installedAt: '2024-10-01T00:00:00Z',
      lastUpdated: '2024-12-28T00:00:00Z',
      config: { runtime: 'nodejs', timeout: 60000, maxMemory: 512 },
    },
    {
      id: 'pl8',
      name: 'Skill Workshop',
      version: '0.7.0',
      description: 'Create and manage custom AI skills and prompt chains',
      author: 'ClawHub Community',
      capabilities: ['automation', 'tool'],
      status: 'available',
      source: 'clawhub',
      installedAt: null,
      lastUpdated: null,
      config: {},
    },
  ],

  openclawDelegates: [
    {
      id: 'dl1',
      name: 'Finance Bot',
      email: 'finance-bot@gangniaga.ai',
      displayName: 'GangNiaga Finance Assistant',
      tier: 'tier2_send_behalf',
      status: 'active',
      channels: ['whatsapp', 'telegram', 'slack'],
      principalName: 'Sarah Chen',
      principalEmail: 'sarah.chen@gangniaga.ai',
      standingOrders: [
        'Send weekly financial summary every Monday 9 AM',
        'Alert on DSCR below 1.25x',
        'Auto-respond to invoice status queries',
      ],
      tasksCompleted: 234,
      lastActivity: new Date(Date.now() - 3600000).toISOString(),
      createdAt: '2024-10-15T00:00:00Z',
    },
    {
      id: 'dl2',
      name: 'Support Agent',
      email: 'support-bot@gangniaga.ai',
      displayName: 'GangNiaga Customer Support',
      tier: 'tier1_readonly',
      status: 'active',
      channels: ['whatsapp', 'webchat', 'telegram'],
      principalName: 'CS Team Lead',
      principalEmail: 'cs-lead@gangniaga.ai',
      standingOrders: [
        'Triage incoming support queries',
        'Escalate billing issues to human agents',
        'Provide product FAQ responses',
      ],
      tasksCompleted: 1892,
      lastActivity: new Date(Date.now() - 600000).toISOString(),
      createdAt: '2024-11-01T00:00:00Z',
    },
  ],

  openclawWebhooks: [
    {
      id: 'wh1',
      name: 'Slack Notification',
      url: 'https://hooks.slack.com/services/T0/B0/xxx',
      method: 'POST',
      events: ['agent.complete'],
      status: 'active',
      lastTriggered: new Date(Date.now() - 7200000).toISOString(),
      triggerCount: 347,
      secret: 'whsec_***',
      headers: { 'Content-Type': 'application/json' },
      createdAt: '2024-10-20T00:00:00Z',
    },
    {
      id: 'wh2',
      name: 'CRM Sync',
      url: 'https://api.hubspot.com/webhooks/v1/xxx',
      method: 'POST',
      events: ['message.received'],
      status: 'active',
      lastTriggered: new Date(Date.now() - 1800000).toISOString(),
      triggerCount: 1205,
      secret: 'whsec_***',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ***' },
      createdAt: '2024-11-05T00:00:00Z',
    },
    {
      id: 'wh3',
      name: 'Analytics Tracker',
      url: 'https://analytics.gangniaga.ai/collect',
      method: 'POST',
      events: ['workflow.done'],
      status: 'active',
      lastTriggered: new Date(Date.now() - 43200000).toISOString(),
      triggerCount: 892,
      secret: null,
      headers: { 'Content-Type': 'application/json' },
      createdAt: '2024-11-10T00:00:00Z',
    },
  ],

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
      channel: 'email',
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

  openclawSessions: [
    {
      id: 'ses1',
      channelId: 'ch1',
      channelType: 'whatsapp',
      contactName: 'Ahmad Razak',
      contactId: '+60111222333',
      messageCount: 24,
      lastMessageAt: new Date(Date.now() - 300000).toISOString(),
      status: 'active',
      createdAt: '2025-01-10T08:00:00Z',
    },
    {
      id: 'ses2',
      channelId: 'ch2',
      channelType: 'telegram',
      contactName: 'Lim Wei Ming',
      contactId: 'tg_lwm_001',
      messageCount: 18,
      lastMessageAt: new Date(Date.now() - 900000).toISOString(),
      status: 'active',
      createdAt: '2025-01-09T14:30:00Z',
    },
    {
      id: 'ses3',
      channelId: 'ch3',
      channelType: 'discord',
      contactName: 'Investor_Dave',
      contactId: 'discord_id_456',
      messageCount: 12,
      lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
      status: 'active',
      createdAt: '2025-01-08T16:00:00Z',
    },
    {
      id: 'ses4',
      channelId: 'ch5',
      channelType: 'webchat',
      contactName: 'Website Visitor #4521',
      contactId: 'wc_4521',
      messageCount: 6,
      lastMessageAt: new Date(Date.now() - 600000).toISOString(),
      status: 'active',
      createdAt: '2025-01-12T11:20:00Z',
    },
    {
      id: 'ses5',
      channelId: 'ch1',
      channelType: 'whatsapp',
      contactName: 'Siti Nurhaliza',
      contactId: '+60199888777',
      messageCount: 42,
      lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'compacted',
      createdAt: '2025-01-05T09:15:00Z',
    },
  ],

  openclawSoul: {
    personality: 'Professional, knowledgeable, and supportive business AI assistant',
    tone: 'formal yet friendly',
    language: 'en-US',
    specialty: 'Business planning, financial analysis, and market research for ASEAN SMEs',
    greeting: 'Hello! I\'m GangNiaga AI, your autonomous business assistant. How can I help you today?',
    rules: [
      'Always respond in the language the user writes in (Bahasa Melayu, English, or others)',
      'Provide data-driven answers with citations when possible',
      'Never share sensitive financial data without verification',
      'Proactively suggest relevant business insights when patterns are detected',
      'Escalate critical financial anomalies to human principals immediately',
    ],
  },

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
