# Task 3: Idea Canvas & Validation Engine Module

## Summary
Built the complete Idea Canvas & Validation Engine module component for the GangNiaga AI OS project.

## File Created
- `/home/z/my-project/src/components/modules/idea-canvas.tsx`

## Files Modified
- `/home/z/my-project/src/app/page.tsx` — Registered `IdeaCanvasModule` in `moduleComponents`
- `/home/z/my-project/src/components/layout/sidebar.tsx` — Added `idea-canvas` nav item with `Lightbulb` icon

## Component Features

### Layout
- **Header**: Title "Idea Canvas & Validation", subtitle, status badges ("AI Validated" / "Draft")
- **Left Panel (1/3)**: Idea list with score circles, status badges, click-to-select
- **Right Panel (2/3)**: Two modes — Canvas Mode and Validation Report Mode

### Canvas Mode
- 5-field form: Problem, Solution, Target Market, Revenue Model, Competitive Edge
- Risks list with add/remove functionality
- "Validate with AI" button

### Validation Report Mode
- **Score Gauge**: Circular SVG gauge (0-100), color-coded (red <40, amber 40-70, emerald >70)
- **Radar Chart**: 5-dimension SVG radar (Market Viability, Problem Clarity, Solution Feasibility, Revenue Potential, Competitive Position)
- **Score Breakdown**: Progress bars for each dimension
- **Strengths/Weaknesses Cards**: Color-coded with icons
- **Red Flags Section**: Critical styling with rose/red color scheme
- **Recommendations**: Numbered action items with teal accent
- **Benchmark Comparison**: Visual indicators (above/below/at) with animated bars
- **Risk Level Badge**: Color-coded (low/medium/high/critical)

### Status Badges
- Draft: amber with Edit icon
- Validating: cyan with Loader2 spinner
- Validated: emerald with CheckCircle2
- Needs Rework: rose with XCircle

### Empty State
- "Create Your First Idea" prompt with feature highlights

### Animations
- Framer Motion for card transitions, list animations, tab switching
- Animated score progress bars
- AnimatePresence for smooth mode transitions
- Validating state with animated pulse dots

## Technical Details
- Uses `useAppStore` from `@/lib/store` for `ideaCanvases`, `selectedIdea`, `setSelectedIdea`
- Imports types `IdeaCanvasData`, `ValidationReport` from `@/lib/types`
- All shadcn/ui components used: Card, Badge, Button, Tabs, Input, Textarea, Dialog, Progress, Separator, ScrollArea
- No Recharts — all visualizations built with custom SVG
- Color scheme: emerald/teal/amber (no indigo/blue)
- Responsive design (mobile-first)
- Dark theme compatible
