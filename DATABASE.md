# GangNiaga AI OS — Database Schema Reference

> **Version:** 0.3.0  
> **ORM:** Prisma 6.x (local) + Supabase JS Client (production)  
> **Database:** Dual — Supabase PostgreSQL (production) + SQLite (local fallback)  
> **Schema File:** `prisma/schema.prisma`  
> **Prisma Client Import:** `import { db } from '@/lib/db'`  
> **Supabase Import:** `import { getSupabaseServer, isSupabaseAvailable } from '@/lib/supabase'`  

---

## Table of Contents

1. [Overview](#overview)
2. [Dual-Database Architecture](#dual-database-architecture)
3. [ER Diagram](#er-diagram)
4. [Model Reference](#model-reference)
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
   - [OpenClawChannel](#17-openclawchannel)
   - [OpenClawGateway](#18-openclawgateway)
   - [OpenClawPlugin](#19-openclawplugin)
   - [OpenClawDelegate](#20-openclawdelegate)
   - [OpenClawWebhook](#21-openclawwebhook)
   - [OpenClawScheduledTask](#22-openclawscheduledtask)
   - [OpenClawSoulConfig](#23-openclawsoulconfig)
   - [GatewayConversation](#24-gatewayconversation)
   - [Skill](#25-skill)
   - [AgentMemoryV2](#26-agentmemoryv2)
   - [ChatSession](#27-chatsession)
5. [Schema Design Decisions](#schema-design-decisions)
6. [JSON Field Patterns](#json-field-patterns)
7. [Supabase Integration](#supabase-integration)
8. [Migration Notes](#migration-notes)
9. [Index Strategy](#index-strategy)
10. [Future Schema Changes](#future-schema-changes)

---

## Overview

The GangNiaga AI OS database consists of **27 Prisma models** organized around a central `Organization` entity. The schema follows a multi-tenant architecture where all business data is scoped to an organization. The system uses a dual-database architecture: **Supabase PostgreSQL** (primary, production) and **Prisma ORM with SQLite** (local development fallback).

### Model Categories

| Category | Models | Purpose |
|----------|--------|---------|
| **Identity** | User, Organization | Authentication, tenancy, and profile |
| **Planning** | BusinessPlan, IdeaCanvas, PitchDeck | Business plan creation, idea validation, pitch decks |
| **Intelligence** | AgentSession, AgentTask, AgentMemory, AgentMemoryV2, PlanReview | AI agent orchestration, memory, and review |
| **Financial** | Forecast, KPIData, PlanActual, Integration | Financial projections, KPIs, plan-vs-actual, accounting sync |
| **Output** | Report, Citation | Report generation and source verification |
| **Automation** | WorkflowRun | Workflow orchestration and scheduling |
| **OpenClaw** | OpenClawChannel, OpenClawGateway, OpenClawPlugin, OpenClawDelegate, OpenClawWebhook, OpenClawScheduledTask, OpenClawSoulConfig | Multi-channel messaging, AI delegates, plugins, webhooks, automation, and personality config |
| **Gateway** | GatewayConversation | Conversation persistence for messaging platforms |
| **Skills** | Skill | Hermes-inspired skill registry and configuration |
| **Chat** | ChatSession | Persistent chat sessions with memory snapshots |

### Statistics

- **27 models** total (up from 16 in v0.2.0)
- **~150 fields** across all models (approximate scalar fields)
- **24 relations** (23 via Organization, 1 AgentSession → AgentTask)
- **4 unique constraints** (User.email, Organization.slug, Skill.name, Skill.slug)
- **27 JSON string fields** (for flexible data storage in SQLite)

---

## Dual-Database Architecture

GangNiaga AI OS uses a **dual-database pattern** to support both local development and production deployment:

### Primary: Supabase PostgreSQL (Production)

- **Used in:** Production (Vercel deployments)
- **Connection:** REST API via `@supabase/supabase-js`
- **Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
  - `SUPABASE_SERVICE_ROLE_KEY` — Server-side key (bypasses RLS)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Client-side key (respects RLS)
- **Schema:** 27 tables matching Prisma models, seeded with initial data
- **Features:** JSONB columns, full-text search, Row Level Security (RLS), real-time subscriptions

### Fallback: Prisma ORM with SQLite (Local Development)

- **Used in:** Local development, offline mode
- **Connection:** `DATABASE_URL="file:./db/custom.db"`
- **Client:** `import { db } from '@/lib/db'`
- **Schema:** Same 27 models in `prisma/schema.prisma`
- **Sync:** `bun run db:push` to push schema changes

### API Route Pattern

All API routes follow a consistent **try-Supabase-first → fallback-to-Prisma** pattern:

```typescript
import { isSupabaseAvailable, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

export async function GET() {
  // Try Supabase first (production)
  if (isSupabaseAvailable()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .eq('organizationId', orgId);
      if (!error && data) return Response.json(data);
    } catch (e) {
      console.warn('Supabase query failed, falling back to Prisma:', e);
    }
  }

  // Fallback to Prisma (local development)
  const records = await db.modelName.findMany({
    where: { organizationId: orgId },
  });
  return Response.json(records);
}
```

### Key Differences Between Databases

| Aspect | Supabase PostgreSQL | Prisma SQLite |
|--------|--------------------|--------------| 
| JSON fields | Native JSONB with indexing | JSON strings (require `JSON.parse()`) |
| Vector search | pgvector support | Not supported |
| Concurrent writes | Full ACID compliance | Single-writer lock |
| RLS | Row Level Security policies | No row-level security |
| Real-time | Built-in subscriptions | Not supported |
| Migrations | Managed via Supabase dashboard | `prisma db push` |
| Connection | REST API (HTTP) | Direct file access |

---

## ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GangNiaga AI OS — ER Diagram (v0.3.0)                    │
│                           27 Models • 4 Unique Keys                         │
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
    │  ── IDENTITY & PLANNING ──                                     │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
    │   │ BusinessPlan │  │   Forecast   │  │  IdeaCanvas  │       │
    │   ├──────────────┤  ├──────────────┤  ├──────────────┤       │
    │   │ id (PK)      │  │ id (PK)      │  │ id (PK)      │       │
    │   │ title        │  │ name         │  │ title        │       │
    │   │ status       │  │ type         │  │ status       │       │
    │   │ execSummary  │  │ period       │  │ problem      │       │
    │   │ marketAnal.  │  │ data (JSON)  │  │ solution     │       │
    │   │ swotAnalysis │  └──────────────┘  │ risks (JSON) │       │
    │   │ competitorA. │                    │ validScore   │       │
    │   │ financialPlan│                    │ validRpt(J.) │       │
    │   │ riskAnalysis │                    └──────────────┘       │
    │   │ recommend.   │                                           │
    │   └──────────────┘                    ┌──────────────┐       │
    │                                       │  PitchDeck   │       │
    │   ── INTELLIGENCE ──                  ├──────────────┤       │
    │                                       │ id (PK)      │       │
    │   ┌──────────────┐  ┌──────────────┐  │ title        │       │
    │   │ AgentSession │  │  AgentTask   │  │ status       │       │
    │   ├──────────────┤  ├──────────────┤  │ slides (JSON)│       │
    │   │ id (PK)      │  │ id (PK)      │  │ questions(J.)│       │
    │   │ name         │  │ sessionId(FK)│  └──────────────┘       │
    │   │ type         │  │ type         │                           │
    │   │ status       │  │ status       │  ── FINANCIAL ──         │
    │   │ config (JSON)│  │ input/output │                           │
    │   └──────┬───────┘  └──────────────┘  ┌──────────────┐       │
    │          │ 1:N                         │   KPIData    │       │
    │          └─────────────────────         ├──────────────┤       │
    │                                │       │ id (PK)      │       │
    │   ┌──────────────┐  ┌──────────────┐  │ metric       │       │
    │   │ AgentMemory  │  │AgentMemoryV2 │  │ value/target │       │
    │   ├──────────────┤  ├──────────────┤  │ period       │       │
    │   │ id (PK)      │  │ id (PK)      │  └──────────────┘       │
    │   │ type         │  │ type         │                           │
    │   │ category     │  │ key          │  ┌──────────────┐       │
    │   │ content      │  │ content      │  │  PlanActual  │       │
    │   │ embedding    │  │ importance   │  ├──────────────┤       │
    │   └──────────────┘  │ charLimit    │  │ id (PK)      │       │
    │                     └──────────────┘  │ category     │       │
    │   ┌──────────────┐                    │ plannedAmt   │       │
    │   │ PlanReview   │                    │ actualAmt    │       │
    │   ├──────────────┤                    │ variance     │       │
    │   │ id (PK)      │                    └──────────────┘       │
    │   │ planId       │                                           │
    │   │ lenderPersona│  ── OUTPUT & AUTOMATION ──                │
    │   │ narrScore    │                                           │
    │   │ finScore     │  ┌──────────────┐  ┌──────────────┐       │
    │   │ consistScore │  │   Report     │  │  Citation    │       │
    │   │ overallScore │  ├──────────────┤  ├──────────────┤       │
    │   │ disc.(JSON)  │  │ id (PK)      │  │ id (PK)      │       │
    │   │ recom.(JSON) │  │ title        │  │ source       │       │
    │   │ fullRpt(JSON)│  │ type         │  │ type         │       │
    │   └──────────────┘  │ content(JSON)│  │ geography    │       │
    │                     │ format       │  │ verified     │       │
    │                     └──────────────┘  └──────────────┘       │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐                          │
    │   │ WorkflowRun  │  │ Integration  │                          │
    │   ├──────────────┤  ├──────────────┤                          │
    │   │ id (PK)      │  │ id (PK)      │                          │
    │   │ name         │  │ type         │                          │
    │   │ status       │  │ status       │                          │
    │   │ triggerType  │  │ lastSync     │                          │
    │   │ steps (JSON) │  │ config(JSON) │                          │
    │   └──────────────┘  └──────────────┘                          │
    │                                                                │
    │  ── OPENCLAW ──                                                 │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
    │   │OCChannel     │  │ OCGateway    │  │ OCPlugin     │       │
    │   ├──────────────┤  ├──────────────┤  ├──────────────┤       │
    │   │ id (PK)      │  │ id (PK)      │  │ id (PK)      │       │
    │   │ type         │  │ status       │  │ name         │       │
    │   │ name         │  │ bindHost     │  │ version      │       │
    │   │ status       │  │ bindPort     │  │ status       │       │
    │   │ config (JSON)│  │ config (JSON)│  │ capabilities │       │
    │   │ messageCount │  │ uptime       │  │ config (JSON)│       │
    │   └──────────────┘  └──────────────┘  └──────────────┘       │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
    │   │ OCDelegate   │  │ OCWebhook    │  │OCScheduled   │       │
    │   ├──────────────┤  ├──────────────┤  ├──────────────┤       │
    │   │ id (PK)      │  │ id (PK)      │  │ id (PK)      │       │
    │   │ name         │  │ name         │  │ name         │       │
    │   │ email        │  │ url          │  │ cronExpress. │       │
    │   │ tier         │  │ events(JSON) │  │ status       │       │
    │   │ channels(J.) │  │ secret       │  │ lastRun      │       │
    │   │ standingOrd. │  │ headers(J.)  │  │ runCount     │       │
    │   └──────────────┘  └──────────────┘  └──────────────┘       │
    │                                                                │
    │   ┌──────────────┐                                             │
    │   │OCSoulConfig  │                                             │
    │   ├──────────────┤                                             │
    │   │ id (PK)      │                                             │
    │   │ personality   │                                             │
    │   │ tone          │                                             │
    │   │ language      │                                             │
    │   │ specialty     │                                             │
    │   │ greeting      │                                             │
    │   │ rules (JSON)  │                                             │
    │   └──────────────┘                                             │
    │                                                                │
    │  ── GATEWAY, SKILLS & CHAT ──                                  │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
    │   │ Gateway      │  │    Skill     │  │ ChatSession  │       │
    │   │ Conversation │  │              │  │              │       │
    │   ├──────────────┤  ├──────────────┤  ├──────────────┤       │
    │   │ id (PK)      │  │ id (PK)      │  │ id (PK)      │       │
    │   │ platform     │  │ name (UQ)    │  │ title        │       │
    │   │ platformUser │  │ slug (UQ)    │  │ platform     │       │
    │   │ direction    │  │ category     │  │ messages(J.) │       │
    │   │ content      │  │ content      │  │ memorySnap.  │       │
    │   │ metadata(J.) │  │ tags (JSON)  │  │ soulSnapshot │       │
    │   └──────────────┘  │ status       │  │ skillsUsed   │       │
    │                     │ autoLearn    │  │ status       │       │
    │                     └──────────────┘  └──────────────┘       │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘

Legend:
  PK  = Primary Key (CUID)
  FK  = Foreign Key
  UQ  = Unique Constraint
  JSON = Stored as JSON string in SQLite / JSONB in Supabase
  OC  = OpenClaw prefix
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

**Usage Context:** User authentication, profile management, and organization membership. Currently minimal — will be expanded with NextAuth.js integration.

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

**Relations (24 has-many):**

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
| `openclawChannels` | `OpenClawChannel[]` | OpenClaw messaging channels |
| `openclawGateways` | `OpenClawGateway[]` | OpenClaw gateway instances |
| `openclawPlugins` | `OpenClawPlugin[]` | OpenClaw plugins |
| `openclawDelegates` | `OpenClawDelegate[]` | OpenClaw AI delegates |
| `openclawWebhooks` | `OpenClawWebhook[]` | OpenClaw webhook registrations |
| `openclawScheduledTasks` | `OpenClawScheduledTask[]` | OpenClaw scheduled tasks |
| `openclawSoulConfigs` | `OpenClawSoulConfig[]` | OpenClaw SOUL personality configs |
| `gatewayConversations` | `GatewayConversation[]` | Gateway messaging conversations |
| `skills` | `Skill[]` | Skill registry |
| `memoriesV2` | `AgentMemoryV2[]` | Enhanced agent memories |
| `chatSessions` | `ChatSession[]` | Chat sessions |

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

**Design Note:** The `embedding` field is currently unused (SQLite does not support vector operations). It is reserved for the PostgreSQL + pgvector migration, which will enable semantic search over agent memories.

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

**Usage Context:** Created via the Reports module and `POST /api/reports`. The `format` field is currently metadata only — actual format conversion is planned for a future release.

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

### 17. OpenClawChannel

Multi-channel messaging configuration for the OpenClaw integration layer. Tracks individual channel connections across platforms like WhatsApp, Telegram, Discord, Slack, and more.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `type` | `String` | Required | Channel type: `whatsapp`, `telegram`, `discord`, `slack`, `webchat`, `signal` |
| `name` | `String` | Required | Display name for the channel |
| `status` | `String` | `@default("disconnected")` | Status: `connected`, `disconnected`, `connecting`, `error`, `pending_approval` |
| `lastMessage` | `String?` | Optional | Preview of last received/sent message |
| `lastMessageAt` | `DateTime?` | Optional | Timestamp of last message activity |
| `messageCount` | `Int` | `@default(0)` | Total message count for this channel |
| `config` | `String?` | Optional | JSON object of channel-specific configuration |
| `pairedAt` | `DateTime?` | Optional | When the channel was successfully paired |
| `avatarUrl` | `String?` | Optional | Channel avatar or bot profile image URL |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Config Format:**

```typescript
type OpenClawChannelConfig = {
  apiKey?: string;
  webhookUrl?: string;
  botToken?: string;
  phoneNumber?: string;
  chatId?: string;
  autoReply?: boolean;
  [key: string]: unknown;
};
```

**Usage Context:** Managed via the OpenClaw module and `/api/openclaw/channels`. Each channel represents a distinct messaging platform connection. Channel status reflects real-time connectivity.

---

### 18. OpenClawGateway

Gateway instance configuration for the OpenClaw multi-channel messaging server. Tracks the gateway process status, network configuration, and health metrics.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `status` | `String` | `@default("unconfigured")` | Status: `running`, `stopped`, `starting`, `error`, `unconfigured` |
| `bindHost` | `String` | `@default("127.0.0.1")` | Gateway bind address |
| `bindPort` | `Int` | `@default(18789)` | Gateway bind port |
| `uptime` | `Int` | `@default(0)` | Uptime in seconds |
| `connectedClients` | `Int` | `@default(0)` | Number of connected channel clients |
| `activeChannels` | `Int` | `@default(0)` | Number of active messaging channels |
| `totalMessages` | `Int` | `@default(0)` | Total messages processed |
| `lastHealthCheck` | `DateTime?` | Optional | Timestamp of last health check |
| `version` | `String?` | Optional | Gateway software version |
| `config` | `String?` | Optional | JSON object with authMode, logLevel, etc. |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Config Format:**

```typescript
type OpenClawGatewayConfig = {
  authMode?: string;          // e.g., "token", "oauth"
  logLevel?: string;          // e.g., "info", "debug"
  maxConnections?: number;
  heartbeatInterval?: number; // seconds
  channels?: string[];        // enabled channel types
  plugins?: string[];         // enabled plugin IDs
  [key: string]: unknown;
};
```

**Usage Context:** Managed via the OpenClaw module and `/api/openclaw/gateway`. Typically one gateway instance per organization. Health checks update `lastHealthCheck`, `uptime`, and `connectedClients`.

---

### 19. OpenClawPlugin

Plugin registry for the OpenClaw messaging system. Tracks installed, available, and custom plugins that extend gateway functionality.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | Required | Plugin display name |
| `version` | `String` | `@default("1.0.0")` | Semantic version |
| `description` | `String?` | Optional | Plugin description |
| `author` | `String?` | Optional | Plugin author |
| `capabilities` | `String?` | Optional | JSON array of capability strings |
| `status` | `String` | `@default("available")` | Status: `installed`, `enabled`, `disabled`, `error`, `available` |
| `source` | `String` | `@default("clawhub")` | Source: `bundled`, `clawhub`, `local` |
| `installedAt` | `DateTime?` | Optional | When the plugin was installed |
| `lastUpdated` | `DateTime?` | Optional | When the plugin was last updated |
| `config` | `String?` | Optional | JSON object of plugin-specific configuration |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Capabilities Format:**

```typescript
type PluginCapabilities = string[];
// e.g., ["message_filter", "auto_reply", "sentiment_analysis", "translation"]
```

**Usage Context:** Managed via the OpenClaw module and `/api/openclaw/plugins`. Plugins can be installed from ClawdHub, bundled with the system, or created locally. The `source` field tracks where the plugin originated.

---

### 20. OpenClawDelegate

AI delegate/agent configuration for the OpenClaw system. Defines AI-powered delegates that can read, respond, or proactively act on behalf of users across messaging channels.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | Required | Delegate display name |
| `email` | `String` | Required | Delegate email address |
| `displayName` | `String` | Required | Human-friendly display name |
| `tier` | `String` | `@default("tier1_readonly")` | Permission tier: `tier1_readonly`, `tier2_send_behalf`, `tier3_proactive` |
| `status` | `String` | `@default("setup")` | Status: `active`, `inactive`, `suspended`, `setup` |
| `channels` | `String?` | Optional | JSON array of channel types this delegate operates on |
| `principalName` | `String?` | Optional | Name of the human this delegate acts for |
| `principalEmail` | `String?` | Optional | Email of the human this delegate acts for |
| `standingOrders` | `String?` | Optional | JSON array of standing order rules |
| `tasksCompleted` | `Int` | `@default(0)` | Number of tasks completed by this delegate |
| `lastActivity` | `DateTime?` | Optional | Timestamp of last delegate activity |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Channels Format:**

```typescript
type DelegateChannels = string[];
// e.g., ["whatsapp", "telegram", "email"]
```

**JSON Standing Orders Format:**

```typescript
type StandingOrders = Array<{
  id: string;
  condition: string;      // e.g., "new_message_received"
  action: string;         // e.g., "auto_reply_with_template"
  template?: string;
  enabled: boolean;
}>;
```

**Design Note:** The three-tier permission model (`tier1_readonly`, `tier2_send_behalf`, `tier3_proactive`) controls how autonomously a delegate can act. Tier 1 delegates can only read messages, Tier 2 can send on behalf of the principal, and Tier 3 can proactively initiate conversations.

**Usage Context:** Managed via the OpenClaw module and `/api/openclaw/delegates`. Delegates are the AI agents that handle messaging interactions across channels.

---

### 21. OpenClawWebhook

Webhook registrations for the OpenClaw system. Defines HTTP endpoints that receive event notifications when messaging events occur.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | Required | Webhook display name |
| `url` | `String` | Required | Target URL for webhook delivery |
| `method` | `String` | `@default("POST")` | HTTP method: `POST`, `PUT`, `PATCH` |
| `events` | `String?` | Optional | JSON array of event types to subscribe to |
| `status` | `String` | `@default("active")` | Status: `active`, `inactive`, `error` |
| `lastTriggered` | `DateTime?` | Optional | When the webhook was last fired |
| `triggerCount` | `Int` | `@default(0)` | Total number of times triggered |
| `secret` | `String?` | Optional | HMAC secret for payload verification |
| `headers` | `String?` | Optional | JSON object of custom HTTP headers |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Events Format:**

```typescript
type WebhookEvents = string[];
// e.g., ["message.received", "message.sent", "channel.connected", "delegate.action"]
```

**JSON Headers Format:**

```typescript
type WebhookHeaders = Record<string, string>;
// e.g., { "Authorization": "Bearer token123", "X-Custom-Header": "value" }
```

**Usage Context:** Managed via the OpenClaw module and `/api/openclaw/webhooks`. The `secret` field is used for HMAC-SHA256 signature verification of webhook payloads.

---

### 22. OpenClawScheduledTask

Scheduled automation tasks for the OpenClaw system. Supports cron-based scheduling of AI agent actions and messaging automations.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | Required | Task display name |
| `cronExpression` | `String` | Required | Cron schedule expression (e.g., "0 9 * * 1-5") |
| `status` | `String` | `@default("active")` | Status: `active`, `paused`, `error`, `completed` |
| `agentId` | `String?` | Optional | Associated agent/delegate ID |
| `prompt` | `String?` | Optional | AI prompt to execute when triggered |
| `channel` | `String?` | Optional | Target channel type for the task |
| `lastRun` | `DateTime?` | Optional | When the task was last executed |
| `nextRun` | `DateTime?` | Optional | When the task will next execute |
| `runCount` | `Int` | `@default(0)` | Total number of executions |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Design Note:** The `agentId` field is a soft reference (not a Prisma FK), allowing tasks to reference delegates or agent sessions that may not yet be persisted.

**Usage Context:** Managed via the OpenClaw module and `/api/openclaw/automation`. Tasks can be paused/resumed and track execution history via `lastRun`, `nextRun`, and `runCount`.

---

### 23. OpenClawSoulConfig

SOUL.md personality configuration for the OpenClaw AI system. Defines the personality, tone, language, and behavioral rules that shape how the AI assistant communicates.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `personality` | `String` | `@default("Professional, knowledgeable, and supportive ASEAN SME business assistant")` | Core personality description |
| `tone` | `String` | `@default("Professional yet approachable; uses Malaysian business English")` | Communication tone |
| `language` | `String` | `@default("English (with Bahasa Melayu and Mandarin loan words where appropriate)")` | Language and dialect preferences |
| `specialty` | `String` | `@default("ASEAN SME business planning, financial modeling, and market analysis")` | Domain specialty |
| `greeting` | `String` | `@default("Hello! I'm your AI business assistant for GangNiaga. How can I help you grow your business today?")` | Default greeting message |
| `rules` | `String` | `@default("[]")` | JSON array of behavioral rule strings |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Rules Format:**

```typescript
type SoulRules = string[];
// e.g., [
//   "Always confirm before making financial commitments",
//   "Never share sensitive data outside the organization",
//   "Use formal language for board-level communications"
// ]
```

**Usage Context:** Managed via the OpenClaw module and `/api/openclaw/soul`. The SOUL config is frozen into `ChatSession.soulSnapshot` at the start of each chat session, ensuring consistent personality throughout the conversation even if the config is changed mid-session.

---

### 24. GatewayConversation

Conversation persistence for messaging platforms. Stores individual messages from external channels (Telegram, WhatsApp, Discord, etc.) with platform-specific metadata.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `platform` | `String` | Required | Platform: `telegram`, `whatsapp`, `discord`, `slack`, etc. |
| `platformUserId` | `String` | Required | Unique user ID on the platform (e.g., Telegram chat ID, WhatsApp phone number) |
| `userName` | `String?` | Optional | Display name from the platform |
| `direction` | `String` | Required | Message direction: `inbound`, `outbound` |
| `messageType` | `String` | `@default("text")` | Type: `text`, `voice`, `image`, `system` |
| `content` | `String` | Required | Message content |
| `metadata` | `String?` | Optional | JSON: platform-specific data (message_id, raw payload, etc.) |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Metadata Format:**

```typescript
type GatewayMetadata = {
  messageId?: string;          // Platform-specific message ID
  replyToId?: string;         // ID of message being replied to
  rawPayload?: unknown;       // Original platform payload
  attachments?: Array<{       // File attachments
    type: string;
    url: string;
    name?: string;
  }>;
  [key: string]: unknown;
};
```

**Design Note:** This model stores individual messages rather than full conversations. The `platformUserId` + `platform` combination serves as a logical conversation thread identifier. Unlike `ChatSession`, which stores the full message array as JSON, this model uses one row per message for easier querying and pagination.

**Usage Context:** Used by the OpenClaw Gateway module and `/api/gateway/status`. Messages are persisted as they flow through the gateway, enabling conversation history retrieval and audit trails.

---

### 25. Skill

Hermes-inspired skill registry and configuration. Skills are reusable AI capabilities (instructions/knowledge) that can be triggered by slash commands or automatically activated during conversations.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `name` | `String` | `@unique` | Skill name (unique across organization) |
| `slug` | `String` | `@unique` | URL-safe slug (unique across organization) |
| `description` | `String` | Required | Skill description |
| `version` | `String` | `@default("1.0.0")` | Semantic version |
| `category` | `String` | `@default("general")` | Category: `general`, `business`, `financial`, `marketing`, `research`, `automation` |
| `content` | `String` | Required | Skill instructions/knowledge (Markdown) |
| `triggerPhrase` | `String?` | Optional | Slash command trigger (e.g., "/market-analysis") |
| `tags` | `String?` | Optional | JSON array of tag strings |
| `usageCount` | `Int` | `@default(0)` | Number of times this skill has been used |
| `lastUsedAt` | `DateTime?` | Optional | When this skill was last used |
| `source` | `String` | `@default("user_created")` | Source: `user_created`, `ai_generated`, `bundled`, `hub` |
| `status` | `String` | `@default("active")` | Status: `active`, `deprecated`, `draft` |
| `autoLearn` | `Boolean` | `@default(false)` | Whether this skill can auto-improve from conversations |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Unique Constraints:**
- `name` — Ensures skill names are unique per organization
- `slug` — Ensures URL-safe identifiers are unique per organization

**JSON Tags Format:**

```typescript
type SkillTags = string[];
// e.g., ["financial", "forecast", "ai-powered", "banking"]
```

**Usage Context:** Managed via the Skills module and `/api/skills`. Skills can be executed via `/api/skills/execute`, and the `autoLearn` feature enables skills to improve based on conversation feedback via `/api/skills/auto-learn`. Usage metrics are tracked via `usageCount` and `lastUsedAt`.

---

### 26. AgentMemoryV2

Hermes-inspired enhanced memory with importance scoring and character limits. Provides a more structured memory system than the original `AgentMemory` model, supporting prioritized recall and memory management.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `type` | `String` | `@default("memory")` | Type: `memory`, `user_profile` |
| `key` | `String` | Required | Short label for this memory entry (e.g., "Company Name", "Revenue Target") |
| `content` | `String` | Required | The actual memory content |
| `importance` | `Int` | `@default(5)` | Importance score (1-10, higher = more important) |
| `charLimit` | `Int` | `@default(500)` | Maximum characters for this entry |
| `sessionId` | `String?` | Optional | Which session created this memory |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**Design Note:** The `importance` field (1-10) allows the AI to prioritize which memories to include in context windows. The `charLimit` field enforces memory brevity, preventing individual memories from consuming too much of the context window. The `key` field provides a human-readable label for memory entries, making them easier to browse and manage.

**Usage Context:** Managed via the Memory module and `/api/memory`. The V2 memory system is used by the Chat module to build context for conversations. Memories with higher `importance` scores are prioritized when constructing prompts.

---

### 27. ChatSession

Persistent chat sessions with memory and SOUL snapshots. Stores complete conversation history with frozen snapshots of memory and personality configuration at session start.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `String` | `@id @default(cuid())` | Unique identifier |
| `title` | `String?` | Optional | Chat session title |
| `platform` | `String` | `@default("web")` | Platform: `web`, `telegram`, `whatsapp`, `discord`, `slack` |
| `platformSessionId` | `String?` | Optional | External platform session ID |
| `messages` | `String` | `@default("[]")` | JSON array of chat messages |
| `memorySnapshot` | `String?` | Optional | Frozen memory at session start (JSON) |
| `soulSnapshot` | `String?` | Optional | Frozen SOUL.md at session start (JSON) |
| `skillsUsed` | `String?` | Optional | JSON array of skill IDs used in this session |
| `status` | `String` | `@default("active")` | Status: `active`, `ended`, `archived` |
| `organizationId` | `String` | Required FK | Links to Organization |
| `organization` | `Organization` | Relation | Belongs to Organization |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last update timestamp |

**Relations:**
- `organization` → `Organization` (many-to-one, required)

**JSON Messages Format:**

```typescript
type ChatMessages = Array<{
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;           // ISO 8601
  skillUsed?: string;          // Skill ID if a skill was triggered
  metadata?: Record<string, unknown>;
}>;
```

**JSON Memory Snapshot Format:**

```typescript
type MemorySnapshot = Array<{
  key: string;
  content: string;
  importance: number;
}>;
```

**JSON Soul Snapshot Format:**

```typescript
type SoulSnapshot = {
  personality: string;
  tone: string;
  language: string;
  specialty: string;
  greeting: string;
  rules: string[];
};
```

**Design Note:** The snapshot pattern (`memorySnapshot`, `soulSnapshot`) ensures conversation consistency. Even if the organization's memory or SOUL config changes during a session, the conversation continues with the original context. This is critical for audit trails and reproducible AI behavior.

**Usage Context:** Managed via the Chat module and `/api/chat` and `/api/sessions`. Chat sessions are created when a user starts a conversation on any platform. The `platformSessionId` links web chats to their external messaging platform equivalents.

---

## Schema Design Decisions

### 1. Dual-Database Architecture (Supabase + Prisma/SQLite)

**Decision:** Use Supabase PostgreSQL as the primary database in production, with Prisma/SQLite as a local development fallback.

**Rationale:**
- Supabase provides managed PostgreSQL with REST API access (no direct connection needed)
- REST API access works in serverless environments (Vercel) where TCP connections are limited
- SQLite provides zero-config local development without external service dependencies
- Prisma ORM serves as the universal schema definition, ensuring both databases have identical structure
- Row Level Security (RLS) in Supabase enables fine-grained access control in production

**Trade-off:** API routes must implement the try-Supabase-first fallback pattern, adding complexity. Data consistency between the two databases is not automatic — schema changes must be applied to both.

### 2. SQLite for Local Development, Supabase for Production

**Decision:** Use SQLite during development for zero-config setup, with Supabase PostgreSQL for production.

**Rationale:**
- SQLite eliminates the need for a running database server in development
- Prisma's abstraction layer makes the fallback mostly transparent
- Supabase provides: vector search (pgvector), concurrent writes, JSONB indexing, RLS, and real-time subscriptions

**Trade-off:** SQLite lacks native JSON query support, so JSON fields are stored as plain strings and must be parsed in application code. Some Supabase features (RLS, real-time) are not available locally.

### 3. JSON String Fields Instead of Separate Tables

**Decision:** Complex nested data (forecast points, workflow steps, review discrepancies, chat messages, etc.) is stored as JSON strings rather than normalized into separate tables.

**Rationale:**
- Reduces schema complexity and join overhead
- The data is always read/written as a complete unit (no partial updates)
- SQLite lacks JSONB support, so the performance difference is negligible
- Supabase PostgreSQL uses JSONB with indexing for the same fields

**Trade-off:** Cannot query into JSON fields with Prisma. If you need to query by a nested field, you must fetch all records and filter in application code. In Supabase, PostgREST supports JSON column filtering.

### 4. Organization-Centric Multi-Tenancy

**Decision:** All business models have a required `organizationId` foreign key pointing to `Organization`.

**Rationale:**
- Clean tenant isolation at the data layer
- Simple query patterns: always include `where: { organizationId }` 
- Supports future multi-tenancy enforcement at the middleware level
- Supabase RLS policies can enforce organization scoping at the database level

**Trade-off:** Currently using hardcoded `organizationId: "default"` — no actual tenant isolation yet.

### 5. Soft Foreign Keys for Cross-Model References

**Decision:** `PlanReview.planId`, `PitchDeck.planId`, `OpenClawScheduledTask.agentId` are plain strings, not Prisma foreign keys.

**Rationale:**
- Referenced entities may exist only in client-side state during early development
- Avoids cascade delete issues when parent records are deleted
- Provides flexibility for cross-system references

**Trade-off:** No referential integrity at the database level. Orphaned records are possible if a referenced entity is deleted.

### 6. String-Based Enums

**Decision:** All enum-like fields (status, type, persona, tier, etc.) use `String` instead of Prisma enums.

**Rationale:**
- SQLite doesn't support native enum types
- String fields are more flexible for adding new values without migrations
- Application-level validation via TypeScript types provides type safety

**Trade-off:** No database-level constraint on valid values. Invalid strings can be inserted if application validation fails.

### 7. No Cascade Deletes

**Decision:** No `onDelete: Cascade` on any relation.

**Rationale:**
- Prevents accidental data loss when deleting parent records
- Explicit deletion is safer for business-critical data
- Organization deletion should require explicit cleanup of all related data

**Trade-off:** Deleting an organization leaves orphaned records. This will be addressed with a cleanup service in a future release.

### 8. Snapshot Pattern for Chat Sessions

**Decision:** `ChatSession` stores frozen copies of memory (`memorySnapshot`) and personality (`soulSnapshot`) at session start.

**Rationale:**
- Ensures conversation consistency even if organization config changes mid-session
- Critical for audit trails — you can see exactly what context the AI had when it generated a response
- Enables reproducible AI behavior for debugging and compliance

**Trade-off:** Increases storage usage as snapshots are duplicated per session. Memory snapshots can become stale if the organization's memory is significantly updated.

---

## JSON Field Patterns

The following table summarizes all JSON string fields in the schema:

### Core Models (Original 16)

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

### OpenClaw Models (7)

| Model | Field | TypeScript Type | Purpose |
|-------|-------|----------------|---------|
| `OpenClawChannel` | `config` | `OpenClawChannelConfig` | Channel-specific settings (API keys, tokens) |
| `OpenClawGateway` | `config` | `OpenClawGatewayConfig` | Gateway settings (auth, channels, plugins) |
| `OpenClawPlugin` | `capabilities` | `string[]` | Plugin capability descriptors |
| `OpenClawPlugin` | `config` | `Record<string, unknown>` | Plugin configuration |
| `OpenClawDelegate` | `channels` | `string[]` | Channel types this delegate operates on |
| `OpenClawDelegate` | `standingOrders` | `StandingOrder[]` | Automated action rules |
| `OpenClawWebhook` | `events` | `string[]` | Subscribed event types |
| `OpenClawWebhook` | `headers` | `Record<string, string>` | Custom HTTP headers |
| `OpenClawSoulConfig` | `rules` | `string[]` | Behavioral rules for AI personality |

### Gateway, Skills & Chat Models (3)

| Model | Field | TypeScript Type | Purpose |
|-------|-------|----------------|---------|
| `GatewayConversation` | `metadata` | `GatewayMetadata` | Platform-specific message data |
| `Skill` | `tags` | `string[]` | Skill categorization tags |
| `ChatSession` | `messages` | `ChatMessage[]` | Full conversation history |
| `ChatSession` | `memorySnapshot` | `MemorySnapshot[]` | Frozen memory at session start |
| `ChatSession` | `soulSnapshot` | `SoulSnapshot` | Frozen SOUL.md at session start |
| `ChatSession` | `skillsUsed` | `string[]` | Skill IDs used in session |

**Total: 27 JSON string fields** (up from 12 in v0.2.0)

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

## Supabase Integration

### Client Setup

The Supabase client is configured in `src/lib/supabase.ts`:

```typescript
import { getSupabaseServer, getSupabaseClient, isSupabaseAvailable } from '@/lib/supabase';

// Server-side (bypasses RLS) — use in API routes
const supabase = getSupabaseServer();

// Client-side (respects RLS) — use in browser
const supabase = getSupabaseClient();

// Check availability
if (isSupabaseAvailable()) { /* use Supabase */ }
```

### Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Server + Client | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Full access, bypasses RLS |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Server + Client | Limited access, respects RLS |

### REST API Patterns (Supabase)

Supabase uses the PostgREST API under the hood. Key patterns used in the codebase:

```typescript
// SELECT with filter
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('organizationId', orgId);

// INSERT
const { data, error } = await supabase
  .from('table_name')
  .insert({ field: 'value' })
  .select()
  .single();

// UPDATE
const { data, error } = await supabase
  .from('table_name')
  .update({ field: 'new_value' })
  .eq('id', recordId)
  .select()
  .single();

// DELETE
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', recordId);
```

### Table Naming Convention

Supabase tables use **snake_case** names that map to **PascalCase** Prisma models:

| Prisma Model | Supabase Table |
|-------------|---------------|
| `User` | `users` |
| `Organization` | `organizations` |
| `BusinessPlan` | `business_plans` |
| `AgentSession` | `agent_sessions` |
| `OpenClawChannel` | `openclaw_channels` |
| `OpenClawGateway` | `openclaw_gateways` |
| `GatewayConversation` | `gateway_conversations` |
| `ChatSession` | `chat_sessions` |
| `AgentMemoryV2` | `agent_memory_v2` |

### Row Level Security (RLS)

Supabase RLS policies enforce organization-scoped access:

```sql
-- Example RLS policy (applied to each table)
CREATE POLICY "Users can only see their organization's data"
  ON table_name FOR ALL
  USING (organizationId = auth.jwt()->>'organizationId');
```

**Important:** The server-side client (`getSupabaseServer()`) uses the service role key which **bypasses RLS**. This is intentional for API routes that need cross-organization access (e.g., admin operations). The client-side client (`getSupabaseClient()`) uses the anon key and **respects RLS**.

---

## Migration Notes

### Current State (v0.3.0)

- Using `prisma db push` for schema synchronization (no migration files)
- SQLite database at `db/custom.db` for local development
- Supabase PostgreSQL configured as primary production database
- Dual-database pattern: try Supabase first → fallback to Prisma if unavailable
- All 27 models synchronized across both databases
- No migration history or versioning (Prisma)

### Planned: Full PostgreSQL Migration (Future)

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

### Supabase-Specific Migration Notes

- Supabase tables are managed via the Supabase dashboard or SQL migrations
- The Prisma schema is the source of truth — Supabase tables must match
- RLS policies must be created for each new table
- Seed data is applied via Supabase dashboard or custom seed scripts
- JSON fields in Supabase use native JSONB (not JSON strings)

---

## Index Strategy

### Current Indexes (Auto-generated by Prisma)

| Model | Field | Type | Auto |
|-------|------|------|------|
| `User` | `id` | Primary | Yes |
| `User` | `email` | Unique | Yes |
| `Organization` | `id` | Primary | Yes |
| `Organization` | `slug` | Unique | Yes |
| `Skill` | `id` | Primary | Yes |
| `Skill` | `name` | Unique | Yes |
| `Skill` | `slug` | Unique | Yes |
| All others | `id` | Primary | Yes |

### Planned Indexes (PostgreSQL)

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

model GatewayConversation {
  @@index([organizationId, platform])
  @@index([organizationId, platformUserId])
}

model ChatSession {
  @@index([organizationId, platform])
  @@index([organizationId, status])
}

model OpenClawChannel {
  @@index([organizationId, type])
  @@index([organizationId, status])
}

model Skill {
  @@index([organizationId, category])
  @@index([organizationId, status])
}

model AgentMemoryV2 {
  @@index([organizationId, type])
  @@index([organizationId, importance])
}
```

**Rationale:** Composite indexes on `(organizationId, ...)` support the multi-tenant query pattern where all queries are scoped to an organization first. Single-column indexes on frequently filtered fields (status, type, period) improve dashboard and list queries.

---

## Future Schema Changes

### v0.3.x — Production Hardening

| Change | Description |
|--------|-------------|
| Add `AuditLog` model | Track all data changes for compliance |
| Add `Session` model | NextAuth.js session management |
| Add `Account` model | NextAuth.js OAuth provider accounts |
| Add `VerificationToken` model | Email verification and password reset |
| Convert JSON `String` → `Json` | Native PostgreSQL JSONB support |
| Convert `Float` → `Decimal` | Accurate monetary calculations |
| Add composite indexes | Multi-tenant query optimization |
| Add RLS policies | Supabase Row Level Security for all tables |

### v0.4.0 — Intelligence

| Change | Description |
|--------|-------------|
| Add `@db.Vector(1536)` to `AgentMemory.embedding` | pgvector for semantic search |
| Add `AgentConversation` model | Multi-turn agent conversation history |
| Add `ModelConfig` model | LLM model configuration per organization |
| Add `PromptTemplate` model | Customizable prompt templates |
| Consolidate `AgentMemory` + `AgentMemoryV2` | Unify memory system |

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

*Last updated: 2025-03-05 | GangNiaga AI OS v0.3.0 | 27 Models*
