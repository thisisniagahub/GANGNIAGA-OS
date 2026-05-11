# GangNiaga AI OS — Agent System Document

> **Version:** v0.3.0  
> **Last Updated:** March 2025  
> **Scope:** Multi-Agent AI architecture, orchestration, memory, and integration patterns

---

## Table of Contents

1. [Agent System Overview](#1-agent-system-overview)
2. [Agent Architecture](#2-agent-architecture)
3. [Agent Types & Capabilities](#3-agent-types--capabilities)
4. [Task Execution Model](#4-task-execution-model)
5. [Workflow Orchestration](#5-workflow-orchestration)
6. [Memory & Context System](#6-memory--context-system)
7. [Citation & Verification System](#7-citation--verification-system)
8. [AI Integration (Multi-Provider)](#8-ai-integration-multi-provider)
9. [Agent Communication Protocol](#9-agent-communication-protocol)
10. [OpenClaw Delegates](#10-openclaw-delegates)
11. [Skills System Agents](#11-skills-system-agents)
12. [Gateway Agent Communication](#12-gateway-agent-communication)
13. [Error Handling & Recovery](#13-error-handling--recovery)
14. [Performance Considerations](#14-performance-considerations)
15. [Future Agent Capabilities](#15-future-agent-capabilities)

---

## 1. Agent System Overview

GangNiaga AI OS is built around a **multi-agent autonomous system** where specialized AI agents collaborate to execute real business workflows. Unlike passive AI tools that merely respond to prompts, GangNiaga agents operate semi-autonomously — they monitor data, detect anomalies, generate reports, review plans, verify citations, and orchestrate complex multi-step business processes.

### Design Philosophy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GangNiaga AI OS Agent System                      │
│                                                                     │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐      │
│   │ Business  │  │ Financial │  │  Market   │  │  Report   │      │
│   │ Analyst   │  │ Advisor   │  │Researcher │  │Generator  │      │
│   └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘      │
│         │              │              │              │              │
│   ┌─────┴──────────────┴──────────────┴──────────────┴─────┐      │
│   │              Agent Orchestration Layer                   │      │
│   │    (Session Management · Task Queuing · Workflow Engine) │      │
│   └─────┬──────────────┬──────────────┬──────────────┬─────┘      │
│         │              │              │              │              │
│   ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐    │
│   │ Browser   │  │   CRM    │  │   Plan    │  │ Citation  │    │
│   │  Agent    │  │Assistant │  │  Review   │  │ Verifier  │    │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
│                                                                     │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │                  Shared Infrastructure                     │    │
│   │  Memory Engine · Citation Store · AI SDK · Zustand State  │    │
│   └───────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Specialization** | Each agent has a narrow domain of expertise, yielding higher-quality output than a generalist model |
| **Autonomy** | Agents operate independently once configured — they monitor, execute, and report without constant human input |
| **Observability** | Every agent action is tracked as a task with input, output, duration, and status |
| **Composability** | Agents are orchestrated in workflows to accomplish multi-step business processes |
| **Memory Persistence** | Agents maintain contextual memory across sessions, enabling continuity and learning |
| **Verifiability** | All data claims are backed by citations that can be independently verified |

### Current Agent Fleet

| # | Agent | Type | Default Status | Primary Domain |
|---|-------|------|---------------|----------------|
| 1 | Business Analyst | `analysis` | Running | Market analysis, KPI monitoring, competitive intelligence |
| 2 | Financial Advisor | `financial` | Idle | Revenue forecasting, DSCR calculation, financial planning |
| 3 | Market Researcher | `research` | Running | Market data collection, competitor monitoring, citation verification |
| 4 | Report Generator | `reporting` | Completed | Automated report creation (investor, board, financial, KPI, operational) |
| 5 | Browser Agent | `browser` | Idle | Web browsing, data extraction, competitor site monitoring |
| 6 | CRM Assistant | `crm` | Error | Customer relationship management, churn analysis |
| 7 | Plan Review Agent | `review` | Idle | Lender-grade plan review with persona-based analysis |
| 8 | Citation Verifier | `citation` | Running | Source verification, data point validation, benchmark collection |

---

## 2. Agent Architecture

### System Architecture Diagram

```
                        ┌──────────────────────┐
                        │   Frontend (React)    │
                        │   Zustand Store       │
                        │   Agent Control Panel │
                        └──────────┬───────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │      Next.js API Routes      │
                    │  /api/agents  /api/reports    │
                    │  /api/plan-review             │
                    │  /api/idea-canvas             │
                    │  /api/pitch-deck              │
                    │  /api/business-plan           │
                    │  /api/forecast  /api/chat     │
                    └──────┬──────────────┬────────┘
                           │              │
              ┌────────────┴──┐    ┌──────┴───────────┐
              │  Prisma ORM   │    │  z-ai-web-dev-sdk │
              │  (SQLite)     │    │  (AI Completions) │
              └──────┬────────┘    └──────────────────┘
                     │
        ┌────────────┴────────────────────────────┐
        │               Database Models             │
        │  AgentSession · AgentTask · AgentMemory   │
        │  WorkflowRun · Citation · PlanReview      │
        │  BusinessPlan · Report · IdeaCanvas       │
        │  PitchDeck · PlanActual · Integration     │
        └───────────────────────────────────────────┘
```

### Agent Session Lifecycle

```
  ┌─────────┐     ┌─────────┐     ┌──────────┐     ┌───────────┐
  │  IDLE   │────▶│ RUNNING │────▶│ COMPLETED│
  └────┬────┘     └────┬────┘     └──────────┘
       │               │
       │               │
       │          ┌────┴────┐
       │          │  ERROR  │
       │          └────┬────┘
       │               │
       └───────────────┘
           (restart)

  Transitions:
  IDLE ──▶ RUNNING      (start / deploy)
  RUNNING ──▶ COMPLETED  (all tasks finished)
  RUNNING ──▶ ERROR      (unrecoverable failure)
  ERROR ──▶ IDLE         (restart / reset)
  RUNNING ──▶ IDLE       (pause / stop)
  COMPLETED ──▶ IDLE     (recycle for new tasks)
```

### Data Model (Prisma Schema)

```prisma
model AgentSession {
  id             String       @id @default(cuid())
  name           String
  type           String       @default("general")
  status         String       @default("idle")    // idle | running | completed | error
  tasksCompleted Int          @default(0)
  lastActivity   DateTime?
  config         String?      // JSON string — agent-specific configuration
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  tasks          AgentTask[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model AgentTask {
  id          String      @id @default(cuid())
  sessionId   String
  session     AgentSession @relation(fields: [sessionId], references: [id])
  type        String      // e.g., "Market Analysis", "Financial Forecast"
  status      String      @default("pending")  // pending | running | completed | failed
  input       String?     // task description / prompt
  output      String?     // AI-generated result
  duration    Int?        // execution time in seconds
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### Frontend State Model (Zustand)

```typescript
interface AgentInfo {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  tasksCompleted: number;
  lastActivity: string;
}

interface TaskInfo {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: string;
  output?: string;
  duration?: number;
  createdAt: string;
}

// Zustand store slice
interface AppState {
  agents: AgentInfo[];
  selectedAgent: string | null;
  setSelectedAgent: (id: string | null) => void;
  agentTasks: TaskInfo[];
  addAgent: (agent: AgentInfo) => void;
  updateAgent: (id: string, updates: Partial<AgentInfo>) => void;
}
```

### Agent Configuration Schema

Each agent's `config` field stores a JSON string with agent-specific parameters:

```typescript
interface AgentConfig {
  // Common fields
  maxConcurrentTasks: number;      // Max parallel tasks (default: 3)
  retryLimit: number;              // Max retries on failure (default: 2)
  timeoutSeconds: number;          // Task timeout (default: 120)
  autoRestart: boolean;            // Restart on error (default: true)
  memoryScope: 'session' | 'persistent';  // Memory retention policy

  // Agent-type-specific fields
  analysis?: {
    kpiWatchlist: string[];        // KPIs to monitor
    anomalyThreshold: number;      // % change to trigger alert
  };
  financial?: {
    forecastHorizon: string;       // "12m" | "24m" | "36m"
    dscrTarget: number;            // Minimum DSCR (e.g., 1.25)
    currency: string;              // "MYR" | "USD"
  };
  research?: {
    sources: string[];             // Trusted source domains
    geography: string;             // "MY" | "SEA" | "Global"
    autoVerify: boolean;           // Auto-run citation verification
  };
  review?: {
    lenderPersonas: Array<'bank' | 'investor' | 'grant_officer'>;
    strictnessLevel: 'lenient' | 'standard' | 'strict';
  };
  browser?: {
    maxPages: number;              // Max pages per session
    screenshotEnabled: boolean;
    headless: boolean;
  };
  crm?: {
    syncFrequency: 'daily' | 'weekly' | 'monthly';
    churnAlertThreshold: number;   // % churn to trigger alert
  };
  reporting?: {
    formats: Array<'pdf' | 'docx' | 'xlsx' | 'csv'>;
    schedule: string;              // Cron expression
    distributionList: string[];    // Email addresses
  };
  citation?: {
    verificationDepth: 'shallow' | 'standard' | 'deep';
    autoCollect: boolean;          // Auto-collect from research
    minReliabilityScore: number;   // 0-100
  };
}
```

---

## 3. Agent Types & Capabilities

### 3.1 Business Analyst (`analysis`)

```
┌──────────────────────────────────────────────────────┐
│              BUSINESS ANALYST                         │
│  ┌─────┐                                             │
│  │ 🧠  │  Market Analysis · KPI Monitoring            │
│  └─────┘  Competitive Intelligence                    │
│                                                       │
│  Capabilities:                                        │
│  ├─ Data Analysis       — Process & interpret data    │
│  ├─ Trend Detection     — Identify emerging patterns  │
│  ├─ Anomaly Detection   — Flag unexpected changes     │
│  ├─ Forecasting         — Project future trajectories  │
│  └─ Pattern Recognition — Cross-domain pattern linking │
│                                                       │
│  Triggers:                                            │
│  ├─ KPI threshold breach (auto)                       │
│  ├─ Scheduled market scan (daily)                     │
│  └─ User-initiated analysis request                   │
│                                                       │
│  Outputs:                                             │
│  ├─ Market trend reports                              │
│  ├─ KPI anomaly alerts                                │
│  └─ Competitive positioning analysis                  │
└──────────────────────────────────────────────────────┘
```

**Domain**: Strategic analysis of business performance, market positioning, and competitive dynamics.

**Default State**: Running — continuously monitors KPIs and market signals.

**Key Tasks**:
| Task Type | Description | Typical Duration |
|-----------|-------------|-----------------|
| Market Analysis | Deep-dive into market trends and dynamics | 8-15s |
| KPI Monitoring | Track and alert on metric changes | 3-5s |
| Competitive Intelligence | Analyze competitor moves and positioning | 10-20s |
| Anomaly Detection | Identify unexpected data patterns | 2-5s |
| Growth Modeling | Project growth scenarios from current data | 8-12s |

**API Integration**: Uses `/api/forecast` for trend analysis and `/api/chat` for exploratory analysis.

**Memory Context**: Stores historical analysis results, recognized patterns, and ASEAN market insights in `AgentMemory` with type `workspace` and category `Market Intelligence`.

---

### 3.2 Financial Advisor (`financial`)

```
┌──────────────────────────────────────────────────────┐
│              FINANCIAL ADVISOR                        │
│  ┌─────┐                                             │
│  │ 💰  │  Revenue Forecasting · DSCR Calculation     │
│  └─────┘  Financial Planning                          │
│                                                       │
│  Capabilities:                                        │
│  ├─ Revenue Forecasting  — Model future revenue       │
│  ├─ Expense Tracking     — Monitor and categorize     │
│  ├─ Cash Flow Analysis   — Project cash positions     │
│  ├─ Budget Planning      — Create & track budgets     │
│  └─ Risk Assessment      — Financial risk scoring     │
│                                                       │
│  Special Focus:                                       │
│  ├─ DSCR calculation & monitoring (target: 1.25x+)    │
│  ├─ Burn rate tracking                                │
│  └─ Runway projection                                 │
└──────────────────────────────────────────────────────┘
```

**Domain**: Financial analysis, forecasting, and planning with emphasis on lender-critical metrics.

**Default State**: Idle — activates on demand or on scheduled forecast triggers.

**Key Tasks**:
| Task Type | Description | Typical Duration |
|-----------|-------------|-----------------|
| Financial Forecast | Generate period revenue/expense forecasts | 6-10s |
| DSCR Calculation | Compute and track debt service coverage | 3-5s |
| Cash Flow Projection | Model cash positions over time | 8-12s |
| Burn Rate Analysis | Track and optimize spending | 4-6s |
| Budget Variance | Compare planned vs actual spending | 3-5s |

**API Integration**: Primary user of `/api/forecast` for AI-powered financial analysis.

**DSCR Focus**: The Financial Advisor is specifically tuned to monitor Debt Service Coverage Ratio — a critical metric for bank loan approval. It tracks:
- Current DSCR: 1.45x (above bank minimum of 1.25x)
- Target DSCR: 1.50x
- Stress test scenarios: DSCR under 30% revenue decline
- Trend: Improving (up from 1.22x last quarter)

**Memory Context**: Stores financial models, DSCR history, and budget assumptions in `AgentMemory` with type `financial`.

---

### 3.3 Market Researcher (`research`)

```
┌──────────────────────────────────────────────────────┐
│              MARKET RESEARCHER                        │
│  ┌─────┐                                             │
│  │ 🔍  │  Market Data Collection · Competitor Data   │
│  └─────┘  Citation Verification                       │
│                                                       │
│  Capabilities:                                        │
│  ├─ Web Scraping         — Extract data from sources  │
│  ├─ Competitor Analysis  — Track competitor moves     │
│  ├─ Market Research      — Gather market intelligence │
│  ├─ Industry Reports     — Synthesize report findings │
│  └─ Data Collection      — Aggregate from multiple    │
│                             sources                   │
│                                                       │
│  Trusted Sources:                                     │
│  ├─ Statista, World Bank, DOSM                       │
│  ├─ SME Corp, Bank Negara Malaysia                   │
│  ├─ Google-Temasek-Bain, McKinsey, Gartner           │
│  └─ OECD, IDC                                        │
└──────────────────────────────────────────────────────┘
```

**Domain**: External data gathering, market intelligence, and competitive monitoring.

**Default State**: Running — continuously monitors market signals and competitor changes.

**Key Tasks**:
| Task Type | Description | Typical Duration |
|-----------|-------------|-----------------|
| Competitor Research | Monitor competitor pricing and features | 10-20s |
| Market Data Collection | Gather market statistics and reports | 8-15s |
| Industry Analysis | Synthesize industry trends and outlook | 12-25s |
| Source Verification | Verify data point origins and accuracy | 5-10s |
| Data Aggregation | Combine data from multiple sources | 8-12s |

**API Integration**: Works with `/api/idea-canvas` for market validation and feeds data into the Citation system.

**Citation Pipeline**: The Market Researcher is the primary producer of `Citation` records. Every data point it collects is either:
1. Automatically verified against known sources (auto-verified)
2. Flagged for manual verification by the Citation Verifier agent

---

### 3.4 Report Generator (`reporting`)

```
┌──────────────────────────────────────────────────────┐
│              REPORT GENERATOR                         │
│  ┌─────┐                                             │
│  │ 📄  │  Automated Report Creation                   │
│  └─────┘                                              │
│                                                       │
│  Capabilities:                                        │
│  ├─ PDF Generation       — Professional PDF output    │
│  ├─ Chart Creation       — Data visualization         │
│  ├─ Template Rendering   — Apply report templates     │
│  ├─ Scheduled Reports    — Cron-based automation      │
│  └─ Data Aggregation     — Pull from multiple agents  │
│                                                       │
│  Report Types:                                        │
│  ├─ Investor Update     — Quarterly investor report   │
│  ├─ Board Presentation  — Board meeting materials     │
│  ├─ Financial Report    — Comprehensive financials    │
│  ├─ KPI Summary         — Weekly/monthly KPI report   │
│  └─ Operational Intel   — Operational status report   │
└──────────────────────────────────────────────────────┘
```

**Domain**: Automated generation of professional business reports across multiple formats.

**Default State**: Completed — activates when triggered by schedules or user requests.

**Key Tasks**:
| Task Type | Description | Typical Duration |
|-----------|-------------|-----------------|
| KPI Report | Generate weekly/monthly KPI summary | 10-15s |
| Investor Update | Compile quarterly investor report | 15-25s |
| Board Presentation | Create board meeting materials | 15-20s |
| Financial Report | Comprehensive financial analysis | 12-20s |
| Operational Report | Operational intelligence summary | 8-12s |

**API Integration**: Primary user of `/api/reports` for AI-powered report content generation.

**Report Formats**:
```typescript
type ReportFormat = 'pdf' | 'docx' | 'xlsx' | 'csv';
type ReportType = 'investor' | 'board' | 'financial' | 'kpi' | 'operational';
```

**Workflow Integration**: The Report Generator is typically the final step in workflows — it aggregates outputs from the Business Analyst, Financial Advisor, and Market Researcher into a cohesive document.

---

### 3.5 Browser Agent (`browser`)

```
┌──────────────────────────────────────────────────────┐
│              BROWSER AGENT                            │
│  ┌─────┐                                             │
│  │ 🌐  │  Web Browsing · Data Extraction              │
│  └─────┘  Competitor Site Monitoring                  │
│                                                       │
│  Capabilities:                                        │
│  ├─ Web Navigation      — Browse and interact         │
│  ├─ Form Filling        — Submit forms automatically  │
│  ├─ Screenshot Capture  — Document web content        │
│  ├─ Data Extraction     — Scrape structured data      │
│  └─ Multi-tab Browsing  — Parallel page processing    │
│                                                       │
│  Use Cases:                                           │
│  ├─ Monitor competitor pricing pages                  │
│  ├─ Extract industry report data                      │
│  ├─ Capture market intelligence screenshots           │
│  └─ Fill government grant application forms           │
└──────────────────────────────────────────────────────┘
```

**Domain**: Web automation, data extraction from external websites, and visual monitoring.

**Default State**: Idle — activates on demand or on scheduled monitoring tasks.

**Key Tasks**:
| Task Type | Description | Typical Duration |
|-----------|-------------|-----------------|
| Site Monitoring | Visit and scan competitor websites | 15-30s |
| Data Extraction | Scrape structured data from pages | 10-20s |
| Screenshot Capture | Document current state of web pages | 5-8s |
| Form Submission | Fill and submit web forms | 10-15s |
| Multi-site Scan | Parallel browsing across sites | 20-40s |

**Safety Constraints**:
- Respects `robots.txt` directives
- Rate-limited to prevent server overload
- All extracted data is tagged with source URL and timestamp
- Screenshots stored with metadata for audit trail

---

### 3.6 CRM Assistant (`crm`)

```
┌──────────────────────────────────────────────────────┐
│              CRM ASSISTANT                            │
│  ┌─────┐                                             │
│  │ 💬  │  Customer Relationship Management            │
│  └─────┘  Churn Analysis                              │
│                                                       │
│  Capabilities:                                        │
│  ├─ Contact Management   — Track customer contacts    │
│  ├─ Email Drafting       — AI-generated outreach      │
│  ├─ Follow-up Scheduling — Automated follow-ups       │
│  ├─ Lead Scoring         — Prioritize leads           │
│  └─ Pipeline Tracking    — Monitor sales pipeline     │
│                                                       │
│  Churn Analysis:                                      │
│  ├─ Current churn rate: 3.2% (vs 2.5% benchmark)     │
│  ├─ Churn risk scoring per account                    │
│  └─ Retention strategy recommendations               │
└──────────────────────────────────────────────────────┘
```

**Domain**: Customer relationship management, churn prediction, and retention strategy.

**Default State**: Error — currently experiencing API connection issues (as of last session).

**Key Tasks**:
| Task Type | Description | Typical Duration |
|-----------|-------------|-----------------|
| Churn Analysis | Analyze and predict customer churn | 8-12s |
| Lead Scoring | Score and prioritize sales leads | 5-8s |
| Email Drafting | Generate personalized outreach emails | 4-6s |
| Pipeline Update | Track and update sales pipeline status | 3-5s |
| Follow-up Scheduling | Schedule automated follow-ups | 2-3s |

**Integration Points**: Designed to connect with external CRM systems (HubSpot, Salesforce) via API. Currently supports manual data entry mode.

---

### 3.7 Plan Review Agent (`review`)

```
┌──────────────────────────────────────────────────────┐
│              PLAN REVIEW AGENT                        │
│  ┌─────┐                                             │
│  │ 👁️  │  Lender-Grade Plan Review                   │
│  └─────┘  Persona-Based Analysis                      │
│                                                       │
│  Capabilities:                                        │
│  ├─ Narrative Scoring    — Quality of written content │
│  ├─ Financial Scoring    — Accuracy of projections    │
│  ├─ Consistency Check    — Cross-section alignment    │
│  ├─ Discrepancy Detection — Narrative vs financials   │
│  └─ Lender Simulation    — Persona-based evaluation   │
│                                                       │
│  Lender Personas:                                     │
│  ├─ Bank Officer — DSCR, collateral, cash flow        │
│  ├─ VC Investor  — Growth, TAM, unit economics        │
│  └─ Grant Officer — Impact, compliance, feasibility   │
└──────────────────────────────────────────────────────┘
```

**Domain**: Business plan quality assurance with lender-persona simulation for pre-submission validation.

**Default State**: Idle — activates when a user requests a plan review.

**Lender Persona System**: The Plan Review Agent is unique in its persona-based analysis. Each persona focuses on different criteria:

```typescript
type LenderPersona = 'bank' | 'investor' | 'grant_officer';

const personaFocus: Record<LenderPersona, string[]> = {
  bank: ['DSCR', 'collateral', 'cash flow stability', 'repayment capacity', 'financial discipline'],
  investor: ['growth potential', 'market size', 'unit economics', 'exit strategy', 'technology moat'],
  grant_officer: ['community impact', 'compliance', 'feasibility', 'public benefit', 'sustainability'],
};
```

**Review Output Schema**:
```typescript
interface PlanReviewData {
  id: string;
  planId: string;
  status: 'pending' | 'running' | 'completed';
  lenderPersona: LenderPersona;
  narrativeScore: number;     // 0-100
  financialScore: number;     // 0-100
  consistencyScore: number;   // 0-100
  overallScore: number;       // 0-100
  discrepancies: Discrepancy[];
  recommendations: ReviewRecommendation[];
  fullReport: string | null;
}

interface Discrepancy {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  section: string;
  description: string;
  narrativeClaim: string;
  financialReality: string;
  suggestedFix: string;
}

interface ReviewRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
  impact: string;
}
```

**API Integration**: Primary user of `/api/plan-review` endpoint.

**Example Review Flow**:
1. User selects a business plan and chooses a lender persona
2. Frontend sends `{ planId, lenderPersona }` to `/api/plan-review`
3. Agent constructs persona-specific prompt and sends to AI
4. AI returns structured JSON with scores, discrepancies, and recommendations
5. Frontend renders the review with visual severity indicators

---

### 3.8 Citation Verifier (`citation`)

```
┌──────────────────────────────────────────────────────┐
│              CITATION VERIFIER                        │
│  ┌─────┐                                             │
│  │ ✅  │  Source Verification · Data Validation       │
│  └─────┘  Benchmark Collection                        │
│                                                       │
│  Capabilities:                                        │
│  ├─ Source Verification  — Validate data provenance   │
│  ├─ Data Point Validation — Check claimed figures     │
│  ├─ Benchmark Collection — Gather industry benchmarks │
│  ├─ Freshness Check     — Verify data currency        │
│  └─ Geography Tagging   — Tag regional relevance      │
│                                                       │
│  Citation Types:                                      │
│  ├─ market_data      — Market statistics              │
│  ├─ industry_report  — Industry analyst reports       │
│  ├─ benchmark        — Performance benchmarks         │
│  ├─ government       — Official government data       │
│  └─ financial        — Financial/regulatory data      │
└──────────────────────────────────────────────────────┘
```

**Domain**: Independent verification of all data claims used in business plans, reports, and market analyses.

**Default State**: Running — continuously processes incoming citations from the Market Researcher.

**Key Tasks**:
| Task Type | Description | Typical Duration |
|-----------|-------------|-----------------|
| Source Verification | Verify data source URL and publisher | 5-10s |
| Data Point Validation | Cross-check claimed figures | 8-15s |
| Benchmark Collection | Gather industry standard benchmarks | 10-20s |
| Freshness Check | Verify data is not outdated | 3-5s |
| Geography Tagging | Tag with regional relevance | 2-3s |

**Citation Data Model**:
```prisma
model Citation {
  id             String   @id @default(cuid())
  source         String        // e.g., "Statista — Digital Market Outlook SEA"
  url            String?       // Direct URL to source
  type           String   @default("market_data")
  geography      String?       // "MY", "SEA", "Global"
  datePublished  String?       // "2024-06"
  dataPoint      String?       // The specific claim extracted
  verified       Boolean  @default(false)
  organizationId String
  createdAt      DateTime @default(now())
}
```

**Verification Process**:
1. **Incoming**: Market Researcher collects data → creates Citation record (verified: false)
2. **Queue**: Citation Verifier picks up unverified citations
3. **Check**: Verifies source exists, data point is accurate, data is current
4. **Tag**: Sets `verified: true` or flags for manual review
5. **Alert**: If a critical citation fails verification, alerts the Business Analyst

---

## 4. Task Execution Model

### Task Lifecycle

```
  ┌─────────┐     ┌─────────┐     ┌───────────┐
  │ PENDING │────▶│ RUNNING │────▶│ COMPLETED │
  └─────────┘     └────┬────┘     └───────────┘
                       │
                  ┌────┴────┐
                  │ FAILED  │
                  └─────────┘
```

### Task Execution Flow

```
┌──────────┐    ┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│  User /  │    │  Task Queue  │    │  AI SDK Call  │    │  Result      │
│  Trigger │───▶│  (per agent) │───▶│  (z-ai)      │───▶│  Processing  │
└──────────┘    └──────────────┘    └───────────────┘    └──────┬───────┘
                                                                    │
              ┌─────────────┐    ┌───────────────┐                  │
              │  Update     │◀───│  Parse &      │◀─────────────────┘
              │  Zustand    │    │  Validate     │
              │  Store      │    └───────────────┘
              └─────────────┘
```

### Task Execution Code Pattern

```typescript
// Example: How an agent task is executed in an API route

import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const { taskType, input } = await request.json();
    const zai = await getZAI();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'Agent system prompt...' },
        { role: 'user', content: `Execute task: ${taskType}\nInput: ${input}` },
      ],
      thinking: { type: 'disabled' },
    });

    const output = completion.choices?.[0]?.message?.content;

    if (!output) {
      return NextResponse.json({ error: 'No output generated' }, { status: 500 });
    }

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Task execution error:', error);
    return NextResponse.json({ error: 'Task failed' }, { status: 500 });
  }
}
```

### Task Status Tracking

Tasks are tracked both in the database (for persistence) and in the Zustand store (for real-time UI updates):

```typescript
// Frontend: Task status is reflected in the Agent Control Center
const { agentTasks } = useAppStore();

// Visual indicators per status:
// pending   → Clock icon (amber)
// running   → Loader2 icon (spinning, emerald)
// completed → CheckCircle2 icon (emerald)
// failed    → XCircle icon (rose)
```

### Task Duration & Performance

| Agent Type | Avg. Task Duration | Max Concurrent Tasks | Timeout |
|------------|-------------------|---------------------|---------|
| analysis | 5-15s | 3 | 120s |
| financial | 5-12s | 2 | 90s |
| research | 8-25s | 3 | 180s |
| reporting | 10-25s | 2 | 300s |
| browser | 10-40s | 1 | 300s |
| crm | 3-8s | 2 | 60s |
| review | 10-20s | 1 | 120s |
| citation | 5-15s | 3 | 90s |

---

## 5. Workflow Orchestration

### Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     WORKFLOW ENGINE                              │
│                                                                  │
│  Trigger Types:                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌───────────┐    │
│  │ Manual │ │  Cron  │ │ Daily  │ │Monthly │ │ Threshold │    │
│  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └─────┬─────┘    │
│      │          │          │          │            │           │
│      └──────────┴──────────┴──────────┴────────────┘           │
│                           │                                      │
│                    ┌──────┴──────┐                               │
│                    │  Workflow   │                               │
│                    │  Executor   │                               │
│                    └──────┬──────┘                               │
│                           │                                      │
│              ┌────────────┼────────────┐                         │
│              ▼            ▼            ▼                         │
│         ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│         │ Step 1  │ │ Step 2  │ │ Step 3  │  ...               │
│         │(Agent)  │ │(Tool)   │ │(Agent)  │                    │
│         └─────────┘ └─────────┘ └─────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow Data Model

```typescript
interface WorkflowInfo {
  id: string;
  name: string;
  type: string;                              // 'scheduled' | 'event'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  triggerType: 'manual' | 'cron' | 'daily' | 'monthly' | 'threshold';
  steps?: WorkflowStep[];
  createdAt: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: string;      // 'data' | 'chart' | 'report' | 'browser' | 'analysis' | 'notification'
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent?: string;    // Agent name that executes this step
  tool?: string;     // Tool name (if not agent-executed)
}
```

### Pre-configured Workflows

#### 5.1 Weekly KPI Report

```
Trigger: Cron (weekly, Monday 9:00 AM)
Status:  Completed ✓

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Collect KPI    │───▶│  Generate       │───▶│  Create Report  │───▶│  Send to Slack  │
│  Data           │    │  Charts         │    │                 │    │                 │
│  Agent: Analyst │    │  Tool: Analytics│    │  Agent: Reporter│    │  Tool: Slack    │
│  Status: ✓      │    │  Status: ✓      │    │  Status: ✓      │    │  Status: ✓      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 5.2 Competitor Monitoring

```
Trigger: Daily (6:00 AM)
Status:  Running ◉

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Browse         │───▶│  Extract        │───▶│  Analyze        │───▶│  Update         │
│  Competitor     │    │  Pricing Data   │    │  Changes        │    │  Dashboard      │
│  Agent: Browser │    │  Agent: Research│    │  Agent: Analyst │    │  Tool: Analytics│
│  Status: ✓      │    │  Status: ◉      │    │  Status: ○      │    │  Status: ○      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 5.3 Revenue Alert

```
Trigger: Threshold (revenue drops >10% below target)
Status:  Paused ⏸

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Check Revenue  │───▶│  Compare Target │───▶│  Send Alert     │
│  Agent: Finance │    │  Agent: Analyst │    │  Tool: Email    │
│  Status: ○      │    │  Status: ○      │    │  Status: ○      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 5.4 Investor Update (Monthly)

```
Trigger: Monthly (1st of each month)
Status:  Pending ○

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Compile        │───▶│  Generate       │───▶│  Format PDF     │───▶│  Send Email     │
│  Financials     │    │  Report         │    │                 │    │                 │
│  Agent: Finance │    │  Agent: Reporter│    │  Tool: PDF      │    │  Tool: Email    │
│  Status: ○      │    │  Status: ○      │    │  Status: ○      │    │  Status: ○      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Workflow Execution Rules

1. **Sequential Steps**: Steps execute in order — a step cannot start until the previous step completes
2. **Failure Propagation**: If any step fails, the workflow is marked `failed` and subsequent steps remain `pending`
3. **Agent Availability**: A step requiring an agent will wait if the agent is already at max capacity
4. **Retry Policy**: Failed steps are retried up to 2 times before marking as permanently failed
5. **Notification**: On workflow completion or failure, notifications are sent via configured channels

---

## 6. Memory & Context System

### Memory Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    MEMORY ENGINE                            │
│                                                            │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐ │
│  │  User    │  │ Workspace │  │Financial │  │ Workflow │ │
│  │ Memory   │  │ Memory    │  │ Memory   │  │ Memory   │ │
│  └──────────┘  └───────────┘  └──────────┘  └──────────┘ │
│                                                            │
│  ┌──────────┐  ┌──────────────────────────────────────┐   │
│  │  Agent   │  │         Embedding Store              │   │
│  │ Memory   │  │  (Semantic search for context recall) │   │
│  └──────────┘  └──────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### Memory Data Model

```prisma
model AgentMemory {
  id             String   @id @default(cuid())
  type           String   @default("workspace")
  // Types: user | workspace | financial | workflow | agent
  category       String?  // e.g., "Company Profile", "Revenue Model"
  content        String   // The actual memory content
  embedding      String?  // Vector embedding for semantic search
  organizationId String
  organization   Organization @relation(...)
  createdAt      DateTime @default(now())
}
```

### Memory Types

| Type | Scope | Example | Retention |
|------|-------|---------|-----------|
| `user` | User-specific preferences | "Dashboard layout: compact view" | Permanent |
| `workspace` | Organization-wide context | "GangNiaga is a SaaS startup founded in 2024" | Permanent |
| `financial` | Financial data & models | "Current DSCR: 1.45x, target: 1.50x" | Updated quarterly |
| `workflow` | Automation history | "8 consecutive weeks of automated KPI reports" | Rolling 90 days |
| `agent` | Agent-specific context | "Business Analyst trained on SEA market data" | Session-based |

### Memory Categories (Current System)

| Category | Type | Content Example |
|----------|------|-----------------|
| Company Profile | `workspace` | "GangNiaga Sdn Bhd, SaaS startup, founded 2024, 12 team members, RM11.5M seed round" |
| Revenue Model | `financial` | "SaaS subscriptions: Tier 1 RM199/mo, Tier 2 RM599/mo, Tier 3 RM1,999/mo" |
| User Preference | `user` | "Dashboard: compact view, favorite modules: Financial Forecasting, Agent Console" |
| Automation History | `workflow` | "Weekly KPI reports automated for 8 weeks, avg time saved: 4.5 hrs/week" |
| Agent Context | `agent` | "Business Analyst trained on SEA market, specializes in SaaS metrics" |
| Market Intelligence | `workspace` | "Key competitors: LivePlan, Notion, Monday.com. Differentiator: AI-autonomous execution" |
| DSCR Status | `financial` | "Current 1.45x, bank minimum 1.25x, target 1.50x, improving from 1.22x last quarter" |

### Memory Access Patterns

```typescript
// 1. Agent reads relevant memory before task execution
const relevantMemories = memories.filter(m =>
  m.type === 'financial' || m.category === 'Revenue Model'
);

// 2. Agent writes new memory after learning something
const newMemory: MemoryEntry = {
  id: generateId(),
  type: 'agent',
  category: 'Pattern Learned',
  content: 'SaaS metrics show 18% YoY growth, consistent with APAC regional trend',
  createdAt: new Date().toISOString(),
};

// 3. Memory is included in AI prompts for context-aware responses
const systemPrompt = `
  You are the Financial Advisor agent.
  Context from memory:
  ${relevantMemories.map(m => `- [${m.category}]: ${m.content}`).join('\n')}
`;
```

### Memory in AI Prompts

The Copilot system demonstrates memory integration:

```typescript
const SYSTEM_PROMPT = `You are GangNiaga AI Copilot — an autonomous business intelligence assistant...

Key business context (from memory):
- GangNiaga is a SaaS startup targeting Southeast Asian SMEs
- Current MRR: ~$142.8K, ARR: ~$1.7M
- Monthly burn rate: ~$187.2K
- Runway: ~18 months
- Customer churn rate: 3.2%
- Revenue growth: ~11% MoM`;
```

---

## 7. Citation & Verification System

### Citation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  CITATION PIPELINE                            │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐ │
│  │  Market  │    │  Citation│    │  Citation │    │  Plan │ │
│  │Researcher│───▶│  Store   │───▶│ Verifier  │───▶│ Review│ │
│  │ (collect)│    │ (persist)│    │ (verify)  │    │(audit)│ │
│  └──────────┘    └──────────┘    └──────────┘    └───────┘ │
│                                                              │
│  Citation Types:                                             │
│  ├─ market_data      (Statista, Gartner)                     │
│  ├─ industry_report  (McKinsey, Google-Temasek-Bain)         │
│  ├─ benchmark        (OECD, SaaS metrics)                    │
│  ├─ government       (DOSM, BNM, SME Corp)                   │
│  └─ financial        (Bank Negara, SEC filings)              │
│                                                              │
│  Geography Tags:                                             │
│  ├─ MY — Malaysia                                            │
│  ├─ SEA — Southeast Asia                                     │
│  └─ Global — International                                   │
└─────────────────────────────────────────────────────────────┘
```

### Citation Data Model

```typescript
interface CitationData {
  id: string;
  source: string;           // e.g., "Statista — Digital Market Outlook SEA"
  url: string | null;       // Direct link to source
  type: 'market_data' | 'industry_report' | 'benchmark' | 'government' | 'financial';
  geography: string | null; // 'MY' | 'SEA' | 'Global'
  datePublished: string | null;
  dataPoint: string | null; // The specific claim
  verified: boolean;
  createdAt: string;
}
```

### Current Citation Fleet

| # | Source | Type | Geography | Data Point | Verified |
|---|--------|------|-----------|------------|----------|
| c1 | Statista | market_data | SEA | SaaS market USD12.4B by 2027 | ✅ |
| c2 | World Bank | government | MY | 97% of Malaysian businesses are SMEs | ✅ |
| c3 | DOSM | government | MY | 1.2M SMEs, 38% GDP contribution | ✅ |
| c4 | Google-Temasek-Bain | industry_report | SEA | AI adoption 28% CAGR | ✅ |
| c5 | SME Corp | government | MY | 60% SME failures from cash flow | ✅ |
| c6 | McKinsey | industry_report | SEA | 15% ASEAN SMEs use planning software | ✅ |
| c7 | Bank Negara | financial | MY | DSCR 1.25x minimum for SME loans | ✅ |
| c8 | Gartner | market_data | SEA | SaaS growth APAC: 18% YoY | ❌ |
| c9 | OECD | benchmark | Global | SME digitalization: 45% adoption | ✅ |
| c10 | IDC | industry_report | SEA | Indonesia MSME: 64M, 12% annual growth | ✅ |

### Verification Process

```
1. COLLECT     Market Researcher gathers data from source
                  │
2. CREATE      Citation record created (verified: false)
                  │
3. QUEUE       Citation Verifier picks up unverified items
                  │
4. VERIFY      ┌─ Source URL accessible? ── Yes ──┐
               │                                    │
               ├─ Data point matches source? ──────┤
               │                                    │
               ├─ Data not outdated? ──────────────┤
               │                                    │
               └─ Geography tag accurate? ─────────┘
                                                   │
5. RESULT      ┌─ All checks pass → verified: true  ──────┐
               └─ Any check fails → flagged for review ───┘
```

### Citation Usage in Business Plans

Citations are referenced throughout business plans to substantiate claims:

```markdown
**Market Analysis:**
- TAM: USD12.4B [c1: Statista, 2024]
- 97% of Malaysian businesses are SMEs [c2: World Bank, 2024]
- Only 15% use business planning software [c6: McKinsey, 2024]

**Financial Assumptions:**
- Minimum DSCR 1.25x for loan approval [c7: BNM, 2024]
- SaaS market growing 18% YoY [c8: Gartner, 2024] ⚠️ UNVERIFIED
```

The Plan Review Agent specifically checks that all cited data points are verified before a plan is submitted to a lender.

---

## 8. AI Integration (Multi-Provider)

### Provider Architecture

GangNiaga AI OS now uses a **multi-provider adapter** instead of a single SDK. The adapter selects the appropriate AI provider based on the deployment environment:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MULTI-PROVIDER AI ADAPTER                         │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────────┐ │
│  │ ZAI SDK      │  │ OpenAI API   │  │ OpenRouter                 │ │
│  │ (dev)        │  │ (prod)       │  │ (Vercel)                   │ │
│  │              │  │              │  │ ┌────┐ ┌────┐ ┌────┐      │ │
│  │ z-ai-web-dev │  │ gpt-4o       │  │ │Key1│ │Key2│ │Key3│      │ │
│  │ -sdk         │  │              │  │ └────┘ └────┘ └────┘      │ │
│  │              │  │              │  │ ┌────┐  Round-robin        │ │
│  │              │  │              │  │ │Key4│  selection          │ │
│  └──────┬───────┘  └──────┬───────┘  │ └────┘                    │ │
│         │                 │          └────────────┬───────────────┘ │
│         └─────────┬───────┴───────────────────────┘                │
│                   │                                                  │
│          ┌────────┴────────┐                                        │
│          │  Provider Router │                                       │
│          │  (env-based)     │                                       │
│          └────────┬────────┘                                        │
│                   │                                                  │
│          Default: openrouter/owl-alpha                               │
└─────────────────────────────────────────────────────────────────────┘
```

### Provider Selection Logic

```typescript
type AIProvider = 'zai' | 'openai' | 'openrouter';

function getProvider(): AIProvider {
  const env = process.env.NODE_ENV;
  const deployment = process.env.DEPLOYMENT_TARGET;

  if (deployment === 'vercel') return 'openrouter';
  if (env === 'production') return 'openai';
  return 'zai';  // development default
}
```

### OpenRouter Round-Robin

OpenRouter supports up to 4 API keys with automatic round-robin distribution for load balancing and rate limit management:

```typescript
class OpenRouterAdapter {
  private apiKeys: string[];
  private currentIndex: number = 0;

  constructor() {
    this.apiKeys = [
      process.env.OPENROUTER_API_KEY_1,
      process.env.OPENROUTER_API_KEY_2,
      process.env.OPENROUTER_API_KEY_3,
      process.env.OPENROUTER_API_KEY_4,
    ].filter(Boolean);
  }

  getNextKey(): string {
    const key = this.apiKeys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
    return key;
  }

  async createCompletion(messages: Message[]) {
    return fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getNextKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/owl-alpha',
        messages,
      }),
    });
  }
}
```

### SOUL.md Personality System

The multi-provider adapter integrates with the SOUL.md personality system for OpenClaw gateway interactions:

```typescript
// lib/gateway.ts — SOUL.md prompt integration
function getSoulPrompt(): string {
  return `
You are GangNiaga AI, an autonomous business operating system for ASEAN SMEs.

Language: English (primary), Bahasa Melayu (secondary — switch naturally)
Personality: Professional but approachable, data-driven, ASEAN-first, action-oriented
Boundaries: Business planning, financial analysis, market research only
Never: Give legal/tax advice, fabricate data, share user data

Channel-specific tone:
- WhatsApp: Concise, bullet-point friendly
- Telegram: Detailed, markdown-enabled
- Discord: Community-oriented, collaborative
- Slack: Professional, structured
- WebChat: Full-featured, interactive
- Signal: Private, encrypted-aware
`;
}
```

### Gateway Helpers (lib/gateway.ts — 400 lines)

The gateway library provides core functions for the OpenClaw system:

```typescript
// lib/gateway.ts — Key exports

// SOUL.md personality prompt
export function getSoulPrompt(): string;

// AI response via multi-provider adapter
export async function getAIResponse(
  messages: Message[],
  options?: { delegate?: string; channel?: string }
): Promise<string>;

// Channel-specific message sending
export async function sendTelegramMessage(
  chatId: string,
  text: string,
  options?: TelegramSendOptions
): Promise<void>;

export async function sendWhatsAppMessage(
  phoneNumber: string,
  text: string,
  options?: WhatsAppSendOptions
): Promise<void>;

// Conversation persistence
export async function getConversationHistory(
  channel: string,
  channelUserId: string
): Promise<GatewayConversation>;

export async function storeMessage(
  channel: string,
  channelUserId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void>;
```

### SDK Initialization Pattern (ZAI — Development)

When using ZAI in development, the singleton pattern remains:

```typescript
import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}
```

### Completion API Usage (Unified)

```typescript
// Unified completion — adapts to active provider
const completion = await getAIResponse([
  { role: 'assistant', content: 'Agent system prompt...' },
  { role: 'user', content: `Execute task: ${taskType}\nInput: ${input}` },
]);
```

### API Route Integration Map

| API Route | Agent(s) | AI Usage Pattern | Provider |
|-----------|----------|-----------------|----------|
| `/api/agents` | All | CRUD operations (no AI call) | N/A |
| `/api/plan-review` | Plan Review Agent | Persona-based plan analysis → structured JSON | All |
| `/api/idea-canvas` | Market Researcher | Business idea validation → structured JSON | All |
| `/api/pitch-deck` | Report Generator, Business Analyst | Slide generation + Q&A prediction → JSON arrays | All |
| `/api/business-plan` | Business Analyst, Financial Advisor | Section-by-section generation → markdown text | All |
| `/api/forecast` | Financial Advisor | Financial data analysis → prose insights | All |
| `/api/reports` | Report Generator | Full report generation → structured content | All |
| `/api/chat` | All (Copilot) | Conversational AI → prose responses | All |
| `/api/skills/execute` | Skills Engine | Skill execution → varied | All |
| `/api/openclaw/*` | OpenClaw Delegates | Gateway AI responses → channel messages | All |

### Prompt Engineering Patterns

#### Pattern 1: Persona-Based Prompting (Plan Review)

```typescript
const personaDescription =
  lenderPersona === 'bank'
    ? 'a strict bank loan officer who focuses on DSCR, collateral, cash flow stability, and repayment capacity'
    : lenderPersona === 'investor'
    ? 'a venture capital investor who focuses on growth potential, market size, unit economics, and exit strategy'
    : 'a government grant officer who focuses on community impact, compliance, feasibility, and public benefit';
```

#### Pattern 2: Proposal-Type Context (Business Plan)

```typescript
const PROPOSAL_TYPE_CONTEXT: Record<string, string> = {
  bank_loan: 'Emphasize: cash flow stability, DSCR, repayment capacity, collateral, financial prudence...',
  government_grant: 'Emphasize: social impact, Bumiputera empowerment, job creation, innovation...',
  venture_capital: 'Emphasize: massive market size, growth velocity, scalability, technology moat...',
  // ... etc
};
```

#### Pattern 3: Structured JSON Output (Idea Canvas, Plan Review)

```typescript
// Request structured output from AI
const prompt = `...Return your analysis as a JSON object with the following structure:
{
  "narrativeScore": <number 0-100>,
  "financialScore": <number 0-100>,
  "discrepancies": [...],
  "recommendations": [...]
}
Return only the JSON object, no additional text.`;

// Parse with fallback
const jsonMatch = content.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  reviewData = JSON.parse(jsonMatch[0]);
}
```

#### Pattern 4: Template Context (Pitch Deck)

```typescript
const TEMPLATE_CONTEXT: Record<string, string> = {
  investor: 'Emphasize: massive market opportunity, growth velocity, scalability, 10x return potential...',
  bank: 'Emphasize: stable cash flow, DSCR above 1.25x, repayment capacity, collateral coverage...',
  grant: 'Emphasize: social impact, community development, job creation, alignment with national goals...',
};
```

### Error Handling in AI Calls

```typescript
// Standard pattern used across all API routes
try {
  const completion = await zai.chat.completions.create({
    messages: [...],
    thinking: { type: 'disabled' },
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    return NextResponse.json({ error: 'No content generated' }, { status: 500 });
  }

  // Process content...

} catch (error) {
  console.error('AI operation error:', error);
  return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
}
```

---

## 9. Agent Communication Protocol

### Communication Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                  AGENT COMMUNICATION FLOW                         │
│                                                                   │
│  ┌──────────┐                              ┌──────────────────┐  │
│  │  Frontend │◀──── Zustand Store ────────▶│  API Routes      │  │
│  │  (React)  │     (client state)          │  (server-side)   │  │
│  └──────────┘                              └────────┬─────────┘  │
│                                                     │            │
│                                            ┌────────┴────────┐   │
│                                            │  AI SDK (z-ai)  │   │
│                                            └────────┬────────┘   │
│                                                     │            │
│  ┌──────────────────────────────────────────────────┴─────────┐  │
│  │                    Prisma Database                          │  │
│  │  AgentSession · AgentTask · AgentMemory · Citation         │  │
│  │  WorkflowRun · PlanReview · BusinessPlan                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Communication Patterns

#### Pattern 1: User → Agent (Direct Command)

```
User clicks "Start" on Business Analyst
    │
    ▼
Frontend: setSelectedAgent(id) → updateAgent(id, { status: 'running' })
    │
    ▼
POST /api/agents  →  AgentSession record updated in DB
    │
    ▼
Agent begins executing queued tasks
```

#### Pattern 2: Agent → Agent (Workflow Chain)

```
Workflow: Competitor Monitoring (Daily)

Step 1: Browser Agent → "Browse competitor sites"
    │  Output: Raw HTML/screenshots from competitor sites
    ▼
Step 2: Market Researcher → "Extract pricing data"
    │  Input: Raw data from Step 1
    │  Output: Structured pricing comparison
    ▼
Step 3: Business Analyst → "Analyze changes"
    │  Input: Structured data from Step 2 + Memory (previous analysis)
    │  Output: Change analysis with recommendations
    ▼
Step 4: Analytics Tool → "Update dashboard"
       Input: Analysis from Step 3
```

#### Pattern 3: Agent → Memory (Context Store)

```
Financial Advisor completes DSCR calculation
    │
    ▼
Agent writes to AgentMemory:
  type: 'financial'
  category: 'DSCR Status'
  content: 'DSCR improved to 1.52x from 1.45x — above target of 1.50x'
    │
    ▼
Memory available to all agents for future context
```

#### Pattern 4: Agent → Citation (Verification Pipeline)

```
Market Researcher collects: "SaaS market in SEA worth USD12.4B"
    │
    ▼
Citation record created (verified: false)
    │
    ▼
Citation Verifier picks up unverified citation
    │
    ▼
Verification: source URL accessible? ✓ | data matches? ✓ | current? ✓
    │
    ▼
Citation record updated (verified: true)
```

### API Communication Standards

All API requests follow RESTful conventions:

```typescript
// GET: List agents with their tasks
GET /api/agents
→ Response: { agents: AgentSession[] }

// POST: Create new agent
POST /api/agents
→ Body: { name: string, type: string, config?: object }
→ Response: { agent: AgentSession }

// POST: Run plan review
POST /api/plan-review
→ Body: { planId: string, lenderPersona: 'bank' | 'investor' | 'grant_officer' }
→ Response: { review: PlanReviewData }

// POST: Validate business idea
POST /api/idea-canvas
→ Body: { title, problem, solution, targetMarket, revenueModel, competitiveEdge, risks }
→ Response: { validation: ValidationReport }

// POST: Generate pitch deck
POST /api/pitch-deck
→ Body: { title, templateType, planId, action: 'generate_questions' | 'generate' }
→ Response: { slides: PitchSlide[], anticipatedQuestions: AnticipatedQuestion[] }

// POST: Generate business plan section
POST /api/business-plan
→ Body: { title, industry, section, proposalType }
→ Response: { content: string }

// POST: Analyze financial data
POST /api/forecast
→ Body: { type, period, data }
→ Response: { analysis: string }

// POST: Generate report
POST /api/reports
→ Body: { title, type, format }
→ Response: { content: string, title, type, format }

// POST: Copilot conversation
POST /api/chat
→ Body: { message: string, history?: ChatMessage[] }
→ Response: { response: string }
```

### Cross-Origin Requests (Gateway)

When making requests to different services (mini-services), use the `XTransformPort` query parameter:

```typescript
// ✅ Correct — relative path with port specification
fetch('/api/test?XTransformPort=3030');

// ❌ Incorrect — absolute URL with port
fetch('http://localhost:3030/api/test');
```

---

## 10. OpenClaw Delegates

The OpenClaw Multi-Channel Gateway has its own agent/delegate architecture separate from (but complementary to) the core Agent Console agents. OpenClaw delegates are optimized for conversational interactions across messaging channels.

### Delegate Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    OPENCLAW DELEGATE SYSTEM                          │
│                                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐   │
│  │ Business      │  │ Financial     │  │ Research Agent        │   │
│  │ Analyst       │  │ Advisor       │  │                       │   │
│  │ (analysis)    │  │ (financial)   │  │ (research)            │   │
│  └───────┬───────┘  └───────┬───────┘  └───────────┬───────────┘   │
│          │                  │                       │               │
│  ┌───────┴──────────────────┴───────────────────────┴───────────┐  │
│  │              OpenClaw Delegate Router                         │  │
│  │    (Intent Classification · Channel Routing · SOUL.md)       │  │
│  └───────┬──────────────────┬───────────────────────┬───────────┘  │
│          │                  │                       │               │
│  ┌───────┴───────┐  ┌──────┴────────┐  ┌───────────┴──────────┐   │
│  │ Plan Review   │  │ Support       │  │ Support Delegate     │   │
│  │ Agent         │  │ Delegate      │  │ Tier 1               │   │
│  │ (review)      │  │ (support)     │  │ (support_t1)         │   │
│  └───────────────┘  └───────────────┘  └──────────────────────┘   │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │              Finance Bot Tier 2 (finance_t2)                  │  │
│  │              Complex financial queries, deep analysis          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │              SOUL.md Personality Engine                        │  │
│  │              Bilingual EN/MS · ASEAN SME focus                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Delegate Roster

| # | Delegate | Type | Channel Affinity | Specialization |
|---|----------|------|-----------------|----------------|
| 1 | **Business Analyst** | `analysis` | All channels | Market analysis, KPI monitoring, competitive intelligence |
| 2 | **Financial Advisor** | `financial` | Slack, WebChat | Revenue forecasting, DSCR calculation, financial planning |
| 3 | **Research Agent** | `research` | Telegram, Discord | Market data collection, citation verification |
| 4 | **Plan Review Agent** | `review` | Slack, WebChat | Lender-grade plan review with persona-based analysis |
| 5 | **Support Delegate** | `support` | WhatsApp, Signal | Customer support, FAQ handling, escalation |
| 6 | **Finance Bot Tier 2** | `finance_t2` | WebChat, Slack | Complex financial queries, deep analysis, Monte Carlo simulation |
| 7 | **Support Agent Tier 1** | `support_t1` | WhatsApp, Telegram | First-line support, triage, routing to Tier 2 |

### Delegate Routing Logic

```typescript
// Intent-based delegate routing
function routeToDelegate(
  message: string,
  channel: string
): string {
  const intent = classifyIntent(message);

  // Financial queries → Financial Advisor or Finance Bot Tier 2
  if (intent === 'financial_query') {
    if (isComplexFinancial(message)) return 'finance_t2';
    return 'financial';
  }

  // Plan review requests → Plan Review Agent
  if (intent === 'plan_review') return 'review';

  // Research queries → Research Agent
  if (intent === 'research') return 'research';

  // Support queries → Support routing
  if (intent === 'support') {
    if (isComplexSupport(message)) return 'support';
    return 'support_t1';
  }

  // Default → Business Analyst
  return 'analysis';
}
```

### Delegate vs Core Agent Differences

| Aspect | Core Agents | OpenClaw Delegates |
|--------|------------|-------------------|
| **Interface** | Web UI (Agent Console) | Messaging channels |
| **Context** | Full business plan data | Conversation history |
| **Memory** | AgentMemory (persistent) | GatewayConversation (session) |
| **Personality** | Task-specific system prompt | SOUL.md personality |
| **Response Format** | Structured JSON / markdown | Channel-native formatting |
| **Language** | English only | Bilingual EN/MS |

---

## 11. Skills System Agents

The Skills System provides 30+ built-in capabilities that can be executed by both core agents and OpenClaw delegates.

### Skills Execution by Agents

```
┌──────────────────────────────────────────────────────────────────┐
│                    SKILLS EXECUTION FLOW                           │
│                                                                   │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐         │
│  │  Agent /  │────▶│  Skills      │────▶│  Skill       │         │
│  │  Delegate │     │  Router      │     │  Execution   │         │
│  │  Request  │     │              │     │  Engine      │         │
│  └──────────┘     └──────┬───────┘     └──────┬───────┘         │
│                          │                     │                  │
│                   ┌──────┴───────┐     ┌──────┴───────┐         │
│                   │ Skill Match  │     │  Provider    │         │
│                   │ & Validation │     │  Adapter     │         │
│                   └──────────────┘     └──────────────┘         │
│                                                                 │
│  30+ Built-in Skills:                                            │
│  ├─ ASR · VLM · TTS · Charts · XLSX · PDF · PPT · DOCX        │
│  ├─ Web Search · Page Reader · Image Generation                  │
│  ├─ AMiner Search · Daily Papers · Finance API                   │
│  └─ Skill Creator · Skill Vetter · Fullstack Dev                │
└──────────────────────────────────────────────────────────────────┘
```

### Built-in Skills Available to Agents

| Category | Skills | Typical Agent Users |
|----------|--------|-------------------|
| **AI / ML** | ASR, VLM, TTS | All agents (via OpenClaw) |
| **Document** | PDF, DOCX, XLSX, PPT | Report Generator, Support Delegate |
| **Visualization** | Charts (bar, line, pie, scatter, heatmap, radar) | Business Analyst, Financial Advisor |
| **Web** | Web Search, Page Reader | Research Agent, Browser Agent |
| **Academic** | AMiner Search, Daily Papers | Research Agent |
| **Development** | Skill Creator, Skill Vetter, Fullstack Dev | Technical workflows |
| **Financial** | Finance API | Financial Advisor, Finance Bot Tier 2 |
| **Media** | Image Generation, Video Understanding | Report Generator, Support Delegate |

### Auto-Learn Capability

The auto-learn system creates new skills from agent interactions:

1. An agent encounters a task that doesn't match existing skills
2. The Skills Router flags the task as "unmatched"
3. The Auto-Learn module analyzes the task and generates a skill definition
4. The new skill is saved with input/output schema
5. Future agents can invoke the learned skill directly

```typescript
// Auto-learn creates a new skill from an unmatched agent task
interface AutoLearnResult {
  skillId: string;
  name: string;
  description: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  confidence: number;  // 0-1, based on how well the AI inferred the pattern
}
```

---

## 12. Gateway Agent Communication

### Channel-to-Agent Communication Flow

The OpenClaw gateway enables bidirectional communication between messaging channels and the agent system:

```
┌──────────────────────────────────────────────────────────────────┐
│                  GATEWAY COMMUNICATION FLOW                        │
│                                                                   │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐         │
│  │ WhatsApp  │────▶│              │     │              │         │
│  │ Webhook   │     │  Gateway     │────▶│  Delegate    │         │
│  └──────────┘     │  Router      │     │  Router      │         │
│  ┌──────────┐     │              │     └──────┬───────┘         │
│  │ Telegram  │────▶│              │            │                  │
│  │ Webhook   │     │              │     ┌──────┴───────┐         │
│  └──────────┘     │              │     │  SOUL.md     │         │
│  ┌──────────┐     │              │     │  + AI Call   │         │
│  │ Discord   │────▶│              │     │  (Provider)  │         │
│  │ Webhook   │     └──────────────┘     └──────┬───────┘         │
│  └──────────┘                                  │                  │
│  ┌──────────┐     ┌──────────────┐     ┌──────┴───────┐         │
│  │ Slack     │────▶│ Webhook      │◀────│  AI Response │         │
│  │ Events    │     │ Handlers     │     │  Generation  │         │
│  └──────────┘     └──────┬───────┘     └──────────────┘         │
│                          │                                        │
│                   ┌──────┴───────┐                               │
│                   │  Channel     │                               │
│                   │  Reply       │                               │
│                   │  (WhatsApp/  │                               │
│                   │   Telegram/  │                               │
│                   │   Discord/   │                               │
│                   │   Slack)     │                               │
│                   └──────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

### Telegram Webhook Flow

```typescript
// 1. Telegram sends webhook to /api/webhooks/telegram
POST /api/webhooks/telegram
Body: { update_id, message: { chat: { id }, text, from: { id, username } } }

// 2. Gateway processes the message
const history = await getConversationHistory('telegram', chatId);
const soulPrompt = getSoulPrompt();
const delegate = routeToDelegate(text, 'telegram');

// 3. AI generates response
const response = await getAIResponse([
  { role: 'system', content: soulPrompt },
  ...history.messages,
  { role: 'user', content: text },
], { delegate, channel: 'telegram' });

// 4. Store and reply
await storeMessage('telegram', chatId, 'user', text);
await storeMessage('telegram', chatId, 'assistant', response);
await sendTelegramMessage(chatId, response);
```

### WhatsApp Webhook Flow

```typescript
// 1. WhatsApp sends webhook to /api/webhooks/whatsapp
POST /api/webhooks/whatsapp
Body: { entry: [{ changes: [{ value: { messages: [{ from, text }] } }] }] }

// 2. Gateway processes the message
const history = await getConversationHistory('whatsapp', phoneNumber);
const soulPrompt = getSoulPrompt();
const delegate = routeToDelegate(text, 'whatsapp');

// 3. AI generates response
const response = await getAIResponse([
  { role: 'system', content: soulPrompt },
  ...history.messages,
  { role: 'user', content: text },
], { delegate, channel: 'whatsapp' });

// 4. Store and reply
await storeMessage('whatsapp', phoneNumber, 'user', text);
await storeMessage('whatsapp', phoneNumber, 'assistant', response);
await sendWhatsAppMessage(phoneNumber, response);
```

### Conversation Persistence via GatewayConversation Model

All conversations across channels are persisted for context continuity:

```prisma
model GatewayConversation {
  id             String   @id @default(cuid())
  channel        String   // whatsapp | telegram | discord | webchat | signal | slack
  channelUserId  String   // User ID on the channel
  messages       String   // JSON array of { role, content, timestamp }
  delegate       String?  // Assigned delegate type
  lastMessageAt  DateTime @default(now())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([channel, channelUserId, organizationId])
}
```

### Multi-Channel Context

When the same user interacts across multiple channels, the system maintains separate conversation threads per channel but shares the underlying memory context:

```typescript
// User "Ahmad" on WhatsApp and Telegram
// WhatsApp conversation: Independent thread with WhatsApp-specific formatting
// Telegram conversation: Independent thread with Telegram-specific formatting
// Shared context: AgentMemory with type 'user' provides cross-channel continuity

const crossChannelContext = await db.agentMemory.findMany({
  where: {
    organizationId,
    type: 'user',
    category: 'Cross-Channel Preferences',
  },
});
```

---

## 13. Error Handling & Recovery

### Error Classification

```
┌──────────────────────────────────────────────────────────┐
│                  ERROR HIERARCHY                          │
│                                                           │
│  Level 1: TASK ERROR                                     │
│  ├─ AI timeout → retry with simpler prompt               │
│  ├─ Invalid JSON → parse fallback with defaults          │
│  └─ Empty response → return structured error             │
│                                                           │
│  Level 2: AGENT ERROR                                    │
│  ├─ Session crashed → auto-restart with last known state │
│  ├─ Rate limited → exponential backoff + queue           │
│  └─ Config invalid → reset to defaults                   │
│                                                           │
│  Level 3: SYSTEM ERROR                                   │
│  ├─ Database unavailable → fallback to Zustand state     │
│  ├─ SDK initialization failure → retry with delay        │
│  └─ API route crash → 500 response with error details    │
└──────────────────────────────────────────────────────────┘
```

### Error Handling Patterns

#### AI Response Parsing Fallback

```typescript
// Used in /api/plan-review, /api/idea-canvas, /api/pitch-deck
let result;
try {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    result = JSON.parse(jsonMatch[0]);
  } else {
    throw new Error('No JSON found in response');
  }
} catch {
  // Fallback with reasonable defaults
  result = {
    narrativeScore: 70,
    financialScore: 65,
    consistencyScore: 60,
    overallScore: 65,
    discrepancies: [{
      id: 'd-auto-1',
      severity: 'warning',
      section: 'General Review',
      description: 'AI review completed but detailed extraction requires more data.',
      // ...
    }],
    recommendations: [{
      id: 'r-auto-1',
      priority: 'medium',
      category: 'General',
      recommendation: 'Add more detailed financial breakdowns.',
      // ...
    }],
  };
}
```

#### API Route Error Response

```typescript
// Standard error response pattern (used in all API routes)
export async function POST(request: NextRequest) {
  try {
    // ... processing logic ...
  } catch (error) {
    console.error('[RouteName] error:', error);
    return NextResponse.json(
      { error: 'Failed to [operation description]' },
      { status: 500 }
    );
  }
}
```

#### Input Validation

```typescript
// Input validation pattern (used in /api/plan-review, /api/chat)
export async function POST(request: NextRequest) {
  const { planId, lenderPersona } = await request.json();

  if (!planId || !lenderPersona) {
    return NextResponse.json(
      { error: 'planId and lenderPersona are required' },
      { status: 400 }
    );
  }
  // ... proceed with valid input ...
}
```

#### Agent Recovery Strategies

| Error Type | Recovery Strategy | User Notification |
|------------|------------------|-------------------|
| AI timeout | Retry with simplified prompt (max 2 retries) | Toast: "Agent retrying task..." |
| Invalid JSON output | Fallback to structured default | Badge: Agent status → Error |
| Empty AI response | Return error, queue for retry | Toast: "Task failed — will retry" |
| Agent session crash | Auto-restart from last checkpoint | Status change: Error → Idle |
| CRM API disconnect | Queue tasks, retry on reconnect | Badge: "CRM Disconnected" |
| Rate limit hit | Exponential backoff (1s, 2s, 4s) | Silent (transparent to user) |
| DB write failure | Fallback to Zustand state | Console warning |

### Retry Configuration

```typescript
const RETRY_CONFIG = {
  maxRetries: 2,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
  timeoutMs: 120000,  // 2 minutes max per AI call
};
```

---

## 14. Performance Considerations

### AI Call Optimization

| Optimization | Description | Impact |
|-------------|-------------|--------|
| **SDK Singleton** | `getZAI()` pattern ensures one SDK instance per route | Reduces initialization overhead |
| **Message History Limit** | Chat history truncated to last 8 messages | Controls token usage |
| **Thinking Disabled** | `thinking: { type: 'disabled' }` in all completions | Faster response, lower cost |
| **JSON Extraction** | Regex-based JSON extraction from AI responses | Robust parsing without retries |
| **Fallback Defaults** | Pre-defined fallback structures for all structured outputs | Zero-downtime on parse failures |

### Database Performance

```typescript
// Agent list query with task limit
const agents = await db.agentSession.findMany({
  orderBy: { updatedAt: 'desc' },
  include: {
    tasks: {
      take: 10,                    // Limit tasks per agent
      orderBy: { createdAt: 'desc' }
    }
  },
});
```

**Key Optimizations**:
- Task results are limited to 10 most recent per agent
- Queries are ordered by `updatedAt` for freshness
- JSON fields (config, steps, slides) are stored as strings to avoid complex joins
- SQLite provides fast reads for the current dataset size

### Frontend Performance

```typescript
// Zustand store — lightweight, no async overhead
const { agents, selectedAgent } = useAppStore();

// AnimatePresence for smooth agent list transitions
<AnimatePresence mode="popLayout">
  {agents.map(agent => (
    <motion.div
      key={agent.id}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {/* Agent card */}
    </motion.div>
  ))}
