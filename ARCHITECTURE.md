# GangNiaga AI OS — Architecture Document

> **Version**: 1.0.0  
> **Last Updated**: January 2025  
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

GangNiaga AI OS is an **autonomous AI-powered business operating system** designed for Southeast Asian SMEs. It replaces 7+ disconnected business tools with a single intelligent platform that plans, analyzes, automates, and executes real business workflows through specialized AI agents.

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

### System Characteristics

- **Single-Page Application**: Module switching without URL routing
- **Dark-First Design**: Emerald/teal/amber accent system, zero blue/indigo
- **AI-Native**: Every core workflow augmented or automated by AI
- **ASEAN-First**: Built for Southeast Asian market context (Malaysia, Indonesia, Thailand)
- **Multi-Agent**: 8 specialized AI agents with persistent memory
- **Bank-Grade**: DSCR calculations, lender review simulation, citation verification

---

## 2. High-Level Architecture

### 2.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GangNiaga AI OS                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    PRESENTATION LAYER                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐│   │
│  │  │ Dashboard│  │ Business │  │Financials│  │ Idea Canvas  ││   │
│  │  │  Module  │  │  Plans   │  │  Module  │  │   Module     ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘│   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐│   │
│  │  │  Agents  │  │Workflows │  │  Memory  │  │ Plan Review  ││   │
│  │  │  Module  │  │  Module  │  │  Module  │  │   Module     ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘│   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐│   │
│  │  │ Reports  │  │Pitch Deck│  │ Plan vs  │  │   Research   ││   │
│  │  │  Module  │  │  Module  │  │ Actuals  │  │   Module     ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘│   │
│  │                                                              │   │
│  │  ┌──────────────────┐  ┌──────────────────────────────────┐ │   │
│  │  │  AI Copilot (⌘K) │  │  Command Palette (⌘K search)    │ │   │
│  │  └──────────────────┘  └──────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     STATE LAYER (Zustand)                     │   │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐ │   │
│  │  │  UI     │ │  Data    │ │  Agent   │ │  Financial      │ │   │
│  │  │  State  │ │  State   │ │  State   │ │  State          │ │   │
│  │  └─────────┘ └──────────┘ └──────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      API LAYER (Next.js)                      │   │
│  │  ┌──────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌───────────┐ │   │
│  │  │ Chat │ │ Business │ │Forecast│ │ Agents │ │ Dashboard │ │   │
│  │  │  API │ │ Plan API │ │  API   │ │  API   │ │    API    │ │   │
│  │  └──────┘ └──────────┘ └────────┘ └────────┘ └───────────┘ │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐ │   │
│  │  │ Reports  │ │  Idea    │ │  Plan    │ │  Pitch Deck   │ │   │
│  │  │   API    │ │ Canvas   │ │ Review   │ │     API       │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   AI/ML LAYER (z-ai-web-dev-sdk)              │   │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │   │
│  │  │ LLM Chat     │  │ Content Gen   │  │ Validation &     │  │   │
│  │  │ Completions  │  │ (21 sections) │  │ Review Engine    │  │   │
│  │  └──────────────┘  └───────────────┘  └──────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  DATA LAYER (Prisma + SQLite)                  │   │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │   │
│  │  │User│ │Org │ │Plan│ │Frcst│ │Agt │ │Mem │ │KPI │ │Rpt │ │   │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ │   │
│  │  ┌──────┐ ┌────────┐ ┌──────────┐ ┌─────┐ ┌────────────┐  │   │
│  │  │Idea  │ │PlanRvw │ │PlanActual│ │Deck │ │Citation/Int│  │   │
│  │  └──────┘ └────────┘ └──────────┘ └─────┘ └────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
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
                                      │ API Call (when AI needed)
                                      ▼
                               ┌──────────────┐
                               │  Next.js API  │
                               │    Route      │
                               └──────┬───────┘
                                      │
                                      │ z-ai-web-dev-sdk
                                      ▼
                               ┌──────────────┐
                               │   Z-AI LLM   │
                               │   Service     │
                               └──────┬───────┘
                                      │
                                      │ JSON Response
                                      ▼
                               ┌──────────────┐
                               │  Zustand     │
                               │  Store       │
                               │  (update)    │
                               └──────────────┘
