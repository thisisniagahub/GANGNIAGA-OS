<div align="center">

# 🧠 GangNiaga AI OS

**Southeast Asia's First Autonomous AI-Powered Business Operating System**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-emerald)](https://openrouter.ai/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)

*Built for SMEs across ASEAN — from Kuala Lumpur to Jakarta, Bangkok to Manila.*

`v0.3.0`

</div>

---

## 📋 Overview

**GangNiaga AI OS** is an autonomous, AI-powered business operating system designed specifically for small and medium enterprises (SMEs) in Southeast Asia. It replaces 7+ disconnected tools with a single intelligent platform that **plans, analyzes, validates, and executes** real business workflows — now with multi-channel AI gateway capabilities and 30+ built-in skills.

> 💡 **The Problem:** 70% of ASEAN SMEs still use manual methods for business planning and financial forecasting. 60% fail within 3 years due to cash flow mismanagement. Only 15% use business planning software.

> 🚀 **The Solution:** GangNiaga combines AI-driven proposal generation, lender-grade plan review, financial forecasting, multi-agent orchestration, pitch deck creation, multi-channel messaging, and a skills execution engine — all in one platform tailored for ASEAN markets.

### Why GangNiaga?

| Traditional Tools | GangNiaga AI OS |
|---|---|
| Static business plan templates | AI-generated 21-section proposals with 6 proposal types |
| Manual financial spreadsheets | Connected financial engine with DSCR gauges & sensitivity analysis |
| No plan validation | Lender-grade AI review with bank/investor/grant personas |
| Separate pitch deck tools | AI-orchestrated pitch decks with anticipated funder questions |
| Siloed workflows | 8 autonomous AI agents executing real business tasks |
| No variance tracking | Plan vs Actuals with QuickBooks/Xero integration support |
| Single-channel support | Multi-channel AI gateway (WhatsApp, Telegram, Discord, Slack, Signal, WebChat) |
| Manual tool integrations | 30+ built-in skills with auto-learn and execution engine |
| Single AI provider lock-in | Multi-provider AI adapter (ZAI / OpenAI / OpenRouter) |

---

## ✨ Key Features

### 📝 21-Section Business Proposal Builder
Professional, bank-grade business proposals generated section-by-section with AI. Supports **6 proposal types** — bank loan, government grant, angel investor, venture capital, SME financing, and corporate partnership. Each section has specialized AI prompts that produce data-rich, ASEAN-context content. Bulk generation and inline editing included.

### 🎯 Idea Canvas & Validation Engine
Structure and validate business ideas across **5 dimensions**: market viability, problem clarity, solution feasibility, revenue potential, and competitive position. AI provides honest, benchmarked assessments with red flag detection and ASEAN industry comparisons.

### 🔍 Plan Review Agent
Lender-grade AI review that analyzes business plans from the perspective of **bank loan officers, VC investors, and grant reviewers**. Performs narrative vs. financial consistency checking, flags discrepancies with severity ratings, and provides prioritized recommendations.

### 📊 Financial Forecasting Engine
Revenue modeling, expense analysis, and cash flow projections with **DSCR gauge visualization**, P&L statements, balance sheets, and a bank approval checklist. Connected financial model — change one assumption and see downstream impacts.

### 🎤 Pitch Deck Orchestrator
AI-generated pitch decks for **investor, bank, and grant** templates. Each slide links back to the business plan sections. Includes **anticipated funder questions** with suggested answer frameworks and difficulty ratings.

### 🤖 Multi-Agent System
**8 specialized AI agents** that autonomously execute business tasks:
- **Business Analyst** — Market analysis & strategic insights
- **Financial Advisor** — Revenue modeling & expense analysis
- **Market Researcher** — Competitive intelligence & monitoring
- **Report Generator** — Automated report creation
- **Browser Agent** — Web interaction & data extraction
- **CRM Assistant** — Customer relationship management
- **Plan Review Agent** — Lender-grade plan analysis
- **Citation Verifier** — Source verification & fact-checking

### 📈 Plan vs Actuals Tracking
Track variance between planned and actual financials across revenue, expense, cash flow, and profit categories. **Automatic variance alerts** when thresholds are exceeded. Integration support for QuickBooks and Xero.

### 💬 AI Copilot
Context-aware business assistant that understands your company's KPIs, financial model, and operational context. Multi-turn conversation with history.

