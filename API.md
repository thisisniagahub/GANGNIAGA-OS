# GangNiaga AI OS — API Reference

> **Version:** 0.2.0  
> **Base URL:** `http://localhost:3000/api`  
> **Authentication:** Not yet implemented (planned for v0.3.0)  
> **Content-Type:** `application/json`  

---

## Table of Contents

1. [Overview](#overview)
2. [Common Patterns](#common-patterns)
3. [POST /api/chat](#1-post-apichat)
4. [POST /api/business-plan](#2-post-apibusiness-plan)
5. [GET /api/agents](#3-get-apiagents)
6. [POST /api/agents](#4-post-apiagents)
7. [GET /api/dashboard](#5-get-apidashboard)
8. [POST /api/forecast](#6-post-apiforecast)
9. [POST /api/reports](#7-post-apireports)
10. [POST /api/idea-canvas](#8-post-apiidea-canvas)
11. [POST /api/plan-review](#9-post-apiplan-review)
12. [POST /api/pitch-deck](#10-post-apipitch-deck)
13. [AI SDK Usage Notes](#ai-sdk-usage-notes)
14. [Error Handling](#error-handling)

---

## Overview

GangNiaga AI OS exposes 9 API route groups across 8 endpoint paths. Six routes integrate with the **z-ai-web-dev-sdk** for LLM-powered content generation, analysis, and validation. Two routes (`/api/agents`, `/api/dashboard`) interact directly with the Prisma/SQLite database. All routes follow REST conventions and return JSON responses.

| Route | Method | AI-Powered | DB-Powered | Purpose |
|-------|--------|------------|------------|---------|
| `/api/chat` | POST | Yes | No | AI Copilot chat |
| `/api/business-plan` | POST | Yes | No | Section generation |
| `/api/agents` | GET | No | Yes | List agents |
| `/api/agents` | POST | No | Yes | Create agent |
| `/api/dashboard` | GET | No | Yes | Dashboard aggregation |
| `/api/forecast` | POST | Yes | No | Financial analysis |
| `/api/reports` | POST | Yes | No | Report generation |
| `/api/idea-canvas` | POST | Yes | No | Idea validation |
| `/api/plan-review` | POST | Yes | No | Lender-grade review |
| `/api/pitch-deck` | POST | Yes | No | Deck + question generation |

---

## Common Patterns

### Request Headers

```http
Content-Type: application/json
```

> Authentication headers (e.g., `Authorization: Bearer <token>`) will be required starting v0.3.0.

### Standard Error Response

```typescript
interface ApiError {
  error: string;
}
```

### ZAI SDK Singleton Pattern

All AI-powered routes use a lazy-initialized singleton for the `z-ai-web-dev-sdk` instance:

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

This ensures the SDK client is created once and reused across invocations, reducing cold-start latency.

---

## 1. POST /api/chat

AI Copilot chat endpoint — the conversational interface for GangNiaga AI OS. Maintains context via message history and responds with domain-specific business intelligence.

### Request Body

```typescript
interface ChatRequest {
  /** The user's message (required) */
  message: string;
  /** Conversation history for context (optional, max 8 messages used) */
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

### Response Body

```typescript
interface ChatResponse {
  /** The AI assistant's response */
  response: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | `message` is missing or not a string | `{ error: 'Message is required' }` |
| `500` | ZAI SDK fails or returns empty | `{ error: 'Failed to generate response' }` |

### Example curl

```bash
# Simple message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is our current DSCR?"}'

# With conversation history
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How does that compare to last quarter?",
    "history": [
      { "role": "user", "content": "What is our current DSCR?" },
      { "role": "assistant", "content": "Your current DSCR is 1.45x, which is above the bank minimum of 1.25x..." }
    ]
  }'
```

### Notes

- **System prompt** is hardcoded with GangNiaga business context (MRR, ARR, burn rate, runway, churn, growth rate).
- History is truncated to the **last 8 messages** before being sent to the LLM.
- The copilot specializes in: business planning, financial forecasting, agent management, workflow automation, and business intelligence.
- All responses are contextualized for **Southeast Asian SaaS** markets with MYR (RM) currency conventions.

---

## 2. POST /api/business-plan

Generates professional content for any of the **21 sections** of a business proposal, tailored to one of **6 proposal types**. Each section has a carefully crafted prompt optimized for the proposal context.

### Supported Proposal Types

| Type | Key | Focus |
|------|-----|-------|
| Bank Loan | `bank_loan` | DSCR, collateral, cash flow, repayment capacity |
| Government Grant | `government_grant` | Social impact, Bumiputera agenda, job creation |
| Angel Investor | `angel_investor` | Team, vision, traction, 10x potential |
| Venture Capital | `venture_capital` | TAM/SAM/SOM, growth velocity, scalability, moat |
| SME Financing | `sme_financing` | Revenue stability, fundamentals, profitability path |
| Corporate Partnership | `corporate_partnership` | Mutual value, strategic alignment, integration |

### Supported Sections (21)

| # | Key | Description |
|---|-----|-------------|
| 1 | `coverPage` | Professional cover page with company details |
| 2 | `executiveSummary` | Critical 2-5 minute investor summary |
| 3 | `companyOverview` | Founding, legal structure, ownership |
| 4 | `problemStatement` | Data-backed pain point articulation |
| 5 | `solutionProduct` | Product capabilities and differentiators |
| 6 | `marketAnalysis` | TAM/SAM/SOM with market drivers |
| 7 | `industryResearch` | Industry trends, regulations, outlook |
| 8 | `competitorAnalysis` | Competitive landscape and moat |
| 9 | `businessModel` | Value creation, pricing, retention |
| 10 | `revenueStreams` | Revenue breakdown with unit economics |
| 11 | `goToMarketStrategy` | Acquisition channels, partnerships, 90-day plan |
| 12 | `operationsPlan` | Team, scaling plan, 12-month roadmap |
| 13 | `technologySystem` | Tech stack, AI capabilities, security |
| 14 | `managementTeam` | Leadership profiles, advisory board |
| 15 | `financialForecast` | 3-year projections, DSCR, break-even |
| 16 | `fundingRequirement` | Exact amount, terms, purpose |
| 17 | `useOfFunds` | Category breakdown with percentages |
| 18 | `riskAnalysis` | Risk categories with mitigation |
| 19 | `swotAnalysis` | Strengths, Weaknesses, Opportunities, Threats |
| 20 | `exitStrategy` | Acquisition, IPO, secondary scenarios |
| 21 | `appendices` | Supporting documents list |

### Request Body

```typescript
interface BusinessPlanRequest {
  /** Title of the business proposal (required) */
  title: string;
  /** Industry context (required) — e.g., "SaaS / Software", "AI / ML" */
  industry: string;
  /** Section key to generate (required) — must be one of the 21 ProposalSectionKey values */
  section: ProposalSectionKey;
  /** Proposal type (required) — determines tone and emphasis */
  proposalType: ProposalType;
}

type ProposalSectionKey =
  | 'coverPage' | 'executiveSummary' | 'companyOverview'
  | 'problemStatement' | 'solutionProduct' | 'marketAnalysis'
  | 'industryResearch' | 'competitorAnalysis' | 'businessModel'
  | 'revenueStreams' | 'goToMarketStrategy' | 'operationsPlan'
  | 'technologySystem' | 'managementTeam' | 'financialForecast'
  | 'fundingRequirement' | 'useOfFunds' | 'riskAnalysis'
  | 'swotAnalysis' | 'exitStrategy' | 'appendices';

type ProposalType =
  | 'bank_loan' | 'government_grant' | 'angel_investor'
  | 'venture_capital' | 'sme_financing' | 'corporate_partnership';
```

### Response Body

```typescript
interface BusinessPlanResponse {
  /** Generated markdown content for the requested section */
  content: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | ZAI SDK fails or returns empty | `{ error: 'Failed to generate content' }` |

### Example curl

```bash
# Generate executive summary for a bank loan proposal
curl -X POST http://localhost:3000/api/business-plan \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GangNiaga AI OS — Bank Loan Proposal (RM2M)",
    "industry": "SaaS / Software",
    "section": "executiveSummary",
    "proposalType": "bank_loan"
  }'

# Generate financial forecast for a VC pitch
curl -X POST http://localhost:3000/api/business-plan \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GangNiaga AI OS — Series A (VC Pitch)",
    "industry": "AI / ML",
    "section": "financialForecast",
    "proposalType": "venture_capital"
  }'

# Generate market analysis for a government grant
curl -X POST http://localhost:3000/api/business-plan \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MARA Business Grant — Youth Entrepreneurship",
    "industry": "SaaS / Software",
    "section": "marketAnalysis",
    "proposalType": "government_grant"
  }'
```

### Notes

- Each section has a **unique, hand-crafted prompt** that instructs the AI on exactly what to include and how to format it.
- The **proposal type** adds a contextual overlay (e.g., bank loans emphasize DSCR and collateral; grants emphasize social impact).
- If an unknown section key is provided, a generic fallback prompt is used.
- Content is returned in **Markdown** format with `**bold**` headers and bullet points.

---

## 3. GET /api/agents

Retrieves all agent sessions with their recent tasks from the database.

### Request

No request body required.

### Response Body

```typescript
interface AgentsListResponse {
  agents: Array<AgentSessionWithTasks>;
}

interface AgentSessionWithTasks {
  id: string;
  name: string;
  type: string;          // e.g., "analysis", "financial", "research", "reporting", "browser", "crm", "review", "citation"
  status: string;        // "idle" | "running" | "completed" | "error"
  tasksCompleted: number;
  lastActivity: string | null;  // ISO datetime
  config: string | null;        // JSON string
  organizationId: string;
  tasks: Array<AgentTask>;
  createdAt: string;     // ISO datetime
  updatedAt: string;     // ISO datetime
}

interface AgentTask {
  id: string;
  sessionId: string;
  type: string;
  status: string;        // "pending" | "running" | "completed" | "failed"
  input: string | null;
  output: string | null;
  duration: number | null;  // seconds
  createdAt: string;
  updatedAt: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | Database query fails | `{ error: 'Failed to fetch agents' }` |

### Example curl

```bash
curl http://localhost:3000/api/agents
```

### Notes

- Agents are ordered by `updatedAt` descending (most recently active first).
- Each agent includes up to **10 most recent tasks** (ordered by `createdAt` descending).
- The `config` field is a JSON string that needs to be parsed on the client side.

---

## 4. POST /api/agents

Creates a new agent session in the database.

### Request Body

```typescript
interface CreateAgentRequest {
  /** Display name for the agent (optional, defaults to "New Agent") */
  name?: string;
  /** Agent type (optional, defaults to "general") */
  type?: string;
  /** Agent configuration object (optional, stored as JSON string) */
  config?: Record<string, unknown>;
}
```

### Response Body

```typescript
interface CreateAgentResponse {
  agent: {
    id: string;
    name: string;
    type: string;
    status: string;       // Always "idle" on creation
    tasksCompleted: number; // Always 0 on creation
    lastActivity: null;
    config: string | null;  // JSON stringified version of input config
    organizationId: string; // Currently hardcoded to "default"
    createdAt: string;
    updatedAt: string;
  };
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | Database creation fails | `{ error: 'Failed to create agent' }` |

### Example curl

```bash
# Create a new analysis agent
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Market Analyst",
    "type": "analysis",
    "config": { "autoStart": true, "maxConcurrentTasks": 3 }
  }'
```

### Notes

- New agents are always created with `status: "idle"` and `tasksCompleted: 0`.
- The `organizationId` is currently hardcoded to `"default"` — multi-tenancy support is planned for v0.6.0.
- The `config` object is serialized to a JSON string before storage.

---

## 5. GET /api/dashboard

Aggregates key data from multiple database tables to populate the dashboard view.

### Request

No request body required. No query parameters.

### Response Body

```typescript
interface DashboardResponse {
  /** Recent KPI data points (max 10) */
  kpis: Array<{
    id: string;
    metric: string;
    value: number;
    previousValue: number | null;
    target: number | null;
    unit: string;          // "currency" | "months" | "ratio" | "percent"
    period: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
  }>;

  /** Recent business plans (max 5) */
  plans: Array<{
    id: string;
    title: string;
    status: string;
    executiveSummary: string | null;
    marketAnalysis: string | null;
    swotAnalysis: string | null;
    competitorAnalysis: string | null;
    financialPlan: string | null;
    riskAnalysis: string | null;
    recommendations: string | null;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
  }>;

  /** Recent agent sessions (max 10) */
  agents: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    tasksCompleted: number;
    lastActivity: string | null;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
  }>;

  /** Recent workflow runs (max 10) */
  workflows: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    triggerType: string;
    steps: string | null;  // JSON string
    organizationId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | Any database query fails | `{ error: 'Failed to fetch dashboard data' }` |

### Example curl

```bash
curl http://localhost:3000/api/dashboard
```

### Notes

- This endpoint makes **4 independent database queries** (KPIs, plans, agents, workflows).
- All queries are ordered by `updatedAt` or `createdAt` descending.
- Limits: KPIs (10), Plans (5), Agents (10), Workflows (10).
- The `steps` field on workflows is a JSON string that must be parsed client-side.
- Currently no authentication — returns data for the default organization.

---

## 6. POST /api/forecast

AI-powered financial forecast analysis. Sends financial data to the LLM for insights, risk assessment, and optimization recommendations.

### Request Body

```typescript
interface ForecastRequest {
  /** Type of forecast data (required) */
  type: 'revenue' | 'expense' | 'cashflow' | 'profit';
  /** Time period description (required) — e.g., "Q1 2025", "2025" */
  period: string;
  /** Financial data points to analyze (required) */
  data: Array<{
    name: string;
    revenue?: number;
    expenses?: number;
    profit?: number;
    value?: number;
    [key: string]: string | number | undefined;
  }>;
}
```

### Response Body

```typescript
interface ForecastResponse {
  /** AI-generated analysis with insights, risks, recommendations, and confidence */
  analysis: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | ZAI SDK fails or returns empty | `{ error: 'Failed to generate analysis' }` |

### Example curl

```bash
# Analyze revenue forecast
curl -X POST http://localhost:3000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "type": "revenue",
    "period": "Q1 2025",
    "data": [
      { "name": "Jan", "revenue": 186000, "expenses": 142000, "profit": 44000 },
      { "name": "Feb", "revenue": 205000, "expenses": 148000, "profit": 57000 },
      { "name": "Mar", "revenue": 237000, "expenses": 155000, "profit": 82000 }
    ]
  }'

# Analyze cashflow forecast
curl -X POST http://localhost:3000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cashflow",
    "period": "2025",
    "data": [
      { "name": "Q1", "value": 183000 },
      { "name": "Q2", "value": 358000 },
      { "name": "Q3", "value": 569000 },
      { "name": "Q4", "value": 786000 }
    ]
  }'
```

### Notes

- The AI is prompted to provide: (1) key insights and trends, (2) risk factors, (3) optimization recommendations, (4) forecast confidence level.
- The system prompt positions the AI as an "expert financial analyst" that provides data-driven analysis.
- Input data is serialized as pretty-printed JSON within the prompt for readability.
- No data is persisted to the database — this is a stateless analysis endpoint.

---

## 7. POST /api/reports

Generates professional business reports using AI. Supports 5 report types and 4 output format declarations.

### Request Body

```typescript
interface ReportRequest {
  /** Report title (required) */
  title: string;
  /** Report type (required) */
  type: 'investor' | 'board' | 'financial' | 'kpi' | 'operational';
  /** Output format (required) — currently metadata only, actual format conversion not yet implemented */
  format: 'pdf' | 'docx' | 'xlsx' | 'csv';
}
```

### Response Body

```typescript
interface ReportResponse {
  /** Generated report content in Markdown format */
  content: string;
  /** Echo of the requested title */
  title: string;
  /** Echo of the requested type */
  type: string;
  /** Echo of the requested format */
  format: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | ZAI SDK fails or returns empty | `{ error: 'Failed to generate report' }` |

### Example curl

```bash
# Generate an investor update report
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q4 2024 Investor Update",
    "type": "investor",
    "format": "pdf"
  }'

# Generate a KPI summary report
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly KPI Summary — December",
    "type": "kpi",
    "format": "pdf"
  }'
```

### Notes

- The AI is pre-loaded with GangNiaga business context (MRR, ARR, burn rate, runway, churn, growth).
- The `format` field is currently **metadata only** — the actual content is always generated as Markdown. PDF/DOCX/XLSX/CSV conversion is planned for v0.3.0.
- Report type descriptions:
  - `investor`: Investor update report
  - `board`: Board meeting presentation report
  - `financial`: Comprehensive financial report
  - `kpi`: KPI summary and performance report
  - `operational`: Operational intelligence and status report

---

## 8. POST /api/idea-canvas

AI-powered business idea validation engine. Scores ideas across 5 dimensions, identifies red flags, and benchmarks against ASEAN market standards.

### Request Body

```typescript
interface IdeaCanvasRequest {
  /** Idea title (required) */
  title: string;
  /** Problem statement (optional) */
  problem?: string;
  /** Proposed solution (optional) */
  solution?: string;
  /** Target market description (optional) */
  targetMarket?: string;
  /** Revenue model description (optional) */
  revenueModel?: string;
  /** Competitive edge / differentiation (optional) */
  competitiveEdge?: string;
  /** Known risks array (optional) */
  risks?: string[];
}
```

### Response Body

```typescript
interface IdeaCanvasResponse {
  /** Structured validation result from the AI */
  validation: ValidationReport;
  /** Raw AI content (only present if JSON parsing fails) */
  rawContent?: string;
}

interface ValidationReport {
  /** Overall viability score (0-100) */
  overallScore: number;
  /** Market viability score (0-100) */
  marketViability: number;
  /** Problem clarity score (0-100) */
  problemClarity: number;
  /** Solution feasibility score (0-100) */
  solutionFeasibility: number;
  /** Revenue potential score (0-100) */
  revenuePotential: number;
  /** Competitive position score (0-100) */
  competitivePosition: number;
  /** Overall risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Key strengths (3-5 items) */
  strengths: string[];
  /** Key weaknesses (3-5 items) */
  weaknesses: string[];
  /** Actionable recommendations (3-5 items) */
  recommendations: string[];
  /** Deal-breaking concerns (0-3 items) */
  redFlags: string[];
  /** Benchmark comparisons against industry standards */
  benchmarkComparison: Array<{
    metric: string;
    user: number;
    benchmark: number;
    status: 'above' | 'below' | 'at';
  }>;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | ZAI SDK fails or returns empty | `{ error: 'Failed to validate idea' }` |

### Example curl

```bash
# Validate a business idea
curl -X POST http://localhost:3000/api/idea-canvas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "QuickCommerce — AI Inventory Optimizer",
    "problem": "SME retailers in Malaysia lose 15-25% of revenue annually due to stockouts and overstock situations.",
    "solution": "AI-powered inventory optimization that predicts demand patterns, automates reordering, and minimizes waste.",
    "targetMarket": "450,000 retail SMEs in Malaysia",
    "revenueModel": "SaaS RM299/mo per outlet + transaction fees on automated orders",
    "competitiveEdge": "Local market data training, integration with local suppliers, Bahasa Melayu native",
    "risks": ["Low digital adoption among traditional retailers", "Supplier integration complexity"]
  }'
```

### Notes

- The AI is prompted to return **structured JSON** within its response.
- A **regex-based JSON extraction** (`content.match(/\{[\s\S]*\}/)`) is used to parse the AI output.
- If JSON parsing fails, a **fallback validation** is returned with all dimension scores set to 50/100 and generic recommendations. The raw AI content is also included in the `rawContent` field for debugging.
- The AI persona is a "venture capital analyst and business idea validator specializing in Southeast Asian markets" — it is intentionally "brutally honest."
- Benchmarks use realistic ASEAN/Southeast Asian market standards.

---

## 9. POST /api/plan-review

Lender-grade business plan review. Analyzes a plan from the perspective of a specific lender persona, identifies discrepancies between narrative claims and financial projections, and provides actionable recommendations.

### Request Body

```typescript
interface PlanReviewRequest {
  /** Business plan ID to review (required) */
  planId: string;
  /** Lender persona for the review perspective (required) */
  lenderPersona: 'bank' | 'investor' | 'grant_officer';
}
```

### Response Body

```typescript
interface PlanReviewResponse {
  review: {
    id: string;                    // Generated as `review-{timestamp}`
    planId: string;
    status: 'completed';
    lenderPersona: 'bank' | 'investor' | 'grant_officer';
    narrativeScore: number;        // 0-100
    financialScore: number;        // 0-100
    consistencyScore: number;      // 0-100
    overallScore: number;          // 0-100
    discrepancies: Discrepancy[];
    recommendations: ReviewRecommendation[];
    fullReport: null;              // Reserved for future use
    createdAt: string;             // ISO datetime
  };
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

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `planId` or `lenderPersona` | `{ error: 'planId and lenderPersona are required' }` |
| `500` | ZAI SDK fails or returns empty | `{ error: 'Failed to generate plan review' }` |

### Example curl

```bash
# Review a plan from a bank's perspective
curl -X POST http://localhost:3000/api/plan-review \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "1",
    "lenderPersona": "bank"
  }'

# Review a plan from an investor's perspective
curl -X POST http://localhost:3000/api/plan-review \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "2",
    "lenderPersona": "investor"
  }'
```

### Notes

- **Persona-specific focus areas:**
  - `bank`: DSCR, collateral, cash flow stability, repayment capacity
  - `investor`: Growth potential, market size, unit economics, exit strategy
  - `grant_officer`: Community impact, compliance, feasibility, public benefit
- The AI is instructed to check 6 consistency dimensions: revenue growth consistency, fund itemization, DSCR calculation consistency, market size backing, narrative gaps, and internal financial consistency.
- JSON parsing uses the same regex extraction pattern as `/api/idea-canvas`.
- If JSON parsing fails, a **fallback review** is returned with moderate scores (70/65/60/65) and generic recommendations.
- The `fullReport` field is currently `null` — reserved for a future detailed markdown report.

---

## 10. POST /api/pitch-deck

Generates pitch deck slides and/or anticipated investor questions. This is a **dual-action endpoint** — the `action` field determines the operation.

### Request Body

```typescript
interface PitchDeckRequest {
  /** Pitch deck title (required) */
  title: string;
  /** Template type (required) */
  templateType: 'investor' | 'bank' | 'grant';
  /** Linked business plan ID (optional) */
  planId?: string;
  /** Action to perform — "generate_questions" for Q&A, omitted/any for slide generation */
  action?: 'generate_questions';
  /** Deck ID for question generation context (optional) */
  deckId?: string;
}
```

### Response Body — Slide Generation (default action)

```typescript
interface PitchDeckSlidesResponse {
  /** Generated slide data */
  slides: PitchSlide[];
  /** Anticipated questions (empty array for slide generation) */
  anticipatedQuestions: [];
}

interface PitchSlide {
  id: string;
  order: number;
  title: string;
  type: 'title' | 'problem' | 'solution' | 'market' | 'business_model' | 'financials' | 'team' | 'ask' | 'appendix';
  content: string;
  dataPoints?: Record<string, string | number>;
  linkedSection?: string;
}
```

### Response Body — Question Generation (`action: "generate_questions"`)

```typescript
interface PitchDeckQuestionsResponse {
  /** Generated anticipated questions */
  anticipatedQuestions: AnticipatedQuestion[];
}

interface AnticipatedQuestion {
  id: string;
  question: string;
  category: string;        // e.g., "Financial", "Competitive", "Market", "Team", "Operations", "Risk"
  suggestedAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | ZAI SDK fails or returns empty | `{ error: 'Failed to generate pitch deck' }` |

### Example curl

```bash
# Generate a full pitch deck (7-8 slides)
curl -X POST http://localhost:3000/api/pitch-deck \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GangNiaga AI OS — Bank Loan Pitch",
    "templateType": "bank",
    "planId": "1"
  }'

# Generate anticipated questions only
curl -X POST http://localhost:3000/api/pitch-deck \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GangNiaga AI OS — Bank Loan Pitch",
    "templateType": "bank",
    "planId": "1",
    "action": "generate_questions",
    "deckId": "1"
  }'

# Generate an investor pitch deck
curl -X POST http://localhost:3000/api/pitch-deck \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GangNiaga AI OS — Series A Pitch",
    "templateType": "investor"
  }'
```

### Notes

- **Template type context:**
  - `investor`: Emphasizes massive market, growth velocity, scalability, moat, 10x return
  - `bank`: Emphasizes stable cash flow, DSCR >1.25x, repayment, collateral, conservative projections
  - `grant`: Emphasizes social impact, community development, job creation, measurable outcomes
- For **slide generation**, the AI is asked to produce 7-8 slides as a JSON array.
- For **question generation**, the AI generates 5 questions specific to the template type audience.
- Both paths use **regex-based JSON extraction** with structured fallbacks if parsing fails.
- Fallback questions are **template-type-specific** — bank questions focus on DSCR/collateral, grant questions focus on impact/sustainability, investor questions focus on moat/unit economics.
- Each slide can have a `linkedSection` that maps back to a `ProposalSectionKey` from the business plan module.

---

## AI SDK Usage Notes

### z-ai-web-dev-sdk Integration

All AI-powered routes use the `z-ai-web-dev-sdk` package (v0.0.17) for LLM completions. Key patterns:

#### 1. Singleton Initialization

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

The `ZAI.create()` factory is async and returns a client instance. The singleton pattern avoids re-initialization on every request.

#### 2. Completion API

```typescript
const completion = await zai.chat.completions.create({
  messages: [
    { role: 'assistant', content: 'System prompt here...' },
    { role: 'user', content: 'User prompt here...' },
  ],
  thinking: { type: 'disabled' },
});

const response = completion.choices?.[0]?.message?.content;
```

- **Thinking mode** is currently disabled (`{ type: 'disabled' }`) across all routes.
- Messages follow the OpenAI-compatible format with `role` and `content`.
- The first message typically uses `role: 'assistant'` as the system prompt (not `role: 'system'`).
- The response is accessed via `completion.choices?.[0]?.message?.content`.

#### 3. JSON Extraction Pattern

For routes that expect structured JSON output (`/api/idea-canvas`, `/api/plan-review`, `/api/pitch-deck`):

```typescript
const jsonMatch = content.match(/\{[\s\S]*\}/);    // For objects
const jsonMatch = content.match(/\[[\s\S]*\]/);    // For arrays
if (jsonMatch) {
  const parsed = JSON.parse(jsonMatch[0]);
}
```

This pattern handles cases where the AI wraps JSON in markdown code blocks or adds explanatory text.

#### 4. Fallback Responses

All structured-output routes implement fallback responses when JSON parsing fails:

| Route | Fallback Strategy |
|-------|-------------------|
| `/api/idea-canvas` | All scores = 50, generic recommendations |
| `/api/plan-review` | Moderate scores (70/65/60/65), generic discrepancy |
| `/api/pitch-deck` (slides) | 7 default slides with placeholder content |
| `/api/pitch-deck` (questions) | 3 template-type-specific questions |

### Rate Limiting & Performance

- No rate limiting is currently implemented.
- AI completions typically take 3-15 seconds depending on prompt complexity.
- The ZAI SDK instance is reused across requests (singleton pattern).
- No streaming support — all completions are awaited in full.

### Future Improvements

- **Streaming responses** for chat (SSE/WebSocket) — planned for v0.3.0
- **Structured output** with Zod schema validation — planned for v0.4.0
- **Caching layer** for repeated identical prompts — planned for v0.4.0
- **Token usage tracking** and cost monitoring — planned for v0.3.0

---

## Error Handling

### Standard Error Format

All errors follow a consistent format:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Status | Meaning | When Used |
|--------|---------|-----------|
| `200` | Success | All successful responses |
| `400` | Bad Request | Missing or invalid required fields |
| `500` | Internal Error | AI SDK failures, database errors, unexpected exceptions |

### Error Recovery

- AI-powered routes: If the LLM returns an empty response, a 500 error is returned.
- Structured-output routes: If JSON parsing fails, a **fallback response** is returned with a 200 status (not an error) — this is by design to ensure the UI always has renderable data.
- Database routes: All database errors result in 500 responses with console logging.

---

*Last updated: 2025-01-15 | GangNiaga AI OS v0.2.0*
