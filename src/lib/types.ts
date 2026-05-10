export type ModuleId = 
  | 'dashboard' 
  | 'business-plans' 
  | 'financials' 
  | 'agents' 
  | 'workflows' 
  | 'memory' 
  | 'reports' 
  | 'settings'
  | 'copilot';

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
}

export interface ForecastData {
  id: string;
  name: string;
  type: 'revenue' | 'expense' | 'cashflow' | 'profit';
  period: string;
  data: ChartDataPoint[];
}
