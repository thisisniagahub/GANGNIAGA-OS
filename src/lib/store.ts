import { create } from 'zustand';
import type { ModuleId, ChatMessage, KPIData, ChartDataPoint, AgentInfo, TaskInfo, WorkflowInfo, MemoryEntry, BusinessPlanData, ReportData } from './types';

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
      content: 'Welcome to GangNiaga AI OS! I\'m your autonomous business assistant. I can help you with business planning, financial forecasting, workflow automation, and much more. How can I assist you today?',
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
    { metric: 'MRR', value: 142800, previousValue: 128500, target: 160000, unit: 'currency', change: 11.1, trend: 'up' },
    { metric: 'Customer Churn', value: 3.2, previousValue: 4.1, target: 2.0, unit: 'percent', change: -22.0, trend: 'down' },
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
  ],
  selectedAgent: null,
  setSelectedAgent: (id) => set({ selectedAgent: id }),
  agentTasks: [
    { id: '1', type: 'Market Analysis', status: 'completed', input: 'Analyze SaaS market trends Q4 2024', output: 'Market analysis complete. SaaS growth rate at 18% YoY...', duration: 12, createdAt: '10:30 AM' },
    { id: '2', type: 'Financial Forecast', status: 'completed', input: 'Generate Q1 2025 revenue forecast', output: 'Based on current trajectory, Q1 revenue projected at $920K...', duration: 8, createdAt: '10:45 AM' },
    { id: '3', type: 'Competitor Research', status: 'running', input: 'Monitor competitor pricing changes', output: undefined, duration: undefined, createdAt: '11:00 AM' },
    { id: '4', type: 'KPI Report', status: 'pending', input: 'Generate weekly KPI summary', output: undefined, duration: undefined, createdAt: '11:15 AM' },
    { id: '5', type: 'Risk Assessment', status: 'pending', input: 'Analyze financial risk exposure', output: undefined, duration: undefined, createdAt: '11:30 AM' },
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
    { id: '1', type: 'workspace', category: 'Company Profile', content: 'GangNiaga is a SaaS startup founded in 2024, targeting Southeast Asian SME market with AI-powered business operations platform. Current team size: 12. Seed round: $2.5M.', createdAt: '2024-01-10' },
    { id: '2', type: 'financial', category: 'Revenue Model', content: 'Primary revenue: SaaS subscriptions (Tier 1: $49/mo, Tier 2: $149/mo, Tier 3: $499/mo). Secondary: Professional services and custom integrations.', createdAt: '2024-01-11' },
    { id: '3', type: 'user', category: 'User Preference', content: 'Dashboard layout preference: compact view with KPI cards. Favorite modules: Financial Forecasting, Agent Console.', createdAt: '2024-01-12' },
    { id: '4', type: 'workflow', category: 'Automation History', content: 'Weekly KPI reports have been successfully automated for 8 consecutive weeks. Average time saved: 4.5 hours/week.', createdAt: '2024-01-13' },
    { id: '5', type: 'agent', category: 'Agent Context', content: 'Business Analyst agent has been trained on Southeast Asian market data. Specializes in SaaS metrics and growth analysis.', createdAt: '2024-01-14' },
    { id: '6', type: 'workspace', category: 'Market Intelligence', content: 'Key competitors: LivePlan (traditional business planning), Notion (collaboration), Monday.com (project management). Differentiator: AI-autonomous execution.', createdAt: '2024-01-15' },
    { id: '7', type: 'financial', category: 'Burn Rate History', content: 'Monthly burn rate decreased from $210K (Sep 2024) to $187K (Dec 2024). Primary reduction from infrastructure optimization.', createdAt: '2024-01-15' },
  ],

  // Business Plans
  plans: [
    {
      id: '1',
      title: 'GangNiaga AI OS — Seed Round Pitch',
      status: 'completed',
      sections: {
        executiveSummary: 'GangNiaga AI OS is Southeast Asia\'s first autonomous AI business operating system, combining business planning, financial forecasting, and AI agent execution into one unified platform. We\'re seeking $2.5M in seed funding to scale our platform across the ASEAN market.',
        marketAnalysis: 'The Southeast Asian SaaS market is projected to reach $12.4B by 2027, with a CAGR of 28%. SMEs represent 97% of all businesses in ASEAN, yet less than 15% use any business planning software.',
        swotAnalysis: 'Strengths: AI-autonomous execution, multi-agent architecture, regional expertise. Weaknesses: Early stage, limited brand recognition. Opportunities: Underserved ASEAN SME market, AI adoption acceleration. Threats: Global SaaS players expanding to SEA, regulatory changes.',
        competitorAnalysis: 'Key competitors include LivePlan (traditional planning), Causal (financial modeling), and ClickUp (operations). None offer autonomous AI execution or multi-agent orchestration.',
        financialPlan: 'Projected ARR: $1.7M (Year 1), $5.2M (Year 2), $14.8M (Year 3). Unit economics: LTV $4,800, CAC $640, LTV:CAC ratio 7.5:1.',
        riskAnalysis: 'Key risks: AI regulation changes, market adoption speed, talent competition, infrastructure costs. Mitigation: Diversified AI providers, staged rollout, competitive compensation.',
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Series A Growth Strategy',
      status: 'in_progress',
      sections: {
        executiveSummary: 'Following strong seed-stage traction, GangNiaga is positioned for Series A funding to accelerate product development and market expansion across Southeast Asia.',
      },
      createdAt: '2024-01-14',
      updatedAt: '2024-01-15',
    },
    {
      id: '3',
      title: 'Market Entry: Indonesia & Thailand',
      status: 'draft',
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
}));
