# Task 5 — Plan Actuals & Reports Improvement Agent

## Task Summary
Improve Plan vs Actuals module (add manual data entry, edit, delete, Hire Calculator tab) and Reports module (enhanced generation dialog, preview, download, delete, AI simulation).

## Files Modified
- `src/components/modules/plan-actuals.tsx` — Major rewrite with CRUD, Hire Calculator tab, export
- `src/components/modules/reports.tsx` — Major rewrite with enhanced generation, preview, download, delete

## Key Changes

### Plan vs Actuals Module
- Added "Add Entry" button + dialog with Category, Period, Planned Amount, Actual Amount, Source fields
- Auto-calculates variance and variancePercent on save
- Table rows are clickable for editing; also has explicit Edit/Delete action buttons per row
- Delete with AlertDialog confirmation
- CSV export via "Export" button
- Moved "Hire Calculator" to its own tab with:
  - YES/NO recommendation banner
  - SVG affordability gauge
  - Editable hire cost input
  - Runway comparison and impact
- Toast notifications for all CRUD and sync operations

### Reports Module
- Enhanced generation dialog with Date Range selector and Include Sections checkboxes
- AI generation simulation with progress bar (3-second delay)
- Report preview dialog with simulated formatted content
- Download functionality creating text/blob and triggering browser download
- Delete with AlertDialog confirmation
- Regenerate sets status to "generating" then "completed" after 3 seconds
- Toast notifications for all actions

## Verification
- `bun run lint` — passes clean
- Dev server compiles successfully (200s)
- No regressions to existing functionality
