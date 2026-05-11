# Task 5: Plan Review Agent (Lender Persona) Module

## Summary
Built the complete Plan Review Agent module for GangNiaga AI OS. This module reads generated business plans the way a lender or bank would, cross-checking the narrative against financials and flagging discrepancies.

## Files Created/Modified

### Created
1. **`/home/z/my-project/src/components/modules/plan-review.tsx`** — Main module component
   - `ScoreGauge` — SVG arc gauge component for score visualization
   - `DiscrepancyCard` — Expandable discrepancy card with severity styling and side-by-side narrative vs financials comparison
   - `RecommendationCard` — Priority-ordered recommendation card with impact
   - `LenderPersonaBadge` — Persona badge (Bank/Investor/Grant Officer) with icons
   - `ReviewSummaryCard` — Compact review card for multi-review selector
   - `PlanReviewModule` — Main exported component with full UI

2. **`/home/z/my-project/src/app/api/plan-review/route.ts`** — API route
   - POST endpoint that uses z-ai-web-dev-sdk for AI-powered review generation
   - Accepts `planId` and `lenderPersona` parameters
   - Returns structured review data with scores, discrepancies, and recommendations

### Modified
3. **`/home/z/my-project/src/app/page.tsx`** — Added PlanReviewModule to moduleComponents map
4. **`/home/z/my-project/src/components/layout/sidebar.tsx`** — Added "Plan Review" nav item with Scale icon

## Features Implemented
- ✅ Header with lender persona selector
- ✅ 4 circular SVG score gauges (Narrative, Financial, Consistency, Overall) with color coding
- ✅ Score color logic: <40 red, 40-70 amber, 70-85 emerald, >85 teal
- ✅ Discrepancies tab with severity-coded cards (Critical/red, Warning/amber, Info/cyan)
- ✅ Expand/collapse for discrepancy details
- ✅ Side-by-side comparison: "What your narrative says" vs "What your financials show"
- ✅ Suggested fix section for each discrepancy
- ✅ Recommendations tab with High/Medium/Low priority badges
- ✅ Full Report tab with executive summary and detailed findings
- ✅ New Review dialog (pick plan + persona)
- ✅ Export Report button
- ✅ Lender persona badges: Bank (emerald/Building2), Investor (cyan/TrendingUp), Grant Officer (amber/Landmark)
- ✅ Framer Motion animations throughout
- ✅ Responsive design
- ✅ Dark theme friendly
- ✅ Renders mock data beautifully (completed review for planId '1')
- ✅ No Recharts — pure SVG for score gauges

## Lint Status
- The project has 2 pre-existing lint errors in `plan-actuals.tsx` (not related to this task)
- The `plan-review.tsx` module is lint-clean
