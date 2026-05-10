# Task 7: Dynamic Pitch Deck Orchestrator Module

## Summary
Built the complete Pitch Deck Orchestrator module for the GangNiaga AI OS project.

## Files Created/Modified

### Created
1. **`/home/z/my-project/src/components/modules/pitch-deck.tsx`** — Main module component
   - `'use client'` directive with all required imports
   - `PitchDeckModule` default export
   - Uses `useAppStore` from `@/lib/store` for state management
   - Imports types: `PitchDeckData`, `PitchSlide`, `AnticipatedQuestion`, `BusinessPlanData`
   - Uses all required shadcn/ui components (Card, Badge, Tabs, Select, Dialog, Separator, ScrollArea, Input, Textarea)
   - Uses Framer Motion for animations (AnimatePresence, motion)
   - Uses all required Lucide icons (Presentation, Sparkles, FileText, ArrowRight, ArrowLeft, etc.)
   - Uses `cn` from `@/lib/utils`

2. **`/home/z/my-project/src/app/api/pitch-deck/route.ts`** — API endpoint
   - POST endpoint for generating slides and anticipated questions
   - Uses `z-ai-web-dev-sdk` for AI generation
   - Template-specific context (investor, bank, grant)
   - JSON parsing with fallback mock data

### Modified
3. **`/home/z/my-project/src/app/page.tsx`** — Added pitch-deck to moduleComponents mapping
4. **`/home/z/my-project/src/components/layout/sidebar.tsx`** — Added Pitch Deck nav item with Presentation icon

## Features Implemented
- **Header**: Title, subtitle, template type badge, AI Powered badge, Export button
- **Left Panel (1/3)**: Deck list with status badges, slide count, template type, delete, New Deck dialog
- **Right Panel (2/3)**:
  - **Slide Editor View**: Thumbnail strip navigation, slide carousel with prev/next arrows, editable title/content, data points table, linked section indicator, "Sync from Plan" button
  - **Anticipated Questions View**: AI-generated funder questions with difficulty badges (easy=emerald, medium=amber, hard=rose), category tags, expandable suggested answers, "Regenerate Questions" button
- **New Deck Dialog**: Title input, business plan selector, template type picker (investor/bank/grant)
- **Slide Type Colors**: title=emerald, problem=rose, solution=cyan, market=amber, business_model=teal, financials=emerald, team=amber, ask=cyan, appendix=gray
- **Template Type Badges**: Investor=emerald, Bank=teal, Grant=amber
- **Mock Data**: 1 completed pitch deck with 7 slides and 4 anticipated questions (already in store)
- **Responsive Design**: Mobile-first layout
- **Dynamic Variables**: Data points auto-sync when financial assumptions change