### ⚡ Workflow Automation
Multi-step orchestrated workflows with triggers (cron, event, threshold, manual). Steps are executed by AI agents and tools in sequence with real-time status tracking.

### 🧠 Persistent Memory Engine
Workspace, financial, user preference, workflow, and agent context memories. AI agents leverage persistent memory for context-aware decisions.

### 🦞 OpenClaw — Multi-Channel AI Gateway
Deploy your AI across **6 messaging channels**: WhatsApp, Telegram, Discord, WebChat, Signal, and Slack. Features plugin architecture with ClawHub tools, delegate routing for multi-agent conversations, SOUL.md personality system, and scheduled automation tasks.

### 🛠 Skills System
**30+ built-in skills** with auto-learn capabilities and a unified execution engine. Skills are composable, auto-discovered, and can be triggered from any module or messaging channel.

### 🧠 Multi-Provider AI Adapter
Unified AI provider that intelligently routes between **ZAI** (dev/sandbox), **OpenAI** (production), and **OpenRouter** (Vercel deployment with up to 4 API keys in round-robin). Supports chat, vision, ASR, TTS, image generation/editing, web search, and page reading — with no-op fallback for resilience.

### 📡 Gateway — Real Messaging Integration
Production-ready webhooks for **Telegram** and **WhatsApp** with setup endpoints, webhook verification, and message processing pipelines.

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript 5 |
| **Runtime** | Bun |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York style) |
| **Primary Database** | Supabase PostgreSQL (REST API) |
| **Fallback Database** | Prisma ORM with SQLite (local dev) |
| **State Management** | Zustand (client) + TanStack Query (server) |
| **AI Providers** | ZAI (z-ai-web-dev-sdk) / OpenAI / OpenRouter (4-key round-robin) |
| **Default AI Model** | openrouter/owl-alpha |
| **AI Capabilities** | Chat, Vision, ASR, TTS, Image Gen/Edit, Web Search, Page Reader |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod validation |
| **Theming** | next-themes (dark mode default, emerald/teal/amber accent) |
| **Tables** | TanStack Table |
| **Drag & Drop** | dnd-kit |
| **Markdown** | react-markdown + react-syntax-highlighter |
| **Editor** | MDXEditor |
| **Notifications** | Sonner |
| **Deployment** | Vercel (Singapore region sin1) |

---

## 🚀 Getting Started

### Prerequisites

- **Bun** >= 1.0 (recommended) or Node.js >= 18
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/thisisniagahub/GANGNIAGA-OS.git
cd gangniaga-ai-os

# Install dependencies
bun install

# Set up the database
bun run db:push

# Start the development server
bun run dev
```

The app runs at **http://localhost:3000**.

### Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start dev server on port 3000 |
| `bun run lint` | Run ESLint for code quality |
| `bun run db:push` | Push Prisma schema to SQLite |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run db:reset` | Reset database |

---

## 📁 Project Structure