</AnimatePresence>
```

**UI Performance Measures**:
- `ScrollArea` with `max-h-[calc(100vh-260px)]` for virtual scrolling
- `AnimatePresence` with `popLayout` for smooth list updates
- Debounced search/filter in agent selection
- Lazy tab content loading (Tasks / Capabilities / Memory tabs)

### Scalability Considerations

| Current | Future (50+ agents) |
|---------|---------------------|
| SQLite for persistence | PostgreSQL with connection pooling |
| In-memory Zustand state | Redis-backed state with pub/sub |
| Sequential workflow steps | Parallel step execution with DAGs |
| Singleton ZAI instance | Connection pool with rate limiting |
| Polling for status updates | WebSocket real-time status push |

### Memory Management

```typescript
// Agent memory is scoped to prevent unbounded growth
const MEMORY_LIMITS = {
  perAgent: 1000,           // Max memory entries per agent
  sessionTTL: '24h',        // Session memories expire after 24h
  workflowTTL: '90d',       // Workflow memories rolling 90-day window
  financialTTL: 'quarterly', // Financial memories updated quarterly
  workspacePerma: true,     // Workspace memories are permanent
};
```

---

## 15. Future Agent Capabilities

### Planned Agent Expansions

```
┌──────────────────────────────────────────────────────────────────┐
│                    AGENT ROADMAP                                  │
│                                                                   │
│  Phase 1 (Q1 2025) — Enhanced Existing Agents                    │
│  ├─ Business Analyst: Real-time market data feeds                 │
│  ├─ Financial Advisor: Monte Carlo simulation for forecasts       │
│  ├─ Browser Agent: Multi-tab orchestration                        │
│  └─ CRM Assistant: HubSpot/Salesforce integration                 │
│                                                                   │
│  Phase 2 (Q2 2025) — New Agent Types                             │
│  ├─ Compliance Agent: Regulatory compliance monitoring            │
│  ├─ Legal Review Agent: Contract analysis and risk flagging       │
│  ├─ HR Assistant: Team planning and hiring optimization           │
│  └─ Investor Relations Agent: Automated investor communications   │
│                                                                   │
│  Phase 3 (Q3 2025) — Advanced Capabilities                       │
│  ├─ Agent-to-Agent Negotiation: Agents collaborate autonomously   │
│  ├─ Self-Healing Workflows: Auto-repair broken workflow steps     │
│  ├─ Predictive Agent Deployment: Pre-deploy agents based on       │
│  │                              predicted needs                   │
│  └─ Cross-Org Agents: Agents that work across organizations       │
│                                                                   │
│  Phase 4 (Q4 2025) — Enterprise Features                         │
│  ├─ Custom Agent Builder: Visual agent creation interface         │
│  ├─ Agent Marketplace: Share and install community agents         │
│  ├─ Multi-Language Agents: Bahasa Melayu, Thai, Vietnamese       │
│  └─ SOC2-Compliant Memory: Encrypted memory with audit trails    │
└──────────────────────────────────────────────────────────────────┘
```

### Planned Technical Improvements

#### 12.1 WebSocket Real-Time Updates

Replace polling-based agent status updates with WebSocket push:

```typescript
// Mini-service: agent-status-service (port 3003)
import { Server } from 'socket.io';

