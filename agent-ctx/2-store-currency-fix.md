# Task 2 — Store & Currency Fix Agent

## Summary

Fixed currency inconsistency (standardized all `$` to `RM` Malaysian Ringgit) and added 16 CRUD action methods to the Zustand store.

## Changes Made

### Currency Fixes
- **dashboard.tsx**: YAxis tickFormatters (2x), tooltip formatters (3x) — `$` → `RM`
- **financials.tsx**: `formatCurrency` function, `formatFullCurrency` (en-US/USD → en-MY/MYR), P&L data (14 values), Balance Sheet (16 values), Cash Flow (12 values), optimization suggestions (4 values), ARPU label, churn impact text
- **store.ts**: Agent task output `$920K` → `RM920K`
- **plan-actuals.tsx**: Already correct ✓

### Zustand Store CRUD Actions (16 new methods)
- `updatePlan`, `deletePlan`
- `addReport`, `updateReport`
- `addWorkflow`, `updateWorkflow`
- `addAgent`, `updateAgent`
- `addPlanActual`, `updatePlanActual`
- `updateIntegration`
- `updatePitchDeck`, `deletePitchDeck`
- `addPlanReview`
- `updateFinancialAssumption` (propagates through KPIs)

## Verification
- Lint: passes clean
- Dev server: compiling and serving 200s
