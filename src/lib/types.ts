export type ModuleId = 
  | 'dashboard' 
  | 'business-plans' 
  | 'financials' 
  | 'agents' 
  | 'workflows' 
  | 'memory' 
  | 'reports' 
  | 'settings'
  | 'copilot'
  | 'idea-canvas'
  | 'plan-review'
  | 'plan-actuals'
  | 'pitch-deck'
  | 'research'
  | 'openclaw';

export type ProposalType = 
  | 'bank_loan' 
  | 'government_grant' 
  | 'angel_investor' 
  | 'venture_capital' 
  | 'sme_financing' 
  | 'corporate_partnership';

export interface KPIData {
  metric: string;
  value: number;
  previousValue: number;
  target: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  revenue?: number;
  expenses?: number;
  profit?: number;
  value?: number;
  [key: string]: string | number | undefined;
}

export interface AgentInfo {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  tasksCompleted: number;
  lastActivity: string;
}

export interface TaskInfo {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: string;
  output?: string;
  duration?: number;
  createdAt: string;
}

export interface WorkflowInfo {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  triggerType: string;
  steps?: WorkflowStep[];
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent?: string;
  tool?: string;
}

export interface MemoryEntry {
  id: string;
  type: 'user' | 'workspace' | 'financial' | 'workflow' | 'agent';
  category: string;
  content: string;
  createdAt: string;
}

// ── Professional 21-Section Business Proposal Structure ──

export type ProposalSectionKey =
  | 'coverPage'
  | 'executiveSummary'
  | 'companyOverview'
  | 'problemStatement'
  | 'solutionProduct'
  | 'marketAnalysis'
  | 'industryResearch'
  | 'competitorAnalysis'
  | 'businessModel'
  | 'revenueStreams'
  | 'goToMarketStrategy'
  | 'operationsPlan'
  | 'technologySystem'
  | 'managementTeam'
  | 'financialForecast'
  | 'fundingRequirement'
  | 'useOfFunds'
  | 'riskAnalysis'
  | 'swotAnalysis'
  | 'exitStrategy'
  | 'appendices';

export interface ProposalSections {
  coverPage?: string;
  executiveSummary?: string;
  companyOverview?: string;
  problemStatement?: string;
  solutionProduct?: string;
  marketAnalysis?: string;
  industryResearch?: string;
  competitorAnalysis?: string;
  businessModel?: string;
  revenueStreams?: string;
  goToMarketStrategy?: string;
  operationsPlan?: string;
  technologySystem?: string;
  managementTeam?: string;
  financialForecast?: string;
  fundingRequirement?: string;
  useOfFunds?: string;
  riskAnalysis?: string;
  swotAnalysis?: string;
  exitStrategy?: string;
  appendices?: string;
}

export interface BusinessPlanData {
  id: string;
  title: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  proposalType: ProposalType;
  industry: string;
  sections: ProposalSections;
  createdAt: string;
  updatedAt: string;
}

export interface UseOfFundsItem {
  category: string;
  amount: number;
  percentage: number;
  description: string;
}

export interface CompetitorRow {
  name: string;
  strength: string;
  weakness: string;
  marketShare?: string;
}

export interface ReportData {
  id: string;
  title: string;
  type: 'investor' | 'board' | 'financial' | 'kpi' | 'operational';
  status: 'generating' | 'completed' | 'failed';
  format: 'pdf' | 'docx' | 'xlsx' | 'csv';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'image' | 'search' | 'skill';
  imageBase64?: string;
  searchResults?: SearchResultItem[];
  skillName?: string;
  isPlaying?: boolean;
}

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

export interface CopilotSkill {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  triggerPhrase: string | null;
  tags: string[];
}

export interface CopilotMemory {
  id: string;
  key: string;
  content: string;
  type: string;
  importance: number;
}

export interface ForecastData {
  id: string;
  name: string;
  type: 'revenue' | 'expense' | 'cashflow' | 'profit';
  period: string;
  data: ChartDataPoint[];
}

// ── NEW: Idea Canvas & Validation Engine ──

export interface IdeaCanvasData {
  id: string;
  title: string;
  status: 'draft' | 'validating' | 'validated' | 'needs_rework';
  problem: string;
  solution: string;
  targetMarket: string;
  revenueModel: string;
  competitiveEdge: string;
  risks: string[];
  validationScore: number; // 0-100
  validationReport: ValidationReport | null;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationReport {
  overallScore: number;
  marketViability: number;
  problemClarity: number;
  solutionFeasibility: number;
  revenuePotential: number;
  competitivePosition: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  redFlags: string[];
  benchmarkComparison: {
    metric: string;
    user: number;
    benchmark: number;
    status: 'above' | 'below' | 'at';
  }[];
}

// ── NEW: Plan Review Agent ──

export interface PlanReviewData {
  id: string;
  planId: string;
  status: 'pending' | 'running' | 'completed';
  lenderPersona: 'bank' | 'investor' | 'grant_officer';
  narrativeScore: number;
  financialScore: number;
  consistencyScore: number;
  overallScore: number;
  discrepancies: Discrepancy[];
  recommendations: ReviewRecommendation[];
  fullReport: string | null;
  createdAt: string;
}

export interface Discrepancy {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  section: string;
  description: string;
  narrativeClaim: string;
  financialReality: string;
  suggestedFix: string;
}

export interface ReviewRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
  impact: string;
}