const io = new Server(3003, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('subscribe:agent', (agentId) => {
    socket.join(`agent:${agentId}`);
  });
});

// Broadcast agent status changes
function broadcastAgentUpdate(agentId: string, update: Partial<AgentInfo>) {
  io.to(`agent:${agentId}`).emit('agent:update', update);
}

// Frontend: Subscribe to real-time updates
const socket = io('/?XTransformPort=3003');
socket.on('agent:update', (update) => {
  updateAgent(update.id, update);
});
```

#### 12.2 Embedding-Based Memory Retrieval

```typescript
// Future: Semantic search over agent memory
const relevantMemories = await db.agentMemory.findMany({
  where: {
    organizationId,
    // Vector similarity search (requires pgvector)
    embedding: { similarity: queryEmbedding, threshold: 0.8 },
  },
  take: 5,
});
```

#### 12.3 Agent Negotiation Protocol

```
┌─────────────┐                        ┌─────────────┐
│  Financial  │── "Revenue forecast    │  Business   │
│  Advisor    │    shows 11% MoM" ────▶│  Analyst    │
│             │◀── "Market data says   │             │
│             │    18% YoY only" ──────│             │
│             │── "Adjusted: 14% MoM   │             │
│             │    with market context"─▶│            │
└─────────────┘                        └─────────────┘
```

#### 12.4 Custom Agent Builder (UI Concept)

```typescript
// Future: Visual agent builder
interface CustomAgentConfig {
  name: string;
  description: string;
  baseType: AgentType;
  capabilities: string[];
  systemPrompt: string;
  tools: ToolRef[];
  memoryAccess: MemoryScope[];
  triggers: TriggerConfig[];
  outputSchema: JSONSchema;
  schedule?: CronExpression;
  notificationChannels: ChannelRef[];
}
```

#### 12.5 Multi-Language Support

```typescript
// Future: Agent prompts in local languages
const LANGUAGE_PROMPTS = {
  en: 'You are the Financial Advisor agent...',
  ms: 'Anda adalah ejen Penasihat Kewangan...',  // Bahasa Melayu
  th: 'คุณคือตัวแทนที่ปรึกษาทางการเงิน...',      // Thai
  vi: 'Bạn là đại lý Cố vấn Tài chính...',       // Vietnamese
  id: 'Anda adalah Agen Penasihat Keuangan...',  // Bahasa Indonesia
};
```

### Research & Exploration Areas

| Area | Description | Priority |
|------|-------------|----------|
| **Agent Fine-Tuning** | Train specialized models for each agent type on domain-specific data | Medium |
| **Multi-Agent Debate** | Agents challenge each other's conclusions for higher accuracy | High |
| **Explainability** | Agents provide reasoning chains for every recommendation | High |
| **Autonomous Goal Setting** | Agents propose their own goals based on business context | Low |
| **Federated Memory** | Cross-organization memory sharing with privacy controls | Medium |
| **Agent Personality** | Customizable agent communication styles and tones | Low |
| **Voice Interface** | Voice commands for agent control via ASR | Low |

---

## Appendix A: File Reference Map

| File | Purpose |
|------|---------|
| `src/lib/store.ts` | Zustand state management — agents, tasks, workflows, memory |
| `src/lib/types.ts` | TypeScript interfaces for all agent-related data structures |
| `src/lib/db.ts` | Prisma client initialization |
| `prisma/schema.prisma` | Database schema — AgentSession, AgentTask, AgentMemory, Citation, etc. |
| `src/components/modules/agents.tsx` | Agent Control Center UI — list, detail, tasks, capabilities, memory |
| `src/components/modules/workflows.tsx` | Workflow management UI |
| `src/components/modules/copilot.tsx` | AI Copilot chat interface |
| `src/components/modules/memory.tsx` | Memory engine browser |
| `src/app/api/agents/route.ts` | Agent CRUD API |
| `src/app/api/plan-review/route.ts` | Plan Review Agent API (AI-powered) |
| `src/app/api/idea-canvas/route.ts` | Idea Validation Agent API (AI-powered) |
| `src/app/api/pitch-deck/route.ts` | Pitch Deck Generation API (AI-powered) |
| `src/app/api/business-plan/route.ts` | Business Plan Section Generation API (AI-powered) |
| `src/app/api/forecast/route.ts` | Financial Forecast Analysis API (AI-powered) |
| `src/app/api/reports/route.ts` | Report Generation API (AI-powered) |
| `src/app/api/chat/route.ts` | AI Copilot Chat API (AI-powered) |

## Appendix B: Agent Icon Mapping

```typescript
// From src/components/modules/agents.tsx
function AgentIcon({ type }: { type: string }) {
  switch (type) {
    case 'analysis':   return <Brain />;        // 🧠 Business Analyst
    case 'financial':  return <DollarSign />;    // 💰 Financial Advisor
    case 'research':   return <Search />;        // 🔍 Market Researcher
    case 'reporting':  return <FileText />;      // 📄 Report Generator
    case 'browser':    return <Globe />;         // 🌐 Browser Agent
    case 'crm':        return <MessageSquare />; // 💬 CRM Assistant
    case 'review':     return <Eye />;           // 👁️ Plan Review Agent
    case 'citation':   return <CheckCircle2 />;  // ✅ Citation Verifier
    default:           return <Bot />;           // 🤖 Generic Agent
  }
}
```

## Appendix C: Status Badge System

```typescript
// Agent Session Statuses
'running'   → Green pulsing badge with animation
'idle'      → Gray static badge
'completed' → Green badge with checkmark icon
'error'     → Red badge with warning icon

// Task Statuses
'running'   → Green spinning loader badge
'pending'   → Amber badge with clock icon
'completed' → Green badge with checkmark icon
'failed'    → Red badge with X-circle icon

// Workflow Statuses
'running'   → Active workflow indicator
'pending'   → Queued for execution
'completed' → All steps finished
'failed'    → One or more steps failed
'paused'    → Manually paused by user
```

---

*This document is maintained alongside the GangNiaga AI OS codebase. For implementation details, refer to the source files listed in Appendix A.*
