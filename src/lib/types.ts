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

export interface BusinessPlanData {
  id: string;
  title: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  sections: {
    executiveSummary?: string;
    marketAnalysis?: string;
    swotAnalysis?: string;
    competitorAnalysis?: string;
    financialPlan?: string;
    riskAnalysis?: string;
    recommendations?: string;
  };
  createdAt: string;
  updatedAt: string;
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