```

### 2.3 Module Communication Pattern

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

    Key: Modules share data through Zustand store, not direct communication.
         Business Plan data flows to Pitch Deck and Plan Review.
         Financial data flows to Plan Actuals and Forecasts.
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
| **Database** | Prisma ORM + SQLite | 6.x / 3.x | Type-safe database access, schema migration |
| **State** | Zustand | 5.x | Client-side global state management |
| **AI SDK** | z-ai-web-dev-sdk | 0.0.17+ | LLM chat completions, content generation |

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

### 3.3 Radix UI Primitives (via shadcn/ui)

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
│   └── schema.prisma              # 16 database models (SQLite)
├── db/
│   └── custom.db                  # SQLite database file
├── public/
│   ├── gangniaga-logo.png         # Brand logo (PNG)
│   ├── logo.svg                   # Brand logo (SVG)
│   └── robots.txt                 # SEO crawler rules
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout: ThemeProvider, fonts, Toaster
│   │   ├── page.tsx               # SPA entry: sidebar + header + module switcher
│   │   ├── globals.css            # Tailwind v4 + CSS custom properties
│   │   └── api/
│   │       ├── route.ts           # Health check / base API
│   │       ├── chat/route.ts      # AI Copilot (LLM chat completions)
│   │       ├── business-plan/route.ts  # 21-section proposal generation
│   │       ├── agents/route.ts    # Agent CRUD operations
│   │       ├── dashboard/route.ts # Dashboard data aggregation
│   │       ├── forecast/route.ts  # Financial forecasting & analysis
│   │       ├── reports/route.ts   # Report generation
│   │       ├── idea-canvas/route.ts   # Idea validation engine
│   │       ├── plan-review/route.ts   # Lender-perspective review
│   │       └── pitch-deck/route.ts    # Slide deck generation
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
│   │   │   reports.tsx            # Report generation & management
│   │   │   ├── settings.tsx       # Org settings, integrations, preferences
│   │   │   ├── idea-canvas.tsx    # 5-dimension validation canvas
│   │   │   ├── plan-review.tsx    # Lender review simulation
│   │   │   ├── pitch-deck.tsx     # AI slide deck generator
│   │   │   ├── plan-actuals.tsx   # Plan vs actuals with variance alerts
│   │   │   ├── research.tsx       # Citation-verified research
│   │   │   └── copilot.tsx        # AI chat side panel
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
│   │   ├── store.ts              # Zustand store (560 lines, all state)
│   │   ├── types.ts              # TypeScript interfaces & type unions
│   │   ├── utils.ts              # cn(), formatCurrency, helpers
│   │   └── db.ts                 # Prisma client singleton
│   └── hooks/
│       ├── use-mobile.ts         # Responsive breakpoint detection
│       └── use-toast.ts          # Toast notification hook
├── Caddyfile                     # Reverse proxy / gateway config
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
       ├─ <CopilotPanel>              ← AI chat (slide-in)
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
  
  // 3. AI operations
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
┌─────────────────────────────────────────────────────────────┐
│                    AppState (Zustand)                        │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   UI State      │  │   Chat State    │  │ Agent State  │ │
│  │  ├─ activeModule│  │  ├─ chatMessages │  │ ├─ agents    │ │
│  │  ├─ sidebarCol  │  │  ├─ chatLoading │  │ ├─ agentTasks│ │
│  │  └─ copilotOpen │  │  └─ clearChat   │  │ └─ selected  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Dashboard      │  │  Plans State    │  │ Idea Canvas │ │
│  │  ├─ kpis        │  │  ├─ plans       │  │ ├─ ideaCanvas│ │
│  │  ├─ revenueData │  │  ├─ selectedPlan│  │ ├─ selected  │ │
│  │  └─ expenseData │  │  ├─ updatePlan  │  │ └─ validate  │ │
│  └─────────────────┘  │  └─ deletePlan  │  └─────────────┘ │
│                       └─────────────────┘                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Forecast       │  │  Workflow       │  │ Plan Review │ │
│  │  ├─ forecastData│  │  ├─ workflows   │  │ ├─ reviews   │ │
│  │  └─ assumptions │  │  ├─ addWorkflow │  │ ├─ selected  │ │
│  └─────────────────┘  │  └─ updateWF    │  │ └─ addReview │ │
│                       └─────────────────┘  └─────────────┘ │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Memory         │  │  Reports        │  │ Plan Actuals│ │
│  │  ├─ memories    │  │  ├─ reports     │  │ ├─ planActual│ │
│  │  └─ categories  │  │  ├─ addReport   │  │ ├─ integratns│ │
│  └─────────────────┘  │  └─ updateReport│  │ ├─ alerts    │ │
│                       └─────────────────┘  │ └─ variance  │ │
│  ┌─────────────────┐  ┌─────────────────┐  └─────────────┘ │
│  │  Pitch Deck     │  │  Citations      │                   │
│  │  ├─ pitchDecks  │  │  ├─ citations   │                   │
│  │  ├─ selectedDeck│  │  └─ verified    │                   │
│  │  └─ updateDeck  │  └─────────────────┘                   │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 State Operations Pattern

```typescript
// Read pattern — useAppStore with selectors
const plans = useAppStore((s) => s.plans);
const activeModule = useAppStore((s) => s.activeModule);