```
gangniaga-ai-os/
├── prisma/
│   └── schema.prisma            # 27 database models
├── db/
│   └── custom.db                # SQLite database file (local dev)
├── openclaw/
│   ├── openclaw.json            # Gateway config
│   ├── plugin-manifest.json     # ClawHub tools manifest
│   ├── AGENTS.md                # Multi-agent routing
│   ├── SOUL.md                  # AI personality system
│   └── README.md                # Architecture docs
├── public/
│   ├── gangniaga-logo.png       # Brand logo
│   └── logo.svg                 # SVG logo
├── src/
│   ├── app/
│   │   ├── api/                 # 41 API endpoints
│   │   │   ├── agents/          # Agent CRUD & task management
│   │   │   ├── business-plan/   # 21-section AI proposal generation
│   │   │   ├── chat/            # AI Copilot chat endpoint
│   │   │   ├── dashboard/       # Dashboard KPI data
│   │   │   ├── forecast/        # Financial forecast AI analysis
│   │   │   ├── idea-canvas/     # Idea validation engine
│   │   │   ├── pitch-deck/      # Pitch deck & question generation
│   │   │   ├── plan-review/     # Lender-grade plan review
│   │   │   ├── reports/         # Report generation
│   │   │   ├── sessions/        # Session management
│   │   │   ├── memory/          # Persistent memory V2
│   │   │   ├── setup/           # Organization setup
│   │   │   ├── skills/          # Skills CRUD & execution
│   │   │   │   ├── [id]/        # Individual skill operations
│   │   │   │   ├── execute/     # Skill execution engine
│   │   │   │   └── auto-learn/  # Auto-learn endpoint
│   │   │   ├── ai/              # Multi-provider AI adapter
│   │   │   │   ├── chat/        # Chat completions
│   │   │   │   ├── vision/      # Image understanding
│   │   │   │   ├── asr/         # Speech-to-text
│   │   │   │   ├── tts/         # Text-to-speech
│   │   │   │   ├── image/       # Image generation
│   │   │   │   ├── search/      # Web search
│   │   │   │   ├── read/        # Page reader
│   │   │   │   └── status/      # Provider health check
│   │   │   ├── gateway/         # Messaging gateway
│   │   │   │   ├── status/      # Gateway status
│   │   │   │   ├── config/      # Gateway configuration
│   │   │   │   ├── telegram/    # Telegram integration
│   │   │   │   │   ├── setup/   # Bot setup
│   │   │   │   │   └── webhook/ # Webhook handler
│   │   │   │   └── whatsapp/    # WhatsApp integration
│   │   │   │       ├── setup/   # Channel setup
│   │   │   │       └── webhook/ # Webhook handler
│   │   │   └── openclaw/        # OpenClaw multi-channel gateway
│   │   │       ├── channels/    # Channel management
│   │   │       │   └── [id]/    # Individual channel ops
│   │   │       ├── gateway/     # Gateway operations
│   │   │       ├── plugins/     # Plugin management
│   │   │       ├── delegates/   # Delegate routing
│   │   │       ├── webhooks/    # Webhook management
│   │   │       ├── soul/        # SOUL.md personality
│   │   │       ├── automation/  # Scheduled tasks
│   │   │       └── cli/         # CLI interface
│   │   ├── globals.css          # Global styles & CSS variables
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main application page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx      # Navigation sidebar
│   │   │   ├── header.tsx       # Top header bar
│   │   │   └── command-palette.tsx  # Cmd+K command palette
│   │   ├── modules/
│   │   │   ├── dashboard.tsx    # Dashboard & KPI cards
│   │   │   ├── business-plans.tsx   # 21-section proposal builder
│   │   │   ├── financials.tsx   # Financial forecasting engine
│   │   │   ├── idea-canvas.tsx  # Idea validation canvas
│   │   │   ├── plan-review.tsx  # Plan review agent
│   │   │   ├── research.tsx     # Research & citations
│   │   │   ├── agents.tsx       # Multi-agent console
│   │   │   ├── workflows.tsx    # Workflow automation
│   │   │   ├── memory.tsx       # Persistent memory engine
│   │   │   ├── pitch-deck.tsx   # Pitch deck orchestrator
│   │   │   ├── reports.tsx      # Report generation
│   │   │   ├── plan-actuals.tsx # Plan vs actuals tracking
│   │   │   ├── copilot.tsx      # AI Copilot chat
│   │   │   ├── openclaw.tsx     # OpenClaw multi-channel gateway
│   │   │   └── settings.tsx     # Settings & configuration
│   │   └── ui/                  # 50+ shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts        # Mobile detection hook
│   │   └── use-toast.ts         # Toast notification hook
│   └── lib/
│       ├── db.ts                # Prisma client instance
│       ├── store.ts             # Zustand global state
│       ├── types.ts             # TypeScript type definitions
│       └── utils.ts             # Utility functions
├── Caddyfile                    # Gateway configuration
├── vercel.json                  # Vercel deployment config (sin1)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 📦 Module Overview

| # | Module | Description |
|---|---|---|
| 1 | **Dashboard** | Real-time KPI cards (MRR, ARR, burn rate, runway, DSCR), revenue vs expense charts, expense breakdown, and recent activity feed |
| 2 | **Business Plans** | 21-section professional proposal builder with 6 proposal types, AI generation per section, bulk generation, inline editing, and markdown preview |
| 3 | **Financials** | Financial forecasting engine with revenue modeling, expense analysis, DSCR gauge, P&L / Balance Sheet / Cash Flow statements, and bank approval checklist |
| 4 | **Idea Canvas** | Business idea structuring canvas with AI validation across 5 dimensions, benchmark comparison, red flag detection, and ASEAN market scoring |
| 5 | **Plan Review** | Lender-grade AI review with bank/investor/grant personas, narrative vs financial consistency checking, discrepancy flagging, and prioritized recommendations |
| 6 | **Research** | Citation management with source verification, geography tagging, and data point extraction for bank-grade research |
| 7 | **Agents** | Multi-agent console with 8 specialized AI agents, task management, execution history, and real-time status monitoring |
| 8 | **Workflows** | Multi-step workflow automation with triggers (cron, event, threshold, manual), sequential agent execution, and status tracking |
| 9 | **Memory** | Persistent AI memory engine with workspace, financial, user preference, workflow, and agent context categories |
| 10 | **Pitch Deck** | AI-orchestrated pitch deck generation for investor/bank/grant templates, with anticipated funder questions and suggested answers |
| 11 | **Reports** | AI-powered report generation for investor updates, board presentations, financial summaries, KPI reports, and operational intelligence |
| 12 | **Plan vs Actuals** | Variance tracking between planned and actual financials, automatic threshold alerts, QuickBooks/Xero integration support |
| 13 | **Copilot** | Context-aware AI business assistant with multi-turn conversation, company KPI awareness, and actionable insights |
| 14 | **Settings** | Organization configuration, currency preferences, integration management, AI provider settings, and system settings |
| 15 | **OpenClaw** | Multi-channel AI gateway with WhatsApp/Telegram/Discord/Signal/Slack/WebChat support, plugin architecture (ClawHub), delegate routing, SOUL.md personality, and scheduled automation |

---

## 🔌 API Reference

41 API routes across 5 domains:

### Core Business (9 routes)

#### `POST /api/business-plan`
Generate AI content for a specific section of a business proposal.

```typescript
// Request
{
  title: string;          // Proposal title
  industry: string;       // Industry context
  section: ProposalSectionKey;  // One of 21 section keys
  proposalType: ProposalType;   // bank_loan | government_grant | angel_investor | venture_capital | sme_financing | corporate_partnership
}

