# GangNiaga AI OS — Database Schema Reference

> **Version:** 0.2.0  
> **ORM:** Prisma 6.x  
> **Database:** SQLite (development) → PostgreSQL (production planned)  
> **Schema File:** `prisma/schema.prisma`  
> **Client Import:** `import { db } from '@/lib/db'`  

---

## Table of Contents

1. [Overview](#overview)
2. [ER Diagram](#er-diagram)
3. [Model Reference](#model-reference)
   - [User](#1-user)
   - [Organization](#2-organization)
   - [BusinessPlan](#3-businessplan)
   - [Forecast](#4-forecast)
   - [AgentSession](#5-agentsession)
   - [AgentTask](#6-agenttask)
   - [AgentMemory](#7-agentmemory)
   - [WorkflowRun](#8-workflowrun)
   - [KPIData](#9-kpidata)
   - [Report](#10-report)
   - [IdeaCanvas](#11-ideacanvas)
   - [PlanReview](#12-planreview)
   - [PlanActual](#13-planactual)
   - [PitchDeck](#14-pitchdeck)
   - [Citation](#15-citation)
   - [Integration](#16-integration)
4. [Schema Design Decisions](#schema-design-decisions)
5. [JSON Field Patterns](#json-field-patterns)
6. [Migration Notes](#migration-notes)
7. [Index Strategy](#index-strategy)
8. [Future Schema Changes](#future-schema-changes)

---

## Overview

The GangNiaga AI OS database consists of **16 Prisma models** organized around a central `Organization` entity. The schema follows a multi-tenant architecture where all business data is scoped to an organization. The current implementation uses SQLite for development simplicity, with a planned migration to PostgreSQL for production.

### Model Categories

| Category | Models | Purpose |
|----------|--------|---------|
| **Identity** | User, Organization | Authentication, tenancy, and profile |
| **Planning** | BusinessPlan, IdeaCanvas, PitchDeck | Business plan creation, idea validation, pitch decks |
| **Intelligence** | AgentSession, AgentTask, AgentMemory, PlanReview | AI agent orchestration, memory, and review |
| **Financial** | Forecast, KPIData, PlanActual, Integration | Financial projections, KPIs, plan-vs-actual, accounting sync |
| **Output** | Report, Citation | Report generation and source verification |
| **Automation** | WorkflowRun | Workflow orchestration and scheduling |

### Statistics

- **16 models** total
- **~85 fields** across all models
- **13 relations** (12 via Organization, 1 AgentSession → AgentTask)
- **2 unique constraints** (User.email, Organization.slug)
- **8 JSON string fields** (for flexible data storage in SQLite)

---

## ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GangNiaga AI OS — ER Diagram                        │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │    User      │
                          ├──────────────┤
                          │ id (PK)      │
                          │ email (UQ)   │
                          │ name         │
                          │ avatar       │
                          │ role         │
                          │ organizationId(FK) ──┐
                          └──────────────┘       │
                                                 │
┌───────────────────────┐                        │
│    Organization       │◄───────────────────────┘
├───────────────────────┤
│ id (PK)               │
│ name                  │
│ slug (UQ)             │
│ industry              │
│ size                  │
│ country               │
└─────────┬─────────────┘
          │
          │  1:N Relations (all via organizationId FK)
          │
    ┌─────┴──────────────────────────────────────────────────────────┐
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
    │   │ BusinessPlan │  │   Forecast   │  │  AgentSession│       │
    │   ├──────────────┤  ├──────────────┤  ├──────────────┤       │
    │   │ id (PK)      │  │ id (PK)      │  │ id (PK)      │       │
    │   │ title        │  │ name         │  │ name         │       │
    │   │ status       │  │ type         │  │ type         │       │
    │   │ execSummary  │  │ period       │  │ status       │       │
    │   │ marketAnal.  │  │ data (JSON)  │  │ tasksComplete│       │
    │   │ swotAnalysis │  └──────────────┘  │ lastActivity │       │
    │   │ competitorA. │                    │ config (JSON)│       │
    │   │ financialPlan│                    └──────┬───────┘       │
    │   │ riskAnalysis │                           │               │
    │   │ recommend.   │                    1:N    │               │
    │   └──────────────┘                    ┌──────┴───────┐       │
    │                                       │  AgentTask   │       │
    │   ┌──────────────┐                    ├──────────────┤       │
    │   │ AgentMemory  │                    │ id (PK)      │       │
    │   ├──────────────┤                    │ sessionId(FK)│       │
    │   │ id (PK)      │                    │ type         │       │
    │   │ type         │                    │ status       │       │
    │   │ category     │                    │ input        │       │
    │   │ content      │                    │ output       │       │
    │   │ embedding    │                    │ duration     │       │
    │   └──────────────┘                    └──────────────┘       │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
    │   │ WorkflowRun  │  │   KPIData    │  │   Report     │       │
    │   ├──────────────┤  ├──────────────┤  ├──────────────┤       │
    │   │ id (PK)      │  │ id (PK)      │  │ id (PK)      │       │
    │   │ name         │  │ metric       │  │ title        │       │
    │   │ type         │  │ value        │  │ type         │       │
    │   │ status       │  │ prevValue    │  │ status       │       │
    │   │ triggerType  │  │ target       │  │ content(JSON)│       │
    │   │ steps (JSON) │  │ unit         │  │ format       │       │
    │   └──────────────┘  │ period       │  └──────────────┘       │
    │                     └──────────────┘                           │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
    │   │ IdeaCanvas   │  │ PlanReview   │  │  PlanActual  │       │
    │   ├──────────────┤  ├──────────────┤  ├──────────────┤       │
    │   │ id (PK)      │  │ id (PK)      │  │ id (PK)      │       │
    │   │ title        │  │ planId       │  │ category     │       │
    │   │ status       │  │ status       │  │ period       │       │
    │   │ problem      │  │ lenderPersona│  │ plannedAmt   │       │
    │   │ solution     │  │ narrScore    │  │ actualAmt    │       │
    │   │ targetMarket │  │ finScore     │  │ variance     │       │
    │   │ revenueModel │  │ consistScore │  │ variance%    │       │
    │   │ compEdge     │  │ overallScore │  │ source       │       │
    │   │ risks (JSON) │  │ disc.(JSON)  │  └──────────────┘       │
    │   │ validScore   │  │ recom.(JSON) │                           │
    │   │ validRpt(JSON)│  │ fullRpt(JSON)│  ┌──────────────┐       │
    │   └──────────────┘  └──────────────┘  │ Integration │       │
    │                                       ├──────────────┤       │
    │   ┌──────────────┐  ┌──────────────┐  │ id (PK)      │       │
    │   │  PitchDeck   │  │  Citation    │  │ type         │       │
    │   ├──────────────┤  ├──────────────┤  │ status       │       │
    │   │ id (PK)      │  │ id (PK)      │  │ lastSync     │       │
    │   │ title        │  │ source       │  │ syncFrequency│       │
    │   │ status       │  │ url          │  │ config(JSON) │       │
    │   │ planId       │  │ type         │  └──────────────┘       │
    │   │ templateType │  │ geography    │                           │
    │   │ slides (JSON)│  │ datePublished│                           │
    │   │ slideCount   │  │ dataPoint    │                           │
    │   │ questions(J.)│  │ verified     │                           │
    │   └──────────────┘  └──────────────┘                           │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘

Legend:
  PK  = Primary Key (CUID)
  FK  = Foreign Key
  UQ  = Unique Constraint
  JSON = Stored as JSON string in SQLite
```

---

## Model Reference

### 1. User

Represents a user of the GangNiaga AI OS platform. Currently supports a single role field with plans for RBAC in v0.6.0.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier (CUID) |
| `email` | `String` | `@unique` | User email address, used for login |
| `name` | `String?` | Optional | Display name |
| `avatar` | `String?` | Optional | Avatar image URL |
| `role` | `String` | `@default("owner")` | User role within organization |
| `organizationId` | `String?` | Optional FK | Links to Organization |
| `organization` | `Organization?` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, optional)

**Usage Context:** User authentication, profile management, and organization membership. Currently minimal — will be expanded with NextAuth.js integration in v0.3.0.

---

### 2. Organization

The central multi-tenancy entity. All business data is scoped to an organization. Acts as the root aggregate for the entire domain.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | Required | Organization display name |
| `slug` | `String` | `@unique` | URL-safe identifier |
| `industry` | `String?` | Optional | Primary industry (e.g., "SaaS / Software") |
| `size` | `String?` | Optional | Organization size category |
| `country` | `String?` | Optional | Country code (e.g., "MY") |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations (13 has-many):**

| Relation | Target Model | Description |
|----------|-------------|-------------|
| `users` | `User[]` | Organization members |
| `plans` | `BusinessPlan[]` | Business plans |
| `forecasts` | `Forecast[]` | Financial forecasts |
| `agents` | `AgentSession[]` | AI agent sessions |
| `workflows` | `WorkflowRun[]` | Workflow runs |
| `reports` | `Report[]` | Generated reports |
| `kpis` | `KPIData[]` | KPI metrics |
| `memories` | `AgentMemory[]` | Agent memory entries |
| `ideaCanvases` | `IdeaCanvas[]` | Idea validation canvases |
| `planReviews` | `PlanReview[]` | Plan review results |
| `planActuals` | `PlanActual[]` | Plan vs. actual tracking |
| `pitchDecks` | `PitchDeck[]` | Pitch decks |
| `citations` | `Citation[]` | Research citations |
| `integrations` | `Integration[]` | Third-party integrations |

**Usage Context:** Multi-tenancy root. Every data query is scoped to an organization. Currently uses hardcoded `organizationId: "default"` — proper tenancy enforcement planned for v0.6.0.

---

### 3. BusinessPlan

Stores business proposals with 7 AI-generated section fields and status tracking. Supports 6 proposal types and 4 status states.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `title` | `String` | Required | Proposal title |
| `status` | `String` | `@default("draft")` | Status: `draft`, `in_progress`, `completed`, `archived` |
| `executiveSummary` | `String?` | Optional | AI-generated executive summary (Markdown) |
| `marketAnalysis` | `String?` | Optional | AI-generated market analysis |
| `swotAnalysis` | `String?` | Optional | AI-generated SWOT analysis |
| `competitorAnalysis` | `String?` | Optional | AI-generated competitor analysis |
| `financialPlan` | `String?` | Optional | AI-generated financial plan |
| `riskAnalysis` | `String?` | Optional | AI-generated risk analysis |
| `recommendations` | `String?` | Optional | AI-generated recommendations |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Design Note:** The current schema stores only 7 of the 21 possible sections as dedicated fields. The full 21-section structure is managed client-side via the `ProposalSections` TypeScript interface. A future schema change will consolidate all sections into a single `sections` JSON field for flexibility (see [Future Schema Changes](#future-schema-changes)).

**Usage Context:** Created and updated by the Business Plans module. Sections are generated one at a time via `POST /api/business-plan`. The `PlanReview` model references plans by `planId`.

---

### 4. Forecast

Stores financial forecast metadata and data. The actual forecast data points are serialized as a JSON string in the `data` field.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | Required | Forecast display name |
| `type` | `String` | `@default("revenue")` | Type: `revenue`, `expense`, `cashflow`, `profit` |
| `period` | `String` | Required | Time period (e.g., "Q1 2025", "2025") |
| `data` | `String` | Required | JSON string of `ChartDataPoint[]` |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Data Format:**

```typescript
// Stored as JSON string in the `data` field
type ForecastDataJSON = Array<{
  name: string;        // e.g., "Jan", "Q1"
  revenue?: number;
  expenses?: number;
  profit?: number;
  value?: number;
  [key: string]: string | number | undefined;
}>;
```

**Usage Context:** Created by the Financial Forecasting module. Data is sent to `POST /api/forecast` for AI analysis. The `data` field must be parsed with `JSON.parse()` before use.

---

### 5. AgentSession

Represents an AI agent instance with its configuration and activity metrics. Each agent can have multiple tasks.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | Required | Agent display name |
| `type` | `String` | `@default("general")` | Agent type: `analysis`, `financial`, `research`, `reporting`, `browser`, `crm`, `review`, `citation`, `general` |
| `status` | `String` | `@default("idle")` | Status: `idle`, `running`, `completed`, `error` |
| `tasksCompleted` | `Int` | `@default(0)` | Cumulative task completion count |
| `lastActivity` | `DateTime?` | Optional | Timestamp of last activity |
| `config` | `String?` | Optional | JSON string of agent configuration |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `tasks` | `AgentTask[]` | Relation | Has-many tasks |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)
- `tasks` → `AgentTask[]` (one-to-many)

**JSON Config Format:**

```typescript
// Stored as JSON string in the `config` field
type AgentConfig = {
  autoStart?: boolean;
  maxConcurrentTasks?: number;
  schedule?: string;         // cron expression
  model?: string;            // AI model preference
  temperature?: number;
  [key: string]: unknown;
};
```

**Usage Context:** Managed via the Agents module and `GET/POST /api/agents`. Agent sessions are created with `POST /api/agents` and listed with `GET /api/agents` (includes recent tasks).

---

### 6. AgentTask

Individual task execution records within an agent session. Tracks input, output, status, and duration.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `sessionId` | `String` | Required FK | Links to AgentSession |
| `session` | `AgentSession` | Relation | Belongs to AgentSession |
| `type` | `String` | Required | Task type (e.g., "Market Analysis", "Financial Forecast") |
| `status` | `String` | `@default("pending")` | Status: `pending`, `running`, `completed`, `failed` |
| `input` | `String?` | Optional | Task input/prompt |
| `output` | `String?` | Optional | Task output/result |
| `duration` | `Int?` | Optional | Execution time in seconds |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `session` → `AgentSession` (many-to-one, required)

**Usage Context:** Tasks are created when an agent starts work. The Agents module displays task history per agent. `GET /api/agents` includes up to 10 recent tasks per agent session.

---

### 7. AgentMemory

Persistent memory store for AI agents. Enables agents to maintain context across sessions and build institutional knowledge.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `type` | `String` | `@default("workspace")` | Memory type: `user`, `workspace`, `financial`, `workflow`, `agent` |
| `category` | `String?` | Optional | Category label (e.g., "Company Profile", "Revenue Model") |
| `content` | `String` | Required | Memory content text |
| `embedding` | `String?` | Optional | Vector embedding (reserved for pgvector) |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Design Note:** The `embedding` field is currently unused (SQLite does not support vector operations). It is reserved for the PostgreSQL + pgvector migration planned in v0.4.0, which will enable semantic search over agent memories.

**Usage Context:** The Memory module displays and manages agent memory entries. The AI Copilot can reference memory entries for context. Currently, memory is primarily seeded from Zustand store defaults.

---

### 8. WorkflowRun

Represents an automated workflow execution with step tracking. Workflows can be triggered manually, on schedule, or by events.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | Required | Workflow display name |
| `type` | `String` | `@default("scheduled")` | Workflow type: `scheduled`, `event` |
| `status` | `String` | `@default("pending")` | Status: `pending`, `running`, `completed`, `failed`, `paused` |
| `triggerType` | `String` | `@default("manual")` | Trigger: `manual`, `cron`, `daily`, `weekly`, `monthly`, `threshold` |
| `steps` | `String?` | Optional | JSON string of `WorkflowStep[]` |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Steps Format:**

```typescript
// Stored as JSON string in the `steps` field
type WorkflowStepsJSON = Array<{
  id: string;
  name: string;
  type: string;          // "data", "chart", "report", "browser", "analysis", "notification"
  status: string;        // "pending", "running", "completed", "failed"
  agent?: string;        // Agent name if applicable
  tool?: string;         // Tool name if applicable
}>;
```

**Usage Context:** The Workflows module displays and manages workflow runs. Workflows represent orchestrated sequences of agent tasks and tool invocations.

---

### 9. KPIData

Stores Key Performance Indicator data points for dashboard visualization. Each entry represents a single metric at a point in time.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `metric` | `String` | Required | KPI name (e.g., "Monthly Revenue", "DSCR", "Burn Rate") |
| `value` | `Float` | Required | Current value |
| `previousValue` | `Float?` | Optional | Previous period value (for trend calculation) |
| `target` | `Float?` | Optional | Target value |
| `unit` | `String` | `@default("currency")` | Unit: `currency`, `months`, `ratio`, `percent` |
| `period` | `String` | Required | Time period (e.g., "2025-01") |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Usage Context:** Queried by `GET /api/dashboard` for dashboard KPI cards. The Dashboard module visualizes KPIs with trend indicators (up/down/neutral) and progress toward targets.

---

### 10. Report

Stores generated business reports with their content and format metadata.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `title` | `String` | Required | Report title |
| `type` | `String` | `@default("investor")` | Type: `investor`, `board`, `financial`, `kpi`, `operational` |
| `status` | `String` | `@default("generated")` | Status: `generating`, `completed`, `failed` |
| `content` | `String?` | Optional | JSON string of report content (Markdown) |
| `format` | `String` | `@default("pdf")` | Output format: `pdf`, `docx`, `xlsx`, `csv` |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Usage Context:** Created via the Reports module and `POST /api/reports`. The `format` field is currently metadata only — actual format conversion is planned for v0.3.0.

---

### 11. IdeaCanvas

Stores business idea entries for AI-powered validation. Includes 6 core idea fields plus validation results.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `title` | `String` | Required | Idea title |
| `status` | `String` | `@default("draft")` | Status: `draft`, `validating`, `validated`, `needs_rework` |
| `problem` | `String?` | Optional | Problem statement |
| `solution` | `String?` | Optional | Proposed solution |
| `targetMarket` | `String?` | Optional | Target market description |
| `revenueModel` | `String?` | Optional | Revenue model description |
| `competitiveEdge` | `String?` | Optional | Competitive differentiation |
| `risks` | `String?` | Optional | JSON array of risk strings |
| `validationScore` | `Float?` | `@default(0)` | Overall score (0-100) |
| `validationReport` | `String?` | Optional | JSON of `ValidationReport` |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Risks Format:**

```typescript
// Stored as JSON string in the `risks` field
type RisksJSON = string[];  // e.g., ["Low adoption rate", "Regulatory risk"]
```

**JSON Validation Report Format:**

```typescript
// Stored as JSON string in the `validationReport` field
type ValidationReportJSON = {
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
  benchmarkComparison: Array<{
    metric: string;
    user: number;
    benchmark: number;
    status: 'above' | 'below' | 'at';
  }>;
};
```

**Usage Context:** Created and validated via the Idea Canvas module and `POST /api/idea-canvas`. The validation score and report are populated after AI analysis.

---

### 12. PlanReview

Stores lender-grade business plan review results. Analyzes plans from different lender perspectives and identifies discrepancies.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `planId` | `String` | Required | Referenced business plan ID (not FK) |
| `status` | `String` | `@default("pending")` | Status: `pending`, `running`, `completed` |
| `lenderPersona` | `String` | `@default("bank")` | Persona: `bank`, `investor`, `grant_officer` |
| `narrativeScore` | `Float?` | `@default(0)` | Narrative quality score (0-100) |
| `financialScore` | `Float?` | `@default(0)` | Financial rigor score (0-100) |
| `consistencyScore` | `Float?` | `@default(0)` | Narrative-financial consistency score (0-100) |
| `overallScore` | `Float?` | `@default(0)` | Weighted overall score (0-100) |
| `discrepancies` | `String?` | Optional | JSON array of `Discrepancy` objects |
| `recommendations` | `String?` | Optional | JSON array of `ReviewRecommendation` objects |
| `fullReport` | `String?` | Optional | JSON of full review report (reserved) |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Design Note:** The `planId` field is a plain string reference, not a Prisma foreign key. This is intentional — plan reviews can reference plans that may not exist in the database (e.g., plans stored client-side). A proper FK constraint will be added when the full plan persistence layer is implemented.

**JSON Discrepancies Format:**

```typescript
type DiscrepanciesJSON = Array<{
  id: string;
  severity: 'critical' | 'warning' | 'info';
  section: string;
  description: string;
  narrativeClaim: string;
  financialReality: string;
  suggestedFix: string;
}>;
```

**JSON Recommendations Format:**

```typescript
type RecommendationsJSON = Array<{
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
  impact: string;
}>;
```

**Usage Context:** Created via the Plan Review module and `POST /api/plan-review`. The review generates scores, discrepancies, and recommendations based on the selected lender persona.

---

### 13. PlanActual

Tracks plan vs. actual financial performance. Supports manual entry and automated sync from accounting integrations.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `category` | `String` | Required | Category: `revenue`, `expense`, `cashflow`, `profit` |
| `period` | `String` | Required | Time period (e.g., "2025-01") |
| `plannedAmount` | `Float` | `@default(0)` | Planned/budgeted amount |
| `actualAmount` | `Float?` | `@default(0)` | Actual amount (null if not yet reported) |
| `variance` | `Float?` | `@default(0)` | Absolute variance (actual - planned) |
| `variancePercent` | `Float?` | `@default(0)` | Percentage variance |
| `source` | `String` | `@default("manual")` | Data source: `manual`, `quickbooks`, `xero` |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Usage Context:** The Plan vs Actuals module displays variance analysis and generates alerts when variances exceed thresholds (e.g., -15% for cashflow). The `source` field tracks data provenance for audit trails.

---

### 14. PitchDeck

Stores pitch deck data with AI-generated slides and anticipated investor questions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `title` | `String` | Required | Deck title |
| `status` | `String` | `@default("draft")` | Status: `draft`, `generating`, `completed` |
| `planId` | `String?` | Optional | Linked business plan ID |
| `templateType` | `String` | `@default("investor")` | Template: `investor`, `bank`, `grant` |
| `slides` | `String?` | Optional | JSON array of `PitchSlide` objects |
| `slideCount` | `Int` | `@default(0)` | Number of slides |
| `anticipatedQuestions` | `String?` | Optional | JSON array of `AnticipatedQuestion` objects |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Slides Format:**

```typescript
type SlidesJSON = Array<{
  id: string;
  order: number;
  title: string;
  type: 'title' | 'problem' | 'solution' | 'market' | 'business_model'
      | 'financials' | 'team' | 'ask' | 'appendix';
  content: string;
  dataPoints?: Record<string, string | number>;
  linkedSection?: string;
}>;
```

**JSON Questions Format:**

```typescript
type QuestionsJSON = Array<{
  id: string;
  question: string;
  category: string;
  suggestedAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}>;
```

**Usage Context:** Created via the Pitch Deck module and `POST /api/pitch-deck`. Supports two generation modes: full slide deck and anticipated questions only.

---

### 15. Citation

Stores verifiable research citations used to back business plan claims. Supports bank-grade research requirements.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `source` | `String` | Required | Source name (e.g., "Statista", "World Bank") |
| `url` | `String?` | Optional | Source URL |
| `type` | `String` | `@default("market_data")` | Type: `market_data`, `industry_report`, `benchmark`, `government`, `financial` |
| `geography` | `String?` | Optional | Geographic scope (e.g., "MY", "SEA", "Global") |
| `datePublished` | `String?` | Optional | Publication date |
| `dataPoint` | `String?` | Optional | Specific data extracted from source |
| `verified` | `Boolean` | `@default(false)` | Whether the citation has been verified |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Design Note:** `datePublished` is stored as a `String` rather than `DateTime` because citation dates often lack day-level precision (e.g., "2024-Q3", "2024-06").

**Usage Context:** The Research module manages citations. The Citation Verifier agent marks citations as `verified: true` after source validation. Citations are referenced by business plans to support data claims.

---

### 16. Integration

Stores third-party accounting service integration configurations and sync status.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `type` | `String` | Required | Integration type: `quickbooks`, `xero`, `manual` |
| `status` | `String` | `@default("disconnected")` | Status: `connected`, `disconnected`, `error` |
| `lastSync` | `DateTime?` | Optional | Last successful sync timestamp |
| `syncFrequency` | `String` | `@default("monthly")` | Sync frequency: `daily`, `weekly`, `monthly` |
| `config` | `String?` | Optional | JSON of integration configuration (OAuth tokens, etc.) |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Config Format:**

```typescript
// Stored as JSON string in the `config` field
type IntegrationConfig = {
  accessToken?: string;       // OAuth access token (encrypted in production)
  refreshToken?: string;      // OAuth refresh token (encrypted in production)
  realmId?: string;           // QuickBooks realm ID
  tenantId?: string;          // Xero tenant ID
  scopes?: string[];          // OAuth scopes
  webhookUrl?: string;        // Webhook callback URL
  [key: string]: unknown;
};
```

**Usage Context:** The Plan vs Actuals module manages integration connections. When `status: "connected"`, the `PlanActual.source` field can be set to `"quickbooks"` or `"xero"` to indicate automated data sync. Currently, only the `manual` integration is connected.

---

## Schema Design Decisions

### 1. SQLite for Development, PostgreSQL for Production

**Decision:** Use SQLite during development for zero-config setup, with a planned migration to PostgreSQL for production.

**Rationale:**
- SQLite eliminates the need for a running database server in development
- Prisma's abstraction layer makes the migration mostly transparent
- PostgreSQL is needed for: vector search (pgvector), concurrent writes, JSONB indexing, and full-text search

**Trade-off:** SQLite lacks native JSON query support, so JSON fields are stored as plain strings and must be parsed in application code.

### 2. JSON String Fields Instead of Separate Tables

**Decision:** Complex nested data (forecast points, workflow steps, review discrepancies, etc.) is stored as JSON strings rather than normalized into separate tables.

**Rationale:**
- Reduces schema complexity and join overhead
- The data is always read/written as a complete unit (no partial updates)
- SQLite lacks JSONB support, so the performance difference is negligible
- PostgreSQL migration will enable JSONB with indexing

**Trade-off:** Cannot query into JSON fields with Prisma. If you need to query by a nested field, you must fetch all records and filter in application code.

### 3. Organization-Centric Multi-Tenancy

**Decision:** All business models have a required `organizationId` foreign key pointing to `Organization`.

**Rationale:**
- Clean tenant isolation at the data layer
- Simple query patterns: always include `where: { organizationId }` 
- Supports future multi-tenancy enforcement at the middleware level

**Trade-off:** Currently using hardcoded `organizationId: "default"` — no actual tenant isolation yet.

### 4. Soft Foreign Keys for Plan References

**Decision:** `PlanReview.planId` and `PitchDeck.planId` are plain strings, not Prisma foreign keys.

**Rationale:**
- Plans may exist only in client-side state (Zustand store) during early development
- Avoids cascade delete issues when plans are deleted
- Provides flexibility for cross-system references

**Trade-off:** No referential integrity at the database level. Orphaned reviews/decks are possible if a plan is deleted.

### 5. String-Based Enums

**Decision:** All enum-like fields (status, type, persona, etc.) use `String` instead of Prisma enums.

**Rationale:**
- SQLite doesn't support native enum types
- String fields are more flexible for adding new values without migrations
- Application-level validation via TypeScript types provides type safety

**Trade-off:** No database-level constraint on valid values. Invalid strings can be inserted if application validation fails.

### 6. No Cascade Deletes

**Decision:** No `onDelete: Cascade` on any relation.

**Rationale:**
- Prevents accidental data loss when deleting parent records
- Explicit deletion is safer for business-critical data
- Organization deletion should require explicit cleanup of all related data

**Trade-off:** Deleting an organization leaves orphaned records. This will be addressed with a cleanup service in v0.3.0.

---

## JSON Field Patterns

The following table summarizes all JSON string fields in the schema:

| Model | Field | TypeScript Type | Purpose |
|-------|-------|----------------|---------|
| `Forecast` | `data` | `ChartDataPoint[]` | Time-series data points |
| `AgentSession` | `config` | `AgentConfig` | Agent configuration |
| `WorkflowRun` | `steps` | `WorkflowStep[]` | Step execution records |
| `Report` | `content` | `string` (Markdown) | Report body content |
| `IdeaCanvas` | `risks` | `string[]` | Risk descriptions |
| `IdeaCanvas` | `validationReport` | `ValidationReport` | AI validation results |
| `PlanReview` | `discrepancies` | `Discrepancy[]` | Flagged inconsistencies |
| `PlanReview` | `recommendations` | `ReviewRecommendation[]` | Improvement suggestions |
| `PlanReview` | `fullReport` | `object` | Full review details |
| `PitchDeck` | `slides` | `PitchSlide[]` | Slide content |
| `PitchDeck` | `anticipatedQuestions` | `AnticipatedQuestion[]` | Predicted Q&A |
| `Integration` | `config` | `IntegrationConfig` | OAuth & settings |

**Parsing Pattern:**

```typescript
// Standard JSON parse with type assertion
const parsed = JSON.parse(record.jsonField) as ExpectedType;

// Safe parse with fallback
const parsed = (() => {
  try { return JSON.parse(record.jsonField); }
  catch { return defaultValue; }
})();
```

---

## Migration Notes

### Current State (v0.2.0)

- Using `prisma db push` for schema synchronization (no migration files)
- SQLite database at `db/custom.db`
- No seed scripts — data is populated from Zustand store defaults
- No migration history or versioning

### Planned: SQLite → PostgreSQL Migration (v0.3.0)

```bash
# 1. Update schema.prisma datasource
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Create initial migration
bun run db:migrate -- --name init_postgres

# 3. Update JSON fields to use JSONB
# All `String` fields storing JSON → `Json` type (Prisma native)

# 4. Add missing indexes
# See Index Strategy section below

# 5. Add pgvector extension for AgentMemory.embedding
# CREATE EXTENSION IF NOT EXISTS vector;
```

### Breaking Changes in PostgreSQL Migration

| Change | Impact | Mitigation |
|--------|--------|------------|
| `String` → `Json` for JSON fields | Client code can use parsed objects directly | Update all `JSON.parse()` calls |
| `Float` → `Decimal` for monetary values | Prevents floating-point errors in financial calculations | Update TypeScript types |
| Add `@default(autoincrement())` options | CUID remains default, but autoincrement available | No change needed |
| pgvector for `AgentMemory.embedding` | Enables semantic search | New query patterns needed |

---

## Index Strategy

### Current Indexes (Auto-generated by Prisma)

| Model | Field | Type | Auto |
|-------|------|------|------|
| `User` | `id` | Primary | Yes |
| `User` | `email` | Unique | Yes |
| `Organization` | `id` | Primary | Yes |
| `Organization` | `slug` | Unique | Yes |
| All others | `id` | Primary | Yes |

### Planned Indexes (v0.3.0 — PostgreSQL)

```prisma
model AgentSession {
  @@index([organizationId, status])
  @@index([organizationId, type])
  @@index([updatedAt])
}

model AgentTask {
  @@index([sessionId, status])
  @@index([sessionId, createdAt])
}

model KPIData {
  @@index([organizationId, metric])
  @@index([organizationId, period])
}

model PlanActual {
  @@index([organizationId, category, period])
  @@index([organizationId, source])
}

model BusinessPlan {
  @@index([organizationId, status])
}

model AgentMemory {
  @@index([organizationId, type])
  @@index([organizationId, category])
}

model Citation {
  @@index([organizationId, type])
  @@index([organizationId, verified])
}
```

**Rationale:** Composite indexes on `(organizationId, ...)` support the multi-tenant query pattern where all queries are scoped to an organization first. Single-column indexes on frequently filtered fields (status, type, period) improve dashboard and list queries.

---

## Future Schema Changes

### v0.3.0 — Production Readiness

| Change | Description |
|--------|-------------|
| Add `AuditLog` model | Track all data changes for compliance |
| Add `Session` model | NextAuth.js session management |
| Add `Account` model | NextAuth.js OAuth provider accounts |
| Add `VerificationToken` model | Email verification and password reset |
| Convert JSON `String` → `Json` | Native PostgreSQL JSONB support |
| Convert `Float` → `Decimal` | Accurate monetary calculations |
| Add composite indexes | Multi-tenant query optimization |

### v0.4.0 — Intelligence

| Change | Description |
|--------|-------------|
| Add `@db.Vector(1536)` to `AgentMemory.embedding` | pgvector for semantic search |
| Add `AgentConversation` model | Multi-turn agent conversation history |
| Add `ModelConfig` model | LLM model configuration per organization |
| Add `PromptTemplate` model | Customizable prompt templates |

### v0.5.0 — Integration

| Change | Description |
|--------|-------------|
| Add `SyncLog` model | Track integration sync history |
| Add `WebhookEvent` model | Store incoming webhook payloads |
| Add `BankConnection` model | Dedicated bank integration model |
| Add FK constraint to `PlanReview.planId` | Enforce referential integrity |

### v0.6.0 — Scale

| Change | Description |
|--------|-------------|
| Add `Team` model | Sub-organization team grouping |
| Add `TeamMember` model | Team membership with roles |
| Add `Permission` model | Fine-grained RBAC |
| Add `ApiKey` model | API access tokens |
| Add `OrganizationInvitation` model | Team member invitations |
| Add `Notification` model | In-app notification system |

---

*Last updated: 2025-01-15 | GangNiaga AI OS v0.2.0*
