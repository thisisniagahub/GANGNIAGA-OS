# GangNiaga AI OS — Design System & UI/UX Document

> **Version:** v0.3.0  
> **Last Updated:** March 2025  
> **Status:** Source of Truth  

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Component Library](#4-component-library)
5. [Layout System](#5-layout-system)
6. [Animation & Motion Design](#6-animation--motion-design)
7. [Responsive Design Strategy](#7-responsive-design-strategy)
8. [Iconography](#8-iconography)
9. [Spacing & Grid System](#9-spacing--grid-system)
10. [Dark/Light Theme](#10-darklight-theme)
11. [Module-Specific Design Patterns](#11-module-specific-design-patterns)
12. [Accessibility Guidelines](#12-accessibility-guidelines)
13. [Design Decisions & Rationale](#13-design-decisions--rationale)
14. [Design Tokens Reference](#14-design-tokens-reference)

---

## 1. Design Philosophy

GangNiaga AI OS is designed as an **autonomous business operating system** for Southeast Asian entrepreneurs and SMEs. The design language reflects three core principles:

### Principles

| Principle | Description | Manifestation |
|-----------|-------------|---------------|
| **Clarity Over Cleverness** | Every pixel serves a business purpose. Data density is high but never noisy. | KPI cards with progress bars, structured financial tables, clear hierarchy |
| **Emerald Intelligence** | The AI-first nature is signaled through emerald/teal gradients, pulse animations, and Sparkles icons. Every AI action is visually distinct. | Gradient logos, emerald accent stripes, `⌘K` AI shortcuts |
| **No Blue, Ever** | Blue/indigo signals "generic SaaS." GangNiaga is purpose-built — our palette intentionally excludes all blue and indigo tones. | All accents from emerald→teal→cyan→amber→rose→orange |

### Design Pillars

- **Dark-first**: Dark mode is the default experience; light mode is a conscious opt-in
- **Motion with meaning**: Animations communicate state (loading, transition, hierarchy), never decorate
- **Modular consistency**: Every module follows the same Card→Header→Content→Action pattern
- **AI-visible**: AI-generated content and actions are always marked with `Sparkles` icons and emerald accents
- **Southeast Asian context**: Currency defaults to RM (Malaysian Ringgit), date formats are locale-aware

---

## 2. Color System

### 2.1 Primary Accents

| Name | Tailwind | Hex (500) | Hex (400) | Usage |
|------|----------|-----------|-----------|-------|
| **Emerald** | `emerald` | `#10b981` | `#34d399` | Primary brand, AI actions, positive indicators, active states |
| **Teal** | `teal` | `#14b8a6` | `#2dd4bf` | Secondary brand, gradients, break-even indicators |
| **Amber** | `amber` | `#f59e0b` | `#fbbf24` | Warnings, drafts, caution insights, AI-generated badges |
| **Cyan** | `cyan` | `#06b6d4` | `#22d3ee` | Tertiary accent, agents, plan-actuals, validation |
| **Rose** | `rose` | `#f43f5e` | `#fb7185` | Destructive, expenses, negative trends, risk indicators |
| **Orange** | `orange` | `#fb923c` | — | Strategy sections, corporate partnership type |

### 2.2 Chart Color Palette

Used across all Recharts visualizations. **Never use blue or purple in charts.**

```typescript
const CHART_COLORS = {
  emerald: '#34d399',  // Revenue, primary series
  amber:   '#fbbf24',  // Profit, warnings
  rose:    '#fb7185',  // Expenses, losses
  cyan:    '#22d3ee',  // Profit (alt), forecasts
  teal:    '#2dd4bf',  // Revenue (alt), projections
  orange:  '#fb923c',  // Sixth category
};
```

**Chart color assignment order:** emerald → amber → rose → cyan → teal → orange

### 2.3 Module-to-Color Mapping

Each module has a designated accent color used consistently for icons, borders, and badges:

| Module | Accent | Tailwind Class |
|--------|--------|----------------|
| Dashboard | Emerald | `text-emerald-500` |
| Business Plans | Amber | `text-amber-500` |
| Financials | Teal | `text-teal-500` |
| Idea Canvas | Emerald | `text-emerald-500` |
| Plan Review | Emerald | `text-emerald-500` |
| Research Agent | Emerald | `text-emerald-500` |
| Agent Console | Cyan | `text-cyan-500` |
| Workflows | Rose | `text-rose-500` |
| Memory Engine | Amber | `text-amber-500` |
| Pitch Deck | Teal | `text-teal-500` |
| Reports | Emerald | `text-emerald-500` |
| Plan vs Actuals | Cyan | `text-cyan-500` |
| OpenClaw | Cyan | `text-cyan-500` |
| Settings | Muted | `text-muted-foreground` |

### 2.4 Proposal Type Color Coding

Business Plans and Pitch Decks use distinct colors per proposal type:

| Proposal Type | Color | Tailwind Key |
|---------------|-------|-------------|
| Bank Loan | Emerald | `emerald` |
| Government Grant | Amber | `amber` |
| Angel Investor | Rose | `rose` |
| Venture Capital | Cyan | `cyan` |
| SME Financing | Teal | `teal` |
| Corporate Partnership | Orange | `orange` |

### 2.5 DSCR Gauge Color Zones

The Debt Service Coverage Ratio uses a semicircular gauge with four color zones:

| DSCR Range | Color | Label |
|------------|-------|-------|
| < 1.0x | Rose | Not Qualifying |
| 1.0x – 1.25x | Amber | Borderline |
| 1.25x – 2.0x | Emerald | Healthy |
| > 2.0x | Teal | Strong |

### 2.6 Color Usage Rules

| Rule | Implementation |
|------|---------------|
| **No blue/indigo** | Never use `blue-*`, `indigo-*`, or `violet-*` Tailwind classes anywhere |
| **10% opacity backgrounds** | Use `bg-{color}-500/10` for icon containers, badge backgrounds |
| **Gradient text** | Use `.gradient-text` class for hero text: `emerald → teal → cyan` |
| **Accent stripes** | KPI cards use 2px gradient top borders: `from-{color}-500/80 to-{color}-500/0` |
| **Semi-transparent borders** | Cards use `border-border/40` for subtle depth in dark mode |
| **Dark mode badge colors** | Use `dark:text-{color}-400` (not 500) for readable dark mode text |

### 2.7 Gradient Definitions

```css
/* Brand gradient — logo, copilot button, CTA */
from-emerald-500 via-teal-500 to-cyan-500

/* AI action gradients */
from-emerald-500/10 to-teal-500/10    /* subtle bg */
from-emerald-500 to-teal-600           /* solid bg */

/* Accent stripes (KPI cards) */
from-emerald-500/80 to-emerald-500/0   /* positive */
from-rose-500/80 to-rose-500/0         /* negative */

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #34d399, #2dd4bf, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 3. Typography System

### 3.1 Font Stack

| Role | Font | CSS Variable | Source |
|------|------|-------------|--------|
| **Body / UI** | Geist Sans | `--font-geist-sans` | `next/font/google` |
| **Code / Mono** | Geist Mono | `--font-geist-mono` | `next/font/google` |

```typescript
// layout.tsx
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```

### 3.2 Size Hierarchy

| Token | Size | Tailwind Class | Usage |
|-------|------|---------------|-------|
| **Micro** | 10px | `text-[10px]` | Section group headers, badge counts, kbd shortcuts, micro-labels |
| **XS** | 12px | `text-xs` | Tab labels, secondary descriptions, tooltip text, small badges |
| **SM** | 14px | `text-sm` | Body text, form labels, card descriptions, list items |
| **Base** | 16px | `text-base` | Card titles, section headings, primary button text |
| **LG** | 18px | `text-lg` | Module titles, chart card titles |
| **XL** | 20px | `text-xl` | Page main headings |
| **2XL** | 24px | `text-2xl` | Hero values in KPI cards, large financial numbers |
| **3XL** | 30px | `text-3xl` | Score gauge center values |

### 3.3 Weight Scale

| Weight | Value | Tailwind | Usage |
|--------|-------|----------|-------|
| Normal | 400 | `font-normal` | Body text, descriptions |
| Medium | 500 | `font-medium` | Nav items, form labels, secondary headings |
| Semibold | 600 | `font-semibold` | Card titles, section headers, tab triggers |
| Bold | 700 | `font-bold` | KPI values, hero text, main headings |

### 3.4 Letter Spacing

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Tight | -0.025em | `tracking-tight` | Headings, KPI values |
| Normal | 0 | default | Body text |
| Wide | 0.025em | `tracking-wide` | Section group headers |
| Widest | 0.1em | `tracking-widest` | Sidebar group labels (`uppercase` required) |

### 3.5 Line Height

| Context | Tailwind | Usage |
|---------|----------|-------|
| Snug | `leading-snug` | Card titles with icons |
| Relaxed | `leading-relaxed` | Body text, descriptions, rich content |
| None | `leading-none` | Single-line values, badges |

---

## 4. Component Library

### 4.1 Component Inventory

Built on **shadcn/ui (New York style)** with **Lucide icons** and **class-variance-authority** for variants.

| Category | Components |
|----------|-----------|
| **Data Display** | Card, Table, Badge, Avatar, Separator, ScrollArea, Skeleton |
| **Input** | Button, Input, Textarea, Select, Checkbox, RadioGroup, Slider, Switch, Toggle, ToggleGroup, InputOTP |
| **Navigation** | Tabs, Breadcrumb, NavigationMenu, Pagination, Sidebar |
| **Feedback** | Dialog, AlertDialog, Sheet, Drawer, Toast/Sonner, Progress, Alert, Tooltip, HoverCard |
| **Overlay** | Popover, DropdownMenu, ContextMenu, Command, Menubar |
| **Layout** | Accordion, Collapsible, Resizable, AspectRatio, Calendar |
| **Form** | Form (react-hook-form), Label |
| **Chart** | Chart (Recharts wrapper) |

### 4.2 Key Component Patterns

#### Card
```tsx
// Standard card with subtle dark-mode styling
<Card className="border-border/40 bg-card/80 backdrop-blur-sm">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>

// Card with accent stripe (KPI cards)
<Card className="group relative overflow-hidden border-border/40 bg-card/80">
  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500/80 to-emerald-500/0" />
  ...
</Card>

// Card with colored left border (DSCR, break-even)
<Card className="relative overflow-hidden border-l-4" style={{ borderLeftColor: dscrColor }}>
```

#### Badge
```tsx
// Status badges with dark mode variants
<Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-800 
  dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">

// Icon badges  
<Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1">
  <Sparkles className="h-3 w-3" />
  AI Powered
</Badge>
```

#### Button
```tsx
// AI action button — always emerald with Sparkles icon
<Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
  <Sparkles className="h-3.5 w-3.5" />
  Generate with AI
</Button>

// Quick action with colored outline
<button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] 
  font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 
  hover:bg-emerald-500/20 transition-all">
```

#### Keyboard Shortcut Badge
```tsx
<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded 
  border border-emerald-500/20 bg-emerald-500/5 px-1.5 font-mono text-[10px] font-medium 
  text-emerald-500/70">
  ⌘K
</kbd>
```

### 4.3 Component Sizing Conventions

| Element | Height | Class |
|---------|--------|-------|
| Compact button | 24px | `h-6` |
| Small button | 28px | `h-7` |
| Default button | 32px | `h-8` |
| Large button | 36px | `h-9` |
| Icon button | 32px | `h-8 w-8` |
| Small icon | 28px | `h-7 w-7` |
| Icon container | 32px | `h-8 w-8 rounded-lg` |
| Small icon container | 24px | `h-6 w-6 rounded-md` |

---

## 5. Layout System

### 5.1 App Shell

```
┌──────────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────────────────────────────────────────┐    │
│ │      │ │  Header (h-14)                           │    │
│ │      │ ├──────────────────────────────────────────┤    │
│ │      │ │                                          │    │
│ │ Side │ │  Main Content                            │    │
│ │ bar  │ │  (flex-1, overflow-y-auto)              │    │
│ │      │ │                                          │    │
│ │      │ │  AnimatePresence transitions             │    │
│ │      │ │                                          │    │
│ │      │ ├──────────────────────────────────────────┤    │
│ │      │ │  Copilot Panel (slide-in from right)     │    │
│ └──────┘ └──────────────────────────────────────────┘    │
│                      Command Palette (⌘K overlay)        │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Sidebar

| State | Width | Animation |
|-------|-------|-----------|
| Expanded | 240px | Spring: damping=25, stiffness=300 |
| Collapsed | 68px | Spring: damping=25, stiffness=300 |

**Structure:**
1. **Logo area** (h-16): Gradient icon + "GangNiaga AI OS" text
2. **Navigation** (ScrollArea, flex-1): 5 groups with section headers
3. **Bottom section** (border-t): Quick actions + AI Copilot button + Collapse toggle

**Nav Groups:**

| Group | Modules |
|-------|---------|
| Core | Dashboard, Business Plans, Financials |
| Intelligence | Idea Canvas, Plan Review, Research Agent |
| Automation | Agent Console, Workflows, Memory Engine |
| Output | Pitch Deck, Reports, Plan vs Actuals |
| Channels | OpenClaw |
| System | Settings |

**Active state:** `bg-emerald-500/8 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-l-[3px] border-l-emerald-500`

**Badge indicators:**
- Expanded: Colored pill badges (e.g., `bg-amber-500/15 text-amber-400`)
- Collapsed: Small dot indicator (e.g., `h-2 w-2 rounded-full bg-amber-500`)

### 5.3 Header

Height: `h-14` with `bg-card/60 backdrop-blur-sm`

**Elements (left → right):**
1. Module title + subtitle
2. Search button with `⌘K` keyboard badge
3. Theme toggle (Sun/Moon icon)
4. Notifications bell with emerald dot
5. AI Copilot button (emerald accent)
6. User avatar (emerald→teal gradient)

### 5.4 Copilot Panel

- **Position**: Fixed right, full height
- **Width**: `w-full sm:w-[400px]`
- **Background**: `bg-card/95 backdrop-blur-xl`
- **Animation**: Spring slide from right (x: 400→0)
- **Layout**: Header → Messages (ScrollArea) → Input area

### 5.5 Command Palette

- **Trigger**: `⌘K` / `Ctrl+K`
- **Component**: `CommandDialog` from shadcn
- **Groups**: "Quick Actions" + "Navigate"
- **Items**: Module navigation + AI quick actions

### 5.6 Module Layout Patterns

| Pattern | Modules | Structure |
|---------|---------|-----------|
| **Full-width grid** | Dashboard | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4` |
| **Split panel** | Business Plans, Idea Canvas, Pitch Deck | `lg:w-1/3` (list) + `flex-1` (detail) |
| **Tab-based** | Financials | 6 tabs with sub-layouts |
| **Console** | Agent Console, Workflows | Table/grid with status indicators |
| **Split panel + channels** | OpenClaw | `lg:w-1/3` (channels/plugins) + `flex-1` (conversation/log) |

---

## 6. Animation & Motion Design

### 6.1 Animation Library

All animations use **Framer Motion**. No CSS animations except `agent-pulse` and Recharts internals.

### 6.2 Core Animation Variants

#### fadeUp — Card entrance
```typescript
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};
```
**Used in:** KPI cards, AI insight cards, quick action cards  
**Stagger:** 0.08s per item

#### scaleIn — Chart entrance
```typescript
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};
```
**Used in:** Chart containers, pie charts

#### fadeIn — General transition
```typescript
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
```
**Used in:** Secondary cards, tab content

#### slideIn — Horizontal entrance
```typescript
const slideIn = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};
```
**Used in:** Form fields, list items

### 6.3 Layout Animations

| Animation | Config | Usage |
|-----------|--------|-------|
| **Sidebar expand/collapse** | `type: 'spring', damping: 25, stiffness: 300` | `motion.aside` width transition |
| **Page transition** | `opacity: 0→1, y: 8→0, duration: 0.2s` | `AnimatePresence mode="wait"` on module switch |
| **Copilot panel** | `x: 400→0, spring(damping:25, stiffness:300)` | Slide-in from right |
| **Progress bars** | `width: 0→{n}%, duration: 0.8s, delay: 0.3s` | Staggered KPI progress |
| **Active indicator** | `layoutId: "activeIndicatorCollapsed"` | Shared layout animation for sidebar active state |

### 6.4 Micro-interactions

| Interaction | Behavior |
|-------------|----------|
| **Card hover** | `hover:border-border hover:bg-card` — border brightens, background solidifies |
| **Quick action hover** | Stripe fades in via `opacity-0 group-hover:opacity-100` |
| **Nav item hover** | `hover:text-foreground hover:bg-accent/50` |
| **Button loading** | `Loader2` with `animate-spin` replaces icon |
| **Agent running** | `.animate-agent-pulse` — opacity oscillates 1→0.5→1 over 2s |
| **Notification dot** | `animate-pulse` on emerald circle |

### 6.5 CSS Keyframe Animations

```css
/* Agent pulse — running agents */
@keyframes agent-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-agent-pulse {
  animation: agent-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 6.6 Animation Rules

| Rule | Guideline |
|------|-----------|
| **Duration** | Keep under 500ms for UI transitions; 800ms-1s for data visualizations |
| **Easing** | Use `easeOut` for entrances; spring physics for layout changes |
| **Stagger** | 0.06–0.08s between items in a list |
| **Exit** | Always include exit animations; use `AnimatePresence` |
| **Reduced motion** | Respect `prefers-reduced-motion` (see Accessibility) |

---

## 7. Responsive Design Strategy

### 7.1 Breakpoints

| Breakpoint | Width | Typical Device |
|------------|-------|----------------|
| Default | 0–639px | Mobile phones |
| `sm` | 640px+ | Large phones, small tablets |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Laptops, desktops |
| `xl` | 1280px+ | Large desktops |

### 7.2 Grid Layouts

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| KPI cards | 1 col | 2 cols (`sm:grid-cols-2`) | 3 cols (`lg:grid-cols-3`) |
| Quick actions | 1 col | 2 cols | 4 cols (`lg:grid-cols-4`) |
| AI insights | 1 col | 2 cols | 2 cols |
| Chart section | 1 col | 1 col | 2/3 + 1/3 (`lg:grid-cols-3`) |
| Split panels | Stacked | Stacked | Side-by-side (`lg:flex-row`) |
| Financial tabs | Wrapped | Wrapped | Inline (`flex-nowrap`) |

### 7.3 Mobile Adaptations

| Component | Mobile Behavior |
|-----------|----------------|
| **Sidebar** | Collapsed to 68px icon-only mode by default |
| **Sidebar text** | Hidden; tooltips show on icon tap |
| **Copilot panel** | Full width (`w-full`) instead of 400px |
| **Split panels** | Stack vertically (list above detail) |
| **Search** | Text label hidden, only icon shown |
| **Touch targets** | Minimum 44px (`min-h-[44px]`) for interactive elements |
| **Chart heights** | Maintain minimum 280px for readability |

### 7.4 Responsive Utilities

```tsx
// Conditional rendering
<span className="text-xs hidden sm:inline">Search...</span>

// Responsive width
className="w-full sm:w-[400px]"

// Responsive grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// Responsive flex direction
className="flex flex-col sm:flex-row"

// Responsive gap
className="gap-4 lg:gap-6"

// Responsive padding
className="p-4 md:p-6"
```

---

## 8. Iconography

### 8.1 Icon Library

**Lucide React** — consistent 24px grid, 1.5px stroke width

### 8.2 Icon Sizing

| Context | Size | Class |
|---------|------|-------|
| Sidebar nav | 18px | `h-[18px] w-[18px]` |
| Card header icon | 16px | `h-4 w-4` |
| Button icon (sm) | 14px | `h-3.5 w-3.5` |
| Micro button icon | 12px | `h-3 w-3` |
| Badge icon | 10px | `h-2.5 w-2.5` |
| Logo icon | 20px | `h-5 w-5` |

### 8.3 Icon-to-Module Mapping

| Module | Icon | Accent Color |
|--------|------|-------------|
| Dashboard | `LayoutDashboard` | emerald |
| Business Plans | `FileText` | amber |
| Financials | `LineChart` | teal |
| Idea Canvas | `Lightbulb` | emerald |
| Plan Review | `Scale` | emerald |
| Research Agent | `Search` | emerald |
| Agent Console | `Bot` | cyan |
| Workflows | `Workflow` | rose |
| Memory Engine | `Brain` | amber |
| Pitch Deck | `Presentation` | teal |
| Reports | `BarChart3` | emerald |
| Plan vs Actuals | `GitCompareArrows` | cyan |
| OpenClaw | `Radio` | cyan |
| Settings | `Settings` | muted |

### 8.4 Recurring Icon Patterns

| Icon | Usage |
|------|-------|
| `Sparkles` | AI-powered actions, AI-generated badges |
| `Zap` | AI Insights, quick actions |
| `Plus` / `PlusCircle` | Create new items |
| `Edit` | Edit actions, draft status |
| `Loader2` | Loading states (with `animate-spin`) |
| `ArrowUpRight` / `ArrowDownRight` | Trend indicators |
| `CheckCircle2` | Completed, validated |
| `XCircle` | Failed, needs rework |
| `AlertTriangle` | Warnings, problem statement |
| `Info` | Tooltip triggers |
| `RefreshCw` | Refresh, sync actions |
| `ChevronLeft` / `ChevronRight` | Navigation, collapse/expand |
| `Send` | Chat submit |
| `Download` | Export actions |

---

## 9. Spacing & Grid System

### 9.1 Spacing Scale

Uses Tailwind's default 4px base unit:

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| 0.5 | 2px | `gap-0.5` | Tight list spacing |
| 1 | 4px | `gap-1` | Icon gaps, inline spacing |
| 1.5 | 6px | `gap-1.5` | Button icon gaps, badge padding |
| 2 | 8px | `gap-2` | Compact card inner spacing |
| 3 | 12px | `gap-3` | Standard element spacing |
| 4 | 16px | `gap-4` | Card content, grid gaps |
| 5 | 20px | `gap-5` | Form field spacing |
| 6 | 24px | `gap-6` | Section spacing, panel gaps |

### 9.2 Padding Conventions

| Element | Padding | Classes |
|---------|---------|---------|
| Card content | 24px horizontal | `px-6` (Card default) |
| Card header | 24px horizontal, auto vertical | `px-6` (Card default) |
| Main content area | 16–24px | `p-4 md:p-6` |
| Sidebar nav items | 12px horizontal | `px-3` |
| Sidebar section header | 12px horizontal | `px-3` |
| Page sections | 24px gap | `gap-6` |
| Input/textarea | 12px vertical | `py-2` / `py-3` |

### 9.3 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `calc(var(--radius) - 4px)` = 6px | Small elements |
| `--radius-md` | `calc(var(--radius) - 2px)` = 8px | Buttons, inputs |
| `--radius-lg` | `var(--radius)` = 10px | Cards, dialogs |
| `--radius-xl` | `calc(var(--radius) + 4px)` = 14px | Logo container |

**Custom rounding:**
- Nav items: `rounded-lg`
- Icon containers: `rounded-lg` (32px) or `rounded-md` (24px)
- Plan list items: `rounded-xl`
- Score circles: `rounded-full`

### 9.4 Custom Scrollbar

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: oklch(0.5 0 0 / 30%);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: oklch(0.5 0 0 / 50%);
}
.dark ::-webkit-scrollbar-thumb {
  background: oklch(0.7 0 0 / 20%);
}
```

---

## 10. Dark/Light Theme

### 10.1 Theme Configuration

- **Default**: Dark mode
- **Toggle**: `next-themes` with `attribute="class"` and `defaultTheme="dark"`
- **Implementation**: CSS custom properties using `oklch` color space

### 10.2 CSS Custom Properties (oklch)

#### Light Theme (`:root`)

| Token | Value | Visual |
|-------|-------|--------|
| `--background` | `oklch(1 0 0)` | Pure white |
| `--foreground` | `oklch(0.145 0 0)` | Near black |
| `--card` | `oklch(1 0 0)` | White |
| `--primary` | `oklch(0.205 0 0)` | Dark |
| `--secondary` | `oklch(0.97 0 0)` | Light gray |
| `--muted` | `oklch(0.97 0 0)` | Light gray |
| `--muted-foreground` | `oklch(0.556 0 0)` | Mid gray |
| `--accent` | `oklch(0.97 0 0)` | Light gray |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Red |
| `--border` | `oklch(0.922 0 0)` | Light border |
| `--ring` | `oklch(0.708 0 0)` | Mid gray |

#### Dark Theme (`.dark`)

| Token | Value | Visual |
|-------|-------|--------|
| `--background` | `oklch(0.145 0 0)` | Deep dark |
| `--foreground` | `oklch(0.985 0 0)` | Near white |
| `--card` | `oklch(0.205 0 0)` | Slightly lighter than bg |
| `--primary` | `oklch(0.922 0 0)` | Light |
| `--secondary` | `oklch(0.269 0 0)` | Dark gray |
| `--muted` | `oklch(0.269 0 0)` | Dark gray |
| `--muted-foreground` | `oklch(0.708 0 0)` | Light gray |
| `--accent` | `oklch(0.269 0 0)` | Dark gray |
| `--destructive` | `oklch(0.704 0.191 22.216)` | Bright red |
| `--border` | `oklch(1 0 0 / 10%)` | 10% white overlay |
| `--ring` | `oklch(0.556 0 0)` | Mid gray |

### 10.3 Dark Mode Specific Patterns

| Pattern | Light | Dark |
|---------|-------|------|
| Card background | `bg-card/80` (near-white) | `bg-card/80` (dark elevated) |
| Card border | `border-border/40` | `border-border/40` (10% white) |
| Backdrop | `backdrop-blur-sm` | `backdrop-blur-xl` (stronger) |
| Badge text | `text-{color}-700` | `dark:text-{color}-400` |
| Badge bg | `bg-{color}-100` | `dark:bg-{color}-900/30` |
| Badge border | `border-{color}-200` | `dark:border-{color}-800` |
| Icon container bg | `bg-{color}-50` | `dark:bg-{color}-950/30` |
| Recharts tooltip | `oklch(0.2 0 0)` | `oklch(0.25 0 0)` |
| Grid lines | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.06)` |

### 10.4 Chart Theme Colors (oklch)

| Index | Light (oklch) | Dark (oklch) | Purpose |
|-------|---------------|--------------|---------|
| chart-1 | `0.646 0.222 41.116` | `0.488 0.243 264.376` | Primary series |
| chart-2 | `0.6 0.118 184.704` | `0.696 0.17 162.48` | Secondary series |
| chart-3 | `0.398 0.07 227.392` | `0.769 0.188 70.08` | Tertiary series |
| chart-4 | `0.828 0.189 84.429` | `0.627 0.265 303.9` | Quaternary series |
| chart-5 | `0.769 0.188 70.08` | `0.645 0.246 16.439` | Fifth series |

> **Note:** Module-level charts override these with explicit `CHART_COLORS` using hex values (emerald, amber, rose, cyan, teal, orange) for brand consistency.

### 10.5 Sidebar Theme

| Token | Light | Dark |
|-------|-------|------|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` |
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |

---

## 11. Module-Specific Design Patterns

### 11.1 Dashboard

**Layout:** Vertical stack of sections with grid layouts

```
┌──────────────────────────────────────┐
│ KPI Cards (3-col grid)               │  ← fadeUp staggered
├──────────────────────┬───────────────┤
│ Revenue Chart (2/3)  │ Pie Chart(1/3)│  ← scaleIn
├──────────────────────┴───────────────┤
│ AI Insights (2-col grid)             │  ← fadeUp
├──────────────────────────────────────┤
│ Quick Actions (4-col grid)           │  ← fadeUp
└──────────────────────────────────────┘
```

**Key patterns:**
- KPI cards: Accent stripe + progress bar + trend badge
- Chart tabs: Area/Bar toggle using `Tabs` component
- AI Insight cards: Severity-colored icon containers + description
- Quick Actions: Color-coded cards with hover stripe animation

### 11.2 Business Plans

**Layout:** Split panel (1/3 list + 2/3 editor)

```
┌────────────┬─────────────────────────┐
│ Plan List  │ Section Editor           │
│ (1/3)      │ ┌─ Section Group ──────┐ │
│            │ │  Grouped sections     │ │
│ • Plan 1   │ │  with color coding   │ │
│ • Plan 2   │ │  per group type      │ │
│ • Plan 3   │ └──────────────────────┘ │
└────────────┴─────────────────────────┘
```

**Key patterns:**
- Section groups: 6 groups (overview, product, business, technical, financial, strategy) each with unique color
- Empty sections: Dashed border + "Generate with AI" button
- Filled sections: Solid border + "Edit" + "AI Rewrite" buttons
- Proposal type selector: 2-col grid of color-coded cards in Dialog
- Progress tracking: `Progress` bar showing completed/total sections

**Section group colors:**

| Group | Color | Sections |
|-------|-------|----------|
| Overview | Emerald | Cover Page, Executive Summary, Company Overview, Problem Statement |
| Product & Market | Cyan | Solution/Product, Market Analysis, Industry Research, Competitor Analysis |
| Business Model | Amber | Business Model, Revenue Streams, Go-To-Market, Operations Plan |
| Technical & Team | Teal | Technology/System, Management Team |
| Financial | Rose | Financial Forecast, Funding Requirement, Use of Funds, Risk Analysis |
| Strategy | Orange | SWOT Analysis, Exit Strategy, Appendices |

### 11.3 Financials

**Layout:** 6-tab interface with complex sub-layouts

```
┌──────────────────────────────────────────┐
│ Overview │ Revenue │ Expenses │ Bank │ Statements │ Advisor │
├──────────────────────────────────────────┤
│                                          │
│  Tab-specific content                    │
│  (Summary cards, charts, tables,         │
│   gauges, sliders, risk indicators)      │
│                                          │
└──────────────────────────────────────────┘
```

**Key patterns:**
- **DSCR Gauge**: SVG semicircle with 4 color zones, needle, and center value
- **Summary cards**: 4-col grid with icon, value, change indicator
- **Revenue modeling**: Chart + sliders for growth rate, churn rate, ARPU
- **Financial statements**: Indented table rows with bold totals
- **Composed chart**: Bar (revenue) + Area (expenses) + Line (profit)
- **Forecast with confidence bands**: Upper/lower bound areas
- **Risk indicators**: Color-coded severity badges
- **Bank approval checklist**: Pass/fail with `CheckCircle2`/`Circle` icons

### 11.4 Idea Canvas

**Layout:** Split panel (1/3 list + 2/3 canvas/report)

```
┌────────────┬─────────────────────────┐
│ Idea List  │ Canvas / Report Toggle   │
│ (1/3)      │                          │
│ • Idea 1 ○ │ Canvas: 5-field form     │
│ • Idea 2 ● │ Report: Gauge + Radar +  │
│            │   Benchmarks + Findings  │
└────────────┴─────────────────────────┘
```

**Key patterns:**
- **Score gauge**: Circular SVG with color zones (rose < 40, amber < 70, emerald ≥ 70)
- **Radar chart**: SVG pentagon with 5 axes (Market, Problem, Solution, Revenue, Competitive)
- **Idea list items**: Score circle + status badge + risk count
- **Validation form**: 2-col grid with icon-labeled fields
- **Benchmark comparison**: Table with above/below indicators

### 11.5 Pitch Deck

**Layout:** Split panel (1/3 list + 2/3 slide editor)

```
┌────────────┬─────────────────────────┐
│ Deck List  │ Slide Editor             │
│ (1/3)      │ ┌─ Slide Preview Card ─┐│
│            │ │ Gradient header bar   ││
│ • Deck 1   │ │ Content textarea     ││
│ • Deck 2   │ │ Data points table    ││
│            │ │ Linked section badge ││
│            │ └──────────────────────┘│
│            │ ┌─ Thumbnail Strip ────┐│
│            │ ┌─ Questions Tab ──────┐│
│            │ │ Accordion Q&A cards  ││
└────────────┴─────────────────────────┘
```

**Key patterns:**
- **Slide type badges**: Color-coded per slide type (title=emerald, problem=rose, solution=cyan, etc.)
- **Template type selector**: 3-col grid (Investor/Bank/Grant) with distinct colors
- **Slide preview card**: Gradient header bar + content textarea + data point table
- **Thumbnail strip**: Horizontal scroll of mini slide cards
- **Anticipated questions**: Accordion with difficulty badges (easy=emerald, medium=amber, hard=rose)

### 11.6 Agent Console

**Key patterns:**
- Agent status with pulse animation when running
- Status badges: `bg-{color}-500/15` with appropriate color per status

### 11.7 Copilot Panel

**Key patterns:**
- Chat bubbles: User (primary bg), Assistant (muted bg with border)
- Suggested prompts: Bordered buttons with emerald hover
- Online indicator: `animate-pulse` on emerald dot
- Send button: `bg-gradient-to-r from-emerald-500 to-teal-600`

### 11.8 OpenClaw Multi-Channel Gateway

**Layout:** Split panel (1/3 channels/plugins + 2/3 conversation/log)

```
┌────────────┬─────────────────────────────────────┐
│ Left Panel │ Right Panel                          │
│ (1/3)      │                                      │
│            │ ┌─ Tab Bar ────────────────────────┐ │
│ ┌────────┐ │ │ Messages │ Delegates │ Automation │ │
│ │Channel │ │ ├──────────────────────────────────┤ │
│ │Status  │ │ │                                  │ │
│ │Cards   │ │ │  Message Log /                    │ │
│ │(6x)    │ │ │  Conversation Viewer             │ │
│ └────────┘ │ │  (channel-specific formatting)    │ │
│ ┌────────┐ │ │                                  │ │
│ │Plugin  │ │ │                                  │ │
│ │Grid    │ │ │                                  │ │
│ │(6x)    │ │ └──────────────────────────────────┘ │
│ └────────┘ │                                      │
│ ┌────────┐ │ ┌─ SOUL.md Editor ─────────────────┐ │
│ │Delegate│ │ │  Code editor with syntax          │ │
│ │List    │ │ │  highlighting (read/edit mode)    │ │
│ │(7x)   │ │ └──────────────────────────────────┘ │
│ └────────┘ │                                      │
│ ┌────────┐ │ ┌─ Webhook Management ─────────────┐ │
│ │Auto-   │ │ │  Event badges + test buttons      │ │
│ │mation  │ │ └──────────────────────────────────┘ │
│ │Scheduler│ │                                     │
│ └────────┘ │                                      │
└────────────┴─────────────────────────────────────┘
```

**Key patterns:**

#### Channel Status Cards
- 6 cards in a 2-col grid (`grid-cols-2`)
- Each card shows: channel icon, name, status indicator, message count
- Status indicators:
  - **Active**: `bg-emerald-500/15 text-emerald-600 dark:text-emerald-400` + pulsing dot
  - **Inactive**: `bg-amber-500/15 text-amber-600 dark:text-amber-400` + static dot
  - **Error**: `bg-rose-500/15 text-rose-600 dark:text-rose-400` + warning icon
  - **Beta**: `bg-cyan-500/15 text-cyan-600 dark:text-cyan-400` + beta badge

```tsx
// Channel status card pattern
<Card className="border-border/40 bg-card/80">
  <CardContent className="p-3 flex items-center gap-3">
    <div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
      <Radio className="h-4 w-4 text-cyan-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium">WhatsApp</p>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-emerald-500">Active</span>
      </div>
    </div>
    <Badge variant="outline" className="text-[10px]">142 msg</Badge>
  </CardContent>
</Card>
```

#### Plugin Cards with Capability Badges
- 6 cards in a 2-col grid
- Each card shows: plugin name, key, description, capability badges
- Capability badges: `bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20`
- "Execute" button: emerald accent with `Sparkles` icon

```tsx
<Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 text-[10px] px-1.5">
  generate_business_plan
</Badge>
```

#### Delegate Personality Cards
- 7 delegate cards in a vertical list
- Each card shows: delegate icon, name, type, channel affinity badges, status
- Channel affinity badges: small colored pills per channel
- Status: running (emerald pulse), idle (gray), active (emerald)

#### SOUL.md Code Editor with Syntax Highlighting
- Full-width code editor using `Textarea` with monospace font
- Syntax highlighting via markdown-style formatting
- Toggle between read mode (rendered) and edit mode (raw text)
- "Save" button with emerald accent
- Section headers in `text-cyan-500` for SOUL-specific keywords

```tsx
<Textarea
  className="font-mono text-sm bg-card/60 border-border/40 min-h-[200px]"
  value={soulContent}
  onChange={(e) => setSoulContent(e.target.value)}
/>
```

#### Automation Cron Display
- 4 pre-configured tasks in a list
- Each row: task name, cron schedule (human-readable), delegate badge, toggle switch
- Cron schedule in `text-xs font-mono text-muted-foreground`
- Active/inactive toggle using `Switch` component

```tsx
<div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
  <div>
    <p className="text-sm font-medium">KPI Digest</p>
    <p className="text-xs font-mono text-muted-foreground">0 8 * * *</p>
  </div>
  <Badge variant="outline" className="text-[10px]">Business Analyst</Badge>
  <Switch checked={true} />
</div>
```

#### Webhook Event Badges
- Webhook URLs displayed with event type badges
- HTTP method badges: `POST` in amber badge
- Event type badges: `message` in cyan, `interaction` in emerald, `event` in teal
- "Test" button per webhook with `RefreshCw` icon
- "Copy URL" button with `Copy` icon

```tsx
<Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] px-1.5">
  POST
</Badge>
<Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] px-1.5">
  message
</Badge>
```

#### Message Log / Conversation Viewer
- Filterable by channel (tabs or dropdown)
- Message bubbles: User (left-aligned, muted bg), Assistant (right-aligned, card bg)
- Channel icon indicator per message
- Timestamp in `text-[10px] text-muted-foreground`
- Delegate badge on assistant messages showing which delegate responded
- Search bar with `Search` icon for message search

---

## 12. Accessibility Guidelines

### 12.1 Color Contrast

| Context | Minimum Ratio | Implementation |
|---------|---------------|----------------|
| Body text on background | 4.5:1 (AA) | `text-foreground` on `bg-background` |
| Large text (≥18px) | 3:1 (AA) | KPI values, headings |
| UI components | 3:1 (AA) | Borders, icons, focus rings |
| Decorative | No requirement | Backgrounds, gradients |

### 12.2 Focus Management

- All interactive elements use `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Button focus: Ring outline on keyboard focus only
- Input focus: `focus:border-emerald-500` for copilot input
- Skip-to-content: Supported via semantic HTML structure

### 12.3 Semantic Structure

```tsx
// Page structure
<div className="h-screen flex">           // App shell
  <aside>                                  // Sidebar (nav)
  <div className="flex-1 flex flex-col">   // Main area
    <header>                               // Header
    <main>                                 // Content
      <section aria-label="KPIs">          // Named sections
```

### 12.4 ARIA Patterns

| Component | ARIA | Implementation |
|-----------|------|----------------|
| Sidebar nav | `role="nav"` (implicit) | `<nav>` element |
| KPI sections | `aria-label` | `<section aria-label="Key Performance Indicators">` |
| Chart sections | `aria-label` | `<section aria-label="Financial Charts">` |
| Tooltips | Proper trigger/content | Radix Tooltip primitive |
| Dialogs | Modal focus trap | Radix Dialog primitive |
| Tabs | Proper tab/tabpanel | Radix Tabs primitive |
| Command palette | Search dialog | `CommandDialog` with proper ARIA |

### 12.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

> **TODO:** Add explicit `prefers-reduced-motion` support to Framer Motion variants. Consider using `useReducedMotion()` hook to disable stagger delays and spring animations.

### 12.6 Keyboard Navigation

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open Command Palette |
| `Tab` | Navigate between interactive elements |
| `Escape` | Close dialogs, copilot panel |
| `Enter` | Submit forms, confirm actions |

---

## 13. Design Decisions & Rationale

### 13.1 Why No Blue/Indigo?

Blue and indigo are the default colors of 90% of SaaS products. GangNiaga is purpose-built for Southeast Asian business operations. The emerald→teal→cyan palette signals:
- **Growth** (emerald = money, progress)
- **Intelligence** (teal = AI, depth)
- **Clarity** (cyan = data, transparency)

This differentiates GangNiaga visually from generic business tools.

### 13.2 Why oklch Color Space?

`oklch` provides:
- **Perceptually uniform** lightness adjustments
- **Better dark mode** transformations (lightness channel is reliable)
- **Future-proof** CSS color specification
- **Consistent chroma** across the palette

### 13.3 Why Dark Mode Default?

The target users are founders and financial analysts who work long hours. Dark mode:
- Reduces eye strain during extended sessions
- Makes colored accents (emerald, amber, rose) more vibrant
- Conveys the "professional tool" aesthetic
- Matches the AI/tech positioning of the product

### 13.4 Why Geist Font?

- Designed for UI/dashboards (not editorial)
- Excellent at small sizes (10px–14px range)
- Monospace companion for code/data alignment
- Variable font for optimal loading

### 13.5 Why Spring Animations for Sidebar?

Springs feel natural and physical. The chosen values (damping=25, stiffness=300) produce:
- Fast initial movement (professional, not sluggish)
- Subtle overshoot (alive, not robotic)
- Quick settle (efficient, not distracting)

### 13.6 Why Framer Motion Over CSS Animations?

- **Layout animations** (shared `layoutId` for active indicator)
- **AnimatePresence** for enter/exit transitions
- **Stagger support** with custom variants
- **Spring physics** for natural motion
- **Performance** via `transform` and `opacity` only

### 13.7 Why shadcn/ui New York Style?

- **Smaller, denser** than Default style — fits more data per screen
- **Consistent API** across 50+ components
- **Customizable** via CSS variables (matches our oklch approach)
- **Accessible by default** (Radix primitives)
- **No runtime cost** — components are copied, not imported

### 13.8 Why Split-Panel Layouts for Editors?

Business Plans, Idea Canvas, and Pitch Deck all use a 1/3 + 2/3 split because:
- **Left panel**: Fast switching between items (list pattern)
- **Right panel**: Focused editing/viewing context
- **Spatial memory**: Users know where to find the list vs. the detail
- **Mobile graceful degradation**: Stacks vertically naturally

---

## 14. Design Tokens Reference

### 14.1 Complete CSS Variables

```css
:root {
  /* Radius */
  --radius: 0.625rem;           /* 10px base */

  /* Surfaces */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* Semantic */
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);

  /* Borders & Focus */
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Charts */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);

  /* Sidebar */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
```

### 14.2 Tailwind Theme Extension

```typescript
// tailwind.config.ts
{
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
```

### 14.3 Component Library Configuration

```json
// components.json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

### 14.4 Custom Utility Classes

```css
/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #34d399, #2dd4bf, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Agent pulse animation */
.animate-agent-pulse {
  animation: agent-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth scrolling */
.main-content { scroll-behavior: smooth; }

/* Recharts tooltip override */
.recharts-default-tooltip {
  background: oklch(0.2 0 0) !important;
  border: 1px solid oklch(1 0 0 / 10%) !important;
  border-radius: 8px !important;
  padding: 8px 12px !important;
}
.dark .recharts-default-tooltip {
  background: oklch(0.25 0 0) !important;
}
```

### 14.5 Module-Level Color Constants

```typescript
// Used in Dashboard, Financials, Idea Canvas
const CHART_COLORS = {
  emerald: '#34d399',
  amber:   '#fbbf24',
  rose:    '#fb7185',
  cyan:    '#22d3ee',
  teal:    '#2dd4bf',
  orange:  '#fb923c',
} as const;

// Used in Financials module (slightly different 500-scale)
const COLORS = {
  emerald: '#10b981',  emeraldLight: '#d1fae5',
  amber:   '#f59e0b',  amberLight:   '#fef3c7',
  rose:    '#f43f5e',  roseLight:    '#ffe4e6',
  cyan:    '#06b6d4',  cyanLight:    '#cffafe',
  teal:    '#14b8a6',  tealLight:    '#ccfbf1',
};
```

> **Recommendation:** Consolidate `CHART_COLORS` and `COLORS` into a single shared constant in `@/lib/constants.ts` to ensure consistency.

---

## Appendix: File Structure

```
src/
├── app/
│   ├── globals.css              ← Theme variables, custom utilities
│   ├── layout.tsx               ← Font loading, ThemeProvider, Toaster
│   └── page.tsx                 ← App shell (Sidebar + Header + Content + Copilot)
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx          ← Collapsible nav with 5 groups
│   │   ├── header.tsx           ← Top bar with search, theme, notifications
│   │   └── command-palette.tsx  ← ⌘K global command dialog
│   ├── modules/
│   │   ├── dashboard.tsx        ← KPI cards + Charts + AI Insights
│   │   ├── business-plans.tsx   ← Split panel + Section editor
│   │   ├── financials.tsx       ← 6-tab financial engine
│   │   ├── idea-canvas.tsx      ← Validation + Radar + Gauge
│   │   ├── pitch-deck.tsx       ← Slide editor + Q&A accordion
│   │   ├── agents.tsx           ← Agent console
│   │   ├── workflows.tsx        ← Workflow builder
│   │   ├── memory.tsx           ← Memory engine
│   │   ├── reports.tsx          ← Report generator
│   │   ├── plan-actuals.tsx     ← Variance tracker
│   │   ├── plan-review.tsx      ← Cross-check module
│   │   ├── research.tsx         ← Research agent
│   │   ├── copilot.tsx          ← AI chat panel
│   │   └── settings.tsx         ← Configuration
│   └── ui/                      ← 50+ shadcn/ui components
├── hooks/
│   ├── use-mobile.ts            ← Mobile breakpoint hook
│   └── use-toast.ts             ← Toast notifications
└── lib/
    ├── store.ts                 ← Zustand global store
    ├── types.ts                 ← TypeScript type definitions
    ├── utils.ts                 ← cn() utility
    └── db.ts                    ← Database client
```

---

*This document is the single source of truth for the GangNiaga AI OS design system. All UI changes should reference and update this document.*