// Write pattern — actions defined inline in store
updatePlan: (id, updates) => set((s) => ({
  plans: s.plans.map((p) => p.id === id 
    ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } 
    : p
  ),
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
| AI-generated content | Zustand → future: DB | Currently in-memory, will persist |
| User preferences | Zustand → future: DB | Currently in-memory |
| Chat history | Zustand → future: DB | Currently in-memory with 8-message window |
| Financial models | Zustand | Connected model with cascading updates |
| Agent/task state | Zustand → future: DB | Currently in-memory |

> **Note**: The current implementation uses Zustand with mock data for rapid prototyping. The database layer (Prisma) is defined but not yet connected. Migration path: Zustand → Zustand + Prisma (hybrid) → TanStack Query + Prisma (full).

---

## 7. API Architecture

### 7.1 API Route Map

```
/api
├── GET  /                    → Health check
├── POST /chat                → AI Copilot conversation
├── POST /business-plan       → Generate proposal section
├── GET  /agents              → List agents
├── POST /agents              → Create agent
├── GET  /dashboard           → Dashboard aggregated data
├── POST /forecast            → Financial forecast analysis
├── GET  /reports             → List reports
├── POST /reports             → Generate report
├── POST /idea-canvas         → Validate business idea
├── POST /plan-review         → Run lender review simulation
└── POST /pitch-deck          → Generate pitch deck slides
```

### 7.2 API Route Implementation Pattern

Each API route follows a consistent pattern:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Singleton ZAI instance (per-route, lazy-initialized)
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await request.json();
    if (!body.requiredField) {
      return NextResponse.json({ error: 'Missing field' }, { status: 400 });
    }

    // 2. Initialize AI SDK
    const zai = await getZAI();

    // 3. Build context-aware prompts
    const messages = [
      { role: 'assistant', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    // 4. Call LLM
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
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

### 7.3 AI Prompt Architecture

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

### 7.4 Chat API Architecture

The Copilot uses a **sliding window conversation** pattern:

```typescript
// Message history limited to last 8 messages for context efficiency
const messages = [
  { role: 'assistant', content: SYSTEM_PROMPT },  // Always included
  ...history.slice(-8),                            // Sliding window
  { role: 'user', content: message },              // Current message
];
```

The system prompt includes GangNiaga's business context (MRR, ARR, burn rate, runway, churn, growth rate) so the AI can provide contextual responses without querying external data.

---

## 8. Database Architecture

### 8.1 Entity-Relationship Diagram

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
          ┌─────────────────────┼──────────────────────┐
          │                     │                      │
          ▼                     ▼                      ▼
  ┌───────────────┐   ┌───────────────┐      ┌───────────────┐
  │ BusinessPlan  │   │   Forecast    │      │  AgentSession │
  │───────────────│   │───────────────│      │───────────────│
  │ id            │   │ id            │      │ id            │
  │ title         │   │ name          │      │ name          │
  │ status        │   │ type          │      │ type          │
  │ sections...   │   │ period        │      │ status        │
  │ orgId (FK)    │   │ data (JSON)   │      │ tasksCompleted│
  └───────────────┘   │ orgId (FK)    │      │ orgId (FK)    │
                      └───────────────┘      └───────┬───────┘
                                                     │
                                                     ▼
                                             ┌───────────────┐
                                             │  AgentTask    │
                                             │───────────────│
                                             │ id            │
                                             │ sessionId(FK) │
                                             │ type/status   │
                                             │ input/output  │
                                             │ duration      │
                                             └───────────────┘

          ┌─────────────────────┼──────────────────────┐
          │                     │                      │
          ▼                     ▼                      ▼
  ┌───────────────┐   ┌───────────────┐      ┌───────────────┐
  │  AgentMemory  │   │  WorkflowRun  │      │   KPIData     │
  │───────────────│   │───────────────│      │───────────────│
  │ id            │   │ id            │      │ id            │
  │ type          │   │ name          │      │ metric        │
  │ category      │   │ type/status   │      │ value         │
  │ content       │   │ triggerType   │      │ prev/target   │
  │ embedding     │   │ steps (JSON)  │      │ unit/period   │
  │ orgId (FK)    │   │ orgId (FK)    │      │ orgId (FK)    │
  └───────────────┘   └───────────────┘      └───────────────┘

          ┌─────────────────────┼──────────────────────┐
          │                     │                      │
          ▼                     ▼                      ▼
  ┌───────────────┐   ┌───────────────┐      ┌───────────────┐
  │    Report     │   │  IdeaCanvas   │      │  PlanReview   │
  │───────────────│   │───────────────│      │───────────────│
  │ id            │   │ id            │      │ id            │
  │ title         │   │ title         │      │ planId        │
  │ type/status   │   │ status        │      │ lenderPersona │
  │ content(JSON) │   │ problem       │      │ narrativeScr  │
  │ format        │   │ solution      │      │ financialScr  │
  │ orgId (FK)    │   │ validation    │      │ consistencyScr│
  └───────────────┘   │ report(JSON)  │      │ discrepancies │
                      │ orgId (FK)    │      │ recommendatns │
                      └───────────────┘      │ orgId (FK)    │
                                             └───────────────┘

          ┌─────────────────────┼──────────────────────┐
          │                     │                      │
          ▼                     ▼                      ▼
  ┌───────────────┐   ┌───────────────┐      ┌───────────────┐
  │  PlanActual   │   │  PitchDeck    │      │   Citation    │
  │───────────────│   │───────────────│      │───────────────│
  │ id            │   │ id            │      │ id            │
  │ category      │   │ title         │      │ source        │
  │ period        │   │ status        │      │ url           │
  │ planned/actual│   │ planId        │      │ type          │
  │ variance      │   │ templateType  │      │ geography     │
  │ source        │   │ slides(JSON)  │      │ verified      │
  │ orgId (FK)    │   │ questions(JSON│      │ dataPoint     │
  └───────────────┘   │ orgId (FK)    │      │ orgId (FK)    │
                      └───────────────┘      └───────────────┘

                                             ┌───────────────┐
                                             │  Integration  │
                                             │───────────────│
                                             │ id            │
                                             │ type          │
                                             │ status        │
                                             │ lastSync      │
                                             │ syncFrequency │
                                             │ config(JSON)  │
                                             │ orgId (FK)    │
                                             └───────────────┘
```

### 8.2 Model Summary

| Model | Purpose | Key Fields | JSON Fields |
|-------|---------|------------|-------------|
| **User** | Authentication & profile | email, role, orgId | — |
| **Organization** | Multi-tenant container | name, slug, industry | — |
| **BusinessPlan** | 21-section proposals | title, status, proposalType | Sections are individual columns |
| **Forecast** | Financial projections | name, type, period | `data` (ChartDataPoint[]) |
| **AgentSession** | AI agent instance | name, type, status, tasksCompleted | `config` |
| **AgentTask** | Agent task execution | type, status, input, output, duration | — |
| **AgentMemory** | Persistent AI memory | type, category, content | `embedding` (future vector) |
| **WorkflowRun** | Automation execution | name, type, status, triggerType | `steps` (WorkflowStep[]) |
| **KPIData** | Metric tracking | metric, value, previousValue, target | — |
| **Report** | Generated reports | title, type, status, format | `content` |
| **IdeaCanvas** | Idea validation | problem, solution, validationScore | `validationReport`, `risks` |
| **PlanReview** | Lender review | scores (4 dimensions), discrepancies | `discrepancies`, `recommendations`, `fullReport` |
| **PlanActual** | Plan vs actuals | category, period, planned/actual/variance | — |
| **PitchDeck** | Slide deck generation | title, templateType, slideCount | `slides`, `anticipatedQuestions` |
| **Citation** | Source verification | source, type, geography, verified | — |
| **Integration** | External connections | type, status, syncFrequency | `config` |

### 8.3 Schema Design Decisions

1. **JSON string fields**: Complex nested data (slides, steps, validation reports) stored as JSON strings in SQLite. This trades query granularity for schema flexibility.

2. **CUID primary keys**: All models use `@default(cuid())` for collision-resistant, sortable unique IDs.

3. **Organization-scoped**: Every business entity has `organizationId` for multi-tenant data isolation.

4. **No list primitives**: Prisma with SQLite doesn't support list types natively. Arrays (risks, steps, slides) are serialized as JSON strings.

5. **Timestamps**: All models include `createdAt` (auto) and `updatedAt` (auto-updated).

### 8.4 Database Access Pattern

```typescript
// lib/db.ts — Prisma client singleton
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Usage in API routes (future):
import { db } from '@/lib/db';
const plans = await db.businessPlan.findMany({
  where: { organizationId: orgId },
});
```

---

## 9. AI/ML Architecture

### 9.1 Agent System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI AGENT SYSTEM                           │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Agent Orchestrator                     ││
│  │  Routes tasks to specialized agents based on type       ││
│  └──────────────────────────┬──────────────────────────────┘│
│                             │                                │
│     ┌───────────┬──────────┼──────────┬───────────┐        │
│     ▼           ▼          ▼          ▼           ▼        │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │Business│ │Finan-│  │Market│  │Report│  │Browser│       │
│  │Analyst│ │cial  │  │Re-   │  │Gener-│  │Agent │       │
│  │       │ │Advisor│  │search│  │ator  │  │      │       │
│  │analysis│ │financial│research│ │reporting│ │browser│     │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                             │
│     ┌───────────┬──────────────────────┐                   │
│     ▼           ▼                      ▼                   │
│  ┌──────┐  ┌──────────┐  ┌──────────────┐                │
│  │  CRM │  │  Plan    │  │  Citation    │                │
│  │Asst. │  │  Review  │  │  Verifier    │                │
│  │      │  │  Agent   │  │              │                │
│  │ crm  │  │ review   │  │ citation     │                │
│  └──────┘  └──────────┘  └──────────────┘                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Agent Memory Store                       │  │
│  │  workspace | financial | workflow | agent | user     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Agent Registry

| Agent | Type | Specialization | Key Capabilities |
|-------|------|---------------|-----------------|
| **Business Analyst** | `analysis` | SaaS metrics, growth analysis | Market analysis, KPI interpretation, competitive intelligence |
| **Financial Advisor** | `financial` | Revenue modeling, DSCR | Forecast generation, expense analysis, bank metrics, sensitivity analysis |
| **Market Researcher** | `research` | ASEAN market data | Competitor monitoring, pricing extraction, market sizing |
| **Report Generator** | `reporting` | Document generation | KPI summaries, investor updates, board presentations, operational reports |
| **Browser Agent** | `browser` | Web automation | Site browsing, data extraction, competitor monitoring |
| **CRM Assistant** | `crm` | Customer management | Customer data, churn analysis, retention strategies |
| **Plan Review Agent** | `review` | Lender simulation | Narrative/financial consistency check, discrepancy detection, DSCR validation |
| **Citation Verifier** | `citation` | Source verification | Market data verification, source credibility assessment, benchmark validation |

### 9.3 AI Workflow Pipelines

#### Pipeline 1: Business Plan Creation

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Create  │    │  Select  │    │ Generate │    │  Edit    │    │  Review  │
│   Plan   │───▶│   Type   │───▶│ Sections │───▶│  Inline  │───▶│   with   │───▶ ...
│  (title) │    │ (6 types)│    │  (AI x21)│    │ (editor) │    │  Agent   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                                      │
       ┌──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────┐    ┌──────────┐
│  Generate│    │ Practice │
│  Pitch   │───▶│   Q&A    │
│  Deck    │    │ (AI)     │
└──────────┘    └──────────┘
```

#### Pipeline 2: Idea Validation

```
┌──────────┐    ┌──────────────────────────────────────┐    ┌──────────┐
│  Enter   │    │         AI Validation Engine          │    │          │
│   Idea   │───▶│  ┌─────────┬─────────┬────────────┐ │───▶│ Results  │
│  Canvas  │    │  │ Market  │ Problem │ Solution   │ │    │ & Report │
│          │    │  │Viability│ Clarity │Feasibility │ │    │          │
└──────────┘    │  └─────────┴─────────┴────────────┘ │    └──────────┘
                │  ┌─────────┬─────────┐               │
                │  │ Revenue │Competi- │               │
                │  │Potential│tive Pos │               │
                │  └─────────┴─────────┘               │
                └──────────────────────────────────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Benchmark Compare│
                │ LTV:CAC, Growth, │
                │ Margin, Churn    │
                └──────────────────┘
```

#### Pipeline 3: Financial Forecasting

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Enter   │    │ Revenue  │    │ Expense  │    │   DSCR   │
│Assumptions│──▶│ Modeling │──▶│ Analysis │──▶│ Calc     │──▶ ...
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
       ┌───────────────────────────────────────────────┘
       │
       ▼
┌──────────┐    ┌──────────┐
│   Bank   │    │    AI    │
│  Metrics │──▶│ Advisor  │
│  (ratio) │    │Feedback  │
└──────────┘    └──────────┘
```

### 9.4 Prompt Engineering Strategy

| Context Layer | Purpose | Token Budget |
|--------------|---------|-------------|
| **System Prompt** | Agent identity, tone, capabilities | ~200 tokens |
| **Business Context** | GangNiaga metrics (MRR, ARR, burn rate) | ~100 tokens |
| **Proposal Type Context** | Target audience (bank, VC, grant) | ~80 tokens |
| **Section-Specific Prompt** | Detailed instructions per section | ~150 tokens |
| **User Input** | Title, industry, specifics | ~50 tokens |
| **History Window** | Last 8 messages (chat only) | ~800 tokens |

---

## 10. Security Architecture

### 10.1 Current Security Measures

```
┌─────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                        │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Layer 1: Infrastructure                        │    │
│  │  ├─ Caddy reverse proxy (gateway)               │    │
│  │  ├─ XTransformPort header for service routing   │    │
│  │  └─ Port isolation (3000 only externally)       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Layer 2: Application                           │    │
│  │  ├─ Input validation (Zod + manual checks)      │    │
│  │  ├─ API route error boundaries                  │    │
│  │  ├─ No direct DB access from client             │    │
│  │  └─ TypeScript strict mode for type safety      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Layer 3: Data                                  │    │
│  │  ├─ SQLite file-based DB (local only)           │    │
│  │  ├─ Prisma parameterized queries (SQL injection)│    │
│  │  └─ Organization-scoped data isolation          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Layer 4: AI                                    │    │
│  │  ├─ z-ai-web-dev-sdk (server-side only)         │    │
│  │  ├─ No API keys exposed to client               │    │
│  │  ├─ Input sanitization before LLM calls         │    │
│  │  └─ Response validation from LLM                │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Security Considerations

| Threat | Mitigation | Status |
|--------|-----------|--------|
| **XSS** | React's built-in escaping, no dangerouslySetInnerHTML | ✅ Active |
| **SQL Injection** | Prisma ORM parameterized queries | ✅ Active |
| **CSRF** | Same-origin API routes, no cross-origin forms | ✅ Active |
| **API Key Exposure** | z-ai-web-dev-sdk server-side only | ✅ Active |
| **Authentication** | next-auth v4 available (not yet wired) | ⏳ Planned |
| **Authorization** | Organization-scoped data, role field exists | ⏳ Planned |
| **Rate Limiting** | Not implemented | ⏳ Planned |
| **Input Validation** | Zod for forms, manual checks in API | ⚠️ Partial |
| **Content Security Policy** | Not configured | ⏳ Planned |
| **HTTPS** | Caddy handles TLS termination | ✅ Active |

### 10.3 AI-Specific Security

- **Prompt Injection**: System prompts are server-side only; user inputs are injected as `user` role messages
- **Data Exfiltration**: LLM calls happen server-side; no client-side API keys
- **Response Integrity**: AI responses are validated for non-empty content before returning
- **Context Window**: Chat history is truncated to 8 messages to limit injection surface

---

## 11. Performance Architecture

### 11.1 Performance Strategy

```
┌─────────────────────────────────────────────────────────┐
│                PERFORMANCE OPTIMIZATION                   │
│                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │   Rendering   │  │   Network     │  │   Memory    │ │
│  │               │  │               │  │             │ │
│  │ ├─ RSC where  │  │ ├─ API routes │  │ ├─ Zustand  │ │
│  │   possible    │  │   (no SSR)    │  │   selectors │ │
│  │ ├─ 'use client│  │ ├─ Singleton  │  │ ├─ Sliding  │ │
│  │   ' boundary  │  │   ZAI inst.  │  │   chat window│ │
│  │ ├─ Lazy mod   │  │ ├─ Compact   │  │ ├─ JSON     │ │
│  │   switching   │  │   responses  │  │   string DB │ │
│  │ └─ Framer     │  │ └─ Error     │  │ └─ CUID     │ │
│  │   Motion code │  │   boundaries │  │   (smaller) │ │
│  │   splitting   │  │              │  │             │ │
│  └───────────────┘  └───────────────┘  └─────────────┘ │
│                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │    Styling    │  │   Caching     │  │   Bundle    │ │
│  │               │  │               │  │             │ │
│  │ ├─ Tailwind   │  │ ├─ Local mem  │  │ ├─ Tree     │ │
│  │   purging     │  │   cache       │  │   shaking   │ │
│  │ ├─ CSS vars   │  │ ├─ ZAI singl- │  │ ├─ Dynamic  │ │
│  │   for themes  │  │   eton reuse  │  │   imports   │ │
│  │ └─ No runtime │  │ └─ Future:    │  │ ├─ 50+ UI   │ │
│  │   CSS-in-JS   │  │   Redis/CDN   │  │   components│ │
│  └───────────────┘  └───────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 11.2 Performance Benchmarks (Target)

| Metric | Target | Strategy |
|--------|--------|----------|
| **First Contentful Paint** | < 1.5s | Server rendering, critical CSS |
| **Time to Interactive** | < 3.0s | Code splitting, lazy module loading |
| **Module Switch Time** | < 200ms | AnimatePresence with 200ms transition |
| **AI Response Time** | < 5.0s | ZAI singleton, sliding window |
| **Chart Render Time** | < 500ms | Recharts with memoized data |
| **Bundle Size (Initial)** | < 200KB | Tree shaking, dynamic imports |

### 11.3 Optimization Techniques

1. **ZAI Singleton Pattern**: The AI SDK client is instantiated once per API route and reused across requests, avoiding repeated initialization overhead.

2. **Sliding Window Chat**: Only the last 8 messages are sent to the LLM, reducing token count and response latency.

3. **Module Switching**: Instead of route-based navigation, modules are swapped in-place with Framer Motion transitions — no network requests for page loads.

4. **Zustand Selectors**: Components use targeted selectors to subscribe only to the state slices they need, minimizing re-renders.

5. **JSON String Storage**: Complex nested data is stored as JSON strings in SQLite, avoiding JOIN overhead at the cost of query granularity.

---

## 12. Design Decisions & Trade-offs

### 12.1 Decision Log

| # | Decision | Rationale | Trade-off |
|---|----------|-----------|-----------|
| 1 | **SPA without routing** | Faster module switching, simpler state, no page reloads | No deep-linking to specific modules, browser back button doesn't navigate modules |
| 2 | **Zustand over Redux** | Simpler API, less boilerplate, better TypeScript support | No middleware ecosystem, devtools less mature |
| 3 | **SQLite over PostgreSQL** | Zero-config, file-based, perfect for dev/MVP | No concurrent writes, limited scalability, JSON strings instead of native JSONB |
| 4 | **Dark theme default** | Target users (founders, analysts) prefer dark mode; reduces eye strain during long sessions | Light mode must be explicitly supported and tested |
| 5 | **No blue/indigo colors** | Differentiate from generic SaaS dashboards; emerald/teal aligns with "growth" brand identity | Constrained color palette for data visualizations |
| 6 | **JSON string fields** | Schema flexibility, rapid iteration, no migration for structure changes | Cannot query inside JSON fields, no type safety at DB level |
| 7 | **Server-side AI only** | Security (no API key exposure), consistent behavior, rate limiting capability | Higher server load, cannot use client-side AI features |
| 8 | **Single store** | All data available everywhere, simple mental model, no cross-store synchronization | Large store object, potential for unnecessary re-renders without selectors |
| 9 | **21-section proposals** | Comprehensive for bank/VC audiences; competitive advantage vs. 5-8 section tools | More AI generation calls, longer creation time, higher token cost |
| 10 | **Mock data in Zustand** | Instant demo, no DB setup, rapid prototyping | Must migrate to real persistence; data lost on refresh |
| 11 | **Framer Motion animations** | Professional feel, smooth transitions, good React integration | Bundle size increase, potential performance issues on low-end devices |
| 12 | **CUID over UUID** | Sortable by creation time, shorter strings, collision-resistant | Less standard than UUID v4 |

### 12.2 Architecture Decision Records (ADR)

#### ADR-001: Single-Page Application Architecture

**Context**: The application needs to support 14 modules with fluid navigation.

**Decision**: Implement as a SPA with module switching via Zustand state, not Next.js App Router pages.

**Consequences**:
- ✅ Instant module transitions (no network requests)
- ✅ Single shared state across all modules
- ✅ Simpler URL structure (just `/`)
- ❌ No browser back/forward navigation between modules
- ❌ No deep linking to specific modules
- ❌ All module code loaded upfront (mitigated by lazy imports)

#### ADR-002: Proposal Type-Context System

**Context**: Business proposals need different tones and emphasis depending on the audience (bank, VC, grant).

**Decision**: Implement a two-tier prompt system with proposal type context injected before section-specific prompts.

**Consequences**:
- ✅ Same section generation code produces audience-appropriate content
- ✅ Easy to add new proposal types (just add a context string)
- ❌ Prompt length increases (but within token limits)
- ❌ Context bleeding possible if prompts aren't well-separated

#### ADR-003: Connected Financial Model

**Context**: Financial data should cascade: changing an assumption should update KPIs, forecasts, and plan actuals.

**Decision**: Implement `updateFinancialAssumption` in Zustand that cascades changes across dependent state slices.

**Consequences**:
- ✅ Always-consistent financial data
- ✅ Single source of truth for financial assumptions
- ❌ Complex update logic in store
- ❌ Potential for cascading re-renders (mitigated by selectors)

---

## 13. Scalability Considerations

### 13.1 Current Scalability Limits

| Dimension | Current Limit | Bottleneck | Migration Path |
|-----------|--------------|------------|----------------|
| **Data Persistence** | In-memory (Zustand) | Data lost on page refresh | Zustand → Prisma + SQLite |
| **Database** | SQLite (single file) | Single writer, no concurrency | SQLite → PostgreSQL (Prisma makes this a config change) |
| **AI Requests** | Sequential, no queue | One LLM call at a time per route | Add request queue / worker pool |
| **Concurrent Users** | Single user | No auth, no multi-tenancy | Add next-auth + org-scoped queries |
| **Agent Parallelism** | UI shows status only | No real agent execution | Add agent worker service (mini-service) |
| **File Storage** | None | No document/PDF storage | Add S3-compatible storage |

### 13.2 Scalability Roadmap

```
Phase 1 (Current)          Phase 2 (Near-term)         Phase 3 (Production)
─────────────────          ──────────────────          ──────────────────
Zustand mock data    ──▶   Zustand + Prisma      ──▶   TanStack Query + Prisma
SQLite (dev)         ──▶   SQLite (staging)      ──▶   PostgreSQL
No auth              ──▶   next-auth (basic)     ──▶   next-auth + RBAC
Sequential AI        ──▶   Request queue         ──▶   Worker pool + streaming
Single user          ──▶   Multi-user (basic)    ──▶   Multi-tenant SaaS
No file storage      ──▶   Local file storage    ──▶   S3 + CDN
No caching           ──▶   In-memory cache       ──▶   Redis + CDN
No monitoring        ──▶   Basic logging         ──▶   APM + error tracking
```

### 13.3 Database Migration Strategy

The Prisma schema is designed for easy SQLite → PostgreSQL migration:

```prisma
// Current: SQLite
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Future: PostgreSQL (only config change needed)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

JSON string fields should be migrated to native JSONB columns for query performance:

```sql
-- Migration example
ALTER TABLE "IdeaCanvas" ALTER COLUMN "validationReport" TYPE JSONB USING "validationReport"::JSONB;
ALTER TABLE "PlanReview" ALTER COLUMN "discrepancies" TYPE JSONB USING "discrepancies"::JSONB;
```

### 13.4 Horizontal Scaling

```
┌─────────────────────────────────────────────────────────┐
│                   FUTURE: Horizontal Scale               │
│                                                          │
│  ┌─────────┐     ┌──────────────────────────────────┐  │
│  │ Load    │     │        Next.js Instances          │  │
│  │ Balancer│────▶│  ┌──────┐ ┌──────┐ ┌──────┐     │  │
│  │         │     │  │App:1 │ │App:2 │ │App:3 │     │  │
│  └─────────┘     │  └──────┘ └──────┘ └──────┘     │  │
│                   └──────────────────────────────────┘  │
│                              │                           │
│                   ┌──────────┼──────────┐               │
│                   ▼          ▼          ▼               │
│              ┌────────┐ ┌────────┐ ┌────────┐          │
│              │PostgreSQL│ │ Redis  │ │  S3    │          │
│              │(Primary)│ │ Cache  │ │Storage │          │
│              └────────┘ └────────┘ └────────┘          │
│                                                          │
│              ┌──────────────────────────────────┐       │
│              │     AI Worker Service (minisvc)   │       │
│              │  ┌──────┐ ┌──────┐ ┌──────┐     │       │
│              │  │Work:1│ │Work:2│ │Work:3│     │       │
│              │  └──────┘ └──────┘ └──────┘     │       │
│              └──────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

## 14. Error Handling Strategy

### 14.1 Error Handling Layers

```
┌─────────────────────────────────────────────────────────┐
│                  ERROR HANDLING STRATEGY                  │
│                                                          │
│  Layer 1: API Routes                                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │  try {                                          │    │
│  │    // Parse input                               │    │
│  │    if (!required) return 400                    │    │
│  │    // Call AI                                   │    │
│  │    if (!response) return 500                    │    │
│  │    return 200 + data                            │    │
│  │  } catch (error) {                              │    │
│  │    console.error(context, error)                │    │
│  │    return 500 + { error: message }              │    │
│  │  }                                              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 2: Client Components                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  try {                                          │    │
│  │    const res = await fetch('/api/...')          │    │
│  │    if (!res.ok) throw new Error(...)            │    │
│  │    const data = await res.json()                │    │
│  │    // Update store                              │    │
│  │  } catch (error) {                              │    │
│  │    toast({ title: 'Error', description: ... })  │    │
│  │    setIsGenerating(false)                       │    │
│  │  }                                              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 3: UI Feedback                                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ├─ Toast notifications (sonner)                │    │
│  │  ├─ Error boundaries (React)                    │    │
│  │  ├─ Loading states (Skeleton)                   │    │
│  │  ├─ Empty states (illustrated messages)         │    │
│  │  └─ Fallback UI (graceful degradation)          │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 14.2 Error Response Format

All API routes return errors in a consistent format:

```typescript
// Success
NextResponse.json({ content: "..." })
NextResponse.json({ response: "..." })

// Validation Error (400)
NextResponse.json({ error: 'Message is required' }, { status: 400 })

// AI Generation Error (500)
NextResponse.json({ error: 'No content generated' }, { status: 500 })

// Internal Error (500)
NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
```

### 14.3 Loading State Pattern

```typescript
// Standard loading pattern in modules
const [isGenerating, setIsGenerating] = useState(false);

const handleGenerate = async () => {
  setIsGenerating(true);
  try {
    const res = await fetch('/api/business-plan', {
      method: 'POST',
      body: JSON.stringify({ section, title, industry, proposalType }),
    });
    const data = await res.json();
    // Update Zustand store
    updatePlan(planId, { sections: { ...sections, [section]: data.content } });
  } catch (error) {
    toast({ title: 'Generation Failed', description: 'Please try again', variant: 'destructive' });
  } finally {
    setIsGenerating(false);
  }
};

// Render with loading state
{isGenerating ? <Skeleton className="h-48" /> : <MarkdownContent content={section} />}
```

---

## 15. Testing Strategy

### 15.1 Testing Pyramid

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E ╲           ← Future: Playwright
                 ╱──────╲           (full user workflows)
                ╱        ╲
               ╱ Integration ╲      ← Future: API route tests
              ╱──────────────╲      (fetch → response validation)
             ╱                ╲
            ╱   Component Tests ╲   ← Future: React Testing Library
           ╱────────────────────╲   (render + interaction)
          ╱                      ╲
         ╱     Unit Tests         ╲  ← Future: Vitest
        ╱──────────────────────────╲ (utils, store actions, helpers)
       ╱                            ╲
      ╱        Type Checking         ╲  ✅ Active: TypeScript strict mode
     ╱────────────────────────────────╲ (compile-time safety)
```

### 15.2 Current Quality Assurance

| Method | Status | Coverage |
|--------|--------|----------|
| **TypeScript Strict Mode** | ✅ Active | All files |
| **ESLint** | ✅ Active | All files (via `bun run lint`) |
| **Next.js Lint Rules** | ✅ Active | All components |
| **Prisma Schema Validation** | ✅ Active | `schema.prisma` |
| **Manual Testing** | ✅ Active | All modules |
| **Build Verification** | ✅ Available | `bun run build` |

### 15.3 Planned Testing Implementation

#### Unit Tests (Vitest)

```typescript
// Example: lib/utils.test.ts
import { formatCurrency, cn } from './utils';

describe('formatCurrency', () => {
  it('formats RM currency correctly', () => {
    expect(formatCurrency(284500)).toBe('RM 284,500');
  });
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('RM 0');
  });
});
```

#### Integration Tests (API Routes)

```typescript
// Example: app/api/chat/route.test.ts
import { POST } from './route';

describe('Chat API', () => {
  it('returns 400 for missing message', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });
});
```

#### Component Tests (React Testing Library)

```typescript
// Example: components/modules/dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import DashboardModule from './dashboard';

describe('DashboardModule', () => {
  it('renders KPI cards', () => {
    render(<DashboardModule />);
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
  });
});
```

### 15.4 Test Priority Matrix

| Priority | Area | Rationale |
|----------|------|-----------|
| **P0** | API routes (AI operations) | Core business logic, most complex error cases |
| **P0** | Zustand store (state mutations) | Single source of truth, cascading updates |
| **P1** | Financial calculations | Business-critical accuracy (DSCR, burn rate) |
| **P1** | Type definitions | TypeScript interfaces are contracts |
| **P2** | Component rendering | UI consistency, accessibility |
| **P2** | Prompt engineering | AI output quality, context injection |
| **P3** | E2E workflows | Full user journey validation |
| **P3** | Performance | Load testing, bundle size monitoring |

---

## Appendix A: Color System

The application uses a carefully designed color system with **zero blue/indigo** usage:

| Token | Purpose | Usage |
|-------|---------|-------|
| `emerald-500/600` | Primary actions, success, positive trends | Buttons, active states, growth indicators |
| `teal-500/600` | Secondary actions, information | Links, secondary buttons, info badges |
| `amber-500/600` | Warnings, highlights, attention | Warnings, variance alerts, star ratings |
| `rose-500/600` | Errors, destructive actions, negative trends | Error states, delete buttons, decline indicators |
| `slate-50-950` | Neutral, backgrounds, text | Card backgrounds, borders, text hierarchy |

## Appendix B: Key Metrics & Benchmarks

| Metric | Value (Demo Data) | Source |
|--------|-------------------|--------|
| Monthly Revenue | RM 284,500 | Store: kpis |
| MRR | RM 142,800 | Store: kpis |
| ARR | RM 1,713,600 | Store: kpis |
| Burn Rate | RM 187,200/mo | Store: kpis |
| Runway | 18 months | Store: kpis |
| DSCR | 1.45x | Store: kpis |
| Revenue Growth | 11.1% MoM | Store: kpis |
| Customer Churn | 3.2% | Store: ideaCanvas benchmark |

## Appendix C: Glossary

| Term | Definition |
|------|-----------|
| **DSCR** | Debt Service Coverage Ratio — Net Operating Income / Total Debt Service. Banks require ≥ 1.25x |
| **MRR** | Monthly Recurring Revenue |
| **ARR** | Annual Recurring Revenue (MRR × 12) |
| **LTV:CAC** | Lifetime Value to Customer Acquisition Cost ratio. Healthy SaaS: > 3:1 |
| **TAM/SAM/SOM** | Total Addressable / Serviceable Available / Serviceable Obtainable Market |
| **CUID** | Collision-resistant Unique Identifier — sortable, shorter than UUID |
| **ASEAN** | Association of Southeast Asian Nations (10 member states) |
| **Sdn Bhd** | Sendirian Berhad — Malaysian private limited company |
| **ZAI** | z-ai-web-dev-sdk — AI service SDK for LLM operations |

---

*This document is maintained alongside the codebase. When architectural decisions change, update the relevant section and add an entry to the Decision Log.*
