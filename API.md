# GangNiaga AI OS — API Reference

> **Version:** 0.3.0  
> **Base URL:** `http://localhost:3000/api` (dev) · `https://your-app.vercel.app/api` (prod)  
> **Authentication:** Not yet implemented (planned for v0.4.0)  
> **Content-Type:** `application/json`  

---

## Table of Contents

1. [Overview](#overview)
2. [Common Patterns](#common-patterns)
3. [Core Business Routes](#core-business-routes)
   - [GET /api](#1-get-api)
   - [POST /api/chat](#2-post-apichat)
   - [POST /api/business-plan](#3-post-apibusiness-plan)
   - [GET /api/agents](#4-get-apiagents)
   - [POST /api/agents](#5-post-apiagents)
   - [GET /api/dashboard](#6-get-apidashboard)
   - [POST /api/forecast](#7-post-apiforecast)
   - [GET /api/reports](#8-get-apireports)
   - [POST /api/reports](#9-post-apireports)
   - [POST /api/idea-canvas](#10-post-apiidea-canvas)
   - [POST /api/plan-review](#11-post-apiplan-review)
   - [POST /api/pitch-deck](#12-post-apipitch-deck)
   - [POST /api/sessions](#13-post-apisessions)
   - [GET /api/sessions/[id]](#14-get-apisessionsid)
   - [POST /api/memory](#15-post-apimemory)
   - [POST /api/setup](#16-post-apisetup)
4. [Skills System Routes](#skills-system-routes)
   - [GET /api/skills](#17-get-apiskills)
   - [GET /api/skills/[id]](#18-get-apiskillsid)
   - [POST /api/skills/execute](#19-post-apiskillexecute)
   - [POST /api/skills/auto-learn](#20-post-apiskillsauto-learn)
5. [AI Provider Routes](#ai-provider-routes)
   - [POST /api/ai/chat](#21-post-apiaichat)
   - [POST /api/ai/vision](#22-post-apiaivision)
   - [POST /api/ai/asr](#23-post-apiaiasr)
   - [POST /api/ai/tts](#24-post-apiaitts)
   - [POST /api/ai/image](#25-post-apiaiimage)
   - [POST /api/ai/search](#26-post-apiaisearch)
   - [POST /api/ai/read](#27-post-apiairead)
   - [GET /api/ai/status](#28-get-apiaistatus)
6. [Gateway / Messaging Routes](#gateway--messaging-routes)
   - [GET /api/gateway/status](#29-get-apigatewaystatus)
   - [GET /api/gateway/config](#30-get-apigatewayconfig)
   - [POST /api/gateway/telegram/setup](#31-post-apigatewaytelegramsetup)
   - [POST /api/gateway/telegram/webhook](#32-post-apigatewaytelegramwebhook)
   - [POST /api/gateway/whatsapp/setup](#33-post-apigatewaywhatsappsetup)
   - [POST /api/gateway/whatsapp/webhook](#34-post-apigatewaywhatsappwebhook)
7. [OpenClaw Routes](#openclaw-routes)
   - [GET /api/openclaw/channels](#35-get-apiopenclawchannels)
   - [GET /api/openclaw/channels/[id]](#36-get-apiopenclawchannelsid)
   - [POST /api/openclaw/gateway](#37-post-apiopenclawgateway)
   - [GET /api/openclaw/plugins](#38-get-apiopenclawplugins)
   - [GET /api/openclaw/delegates](#39-get-apiopenclawdelegates)
   - [POST /api/openclaw/webhooks](#40-post-apiopenclawwebhooks)
   - [GET /api/openclaw/soul](#41-get-apiopenclawsoul)
   - [POST /api/openclaw/automation](#42-post-apiopenclawautomation)
   - [POST /api/openclaw/cli](#43-post-apiopenclawcli)
8. [AI SDK Usage Notes](#ai-sdk-usage-notes)
9. [Error Handling](#error-handling)

---

## Overview

GangNiaga AI OS exposes **41 API routes** across **6 route groups**. The architecture uses a **multi-provider AI adapter** with automatic provider detection and round-robin load balancing, a **dual-database** strategy (Supabase PostgreSQL primary + Prisma SQLite fallback), and a **SOUL.md personality system** that contextualizes all AI responses.

### Route Groups Summary

| Group | Routes | AI-Powered | DB-Powered | Purpose |
|-------|--------|------------|------------|---------|
| **Core Business** | 16 | 6 | 6 | Chat, plans, agents, dashboard, forecast, reports, idea canvas, plan review, pitch deck, sessions, memory, setup |
| **Skills System** | 4 | 2 | 2 | Skill listing, execution, auto-learning |
| **AI Provider** | 8 | 8 | 0 | Multi-provider AI capabilities (chat, vision, ASR, TTS, image gen, search, read, status) |
| **Gateway / Messaging** | 6 | 0 | 2 | Telegram & WhatsApp bot integration |
| **OpenClaw** | 9 | 2 | 4 | Channel management, plugins, delegates, webhooks, SOUL.md, automation, CLI |

### Complete Route Table

| # | Method | Route | AI | DB | Purpose |
|---|--------|-------|----|----|---------|
| 1 | GET | `/api` | — | — | Health check |
| 2 | POST | `/api/chat` | ✓ | — | AI Copilot chat |
| 3 | POST | `/api/business-plan` | ✓ | — | 21-section proposal generation |
| 4 | GET | `/api/agents` | — | ✓ | List agents |
| 5 | POST | `/api/agents` | — | ✓ | Create agent |
| 6 | GET | `/api/dashboard` | — | ✓ | Dashboard data aggregation |
| 7 | POST | `/api/forecast` | ✓ | — | Financial analysis |
| 8 | GET | `/api/reports` | — | ✓ | List reports |
| 9 | POST | `/api/reports` | ✓ | — | Generate report |
| 10 | POST | `/api/idea-canvas` | ✓ | — | Idea validation |
| 11 | POST | `/api/plan-review` | ✓ | — | Plan review |
| 12 | POST | `/api/pitch-deck` | ✓ | — | Pitch deck generation |
| 13 | POST | `/api/sessions` | — | ✓ | Create session |
| 14 | GET | `/api/sessions/[id]` | — | ✓ | Get session |
| 15 | POST | `/api/memory` | — | ✓ | Memory operations |
| 16 | POST | `/api/setup` | — | ✓ | Database setup/seed |
| 17 | GET | `/api/skills` | — | ✓ | List skills |
| 18 | GET | `/api/skills/[id]` | — | ✓ | Get skill details |
| 19 | POST | `/api/skills/execute` | ✓ | ✓ | Execute a skill |
| 20 | POST | `/api/skills/auto-learn` | ✓ | ✓ | Auto-learn new skills |
| 21 | POST | `/api/ai/chat` | ✓ | — | AI chat completions |
| 22 | POST | `/api/ai/vision` | ✓ | — | Vision/image analysis |
| 23 | POST | `/api/ai/asr` | ✓ | — | Speech-to-text |
| 24 | POST | `/api/ai/tts` | ✓ | — | Text-to-speech |
| 25 | POST | `/api/ai/image` | ✓ | — | Image generation |
| 26 | POST | `/api/ai/search` | ✓ | — | Web search |
| 27 | POST | `/api/ai/read` | ✓ | — | Web page reading |
| 28 | GET | `/api/ai/status` | — | — | AI provider status |
| 29 | GET | `/api/gateway/status` | — | ✓ | Gateway status |
| 30 | GET | `/api/gateway/config` | — | — | Gateway config |
| 31 | POST | `/api/gateway/telegram/setup` | — | ✓ | Setup Telegram bot |
| 32 | POST | `/api/gateway/telegram/webhook` | — | — | Telegram webhook |
| 33 | POST | `/api/gateway/whatsapp/setup` | — | ✓ | Setup WhatsApp |
| 34 | POST | `/api/gateway/whatsapp/webhook` | — | — | WhatsApp webhook |
| 35 | GET | `/api/openclaw/channels` | — | ✓ | List channels |
| 36 | GET | `/api/openclaw/channels/[id]` | — | ✓ | Get channel |
| 37 | POST | `/api/openclaw/gateway` | ✓ | — | Gateway operations |
| 38 | GET | `/api/openclaw/plugins` | — | ✓ | List plugins |
| 39 | GET | `/api/openclaw/delegates` | — | ✓ | List delegates |
| 40 | POST | `/api/openclaw/webhooks` | — | ✓ | Webhook operations |
| 41 | GET | `/api/openclaw/soul` | — | — | Get SOUL.md |
| 42 | POST | `/api/openclaw/automation` | ✓ | — | Automation tasks |
| 43 | POST | `/api/openclaw/cli` | ✓ | — | CLI operations |

---

## Common Patterns

### Request Headers

```http
Content-Type: application/json
```

> Authentication headers (e.g., `Authorization: Bearer <token>`) will be required starting v0.4.0.

### Standard Error Response

```typescript
interface ApiError {
  error: string;
}
```

### Multi-Provider AI Adapter

All AI-powered routes use the multi-provider adapter from `src/lib/ai-provider.ts` with automatic provider detection:

```typescript
import { getAICompletion, getAIStatus } from '@/lib/ai-provider';

// Provider detection priority:
// 1. ZAI    — if ZAI_BASE_URL is set or running outside Vercel (dev environment)
// 2. OpenRouter — if OPENROUTER_API_KEY_1 is set (supports up to 4 keys, round-robin)
// 3. OpenAI — if OPENAI_API_KEY is set
// 4. No-op  — if no provider is configured

const completion = await getAICompletion({
  messages: [
    { role: 'system', content: 'System prompt...' },
    { role: 'user', content: 'User prompt...' },
  ],
});

const status = await getAIStatus();
// Returns: { provider: 'zai' | 'openrouter' | 'openai' | 'none', model: string, capabilities: string[] }
```

**Provider capabilities matrix:**

| Capability | ZAI | OpenAI | OpenRouter |
|-----------|-----|--------|------------|
| Chat | ✓ | ✓ | ✓ |
| Vision | ✓ | ✓ | ✓ |
| TTS | ✓ | ✓ | ⚠ (text-only fallback) |
| ASR | ✓ | ✓ | ✗ |
| Image Gen/Edit | ✓ | ✓ | ✗ |
| Web Search | ✓ | ⚠ (simulated) | ✗ |
| Page Reader | ✓ | ⚠ (simulated) | ✗ |

**OpenRouter round-robin:** If multiple `OPENROUTER_API_KEY_1` through `OPENROUTER_API_KEY_4` are set, requests are distributed across keys using a rotating index to balance load and avoid rate limits.

**Default model:** `openrouter/owl-alpha`

### ZAI SDK Singleton Pattern (Legacy)

Routes that still use the direct ZAI SDK (not the multi-provider adapter) use a lazy-initialized singleton:

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

> **Note:** New routes should use the multi-provider adapter (`getAICompletion`) instead of the direct ZAI SDK singleton. The singleton pattern is being deprecated in favor of the adapter.

### SOUL.md Personality System

AI responses are contextualized through the SOUL.md personality system, loaded from `GET /api/openclaw/soul`. The SOUL.md defines:

- **Persona**: GangNiaga's business intelligence character and tone
- **Values**: Southeast Asian market focus, MYR (RM) currency conventions
- **Response style**: Professional, data-driven, actionable
- **Domain expertise**: Business planning, financial forecasting, SME operations

### Dual-Database Architecture

| Database | Role | Use Case |
|----------|------|----------|
| **Supabase PostgreSQL** | Primary | Production data, real-time features, multi-tenancy |
| **Prisma SQLite** | Fallback | Local development, offline mode, single-tenant |

Routes attempt Supabase first and fall back to Prisma SQLite if the Supabase connection fails.

---

## Core Business Routes

### 1. GET /api

Health check endpoint. Returns system status, version, and provider information.

### Response Body

```typescript
interface HealthCheckResponse {
  status: 'ok';
  version: string;          // e.g., "0.3.0"
  timestamp: string;        // ISO datetime
  provider: string;         // Current AI provider name
}
```

### Example curl

```bash
curl http://localhost:3000/api
```

---

### 2. POST /api/chat

AI Copilot chat endpoint — the conversational interface for GangNiaga AI OS. Maintains context via message history and responds with domain-specific business intelligence. Responses are contextualized through the SOUL.md personality system.

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
| `500` | AI provider fails or returns empty | `{ error: 'Failed to generate response' }` |

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
- Uses the multi-provider AI adapter with automatic fallback.

---

### 3. POST /api/business-plan

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
| `500` | AI provider fails or returns empty | `{ error: 'Failed to generate content' }` |

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
```

### Notes

- Each section has a **unique, hand-crafted prompt** that instructs the AI on exactly what to include and how to format it.
- The **proposal type** adds a contextual overlay (e.g., bank loans emphasize DSCR and collateral; grants emphasize social impact).
- If an unknown section key is provided, a generic fallback prompt is used.
- Content is returned in **Markdown** format with `**bold**` headers and bullet points.

---

### 4. GET /api/agents

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

### 5. POST /api/agents

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

### 6. GET /api/dashboard

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

### 7. POST /api/forecast

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
| `500` | AI provider fails or returns empty | `{ error: 'Failed to generate analysis' }` |

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
```

### Notes

- The AI is prompted to provide: (1) key insights and trends, (2) risk factors, (3) optimization recommendations, (4) forecast confidence level.
- The system prompt positions the AI as an "expert financial analyst" that provides data-driven analysis.
- Input data is serialized as pretty-printed JSON within the prompt for readability.
- No data is persisted to the database — this is a stateless analysis endpoint.

---

### 8. GET /api/reports

Lists previously generated reports from the database.

### Request

No request body required.

### Response Body

```typescript
interface ReportsListResponse {
  reports: Array<{
    id: string;
    title: string;
    type: string;           // "investor" | "board" | "financial" | "kpi" | "operational"
    format: string;         // "pdf" | "docx" | "xlsx" | "csv"
    status: string;         // "draft" | "completed" | "archived"
    createdAt: string;
    updatedAt: string;
  }>;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | Database query fails | `{ error: 'Failed to fetch reports' }` |

### Example curl

```bash
curl http://localhost:3000/api/reports
```

---

### 9. POST /api/reports

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
| `500` | AI provider fails or returns empty | `{ error: 'Failed to generate report' }` |

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
```

### Notes

- The AI is pre-loaded with GangNiaga business context (MRR, ARR, burn rate, runway, churn, growth).
- The `format` field is currently **metadata only** — the actual content is always generated as Markdown. PDF/DOCX/XLSX/CSV conversion is planned for v0.4.0.
- Report type descriptions:
  - `investor`: Investor update report
  - `board`: Board meeting presentation report
  - `financial`: Comprehensive financial report
  - `kpi`: KPI summary and performance report
  - `operational`: Operational intelligence and status report

---

### 10. POST /api/idea-canvas

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
| `500` | AI provider fails or returns empty | `{ error: 'Failed to validate idea' }` |

### Example curl

```bash
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

### 11. POST /api/plan-review

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
| `500` | AI provider fails or returns empty | `{ error: 'Failed to generate plan review' }` |

### Example curl

```bash
# Review a plan from a bank's perspective
curl -X POST http://localhost:3000/api/plan-review \
  -H "Content-Type: application/json" \
  -d '{"planId": "1", "lenderPersona": "bank"}'
```

### Notes

- **Persona-specific focus areas:**
  - `bank`: DSCR, collateral, cash flow stability, repayment capacity
  - `investor`: Growth potential, market size, unit economics, exit strategy
  - `grant_officer`: Community impact, compliance, feasibility, public benefit
- The AI is instructed to check 6 consistency dimensions: revenue growth consistency, fund itemization, DSCR calculation consistency, market size backing, narrative gaps, and internal financial consistency.
- JSON parsing uses the same regex extraction pattern as `/api/idea-canvas`.
- If JSON parsing fails, a **fallback review** is returned with moderate scores (70/65/60/65) and generic recommendations.

---

### 12. POST /api/pitch-deck

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
| `500` | AI provider fails or returns empty | `{ error: 'Failed to generate pitch deck' }` |

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
```

### Notes

- **Template type context:**
  - `investor`: Emphasizes massive market, growth velocity, scalability, moat, 10x return
  - `bank`: Emphasizes stable cash flow, DSCR >1.25x, repayment, collateral, conservative projections
  - `grant`: Emphasizes social impact, community development, job creation, measurable outcomes
- For **slide generation**, the AI is asked to produce 7-8 slides as a JSON array.
- For **question generation**, the AI generates 5 questions specific to the template type audience.
- Both paths use **regex-based JSON extraction** with structured fallbacks if parsing fails.

---

### 13. POST /api/sessions

Creates a new conversation session for persisting chat history and context.

### Request Body

```typescript
interface CreateSessionRequest {
  /** Session name/title (optional) */
  name?: string;
  /** Session type (optional, e.g., "chat", "analysis", "planning") */
  type?: string;
  /** Initial context/metadata (optional) */
  metadata?: Record<string, unknown>;
}
```

### Response Body

```typescript
interface CreateSessionResponse {
  session: {
    id: string;
    name: string;
    type: string;
    metadata: string | null;   // JSON stringified
    createdAt: string;
    updatedAt: string;
  };
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | Database creation fails | `{ error: 'Failed to create session' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"name": "Bank Loan Analysis", "type": "analysis"}'
```

---

### 14. GET /api/sessions/[id]

Retrieves a specific session by ID, including its full message history.

### Request

No request body required. Session ID is provided in the URL path.

### Response Body

```typescript
interface SessionResponse {
  session: {
    id: string;
    name: string;
    type: string;
    metadata: string | null;
    messages: Array<{
      id: string;
      role: 'user' | 'assistant' | 'system';
      content: string;
      createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `404` | Session not found | `{ error: 'Session not found' }` |
| `500` | Database query fails | `{ error: 'Failed to fetch session' }` |

### Example curl

```bash
curl http://localhost:3000/api/sessions/clx123abc
```

---

### 15. POST /api/memory

Memory operations for storing and retrieving contextual information across sessions. Supports CRUD operations on memory entries.

### Request Body

```typescript
interface MemoryRequest {
  /** Operation type (required) */
  action: 'store' | 'retrieve' | 'delete' | 'search';
  /** Memory key (required for store/retrieve/delete) */
  key?: string;
  /** Memory value (required for store) */
  value?: string;
  /** Search query (required for search) */
  query?: string;
  /** Namespace/category for the memory (optional) */
  namespace?: string;
}
```

### Response Body

```typescript
interface MemoryResponse {
  success: boolean;
  data?: unknown;         // Depends on action type
  error?: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing required fields for action | `{ error: 'Key is required for store/retrieve/delete' }` |
| `500` | Database operation fails | `{ error: 'Failed to perform memory operation' }` |

### Example curl

```bash
# Store a memory
curl -X POST http://localhost:3000/api/memory \
  -H "Content-Type: application/json" \
  -d '{"action": "store", "key": "user_preference_currency", "value": "MYR"}'

# Retrieve a memory
curl -X POST http://localhost:3000/api/memory \
  -H "Content-Type: application/json" \
  -d '{"action": "retrieve", "key": "user_preference_currency"}'

# Search memories
curl -X POST http://localhost:3000/api/memory \
  -H "Content-Type: application/json" \
  -d '{"action": "search", "query": "currency preferences"}'
```

---

### 16. POST /api/setup

Initializes the database schema and seeds default data. Used for first-time setup and resetting the database.

### Request Body

```typescript
interface SetupRequest {
  /** Whether to seed demo/sample data (optional, defaults to true) */
  seed?: boolean;
  /** Whether to force reset existing data (optional, defaults to false) */
  force?: boolean;
}
```

### Response Body

```typescript
interface SetupResponse {
  success: boolean;
  message: string;        // e.g., "Database setup complete with seed data"
  tables?: string[];      // List of created/synced tables
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | Database setup fails | `{ error: 'Failed to setup database' }` |

### Example curl

```bash
# Setup with seed data
curl -X POST http://localhost:3000/api/setup \
  -H "Content-Type: application/json" \
  -d '{"seed": true}'

# Force reset
curl -X POST http://localhost:3000/api/setup \
  -H "Content-Type: application/json" \
  -d '{"seed": true, "force": true}'
```

---

## Skills System Routes

The Skills System provides an extensible framework for defining, executing, and auto-learning AI-powered capabilities. Skills are composable units of work that can be chained, scheduled, or triggered by events.

### 17. GET /api/skills

Lists all available skills with their metadata and execution statistics.

### Request

No request body required. Optional query parameters for filtering.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by skill category (e.g., "analysis", "generation", "automation") |
| `status` | string | Filter by status: "active" | "deprecated" | "beta" |

### Response Body

```typescript
interface SkillsListResponse {
  skills: Array<{
    id: string;
    name: string;
    description: string;
    category: string;        // "analysis" | "generation" | "automation" | "communication" | "data"
    version: string;         // Semver, e.g., "1.0.0"
    status: 'active' | 'deprecated' | 'beta';
    capabilities: string[];  // e.g., ["chat", "vision", "search"]
    executionCount: number;
    lastExecuted: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | Database query fails | `{ error: 'Failed to fetch skills' }` |

### Example curl

```bash
# List all skills
curl http://localhost:3000/api/skills

# Filter by category
curl "http://localhost:3000/api/skills?category=analysis"
```

---

### 18. GET /api/skills/[id]

Retrieves detailed information about a specific skill, including its full configuration, parameters, and recent execution history.

### Request

No request body required. Skill ID is provided in the URL path.

### Response Body

```typescript
interface SkillDetailResponse {
  skill: {
    id: string;
    name: string;
    description: string;
    category: string;
    version: string;
    status: 'active' | 'deprecated' | 'beta';
    capabilities: string[];
    parameters: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'object' | 'array';
      required: boolean;
      defaultValue?: unknown;
      description: string;
    }>;
    executionCount: number;
    successRate: number;     // 0-1
    avgExecutionTime: number; // milliseconds
    lastExecuted: string | null;
    recentExecutions: Array<{
      id: string;
      status: 'success' | 'failed' | 'timeout';
      duration: number;
      createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `404` | Skill not found | `{ error: 'Skill not found' }` |
| `500` | Database query fails | `{ error: 'Failed to fetch skill' }` |

### Example curl

```bash
curl http://localhost:3000/api/skills/skill-market-analysis
```

---

### 19. POST /api/skills/execute

Executes a skill with the provided parameters. The AI provider is selected based on the skill's required capabilities.

### Request Body

```typescript
interface SkillExecuteRequest {
  /** Skill ID to execute (required) */
  skillId: string;
  /** Skill parameters (required — must match skill's parameter schema) */
  parameters: Record<string, unknown>;
  /** Execution context/metadata (optional) */
  context?: {
    sessionId?: string;
    userId?: string;
    priority?: 'low' | 'normal' | 'high';
  };
}
```

### Response Body

```typescript
interface SkillExecuteResponse {
  executionId: string;
  skillId: string;
  status: 'success' | 'failed' | 'partial';
  result: unknown;          // Depends on skill type
  duration: number;         // milliseconds
  provider: string;         // Which AI provider was used
  model: string;            // Which model was used
  createdAt: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `skillId` or `parameters` | `{ error: 'skillId and parameters are required' }` |
| `404` | Skill not found | `{ error: 'Skill not found' }` |
| `500` | Execution fails | `{ error: 'Failed to execute skill' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/skills/execute \
  -H "Content-Type: application/json" \
  -d '{
    "skillId": "skill-market-analysis",
    "parameters": {
      "industry": "SaaS",
      "region": "Southeast Asia",
      "depth": "comprehensive"
    },
    "context": {
      "sessionId": "sess_abc123",
      "priority": "high"
    }
  }'
```

---

### 20. POST /api/skills/auto-learn

Triggers the auto-learning system to analyze gaps in the current skill set and propose new skills based on usage patterns, failed requests, and emerging needs.

### Request Body

```typescript
interface AutoLearnRequest {
  /** Context for auto-learning — what area to focus on (optional) */
  focusArea?: string;
  /** Whether to auto-create discovered skills (optional, defaults to false — preview only) */
  autoCreate?: boolean;
  /** Maximum number of new skills to propose (optional, defaults to 5) */
  maxProposals?: number;
}
```

### Response Body

```typescript
interface AutoLearnResponse {
  proposals: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    rationale: string;       // Why this skill is needed
    confidence: number;      // 0-1, how confident the AI is this skill is useful
    suggestedParameters: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
    status: 'proposed' | 'created';
  }>;
  analysisSummary: string;   // AI-generated summary of skill gaps
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `500` | Auto-learn analysis fails | `{ error: 'Failed to auto-learn skills' }` |

### Example curl

```bash
# Preview auto-learn proposals
curl -X POST http://localhost:3000/api/skills/auto-learn \
  -H "Content-Type: application/json" \
  -d '{"focusArea": "financial analysis", "maxProposals": 3}'

# Auto-create discovered skills
curl -X POST http://localhost:3000/api/skills/auto-learn \
  -H "Content-Type: application/json" \
  -d '{"focusArea": "market research", "autoCreate": true, "maxProposals": 5}'
```

---

## AI Provider Routes

These routes expose the **multi-provider AI adapter** directly, allowing fine-grained access to specific AI capabilities. The adapter automatically selects the best provider based on the requested capability and current provider availability.

### 21. POST /api/ai/chat

AI chat completions using the multi-provider adapter. Supports conversation context and system prompts.

### Request Body

```typescript
interface AIChatRequest {
  /** Messages array (required) */
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  /** Preferred model (optional, defaults to provider default) */
  model?: string;
  /** Temperature for response randomness (optional, 0-2, defaults to 0.7) */
  temperature?: number;
  /** Maximum tokens in response (optional) */
  maxTokens?: number;
}
```

### Response Body

```typescript
interface AIChatResponse {
  content: string;
  provider: string;         // Which provider handled the request
  model: string;            // Which model was used
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing or invalid `messages` | `{ error: 'Messages array is required' }` |
| `500` | No AI provider available or completion fails | `{ error: 'Failed to generate completion' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "system", "content": "You are a financial analyst." },
      { "role": "user", "content": "Analyze this revenue trend: +15%, +22%, +31%" }
    ],
    "temperature": 0.5
  }'
```

---

### 22. POST /api/ai/vision

Vision/image analysis using AI. Supports image URLs and base64-encoded images.

### Request Body

```typescript
interface AIVisionRequest {
  /** Image URL or base64 data URI (required) */
  image: string;
  /** Question/prompt about the image (required) */
  prompt: string;
  /** Preferred model (optional) */
  model?: string;
}
```

### Response Body

```typescript
interface AIVisionResponse {
  analysis: string;
  provider: string;
  model: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `image` or `prompt` | `{ error: 'Image and prompt are required' }` |
| `500` | Vision analysis fails | `{ error: 'Failed to analyze image' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/ai/vision \
  -H "Content-Type: application/json" \
  -d '{
    "image": "https://example.com/chart.png",
    "prompt": "What are the key trends shown in this financial chart?"
  }'
```

### Notes

- **Provider support:** ZAI (full), OpenAI (full), OpenRouter (full).
- Images can be provided as URLs or base64 data URIs (`data:image/png;base64,...`).

---

### 23. POST /api/ai/asr

Automatic Speech Recognition — converts audio to text.

### Request Body

```typescript
interface AIASRRequest {
  /** Audio data as base64 string (required) */
  audio: string;
  /** Audio format (optional, defaults to "wav") */
  format?: 'wav' | 'mp3' | 'ogg' | 'flac';
  /** Language hint (optional, e.g., "en", "ms" for Malay) */
  language?: string;
}
```

### Response Body

```typescript
interface AIASRResponse {
  text: string;
  provider: string;
  language?: string;       // Detected language
  confidence?: number;     // 0-1
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `audio` | `{ error: 'Audio data is required' }` |
| `501` | Current provider doesn't support ASR (OpenRouter) | `{ error: 'ASR is not supported by the current provider' }` |
| `500` | Transcription fails | `{ error: 'Failed to transcribe audio' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/ai/asr \
  -H "Content-Type: application/json" \
  -d '{
    "audio": "data:audio/wav;base64,UklGRi...",
    "format": "wav",
    "language": "en"
  }'
```

### Notes

- **Provider support:** ZAI (full), OpenAI (full), OpenRouter (**not supported** — returns 501).

---

### 24. POST /api/ai/tts

Text-to-Speech — converts text to audio.

### Request Body

```typescript
interface AITTSRequest {
  /** Text to convert to speech (required) */
  text: string;
  /** Voice selection (optional, provider-specific) */
  voice?: string;
  /** Output format (optional, defaults to "mp3") */
  format?: 'mp3' | 'wav' | 'ogg';
  /** Speech speed (optional, 0.5-2.0, defaults to 1.0) */
  speed?: number;
}
```

### Response Body

```typescript
interface AITTSResponse {
  audio: string;            // Base64-encoded audio data
  provider: string;
  format: string;
  duration?: number;        // Duration in seconds
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `text` | `{ error: 'Text is required' }` |
| `500` | TTS generation fails | `{ error: 'Failed to generate speech' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/ai/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome to GangNiaga AI OS. Your business intelligence dashboard is ready.",
    "voice": "alloy",
    "speed": 1.0
  }'
```

### Notes

- **Provider support:** ZAI (full), OpenAI (full), OpenRouter (**fallback text-only** — returns text instead of audio).

---

### 25. POST /api/ai/image

AI image generation from text descriptions.

### Request Body

```typescript
interface AIImageRequest {
  /** Text description of the desired image (required) */
  prompt: string;
  /** Image width in pixels (optional, defaults to 1024) */
  width?: number;
  /** Image height in pixels (optional, defaults to 1024) */
  height?: number;
  /** Number of images to generate (optional, 1-4, defaults to 1) */
  n?: number;
  /** Style modifier (optional) */
  style?: 'natural' | 'vivid';
}
```

### Response Body

```typescript
interface AIImageResponse {
  images: Array<{
    url?: string;            // Image URL (if hosted)
    base64?: string;         // Base64 image data
    revisedPrompt?: string;  // The prompt the model actually used
  }>;
  provider: string;
  model: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `prompt` | `{ error: 'Prompt is required' }` |
| `500` | Image generation fails | `{ error: 'Failed to generate image' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/ai/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A professional business dashboard showing revenue growth charts in a modern office setting",
    "width": 1792,
    "height": 1024,
    "style": "vivid"
  }'
```

### Notes

- **Provider support:** ZAI (full), OpenAI (full), OpenRouter (**not supported**).

---

### 26. POST /api/ai/search

Web search using AI-powered search capabilities.

### Request Body

```typescript
interface AISearchRequest {
  /** Search query (required) */
  query: string;
  /** Maximum number of results (optional, 1-10, defaults to 5) */
  maxResults?: number;
  /** Search context / purpose (optional, helps the AI refine results) */
  context?: string;
}
```

### Response Body

```typescript
interface AISearchResponse {
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    relevanceScore?: number;
  }>;
  provider: string;
  query: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `query` | `{ error: 'Query is required' }` |
| `500` | Search fails | `{ error: 'Failed to perform search' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SME financing options Malaysia 2025",
    "maxResults": 5,
    "context": "research for business loan proposal"
  }'
```

### Notes

- **Provider support:** ZAI (full — real web search), OpenAI (simulated — uses LLM knowledge), OpenRouter (**not supported**).

---

### 27. POST /api/ai/read

Web page content extraction and reading.

### Request Body

```typescript
interface AIReadRequest {
  /** URL of the web page to read (required) */
  url: string;
  /** What to extract/summarize (optional) */
  prompt?: string;
  /** Whether to include raw HTML (optional, defaults to false) */
  includeHtml?: boolean;
}
```

### Response Body

```typescript
interface AIReadResponse {
  title: string;
  content: string;          // Extracted and/or summarized content
  url: string;
  provider: string;
  publishedAt?: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `url` | `{ error: 'URL is required' }` |
| `500` | Page reading fails | `{ error: 'Failed to read page' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/ai/read \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.mida.gov.my/incentives/",
    "prompt": "Extract all available tax incentives for SaaS companies"
  }'
```

### Notes

- **Provider support:** ZAI (full — real page reading), OpenAI (simulated — uses LLM knowledge), OpenRouter (**not supported**).

---

### 28. GET /api/ai/status

Returns the current AI provider status, including which provider is active, available models, and capability support.

### Request

No request body required.

### Response Body

```typescript
interface AIStatusResponse {
  provider: 'zai' | 'openrouter' | 'openai' | 'none';
  model: string;            // Current default model
  capabilities: Array<{
    name: string;           // "chat", "vision", "tts", "asr", "image", "search", "read"
    supported: boolean;
    notes?: string;         // e.g., "simulated", "fallback text-only"
  }>;
  providerDetails: {
    name: string;
    baseUrl?: string;
    availableModels?: string[];
    keyCount?: number;      // For OpenRouter: number of configured API keys
    currentKeyIndex?: number; // For OpenRouter: current round-robin index
  };
  latency?: {
    lastRequestMs: number;
    avgRequestMs: number;
  };
}
```

### Example curl

```bash
curl http://localhost:3000/api/ai/status
```

---

## Gateway / Messaging Routes

The Gateway system enables integration with external messaging platforms (Telegram, WhatsApp), allowing GangNiaga AI OS to function as a conversational AI assistant on these channels.

### 29. GET /api/gateway/status

Returns the current status of all messaging gateway integrations.

### Response Body

```typescript
interface GatewayStatusResponse {
  telegram: {
    configured: boolean;
    botUsername?: string;
    webhookUrl?: string;
    lastActivity?: string;
  };
  whatsapp: {
    configured: boolean;
    phoneNumber?: string;
    webhookUrl?: string;
    lastActivity?: string;
  };
  activeConnections: number;
}
```

### Example curl

```bash
curl http://localhost:3000/api/gateway/status
```

---

### 30. GET /api/gateway/config

Returns the gateway configuration (non-sensitive fields only).

### Response Body

```typescript
interface GatewayConfigResponse {
  telegram: {
    enabled: boolean;
    webhookMode: boolean;
    allowedChatTypes: string[];
  };
  whatsapp: {
    enabled: boolean;
    webhookMode: boolean;
    allowedNumbers: string[];  // Masked for privacy
  };
  rateLimits: {
    maxMessagesPerMinute: number;
    maxMessagesPerHour: number;
  };
}
```

### Example curl

```bash
curl http://localhost:3000/api/gateway/config
```

---

### 31. POST /api/gateway/telegram/setup

Sets up a Telegram bot integration by registering the webhook URL with the Telegram API.

### Request Body

```typescript
interface TelegramSetupRequest {
  /** Telegram Bot API token (required) */
  botToken: string;
  /** Custom webhook URL (optional, auto-generated if omitted) */
  webhookUrl?: string;
  /** Allowed chat types (optional, defaults to ["private", "group"]) */
  allowedChatTypes?: Array<'private' | 'group' | 'supergroup'>;
}
```

### Response Body

```typescript
interface TelegramSetupResponse {
  success: boolean;
  botUsername: string;
  webhookUrl: string;
  message: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `botToken` | `{ error: 'Bot token is required' }` |
| `500` | Telegram API registration fails | `{ error: 'Failed to setup Telegram bot' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/gateway/telegram/setup \
  -H "Content-Type: application/json" \
  -d '{
    "botToken": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
    "allowedChatTypes": ["private", "group"]
  }'
```

---

### 32. POST /api/gateway/telegram/webhook

Receives and processes incoming Telegram webhook events. This endpoint is called by the Telegram API when users interact with the bot.

### Request Body

```typescript
interface TelegramWebhookRequest {
  // Standard Telegram Update object
  update_id: number;
  message?: {
    message_id: number;
    chat: {
      id: number;
      type: string;
    };
    text?: string;
    from?: {
      id: number;
      username?: string;
      first_name?: string;
    };
  };
  // ... other Telegram update fields
}
```

### Response Body

```typescript
interface TelegramWebhookResponse {
  success: boolean;
  replySent: boolean;
}
```

### Notes

- This endpoint is designed to be called by Telegram's servers, not by your application.
- Incoming messages are processed through the SOUL.md personality system and the multi-provider AI adapter.
- Responses are sent back via the Telegram Bot API.

---

### 33. POST /api/gateway/whatsapp/setup

Sets up a WhatsApp Business API integration.

### Request Body

```typescript
interface WhatsAppSetupRequest {
  /** WhatsApp Business API phone number ID (required) */
  phoneNumberId: string;
  /** WhatsApp Business access token (required) */
  accessToken: string;
  /** WhatsApp Business Account ID (optional) */
  businessAccountId?: string;
  /** Verify token for webhook verification (optional, auto-generated if omitted) */
  verifyToken?: string;
}
```

### Response Body

```typescript
interface WhatsAppSetupResponse {
  success: boolean;
  webhookUrl: string;
  verifyToken: string;
  message: string;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing required fields | `{ error: 'Phone number ID and access token are required' }` |
| `500` | WhatsApp API setup fails | `{ error: 'Failed to setup WhatsApp integration' }` |

### Example curl

```bash
curl -X POST http://localhost:3000/api/gateway/whatsapp/setup \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "1234567890",
    "accessToken": "EAAx...",
    "businessAccountId": "biz_123"
  }'
```

---

### 34. POST /api/gateway/whatsapp/webhook

Receives and processes incoming WhatsApp webhook events. Handles both verification challenges and message events.

### Query Parameters (for verification)

| Parameter | Type | Description |
|-----------|------|-------------|
| `hub.mode` | string | Set to "subscribe" for verification |
| `hub.verify_token` | string | Must match the configured verify token |
| `hub.challenge` | string | Challenge string to echo back |

### Request Body (for messages)

```typescript
interface WhatsAppWebhookRequest {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messages?: Array<{
          from: string;
          id: string;
          text?: { body: string };
          timestamp: string;
        }>;
      };
      field: string;
    }>;
  }>;
}
```

### Response

- **Verification:** Returns `hub.challenge` value with status 200
- **Messages:** Returns `{ success: true }` with status 200

### Notes

- This endpoint handles both the WhatsApp webhook verification handshake and incoming message processing.
- Incoming messages are processed through the SOUL.md personality system and the multi-provider AI adapter.

---

## OpenClaw Routes

The OpenClaw system provides a unified framework for channel management, plugin orchestration, delegate coordination, and automation. It serves as the backbone for GangNiaga's multi-channel business intelligence capabilities.

### 35. GET /api/openclaw/channels

Lists all configured communication channels across platforms.

### Response Body

```typescript
interface ChannelsListResponse {
  channels: Array<{
    id: string;
    name: string;
    type: 'telegram' | 'whatsapp' | 'web' | 'email' | 'api';
    status: 'active' | 'inactive' | 'error';
    config: string | null;   // JSON string
    lastActivity: string | null;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

### Example curl

```bash
curl http://localhost:3000/api/openclaw/channels
```

---

### 36. GET /api/openclaw/channels/[id]

Retrieves detailed information about a specific channel.

### Response Body

```typescript
interface ChannelDetailResponse {
  channel: {
    id: string;
    name: string;
    type: 'telegram' | 'whatsapp' | 'web' | 'email' | 'api';
    status: 'active' | 'inactive' | 'error';
    config: string | null;
    lastActivity: string | null;
    messageCount: number;
    recentMessages: Array<{
      id: string;
      direction: 'inbound' | 'outbound';
      content: string;
      createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `404` | Channel not found | `{ error: 'Channel not found' }` |

### Example curl

```bash
curl http://localhost:3000/api/openclaw/channels/ch_telegram_main
```

---

### 37. POST /api/openclaw/gateway

Gateway operations for the OpenClaw system — routing messages between channels, AI processing, and external services.

### Request Body

```typescript
interface OpenClawGatewayRequest {
  /** Gateway operation (required) */
  action: 'route' | 'broadcast' | 'status';
  /** Target channel IDs (required for route/broadcast) */
  channelIds?: string[];
  /** Message payload (required for route/broadcast) */
  message?: {
    content: string;
    type?: 'text' | 'rich' | 'template';
    metadata?: Record<string, unknown>;
  };
  /** Filter criteria for status (optional) */
  filter?: {
    status?: string;
    type?: string;
  };
}
```

### Response Body

```typescript
interface OpenClawGatewayResponse {
  success: boolean;
  action: string;
  results?: Array<{
    channelId: string;
    status: 'sent' | 'failed' | 'queued';
    messageId?: string;
    error?: string;
  }>;
  gateways?: Array<{
    id: string;
    status: string;
    channels: number;
    messagesProcessed: number;
  }>;
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing required fields for action | `{ error: 'Channel IDs and message are required for route/broadcast' }` |
| `500` | Gateway operation fails | `{ error: 'Failed to perform gateway operation' }` |

### Example curl

```bash
# Route a message to specific channels
curl -X POST http://localhost:3000/api/openclaw/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "action": "route",
    "channelIds": ["ch_telegram_main", "ch_whatsapp_sales"],
    "message": {
      "content": "New market analysis report is ready for review.",
      "type": "text"
    }
  }'

# Check gateway status
curl -X POST http://localhost:3000/api/openclaw/gateway \
  -H "Content-Type: application/json" \
  -d '{"action": "status"}'
```

---

### 38. GET /api/openclaw/plugins

Lists all available and installed OpenClaw plugins.

### Response Body

```typescript
interface PluginsListResponse {
  plugins: Array<{
    id: string;
    name: string;
    version: string;
    description: string;
    status: 'installed' | 'available' | 'deprecated';
    capabilities: string[];
    author: string;
    config: string | null;   // JSON string
    installedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

### Example curl

```bash
curl http://localhost:3000/api/openclaw/plugins
```

---

### 39. GET /api/openclaw/delegates

Lists all active delegates — autonomous agents that handle specific task categories within the OpenClaw system.

### Response Body

```typescript
interface DelegatesListResponse {
  delegates: Array<{
    id: string;
    name: string;
    type: string;            // e.g., "analysis", "routing", "response", "escalation"
    status: 'active' | 'idle' | 'error';
    capabilities: string[];
    tasksHandled: number;
    successRate: number;     // 0-1
    lastActivity: string | null;
    config: string | null;   // JSON string
    createdAt: string;
    updatedAt: string;
  }>;
}
```

### Example curl

```bash
curl http://localhost:3000/api/openclaw/delegates
```

---

### 40. POST /api/openclaw/webhooks

Webhook operations — register, list, update, or delete webhooks for external integrations.

### Request Body

```typescript
interface OpenClawWebhookRequest {
  /** Webhook operation (required) */
  action: 'register' | 'list' | 'update' | 'delete' | 'test';
  /** Webhook ID (required for update/delete/test) */
  webhookId?: string;
  /** Webhook configuration (required for register/update) */
  config?: {
    url: string;
    events: string[];        // e.g., ["message.received", "report.generated", "agent.completed"]
    secret?: string;         // For signature verification
    headers?: Record<string, string>;
    retryPolicy?: {
      maxRetries: number;
      backoffMultiplier: number;
    };
  };
}
```

### Response Body

```typescript
interface OpenClawWebhookResponse {
  success: boolean;
  webhook?: {
    id: string;
    url: string;
    events: string[];
    status: 'active' | 'inactive';
    lastTriggered: string | null;
    successCount: number;
    failureCount: number;
    createdAt: string;
    updatedAt: string;
  };
  webhooks?: Array<{
    id: string;
    url: string;
    events: string[];
    status: string;
  }>;
  testResult?: {
    statusCode: number;
    latencyMs: number;
    success: boolean;
  };
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing required fields | `{ error: 'URL and events are required for webhook registration' }` |
| `404` | Webhook not found (for update/delete/test) | `{ error: 'Webhook not found' }` |
| `500` | Webhook operation fails | `{ error: 'Failed to perform webhook operation' }` |

### Example curl

```bash
# Register a new webhook
curl -X POST http://localhost:3000/api/openclaw/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "config": {
      "url": "https://yourapp.com/webhooks/gangniaga",
      "events": ["report.generated", "agent.completed"],
      "secret": "whsec_abc123",
      "retryPolicy": { "maxRetries": 3, "backoffMultiplier": 2 }
    }
  }'

# List all webhooks
curl -X POST http://localhost:3000/api/openclaw/webhooks \
  -H "Content-Type: application/json" \
  -d '{"action": "list"}'

# Test a webhook
curl -X POST http://localhost:3000/api/openclaw/webhooks \
  -H "Content-Type: application/json" \
  -d '{"action": "test", "webhookId": "wh_xyz789"}'
```

---

### 41. GET /api/openclaw/soul

Retrieves the SOUL.md personality document that defines GangNiaga AI's character, values, response style, and domain expertise. This document is used by all AI-powered routes to contextualize responses.

### Response Body

```typescript
interface SoulResponse {
  content: string;          // Raw SOUL.md content in Markdown
  version: string;          // SOUL.md version
  lastModified: string;     // ISO datetime
  summary: {
    persona: string;
    values: string[];
    expertise: string[];
    language: string[];
  };
}
```

### Example curl

```bash
curl http://localhost:3000/api/openclaw/soul
```

### Notes

- The SOUL.md is loaded at startup and cached for performance.
- Changes to SOUL.md take effect on the next server restart or cache invalidation.
- The `summary` field is auto-extracted from the SOUL.md frontmatter/headers.

---

### 42. POST /api/openclaw/automation

Automation task management — create, schedule, and manage automated workflows within the OpenClaw system.

### Request Body

```typescript
interface OpenClawAutomationRequest {
  /** Automation action (required) */
  action: 'create' | 'list' | 'update' | 'delete' | 'execute' | 'schedule';
  /** Automation task ID (required for update/delete/execute) */
  taskId?: string;
  /** Task configuration (required for create/update) */
  config?: {
    name: string;
    description?: string;
    trigger: {
      type: 'cron' | 'event' | 'webhook' | 'manual';
      schedule?: string;      // Cron expression for cron trigger
      event?: string;         // Event name for event trigger
    };
    steps: Array<{
      type: 'ai_completion' | 'skill_execution' | 'webhook_call' | 'data_transform' | 'notification';
      config: Record<string, unknown>;
    }>;
    enabled?: boolean;
  };
}
```

### Response Body

```typescript
interface OpenClawAutomationResponse {
  success: boolean;
  task?: {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'error';
    trigger: {
      type: string;
      schedule?: string;
      event?: string;
    };
    steps: number;
    lastExecution: string | null;
    nextExecution: string | null;
    executionCount: number;
    successRate: number;
    createdAt: string;
    updatedAt: string;
  };
  tasks?: Array<{
    id: string;
    name: string;
    status: string;
    trigger: { type: string };
    nextExecution: string | null;
  }>;
  executionResult?: {
    taskId: string;
    status: 'success' | 'failed' | 'partial';
    stepsCompleted: number;
    stepsTotal: number;
    duration: number;
    output?: unknown;
  };
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing required fields | `{ error: 'Task config is required for create' }` |
| `404` | Task not found | `{ error: 'Automation task not found' }` |
| `500` | Automation operation fails | `{ error: 'Failed to perform automation operation' }` |

### Example curl

```bash
# Create an automated daily report
curl -X POST http://localhost:3000/api/openclaw/automation \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "config": {
      "name": "Daily KPI Summary",
      "description": "Generate and distribute daily KPI summary report",
      "trigger": {
        "type": "cron",
        "schedule": "0 9 * * *"
      },
      "steps": [
        { "type": "skill_execution", "config": { "skillId": "skill-kpi-report" } },
        { "type": "notification", "config": { "channels": ["telegram", "email"] } }
      ],
      "enabled": true
    }
  }'

# List all automation tasks
curl -X POST http://localhost:3000/api/openclaw/automation \
  -H "Content-Type: application/json" \
  -d '{"action": "list"}'

# Manually execute a task
curl -X POST http://localhost:3000/api/openclaw/automation \
  -H "Content-Type: application/json" \
  -d '{"action": "execute", "taskId": "auto_daily_kpi"}'
```

---

### 43. POST /api/openclaw/cli

CLI operations endpoint — provides remote CLI access to OpenClaw system management commands. Intended for administrative use.

### Request Body

```typescript
interface OpenClawCLIRequest {
  /** CLI command to execute (required) */
  command: string;
  /** Command arguments (optional) */
  args?: string[];
  /** Command options (optional) */
  options?: Record<string, string | boolean | number>;
}
```

### Response Body

```typescript
interface OpenClawCLIResponse {
  success: boolean;
  output: string;           // Command output (stdout)
  errors?: string;          // Stderr output if any
  exitCode: number;         // 0 = success
  duration: number;         // Execution time in ms
}
```

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | Missing `command` | `{ error: 'Command is required' }` |
| `403` | Command not allowed | `{ error: 'Command not permitted' }` |
| `500` | Command execution fails | `{ error: 'Failed to execute command' }` |

### Example curl

```bash
# Check system health
curl -X POST http://localhost:3000/api/openclaw/cli \
  -H "Content-Type: application/json" \
  -d '{"command": "health", "args": ["--verbose"]}'

# List active delegates
curl -X POST http://localhost:3000/api/openclaw/cli \
  -H "Content-Type: application/json" \
  -d '{"command": "delegates", "args": ["list", "--status", "active"]}'

# Reload SOUL.md
curl -X POST http://localhost:3000/api/openclaw/cli \
  -H "Content-Type: application/json" \
  -d '{"command": "soul", "args": ["reload"]}'
```

### Notes

- Only a whitelist of commands is permitted. Dangerous operations (e.g., `rm`, `drop`) are blocked.
- This endpoint is intended for administrative tooling and should be protected with authentication in production.

---

## AI SDK Usage Notes

### Multi-Provider Adapter Pattern

All AI-powered routes use the multi-provider adapter from `src/lib/ai-provider.ts`. This replaces the previous ZAI-only singleton pattern and provides automatic provider detection and failover.

#### Provider Detection Priority

```
1. ZAI         — if ZAI_BASE_URL is set OR running outside Vercel (dev)
2. OpenRouter  — if OPENROUTER_API_KEY_1 is set
3. OpenAI      — if OPENAI_API_KEY is set
4. No-op       — if no provider is configured
```

#### OpenRouter Round-Robin Load Balancing

```typescript
// Up to 4 API keys supported (OPENROUTER_API_KEY_1 through OPENROUTER_API_KEY_4)
// Requests are distributed using a rotating index:
let currentKeyIndex = 0;

function getNextKey(): string {
  const keys = [
    process.env.OPENROUTER_API_KEY_1,
    process.env.OPENROUTER_API_KEY_2,
    process.env.OPENROUTER_API_KEY_3,
    process.env.OPENROUTER_API_KEY_4,
  ].filter(Boolean);

  const key = keys[currentKeyIndex % keys.length];
  currentKeyIndex++;
  return key;
}
```

#### Completion API (Adapter)

```typescript
import { getAICompletion } from '@/lib/ai-provider';

const result = await getAICompletion({
  messages: [
    { role: 'system', content: 'System prompt here...' },
    { role: 'user', content: 'User prompt here...' },
  ],
  temperature: 0.7,
  maxTokens: 2000,
});

const response = result.content;
const provider = result.provider;  // "zai" | "openrouter" | "openai"
```

#### Capability-Specific Methods

```typescript
import { getAIVision, getAIASR, getAITTS, getAIImage, getAISearch, getAIRead } from '@/lib/ai-provider';

// Vision analysis
const vision = await getAIVision({ image: 'url_or_base64', prompt: 'Describe this' });

// Speech to text
const transcript = await getAIASR({ audio: 'base64_audio', format: 'wav' });

// Text to speech
const audio = await getAITTS({ text: 'Hello', voice: 'alloy' });

// Image generation
const images = await getAIImage({ prompt: 'A business chart', width: 1024, height: 1024 });

// Web search
const results = await getAISearch({ query: 'SME financing Malaysia', maxResults: 5 });

// Page reading
const page = await getAIRead({ url: 'https://example.com', prompt: 'Extract key points' });
```

Each method automatically selects the best available provider for the requested capability and falls back gracefully if a provider doesn't support it.

### ZAI SDK Direct Usage (Legacy)

Some routes still use the direct `z-ai-web-dev-sdk` package:

```typescript
import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

const completion = await zai.chat.completions.create({
  messages: [
    { role: 'assistant', content: 'System prompt here...' },
    { role: 'user', content: 'User prompt here...' },
  ],
  thinking: { type: 'disabled' },
});

const response = completion.choices?.[0]?.message?.content;
```

> **Note:** New routes should use the multi-provider adapter. Direct ZAI SDK usage is being deprecated.

### JSON Extraction Pattern

For routes that expect structured JSON output (`/api/idea-canvas`, `/api/plan-review`, `/api/pitch-deck`, `/api/skills/auto-learn`):

```typescript
const jsonMatch = content.match(/\{[\s\S]*\}/);    // For objects
const jsonMatch = content.match(/\[[\s\S]*\]/);    // For arrays
if (jsonMatch) {
  const parsed = JSON.parse(jsonMatch[0]);
}
```

This pattern handles cases where the AI wraps JSON in markdown code blocks or adds explanatory text.

### Fallback Responses

All structured-output routes implement fallback responses when JSON parsing fails:

| Route | Fallback Strategy |
|-------|-------------------|
| `/api/idea-canvas` | All scores = 50, generic recommendations |
| `/api/plan-review` | Moderate scores (70/65/60/65), generic discrepancy |
| `/api/pitch-deck` (slides) | 7 default slides with placeholder content |
| `/api/pitch-deck` (questions) | 3 template-type-specific questions |
| `/api/skills/auto-learn` | Empty proposals array with summary |

### SOUL.md Integration

The SOUL.md personality document is loaded from `GET /api/openclaw/soul` and injected into system prompts for AI-powered routes. This ensures consistent tone, domain expertise, and cultural context across all AI interactions.

```typescript
// SOUL.md is typically injected as the first system message
const systemPrompt = `${soulContent}\n\n${routeSpecificPrompt}`;
```

### Rate Limiting & Performance

- No rate limiting is currently implemented at the application level.
- OpenRouter's round-robin key rotation provides implicit rate limit distribution.
- AI completions typically take 3-15 seconds depending on prompt complexity and provider.
- No streaming support — all completions are awaited in full.
- The adapter instance is reused across requests (singleton pattern within each provider).

### Future Improvements

- **Streaming responses** for chat (SSE/WebSocket) — planned for v0.4.0
- **Structured output** with Zod schema validation — planned for v0.5.0
- **Caching layer** for repeated identical prompts — planned for v0.5.0
- **Token usage tracking** and cost monitoring — planned for v0.4.0
- **Provider health checks** and automatic failover — planned for v0.4.0
- **Authentication** with API key management — planned for v0.4.0

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
| `401` | Unauthorized | Authentication required (planned) |
| `403` | Forbidden | Insufficient permissions or blocked operation |
| `404` | Not Found | Resource not found (sessions, skills, channels, etc.) |
| `500` | Internal Error | AI provider failures, database errors, unexpected exceptions |
| `501` | Not Implemented | Capability not supported by current provider |

### Error Recovery

- **AI-powered routes**: If the LLM returns an empty response, a 500 error is returned. If the provider doesn't support a capability, a 501 is returned.
- **Structured-output routes**: If JSON parsing fails, a **fallback response** is returned with a 200 status (not an error) — this is by design to ensure the UI always has renderable data.
- **Database routes**: All database errors result in 500 responses with console logging.
- **Provider failover**: The multi-provider adapter automatically attempts the next available provider if the primary fails. Only if all providers fail is a 500 returned.

### Dual-Database Error Handling

When Supabase is unreachable:

1. The route catches the connection error
2. Falls back to Prisma SQLite
3. Logs a warning: `"Supabase unavailable, falling back to SQLite"`
4. Continues with local database operations

If both databases are unavailable, a 500 error is returned with a descriptive message.

---

*Last updated: 2025-03-05 | GangNiaga AI OS v0.3.0*