// Response
{ content: string }  // AI-generated section content in markdown
```

#### `POST /api/idea-canvas`
Validate a business idea and receive a structured assessment.

```typescript
// Request
{
  title: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  revenueModel?: string;
  competitiveEdge?: string;
  risks?: string[];
}

// Response
{
  validation: {
    overallScore: number;      // 0-100
    marketViability: number;
    problemClarity: number;
    solutionFeasibility: number;
    revenuePotential: number;
    competitivePosition: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    redFlags: string[];
    benchmarkComparison: { metric, user, benchmark, status }[];
  }
}
```

#### `POST /api/plan-review`
Generate a lender-grade review of a business plan.

```typescript
// Request
{
  planId: string;
  lenderPersona: "bank" | "investor" | "grant_officer";
}

// Response
{
  review: {
    narrativeScore: number;    // 0-100
    financialScore: number;
    consistencyScore: number;
    overallScore: number;
    discrepancies: { id, severity, section, description, narrativeClaim, financialReality, suggestedFix }[];
    recommendations: { id, priority, category, recommendation, impact }[];
  }
}
```

#### `POST /api/pitch-deck`
Generate AI pitch deck slides or anticipated funder questions.

```typescript
// Request (generate deck)
{
  title: string;
  templateType: "investor" | "bank" | "grant";
  action?: undefined;  // default: generate slides
}

// Request (generate questions)
{
  title: string;
  templateType: "investor" | "bank" | "grant";
  action: "generate_questions";
}

// Response
{
  slides: { id, order, title, type, content, dataPoints, linkedSection }[];
  anticipatedQuestions: { id, question, category, suggestedAnswer, difficulty }[];
}
```

#### `POST /api/forecast`
Generate AI financial analysis for forecast data.

```typescript
// Request
{
  type: "revenue" | "expense" | "cashflow" | "profit";
  period: string;
  data: object;
}

