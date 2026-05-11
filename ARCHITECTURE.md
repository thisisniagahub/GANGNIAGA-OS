# GangNiaga AI OS — Architecture Document

> **Version**: 0.3.0  
> **Last Updated**: March 2025  
> **Status**: Active Development

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Component Architecture](#5-component-architecture)
6. [State Management Architecture](#6-state-management-architecture)
7. [API Architecture](#7-api-architecture)
8. [Database Architecture](#8-database-architecture)
9. [AI/ML Architecture](#9-aiml-architecture)
10. [Security Architecture](#10-security-architecture)
11. [Performance Architecture](#11-performance-architecture)
12. [Design Decisions & Trade-offs](#12-design-decisions--trade-offs)
13. [Scalability Considerations](#13-scalability-considerations)
14. [Error Handling Strategy](#14-error-handling-strategy)
15. [Testing Strategy](#15-testing-strategy)

---

## 1. System Overview

GangNiaga AI OS is an **autonomous AI-powered business operating system** designed for Southeast Asian SMEs. It replaces 7+ disconnected business tools with a single intelligent platform that plans, analyzes, automates, and executes real business workflows through specialized AI agents — accessible via web, WhatsApp, Telegram, and other channels.

### Core Value Proposition

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   "The AI that runs your business — not just helps with it" │
│                                                              │
│   Plan  ──▶  Analyze  ──▶  Automate  ──▶  Execute           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Key Differentiators

| Feature | Traditional Tools | GangNiaga AI OS |
|---------|------------------|-----------------|
| Business Planning | Static templates | AI-generated 21-section proposals |
| Financial Forecasting | Manual spreadsheets | Connected financial model with DSCR |
| Idea Validation | Guesswork | 5-dimension AI validation with benchmarks |
| Plan Review | Self-review | Lender-perspective AI review agent |
| Operations | Manual tracking | 8 autonomous AI agents |
| Plan vs Actuals | End-of-quarter compare | Real-time variance alerts |
| Pitch Decks | PowerPoint drag-and-drop | AI-generated from business plan data |
| Research | Manual Googling | Citation-verified AI research |
| Multi-Channel | Single channel only | WhatsApp, Telegram, Discord, Slack, 20+ channels |
| AI Personality | Generic chatbot | SOUL.md-configured ASEAN business personality |
| Skill System | Fixed capabilities | Extensible skill system with auto-learn |

### System Characteristics

- **Single-Page Application**: Module switching without URL routing
- **Dark-First Design**: Emerald/teal/amber accent system, zero blue/indigo
- **AI-Native**: Every core workflow augmented or automated by AI
- **ASEAN-First**: Built for Southeast Asian market context (Malaysia, Indonesia, Thailand)
- **Multi-Agent**: 8 specialized AI agents with persistent memory
- **Bank-Grade**: DSCR calculations, lender review simulation, citation verification
- **Multi-Channel**: OpenClaw gateway for 20+ messaging platforms
- **Multi-Provider AI**: ZAI SDK / OpenAI / OpenRouter with automatic detection
- **Dual-Database**: Supabase PostgreSQL (primary) + Prisma SQLite (fallback)

---

## 2. High-Level Architecture

### 2.1 System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          GangNiaga AI OS v0.3.0                         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                       PRESENTATION LAYER                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │ Dashboard│  │ Business │  │Financials│  │  Idea Canvas     │  │  │
│  │  │  Module  │  │  Plans   │  │  Module  │  │    Module        │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │  Agents  │  │Workflows │  │  Memory  │  │  Plan Review     │  │  │
│  │  │  Module  │  │  Module  │  │  Module  │  │    Module        │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │ Reports  │  │Pitch Deck│  │Plan vs   │  │   Research       │  │  │
│  │  │  Module  │  │  Module  │  │ Actuals  │  │    Module        │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │  │
│  │  ┌──────────────────┐  ┌──────────────────────────────────────┐ │  │
│  │  │  AI Copilot (⌘K) │  │  OpenClaw Integration Module        │ │  │
│  │  └──────────────────┘  └──────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                    STATE LAYER (Zustand)                            │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │  │
│  │  │  UI     │ │  Data    │ │  Agent   │ │Financial │ │OpenClaw │ │  │
│  │  │  State  │ │  State   │ │  State   │ │  State   │ │  State  │ │  │
│  │  └─────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                          │  │
│  │  │ Skills   │ │ Gateway  │ │ Copilot  │                          │  │
│  │  │  State   │ │  State   │ │  State   │                          │  │
│  │  └──────────┘ └──────────┘ └──────────┘                          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │              API LAYER (Next.js — 41 routes, 5 categories)         │  │
│  │                                                                    │  │
│  │  ┌──── Core (9) ────────────────────────────────────────────────┐ │  │
│  │  │ /  /chat  /business-plan  /agents  /dashboard  /forecast    │ │  │
│  │  │ /reports  /idea-canvas  /plan-review  /pitch-deck           │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │  ┌──── Skills (4) ──────────────────────────────────────────────┐ │  │
│  │  │ /skills  /skills/[id]  /skills/execute  /skills/auto-learn  │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │  ┌──── AI Provider (8) ─────────────────────────────────────────┐ │  │
│  │  │ /ai/status  /ai/chat  /ai/vision  /ai/image  /ai/tts       │ │  │
│  │  │ /ai/asr  /ai/search  /ai/read                               │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │  ┌──── Gateway (6) ─────────────────────────────────────────────┐ │  │
│  │  │ /gateway/status  /gateway/config                            │ │  │
│  │  │ /gateway/telegram/setup  /gateway/telegram/webhook          │ │  │
│  │  │ /gateway/whatsapp/setup  /gateway/whatsapp/webhook          │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │  ┌──── OpenClaw (9) ────────────────────────────────────────────┐ │  │
│  │  │ /openclaw/gateway  /openclaw/channels  /openclaw/channels/[]│ │  │
│  │  │ /openclaw/plugins  /openclaw/delegates  /openclaw/webhooks  │ │  │
│  │  │ /openclaw/automation  /openclaw/soul  /openclaw/cli         │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │        AI/ML LAYER (Multi-Provider Adapter: 942 lines)             │  │
│  │                                                                    │  │
│  │  ┌──────────────┐  ┌───────────────┐  ┌───────────────────────┐  │  │
│  │  │ Z AI Gateway │  │   OpenAI      │  │    OpenRouter         │  │  │
│  │  │ (Dev/Sandbox)│  │ (Production)  │  │  (4-key round-robin)  │  │  │
│  │  └──────┬───────┘  └───────┬───────┘  └──────────┬────────────┘  │  │
│  │         └──────────────────┼──────────────────────┘               │  │
│  │                     ┌──────▼───────┐                               │  │
│  │                     │ AIProvider   │  Unified interface:           │  │
│  │                     │   Adapter    │  chat, vision, tts, asr,     │  │
│  │                     │  (942 lines) │  image-gen, web-search,      │  │
│  │                     └──────────────┘  page-reader                 │  │
│  │                                                                    │  │
│  │  ┌──────────────┐  ┌───────────────┐  ┌───────────────────────┐  │  │
│  │  │  SOUL.md     │  │ Skills Engine │  │  No-Op Provider       │  │  │
│  │  │ Personality  │  │ (execute,     │  │  (Graceful degrade)   │  │  │
│  │  │ System       │  │  auto-learn)  │  │                       │  │  │
│  │  └──────────────┘  └───────────────┘  └───────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │     DATA LAYER (Supabase PostgreSQL PRIMARY + Prisma SQLite FALLBACK) │
│  │                                                                    │  │
│  │  ┌─────────────────────────────┐  ┌──────────────────────────┐   │  │
│  │  │  Supabase PostgreSQL        │  │  Prisma SQLite            │   │  │
│  │  │  (PRIMARY — Vercel/Prod)    │  │  (FALLBACK — Local Dev)  │   │  │
│  │  │  REST API + RLS + JSONB     │  │  File-based + Prisma ORM  │   │  │
│  │  └────────────┬────────────────┘  └────────────┬─────────────┘   │  │
│  │               └──────────────┬──────────────────┘                 │  │
│  │                     ┌────────▼─────────┐                          │  │
│  │                     │  Dual-DB Client  │  27 models total:        │  │
│  │                     │  Supabase → Prisma│  16 original + 7 OpenClaw│  │
│  │                     │  (auto-fallback)  │  + Gateway + Skill +    │  │
│  │                     └──────────────────┘  MemoryV2 + ChatSession  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Architecture

```
┌──────────┐    User Action    ┌──────────────┐    State Update    ┌──────────┐
│          │ ────────────────▶ │              │ ─────────────────▶ │          │
│   User   │                   │  Zustand     │                    │  React   │
│Interface │ ◀──────────────── │  Store       │ ◀───────────────── │Component │
│          │    Re-render      │              │   Selectors        │          │
└──────────┘                   └──────┬───────┘                    └──────────┘
                                      │
                                      │ API Call (when AI/data needed)
                                      ▼
                               ┌──────────────┐
                               │  Next.js API  │
                               │    Route      │
                               └──────┬───────┘
                                      │
                    ┌─────────────────┼──────────────────┐
                    │                 │                  │
                    ▼                 ▼                  ▼
           ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
           │  AI Provider  │  │  Supabase    │  │  Prisma      │
           │   Adapter     │  │  PostgreSQL  │  │  SQLite      │
           │  (detect &    │  │  (PRIMARY)   │  │  (FALLBACK)  │
           │   route)      │  │              │  │              │
           └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                  │                 │                  │
       ┌──────────┼──────────┐     │                  │
       │          │          │     │                  │
       ▼          ▼          ▼     ▼                  ▼
  ┌─────────┐ ┌────────┐ ┌────────┐    ┌──────────────────────┐
  │ Z AI    │ │ OpenAI │ │OpenRtr│    │ Dual-DB Flow:         │
  │ Gateway │ │  API   │ │  API  │    │ 1. Try Supabase REST  │
  │(sandbox)│ │(prod)  │ │(prod) │    │ 2. Fallback to Prisma │
  └─────────┘ └────────┘ └────────┘    └──────────────────────┘
```

### 2.3 AI Provider Detection Flow

```
┌─────────────────────────────────────────────────────┐
│              AI Provider Detection                   │
│                                                      │
│  ┌──────────────┐                                    │
│  │ Is Vercel?   │──YES──▶ Skip ZAI ──────────────┐  │
│  │ (VERCEL=1)   │                                │  │
│  └──────┬───────┘                                │  │
│         │ NO                                      │  │
│         ▼                                         │  │
│  ┌──────────────┐                                 │  │
│  │ ZAI_BASE_URL │──YES──▶ Provider = 'zai'       │  │
│  │ or SDK found?│                                 │  │
│  └──────┬───────┘                                 │  │
│         │ NO                                      │  │
│         ▼                                         ▼  │
│  ┌──────────────┐                         ┌──────────┤
│  │OPENAI_API_KEY│──YES──▶ Provider = 'openai'      │ │
│  │ set?         │                                 │ │
│  └──────┬───────┘                                 │ │
│         │ NO                                      │ │
│         ▼                                         │ │
│  ┌──────────────┐                         ┌──────▼─▼┤
│  │OPENROUTER    │──YES──▶ Provider = 'openrouter'  │ │
│  │_KEY_1..4?    │                                 │ │
│  └──────┬───────┘                                 │ │
│         │ NO                                      │ │
│         ▼                                         ▼  │
│  Provider = 'none' (graceful degradation)           │
└─────────────────────────────────────────────────────┘
```

### 2.4 Module Communication Pattern

```
                    ┌─────────────────────┐
                    │   Zustand Store     │
                    │   (Single Source)   │
                    └─────────┬───────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │  Business   │   │  Financial  │   │    Plan     │
    │   Plans     │   │    Module   │   │   Review    │
    │  Module     │   │             │   │   Module    │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                  │                  │
           │    Plan Data     │   Forecast Data  │  Review Result
           │──────────────────│──────────────────│──────────▶
           │                  │                  │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │  Pitch Deck │   │Plan Actuals │   │  Idea       │
    │  Module     │   │  Module     │   │  Canvas     │
    └─────────────┘   └─────────────┘   └─────────────┘

    ┌──────────────────────────────────────────────────────┐
    │  OpenClaw Module ←→ Gateway APIs ←→ External Channels│
    │  (WhatsApp, Telegram, Discord, Slack, 20+ more)      │
    │                                                       │
    │  Skills Module ←→ Skills APIs ←→ AI Provider Adapter │
    │  (Market Analysis, Financial Forecast, Plan Review…)  │
    └──────────────────────────────────────────────────────┘

    Key: Modules share data through Zustand store, not direct communication.
         Business Plan data flows to Pitch Deck and Plan Review.
         Financial data flows to Plan Actuals and Forecasts.
         OpenClaw module manages multi-channel messaging via Gateway APIs.
         Skills module provides extensible AI capabilities via Skills APIs.
```

---

## 3. Technology Stack

### 3.1 Core Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | 16.x | Server rendering, API routes, routing |
| **Language** | TypeScript | 5.x | Type safety across the entire codebase |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS with design tokens |
| **UI Library** | shadcn/ui (New York) | Latest | 50+ accessible, composable components |
| **Database (Primary)** | Supabase PostgreSQL | - | Production database, REST API, RLS, JSONB |
| **Database (Fallback)** | Prisma ORM + SQLite | 6.x / 3.x | Local dev database, type-safe ORM |
| **State** | Zustand | 5.x | Client-side global state management |
| **AI (Multi-Provider)** | z-ai-web-dev-sdk / OpenAI / OpenRouter | 0.0.17+ / - / - | Multi-provider AI with automatic detection |

### 3.2 Supporting Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Recharts** | 2.15.x | Area, Bar, Pie, Composed, Line charts |
| **Framer Motion** | 12.x | Page transitions, micro-animations, layout |
| **React Hook Form** | 7.x | Form state management with validation |
| **Zod** | 4.x | Schema validation (forms, API payloads) |
| **Lucide React** | 0.525+ | 1,000+ consistent SVG icons |
| **next-themes** | 0.4.x | Dark/light mode with system detection |
| **cmdk** | 1.1.x | Command palette (⌘K) component |
| **react-markdown** | 10.x | Render AI-generated markdown content |
| **@dnd-kit** | 6.x | Drag-and-drop for slides, steps |
| **@tanstack/react-table** | 8.x | Headless table primitives |
| **@tanstack/react-query** | 5.x | Server state management (available) |
| **date-fns** | 4.x | Date formatting and manipulation |
| **sonner** | 2.x | Toast notifications |
| **vaul** | 1.1.x | Drawer component (mobile) |
| **sharp** | 0.34.x | Server-side image processing |
| **uuid** | 11.x | Unique ID generation |
| **next-auth** | 4.x | Authentication (available) |
| **@supabase/supabase-js** | 2.105+ | Supabase client (server + browser) |
| **pg** | 8.20+ | PostgreSQL driver for Prisma |

### 3.3 Key Library Files

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/ai-provider.ts` | 942 | Multi-provider AI adapter (ZAI/OpenAI/OpenRouter/NoOp) |
| `src/lib/gateway.ts` | 400 | Messaging gateway (SOUL.md, AI response, Telegram/WhatsApp helpers) |
| `src/lib/supabase.ts` | 82 | Supabase client (server + browser), health check |
| `src/lib/zai.ts` | 61 | ZAI wrapper + SOUL_PROMPT constant |
| `src/lib/store.ts` | ~900 | Zustand store (all state including OpenClaw, Skills, Gateway) |
| `src/lib/types.ts` | ~600 | TypeScript interfaces for 27+ data models |

### 3.4 Radix UI Primitives (via shadcn/ui)

The UI layer is built on 25+ Radix UI primitives providing WAI-ARIA compliant, keyboard-navigable components:

```
@radix-ui/react-accordion      @radix-ui/react-alert-dialog
@radix-ui/react-avatar         @radix-ui/react-checkbox
@radix-ui/react-collapsible    @radix-ui/react-context-menu
@radix-ui/react-dialog         @radix-ui/react-dropdown-menu
@radix-ui/react-hover-card     @radix-ui/react-label
@radix-ui/react-menubar        @radix-ui/react-navigation-menu
@radix-ui/react-popover        @radix-ui/react-progress
@radix-ui/react-radio-group    @radix-ui/react-scroll-area
@radix-ui/react-select         @radix-ui/react-separator
@radix-ui/react-slider         @radix-ui/react-slot
@radix-ui/react-switch         @radix-ui/react-tabs
@radix-ui/react-toast          @radix-ui/react-toggle
@radix-ui/react-tooltip
```

---

## 4. Project Structure

```
/home/z/my-project/
├── prisma/
│   ├── schema.prisma              # 27 database models (SQLite dev / PostgreSQL prod)
│   └── seed.ts                    # Database seed script
├── db/
│   └── custom.db                  # SQLite database file (local dev)
├── public/
│   ├── gangniaga-logo.png         # Brand logo (PNG)
│   ├── logo.svg                   # Brand logo (SVG)
│   └── robots.txt                 # SEO crawler rules
├── openclaw/                      # OpenClaw Gateway configuration
│   ├── openclaw.json              # Gateway config (bind, auth, channels, agents, plugins)
│   ├── plugin-manifest.json       # Plugin registry
│   ├── SOUL.md                    # AI personality definition (tone, language, rules)
│   ├── AGENTS.md                  # Multi-agent specialist lane definitions
│   └── README.md                  # OpenClaw documentation
├── skills/                        # Skills system (Hermes-inspired)
│   ├── agent-browser/             # Browser automation skill
│   ├── ASR/                       # Speech-to-text skill
│   ├── TTS/                       # Text-to-speech skill
│   ├── VLM/                       # Vision language model skill
│   ├── charts/                    # Chart generation skill
│   ├── content-strategy/          # Content strategy skill
│   ├── writing-plans/             # Business writing skill
│   ├── interview-designer/        # Interview design skill
│   ├── image-generation/          # Image generation skill
│   ├── web-search/                # Web search skill
│   ├── web-reader/                # Web page reader skill
│   ├── market-research-reports/   # Market research skill
│   ├── finance/                   # Financial data skill
│   ├── xlsx/                      # Spreadsheet skill
│   ├── pdf/                       # PDF generation skill
│   ├── ppt/                       # Presentation skill
│   ├── docx/                      # Document skill
│   ├── fullstack-dev/             # Full-stack development skill
│   ├── skill-creator/             # Meta: create new skills
│   ├── skill-vetter/              # Meta: vet skills for security
│   ├── ui-ux-pro-max/            # UI/UX design skill
│   ├── video-understand/          # Video understanding skill
│   └── ... (30+ more skills)
├── scripts/
│   └── setup-vercel.sh            # Vercel database setup script
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout: ThemeProvider, fonts, Toaster
│   │   ├── page.tsx               # SPA entry: sidebar + header + module switcher
│   │   ├── globals.css            # Tailwind v4 + CSS custom properties
│   │   └── api/
│   │       ├── route.ts           # Health check / base API
│   │       │
│   │       │── Core APIs (9) ──────────────────────────────────
│   │       ├── chat/route.ts      # AI Copilot (LLM chat completions)
│   │       ├── business-plan/route.ts  # 21-section proposal generation
│   │       ├── agents/route.ts    # Agent CRUD operations
│   │       ├── dashboard/route.ts # Dashboard data aggregation
│   │       ├── forecast/route.ts  # Financial forecasting & analysis
│   │       ├── reports/route.ts   # Report generation
│   │       ├── idea-canvas/route.ts   # Idea validation engine
│   │       ├── plan-review/route.ts   # Lender-perspective review
│   │       ├── pitch-deck/route.ts    # Slide deck generation
│   │       │
│   │       │── Skills APIs (4) ────────────────────────────────
│   │       ├── skills/route.ts              # List all skills
│   │       ├── skills/[id]/route.ts         # Get skill by ID
│   │       ├── skills/execute/route.ts      # Execute a skill
│   │       └── skills/auto-learn/route.ts   # Auto-learn from conversations
│   │       │
│   │       │── AI Provider APIs (8) ──────────────────────────
│   │       ├── ai/status/route.ts   # AI provider status & capabilities
│   │       ├── ai/chat/route.ts     # LLM chat (multi-provider)
│   │       ├── ai/vision/route.ts   # Vision / image understanding
│   │       ├── ai/image/route.ts    # Image generation
│   │       ├── ai/tts/route.ts      # Text-to-speech
│   │       ├── ai/asr/route.ts      # Speech-to-text (ASR)
│   │       ├── ai/search/route.ts   # Web search
│   │       └── ai/read/route.ts     # Web page reader
│   │       │
│   │       │── Gateway APIs (6) ──────────────────────────────
│   │       ├── gateway/status/route.ts           # Gateway health status
│   │       ├── gateway/config/route.ts           # Gateway configuration
│   │       ├── gateway/telegram/setup/route.ts   # Telegram bot setup
│   │       ├── gateway/telegram/webhook/route.ts # Telegram webhook handler
│   │       ├── gateway/whatsapp/setup/route.ts   # WhatsApp Business setup
│   │       └── gateway/whatsapp/webhook/route.ts # WhatsApp webhook handler
│   │       │
│   │       │── OpenClaw APIs (9) ─────────────────────────────
│   │       ├── openclaw/gateway/route.ts         # Gateway management
│   │       ├── openclaw/channels/route.ts        # Channel list/create
│   │       ├── openclaw/channels/[id]/route.ts   # Channel CRUD
│   │       ├── openclaw/plugins/route.ts         # Plugin management
│   │       ├── openclaw/delegates/route.ts       # Delegate management
│   │       ├── openclaw/webhooks/route.ts        # Webhook management
│   │       ├── openclaw/automation/route.ts      # Scheduled tasks
│   │       ├── openclaw/soul/route.ts            # SOUL.md personality config
│   │       └── openclaw/cli/route.ts             # CLI command execution
│   │       │
│   │       └── sessions/route.ts      # Chat sessions list
│   │           sessions/[id]/route.ts # Chat session detail
│   │           memory/route.ts        # Agent memory V2
│   │           setup/route.ts         # Initial setup
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx        # Collapsible sidebar w/ grouped navigation
│   │   │   ├── header.tsx         # Top bar: search, notifications, profile
│   │   │   └── command-palette.tsx # ⌘K: search modules, actions, recent
│   │   ├── modules/
│   │   │   ├── dashboard.tsx      # KPI cards, revenue/expense charts
│   │   │   ├── business-plans.tsx # 21-section proposal builder
│   │   │   ├── financials.tsx     # Forecasting, DSCR, burn rate
│   │   │   ├── agents.tsx         # 8-agent console, task tracking
│   │   │   ├── workflows.tsx      # Multi-step automation builder
│   │   │   ├── memory.tsx         # Persistent AI memory browser
│   │   │   ├── reports.tsx        # Report generation & management
│   │   │   ├── settings.tsx       # Org settings, integrations, preferences
│   │   │   ├── idea-canvas.tsx    # 5-dimension validation canvas
│   │   │   ├── plan-review.tsx    # Lender review simulation
│   │   │   ├── pitch-deck.tsx     # AI slide deck generator
│   │   │   ├── plan-actuals.tsx   # Plan vs actuals with variance alerts
│   │   │   ├── research.tsx       # Citation-verified research
│   │   │   ├── openclaw.tsx       # OpenClaw: gateway, channels, plugins, delegates
│   │   │   └── copilot.tsx        # AI chat side panel (skills, memory, voice)
│   │   └── ui/                    # 50+ shadcn/ui components
│   │       ├── accordion.tsx      ├── alert-dialog.tsx
│   │       ├── alert.tsx          ├── aspect-ratio.tsx
│   │       ├── avatar.tsx         ├── badge.tsx
│   │       ├── breadcrumb.tsx     ├── button.tsx
│   │       ├── calendar.tsx       ├── card.tsx
│   │       ├── carousel.tsx       ├── chart.tsx
│   │       ├── checkbox.tsx       ├── collapsible.tsx
│   │       ├── command.tsx        ├── context-menu.tsx
│   │       ├── dialog.tsx         ├── drawer.tsx
│   │       ├── dropdown-menu.tsx  ├── form.tsx
│   │       ├── hover-card.tsx     ├── input-otp.tsx
│   │       ├── input.tsx          ├── label.tsx
│   │       ├── menubar.tsx        ├── navigation-menu.tsx
│   │       ├── pagination.tsx     ├── popover.tsx
│   │       ├── progress.tsx       ├── radio-group.tsx
│   │       ├── resizable.tsx      ├── scroll-area.tsx
│   │       ├── select.tsx         ├── separator.tsx
│   │       ├── sheet.tsx          ├── sidebar.tsx
│   │       ├── skeleton.tsx       ├── slider.tsx
│   │       ├── sonner.tsx         ├── switch.tsx
│   │       ├── table.tsx          ├── tabs.tsx
│   │       ├── textarea.tsx       ├── toast.tsx
│   │       ├── toaster.tsx        ├── toggle-group.tsx
│   │       ├── toggle.tsx         └── tooltip.tsx
│   ├── lib/
│   │   ├── store.ts              # Zustand store (all state including OpenClaw)
│   │   ├── types.ts              # TypeScript interfaces & type unions
│   │   ├── utils.ts              # cn(), formatCurrency, helpers
│   │   ├── db.ts                 # Prisma client singleton
│   │   ├── ai-provider.ts        # Multi-provider AI adapter (942 lines)
│   │   ├── supabase.ts           # Supabase client (server + browser)
│   │   ├── gateway.ts            # Messaging gateway (400 lines)
│   │   └── zai.ts                # ZAI wrapper + SOUL_PROMPT constant
│   ├── hooks/
│   │   ├── use-mobile.ts         # Responsive breakpoint detection
│   │   └── use-toast.ts          # Toast notification hook
│   └── scripts/
│       └── seed-skills.ts         # Seed default skills into database
├── supabase-schema.sql            # Full PostgreSQL schema (27 tables + RLS + indexes)
├── Caddyfile                     # Reverse proxy / gateway config
├── vercel.json                   # Vercel deployment config (sin1 region)
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS v4 config
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS for Tailwind
├── eslint.config.mjs             # ESLint configuration
└── components.json               # shadcn/ui component registry
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
<RootLayout>                          ← ThemeProvider, fonts, Toaster
  └─ <GangNiagaAIOS>                 ← Main SPA shell
       ├─ <Sidebar>                   ← Collapsible navigation
       │    ├─ Logo + Brand
       │    ├─ NavGroup("Core")
       │    │    ├─ NavItem(Dashboard)
       │    │    ├─ NavItem(Business Plans)
       │    │    └─ NavItem(Financials)
       │    ├─ NavGroup("AI Engine")
       │    │    ├─ NavItem(Agents)
       │    │    ├─ NavItem(Workflows)
       │    │    └─ NavItem(Memory)
       │    ├─ NavGroup("Intelligence")
       │    │    ├─ NavItem(Idea Canvas)
       │    │    ├─ NavItem(Plan Review)
       │    │    ├─ NavItem(Research)
       │    │    └─ NavItem(Pitch Deck)
       │    ├─ NavGroup("Channels")
       │    │    └─ NavItem(OpenClaw)
       │    └─ NavGroup("Operations")
       │         ├─ NavItem(Reports)
       │         ├─ NavItem(Plan Actuals)
       │         └─ NavItem(Settings)
       │
       ├─ <Header>                    ← Top bar
       │    ├─ SearchTrigger(⌘K)
       │    ├─ NotificationBell
       │    └─ UserProfile
       │
       ├─ <main>                      ← Module container
       │    └─ <AnimatePresence>
       │         └─ <motion.div>
       │              └─ <ActiveModule />   ← Dynamic module switch
       │
       ├─ <CopilotPanel>              ← AI chat (slide-in, skills, memory, voice)
       │
       └─ <CommandPalette>            ← ⌘K overlay
            ├─ SearchInput
            ├─ ModuleItems
            ├─ ActionItems
            └─ RecentItems
```

### 5.2 Module Component Pattern

Each module follows a consistent internal architecture:

```typescript
// Module Pattern (e.g., business-plans.tsx)

'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// ... more UI imports

export default function BusinessPlansModule() {
  // 1. State from Zustand
  const { plans, selectedPlan, setSelectedPlan, updatePlan } = useAppStore();
  
  // 2. Local UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // 3. AI operations (via multi-provider adapter)
  const generateSection = async (section: string) => { ... };
  
  // 4. Render with consistent Card layout
  return (
    <div className="p-6 space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between">
        <h1>Business Plans</h1>
        <Button>Create New Plan</Button>
      </div>
      
      {/* Content Area */}
      <div className="grid gap-6">
        {/* Cards, Tables, Forms */}
      </div>
    </div>
  );
}
```

### 5.3 UI Component Catalog

| Category | Components | Usage |
|----------|-----------|-------|
| **Layout** | Card, Separator, ScrollArea, ResizablePanels | Page structure, sections |
| **Navigation** | Sidebar, Tabs, Breadcrumb, Menubar, NavigationMenu | Module switching, tab panels |
| **Data Display** | Table, Badge, Avatar, Progress, Chart | KPIs, agent lists, charts |
| **Forms** | Input, Select, Textarea, Checkbox, RadioGroup, Switch, Slider | Data entry, settings |
| **Feedback** | Dialog, AlertDialog, Toast, Sonner, Tooltip, HoverCard | Confirmations, notifications |
| **Overlay** | Sheet, Drawer, Popover, DropdownMenu, Command | Panels, menus, palette |
| **Actions** | Button, Toggle, ToggleGroup | Primary actions |
| **Loading** | Skeleton | Placeholder states |
| **Date** | Calendar, DatePicker (via Popover + Calendar) | Date selection |

### 5.4 Animation Architecture

Framer Motion is used consistently across the application:

```typescript
// Page transitions (in page.tsx)
<AnimatePresence mode="wait">
  <motion.div
    key={activeModule}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
  >
    <ActiveModule />
  </motion.div>
</AnimatePresence>

// Copilot panel slide-in
<AnimatePresence>
  {copilotOpen && <CopilotPanel />}
</AnimatePresence>

// Card hover effects (in module components)
<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  <Card>...</Card>
</motion.div>
```

---

## 6. State Management Architecture

### 6.1 Zustand Store Design

The application uses a **single Zustand store** as the single source of truth. The store is organized into logical domains:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AppState (Zustand)                          │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │   UI State      │  │   Chat State    │  │   Agent State       │ │
│  │  ├─ activeModule│  │  ├─ chatMessages │  │  ├─ agents          │ │
│  │  ├─ sidebarCol  │  │  ├─ chatLoading │  │  ├─ agentTasks      │ │
│  │  └─ copilotOpen │  │  └─ clearChat   │  │  └─ selected        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘ │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │  Dashboard      │  │  Plans State    │  │  Idea Canvas        │ │
│  │  ├─ kpis        │  │  ├─ plans       │  │  ├─ ideaCanvas      │ │
│  │  ├─ revenueData │  │  ├─ selectedPlan│  │  ├─ selected        │ │
│  │  └─ expenseData │  │  ├─ updatePlan  │  │  └─ validate        │ │
│  └─────────────────┘  │  └─ deletePlan  │  └─────────────────────┘ │
│                       └─────────────────┘                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │  Forecast       │  │  Workflow       │  │  Plan Review        │ │
│  │  ├─ forecastData│  │  ├─ workflows   │  │  ├─ reviews         │ │
│  │  └─ assumptions │  │  ├─ addWorkflow │  │  ├─ selected        │ │
│  └─────────────────┘  │  └─ updateWF    │  │  └─ addReview       │ │
│                       └─────────────────┘  └─────────────────────┘ │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │  Memory         │  │  Reports        │  │  Plan Actuals       │ │
│  │  ├─ memories    │  │  ├─ reports     │  │  ├─ planActuals     │ │
│  │  └─ categories  │  │  ├─ addReport   │  │  ├─ integrations    │ │
│  └─────────────────┘  │  └─ updateReport│  │  ├─ alerts          │ │
│                       └─────────────────┘  │  └─ variance         │ │
│  ┌─────────────────┐  ┌─────────────────┐  └─────────────────────┘ │
│  │  Pitch Deck     │  │  Citations      │                           │
│  │  ├─ pitchDecks  │  │  ├─ citations   │                           │
│  │  ├─ selectedDeck│  │  └─ verified    │                           │
│  │  └─ updateDeck  │  └─────────────────┘                           │
│  └─────────────────┘                                                │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  OpenClaw State                                                 ││
│  │  ├─ openclawGateway     (status, bindHost, uptime, config)      ││
│  │  ├─ openclawChannels    (WhatsApp, Telegram, 20+ types)         ││
│  │  ├─ openclawPlugins     (installed, enabled, capabilities)      ││
│  │  ├─ openclawDelegates   (tier1-3, standing orders)              ││
│  │  ├─ openclawWebhooks    (events, URLs, secrets)                 ││
│  │  ├─ openclawScheduledTasks (cron, agents, channels)             ││
│  │  ├─ openclawSessions    (active conversations)                  ││
│  │  └─ openclawSoul        (personality, tone, language, rules)    ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌────────────────────────────┐  ┌─────────────────────────────────┐│
│  │  Skills State              │  │  Copilot State                  ││
│  │  (loaded from /api/skills) │  │  ├─ copilotSkills              ││
│  │                            │  │  ├─ copilotMemories            ││
│  │                            │  │  ├─ voiceRecording             ││
│  │                            │  │  └─ copilotInitialized         ││
│  └────────────────────────────┘  └─────────────────────────────────┘│
│                                                                      │
│  ┌────────────────────────────┐                                      │
│  │  Gateway State             │                                      │
│  │  (gatewayApiStatus,        │                                      │
│  │   telegramSetup,           │                                      │
│  │   whatsappSetup)           │                                      │
│  └────────────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 State Operations Pattern

```typescript
// Read pattern — useAppStore with selectors
const plans = useAppStore((s) => s.plans);
const activeModule = useAppStore((s) => s.activeModule);
const openclawChannels = useAppStore((s) => s.openclawChannels);

// Write pattern — actions defined inline in store
updatePlan: (id, updates) => set((s) => ({
  plans: s.plans.map((p) => p.id === id 
    ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } 
    : p
  ),
})),

// OpenClaw pattern — full CRUD for channels, plugins, delegates, etc.
addOpenClawChannel: (channel) => set((s) => ({
  openclawChannels: [...s.openclawChannels, channel],
})),
updateOpenClawChannel: (id, updates) => set((s) => ({
  openclawChannels: s.openclawChannels.map((c) => 
    c.id === id ? { ...c, ...updates } : c
  ),
})),
removeOpenClawChannel: (id) => set((s) => ({
  openclawChannels: s.openclawChannels.filter((c) => c.id !== id),
})),

// Connected model pattern — cascading updates
updateFinancialAssumption: (key, value) => set((s) => {
  const updatedKpis = s.kpis.map((kpi) => {
    if (kpi.metric.toLowerCase().includes(key.toLowerCase())) {
      return {
        ...kpi,
        value,
        change: ((value - kpi.previousValue) / kpi.previousValue) * 100,
        trend: (value > kpi.previousValue ? 'up' : 'down') as const,
      };
    }
    return kpi;
  });
  return { kpis: updatedKpis };
}),
```

### 6.3 State vs. Server Data

| Data Type | Storage | Rationale |
|-----------|---------|-----------|
| UI state (active module, sidebar) | Zustand | Ephemeral, client-only |
| Mock/demoware data | Zustand | Pre-populated for demonstration |
| AI-generated content | Zustand + DB | Persisted via Prisma/Supabase |
| User preferences | Zustand → DB | Currently in-memory, migrating to DB |
| Chat history | Zustand + DB | In-memory with 8-message window + ChatSession model |
| Financial models | Zustand | Connected model with cascading updates |
| Agent/task state | Zustand + DB | In-memory with AgentSession/AgentTask models |
| OpenClaw channels/config | Zustand + DB | Persisted in OpenClaw* models via Prisma |
| Gateway conversations | DB only | GatewayConversation model (Prisma) |
| Skills | DB + API | Skill model (Prisma), loaded via /api/skills |
| Agent memory V2 | DB only | AgentMemoryV2 model (importance-scored) |

> **Note**: The current implementation uses Zustand with mock data for rapid prototyping, while the database layer is actively connected for OpenClaw, Skills, and Gateway features. Migration path: Zustand → Zustand + Prisma/Supabase (hybrid) → TanStack Query + Supabase (full).

---

## 7. API Architecture

### 7.1 API Route Map (41 routes across 5 categories)

```
/api
│
├── Core APIs (9 routes) ──────────────────────────────────────
│   ├── GET  /                    → Health check
│   ├── POST /chat                → AI Copilot conversation
│   ├── POST /business-plan       → Generate proposal section
│   ├── GET  /agents              → List agents
│   ├── POST /agents              → Create agent
│   ├── GET  /dashboard           → Dashboard aggregated data
│   ├── POST /forecast            → Financial forecast analysis
│   ├── GET  /reports             → List reports
│   ├── POST /reports             → Generate report
│   ├── POST /idea-canvas         → Validate business idea
│   ├── POST /plan-review         → Run lender review simulation
│   └── POST /pitch-deck          → Generate pitch deck slides
│
├── Skills APIs (4 routes) ────────────────────────────────────
│   ├── GET  /skills              → List all skills
│   ├── GET  /skills/[id]         → Get skill by ID
│   ├── POST /skills/execute      → Execute a skill (slug + input)
│   └── POST /skills/auto-learn   → Auto-learn from conversations
│
├── AI Provider APIs (8 routes) ───────────────────────────────
│   ├── GET  /ai/status           → Provider type, capabilities, config
│   ├── POST /ai/chat             → LLM chat completion (multi-provider)
│   ├── POST /ai/vision           → Vision / image understanding
│   ├── POST /ai/image            → Image generation
│   ├── POST /ai/tts              → Text-to-speech
│   ├── POST /ai/asr              → Speech-to-text (ASR)
│   ├── POST /ai/search           → Web search
│   └── POST /ai/read             → Web page reader
│
├── Gateway APIs (6 routes) ───────────────────────────────────
│   ├── GET  /gateway/status      → Gateway health + channel status
│   ├── GET  /gateway/config      → Gateway configuration
│   ├── POST /gateway/telegram/setup    → Setup Telegram bot (webhook)
│   ├── POST /gateway/telegram/webhook  → Handle Telegram messages
│   ├── POST /gateway/whatsapp/setup    → Setup WhatsApp Business
│   └── POST /gateway/whatsapp/webhook  → Handle WhatsApp messages
│
├── OpenClaw APIs (9 routes) ──────────────────────────────────
│   ├── GET  /openclaw/gateway          → Gateway management
│   ├── GET  /openclaw/channels         → List channels
│   ├── POST /openclaw/channels         → Create channel
│   ├── GET  /openclaw/channels/[id]    → Get channel by ID
│   ├── PATCH /openclaw/channels/[id]   → Update channel
│   ├── GET  /openclaw/plugins          → Plugin management
│   ├── GET  /openclaw/delegates        → Delegate management
│   ├── GET  /openclaw/webhooks         → Webhook management
│   ├── POST /openclaw/automation       → Scheduled task management
│   ├── GET  /openclaw/soul             → SOUL.md personality config
│   └── POST /openclaw/cli              → CLI command execution
│
├── Additional APIs ───────────────────────────────────────────
│   ├── GET  /sessions             → List chat sessions
│   ├── GET  /sessions/[id]        → Get chat session
│   ├── GET  /memory               → Agent memory V2
│   └── POST /setup                → Initial setup
```

### 7.2 API Route Implementation Pattern

Each API route follows a consistent pattern using the **multi-provider AI adapter**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAI } from '@/lib/ai-provider';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await request.json();
    if (!body.requiredField) {
      return NextResponse.json({ error: 'Missing field' }, { status: 400 });
    }

    // 2. Get AI provider (auto-detected: ZAI / OpenAI / OpenRouter)
    const ai = await getAI();

    // 3. Build context-aware prompts (with SOUL.md personality)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    // 4. Call LLM via unified interface
    const completion = await ai.chat.completions.create({
      messages,
      model: process.env.DEFAULT_MODEL || 'openrouter/owl-alpha',
    });

    // 5. Extract and return response
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No content' }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### 7.3 AI Provider Status API

The `/api/ai/status` endpoint provides runtime introspection:

```typescript
// GET /api/ai/status response
{
  provider: 'zai' | 'openai' | 'openrouter' | 'none',
  description: 'Z AI SDK (Development/Sandbox Mode)',
  capabilities: {
    chat: true,
    imageGeneration: true,
    textToSpeech: true,
    speechToText: true,
    webSearch: true,
    vision: true,
  },
  capabilityCount: 6,
  isConfigured: true,
  setupInstructions: null  // or instructions if provider = 'none'
}
```

### 7.4 AI Prompt Architecture

The business plan API uses a **two-tier prompt system**:

```
┌─────────────────────────────────────────────────────────┐
│               PROMPT ARCHITECTURE                        │
│                                                          │
│  Tier 1: Proposal Type Context                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ bank_loan: "Emphasize DSCR, collateral,        │    │
│  │            repayment capacity, financial         │    │
│  │            prudence. Conservative projections." │    │
│  │                                                   │    │
│  │ venture_capital: "Emphasize TAM/SAM/SOM,       │    │
│  │            growth velocity, scalability,         │    │
│  │            technology moat, 10x potential."      │    │
│  │                                                   │    │
│  │ government_grant: "Emphasize social impact,     │    │
│  │            Bumiputera empowerment, job creation, │    │
│  │            innovation, national alignment."      │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                               │
│                          ▼                               │
│  Tier 2: Section-Specific Prompts                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │ executiveSummary: "Most critical section —       │    │
│  │   investors decide in 2-5 minutes. Include:     │    │
│  │   core problem, solution, opportunity,          │    │
│  │   advantage, financial highlights, the ask."    │    │
│  │                                                   │    │
│  │ financialForecast: "CRITICAL for bank loans.    │    │
│  │   Include 3-year projections, DSCR calculation, │    │
│  │   break-even timeline, burn rate, runway."      │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                               │
│                          ▼                               │
│  Output: Markdown-formatted, data-rich section content   │
└─────────────────────────────────────────────────────────┘
```

### 7.5 Chat API Architecture

The Copilot uses a **sliding window conversation** pattern with SOUL.md personality:

```typescript
// Message history limited to last 8 messages for context efficiency
const messages = [
  { role: 'assistant', content: SOUL_PROMPT },  // SOUL.md personality (always included)
  ...history.slice(-8),                            // Sliding window
  { role: 'user', content: message },              // Current message
];
```

The system prompt includes GangNiaga's business context (MRR, ARR, burn rate, runway, churn, growth rate) and the SOUL.md personality (tone, language, specialty, rules) so the AI can provide contextual responses without querying external data.

### 7.6 Gateway API Flow

```
┌──────────────┐     Webhook      ┌──────────────────┐     AI Response    ┌──────────────┐
│  Telegram /  │ ──────────────▶  │  /api/gateway/   │ ────────────────▶ │  Telegram /  │
│  WhatsApp    │     POST         │  {platform}/      │     Send message  │  WhatsApp    │
│  Platform    │                  │  webhook          │                   │  Platform    │
└──────────────┘                  └────────┬─────────┘                   └──────────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │  gateway.ts       │
                                  │  ├─ getSoulPrompt │
                                  │  ├─ getAIResponse │
                                  │  ├─ storeMessage  │
                                  │  └─ sendReply     │
                                  └──────────────────┘
```

---

## 8. Database Architecture

### 8.1 Dual-Database Pattern

```
┌────────────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                                │
│                                                                     │
│   ┌────────────────────┐     Fallback     ┌────────────────────┐  │
│   │  Supabase          │ ───────────────▶ │  Prisma SQLite     │  │
│   │  PostgreSQL        │    (if unavailable│  (Local Dev)       │  │
│   │  (PRIMARY)         │     or no config) │                    │  │
│   │                    │                   │                    │  │
│   │  • REST API        │                   │  • Prisma ORM      │  │
│   │  • Row Level Sec.  │                   │  • Type-safe       │  │
│   │  • JSONB columns   │                   │  • File-based      │  │
│   │  • Vercel compat.  │                   │  • Zero config     │  │
│   │  • Real-time subs  │                   │  • Offline first   │  │
│   └────────────────────┘                   └────────────────────┘  │
│                                                                     │
│   Schema: supabase-schema.sql (idempotent SQL)                     │
│   Schema: prisma/schema.prisma (27 models)                         │
└────────────────────────────────────────────────────────────────────┘
```

### 8.2 Entity-Relationship Diagram (27 Models)

```
┌─────────────┐        ┌──────────────────┐
│    User     │───┐    │   Organization   │
│─────────────│   │    │──────────────────│
│ id (CUID)   │   │    │ id (CUID)        │
│ email       │   │    │ name             │
│ name        │   │    │ slug (unique)    │
│ avatar      │   │    │ industry         │
│ role        │   │    │ size / country   │
│ orgId (FK) ─┼───┘    │                  │
└─────────────┘        └────────┬─────────┘
                                │
       ┌────────────┬───────────┼───────────┬────────────┐
       │            │           │           │            │
       ▼            ▼           ▼           ▼            ▼
┌────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐
│BusinessPlan│ │Forecast │ │AgentSess│ │Workflow │ │  KPIData │
│────────────│ │─────────│ │─────────│ │  Run    │ │──────────│
│title       │ │name     │ │name     │ │─────────│ │metric    │
│status      │ │type     │ │type     │ │name     │ │value     │
│sections... │ │period   │ │status   │ │status   │ │period    │
│orgId (FK)  │ │data     │ │tasksCom │ │trigger  │ │target    │
└────────────┘ │orgId FK │ │orgId FK │ │orgId FK │ │orgId FK  │
               └─────────┘ └────┬────┘ └─────────┘ └──────────┘
                                 │
                                 ▼
                          ┌────────────┐
                          │ AgentTask  │
                          │────────────│
                          │sessionId FK│
                          │type/status │
                          │input/output│
                          └────────────┘

       ┌────────────┬───────────┬───────────┬────────────┐
       │            │           │           │            │
       ▼            ▼           ▼           ▼            ▼
┌────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐
│IdeaCanvas  │ │PlanReview│ │PlanActual│ │PitchDeck│ │ Citation │
│────────────│ │─────────│ │─────────│ │─────────│ │──────────│
│title       │ │planId   │ │category │ │title    │ │source    │
│status      │ │lenderPer│ │period   │ │template │ │type      │
│validation  │ │scores   │ │planned  │ │slides   │ │geography │
│report      │ │discrepan│ │actual   │ │questions│ │verified  │
│orgId (FK)  │ │orgId FK │ │variance │ │orgId FK │ │orgId FK  │
└────────────┘ └─────────┘ └─────────┘ └─────────┘ └──────────┘

┌──────────┐  ┌──────────┐  ┌──────────────┐
│  Report  │  │Integratn │  │ AgentMemory  │  (Legacy)
│──────────│  │──────────│  │──────────────│
│title/type│  │type      │  │type/category │
│content   │  │status    │  │content       │
│format    │  │lastSync  │  │embedding     │
│orgId FK  │  │orgId FK  │  │orgId FK      │
└──────────┘  └──────────┘  └──────────────┘

── OpenClaw Models (7) ──────────────────────────────────────────────

┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│OpenClawChannel │  │ OpenClawGateway  │  │ OpenClawPlugin   │
│────────────────│  │──────────────────│  │──────────────────│
│type (20+ ch.)  │  │status/bindHost   │  │name/version      │
│name/status     │  │bindPort/uptime   │  │capabilities      │
│config (JSON)   │  │connectedClients  │  │status/source     │
│messageCount    │  │totalMessages     │  │config (JSON)     │
│orgId (FK)      │  │config (JSON)     │  │orgId (FK)        │
└────────────────┘  │orgId (FK)        │  └──────────────────┘
                    └──────────────────┘
┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│OpenClawDelegate│  │ OpenClawWebhook  │  │OpenClawScheduled │
│────────────────│  │──────────────────│  │     Task         │
│name/email      │  │name/url/method   │  │──────────────────│
│tier (1-3)      │  │events (JSON)     │  │name/cronExpressn │
│standingOrders  │  │status/secret     │  │status/agentId    │
│tasksCompleted  │  │triggerCount      │  │prompt/channel    │
│orgId (FK)      │  │orgId (FK)        │  │orgId (FK)        │
└────────────────┘  └──────────────────┘  └──────────────────┘
                                          ┌──────────────────┐
                                          │OpenClawSoulConfig│
                                          │──────────────────│
                                          │personality/tone  │
                                          │language/specialty│
                                          │greeting/rules    │
                                          │orgId (FK)        │
                                          └──────────────────┘

── Gateway Model ────────────────────────────────────────────────────

┌────────────────────┐
│GatewayConversation │
│────────────────────│
│platform            │
│platformUserId      │
│direction (in/out)  │
│messageType         │
│content             │
│metadata (JSON)     │
│orgId (FK)          │
└────────────────────┘

── Hermes-Inspired Models (3) ───────────────────────────────────────

┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    Skill     │  │  AgentMemoryV2   │  │   ChatSession    │
│──────────────│  │──────────────────│  │──────────────────│
│name/slug     │  │type/key          │  │title/platform    │
│description   │  │content           │  │messages (JSON)   │
│category      │  │importance (1-10) │  │memorySnapshot    │
│content (MD)  │  │charLimit         │  │soulSnapshot      │
│triggerPhrase │  │sessionId         │  │skillsUsed        │
│autoLearn     │  │orgId (FK)        │  │status            │
│orgId (FK)    │  └──────────────────┘  │orgId (FK)        │
└──────────────┘                        └──────────────────┘
```

### 8.3 Model Summary (27 Total)

| Category | Count | Models |
|----------|-------|--------|
| **Core Business** | 16 | User, Organization, BusinessPlan, Forecast, AgentSession, AgentTask, AgentMemory, WorkflowRun, KPIData, Report, IdeaCanvas, PlanReview, PlanActual, PitchDeck, Citation, Integration |
| **OpenClaw** | 7 | OpenClawChannel, OpenClawGateway, OpenClawPlugin, OpenClawDelegate, OpenClawWebhook, OpenClawScheduledTask, OpenClawSoulConfig |
| **Gateway** | 1 | GatewayConversation |
| **Skills** | 1 | Skill |
| **Memory** | 1 | AgentMemoryV2 |
| **Chat** | 1 | ChatSession |
| **Total** | **27** | |

### 8.4 Database Configuration

| Environment | Database | Provider | Connection |
|-------------|----------|----------|------------|
| Local Dev | SQLite | Prisma | `file:./db/custom.db` |
| Vercel/Prod | Supabase PostgreSQL | Supabase REST API | `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` |
| Fallback | PostgreSQL | Prisma | `DATABASE_URL` (postgresql://...) |

### 8.5 Supabase Schema

The `supabase-schema.sql` file provides the complete PostgreSQL schema with:
- 27 tables with `IF NOT EXISTS` (idempotent)
- JSONB columns for flexible data (replacing SQLite's JSON strings)
- Row Level Security (RLS) enabled on all tables
- Performance indexes on organization_id and frequently queried columns
- Seed data for default organization and 5 bundled skills

---

## 9. AI/ML Architecture

### 9.1 Multi-Provider Adapter Pattern

The AI layer uses a **provider adapter pattern** (942 lines in `ai-provider.ts`) that auto-detects the appropriate AI provider based on the runtime environment:

```
┌───────────────────────────────────────────────────────────────┐
│                    AIProvider Interface                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  chat.completions.create(body)                          │ │
│  │  chat.completions.createVision(body)                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  audio.tts.create(body)      →  Audio speech synthesis   │ │
│  │  audio.asr.create(body)      →  Audio transcription      │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  images.generations.create(body)  →  Image generation    │ │
│  │  images.generations.edit(body)    →  Image editing       │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  functions.invoke('web_search', { query })               │ │
│  │  functions.invoke('page_reader', { url })                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────┐ │
│  │  ZAI SDK   │  │  OpenAI    │  │ OpenRouter │  │ No-Op   │ │
│  │  Provider  │  │  Provider  │  │  Provider  │  │ Provider│ │
│  │  (dev)     │  │  (prod)    │  │ (prod)     │  │ (grace) │ │
│  └────────────┘  └────────────┘  └────────────┘  └─────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### 9.2 Provider Detection and Fallback Chain

```
┌─────────────────────────────────────────────────────────────┐
│                  Provider Detection Logic                     │
│                                                              │
│  1. Is VERCEL=1? ──YES──▶ Skip ZAI (internal IP only)      │
│  2. ZAI_BASE_URL set or SDK importable? ──YES──▶ 'zai'     │
│  3. OPENAI_API_KEY set? ──YES──▶ 'openai'                  │
│  4. OPENROUTER_API_KEY_1..4 set? ──YES──▶ 'openrouter'     │
│  5. None matched ──▶ 'none' (graceful degradation)         │
│                                                              │
│  Each provider implements the full AIProvider interface:     │
│  • chat.completions.create / createVision                   │
│  • audio.tts.create / audio.asr.create                      │
│  • images.generations.create / edit                         │
│  • functions.invoke (web_search, page_reader)               │
│                                                              │
│  Provider-specific adaptations:                              │
│  • ZAI: Native SDK (thinking param, base64 images)          │
│  • OpenAI: Strips ZAI-specific fields, maps response fmt    │
│  • OpenRouter: Round-robin 4 keys, chat-based web search    │
│  • No-Op: Throws helpful setup instructions                 │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 OpenRouter Round-Robin (4 Keys)

```typescript
// OpenRouter supports up to 4 API keys for load balancing
const keys = [
  process.env.OPENROUTER_API_KEY_1,
  process.env.OPENROUTER_API_KEY_2,
  process.env.OPENROUTER_API_KEY_3,
  process.env.OPENROUTER_API_KEY_4,
].filter(Boolean);

let keyIndex = 0;
function getNextApiKey(): string {
  const key = keys[keyIndex % keys.length];
  keyIndex++;
  return key;
}

// Default model: openrouter/owl-alpha
// Configurable via OPENROUTER_MODEL env var
// App attribution headers: HTTP-Referer, X-OpenRouter-Title
```

### 9.4 SOUL.md Personality System

The SOUL.md system defines the AI's personality across all interactions:

```
┌────────────────────────────────────────────────────────────┐
│                    SOUL.md System                           │
│                                                             │
│  ┌──────────────────┐    ┌──────────────────────────────┐ │
│  │ openclaw/SOUL.md │    │ DB: OpenClawSoulConfig       │ │
│  │ (file-based)     │    │ (per-organization)           │ │
│  └────────┬─────────┘    └──────────────┬───────────────┘ │
│           │                             │                  │
│           └──────────┬──────────────────┘                  │
│                      ▼                                     │
│           ┌──────────────────────┐                         │
│           │   getSoulPrompt()    │                         │
│           │   (gateway.ts)       │                         │
│           └──────────┬───────────┘                         │
│                      │                                     │
│           ┌──────────▼───────────┐                         │
│           │   System Prompt      │                         │
│           │   ├─ Personality     │ "Professional,          │
│           │   ├─ Tone            │  knowledgeable..."      │
│           │   ├─ Language        │ "English + Bahasa"      │
│           │   ├─ Specialty       │ "ASEAN SME business"    │
│           │   ├─ Greeting        │ "Hello! I'm GangNiaga"  │
│           │   └─ Rules (15)      │ "Always respond in..."  │
│           └──────────────────────┘                         │
└────────────────────────────────────────────────────────────┘
```

### 9.5 Skills Execution Engine

```
┌────────────────────────────────────────────────────────────┐
│                   Skills Execution Engine                    │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ /api/skills  │    │ /api/skills/ │    │ /api/skills/ │ │
│  │   (list)     │    │ execute      │    │ auto-learn   │ │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘ │
│         │                   │                   │          │
│         ▼                   ▼                   ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ Skill Model  │    │ AI Provider  │    │ Conversation │ │
│  │ (Prisma DB)  │    │ Adapter      │    │ Analysis     │ │
│  │              │    │ (getAI())    │    │ (auto-learn) │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                             │
│  Bundled Skills:                                            │
│  ├─ Market Analysis (research category)                     │
│  ├─ Financial Forecast (financial category)                 │
│  ├─ Business Plan Generator (business category)             │
│  ├─ Idea Validator (business category)                      │
│  └─ Plan Review Agent (business category)                   │
│                                                             │
│  Skill Properties:                                          │
│  • name, slug, description, version                         │
│  • category (general/business/financial/marketing/...)      │
│  • content (markdown instructions/knowledge)                │
│  • triggerPhrase (slash command, e.g. /market-analysis)     │
│  • autoLearn (boolean — can this skill auto-improve?)       │
│  • source (user_created / ai_generated / bundled / hub)     │
└────────────────────────────────────────────────────────────┘
```

### 9.6 AI Capabilities Per Provider

| Capability | ZAI SDK | OpenAI | OpenRouter | No-Op |
|-----------|---------|--------|------------|-------|
| Chat Completions | ✅ Native | ✅ gpt-4o | ✅ owl-alpha | ❌ Error |
| Vision | ✅ Native | ✅ gpt-4o | ✅ (model-dependent) | ❌ Error |
| Image Generation | ✅ Base64 | ✅ DALL-E 3 | ⚠️ (model-dependent) | ❌ Error |
| Image Edit | ✅ Base64 | ✅ DALL-E 3 | ❌ Not supported | ❌ Error |
| Text-to-Speech | ✅ Audio | ✅ tts-1 | ❌ Fallback text | ❌ Error |
| Speech-to-Text | ✅ JSON | ✅ whisper-1 | ❌ Not supported | ❌ Error |
| Web Search | ✅ Function | ⚠️ Chat-based | ⚠️ Chat-based | ❌ Error |
| Page Reader | ✅ Function | ⚠️ Chat-based | ⚠️ Chat-based | ❌ Error |

---

## 10. Security Architecture

### 10.1 Authentication & Authorization

- **NextAuth.js v4**: Available for production authentication
- **Supabase RLS**: Row Level Security enabled on all 27 tables
- **Service Role Key**: Bypasses RLS for server-side operations
- **Anon Key**: Respects RLS for client-side operations

### 10.2 API Key Management

| Key | Environment | Purpose |
|-----|-------------|---------|
| `OPENAI_API_KEY` | Vercel/Prod | OpenAI provider |
| `OPENROUTER_API_KEY_1..4` | Vercel/Prod | OpenRouter provider (round-robin) |
| `ZAI_BASE_URL` | Dev/Sandbox | Z AI Gateway (internal only) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Full database access |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser | Read-only with RLS |
| `NEXTAUTH_SECRET` | Server-only | Session encryption |
| `TELEGRAM_BOT_TOKEN` | Server-only | Telegram webhook |
| `WHATSAPP_ACCESS_TOKEN` | Server-only | WhatsApp Business API |

### 10.3 Security Measures

- **Environment-based provider detection**: ZAI only used in sandbox (not exposed to internet)
- **Vercel detection**: `VERCEL=1` skips internal ZAI Gateway
- **Webhook verification**: Telegram and WhatsApp webhook signature validation
- **No client-side secrets**: All AI operations routed through Next.js API routes
- **CORS restrictions**: Gateway APIs enforce origin validation
- **Input validation**: Zod schemas on API payloads

---

## 11. Performance Architecture

### 11.1 Caching Strategy

| Layer | Strategy | TTL |
|-------|----------|-----|
| AI Provider | Singleton instance per process | Process lifetime |
| Supabase Client | Singleton (server + browser) | Process lifetime |
| Prisma Client | Singleton via `db.ts` | Process lifetime |
| Zustand Store | In-memory (client) | Session lifetime |

### 11.2 Optimization Techniques

- **Sliding window chat**: 8-message context window for LLM efficiency
- **OpenRouter round-robin**: 4 API keys for load balancing
- **Dynamic imports**: ZAI SDK only loaded when selected as provider
- **JSONB columns**: PostgreSQL native JSON for flexible data (vs text in SQLite)
- **Supabase REST API**: Direct HTTP calls (no connection pooling overhead on Vercel)
- **Indexed queries**: Organization-scoped indexes on all major tables

---

## 12. Design Decisions & Trade-offs

### 12.1 Why Supabase as Primary Database

| Decision | Rationale |
|----------|-----------|
| **Vercel compatibility** | SQLite requires filesystem writes (not available on Vercel serverless) |
| **PostgreSQL features** | JSONB, full-text search, Row Level Security, real-time subscriptions |
| **REST API** | No direct database connection needed — works from serverless functions |
| **RLS** | Row Level Security provides per-row access control without application code |
| **Real-time** | Supabase real-time subscriptions for live updates (future: dashboard, chat) |
| **Fallback** | Prisma SQLite still works for local development with zero config |

### 12.2 Why Multi-Provider AI

| Decision | Rationale |
|----------|-----------|
| **Z AI SDK** | Internal gateway, zero config, best for development sandbox |
| **OpenAI** | Industry standard, works on Vercel, production-grade |
| **OpenRouter** | Cost-effective, model flexibility (owl-alpha default), 4-key round-robin |
| **No-Op** | Graceful degradation — shows setup instructions instead of crashing |
| **Auto-detection** | Zero config in sandbox, works immediately with any API key in production |

### 12.3 Why OpenClaw Integration

| Decision | Rationale |
|----------|-----------|
| **Multi-channel** | ASEAN businesses operate on WhatsApp, Telegram, LINE — not just web |
| **Delegate system** | Tier-based access control for AI acting on behalf of humans |
| **Plugin architecture** | Extensible capabilities (web search, memory, automation, voice) |
| **SOUL.md** | Consistent AI personality across all channels |
| **Webhook-driven** | Real-time message handling via platform webhooks |

### 12.4 Why Skills System

| Decision | Rationale |
|----------|-----------|
| **Extensibility** | New AI capabilities can be added without code changes (markdown-based) |
| **Auto-learn** | Skills improve from conversation data over time |
| **Bundled skills** | 5 core business skills ship with the product |
| **Slash commands** | Quick access via /market-analysis, /financial-forecast, etc. |
| **Hermes-inspired** | Proven pattern from the Hermes AI assistant framework |

### 12.5 Why Dual-Database Pattern

| Decision | Rationale |
|----------|-----------|
| **Dev experience** | SQLite works immediately with `bun run dev` (no Supabase setup needed) |
| **Vercel deployment** | PostgreSQL required on Vercel (Supabase or other) |
| **Schema parity** | Same 27 models in both `prisma/schema.prisma` and `supabase-schema.sql` |
| **Migration path** | Local dev → push to Supabase when ready for production |

---

## 13. Scalability Considerations

### 13.1 Horizontal Scaling

- **Vercel serverless**: Each API route scales independently
- **Supabase**: Managed PostgreSQL with connection pooling via REST API
- **OpenRouter round-robin**: 4 API keys for rate limit distribution
- **Stateless API routes**: No server-side session state

### 13.2 Vertical Scaling

- **JSONB columns**: Efficient storage and querying of flexible data
- **Indexed queries**: Organization-scoped indexes for multi-tenant data isolation
- **Singleton patterns**: Prisma, Supabase, and AI provider instances reused across requests

### 13.3 Multi-Tenant Isolation

- **Organization-scoped data**: All models have `organizationId` foreign key
- **Supabase RLS**: Row-level access control per organization
- **Channel isolation**: Each organization manages its own OpenClaw channels

---

## 14. Error Handling Strategy

### 14.1 AI Provider Errors

```
┌──────────────────────────────────────────────────────────┐
│              AI Error Handling Flow                       │
│                                                           │
│  Provider Error ──▶ Is it rate limit? ──YES──▶ Retry    │
│                          │                    with next   │
│                          │                    key (OR)    │
│                          NO                               │
│                          │                                │
│                          ▼                                │
│                   Is it auth error? ──YES──▶ Return 401  │
│                          │                                │
│                          NO                               │
│                          ▼                                │
│                   Return 500 with error details           │
│                                                           │
│  No Provider Configured ──▶ Return setup instructions    │
│  (Provider = 'none')        (not a crash)                 │
└──────────────────────────────────────────────────────────┘
```

### 14.2 Database Errors

- **Supabase unavailable**: Auto-fallback to Prisma SQLite
- **Connection errors**: Logged with context, returned as 500
- **RLS violations**: Returned as 403 Forbidden

### 14.3 Gateway Errors

- **Webhook validation failure**: 401 Unauthorized
- **Platform API errors**: Logged, retried with exponential backoff
- **AI response failures**: Graceful fallback message to user

---

## 15. Testing Strategy

### 15.1 Current Approach

- **Manual testing**: Module-by-module verification in browser
- **Lint**: `bun run lint` for code quality
- **Type checking**: TypeScript strict mode
- **Dev server**: Auto-reload on file changes

### 15.2 Future Testing Roadmap

| Type | Tool | Priority |
|------|------|----------|
| Unit tests | Vitest | Medium |
| Integration tests | Playwright | Medium |
| API tests | Bun test | High |
| E2E tests | Playwright | Low |
| Load tests | k6 | Low |

---

## Appendix A: Environment Variables

```env
# ─── Database ──────────────────────────────────────────
DATABASE_URL=file:./db/custom.db           # Prisma SQLite (dev)
# DATABASE_URL=postgresql://...            # Prisma PostgreSQL (prod)
NEXT_PUBLIC_SUPABASE_URL=https://...       # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=eyJ...           # Server-side access
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...       # Client-side access

# ─── AI Providers ──────────────────────────────────────
ZAI_BASE_URL=http://...                    # Z AI Gateway (dev only)
OPENAI_API_KEY=sk-...                      # OpenAI (prod)
OPENAI_BASE_URL=https://api.openai.com/v1 # Custom OpenAI endpoint
OPENAI_CHAT_MODEL=gpt-4o                   # Chat model
OPENAI_VISION_MODEL=gpt-4o                 # Vision model
OPENAI_IMAGE_MODEL=dall-e-3                # Image gen model
OPENROUTER_API_KEY_1=sk-or-...             # OpenRouter key 1
OPENROUTER_API_KEY_2=sk-or-...             # OpenRouter key 2
OPENROUTER_API_KEY_3=sk-or-...             # OpenRouter key 3
OPENROUTER_API_KEY_4=sk-or-...             # OpenRouter key 4
OPENROUTER_MODEL=openrouter/owl-alpha      # Default model

# ─── Auth ──────────────────────────────────────────────
NEXTAUTH_SECRET=...                        # Session encryption
NEXTAUTH_URL=http://localhost:3000         # Auth callback URL

# ─── Messaging ─────────────────────────────────────────
TELEGRAM_BOT_TOKEN=...                     # Telegram bot
WHATSAPP_PHONE_NUMBER_ID=...               # WhatsApp Business
WHATSAPP_ACCESS_TOKEN=...                  # WhatsApp API
WHATSAPP_VERIFY_TOKEN=...                  # Webhook verification

# ─── Deployment ────────────────────────────────────────
VERCEL=1                                   # Auto-set on Vercel
```

## Appendix B: Default Models

| Use Case | Model | Provider |
|----------|-------|----------|
| **Chat (default)** | openrouter/owl-alpha | OpenRouter |
| **Chat (sandbox)** | Auto (Z AI Gateway) | ZAI SDK |
| **Chat (OpenAI)** | gpt-4o | OpenAI |
| **Vision** | gpt-4o / owl-alpha | OpenAI / OpenRouter |
| **Image Generation** | dall-e-3 | OpenAI |
| **Text-to-Speech** | tts-1 | OpenAI |
| **Speech-to-Text** | whisper-1 | OpenAI |

## Appendix C: Vercel Deployment

```bash
# 1. Set up Supabase project and run supabase-schema.sql
# 2. Set environment variables in Vercel dashboard
# 3. Deploy
vercel deploy

# Or use the setup script:
bash scripts/setup-vercel.sh
```

The `vercel.json` configuration:
- Region: `sin1` (Singapore — optimal for ASEAN users)
- Build: `prisma generate && next build`
- Install: `bun install`