// ── NEW: Plan vs Actuals ──

export interface PlanActualData {
  id: string;
  category: 'revenue' | 'expense' | 'cashflow' | 'profit';
  period: string;
  plannedAmount: number;
  actualAmount: number | null;
  variance: number | null;
  variancePercent: number | null;
  source: 'manual' | 'quickbooks' | 'xero';
}

export interface IntegrationData {
  type: 'quickbooks' | 'xero' | 'manual';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  syncFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface VarianceAlert {
  id: string;
  category: string;
  period: string;
  type: 'revenue_drift' | 'expense_over' | 'cashflow_warning' | 'hire_affordability';
  message: string;
  severity: 'critical' | 'warning' | 'info';
  amount: number;
}

// ── NEW: Pitch Deck ──

export interface PitchDeckData {
  id: string;
  title: string;
  status: 'draft' | 'generating' | 'completed';
  planId: string | null;
  templateType: 'investor' | 'bank' | 'grant';
  slides: PitchSlide[];
  slideCount: number;
  anticipatedQuestions: AnticipatedQuestion[];
  createdAt: string;
}

export interface PitchSlide {
  id: string;
  order: number;
  title: string;
  type: 'title' | 'problem' | 'solution' | 'market' | 'business_model' | 'financials' | 'team' | 'ask' | 'appendix';
  content: string;
  dataPoints?: Record<string, string | number>;
  linkedSection?: string;
}

export interface AnticipatedQuestion {
  id: string;
  question: string;
  category: string;
  suggestedAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ── NEW: Citations ──

export interface CitationData {
  id: string;
  source: string;
  url: string | null;
  type: 'market_data' | 'industry_report' | 'benchmark' | 'government' | 'financial';
  geography: string | null;
  datePublished: string | null;
  dataPoint: string | null;
  verified: boolean;
  createdAt: string;
}

// ── OpenClaw Integration ──

export type OpenClawChannelType = 
  | 'whatsapp' | 'telegram' | 'discord' | 'slack' | 'signal' 
  | 'imessage' | 'webchat' | 'matrix' | 'msteams' | 'googlechat'
  | 'line' | 'wechat' | 'zalo' | 'irc' | 'feishu' | 'nostr'
  | 'mattermost' | 'twitch' | 'qqbot' | 'nextcloud-talk';

export type OpenClawChannelStatus = 'connected' | 'disconnected' | 'connecting' | 'error' | 'pending_approval';

export interface OpenClawChannel {
  id: string;
  type: OpenClawChannelType;
  name: string;
  status: OpenClawChannelStatus;
  lastMessage: string | null;
  lastMessageAt: string | null;
  messageCount: number;
  config: Record<string, string>; // e.g., { botToken: '***', phoneNumber: '+60...' }
  pairedAt: string | null;
  avatarUrl: string | null;
}

export type GatewayStatus = 'running' | 'stopped' | 'starting' | 'error' | 'unconfigured';

export interface OpenClawGateway {
  id: string;
  status: GatewayStatus;
  bindHost: string;
  bindPort: number;
  uptime: number; // seconds
  connectedClients: number;
  activeChannels: number;
  totalMessages: number;
  lastHealthCheck: string | null;
  version: string | null;
  config: {
    authMode: 'shared_secret' | 'trusted_proxy' | 'loopback_only';
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    maxSessions: number;
    sessionTimeout: number; // minutes
  };
}

export type PluginCapability = 'text_inference' | 'cli_backend' | 'speech' | 'channel' | 'tool' | 'memory' | 'automation';

export interface OpenClawPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  capabilities: PluginCapability[];
  status: 'installed' | 'enabled' | 'disabled' | 'error' | 'available';
  source: 'bundled' | 'clawhub' | 'local';
  installedAt: string | null;
  lastUpdated: string | null;
  config: Record<string, unknown>;
}

export type DelegateTier = 'tier1_readonly' | 'tier2_send_behalf' | 'tier3_proactive';

export interface OpenClawDelegate {
  id: string;
  name: string;
  email: string;
  displayName: string;
  tier: DelegateTier;
  status: 'active' | 'inactive' | 'suspended' | 'setup';
  channels: OpenClawChannelType[];
  principalName: string;
  principalEmail: string;
  standingOrders: string[];
  tasksCompleted: number;
  lastActivity: string | null;
  createdAt: string;
}

export interface OpenClawWebhook {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'GET' | 'PUT';
  events: string[]; // e.g., ['agent.complete', 'message.received', 'workflow.done']
  status: 'active' | 'inactive' | 'error';
  lastTriggered: string | null;
  triggerCount: number;
  secret: string | null;
  headers: Record<string, string>;
  createdAt: string;
}

export interface OpenClawScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  status: 'active' | 'paused' | 'error' | 'completed';
  agentId: string | null;
  prompt: string;
  channel: OpenClawChannelType | null;
  lastRun: string | null;
  nextRun: string | null;
  runCount: number;
  createdAt: string;
}

export interface OpenClawSession {
  id: string;
  channelId: string;
  channelType: OpenClawChannelType;
  contactName: string;
  contactId: string;
  messageCount: number;
  lastMessageAt: string;
  status: 'active' | 'compacted' | 'archived';
  createdAt: string;
}

export interface OpenClawSoulConfig {
  personality: string;
  tone: string;
  language: string;
  specialty: string;
  greeting: string;
  rules: string[];
}
