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
      content: 'Welcome to GangNiaga AI OS! I\'m your autonomous business assistant. I can help you create professional business proposals for bank loans, government grants, angel investors, VCs, and more. How can I assist you today?',
      timestamp: new Date().toISOString(),
    }
  ],
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
  chatLoading: false,
  setChatLoading: (loading) => set({ chatLoading: loading }),

  // Dashboard KPIs — includes bank-friendly metrics
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
    { id: '1', type: 'workspace', category: 'Company Profile', content: 'GangNiaga is a SaaS startup founded in 2024, targeting Southeast Asian SME market with AI-powered business operations platform. Current team size: 12. Seed round: RM11.5M.', createdAt: '2024-01-10' },
    { id: '2', type: 'financial', category: 'Revenue Model', content: 'Primary revenue: SaaS subscriptions (Tier 1: RM199/mo, Tier 2: RM599/mo, Tier 3: RM1,999/mo). Secondary: Professional services and custom integrations.', createdAt: '2024-01-11' },
    { id: '3', type: 'user', category: 'User Preference', content: 'Dashboard layout preference: compact view with KPI cards. Favorite modules: Financial Forecasting, Agent Console.', createdAt: '2024-01-12' },
    { id: '4', type: 'workflow', category: 'Automation History', content: 'Weekly KPI reports have been successfully automated for 8 consecutive weeks. Average time saved: 4.5 hours/week.', createdAt: '2024-01-13' },
    { id: '5', type: 'agent', category: 'Agent Context', content: 'Business Analyst agent has been trained on Southeast Asian market data. Specializes in SaaS metrics and growth analysis.', createdAt: '2024-01-14' },
    { id: '6', type: 'workspace', category: 'Market Intelligence', content: 'Key competitors: LivePlan (traditional business planning), Notion (collaboration), Monday.com (project management). Differentiator: AI-autonomous execution.', createdAt: '2024-01-15' },
    { id: '7', type: 'financial', category: 'DSCR Status', content: 'Current Debt Service Coverage Ratio: 1.45x. Bank minimum requirement: 1.25x. Target: 1.50x. Improvement trajectory positive — up from 1.22x last quarter.', createdAt: '2024-01-15' },
  ],

  // Business Plans — with 21-section professional proposal structure
  plans: [
    {
      id: '1',
      title: 'GangNiaga AI OS — Bank Loan Proposal (RM2M)',
      status: 'completed',
      proposalType: 'bank_loan',
      industry: 'SaaS / Software',
      sections: {
        coverPage: '**GANGNIAGA AI OS**\nAutonomous AI Business Operating System\n\nBusiness Proposal for Bank Financing\nLoan Amount: RM2,000,000\nPrepared: January 2025\n\nGangNiaga Sdn Bhd (Reg. No. 2024012345)',
        executiveSummary: '**GangNiaga AI OS** is Southeast Asia\'s first autonomous AI-powered business operating system, designed specifically for SMEs across the ASEAN region. We are seeking RM2,000,000 in term loan financing to accelerate product development and market expansion.\n\n**Key Highlights:**\n- Current MRR: RM620K (ARR: RM7.4M)\n- 18-month runway with current burn rate\n- DSCR: 1.45x (above bank minimum of 1.25x)\n- 97% of ASEAN businesses are SMEs, yet less than 15% use business planning software\n- Projected revenue growth: 132% YoY\n- Break-even projected: Q3 2025\n\n**Why Now:** AI adoption in Southeast Asia is accelerating at 28% CAGR. The window for market leadership in AI-autonomous business operations is narrowing — first mover advantage is critical.',
        companyOverview: '**Company Background:**\nGangNiaga Sdn Bhd was incorporated in January 2024 under the Companies Act 2016. The company operates as a SaaS platform providing AI-powered business planning, financial forecasting, and autonomous workflow execution.\n\n**Registration:** SSM Reg. No. 2024012345\n**Legal Structure:** Private Limited Company (Sdn Bhd)\n**Ownership:**\n- CEO: 60% equity\n- CTO: 25% equity\n- ESOP Pool: 15% equity\n\n**Mission:** To democratize AI-powered business operations for every SME in Southeast Asia.\n\n**Vision:** To become the region\'s leading AI business operating system by 2027.\n\n**Milestones Achieved:**\n- Q1 2024: Product MVP launched\n- Q2 2024: 100 paying customers\n- Q3 2024: RM2.5M seed funding secured\n- Q4 2024: 500+ customers, RM7.4M ARR',
        problemStatement: '**70% of SMEs in Malaysia still perform financial forecasting manually.** This results in inaccurate projections, delayed decision-making, and increased business failure rates.\n\nThe core problems:\n- **Manual business planning:** SMEs spend 15+ hours weekly on tasks that could be automated\n- **Fragmented tools:** Average SME uses 7+ disconnected tools for operations\n- **No AI access:** Enterprise-grade AI is unaffordable for SMEs (RM10K+/month)\n- **Poor financial literacy:** 60% of SME failures are due to cash flow mismanagement\n- **Regional gap:** Existing solutions are built for Western markets with no ASEAN localization',
        solutionProduct: '**GangNiaga AI OS** — An autonomous AI business operating system that plans, analyzes, automates, and executes real business workflows.\n\n**Core Capabilities:**\n- AI Business Plan Generator — Professional 21-section proposals in minutes\n- Financial Forecasting Engine — Revenue, expenses, cash flow, P&L with AI advisor\n- Multi-Agent System — Autonomous AI workers that execute business tasks\n- Browser Automation — AI agents that interact with websites and extract data\n- Workflow Engine — Scheduled and event-triggered automations\n- Persistent Memory — Long-term organizational intelligence\n- KPI Dashboard — Real-time business intelligence with AI insights\n\n**Differentiation:** No other platform offers autonomous AI execution. Competitors are passive tools — GangNiaga is an active AI business partner.\n\n**Value Proposition:** Replace 7+ tools with 1 AI-powered platform. Save 20+ hours/week. Make better decisions with AI-driven insights.',
        marketAnalysis: '**TAM (Total Addressable Market):** USD12.4B — Southeast Asian SaaS market by 2027\n**SAM (Serviceable Available Market):** USD3.8B — ASEAN SME business management software\n**SOM (Serviceable Obtainable Market):** USD190M — AI-powered business operations for ASEAN SMEs\n\n**Market Drivers:**\n- ASEAN SME digitalization push (government mandates)\n- AI adoption growing 28% CAGR in the region\n- Post-COVID shift to cloud-based business tools\n- Mobile-first market aligned with our platform\n\n**Target Segments:**\n1. Startup founders (RM199-599/mo tier)\n2. SME operators (RM599-1,999/mo tier)\n3. Enterprise teams (custom pricing)',
        competitorAnalysis: '**Competitive Landscape:**\n\n**LivePlan** — Traditional business planning\n- Strength: Mature forecasting tools, bank-accepted templates\n- Weakness: No AI, no automation, Western-focused\n- Market Share: ~15% of SEA business planning market\n\n**Upmetrics** — AI-assisted planning\n- Strength: AI writing tools, modern UI\n- Weakness: Limited workflows, no agent system, no ASEAN localization\n- Market Share: ~5%\n\n**Notion / Monday.com** — General productivity\n- Strength: Large user base, strong brand\n- Weakness: Not purpose-built for business planning, no financial engine\n- Market Share: ~25% (general productivity)\n\n**GangNiaga Competitive Moat:** Multi-agent autonomous execution, ASEAN-first design, integrated financial engine, persistent AI memory. No competitor offers all four.',
        businessModel: '**Revenue Model:**\n\n1. **SaaS Subscriptions** (70% of revenue)\n   - Starter: RM199/mo — Basic planning + dashboard\n   - Professional: RM599/mo — Full AI features + forecasting\n   - Enterprise: RM1,999/mo — Multi-agent + custom integrations\n\n2. **AI Usage Billing** (15% of revenue)\n   - Per-agent execution credits\n   - Browser automation sessions\n   - Advanced AI analysis requests\n\n3. **Professional Services** (10% of revenue)\n   - Custom implementation\n   - Training and onboarding\n   - White-label deployments\n\n4. **Marketplace Commissions** (5% of revenue)\n   - Third-party agent skills\n   - Integration connectors\n   - Template marketplace',
        revenueStreams: '**Current Revenue Breakdown (Monthly):**\n\n- Starter Plan (380 users): RM75,620\n- Professional Plan (85 users): RM50,915\n- Enterprise Plan (12 accounts): RM23,988\n- AI Usage Credits: RM21,420\n- Professional Services: RM14,280\n- Marketplace: RM7,140\n\n**Total MRR: RM193,343**\n**Projected MRR (12 months): RM420,000**\n\n**Unit Economics:**\n- LTV: RM19,200 (avg 32-month retention)\n- CAC: RM2,560\n- LTV:CAC Ratio: 7.5:1\n- Payback Period: 4.2 months',
        goToMarketStrategy: '**Customer Acquisition Strategy:**\n\n1. **Digital Marketing** (40% of marketing budget)\n   - SEO content targeting "business plan Malaysia", "financial forecast SME"\n   - Google Ads & LinkedIn Ads for B2B\n   - Webinar series: "AI untuk Bisnes Malaysia"\n\n2. **Partnership Channel** (30% of marketing budget)\n   - Accounting firms (referral program)\n   - SME Corp Malaysia partnership\n   - Bank partnerships (MUDAH, TEKUN)\n   - Chamber of Commerce networks\n\n3. **Product-Led Growth** (20% of marketing budget)\n   - Free AI business assessment tool\n   - Community template library\n   - Referral program (1 month free per referral)\n\n4. **Direct Sales** (10% of marketing budget)\n   - Enterprise sales team (3 reps)\n   - Demo-first approach\n   - ROI calculator custom presentations',
        operationsPlan: '**Operational Structure:**\n\n**Current Team:** 12 people\n- Engineering: 6\n- Product & Design: 2\n- Sales & Marketing: 2\n- Operations: 1\n- Leadership: 1\n\n**Scaling Plan (with loan funding):**\n- Q1 2025: Hire 4 engineers, 2 sales reps\n- Q2 2025: Hire 3 customer success, 1 finance manager\n- Q3 2025: Open Indonesia office (5-person team)\n- Q4 2025: Thailand market entry (3-person team)\n\n**Execution Model:**\n- 2-week sprint cycles\n- CI/CD deployment pipeline\n- 99.9% uptime SLA for enterprise\n- 24/7 AI agent availability\n\n**Infrastructure:**\n- AWS Asia Pacific (Singapore region)\n- Multi-region deployment for latency\n- SOC 2 Type II compliance target: Q2 2025',
        technologySystem: '**Technology Architecture:**\n\n**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS\n**Backend:** Node.js, NestJS, Prisma ORM, PostgreSQL\n**AI Stack:** OpenAI GPT-4, LangGraph multi-agent, pgvector memory\n**Browser Automation:** Playwright, Chrome DevTools Protocol\n**Infrastructure:** AWS, Docker, Kubernetes, CloudFlare CDN\n\n**AI Systems:**\n- Agent Orchestrator — Routes tasks to specialized AI agents\n- Memory Engine — Persistent vector-store organizational intelligence\n- Skill Runtime — Modular execution capabilities\n- Financial Engine — Real-time forecasting and analysis\n\n**Security:**\n- End-to-end encryption (AES-256)\n- SOC 2 Type II in progress\n- GDPR & PDPA compliance\n- Isolated browser sandboxing\n- Multi-tenant data isolation\n\n**Scalability:**\n- Horizontal auto-scaling\n- Distributed queue (BullMQ)\n- Edge caching via CloudFlare\n- Sub-300ms API response target',
        managementTeam: '**Leadership Team:**\n\n**CEO — Ahmad Razak**\n- 12 years in enterprise SaaS (ex-Microsoft, ex-SAP)\n- MBA from INSEAD\n- Previous startup: Acquired for RM45M\n- Responsibilities: Strategy, fundraising, partnerships\n\n**CTO — Sarah Lim**\n- 10 years in AI/ML engineering (ex-Grab, ex-Shopee)\n- PhD in Computer Science (NUS)\n- 3 published papers on multi-agent systems\n- Responsibilities: Product, engineering, AI strategy\n\n**Advisory Board:**\n- Former Deputy Governor, Bank Negara Malaysia\n- Partner, McKinsey Digital (Southeast Asia)\n- Founder, regional fintech unicorn\n\n**Key Hires Needed:**\n- VP of Sales (ASEAN experience required)\n- Head of Compliance (banking/finance background)',
        financialForecast: '**3-Year Financial Projections:**\n\n**Year 1 (2025):**\n- Revenue: RM8.9M | Expenses: RM6.2M | Net Income: RM2.7M\n- Gross Margin: 82% | EBITDA Margin: 30%\n\n**Year 2 (2026):**\n- Revenue: RM22.4M | Expenses: RM11.8M | Net Income: RM10.6M\n- Gross Margin: 85% | EBITDA Margin: 47%\n\n**Year 3 (2027):**\n- Revenue: RM56.2M | Expenses: RM22.4M | Net Income: RM33.8M\n- Gross Margin: 87% | EBITDA Margin: 60%\n\n**Key Financial Metrics:**\n- Break-even: Q3 2025\n- Monthly Burn Rate: RM520K (declining)\n- Runway: 18 months (without loan)\n- DSCR: 1.45x (current), projected 2.1x by Year 2\n- Cash Flow from Operations: RM2.1M (Year 1)\n\n**Debt Service Coverage Ratio (DSCR):**\n- Net Operating Income: RM4.5M/year\n- Annual Debt Obligation: RM3.1M/year (RM2M loan @ 8% over 5 years)\n- Current DSCR: 1.45x\n- Projected DSCR (Year 2): 2.1x',
        fundingRequirement: '**Funding Amount: RM2,000,000**\n\n**Type:** Term Loan (5-year tenure)\n\n**Purpose:**\nThis loan will fund our regional expansion across Southeast Asia, specifically to accelerate product development for bank-grade financial compliance and expand into Indonesia and Thailand markets.\n\n**Why This Amount:**\n- Provides 12 months of strategic runway beyond current cash\n- Enables key hires for compliance and regional teams\n- Funds market entry into 2 new ASEAN markets\n- Maintains DSCR above 1.25x throughout loan period\n\n**Repayment Capability:**\n- Current cash flow from operations: RM2.1M/year\n- Projected cash flow (Year 2): RM5.4M/year\n- DSCR remains above 1.25x in all scenarios\n- Break-even already achieved in current operations',
        useOfFunds: '**Use of Funds Breakdown:**\n\n1. **Product Development** — RM750K (37.5%)\n   - Bank-grade compliance features\n   - Multi-currency financial engine\n   - PDPA/GDPR compliance module\n   - 4 additional engineers\n\n2. **Market Expansion** — RM500K (25%)\n   - Indonesia market entry\n   - Thailand market entry\n   - Localization (Bahasa Indonesia, Thai)\n   - Regional marketing campaigns\n\n3. **Sales & Marketing** — RM350K (17.5%)\n   - Partnership development (banks, SME Corp)\n   - Content marketing & SEO\n   - Sales team expansion\n   - Conference sponsorships\n\n4. **Operations & Infrastructure** — RM250K (12.5%)\n   - AWS scaling\n   - SOC 2 certification\n   - Compliance infrastructure\n   - Office setup (Jakarta)\n\n5. **Working Capital** — RM150K (7.5%)\n   - Cash flow buffer\n   - Emergency reserve\n   - Contingency fund',
        riskAnalysis: '**Risk Assessment & Mitigation:**\n\n**Market Risk (Medium)**\n- Risk: ASEAN market adoption slower than projected\n- Mitigation: Staged market entry, freemium model, government partnership pipeline\n\n**Financial Risk (Low-Medium)**\n- Risk: Revenue concentration in top 10 accounts (28% of MRR)\n- Mitigation: Diversifying customer base, expanding mid-market segment\n\n**Operational Risk (Low)**\n- Risk: Key person dependency (CEO/CTO)\n- Mitigation: Building management bench, documenting processes, advisory board\n\n**AI/Technology Risk (Medium)**\n- Risk: AI regulation changes impacting product\n- Mitigation: Multi-model AI architecture, compliance-first design, regulatory advisory board member\n\n**Cybersecurity Risk (Medium)**\n- Risk: Data breach or security incident\n- Mitigation: SOC 2 Type II certification, encrypted data at rest/transit, regular penetration testing, bug bounty program\n\n**Competitive Risk (Low-Medium)**\n- Risk: Global SaaS players entering ASEAN market\n- Mitigation: Regional moat (localization, partnerships), first-mover advantage, proprietary AI memory system',
        swotAnalysis: '**STRENGTHS:**\n- AI-autonomous execution (unique globally)\n- Multi-agent orchestration architecture\n- ASEAN-first design and localization\n- Strong technical team (ex-Grab, ex-Microsoft)\n- 500+ paying customers in 8 months\n- DSCR above bank minimum\n\n**WEAKNESSES:**\n- Early-stage company (less than 2 years)\n- Limited brand recognition outside Malaysia\n- Revenue concentration in top accounts\n- Small team for regional ambitions\n\n**OPPORTUNITIES:**\n- 65M SMEs across ASEAN\n- Government push for SME digitalization\n- AI adoption accelerating 28% CAGR\n- Bank partnership channel untapped\n- Indonesia market (270M population)\n\n**THREATS:**\n- Global SaaS players expanding to SEA\n- AI regulatory uncertainty\n- Talent competition from big tech\n- Currency fluctuation (RM/USD)\n- Economic slowdown affecting SME spending',
        exitStrategy: '**Potential Exit Scenarios:**\n\n1. **Strategic Acquisition (Most Likely)**\n   - Target acquirers: Sage, Xero, Freshworks, regional tech conglomerates\n   - Expected timeline: Year 4-6\n   - Target valuation: 8-12x ARR (RM180M-RM670M)\n\n2. **Regional Expansion & Growth**\n   - Expand to 6 ASEAN markets\n   - Reach RM56M+ ARR by Year 3\n   - Position for Series B/C or IPO on Bursa Malaysia\n\n3. **Secondary Sale**\n   - Early investors can exit via secondary transactions\n   - Typical discount: 15-20% to primary valuation\n\n**Investment Moat Protection:**\n- Proprietary AI memory system (hard to replicate)\n- ASEAN-specific training data (regulatory advantage)\n- Bank partnership agreements (distribution moat)\n- Customer switching costs (data lock-in with persistent memory)',
        appendices: '**Appendix A:** Detailed financial statements (P&L, Balance Sheet, Cash Flow)\n**Appendix B:** Customer testimonials and case studies\n**Appendix C:** Technical architecture diagrams\n**Appendix D:** SSM registration and company documents\n**Appendix E:** Team resumes and credentials\n**Appendix F:** Market research data sources\n**Appendix G:** Bank partnership term sheets\n**Appendix H:** Product roadmap 2025-2027\n**Appendix I:** Intellectual property filings\n**Appendix J:** Compliance certifications roadmap',
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
        executiveSummary: 'Following strong seed-stage traction with RM7.4M ARR and 500+ customers, GangNiaga is raising USD5M Series A to dominate the ASEAN AI business operations market. Our multi-agent autonomous platform is the only solution that doesn\'t just plan — it executes.',
        marketAnalysis: 'TAM: USD12.4B | SAM: USD3.8B | SOM: USD190M. The AI adoption wave in ASEAN is our window — 28% CAGR means the market doubles every 2.5 years.',
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
}));
