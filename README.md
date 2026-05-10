<div align="center">

# 🧠 GangNiaga AI OS

**Southeast Asia's First Autonomous AI-Powered Business Operating System**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![AI SDK](https://img.shields.io/badge/AI-z--ai--web--dev--sdk-emerald)]()

*Built for SMEs across ASEAN — from Kuala Lumpur to Jakarta, Bangkok to Manila.*

</div>

---

## 📋 Overview

**GangNiaga AI OS** is an autonomous, AI-powered business operating system designed specifically for small and medium enterprises (SMEs) in Southeast Asia. It replaces 7+ disconnected tools with a single intelligent platform that **plans, analyzes, validates, and executes** real business workflows.

> 💡 **The Problem:** 70% of ASEAN SMEs still use manual methods for business planning and financial forecasting. 60% fail within 3 years due to cash flow mismanagement. Only 15% use business planning software.

> 🚀 **The Solution:** GangNiaga combines AI-driven proposal generation, lender-grade plan review, financial forecasting, multi-agent orchestration, and pitch deck creation — all in one platform tailored for ASEAN markets.

### Why GangNiaga?

| Traditional Tools | GangNiaga AI OS |
|---|---|
| Static business plan templates | AI-generated 21-section proposals with 6 proposal types |
| Manual financial spreadsheets | Connected financial engine with DSCR gauges & sensitivity analysis |
| No plan validation | Lender-grade AI review with bank/investor/grant personas |
| Separate pitch deck tools | AI-orchestrated pitch decks with anticipated funder questions |
| Siloed workflows | 8 autonomous AI agents executing real business tasks |
| No variance tracking | Plan vs Actuals with QuickBooks/Xero integration support |

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

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York style) |
| **Database** | Prisma ORM with SQLite |
| **State Management** | Zustand (client) + TanStack Query (server) |
| **AI SDK** | z-ai-web-dev-sdk (chat, validation, generation, review) |
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

---

## 🚀 Getting Started

### Prerequisites

- **Bun** >= 1.0 (recommended) or Node.js >= 18
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/gangniaga-ai-os.git
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
│   └── schema.prisma            # 13 database models
├── db/
│   └── custom.db                # SQLite database file
├── public/
│   ├── gangniaga-logo.png       # Brand logo
│   └── logo.svg                 # SVG logo
├── src/
│   ├── app/
│   │   ├── api/                 # 9 API endpoints
│   │   │   ├── agents/          # Agent CRUD & task management
│   │   │   ├── business-plan/   # 21-section AI proposal generation
│   │   │   ├── chat/            # AI Copilot chat endpoint
│   │   │   ├── dashboard/       # Dashboard KPI data
│   │   │   ├── forecast/        # Financial forecast AI analysis
│   │   │   ├── idea-canvas/     # Idea validation engine
│   │   │   ├── pitch-deck/      # Pitch deck & question generation
│   │   │   ├── plan-review/     # Lender-grade plan review
│   │   │   └── reports/         # Report generation
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
| 14 | **Settings** | Organization configuration, currency preferences, integration management, and system settings |

---

## 🔌 API Reference

### `POST /api/business-plan`
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

### `POST /api/idea-canvas`
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

### `POST /api/plan-review`
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

### `POST /api/pitch-deck`
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

### `POST /api/forecast`
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

### `POST /api/chat`
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

### `GET /api/dashboard`
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

### `GET /api/agents`
List all agent sessions with recent tasks.

```typescript
// Response
{
  agents: AgentSession[];  // includes tasks relation
}
```

### `POST /api/agents`
Create a new agent session.

```typescript
// Request
{
  name?: string;
  type?: string;
  config?: object;
}

// Response
{ agent: AgentSession }
```

### `POST /api/reports`
Generate an AI-powered business report.

```typescript
// Request
{
  title: string;
  type: "investor" | "board" | "financial" | "kpi" | "operational";
  format: "pdf" | "docx" | "xlsx" | "csv";
}

// Response
{
  content: string;
  title: string;
  type: string;
  format: string;
}
```

---

## 🗄 Database Schema

13 Prisma models with full relational mapping:

```
Organization ─┬── User
              ├── BusinessPlan
              ├── Forecast
              ├── AgentSession ─── AgentTask
              ├── AgentMemory
              ├── WorkflowRun
              ├── KPIData
              ├── Report
              ├── IdeaCanvas
              ├── PlanReview
              ├── PlanActual
              ├── PitchDeck
              ├── Citation
              └── Integration
```

### Key Models

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

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="file:./db/custom.db"

# AI SDK (z-ai-web-dev-sdk)
# The SDK auto-configures — no additional keys needed
```

### Theme Configuration

GangNiaga uses **dark mode by default** with an emerald/teal/amber accent palette. Theme is managed via `next-themes` and CSS variables in `globals.css`.

**Design Rules:**
- ✅ Emerald, teal, and amber accent colors
- ❌ No blue or indigo colors
- Dark mode default with light mode support
- Responsive design (mobile-first)

### Sidebar & Navigation

The application uses a single-page architecture with module switching via Zustand state. The sidebar provides navigation across all 14 modules, with a command palette (`Cmd+K`) for quick access.

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