// Response
{ analysis: string }  // AI-generated financial analysis
```

#### `POST /api/chat`
AI Copilot conversation endpoint.

```typescript
// Request
{
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

// Response
{ response: string }  // AI assistant response
```

#### `GET /api/dashboard`
Fetch dashboard KPI data, recent plans, agents, and workflows.

```typescript
// Response
{
  kpis: KPIData[];
  plans: BusinessPlan[];
  agents: AgentSession[];
  workflows: WorkflowRun[];
}
```

#### `GET/POST /api/agents`
List all agent sessions or create a new one.

```typescript
// GET Response
{ agents: AgentSession[] }

// POST Request
{ name?: string; type?: string; config?: object; }

// POST Response
{ agent: AgentSession }
```

#### `POST /api/reports`
Generate an AI-powered business report.

```typescript
// Request
{
  title: string;
  type: "investor" | "board" | "financial" | "kpi" | "operational";
  format: "pdf" | "docx" | "xlsx" | "csv";
}

// Response
{ content: string; title: string; type: string; format: string; }
```

### Skills System (4 routes)

#### `GET /api/skills`
List all available skills with metadata.

#### `GET /api/skills/[id]`
Get details for a specific skill.

#### `POST /api/skills/execute`
Execute a skill by ID with provided parameters.

#### `POST /api/skills/auto-learn`
Trigger auto-learn to discover and register new skills.

### AI Provider (8 Routes)

#### `POST /api/ai/chat`
Multi-provider chat completions (ZAI/OpenAI/OpenRouter).

#### `POST /api/ai/vision`
Image understanding and visual analysis.

#### `POST /api/ai/asr`
Speech-to-text transcription.

#### `POST /api/ai/tts`
Text-to-speech synthesis.

#### `POST /api/ai/image`
Image generation and editing.

#### `POST /api/ai/search`
Web search via AI provider.

#### `POST /api/ai/read`
Web page content extraction and reading.

#### `GET /api/ai/status`
Provider health check and configuration status.

### Gateway / Messaging (6 Routes)

#### `GET /api/gateway/status`
Gateway connection status across all channels.

#### `GET /api/gateway/config`
Gateway configuration and channel settings.

#### `POST /api/gateway/telegram/setup`
Set up Telegram bot with webhook URL.

#### `POST /api/gateway/telegram/webhook`
Telegram webhook handler for incoming messages.

#### `POST /api/gateway/whatsapp/setup`
Set up WhatsApp Business API integration.

#### `POST /api/gateway/whatsapp/webhook`
WhatsApp webhook handler for incoming messages.

### OpenClaw (9 Routes)

#### `GET/POST /api/openclaw/channels`
List or create messaging channels.

#### `GET/PUT/DELETE /api/openclaw/channels/[id]`
Manage individual channel configuration.

#### `GET/POST /api/openclaw/gateway`
Gateway operations and routing.

#### `GET/POST /api/openclaw/plugins`
Plugin management (install, configure, list).

#### `GET/POST /api/openclaw/delegates`
Delegate routing for multi-agent conversations.

#### `GET/POST /api/openclaw/webhooks`
Webhook management for external integrations.

#### `GET/PUT /api/openclaw/soul`
SOUL.md personality configuration and editing.

#### `GET/POST /api/openclaw/automation`
Scheduled task management and automation rules.

#### `POST /api/openclaw/cli`
CLI interface for remote OpenClaw operations.

---

## 🗄 Database Schema

27 Prisma models with full relational mapping, using a dual-database pattern:

- **Primary:** Supabase PostgreSQL (REST API) — production
- **Fallback:** Prisma ORM with SQLite — local development

```
Organization ─┬── User
              ├── BusinessPlan
              ├── Forecast
              ├── AgentSession ─── AgentTask
              ├── AgentMemory
              ├── AgentMemoryV2            # Enhanced memory with embeddings
              ├── WorkflowRun
              ├── KPIData
              ├── Report
              ├── IdeaCanvas
              ├── PlanReview
              ├── PlanActual
              ├── PitchDeck
              ├── Citation
              ├── Integration
              ├── ChatSession              # AI Copilot sessions
              ├── Skill                    # Skills system registry
              ├── GatewayConversation       # Messaging conversations
              ├── OpenClawChannel           # Multi-channel config
              ├── OpenClawGateway           # Gateway routing
              ├── OpenClawPlugin            # Plugin registry
              ├── OpenClawDelegate          # Delegate routing
              ├── OpenClawWebhook           # Webhook management
              ├── OpenClawScheduledTask     # Automation rules
              └── OpenClawSoulConfig        # AI personality
```

### Core Business Models

| Model | Purpose | Key Fields |
|---|---|---|
| **Organization** | Tenant/root entity | `name`, `slug`, `industry`, `size`, `country` |
| **User** | User accounts | `email`, `name`, `role`, `avatar` |
| **BusinessPlan** | Business proposals | `title`, `status`, `executiveSummary`, `marketAnalysis`, `swotAnalysis`, `competitorAnalysis`, `financialPlan`, `riskAnalysis`, `recommendations` |
| **Forecast** | Financial forecasts | `name`, `type`, `period`, `data` (JSON) |
| **AgentSession** | AI agent sessions | `name`, `type`, `status`, `tasksCompleted`, `lastActivity`, `config` (JSON) |
| **AgentTask** | Individual agent tasks | `type`, `status`, `input`, `output`, `duration` |
| **AgentMemory** | Persistent AI memory | `type`, `category`, `content`, `embedding` |
| **WorkflowRun** | Automated workflows | `name`, `type`, `status`, `triggerType`, `steps` (JSON) |
| **KPIData** | Dashboard metrics | `metric`, `value`, `previousValue`, `target`, `unit`, `period` |
| **IdeaCanvas** | Idea validation | `title`, `status`, `problem`, `solution`, `targetMarket`, `revenueModel`, `competitiveEdge`, `validationScore`, `validationReport` (JSON) |
| **PlanReview** | Lender-grade reviews | `planId`, `lenderPersona`, `narrativeScore`, `financialScore`, `consistencyScore`, `overallScore`, `discrepancies` (JSON), `recommendations` (JSON) |
| **PlanActual** | Variance tracking | `category`, `period`, `plannedAmount`, `actualAmount`, `variance`, `source` (manual/quickbooks/xero) |
| **PitchDeck** | Pitch presentations | `title`, `templateType`, `slides` (JSON), `anticipatedQuestions` (JSON) |
| **Citation** | Source verification | `source`, `url`, `type`, `geography`, `dataPoint`, `verified` |
| **Integration** | External connections | `type` (quickbooks/xero/manual), `status`, `lastSync`, `syncFrequency` |

### Extended Models

| Model | Purpose | Key Fields |
|---|---|---|
| **AgentMemoryV2** | Enhanced AI memory with embeddings | `type`, `category`, `content`, `embedding`, `metadata` (JSON) |
| **ChatSession** | AI Copilot sessions | `sessionId`, `messages` (JSON), `context`, `createdAt` |
| **Skill** | Skills system registry | `name`, `description`, `category`, `parameters` (JSON), `handler`, `autoLearn` |
| **GatewayConversation** | Messaging conversations | `channel`, `channelId`, `messages` (JSON), `participants`, `status` |

### OpenClaw Models

| Model | Purpose | Key Fields |
|---|---|---|
| **OpenClawChannel** | Multi-channel config | `type` (whatsapp/telegram/discord/slack/signal/webchat), `name`, `config` (JSON), `status`, `credentials` (JSON) |
| **OpenClawGateway** | Gateway routing | `name`, `routes` (JSON), `defaultDelegate`, `status` |
| **OpenClawPlugin** | Plugin registry | `name`, `version`, `manifest` (JSON), `enabled`, `permissions` (JSON) |
| **OpenClawDelegate** | Delegate routing | `name`, `agentType`, `channelFilter` (JSON), `priority`, `config` (JSON) |
| **OpenClawWebhook** | Webhook management | `url`, `events` (JSON), `secret`, `status`, `lastTriggered` |
| **OpenClawScheduledTask** | Automation rules | `name`, `cron`, `action` (JSON), `enabled`, `lastRun`, `nextRun` |
| **OpenClawSoulConfig** | AI personality | `name`, `personality` (markdown), `tone`, `rules` (JSON), `version` |

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database — Primary (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Database — Fallback (SQLite / local dev)
DATABASE_URL="file:./db/custom.db"

# AI Providers
# ZAI SDK auto-configures in dev/sandbox — no keys needed
# OpenAI (production)
OPENAI_API_KEY="sk-..."

# OpenRouter (Vercel deployment — up to 4 keys for round-robin)
OPENROUTER_API_KEY_1="sk-or-..."
OPENROUTER_API_KEY_2="sk-or-..."
OPENROUTER_API_KEY_3="sk-or-..."
OPENROUTER_API_KEY_4="sk-or-..."

# Messaging Gateway
TELEGRAM_BOT_TOKEN="..."
WHATSAPP_BUSINESS_TOKEN="..."
WHATSAPP_PHONE_NUMBER_ID="..."
WHATSAPP_VERIFY_TOKEN="..."
```

### AI Provider Routing

| Environment | Provider | Config |
|---|---|---|
| **Dev / Sandbox** | ZAI | z-ai-web-dev-sdk (auto-configured) |
| **Production** | OpenAI | Direct API via `OPENAI_API_KEY` |
| **Vercel** | OpenRouter | Round-robin across `OPENROUTER_API_KEY_1..4` |
| **Fallback** | No-op | Returns empty responses when all providers fail |

**Default model:** `openrouter/owl-alpha`

### Theme Configuration

GangNiaga uses **dark mode by default** with an emerald/teal/amber accent palette. Theme is managed via `next-themes` and CSS variables in `globals.css`.

**Design Rules:**
- ✅ Emerald, teal, and amber accent colors
- ❌ No blue or indigo colors
- Dark mode default with light mode support
- Responsive design (mobile-first)

### Sidebar & Navigation

The application uses a single-page architecture with module switching via Zustand state. The sidebar provides navigation across all 15 modules, with a command palette (`Cmd+K`) for quick access.

### Deployment (Vercel)

```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "regions": ["sin1"]
}
```

Deployed to **Vercel Singapore (sin1)** for optimal ASEAN latency.

---

## 🦞 OpenClaw Architecture

OpenClaw is GangNiaga's multi-channel AI gateway system, providing a unified interface for deploying AI across messaging platforms.

```
┌──────────────────────────────────────────────┐
│                  OpenClaw                     │
├──────────────────────────────────────────────┤
│  Channels: WhatsApp | Telegram | Discord     │
│            Signal | Slack | WebChat           │
├──────────────────────────────────────────────┤
│  Gateway: Message Router & Channel Adapter   │
├──────────────────────────────────────────────┤
│  Delegates: Agent-specific routing rules     │
├──────────────────────────────────────────────┤
│  Plugins: ClawHub tools & extensions         │
├──────────────────────────────────────────────┤
│  SOUL.md: AI personality & tone system       │
├──────────────────────────────────────────────┤
│  Automation: Scheduled tasks & triggers      │
├──────────────────────────────────────────────┤
│  Webhooks: External integration endpoints    │
└──────────────────────────────────────────────┘
```

Key files in `openclaw/`:
- **`openclaw.json`** — Gateway configuration (channels, delegates, routing)
- **`plugin-manifest.json`** — ClawHub tool definitions and permissions
- **`AGENTS.md`** — Multi-agent routing rules and delegation strategies
- **`SOUL.md`** — AI personality, tone, and behavioral guidelines
- **`README.md`** — Detailed architecture documentation

---

## 📸 Screenshots / Demo

> *Screenshots coming soon*

| Module | Preview |
|---|---|
| Dashboard | *KPI cards, revenue charts, expense breakdown* |
| Business Plans | *21-section proposal builder with AI generation* |
| Financials | *DSCR gauge, P&L, balance sheet, cash flow* |
| Idea Canvas | *5-dimension validation with benchmarks* |
| Plan Review | *Lender-grade review with discrepancy flags* |
| Pitch Deck | *AI-generated slides with funder questions* |
| Agents | *8 AI agents with task execution console* |
| Copilot | *Context-aware business AI assistant* |
| OpenClaw | *Multi-channel gateway with 6 messaging platforms* |

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run linting: `bun run lint`
5. Commit with conventional commits: `git commit -m "feat: add your feature"`
6. Push to your branch: `git push origin feature/your-feature`
7. Open a Pull Request

### Contribution Guidelines

- **TypeScript** throughout — no `any` types
- Use existing **shadcn/ui** components — don't build from scratch
- Follow the existing **module pattern** in `src/components/modules/`
- API routes in `src/app/api/` — no server actions
- Run `bun run lint` before committing
- Keep the **emerald/teal/amber** color palette — no blue/indigo
- Ensure **responsive design** for all new components
- Add proper **loading states** and **error handling**

### Areas We Need Help

- 🌏 Localization for ASEAN languages (Bahasa Melayu, Bahasa Indonesia, Thai, Vietnamese)
- 📊 Additional chart types and data visualizations
- 🔌 More integrations (Stripe, Xero API, bank APIs)
- 🦞 New OpenClaw channels (WeChat, LINE, Viber)
- 🛠 New skills for the auto-learn engine
- 🧪 Test coverage
- 📱 PWA / mobile app support

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 📬 Contact

<div align="center">

**GangNiaga AI OS** — *Autonomous Intelligence for ASEAN SMEs*

[🌐 Website](https://gangniaga.com) · [📧 Email](mailto:hello@gangniaga.com) · [💬 Discord](https://discord.gg/gangniaga) · [𝕏 Twitter](https://twitter.com/gangniaga)

Built with ❤️ in Kuala Lumpur, Malaysia 🇲🇾

</div>
