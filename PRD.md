# GangNiaga AI OS — Product Requirements Document

> **Version:** v0.3.0  
> **Last Updated:** March 2025  
> **Status:** Active Development  
> **Author:** GangNiaga Product Team  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Mission](#2-product-vision--mission)
3. [Target Users & Personas](#3-target-users--personas)
4. [Problem Statement](#4-problem-statement)
5. [Product Features](#5-product-features)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [User Stories](#8-user-stories)
9. [Data Models](#9-data-models)
10. [AI/ML Requirements](#10-aiml-requirements)
11. [Integration Requirements](#11-integration-requirements)
12. [Success Metrics & KPIs](#12-success-metrics--kpis)
13. [Future Roadmap](#13-future-roadmap)
14. [Appendix](#14-appendix)

---

## 1. Executive Summary

**GangNiaga AI OS** is an autonomous AI-powered business operating system designed specifically for Southeast Asian SMEs. It replaces the fragmented ecosystem of 7+ disconnected business tools with a single intelligent platform that plans, analyzes, automates, and executes real business workflows.

### Key Value Propositions

| Pillar | Description |
|--------|-------------|
| **Autonomous AI Agents** | 8 specialized AI agents that execute business tasks independently — not passive tools, but active workers |
| **Lender-Grade Plans** | 21-section professional business proposals tailored to 6 proposal types (bank loans, grants, VC, angel, SME financing, corporate partnership) |
| **Financial Intelligence** | Integrated financial engine with DSCR calculations, bank metrics, P&L, Balance Sheet, Cash Flow statements, and AI-powered forecasting with confidence bands |
| **ASEAN-First Design** | Built from the ground up for Southeast Asian markets — multi-currency support, local compliance frameworks, regional citation databases |
| **Persistent AI Memory** | Context-retaining AI that learns from every interaction — user preferences, financial patterns, workflow history, and market intelligence |
| **Plan-to-Execution Pipeline** | Complete lifecycle from idea validation → business plan → lender review → pitch deck → plan-vs-actuals tracking — all in one system |

### Technical Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    GangNiaga AI OS Architecture                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Next.js 16 │  │  TypeScript │  │  Tailwind CSS 4 +       │ │
│  │  App Router │  │  5 (Strict) │  │  shadcn/ui (50+ comps)  │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                      │               │
│  ┌──────┴────────────────┴──────────────────────┴─────────────┐ │
│  │                   Presentation Layer                        │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │ │
│  │  │Dash- │ │Biz   │ │Finan-│ │Idea  │ │Plan  │ │Agent │   │ │
│  │  │board │ │Plans │ │cials │ │Canvas│ │Review│ │Consl │   │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │ │
│  │  │Work- │ │Mem-  │ │Pitch │ │Re-   │ │Plan  │ │Co-   │   │ │
│  │  │flows │ │ory   │ │Deck  │ │ports │ │vAct  │ │pilot │   │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │  OpenClaw Multi-Channel Gateway (Module 15)          │   │ │
│  │  │  WhatsApp │ Telegram │ Discord │ WebChat │ Signal    │   │ │
│  │  │  Slack │ Plugin System │ Delegates │ SOUL.md         │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────┴─────────────────────────────────┐ │
│  │                     State Management                        │ │
│  │  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐  │ │
│  │  │   Zustand    │  │  TanStack      │  │  Framer       │  │ │
│  │  │   Store      │  │  Query (Cache) │  │  Motion       │  │ │
│  │  └──────────────┘  └────────────────┘  └───────────────┘  │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────┴─────────────────────────────────┐ │
│  │                   API Layer (41 Routes)                     │ │
│  │  /chat │ /business-plan │ /agents │ /dashboard │ /forecast │ │
│  │  /reports │ /idea-canvas │ /plan-review │ /pitch-deck      │ │
│  │  /openclaw/* │ /skills/* │ /gateway/* │ /webhooks/*        │ │
│  │  /soul │ /delegates │ /automation │ /channels              │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────┴─────────────────────────────────┐ │
│  │              Multi-Provider AI Layer                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │ │
│  │  │ ZAI SDK      │  │ OpenAI API   │  │ OpenRouter     │   │ │
│  │  │ (dev)        │  │ (prod)       │  │ (Vercel)       │   │ │
│  │  └──────────────┘  └──────────────┘  │ 4 keys round-  │   │ │
│  │                                      │ robin           │   │ │
│  │                                      └────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Backend Services                        │   │
│  │  ┌──────────────┐  ┌────────────────────────────────┐   │   │
│  │  │ Prisma ORM   │  │  Supabase PostgreSQL (Primary) │   │   │
│  │  │ (Database)   │  │  + SQLite (Local Dev)          │   │   │
│  │  └──────────────┘  └────────────────────────────────┘   │   │
│  │  ┌──────────────┐  ┌────────────────────────────────┐   │   │
│  │  │ Skills Engine│  │  Gateway Helpers (400 lines)    │   │   │
│  │  │ (30+ skills) │  │  lib/gateway.ts                │   │   │
│  │  └──────────────┘  └────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Platform at a Glance

| Metric | Value |
|--------|-------|
| Core Modules | 15 |
| API Routes | 41 |
| Database Models | 27 |
| AI Providers | 3 (ZAI / OpenAI / OpenRouter) |
| AI Agents | 8 |
| UI Components (shadcn/ui) | 50+ |
| Proposal Types | 6 |
| Business Plan Sections | 21 |
| Report Types | 5 |
| Output Formats | 4 (PDF, DOCX, XLSX, CSV) |
| Citation Sources | 50+ |
| Geography Filters | 3 (MY, SEA, Global) |
| Messaging Channels | 6 (WhatsApp, Telegram, Discord, WebChat, Signal, Slack) |
| Skills | 30+ |

---

## 2. Product Vision & Mission

### Vision

> To become the operating system that powers every SME in Southeast Asia — where AI agents work 24/7 so founders can focus on what matters: building their business.

### Mission

> Democratize bank-grade business planning, financial intelligence, and autonomous workflow execution for the 65 million SMEs across ASEAN — making professional business operations accessible to every entrepreneur, regardless of their financial literacy or technical expertise.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Autonomy Over Assistance** | AI agents don't just suggest — they execute. The system moves from "AI as a tool" to "AI as a worker." |
| **Lender-Grade Precision** | Every financial projection, business plan, and report must meet the standards of banks, investors, and grant officers. |
| **ASEAN-First, Not ASEAN-Last** | Built specifically for Southeast Asian business contexts — currencies, compliance, languages, and cultural norms are foundational, not afterthoughts. |
| **Context is King** | Persistent AI memory ensures every interaction builds on the last. The system gets smarter with every use. |
| **Connected Intelligence** | No data silos. Financial models feed business plans, which feed pitch decks, which feed plan-vs-actuals tracking. |

### Strategic Positioning

```
                    High Autonomy
                         │
                         │
            GangNiaga    │      Future:
            AI OS        │      Autonomous
            ●────────────┤      Enterprise
                         │      ●
                         │
                         │
  ───────────────────────┼──────────────────── High Complexity
                         │
         LivePlan        │
         ●               │    Monday.com
                         │    ●
         Upmetrics       │
         ●               │    Notion
                         │    ●
                         │
                    Low Autonomy
```

---

## 3. Target Users & Personas

### Primary Market: Southeast Asian SMEs

| Market | SME Count | Key Insight |
|--------|-----------|-------------|
| Malaysia | 1.2M | 97% of businesses are SMEs; 38% GDP contribution |
| Indonesia | 64M MSMEs | Largest ASEAN market; rapid digitalization |
| Thailand | 3.1M SMEs | Strong manufacturing and services sectors |
| Philippines | 1.0M+ SMEs | BPO-driven economy; growing startup ecosystem |
| Vietnam | 800K+ SMEs | Fastest-growing digital economy in ASEAN |
| Singapore | 270K+ SMEs | Regional hub; high financial sophistication |

### User Personas

#### Persona 1: Ahmad — The Bootstrapped Founder

| Attribute | Detail |
|-----------|--------|
| **Name** | Ahmad Razak |
| **Age** | 32 |
| **Role** | Founder & CEO |
| **Company** | 18-month-old SaaS startup, Kuala Lumpur |
| **Team Size** | 8 people |
| **Revenue** | RM180K MRR |
| **Tech Savviness** | High (former software engineer) |
| **Pain Points** | Needs bank loan for expansion; has never written a business proposal; spends 10+ hours/week on manual financial tracking |
| **Goals** | Secure RM500K bank loan; automate reporting; understand DSCR requirements |
| **Primary Modules** | Business Plans (bank_loan), Financials, Dashboard, Copilot |

#### Persona 2: Siti — The Grant Seeker

| Attribute | Detail |
|-----------|--------|
| **Name** | Siti Nurhaliza |
| **Age** | 28 |
| **Role** | Co-founder & COO |
| **Company** | 6-month-old social enterprise, Penang |
| **Team Size** | 4 people |
| **Revenue** | Pre-revenue (grant-funded) |
| **Tech Savviness** | Medium (marketing background) |
| **Pain Points** | Applying for MDEC and MARA grants; doesn't understand financial statements; needs professional proposal |
| **Goals** | Secure MARA Youth Entrepreneurship Grant; validate business idea; create grant-compliant proposal |
| **Primary Modules** | Idea Canvas, Business Plans (government_grant), Plan Review, Pitch Deck |

#### Persona 3: Raj — The Growth-Stage CEO

| Attribute | Detail |
|-----------|--------|
| **Name** | Rajesh Kumar |
| **Age** | 38 |
| **Role** | CEO |
| **Company** | 3-year-old fintech, Singapore (with MY operations) |
| **Team Size** | 25 people |
| **Revenue** | SGD850K MRR |
| **Tech Savviness** | High (former banker) |
| **Pain Points** | Needs Series A; managing plan vs actuals across 2 countries; investor reporting takes 2 days/month |
| **Goals** | Raise USD5M Series A; automate investor reporting; track variance across markets |
| **Primary Modules** | Business Plans (venture_capital), Financials, Plan vs Actuals, Reports, Pitch Deck |

#### Persona 4: Lim — The SME Operator

| Attribute | Detail |
|-----------|--------|
| **Name** | Lim Wei Chong |
| **Age** | 45 |
| **Role** | Owner/Manager |
| **Company** | 12-year-old manufacturing SME, Johor Bahru |
| **Team Size** | 35 people |
| **Revenue** | RM3.2M ARR |
| **Tech Savviness** | Low-Medium (uses Excel for everything) |
| **Pain Points** | Bank wants updated financials for credit facility renewal; QuickBooks data is messy; no idea what DSCR means |
| **Goals** | Renew RM1M credit facility; connect QuickBooks; understand bank requirements |
| **Primary Modules** | Financials, Dashboard, Plan vs Actuals, Settings (Integrations), Copilot |

---

## 4. Problem Statement

### The ASEAN SME Crisis by Numbers

| Statistic | Source |
|-----------|--------|
| 60% of ASEAN SMEs fail within 3 years | SME Corp Malaysia |
| 70% still use manual methods for financial planning | McKinsey Digital SEA |
| Only 15% use any business planning software | McKinsey Digital SEA |
| Average SME spends 15+ hours/week on admin tasks that could be automated | OECD SME Outlook |
| 80% of bank loan rejections are due to inadequate business proposals | BNM Financial Stability Review |

### Root Causes

```
┌─────────────────────────────────────────────────────────────┐
│                    The Problem Cascade                        │
│                                                              │
│  1. FRAGMENTATION                                           │
│  ├─ SMEs use 7+ disconnected tools                          │
│  ├─ Business plans in Word, financials in Excel,            │
│  │  pitch decks in PowerPoint, reports in Canva             │
│  └─ No single source of truth                               │
│                                                              │
│  2. FINANCIAL ILLITERACY                                    │
│  ├─ Founders don't understand DSCR, P&L, Balance Sheet      │
│  ├─ Banks require professional financial statements          │
│  └─ No accessible way to learn while building               │
│                                                              │
│  3. MANUAL LABOR                                            │
│  ├─ 15+ hours/week on repetitive tasks                      │
│  ├─ Manual data entry across systems                        │
│  └─ No automation of workflows                              │
│                                                              │
│  4. NO INTELLIGENT ASSISTANCE                               │
│  ├─ Existing tools are passive (you must drive them)        │
│  ├─ No AI that understands your business context             │
│  └─ No memory across sessions                               │
│                                                              │
│  5. WESTERN-CENTRIC TOOLS                                   │
│  ├─ Built for US/EU markets with USD assumptions            │
│  ├─ No ASEAN compliance, multi-currency, or localization     │
│  └─ No regional citation databases for credibility           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### How GangNiaga AI OS Solves This

| Problem | GangNiaga Solution |
|---------|-------------------|
| Fragmentation | Single platform: plans → financials → decks → reports → tracking |
| Financial Illiteracy | AI Copilot explains concepts in context; DSCR gauge with visual feedback; bank approval checklist |
| Manual Labor | 8 autonomous AI agents execute tasks 24/7; workflow automation engine |
| No Intelligent Assistance | Persistent AI memory; context-aware Copilot; agent console with task tracking |
| Western-Centric | ASEAN-first: RM/SGD/IDR/THB support; BNM/MAS compliance; 50+ regional citation sources |

---

## 5. Product Features

### Module 1: Dashboard

The command center for business health — providing an at-a-glance view of critical KPIs, trends, and AI-generated insights.

#### KPI Cards

| KPI | Description | Unit | Target Example |
|-----|-------------|------|----------------|
| **Monthly Revenue** | Current month's total revenue | Currency (RM) | RM300,000 |
| **Burn Rate** | Monthly cash outflow | Currency (RM) | RM170,000 |
| **Runway** | Months until cash depletion | Months | 24 |
| **DSCR** | Debt Service Coverage Ratio | Ratio (x) | 1.50x |
| **MRR** | Monthly Recurring Revenue | Currency (RM) | RM160,000 |
| **ARR** | Annual Recurring Revenue | Currency (RM) | RM2,000,000 |

Each KPI card displays:
- Current value with trend indicator (▲ up, ▼ down, ● neutral)
- Previous period value for comparison
- Percentage change from previous period
- Target value with progress indicator
- Color-coded status (emerald = on track, amber = caution, red = critical)

#### Charts & Visualizations

| Chart | Type | Data | Purpose |
|-------|------|------|---------|
| **Revenue Trend** | Area Chart | 12-month revenue data | Show growth trajectory |
| **Revenue vs Expenses** | Bar Chart | Monthly revenue, expenses, profit | Compare income vs outflow |
| **Expense Breakdown** | Pie Chart | Category-level expenses | Identify largest cost centers |

#### AI Insights Panel
- Auto-generated insights based on KPI trends and financial data
- Anomaly detection (e.g., "Burn rate increased 8% this month")
- Recommendation cards with one-click actions
- Confidence scores on predictions

#### Quick Actions
- "Generate Business Plan" → navigates to Business Plans module
- "Run Forecast" → navigates to Financials with forecast tab
- "Review My Plan" → navigates to Plan Review module
- "Chat with AI" → opens Copilot panel

---

### Module 2: Business Plans

A professional 21-section business proposal builder with AI-powered content generation, supporting 6 distinct proposal types.

#### Proposal Types

| Type | Key | Target Audience | Tone | Special Focus |
|------|-----|----------------|------|---------------|
| **Bank Loan** | `bank_loan` | Bank loan officers | Conservative, data-heavy | Collateral, DSCR, repayment schedule |
| **Government Grant** | `government_grant` | Grant reviewers (MARA, MDEC, TERAJU) | Impact-focused, community-oriented | Social impact, Bumiputera participation, job creation |
| **Angel Investor** | `angel_investor` | Individual angel investors | Visionary, personal | Founder story, market timing, exit potential |
| **Venture Capital** | `venture_capital` | VC partners | Growth-focused, metrics-driven | TAM/SAM/SOM, CAC/LTV, scalability, team |
| **SME Financing** | `sme_financing` | SME loan officers | Practical, stability-focused | Cash flow stability, operational history, guarantees |
| **Corporate Partnership** | `corporate_partnership` | Corporate BD teams | Strategic, synergistic | Mutual value, integration points, market access |

#### 21-Section Structure

Sections are organized into 6 logical groups, each with AI generation capabilities:

**Group 1: Overview** (Sections 1-4)

| # | Section Key | Section Name | AI Prompt Focus |
|---|-------------|-------------|-----------------|
| 1 | `coverPage` | Cover Page | Professional formatting with company details, proposal type, and amount |
| 2 | `executiveSummary` | Executive Summary | High-level overview highlighting key metrics and ask |
| 3 | `companyOverview` | Company Overview | Legal structure, registration, ownership, history |
| 4 | `problemStatement` | Problem Statement | Market pain points with quantified impact data |

**Group 2: Product & Market** (Sections 5-8)

| # | Section Key | Section Name | AI Prompt Focus |
|---|-------------|-------------|-----------------|
| 5 | `solutionProduct` | Solution / Product | Product description, core capabilities, differentiators |
| 6 | `marketAnalysis` | Market Analysis | TAM/SAM/SOM, market sizing, growth projections |
| 7 | `industryResearch` | Industry Research | Industry trends, regulatory environment, technology shifts |
| 8 | `competitorAnalysis` | Competitor Analysis | Competitive landscape, strengths/weaknesses, positioning |

**Group 3: Business Model** (Sections 9-12)

| # | Section Key | Section Name | AI Prompt Focus |
|---|-------------|-------------|-----------------|
| 9 | `businessModel` | Business Model | Revenue model, pricing tiers, cost structure |
| 10 | `revenueStreams` | Revenue Streams | Detailed breakdown of each revenue channel |
| 11 | `goToMarketStrategy` | Go-to-Market Strategy | Customer acquisition channels, marketing plan, sales strategy |
| 12 | `operationsPlan` | Operations Plan | Day-to-day operations, team structure, vendor relationships |

**Group 4: Technical & Team** (Sections 13-14)

| # | Section Key | Section Name | AI Prompt Focus |
|---|-------------|-------------|-----------------|
| 13 | `technologySystem` | Technology & Systems | Tech stack, infrastructure, IP, data security |
| 14 | `managementTeam` | Management Team | Key team members, board, advisors, gaps |

**Group 5: Financial** (Sections 15-18)

| # | Section Key | Section Name | AI Prompt Focus |
|---|-------------|-------------|-----------------|
| 15 | `financialForecast` | Financial Forecast | 3-year P&L, cash flow, balance sheet projections |
| 16 | `fundingRequirement` | Funding Requirement | Amount, type, terms, purpose of funding |
| 17 | `useOfFunds` | Use of Funds | Detailed allocation with percentages and descriptions |
| 18 | `riskAnalysis` | Risk Analysis | Risk categories with likelihood, impact, mitigation |

**Group 6: Strategy** (Sections 19-21)

| # | Section Key | Section Name | AI Prompt Focus |
|---|-------------|-------------|-----------------|
| 19 | `swotAnalysis` | SWOT Analysis | Strengths, weaknesses, opportunities, threats matrix |
| 20 | `exitStrategy` | Exit Strategy | Potential exits, timeline, valuation methodology |
| 21 | `appendices` | Appendices | Supporting documents, data tables, references |

#### Key Features

- **AI Generation per Section**: Each section has a proposal-type-specific AI prompt that generates tailored content
- **Bulk AI Generation**: "Generate All" button that creates all 21 sections in sequence
- **Inline Editing**: Click any section content to edit directly in-place with markdown support
- **Section Status Tracking**: Draft → Generated → Reviewed → Finalized status per section
- **Auto-save**: All changes persisted to Zustand store and synced to database
- **Markdown Rendering**: Full markdown support with syntax highlighting for financial tables

---

### Module 3: Financials

A comprehensive 6-tab financial engine providing bank-grade financial analysis and forecasting.

#### Tab Structure

| Tab | Purpose | Key Components |
|-----|---------|----------------|
| **Overview** | Financial health summary | KPI cards, trend charts, quick insights |
| **Revenue Modeling** | Revenue projections | MRR growth, churn analysis, cohort data, revenue by segment |
| **Expense Analysis** | Cost breakdown | Category expenses, fixed vs variable, burn rate trend |
| **Bank Metrics** | Lender-facing metrics | DSCR Gauge, approval checklist, collateral assessment |
| **Financial Statements** | Standard financial reports | P&L, Balance Sheet, Cash Flow Statement with DSCR |
| **Forecast Advisor** | AI-powered forecasting | Confidence bands, scenario analysis, recommendations |

#### DSCR Gauge Component

The Debt Service Coverage Ratio gauge is a critical visual component:

```
         DSCR Gauge Scale
    ┌─────────────────────────┐
    │                         │
    │   0.0x ── Danger Zone   │  (< 1.0x: Default risk)
    │   1.0x ── Minimum       │  (1.0-1.25x: Tight)
    │   1.25x ── Bank Min     │  (1.25-1.50x: Acceptable)
    │   1.50x ── Target ──●   │  (1.50x+: Healthy)
    │   2.0x ── Strong        │  (2.0x+: Very Strong)
    │   3.0x ── Excellent     │  (3.0x+: Outstanding)
    │                         │
    └─────────────────────────┘
```

- Visual gauge with color zones (red → amber → emerald → teal)
- Current DSCR with animated needle
- Historical DSCR trend line
- Sensitivity analysis: "What happens to DSCR if revenue drops 30%?"

#### Bank Approval Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| DSCR ≥ 1.25x | ✅ 1.45x | Above minimum |
| 3-year financial projections | ✅ Provided | P&L, BS, CF included |
| Collateral documentation | ❌ Missing | Need to add collateral section |
| Personal guarantees | ❌ Missing | CEO/CTO guarantees required |
| Cash flow statement | ✅ Provided | Monthly and annual |
| Business registration | ✅ SSM Reg. | 2024012345 |
| Management team CVs | ⚠️ Partial | CEO and CTO only |
| Industry analysis | ✅ Provided | With 10+ citations |

#### Financial Statements

**Profit & Loss Statement (Monthly + Annual)**
- Revenue → COGS → Gross Profit → Operating Expenses → EBITDA → Net Income
- Month-over-month and year-over-year comparisons

**Balance Sheet**
- Assets (Current + Non-Current) → Liabilities (Current + Long-term) → Equity
- Key ratios: Current Ratio, Quick Ratio, Debt-to-Equity

**Cash Flow Statement**
- Operating Activities → Investing Activities → Financing Activities → Net Cash Flow
- DSCR calculation embedded in financing section

#### Forecast Advisor

- AI-powered forecasting with confidence bands (optimistic, base, pessimistic)
- Scenario analysis: "What if revenue grows 20% instead of 30%?"
- Interactive sliders for key assumptions
- Auto-generated narrative explanations of forecast drivers

---

### Module 4: Idea Canvas

A business idea validation engine that scores and assesses ideas before significant investment of time and resources.

#### Idea Structure

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Name of the business idea |
| `problem` | Text | The problem being solved |
| `solution` | Text | The proposed solution |
| `targetMarket` | Text | Target customer segment and size |
| `revenueModel` | Text | How the idea makes money |
| `competitiveEdge` | Text | Unique advantages |
| `risks` | String[] | Identified risk factors |
| `status` | Enum | `draft` → `validating` → `validated` / `needs_rework` |

#### AI Validation Scoring (0-100 scale)

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Market Viability** | 25% | Size of addressable market, growth rate, timing |
| **Problem Clarity** | 20% | Is the problem real, urgent, and well-defined? |
| **Solution Feasibility** | 20% | Can the team actually build and deliver this? |
| **Revenue Potential** | 20% | Realistic path to revenue, unit economics |
| **Competitive Position** | 15% | Differentiation, moat, barriers to entry |

#### Validation Report Components

```
┌───────────────────────────────────────────────────────┐
│              Idea Validation Report                     │
│                                                        │
│  Overall Score: 82/100 ●●●●●●●●○○ (Strong)           │
│                                                        │
│  Market Viability:    88 ████████████████░░░░ (88%)   │
│  Problem Clarity:     90 ██████████████████░░ (90%)   │
│  Solution Feasibility:75 ███████████████░░░░░ (75%)   │
│  Revenue Potential:   85 █████████████████░░░ (85%)   │
│  Competitive Position:72 ██████████████░░░░░░ (72%)   │
│                                                        │
│  Risk Level: ● MEDIUM                                  │
│                                                        │
│  ✅ Strengths (4):                                    │
│     • Massive underserved market (65M SMEs)           │
│     • Clear pain point with quantifiable impact       │
│     • Strong technical moat with multi-agent AI       │
│     • First-mover advantage in ASEAN AI business tools│
│                                                        │
│  ⚠️ Weaknesses (4):                                  │
│     • Early-stage company (less than 2 years)         │
│     • Revenue concentration in top accounts (28% MRR) │
│     • Team size too small for regional ambitions      │
│     • No ISO/SOC2 certification yet                   │
│                                                        │
│  🚩 Red Flags (2):                                   │
│     • Burn rate of RM187K/mo with only 18 months     │
│     • No physical collateral for bank loan           │
│                                                        │
│  📊 Benchmark Comparison:                             │
│     LTV:CAC Ratio:     You 7.5  vs  Benchmark 3.0 ↑  │
│     Monthly Growth:    You 11.1% vs  Benchmark 8.0% ↑ │
│     Gross Margin:      You 82%   vs  Benchmark 70% ↑  │
│     Churn Rate:        You 3.2%  vs  Benchmark 2.5% ↓ │
│                                                        │
└───────────────────────────────────────────────────────┘
```

---

### Module 5: Plan Review

AI-powered lender persona review that evaluates business plans through the eyes of different funding decision-makers.

#### Lender Personas

| Persona | Key | Evaluation Focus | Typical Concerns |
|---------|-----|------------------|------------------|
| **Bank Loan Officer** | `bank` | Repayment ability, collateral, DSCR, cash flow stability | "Can they repay? What if revenue drops 30%?" |
| **Investor (VC/Angel)** | `investor` | Market size, growth rate, team, scalability, exit potential | "Is this a 10x opportunity? Can this team execute?" |
| **Grant Officer** | `grant_officer` | Social impact, community benefit, alignment with program goals | "Does this create jobs? Does it help the target community?" |

#### Review Scoring

| Score | Range | Weight | Description |
|-------|-------|--------|-------------|
| **Narrative Score** | 0-100 | 30% | Quality, completeness, persuasiveness of written sections |
| **Financial Score** | 0-100 | 35% | Accuracy, consistency, and realism of financial projections |
| **Consistency Score** | 0-100 | 35% | Alignment between narrative claims and financial data |
| **Overall Score** | 0-100 | — | Weighted composite of all three scores |

#### Discrepancy Detection

The system cross-references every narrative claim against financial data:

| Severity | Color | Criteria | Example |
|----------|-------|----------|---------|
| **Critical** | 🔴 Red | Direct contradiction; will cause immediate rejection | "Claims 132% growth but financials show 151%" |
| **Warning** | 🟡 Amber | Inconsistency that raises questions | "Use of Funds allocation doesn't match operations plan" |
| **Info** | 🔵 Blue | Minor discrepancy or improvement opportunity | "3 customer segments but only 2 clear pricing tiers" |

Each discrepancy includes:
- Affected sections
- Narrative claim (what was stated)
- Financial reality (what the numbers show)
- Suggested fix (actionable recommendation)

---

### Module 6: Research Agent

Bank-grade research with verified citation sources, geography filtering, and data point extraction.

#### Citation Source Types

| Type | Key | Examples |
|------|-----|---------|
| **Market Data** | `market_data` | Statista, Gartner, IDC market size reports |
| **Industry Report** | `industry_report` | McKinsey, Bain, Google-Temasek e-Conomy |
| **Benchmark** | `benchmark` | OECD, World Bank comparative data |
| **Government** | `government` | DOSM, BNM, SME Corp, MARA publications |
| **Financial** | `financial` | Central bank rates, DSCR requirements, regulatory standards |

#### Geography Filtering

| Filter | Coverage |
|--------|----------|
| **MY** | Malaysia-specific data (DOSM, BNM, SME Corp, MARA, MDEC) |
| **SEA** | Southeast Asia regional (ASEAN aggregate, Google-Temasek-Bain) |
| **Global** | International benchmarks (OECD, World Bank, Gartner) |

#### Key Features

- **50+ Verified Citation Sources**: Pre-validated data sources with URLs and publication dates
- **Data Point Extraction**: Each citation includes the specific data point extracted
- **Verification Status**: Sources are marked as verified (✓) or unverified (⚠) based on manual review
- **Auto-Citation**: When AI generates business plans, it automatically pulls and cites relevant sources
- **Citation Browser**: Searchable, filterable database of all available citations

---

### Module 7: Agent Console

Management console for 8 specialized AI agents with task tracking, status monitoring, and configuration.

#### Agent Roster

| # | Agent Name | Type | Specialization | Default Status |
|---|-----------|------|----------------|----------------|
| 1 | **Business Analyst** | `analysis` | Market analysis, competitor research, business model evaluation | Running |
| 2 | **Financial Advisor** | `financial` | Financial forecasting, DSCR analysis, cash flow modeling | Idle |
| 3 | **Market Researcher** | `research` | Market sizing, industry trends, citation gathering | Running |
| 4 | **Report Generator** | `reporting` | Multi-format report creation (PDF, DOCX, XLSX, CSV) | Completed |
| 5 | **Browser Agent** | `browser` | Web scraping, competitor monitoring, data extraction | Idle |
| 6 | **CRM Assistant** | `crm` | Customer data management, pipeline tracking | Error |
| 7 | **Plan Review Agent** | `review` | Lender-grade plan review, discrepancy detection | Idle |
| 8 | **Citation Verifier** | `citation` | Source verification, data point validation, freshness checks | Running |

#### Agent Task Lifecycle

```
┌─────────┐    ┌─────────┐    ┌──────────┐    ┌───────────┐
│ Pending  │───▶│ Running │───▶│Completed │    │  Failed   │
│          │    │         │    │          │    │           │
│ Waiting  │    │ Active  │    │ Success  │◀──▶│  Error    │
│ for exec │    │ process │    │ output   │    │  retry?   │
└─────────┘    └────┬────┘    └──────────┘    └───────────┘
                    │
                    │ (cancellable)
                    ▼
               ┌─────────┐
               │Cancelled│
               └─────────┘
```

#### Task Types

| Task Type | Description | Typical Agent | Avg Duration |
|-----------|-------------|---------------|-------------|
| Market Analysis | Analyze market trends and opportunities | Business Analyst | 10-15s |
| Financial Forecast | Generate revenue/expense projections | Financial Advisor | 8-12s |
| Competitor Research | Monitor and analyze competitors | Market Researcher | 15-20s |
| KPI Report | Generate weekly/monthly KPI summary | Report Generator | 5-8s |
| Citation Verification | Verify market data sources | Citation Verifier | 3-5s |
| Plan Consistency Check | Cross-check narrative vs financials | Plan Review Agent | 12-18s |

---

### Module 8: Workflows

Automated workflow orchestration with multi-step execution, multiple trigger types, and agent assignment per step.

#### Trigger Types

| Type | Key | Description | Example |
|------|-----|-------------|---------|
| **Cron** | `cron` | Scheduled on a recurring basis | "Every Monday at 9 AM" |
| **Event** | `event` | Triggered by a specific event | "When a new business plan is created" |
| **Threshold** | `threshold` | Triggered when a metric crosses a value | "When DSCR drops below 1.25x" |
| **Manual** | `manual` | Triggered by user action | "Run Now" button |

#### Workflow Step Types

| Step Type | Description | Can Assign |
|-----------|-------------|------------|
| `data` | Collect or process data | Agent |
| `analysis` | Analyze data or generate insights | Agent |
| `chart` | Generate visualization | Tool |
| `report` | Create formatted output | Agent |
| `notification` | Send alert or message | Tool |
| `browser` | Web scraping or monitoring | Agent |

#### Example Workflows

**Weekly KPI Report Workflow** (4 steps)
```
Step 1: Collect KPI Data        → Business Analyst (Agent)
Step 2: Generate Charts         → Analytics Tool (Tool)
Step 3: Create Report           → Report Generator (Agent)
Step 4: Send to Slack           → Slack Tool (Tool)
```

**Revenue Alert Workflow** (3 steps)
```
Step 1: Check Revenue           → Financial Advisor (Agent)
Step 2: Compare Target          → Business Analyst (Agent)
Step 3: Send Alert              → Email Tool (Tool)
```

---

### Module 9: Memory Engine

Persistent AI memory system that retains context across sessions, enabling increasingly intelligent interactions.

#### Memory Categories

| Category | Key | Description | Example |
|----------|-----|-------------|---------|
| **User** | `user` | Personal preferences, UI settings, interaction patterns | "Prefers compact dashboard view" |
| **Workspace** | `workspace` | Company information, market intelligence, team data | "GangNiaga is a SaaS startup founded in 2024" |
| **Financial** | `financial` | Revenue models, financial assumptions, DSCR history | "Current DSCR: 1.45x, up from 1.22x last quarter" |
| **Workflow** | `workflow` | Automation history, success rates, time savings | "8 consecutive weekly KPI reports automated" |
| **Agent** | `agent` | Agent training data, specializations, context | "Business Analyst trained on SEA market data" |

#### Memory Lifecycle

```
  User Action          AI Processing          Memory Storage
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│ Ask about│──────▶│  Extract     │──────▶│  Category:   │
│ DSCR     │       │  context &   │       │  financial   │
│          │       │  intent      │       │              │
└──────────┘       └──────────────┘       │  Content:    │
                                          │  "DSCR: 1.45x│
┌──────────┐       ┌──────────────┐       │  above bank  │
│ Next      │──────▶│  Retrieve    │──────▶│  minimum"    │
│ session   │       │  relevant    │       └──────────────┘
│           │       │  memories    │
└──────────┘       └──────────────┘
```

---

### Module 10: Pitch Deck

Dynamic pitch deck orchestrator that generates presentation-ready slides linked to business plan sections.

#### Template Types

| Template | Key | Slide Emphasis | Typical Slide Count |
|----------|-----|---------------|-------------------|
| **Investor** | `investor` | Problem, solution, market, team, traction, ask | 10-12 slides |
| **Bank** | `bank` | Financials, DSCR, collateral, repayment, risk | 7-9 slides |
| **Grant** | `grant` | Impact, community benefit, alignment, budget | 8-10 slides |

#### Slide Types

| Type | Key | Description | Example Content |
|------|-----|-------------|-----------------|
| `title` | Title slide | Company name, tagline, date | "GangNiaga AI OS — Bank Loan Proposal" |
| `problem` | Problem | Pain points with data | "70% of ASEAN SMEs use manual methods" |
| `solution` | Solution | Product description, capabilities | "AI-autonomous business operating system" |
| `market` | Market | TAM/SAM/SOM, growth | "USD12.4B TAM, 28% CAGR" |
| `business_model` | Business Model | Revenue streams, pricing | "SaaS: 70%, AI Usage: 15%" |
| `financials` | Financials | Projections, DSCR | "Year 1: RM8.9M, DSCR: 1.45x" |
| `team` | Team | Key members, advisors | "CEO: 15yr experience, CTO: AI/ML PhD" |
| `ask` | The Ask | Funding amount, use of funds | "RM2M term loan, 5-year tenure" |
| `appendix` | Appendix | Supporting data | "Citation sources, detailed financials" |

#### Anticipated Questions Feature

Each pitch deck includes AI-generated questions that funders are likely to ask:

| Field | Description |
|-------|-------------|
| `question` | The anticipated question text |
| `category` | Classification (Financial, Collateral, Competitive, Use of Funds, etc.) |
| `suggestedAnswer` | AI-prepared response the user can reference |
| `difficulty` | `easy` / `medium` / `hard` — how challenging the question is to answer |

---

### Module 11: Reports

AI-powered report generation with multiple report types and output formats.

#### Report Types

| Type | Key | Target Audience | Content Focus |
|------|-----|----------------|---------------|
| **Investor Update** | `investor` | Existing investors | Traction, burn rate, runway, key milestones |
| **Board Report** | `board` | Board of directors | Strategic decisions, financials, risk, governance |
| **Financial Report** | `financial` | CFO/Finance team | P&L, balance sheet, cash flow, ratios |
| **KPI Summary** | `kpi` | Management team | All KPI metrics with trend analysis |
| **Operational** | `operational` | Operations team | Workflow status, agent performance, efficiency metrics |

#### Output Formats

| Format | Key | Best For |
|--------|-----|---------|
| **PDF** | `pdf` | Final reports, investor updates, board presentations |
| **DOCX** | `docx` | Editable reports, collaborative documents |
| **XLSX** | `xlsx` | Financial data, pivot tables, number-heavy reports |
| **CSV** | `csv` | Raw data export, integration with other systems |

---

### Module 12: Plan vs Actuals

Live tracking of planned financial performance against actual results, with variance alerts and accounting integration.

#### Data Categories

| Category | Key | Description | Example |
|----------|-----|-------------|---------|
| **Revenue** | `revenue` | Planned vs actual revenue | Planned: RM237K, Actual: RM228.6K, Variance: -3.5% |
| **Expense** | `expense` | Planned vs actual expenses | Planned: RM155K, Actual: RM162.4K, Variance: +4.8% |
| **Cash Flow** | `cashflow` | Planned vs actual cash flow | Planned: RM82K, Actual: RM66.2K, Variance: -19.3% |
| **Profit** | `profit` | Planned vs actual profit | Planned: RM82K, Actual: RM66.2K, Variance: -19.3% |

#### Variance Alert System

| Severity | Threshold | Color | Action |
|----------|-----------|-------|--------|
| **Critical** | > 15% variance | 🔴 Red | Immediate attention; may affect loan covenants |
| **Warning** | 5-15% variance | 🟡 Amber | Monitor closely; investigate root cause |
| **Info** | < 5% variance | 🔵 Blue | Within acceptable range; no action needed |

#### Alert Types

| Type | Key | Description |
|------|-----|-------------|
| `revenue_drift` | Revenue Drift | Revenue tracking below plan |
| `expense_over` | Expense Overrun | Expenses exceeding plan |
| `cashflow_warning` | Cash Flow Warning | Cash flow variance exceeding threshold |
| `hire_affordability` | Hire Affordability | Questioning if planned hires are affordable |

#### Data Sources

| Source | Key | Status | Sync Frequency |
|--------|-----|--------|---------------|
| **Manual Entry** | `manual` | ✅ Connected | On-demand |
| **QuickBooks** | `quickbooks` | ❌ Disconnected | Monthly (configurable) |
| **Xero** | `xero` | ❌ Disconnected | Monthly (configurable) |

---

### Module 13: Copilot

AI chat assistant with deep context awareness about business planning, financial forecasting, and agent management.

#### Capabilities

| Capability | Description | Example Prompt |
|-----------|-------------|----------------|
| **Business Planning** | Guide through creating business plans, suggest improvements | "What should I include in my bank loan proposal?" |
| **Financial Analysis** | Explain financial concepts, interpret metrics | "What does a DSCR of 1.45x mean for my loan application?" |
| **Idea Validation** | Assess business ideas, identify risks | "Is my target market of 65M SMEs realistic?" |
| **Plan Review** | Pre-review plans before submission | "Review my plan for bank loan readiness" |
| **Agent Management** | Guide on agent configuration and workflows | "Which agent should handle competitor monitoring?" |
| **General Business** | Answer business questions with ASEAN context | "What are MARA grant requirements?" |

#### Chat Interface Features

- Real-time streaming responses
- Markdown rendering with syntax highlighting
- Context-aware responses using Memory Engine
- Suggested prompts based on current module
- Chat history persistence
- "Clear Chat" option

---

### Module 14: Settings

Organization configuration, integration management, and user preferences.

#### Settings Categories

| Category | Settings |
|----------|---------|
| **Organization** | Company name, industry, size, country, registration number |
| **Integrations** | QuickBooks connection, Xero connection, sync frequency |
| **Preferences** | Default currency, date format, theme (dark/light), language |
| **Notifications** | Email alerts, variance threshold, report schedules |
| **Data Management** | Export all data, import from CSV, backup/restore |

---

### Module 15: OpenClaw Multi-Channel Gateway

A multi-channel messaging gateway that connects GangNiaga AI to 6 messaging platforms with a plugin system, delegate architecture, SOUL.md personality, and automation scheduling.

#### Supported Channels

| Channel | Key | Protocol | Status | Features |
|---------|-----|----------|--------|----------|
| **WhatsApp** | `whatsapp` | Webhook API | ✅ Active | Rich messages, quick replies, media |
| **Telegram** | `telegram` | Bot API | ✅ Active | Inline keyboards, commands, groups |
| **Discord** | `discord` | Gateway API | ✅ Active | Slash commands, embeds, threads |
| **WebChat** | `webchat` | WebSocket | ✅ Active | Real-time chat, typing indicators |
| **Signal** | `signal` | signal-cli | ⚠️ Beta | Encrypted messaging, groups |
| **Slack** | `slack` | Events API | ✅ Active | Blocks, shortcuts, modals |

#### Plugin System (Built-in Tools)

| Plugin | Key | Description | Input | Output |
|--------|-----|-------------|-------|--------|
| **Business Plan Generator** | `generate_business_plan` | Generate complete business plans via chat | Industry, type, company info | 21-section business plan |
| **Idea Validator** | `validate_idea` | Validate business ideas with scoring | Idea description, problem, solution | Validation report with scores |
| **Plan Reviewer** | `review_plan` | Lender-grade plan review | Plan ID, persona type | Review scores + discrepancies |
| **Pitch Deck Creator** | `generate_pitch_deck` | Generate investor/bank/grant pitch decks | Plan ID, template type | Slide deck + Q&A |
| **Financial Forecaster** | `financial_forecast` | AI-powered financial projections | Revenue data, assumptions | Forecast with confidence bands |
| **Market Researcher** | `research_market` | Market data and citation gathering | Industry, geography, query | Market data + citations |

#### Delegate System

| Delegate | Key | Type | Specialization |
|----------|-----|------|----------------|
| **Business Analyst** | `analysis` | analysis | Market analysis, KPI monitoring, competitive intelligence |
| **Financial Advisor** | `financial` | financial | Revenue forecasting, DSCR calculation, financial planning |
| **Research Agent** | `research` | research | Market data collection, citation verification |
| **Plan Review Agent** | `review` | review | Lender-grade plan review with persona analysis |
| **Support Delegate** | `support` | support | Customer support, FAQ handling, escalation |
| **Finance Bot Tier 2** | `finance_t2` | financial | Complex financial queries, deep analysis |
| **Support Agent Tier 1** | `support_t1` | support | First-line support, triage, routing |

#### SOUL.md Personality System

The OpenClaw gateway uses a SOUL.md file to define the AI personality:

```
# GangNiaga AI — SOUL.md

## Identity
You are GangNiaga AI, an autonomous business operating system designed for
ASEAN SMEs. You speak with authority on business planning, financial intelligence,
and market strategy.

## Language
- Primary: English (EN)
- Secondary: Bahasa Melayu (MS) — switch naturally when user speaks BM
- Always bilingual-capable; respond in the language the user uses

## Personality
- Professional but approachable — like a seasoned business consultant
- Data-driven — always cite numbers and sources
- ASEAN-first — reference regional context (MY, SG, ID, TH markets)
- Action-oriented — suggest next steps, not just information

## Boundaries
- Stay within business planning, financial analysis, market research
- Never give legal or tax advice
- Always flag when uncertain — never fabricate data
- Respect privacy — never share user data

## Tone by Channel
- WhatsApp: Concise, bullet-point friendly
- Telegram: Detailed, markdown-enabled
- Discord: Community-oriented, collaborative
- Slack: Professional, structured
- WebChat: Full-featured, interactive
- Signal: Private, encrypted-aware
```

#### Automation Scheduling

| Task | Schedule | Delegate | Description |
|------|----------|----------|-------------|
| **KPI Digest** | Daily 8:00 AM | Business Analyst | Send daily KPI summary to connected channels |
| **Weekly Report** | Monday 9:00 AM | Financial Advisor | Generate and distribute weekly financial report |
| **Market Scan** | Daily 6:00 AM | Research Agent | Scan market trends and send alerts |
| **Plan Check** | Friday 5:00 PM | Plan Review Agent | Review active plans for completeness |

#### Webhook Integrations

| Webhook | Event | Action |
|---------|-------|--------|
| `POST /api/webhooks/telegram` | Incoming Telegram message | Parse command → delegate → AI response → reply |
| `POST /api/webhooks/whatsapp` | Incoming WhatsApp message | Parse message → delegate → AI response → reply |
| `POST /api/webhooks/discord` | Discord interaction | Parse command → delegate → AI response → reply |
| `POST /api/webhooks/slack` | Slack event | Parse event → delegate → AI response → reply |

#### Conversation Persistence

All conversations across channels are persisted using the `GatewayConversation` model:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique conversation ID |
| `channel` | String | Channel type (whatsapp, telegram, etc.) |
| `channelUserId` | String | User ID on the channel |
| `messages` | JSON | Array of message objects |
| `delegate` | String? | Assigned delegate |
| `lastMessageAt` | DateTime | Last message timestamp |
| `organizationId` | String | Owning organization |

---

## Skills System

### Overview

The Skills System provides 30+ built-in capabilities that can be executed by agents or triggered via the OpenClaw gateway. Skills are composable, auto-documented, and support an auto-learn capability for creating new skills from user interactions.

### Built-in Skills

| Category | Skills |
|----------|--------|
| **AI / ML** | ASR (Speech-to-Text), VLM (Vision Language Model), TTS (Text-to-Speech) |
| **Document Generation** | PDF, DOCX, XLSX, PPT |
| **Data Visualization** | Charts (bar, line, pie, scatter, heatmap, radar, etc.) |
| **Web Intelligence** | Web Search, Page Reader, Web Shader Extractor |
| **Communication** | ASR Transcription, VLM Image Analysis |
| **Academic** | AMiner Search, Daily Paper Recommendations |
| **Development** | Skill Creator, Skill Vetter, Fullstack Dev |
| **Financial** | Finance API, Market Data |
| **Media** | Image Generation, Video Understanding |

### Skills API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/skills/list` | GET | List all available skills |
| `/api/skills/execute` | POST | Execute a skill with parameters |
| `/api/skills/learn` | POST | Auto-learn a new skill from interaction |
| `/api/skills/:id` | GET | Get skill details and documentation |

### Execution Engine

```typescript
interface SkillExecution {
  skillId: string;
  input: Record<string, unknown>;
  delegate?: string;        // Optional delegate assignment
  channel?: string;         // Optional channel context
  callbackUrl?: string;     // Optional webhook for async results
}

interface SkillResult {
  success: boolean;
  output: unknown;
  duration: number;
  tokensUsed?: number;
}
```

### Auto-Learn Capability

The auto-learn system can create new skills by observing user interactions:

1. User performs a novel action via any channel
2. System detects the action doesn't match existing skills
3. AI generates a skill definition with input/output schema
4. Skill is saved and available for future execution
5. Skill can be refined through continued usage

---

## AI Provider System

### Multi-Provider Adapter

GangNiaga AI OS supports three AI providers with environment-based selection:

| Provider | Environment | Use Case | Default Model |
|----------|-------------|----------|---------------|
| **ZAI (z-ai-web-dev-sdk)** | Development | Local development, testing | z-ai default |
| **OpenAI** | Production | High-reliability production workloads | gpt-4o |
| **OpenRouter** | Vercel | Scalable deployment with model flexibility | openrouter/owl-alpha |

### OpenRouter Configuration

OpenRouter supports up to 4 API keys with round-robin distribution:

```typescript
interface OpenRouterConfig {
  apiKeys: string[];          // Up to 4 API keys
  currentKeyIndex: number;    // Round-robin pointer
  defaultModel: 'openrouter/owl-alpha';
  baseUrl: 'https://openrouter.ai/api/v1';
}

// Round-robin key selection
function getNextKey(): string {
  const key = config.apiKeys[config.currentKeyIndex];
  config.currentKeyIndex = (config.currentKeyIndex + 1) % config.apiKeys.length;
  return key;
}
```

### AI Capabilities

| Capability | ZAI | OpenAI | OpenRouter |
|-----------|-----|--------|------------|
| **Chat Completions** | ✅ | ✅ | ✅ |
| **Vision (VLM)** | ✅ | ✅ | ✅ |
| **ASR (Speech-to-Text)** | ✅ | ✅ | ❌ |
| **TTS (Text-to-Speech)** | ✅ | ✅ | ❌ |
| **Image Generation** | ✅ | ✅ | ✅ |
| **Web Search** | ✅ | ❌ | ✅ |
| **Page Reader** | ✅ | ❌ | ✅ |

### Default Model Configuration

The default model for production is `openrouter/owl-alpha`, which provides:
- Optimized for business planning and financial analysis
- Strong multi-language support (EN, MS, and other ASEAN languages)
- Cost-effective for high-volume operations
- Compatible with the OpenRouter round-robin key system

---

## 6. Functional Requirements

### FR-01: Dashboard Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01-01 | Display 6 KPI cards with current value, previous value, change %, trend, and target | P0 | ✅ |
| FR-01-02 | KPI cards must be color-coded based on proximity to target (emerald/amber/red) | P0 | ✅ |
| FR-01-03 | Display revenue trend as 12-month area chart using Recharts | P0 | ✅ |
| FR-01-04 | Display revenue vs expenses vs profit as grouped bar chart | P0 | ✅ |
| FR-01-05 | Display expense breakdown as pie chart with category labels | P1 | ✅ |
| FR-01-06 | AI Insights panel with auto-generated recommendations | P1 | ✅ |
| FR-01-07 | Quick Actions panel with navigation shortcuts to key modules | P2 | ✅ |
| FR-01-08 | All charts must support responsive design (mobile → desktop) | P0 | ✅ |
| FR-01-09 | KPI data sourced from Zustand store with API sync capability | P1 | ✅ |

### FR-02: Business Plans Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-02-01 | Display list of all business plans with status indicators | P0 | ✅ |
| FR-02-02 | Support 6 proposal types with type-specific AI prompts | P0 | ✅ |
| FR-02-03 | 21-section structure organized in 6 logical groups | P0 | ✅ |
| FR-02-04 | AI generation per section with proposal-type-specific content | P0 | ✅ |
| FR-02-05 | Bulk "Generate All" capability for all 21 sections | P1 | ✅ |
| FR-02-06 | Inline editing of section content with markdown support | P0 | ✅ |
| FR-02-07 | Create new business plan with title, type, and industry selection | P0 | ✅ |
| FR-02-08 | Delete business plan with confirmation dialog | P1 | ✅ |
| FR-02-09 | Section content rendered as markdown with proper formatting | P0 | ✅ |
| FR-02-10 | Auto-save edits to Zustand store | P1 | ✅ |

### FR-03: Financials Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-03-01 | 6-tab layout: Overview, Revenue, Expenses, Bank Metrics, Statements, Forecast | P0 | ✅ |
| FR-03-02 | DSCR Gauge visual component with animated needle and color zones | P0 | ✅ |
| FR-03-03 | Bank Approval Checklist with status indicators | P1 | ✅ |
| FR-03-04 | P&L Statement with monthly and annual views | P0 | ✅ |
| FR-03-05 | Balance Sheet with standard structure | P1 | ✅ |
| FR-03-06 | Cash Flow Statement with DSCR calculation | P0 | ✅ |
| FR-03-07 | Forecast Advisor with confidence bands (optimistic/base/pessimistic) | P1 | ✅ |
| FR-03-08 | Scenario analysis with interactive assumption sliders | P2 | ✅ |
| FR-03-09 | Revenue modeling with MRR growth and churn analysis | P1 | ✅ |
| FR-03-10 | Expense analysis with fixed vs variable breakdown | P1 | ✅ |

### FR-04: Idea Canvas Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-04-01 | Create new idea with problem, solution, target market, revenue model, competitive edge, risks | P0 | ✅ |
| FR-04-02 | AI validation scoring across 5 dimensions (0-100 scale) | P0 | ✅ |
| FR-04-03 | Validation report with strengths, weaknesses, recommendations, and red flags | P0 | ✅ |
| FR-04-04 | Benchmark comparison table showing user vs industry benchmarks | P1 | ✅ |
| FR-04-05 | Visual score breakdown with progress bars per dimension | P0 | ✅ |
| FR-04-06 | Risk level classification (low/medium/high/critical) | P1 | ✅ |
| FR-04-07 | Status lifecycle: draft → validating → validated/needs_rework | P0 | ✅ |
| FR-04-08 | List view of all idea canvases with status badges | P1 | ✅ |

### FR-05: Plan Review Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-05-01 | Support 3 lender personas: bank, investor, grant_officer | P0 | ✅ |
| FR-05-02 | Narrative score, financial score, consistency score, overall score (0-100) | P0 | ✅ |
| FR-05-03 | Discrepancy detection with 3 severity levels (critical/warning/info) | P0 | ✅ |
| FR-05-04 | Each discrepancy includes narrative claim, financial reality, and suggested fix | P0 | ✅ |
| FR-05-05 | Prioritized recommendations with impact descriptions | P1 | ✅ |
| FR-05-06 | Visual score cards and progress indicators | P0 | ✅ |
| FR-05-07 | Link to existing business plan for review | P0 | ✅ |

### FR-06: Research Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-06-01 | Citation database with 50+ verified sources | P0 | ✅ |
| FR-06-02 | 5 citation types: market_data, industry_report, benchmark, government, financial | P0 | ✅ |
| FR-06-03 | Geography filtering: MY, SEA, Global | P0 | ✅ |
| FR-06-04 | Verification status indicator for each citation | P1 | ✅ |
| FR-06-05 | Data point extraction and display per citation | P1 | ✅ |
| FR-06-06 | Searchable and filterable citation browser | P1 | ✅ |
| FR-06-07 | URL links to original sources | P0 | ✅ |

### FR-07: Agent Console Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-07-01 | Display 8 AI agents with name, type, status, tasks completed, last activity | P0 | ✅ |
| FR-07-02 | Agent status indicators: idle, running, completed, error | P0 | ✅ |
| FR-07-03 | Task list for selected agent with type, status, input, output, duration | P0 | ✅ |
| FR-07-04 | Create new agent with name and type selection | P1 | ✅ |
| FR-07-05 | Agent CRUD operations via API and Zustand store | P0 | ✅ |
| FR-07-06 | Task status lifecycle: pending → running → completed/failed | P0 | ✅ |

### FR-08: Workflows Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-08-01 | Display workflow list with name, type, status, trigger type | P0 | ✅ |
| FR-08-02 | Step-by-step visualization of workflow execution | P0 | ✅ |
| FR-08-03 | 4 trigger types: cron, event, threshold, manual | P0 | ✅ |
| FR-08-04 | Agent assignment per step | P1 | ✅ |
| FR-08-05 | Workflow status: pending, running, completed, failed, paused | P0 | ✅ |
| FR-08-06 | Create new workflow with step configuration | P1 | ✅ |

### FR-09: Memory Engine Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-09-01 | Display memory entries by category (user, workspace, financial, workflow, agent) | P0 | ✅ |
| FR-09-02 | Category filtering and search | P1 | ✅ |
| FR-09-03 | Add, edit, and delete memory entries | P1 | ✅ |
| FR-09-04 | Memory persistence across sessions via database | P0 | ✅ |

### FR-10: Pitch Deck Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-10-01 | Support 3 template types: investor, bank, grant | P0 | ✅ |
| FR-10-02 | AI slide generation linked to business plan sections | P0 | ✅ |
| FR-10-03 | 9 slide types with appropriate content templates | P0 | ✅ |
| FR-10-04 | Anticipated questions with difficulty ratings and suggested answers | P1 | ✅ |
| FR-10-05 | Slide data points extracted from business plan financials | P1 | ✅ |
| FR-10-06 | Create, edit, and delete pitch decks | P0 | ✅ |

### FR-11: Reports Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-11-01 | 5 report types: investor, board, financial, kpi, operational | P0 | ✅ |
| FR-11-02 | 4 output formats: PDF, DOCX, XLSX, CSV | P0 | ✅ |
| FR-11-03 | Report generation with AI-powered content | P0 | ✅ |
| FR-11-04 | Report status tracking: generating → completed/failed | P0 | ✅ |
| FR-11-05 | Report list with type, format, and creation date | P1 | ✅ |

### FR-12: Plan vs Actuals Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-12-01 | Track planned vs actual amounts for revenue, expense, cashflow, profit | P0 | ✅ |
| FR-12-02 | Variance calculation (absolute and percentage) | P0 | ✅ |
| FR-12-03 | Variance alerts with 3 severity levels (critical/warning/info) | P0 | ✅ |
| FR-12-04 | Integration status display for QuickBooks, Xero, and manual sources | P1 | ✅ |
| FR-12-05 | Manual data entry for actual amounts | P0 | ✅ |
| FR-12-06 | Visual comparison charts (planned vs actual bar charts) | P1 | ✅ |

### FR-13: Copilot Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-13-01 | Chat interface with user and assistant messages | P0 | ✅ |
| FR-13-02 | Real-time AI responses via z-ai-web-dev-sdk | P0 | ✅ |
| FR-13-03 | Context-aware responses using Memory Engine data | P1 | ✅ |
| FR-13-04 | Markdown rendering of AI responses | P0 | ✅ |
| FR-13-05 | Chat history persistence in Zustand store | P1 | ✅ |
| FR-13-06 | Clear chat functionality | P2 | ✅ |
| FR-13-07 | Suggested prompts based on current module context | P2 | ✅ |

### FR-14: Settings Module

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-14-01 | Organization settings display and editing | P1 | ✅ |
| FR-14-02 | Integration management (QuickBooks, Xero connection status) | P1 | ✅ |
| FR-14-03 | User preference configuration | P2 | ✅ |
| FR-14-04 | Theme toggle (dark/light mode) | P1 | ✅ |

### FR-15: Cross-Cutting Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-15-01 | Command palette (⌘K) for quick navigation and actions | P1 | ✅ |
| FR-15-02 | Collapsible sidebar navigation with module icons | P0 | ✅ |
| FR-15-03 | Dark mode as default theme with light mode option | P0 | ✅ |
| FR-15-04 | Responsive design (mobile-first, breakpoints: sm/md/lg/xl) | P0 | ✅ |
| FR-15-05 | Framer Motion animations on page transitions and interactions | P1 | ✅ |
| FR-15-06 | Consistent emerald/teal/amber color palette (no blue/indigo) | P0 | ✅ |
| FR-15-07 | All data managed through Zustand store with API sync | P0 | ✅ |

---

## 7. Non-Functional Requirements

### NFR-01: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01-01 | Initial page load time (LCP) | < 2.5 seconds |
| NFR-01-02 | Time to Interactive (TTI) | < 3.5 seconds |
| NFR-01-03 | First Contentful Paint (FCP) | < 1.5 seconds |
| NFR-01-04 | AI response latency (time to first token) | < 2 seconds |
| NFR-01-05 | Module navigation (client-side) | < 200ms |
| NFR-01-06 | Chart rendering time | < 500ms |
| NFR-01-07 | Zustand state update propagation | < 16ms (60fps) |
| NFR-01-08 | API route response time (non-AI) | < 300ms |

### NFR-02: Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-02-01 | Application uptime | 99.5% |
| NFR-02-02 | AI API retry on failure | 3 retries with exponential backoff |
| NFR-02-03 | Graceful degradation when AI service is unavailable | Show cached/stored data with offline indicator |
| NFR-02-04 | Data loss prevention | All mutations persisted to SQLite via Prisma |
| NFR-02-05 | Error boundary per module | Module errors don't crash the entire application |

### NFR-03: Security

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-03-01 | API key exposure prevention | z-ai-web-dev-sdk used only in API routes (server-side) |
| NFR-03-02 | Input validation | All API inputs validated with Zod schemas |
| NFR-03-03 | SQL injection prevention | Prisma parameterized queries (no raw SQL) |
| NFR-03-04 | XSS prevention | React built-in escaping + DOMPurify for markdown |
| NFR-03-05 | CSRF protection | Next.js built-in CSRF tokens |
| NFR-03-06 | Database file protection | SQLite file outside public directory |

### NFR-04: Usability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-04-01 | Learning curve for new users | < 15 minutes to create first business plan |
| NFR-04-02 | Mobile responsiveness | Full functionality on screens ≥ 375px width |
| NFR-04-03 | Accessibility (WCAG 2.1) | Level AA compliance |
| NFR-04-04 | Color contrast ratio | ≥ 4.5:1 for text, ≥ 3:1 for large text |
| NFR-04-05 | Touch target size | ≥ 44px × 44px for all interactive elements |
| NFR-04-06 | Keyboard navigation | Full keyboard accessibility for all interactive elements |
| NFR-04-07 | Screen reader support | ARIA labels on all interactive elements |
| NFR-04-08 | Loading states | Skeleton/spinner for any operation > 300ms |

### NFR-05: Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-05-01 | Concurrent users (single instance) | Up to 50 simultaneous users |
| NFR-05-02 | Business plans per organization | Unlimited (SQLite dependent) |
| NFR-05-03 | Chat message history | Up to 10,000 messages per conversation |
| NFR-05-04 | Citation database | 50+ sources, expandable to 500+ |
| NFR-05-05 | Memory entries per organization | Up to 1,000 entries |

### NFR-06: Maintainability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-06-01 | TypeScript strict mode | 100% type coverage, no `any` types |
| NFR-06-02 | Component reusability | shadcn/ui components for all UI primitives |
| NFR-06-03 | Code organization | Modules in separate files, shared types in `types.ts` |
| NFR-06-04 | State management | Single Zustand store with clear action patterns |
| NFR-06-05 | API consistency | Consistent error handling and response format |

---

## 8. User Stories

### Dashboard

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-01-01 | As a founder, I want to see my key financial KPIs at a glance so I can quickly assess business health | 6 KPI cards are visible with current value, change %, trend arrow, and target indicator |
| US-01-02 | As a founder, I want to see revenue trends over time so I can identify growth patterns | 12-month area chart displays revenue data with smooth curves |
| US-01-03 | As a founder, I want to compare revenue vs expenses vs profit so I understand my margin trends | Grouped bar chart shows all 3 metrics per month |
| US-01-04 | As a founder, I want AI-generated insights about my business so I can catch issues early | AI Insights panel shows at least 3 auto-generated insights |
| US-01-05 | As a founder, I want quick action buttons to navigate to key modules | Quick Actions panel has 4+ shortcut buttons |

### Business Plans

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-02-01 | As a founder, I want to create a professional business proposal for a bank loan so I can secure financing | Can create a bank_loan type plan and AI-generate all 21 sections with bank-appropriate content |
| US-02-02 | As a founder, I want to generate individual sections with AI so I can iterate on specific parts | Each section has an "AI Generate" button that creates proposal-type-specific content |
| US-02-03 | As a founder, I want to generate all sections at once so I can get a complete first draft quickly | "Generate All" button generates all 21 sections sequentially |
| US-02-04 | As a founder, I want to edit sections inline so I can customize AI-generated content | Click on any section content to enter edit mode with markdown support |
| US-02-05 | As a founder, I want my plan to be tailored for different audiences (bank, VC, grant) so I present the right information | Each proposal type generates content with appropriate tone, emphasis, and structure |
| US-02-06 | As a founder, I want to see which sections are complete so I can track my progress | Section status indicators show draft/generated/reviewed/finalized |

### Financials

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-03-01 | As a founder, I want to see my DSCR visually so I understand if I qualify for a bank loan | DSCR Gauge displays current ratio with color zones and bank minimum line |
| US-03-02 | As a founder, I want to see a bank approval checklist so I know what's missing | Checklist shows required items with ✅/❌/⚠️ status indicators |
| US-03-03 | As a founder, I want AI-powered financial forecasts so I can project future performance | Forecast Advisor generates predictions with confidence bands |
| US-03-04 | As a founder, I want to see my P&L, Balance Sheet, and Cash Flow so I have professional financial statements | 3 financial statement tabs with proper accounting structure |
| US-03-05 | As a founder, I want to run "what-if" scenarios so I can plan for different outcomes | Scenario analysis with adjustable assumptions |

### Idea Canvas

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-04-01 | As a founder, I want to validate my business idea with AI so I don't waste time on bad ideas | AI scores idea across 5 dimensions and produces validation report |
| US-04-02 | As a founder, I want to see red flags in my idea so I can address critical weaknesses | Red flags are highlighted with clear descriptions |
| US-04-03 | As a founder, I want to compare my idea against industry benchmarks so I know where I stand | Benchmark comparison table shows user metrics vs industry standards |
| US-04-04 | As a founder, I want actionable recommendations so I can improve my idea | Recommendations are prioritized and specific |

### Plan Review

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-05-01 | As a founder, I want my plan reviewed like a bank would so I can fix issues before submission | Bank persona review generates scores and bank-specific discrepancies |
| US-05-02 | As a founder, I want to see where my narrative contradicts my financials so I can maintain credibility | Discrepancy list shows narrative claim vs financial reality for each issue |
| US-05-03 | As a founder, I want prioritized recommendations so I know what to fix first | Recommendations are sorted by priority (high → medium → low) with impact descriptions |
| US-05-04 | As a founder, I want to choose different lender perspectives so I can tailor my plan | 3 lender personas available: bank, investor, grant_officer |

### Research

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-06-01 | As a founder, I want access to verified market data so my plan has credible citations | Citation database contains 50+ verified sources with URLs |
| US-06-02 | As a founder, I want to filter citations by geography so I find locally relevant data | Geography filter supports MY, SEA, and Global |
| US-06-03 | As a founder, I want to verify data sources so I trust the information in my plan | Each citation has a verification status indicator |

### Agents

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-07-01 | As a founder, I want to see what my AI agents are doing so I can monitor their work | Agent list shows name, status, tasks completed, and last activity |
| US-07-02 | As a founder, I want to see task details for each agent so I understand what work is being done | Task list shows type, status, input, output, and duration |
| US-07-03 | As a founder, I want to create new agents so I can expand my AI workforce | "Add Agent" form with name and type selection |

### Workflows

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-08-01 | As a founder, I want to automate repetitive tasks so I save time | Can create multi-step workflows with trigger types |
| US-08-02 | As a founder, I want to see workflow step progress so I know where automation stands | Step-by-step visualization with status per step |
| US-08-03 | As a founder, I want different trigger types so workflows run when I need them | 4 trigger types: cron, event, threshold, manual |

### Copilot

| ID | User Story | Acceptance Criteria |
|----|-----------|-------------------|
| US-13-01 | As a founder, I want to chat with an AI that knows my business so I get relevant advice | Copilot uses Memory Engine for context-aware responses |
| US-13-02 | As a founder, I want to ask about financial concepts so I understand what banks require | Copilot can explain DSCR, P&L, cash flow, etc. in plain language |
| US-13-03 | As a founder, I want to ask about my business metrics so I get real-time insights | Copilot accesses current KPI data from the store |

---

## 9. Data Models

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐
│     User     │──────▶│   Organization   │
│──────────────│  1:N  │──────────────────│
│ id           │       │ id               │
│ email        │       │ name             │
│ name         │       │ slug             │
│ avatar       │       │ industry         │
│ role         │       │ size             │
│ createdAt    │       │ country          │
│ updatedAt    │       └────────┬─────────┘
└──────────────┘                │ 1:N
                                │
        ┌───────────┬───────────┼───────────┬──────────────┐
        │           │           │           │              │
        ▼           ▼           ▼           ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ BusinessPlan │ │  Forecast    │ │ AgentSession │ │ WorkflowRun  │
│──────────────│ │──────────────│ │──────────────│ │──────────────│
│ id           │ │ id           │ │ id           │ │ id           │
│ title        │ │ name         │ │ name         │ │ name         │
│ status       │ │ type         │ │ type         │ │ type         │
│ sections...  │ │ period       │ │ status       │ │ status       │
│ proposalType │ │ data (JSON)  │ │ tasksCompleted│ │ triggerType  │
└──────────────┘ └──────────────┘ │ config (JSON)│ │ steps (JSON) │
                                 └──────┬───────┘ └──────────────┘
                                        │ 1:N
                                        ▼
                                 ┌──────────────┐
                                 │  AgentTask   │
                                 │──────────────│
                                 │ id           │
                                 │ sessionId    │
                                 │ type         │
                                 │ status       │
                                 │ input        │
                                 │ output       │
                                 │ duration     │
                                 └──────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  KPIData     │ │   Report     │ │ AgentMemory  │ │ IdeaCanvas   │
│──────────────│ │──────────────│ │──────────────│ │──────────────│
│ id           │ │ id           │ │ id           │ │ id           │
│ metric       │ │ title        │ │ type         │ │ title        │
│ value        │ │ type         │ │ category     │ │ status       │
│ previousValue│ │ status       │ │ content      │ │ problem      │
│ target       │ │ content(JSON)│ │ embedding    │ │ solution     │
│ unit         │ │ format       │ │              │ │ targetMarket │
│ period       │ └──────────────┘ └──────────────┘ │ revenueModel │
└──────────────┘                                    │ validationScore│
                                                    │ validationReport│
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ └──────────────┘
│ PlanReview   │ │ PlanActual   │ │ PitchDeck    │
│──────────────│ │──────────────│ │──────────────│ ┌──────────────┐
│ id           │ │ id           │ │ id           │ │  Citation    │
│ planId       │ │ category     │ │ title        │ │──────────────│
│ status       │ │ period       │ │ status       │ │ id           │
│ lenderPersona│ │ plannedAmt   │ │ templateType │ │ source       │
│ scores...    │ │ actualAmt    │ │ slides(JSON) │ │ url          │
│ discrepancies│ │ variance     │ │ questions    │ │ type         │
│ recommend.   │ │ source       │ │ planId       │ │ geography    │
│ fullReport   │ └──────────────┘ └──────────────┘ │ verified     │
└──────────────┘                                    └──────────────┘

                                                    ┌──────────────┐
                                                    │ Integration  │
                                                    │──────────────│
                                                    │ id           │
                                                    │ type         │
                                                    │ status       │
                                                    │ lastSync     │
                                                    │ syncFrequency│
                                                    │ config (JSON)│
                                                    └──────────────┘
```

### Complete Schema Definition

#### User

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `email` | String | @unique | User email address |
| `name` | String? | Optional | Display name |
| `avatar` | String? | Optional | Avatar URL |
| `role` | String | @default("owner") | Role within organization |
| `organizationId` | String? | FK → Organization | Associated organization |
| `createdAt` | DateTime | @default(now()) | Creation timestamp |
| `updatedAt` | DateTime | @updatedAt | Last update timestamp |

#### Organization

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `name` | String | Required | Organization name |
| `slug` | String | @unique | URL-friendly identifier |
| `industry` | String? | Optional | Business industry |
| `size` | String? | Optional | Company size category |
| `country` | String? | Optional | Country code (MY, SG, etc.) |
| `createdAt` | DateTime | @default(now()) | Creation timestamp |
| `updatedAt` | DateTime | @updatedAt | Last update timestamp |

**Relations**: Users, BusinessPlans, Forecasts, AgentSessions, WorkflowRuns, Reports, KPIDatas, AgentMemories, IdeaCanvases, PlanReviews, PlanActuals, PitchDecks, Citations, Integrations (all 1:N)

#### BusinessPlan

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `title` | String | Required | Plan title |
| `status` | String | @default("draft") | draft/in_progress/completed/archived |
| `executiveSummary` | String? | Optional | Executive summary content |
| `marketAnalysis` | String? | Optional | Market analysis content |
| `swotAnalysis` | String? | Optional | SWOT analysis content |
| `competitorAnalysis` | String? | Optional | Competitor analysis content |
| `financialPlan` | String? | Optional | Financial plan content |
| `riskAnalysis` | String? | Optional | Risk analysis content |
| `recommendations` | String? | Optional | Recommendations content |
| `organizationId` | String | FK → Organization | Owning organization |

*Note: Full 21-section content is stored in the Zustand store's `ProposalSections` type and persisted through API calls. The database schema captures the primary sections, with extended sections stored as needed.*

#### Forecast

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `name` | String | Required | Forecast name |
| `type` | String | @default("revenue") | revenue/expense/cashflow/profit |
| `period` | String | Required | Time period |
| `data` | String | Required | JSON-encoded chart data points |
| `organizationId` | String | FK → Organization | Owning organization |

#### AgentSession

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `name` | String | Required | Agent display name |
| `type` | String | @default("general") | analysis/financial/research/reporting/browser/crm/review/citation |
| `status` | String | @default("idle") | idle/running/completed/error |
| `tasksCompleted` | Int | @default(0) | Total completed tasks |
| `lastActivity` | DateTime? | Optional | Last activity timestamp |
| `config` | String? | Optional | JSON-encoded configuration |
| `organizationId` | String | FK → Organization | Owning organization |

**Relations**: AgentTasks (1:N)

#### AgentTask

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `sessionId` | String | FK → AgentSession | Parent session |
| `type` | String | Required | Task type |
| `status` | String | @default("pending") | pending/running/completed/failed |
| `input` | String? | Optional | Task input description |
| `output` | String? | Optional | Task output/result |
| `duration` | Int? | Optional | Execution duration in seconds |

#### AgentMemory

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `type` | String | @default("workspace") | user/workspace/financial/workflow/agent |
| `category` | String? | Optional | Sub-category label |
| `content` | String | Required | Memory content text |
| `embedding` | String? | Optional | Vector embedding for semantic search |
| `organizationId` | String | FK → Organization | Owning organization |

#### WorkflowRun

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `name` | String | Required | Workflow name |
| `type` | String | @default("scheduled") | scheduled/event/threshold |
| `status` | String | @default("pending") | pending/running/completed/failed/paused |
| `triggerType` | String | @default("manual") | cron/event/threshold/manual/daily/weekly/monthly |
| `steps` | String? | Optional | JSON-encoded workflow steps |
| `organizationId` | String | FK → Organization | Owning organization |

#### KPIData

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `metric` | String | Required | KPI metric name |
| `value` | Float | Required | Current value |
| `previousValue` | Float? | Optional | Previous period value |
| `target` | Float? | Optional | Target value |
| `unit` | String | @default("currency") | currency/ratio/months/percent |
| `period` | String | Required | Measurement period |
| `organizationId` | String | FK → Organization | Owning organization |

#### Report

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `title` | String | Required | Report title |
| `type` | String | @default("investor") | investor/board/financial/kpi/operational |
| `status` | String | @default("generated") | generating/completed/failed |
| `content` | String? | Optional | JSON-encoded report content |
| `format` | String | @default("pdf") | pdf/docx/xlsx/csv |
| `organizationId` | String | FK → Organization | Owning organization |

#### IdeaCanvas

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `title` | String | Required | Idea title |
| `status` | String | @default("draft") | draft/validating/validated/needs_rework |
| `problem` | String? | Optional | Problem statement |
| `solution` | String? | Optional | Proposed solution |
| `targetMarket` | String? | Optional | Target market description |
| `revenueModel` | String? | Optional | Revenue model description |
| `competitiveEdge` | String? | Optional | Competitive advantages |
| `risks` | String? | Optional | JSON-encoded risk array |
| `validationScore` | Float? | @default(0) | Overall score (0-100) |
| `validationReport` | String? | Optional | JSON-encoded validation report |
| `organizationId` | String | FK → Organization | Owning organization |

#### PlanReview

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `planId` | String | Required | Linked business plan ID |
| `status` | String | @default("pending") | pending/running/completed |
| `lenderPersona` | String | @default("bank") | bank/investor/grant_officer |
| `narrativeScore` | Float? | @default(0) | Narrative quality (0-100) |
| `financialScore` | Float? | @default(0) | Financial accuracy (0-100) |
| `consistencyScore` | Float? | @default(0) | Narrative-financial alignment (0-100) |
| `overallScore` | Float? | @default(0) | Weighted composite (0-100) |
| `discrepancies` | String? | Optional | JSON-encoded discrepancy array |
| `recommendations` | String? | Optional | JSON-encoded recommendation array |
| `fullReport` | String? | Optional | JSON-encoded full report |
| `organizationId` | String | FK → Organization | Owning organization |

#### PlanActual

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `category` | String | Required | revenue/expense/cashflow/profit |
| `period` | String | Required | Period (YYYY-MM) |
| `plannedAmount` | Float | @default(0) | Budgeted/planned amount |
| `actualAmount` | Float? | @default(0) | Actual realized amount |
| `variance` | Float? | @default(0) | Absolute variance |
| `variancePercent` | Float? | @default(0) | Percentage variance |
| `source` | String | @default("manual") | manual/quickbooks/xero |
| `organizationId` | String | FK → Organization | Owning organization |

#### PitchDeck

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `title` | String | Required | Deck title |
| `status` | String | @default("draft") | draft/generating/completed |
| `planId` | String? | Optional | Linked business plan ID |
| `templateType` | String | @default("investor") | investor/bank/grant |
| `slides` | String? | Optional | JSON-encoded slide array |
| `slideCount` | Int | @default(0) | Total slide count |
| `anticipatedQuestions` | String? | Optional | JSON-encoded question array |
| `organizationId` | String | FK → Organization | Owning organization |

#### Citation

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `source` | String | Required | Source name |
| `url` | String? | Optional | Source URL |
| `type` | String | @default("market_data") | market_data/industry_report/benchmark/government/financial |
| `geography` | String? | Optional | MY/SEA/Global |
| `datePublished` | String? | Optional | Publication date |
| `dataPoint` | String? | Optional | Extracted data point |
| `verified` | Boolean | @default(false) | Verification status |
| `organizationId` | String | FK → Organization | Owning organization |

#### Integration

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | @id @default(cuid()) | Unique identifier |
| `type` | String | Required | quickbooks/xero/manual |
| `status` | String | @default("disconnected") | connected/disconnected/error |
| `lastSync` | DateTime? | Optional | Last successful sync time |
| `syncFrequency` | String | @default("monthly") | daily/weekly/monthly |
| `config` | String? | Optional | JSON-encoded configuration |
| `organizationId` | String | FK → Organization | Owning organization |

---

## 10. AI/ML Requirements

### AI SDK: z-ai-web-dev-sdk

All AI operations use the `z-ai-web-dev-sdk` package, which MUST only be used on the server side (API routes).

#### AI Operations Map

| Operation | API Route | SDK Function | Input | Output |
|-----------|-----------|-------------|-------|--------|
| **Copilot Chat** | `/api/chat` | Chat completion | User message + context | Streaming text response |
| **Section Generation** | `/api/business-plan` | Chat completion | Section key + proposal type + context | Markdown content |
| **Idea Validation** | `/api/idea-canvas` | Chat completion | Idea fields (problem, solution, etc.) | Structured validation report (JSON) |
| **Plan Review** | `/api/plan-review` | Chat completion | Plan content + lender persona | Structured review (scores, discrepancies, recommendations) |
| **Financial Forecast** | `/api/forecast` | Chat completion | Financial data + assumptions | Forecast with confidence bands |
| **Report Generation** | `/api/reports` | Chat completion | Report type + data scope | Formatted report content |
| **Pitch Deck Generation** | `/api/pitch-deck` | Chat completion | Plan content + template type | Slide content + anticipated questions |
| **Dashboard Aggregation** | `/api/dashboard` | Data aggregation (non-AI) | Organization ID | KPI data, chart data |

### AI Prompt Architecture

#### System Prompts

Each API route uses a specialized system prompt tailored to its function:

**Business Plan Section Generation**
```
You are a professional business proposal writer specializing in {proposalType} proposals
for Southeast Asian SMEs. Generate the {sectionName} section with the following focus:
{proposalTypeSpecificGuidance}

Context:
- Company: {companyName}
- Industry: {industry}
- Target Market: {targetMarket}

Requirements:
- Professional tone appropriate for {proposalType} audience
- Include specific data points and citations where applicable
- Use markdown formatting for structure
- ASEAN market context with regional data
```

**Idea Validation**
```
You are an expert business idea validator with deep knowledge of Southeast Asian markets.
Evaluate the following business idea across 5 dimensions:
1. Market Viability (25%) — Size, growth, timing
2. Problem Clarity (20%) — Real, urgent, well-defined?
3. Solution Feasibility (20%) — Can the team build this?
4. Revenue Potential (20%) — Path to revenue, unit economics
5. Competitive Position (15%) — Differentiation, moat

Return a structured JSON validation report with:
- Scores (0-100) for each dimension
- Overall score and risk level
- Strengths, weaknesses, recommendations
- Red flags (if any)
- Benchmark comparisons against industry standards
```

**Plan Review**
```
You are a {lenderPersona} evaluating a business proposal.
{personaSpecificGuidance}

Review the following business plan for:
1. Narrative quality and completeness (score 0-100)
2. Financial accuracy and realism (score 0-100)
3. Consistency between narrative claims and financial data (score 0-100)

Identify discrepancies with severity levels (critical/warning/info).
Each discrepancy must include: narrative claim, financial reality, suggested fix.

Provide prioritized recommendations with impact descriptions.
```

### AI Response Schema

All AI responses that return structured data must follow a consistent schema:

```typescript
interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed?: number;
  latencyMs?: number;
}
```

### AI Safety & Guardrails

| Guardrail | Implementation |
|-----------|---------------|
| **Hallucination prevention** | Citations must reference verified sources; AI responses cross-checked against stored data |
| **Financial accuracy** | AI financial projections include confidence bands and methodology notes |
| **Content boundaries** | System prompts restrict AI to business planning domain; no personal advice |
| **Data privacy** | No user data sent to external services beyond z-ai-web-dev-sdk; all data stays in SQLite |
| **Rate limiting** | API routes implement rate limiting to prevent abuse |
| **Error handling** | AI failures show graceful fallback messages; 3 retries with exponential backoff |

---

## 11. Integration Requirements

### Accounting Software Integrations

#### QuickBooks Integration

| Aspect | Detail |
|--------|--------|
| **Purpose** | Import actual revenue/expense data for Plan vs Actuals module |
| **Data Synced** | Revenue, expenses, cash flow by period |
| **Sync Direction** | QuickBooks → GangNiaga (read-only) |
| **Sync Frequency** | Configurable: daily, weekly, monthly |
| **Auth Method** | OAuth 2.0 |
| **Status** | Disconnected (UI placeholder; future implementation) |

#### Xero Integration

| Aspect | Detail |
|--------|--------|
| **Purpose** | Import actual revenue/expense data for Plan vs Actuals module |
| **Data Synced** | Revenue, expenses, cash flow by period |
| **Sync Direction** | Xero → GangNiaga (read-only) |
| **Sync Frequency** | Configurable: daily, weekly, monthly |
| **Auth Method** | OAuth 2.0 |
| **Status** | Disconnected (UI placeholder; future implementation) |

### Internal Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                  Data Flow Between Modules                    │
│                                                              │
│  Idea Canvas ──validated──▶ Business Plans                  │
│  Business Plans ──reviewed──▶ Plan Review                   │
│  Business Plans ──converted──▶ Pitch Deck                   │
│  Financials ──feeds──▶ Business Plans (financialForecast)   │
│  Financials ──feeds──▶ Dashboard (KPIs)                     │
│  Financials ──feeds──▶ Plan vs Actuals (planned amounts)    │
│  Research ──citations──▶ Business Plans                     │
│  Research ──citations──▶ Pitch Deck                         │
│  Plan Review ──recommendations──▶ Business Plans (edits)    │
│  Plan vs Actuals ──variance──▶ Dashboard (alerts)           │
│  Memory Engine ──context──▶ Copilot                         │
│  Memory Engine ──context──▶ All AI generation               │
│  Agents ──execute──▶ All modules                            │
│  Workflows ──orchestrate──▶ Agents                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### API Route Integration

| Route | Method | Input | Output | AI Operation |
|-------|--------|-------|--------|-------------|
| `/api/chat` | POST | `{ messages, context }` | Streaming response | Copilot chat |
| `/api/business-plan` | POST | `{ sectionKey, proposalType, context }` | `{ content }` | Section generation |
| `/api/agents` | GET | — | `{ agents }` | None (CRUD) |
| `/api/agents` | POST | `{ name, type }` | `{ agent }` | None (CRUD) |
| `/api/dashboard` | GET | — | `{ kpis, revenueData, expenseData }` | None (aggregation) |
| `/api/forecast` | POST | `{ type, assumptions, data }` | `{ forecast, confidence }` | Financial analysis |
| `/api/reports` | POST | `{ type, format, scope }` | `{ report }` | Report generation |
| `/api/idea-canvas` | POST | `{ idea }` | `{ validationReport }` | Idea validation |
| `/api/plan-review` | POST | `{ planId, lenderPersona }` | `{ review }` | Plan review |
| `/api/pitch-deck` | POST | `{ planId, templateType }` | `{ slides, questions }` | Slide + question generation |

### Gateway Configuration

All API requests use relative paths with the `XTransformPort` query parameter for cross-service routing:

```typescript
// ✅ Correct
fetch('/api/chat', { method: 'POST', body: JSON.stringify(payload) })

// ❌ Incorrect
fetch('http://localhost:3000/api/chat', { method: 'POST', body: JSON.stringify(payload) })

// For mini-services on different ports
fetch('/api/ws?XTransformPort=3003')
```

---

## 12. Success Metrics & KPIs

### Product KPIs

| Metric | Target (Month 3) | Target (Month 6) | Target (Year 1) |
|--------|-------------------|-------------------|------------------|
| **Registered Organizations** | 50 | 200 | 1,000 |
| **Business Plans Created** | 100 | 500 | 3,000 |
| **AI Sections Generated** | 500 | 3,000 | 20,000 |
| **Plan Reviews Completed** | 50 | 250 | 1,500 |
| **Pitch Decks Generated** | 30 | 150 | 1,000 |
| **Ideas Validated** | 75 | 400 | 2,500 |
| **Copilot Conversations** | 200 | 1,000 | 5,000 |
| **Reports Generated** | 50 | 300 | 2,000 |

### User Engagement KPIs

| Metric | Target |
|--------|--------|
| **Daily Active Users (DAU)** | 40% of registered users |
| **Weekly Active Users (WAU)** | 65% of registered users |
| **Average Session Duration** | 15+ minutes |
| **Modules Used per Session** | 2.5+ |
| **AI Generation per User per Week** | 5+ |
| **Plan Completion Rate** | 60% of started plans reach "completed" status |

### Business Impact KPIs

| Metric | Target |
|--------|--------|
| **Loan/Grant Success Rate** | Users who complete Plan Review have 40% higher approval rate |
| **Time to First Business Plan** | < 30 minutes from registration |
| **Time Savings** | 70% reduction vs. manual business plan creation |
| **AI Accuracy** | 85%+ of AI-generated content retained without major edits |
| **Plan Review Accuracy** | 80%+ of flagged discrepancies confirmed by users |

### Technical KPIs

| Metric | Target |
|--------|--------|
| **Page Load (LCP)** | < 2.5 seconds |
| **AI Response Latency** | < 2 seconds to first token |
| **Application Uptime** | 99.5% |
| **Error Rate** | < 0.5% of API calls |
| **Lighthouse Performance Score** | 90+ |
| **Accessibility Score** | 95+ |

---

## 13. Future Roadmap

### Phase 1: Foundation (Current — Q1 2025)

| Feature | Status | Description |
|---------|--------|-------------|
| 14 Core Modules | ✅ Complete | All modules implemented with mock data |
| 9 API Routes | ✅ Complete | AI integration endpoints |
| 15 Database Models | ✅ Complete | Prisma schema with SQLite |
| 8 AI Agents | ✅ Complete | Agent console with task management |
| Dark Mode | ✅ Complete | Emerald/teal/amber theme |
| Command Palette | ✅ Complete | ⌘K navigation |
| Responsive Design | ✅ Complete | Mobile-first layout |

### Phase 2: Real AI Integration (Q2 2025)

| Feature | Priority | Description |
|---------|----------|-------------|
| Live AI Section Generation | P0 | Replace mock AI with real z-ai-web-dev-sdk calls |
| Streaming Copilot Responses | P0 | Server-sent events for real-time chat |
| Real Plan Review Engine | P0 | AI-powered discrepancy detection |
| Financial Forecast AI | P1 | Confidence bands and scenario analysis |
| Citation Auto-Embed | P1 | AI automatically cites relevant sources in plans |
| Memory Context Integration | P1 | Copilot uses persistent memory for context |

### Phase 3: Integrations & Collaboration (Q3 2025)

| Feature | Priority | Description |
|---------|----------|-------------|
| QuickBooks OAuth Integration | P0 | Real data sync for Plan vs Actuals |
| Xero OAuth Integration | P0 | Real data sync for Plan vs Actuals |
| Multi-User Collaboration | P1 | Real-time editing with conflict resolution |
| Export to PDF/DOCX | P1 | Real document generation |
| Export to XLSX/CSV | P1 | Real spreadsheet generation |
| Email Notifications | P2 | Workflow alerts and report delivery |

### Phase 4: Intelligence & Scale (Q4 2025)

| Feature | Priority | Description |
|---------|----------|-------------|
| Vector Search for Memory | P1 | Semantic search across all memories |
| Workflow Auto-Suggestion | P2 | AI suggests workflows based on patterns |
| Anomaly Detection | P1 | Auto-detect unusual financial patterns |
| Multi-Currency Support | P1 | RM, SGD, IDR, THB, PHP, VND |
| Localization (Bahasa Melayu) | P2 | Full BM language support |
| SOC2 Compliance | P1 | Security certification for enterprise |

### Phase 5: Platform Expansion (2026)

| Feature | Priority | Description |
|---------|----------|-------------|
| Indonesia Market Launch | P0 | Bahasa Indonesia, local integrations |
| Thailand Market Launch | P1 | Thai language, local compliance |
| Mobile App (React Native) | P1 | Native mobile experience |
| API Marketplace | P2 | Third-party integrations |
| White-Label Platform | P2 | For banks and accelerators |
| Advanced Agent Training | P1 | Custom agent training on company data |

### Long-Term Vision (2027+)

| Feature | Description |
|---------|-------------|
| **Full Autonomous Business OS** | AI agents handle 80%+ of routine business operations |
| **Predictive Business Intelligence** | AI predicts market shifts, customer churn, cash flow crises before they happen |
| **Cross-Border Business Management** | Single platform managing businesses across all ASEAN countries |
| **AI-Native Banking Integration** | Direct integration with ASEAN banks for loan applications, credit scoring |
| **GangNiaga Marketplace** | Platform for SMEs to find service providers, funded by marketplace commissions |

---

## 14. Appendix

### A. Technology Stack Reference

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 16 | App Router, SSR, API routes |
| Language | TypeScript | 5 | Type-safe development |
| Styling | Tailwind CSS | 4 | Utility-first CSS |
| UI Library | shadcn/ui | Latest | 50+ accessible components |
| State Management | Zustand | 5 | Client-side state |
| Server State | TanStack Query | 5 | API caching and sync |
| Database | SQLite | 3 | Embedded database |
| ORM | Prisma | 6 | Database access layer |
| Charts | Recharts | 2 | Data visualization |
| Animation | Framer Motion | 12 | UI animations |
| AI SDK | z-ai-web-dev-sdk | 0.0.17 | AI chat and generation |
| Icons | Lucide React | 0.525+ | Icon library |
| Forms | React Hook Form | 7 | Form management |
| Validation | Zod | 4 | Schema validation |
| Authentication | NextAuth.js | 4 | Auth framework |
| Date Utilities | date-fns | 4 | Date manipulation |
| Theme | next-themes | 0.4 | Dark/light mode |
| Notifications | Sonner | 2 | Toast notifications |
| Markdown | react-markdown | 10 | Markdown rendering |
| Drag & Drop | @dnd-kit | 6+ | Drag and drop |
| Tables | @tanstack/react-table | 8 | Advanced tables |

### B. Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--primary` | Emerald-600 | Emerald-500 | Primary actions, links, highlights |
| `--primary-foreground` | White | White | Text on primary backgrounds |
| `--secondary` | Teal-100 | Teal-900 | Secondary actions, badges |
| `--accent` | Amber-100 | Amber-900 | Accents, warnings, highlights |
| `--destructive` | Red-600 | Red-500 | Errors, critical alerts |
| `--background` | White | Gray-950 | Page background |
| `--foreground` | Gray-900 | Gray-50 | Primary text |
| `--muted` | Gray-100 | Gray-800 | Muted backgrounds |
| `--border` | Gray-200 | Gray-800 | Borders and dividers |

**Design Rule**: No indigo or blue colors used as primary, secondary, or accent colors.

### C. File Structure Reference

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Single-page application entry
│   ├── globals.css             # Global styles + Tailwind
│   └── api/
│       ├── chat/route.ts       # AI Copilot endpoint
│       ├── business-plan/route.ts  # Business plan AI generation
│       ├── agents/route.ts     # Agent CRUD
│       ├── dashboard/route.ts  # Dashboard data aggregation
│       ├── forecast/route.ts   # Financial forecast AI
│       ├── reports/route.ts    # Report generation AI
│       ├── idea-canvas/route.ts # Idea validation AI
│       ├── plan-review/route.ts # Plan review AI
│       └── pitch-deck/route.ts # Pitch deck AI generation
├── components/
│   ├── ui/                     # 50+ shadcn/ui components
│   ├── layout/
│   │   ├── sidebar.tsx         # Navigation sidebar
│   │   ├── header.tsx          # Top header bar
│   │   └── command-palette.tsx # ⌘K command palette
│   └── modules/
│       ├── dashboard.tsx       # Dashboard module
│       ├── business-plans.tsx  # Business Plans module
│       ├── financials.tsx      # Financials module
│       ├── idea-canvas.tsx     # Idea Canvas module
│       ├── plan-review.tsx     # Plan Review module
│       ├── research.tsx        # Research Agent module
│       ├── agents.tsx          # Agent Console module
│       ├── workflows.tsx       # Workflows module
│       ├── memory.tsx          # Memory Engine module
│       ├── pitch-deck.tsx      # Pitch Deck module
│       ├── reports.tsx         # Reports module
│       ├── plan-actuals.tsx    # Plan vs Actuals module
│       ├── copilot.tsx         # Copilot chat module
│       └── settings.tsx        # Settings module
├── hooks/
│   ├── use-mobile.ts          # Mobile detection hook
│   └── use-toast.ts           # Toast notification hook
└── lib/
    ├── store.ts               # Zustand global store
    ├── types.ts               # TypeScript type definitions
    ├── utils.ts               # Utility functions (cn, formatters)
    └── db.ts                  # Prisma client singleton
```

### D. Zustand Store State Map

```typescript
interface AppState {
  // Navigation
  activeModule: ModuleId;           // Currently active module
  sidebarCollapsed: boolean;        // Sidebar state
  copilotOpen: boolean;            // Copilot panel state

  // Chat (Copilot)
  chatMessages: ChatMessage[];     // Message history
  chatLoading: boolean;           // Loading state

  // Dashboard
  kpis: KPIData[];                // KPI card data
  revenueData: ChartDataPoint[];  // Revenue chart data
  expenseData: ChartDataPoint[];  // Expense chart data

  // Business Plans
  plans: BusinessPlanData[];      // All business plans
  selectedPlan: string | null;    // Currently selected plan

  // Agents
  agents: AgentInfo[];            // AI agent roster
  selectedAgent: string | null;   // Selected agent
  agentTasks: TaskInfo[];         // Agent tasks

  // Workflows
  workflows: WorkflowInfo[];      // Workflow list

  // Memory
  memories: MemoryEntry[];        // Memory entries

  // Reports
  reports: ReportData[];          // Generated reports

  // Forecasts
  forecastData: ChartDataPoint[]; // Forecast chart data

  // Idea Canvas
  ideaCanvases: IdeaCanvasData[]; // Business ideas
  selectedIdea: string | null;    // Selected idea

  // Plan Review
  planReviews: PlanReviewData[];  // Plan reviews
  selectedReview: string | null;  // Selected review

  // Plan vs Actuals
  planActuals: PlanActualData[];  // Plan vs actual data
  integrations: IntegrationData[]; // Accounting integrations
  varianceAlerts: VarianceAlert[]; // Variance alerts

  // Pitch Deck
  pitchDecks: PitchDeckData[];    // Pitch decks
  selectedDeck: string | null;    // Selected deck

  // Citations
  citations: CitationData[];      // Research citations

  // Actions (CRUD)
  updatePlan: (id, updates) => void;
  deletePlan: (id) => void;
  addReport: (report) => void;
  updateReport: (id, updates) => void;
  addWorkflow: (workflow) => void;
  updateWorkflow: (id, updates) => void;
  addAgent: (agent) => void;
  updateAgent: (id, updates) => void;
  addPlanActual: (data) => void;
  updatePlanActual: (id, updates) => void;
  updateIntegration: (type, updates) => void;
  updatePitchDeck: (id, updates) => void;
  deletePitchDeck: (id) => void;
  addPlanReview: (review) => void;
  updateFinancialAssumption: (key, value) => void;
}
```

### E. Proposal Type AI Prompt Variations

#### Bank Loan (`bank_loan`)
- **Tone**: Conservative, data-heavy, risk-aware
- **Emphasis**: Collateral, DSCR, repayment schedule, cash flow stability, guarantees
- **Avoid**: Aggressive growth projections, speculative language
- **Key Sections**: Financial Forecast, Use of Funds, Risk Analysis, Collateral (custom)

#### Government Grant (`government_grant`)
- **Tone**: Impact-focused, community-oriented, formal
- **Emphasis**: Social impact, Bumiputera participation, job creation, alignment with national agenda
- **Avoid**: Excessive focus on profitability, exit strategies
- **Key Sections**: Problem Statement, Market Analysis (impact), Operations Plan, Appendices (compliance docs)

#### Angel Investor (`angel_investor`)
- **Tone**: Visionary, personal, story-driven
- **Emphasis**: Founder story, market timing, team, product-market fit, early traction
- **Avoid**: Over-detailed financial statements, bureaucratic language
- **Key Sections**: Executive Summary, Solution/Product, Management Team, Exit Strategy

#### Venture Capital (`venture_capital`)
- **Tone**: Growth-focused, metrics-driven, analytical
- **Emphasis**: TAM/SAM/SOM, CAC/LTV, scalability, unit economics, defensibility
- **Avoid**: Conservative projections, lack of ambition, operational details
- **Key Sections**: Market Analysis, Business Model, Financial Forecast, Exit Strategy

#### SME Financing (`sme_financing`)
- **Tone**: Practical, stability-focused, operational
- **Emphasis**: Cash flow stability, operational history, guarantees, manageable growth
- **Avoid**: Speculative projections, unproven business models
- **Key Sections**: Company Overview, Financial Forecast, Risk Analysis, Use of Funds

#### Corporate Partnership (`corporate_partnership`)
- **Tone**: Strategic, synergistic, collaborative
- **Emphasis**: Mutual value proposition, integration points, market access, complementary strengths
- **Avoid**: Competitive language, zero-sum framing
- **Key Sections**: Solution/Product, Market Analysis, Business Model, Operations Plan

### F. Glossary

| Term | Definition |
|------|-----------|
| **ARR** | Annual Recurring Revenue — the annualized value of recurring revenue |
| **ASEAN** | Association of Southeast Asian Nations — 10 member countries |
| **CAC** | Customer Acquisition Cost — cost to acquire one customer |
| **DSCR** | Debt Service Coverage Ratio — net operating income / total debt service; bank minimum typically 1.25x |
| **LTV** | Lifetime Value — total revenue expected from one customer |
| **MRR** | Monthly Recurring Revenue — the monthly value of recurring revenue |
| **MSME** | Micro, Small, and Medium Enterprise |
| **SME** | Small and Medium Enterprise |
| **SSM** | Suruhanjaya Syarikat Malaysia — Companies Commission of Malaysia |
| **TAM** | Total Addressable Market — total market demand for a product |
| **SAM** | Serviceable Addressable Market — the portion of TAM reachable by the business |
| **SOM** | Serviceable Obtainable Market — the portion of SAM realistically achievable |
| **BNM** | Bank Negara Malaysia — Malaysia's central bank |
| **MARA** | Majlis Amanah Rakyat — Malaysian agency for Bumiputera development |
| **MDEC** | Malaysia Digital Economy Corporation |
| **TERAJU** | Bumiputera Agenda Steering Unit under Prime Minister's Department |

---

> **Document End**  
> This PRD is a living document and will be updated as the product evolves. For questions or clarifications, contact the GangNiaga Product Team.
