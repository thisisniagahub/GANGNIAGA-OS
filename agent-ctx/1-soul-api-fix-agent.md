# Task 1 — SOUL API Fix Agent

## Task
Fix OpenClaw SOUL.md API route to use database instead of filesystem

## Work Summary

### Changes Made

1. **Prisma Schema** (`prisma/schema.prisma`)
   - Added `OpenClawSoulConfig` model with fields: id, personality, tone, language, specialty, greeting, rules, organizationId, createdAt, updatedAt
   - Added `openclawSoulConfigs OpenClawSoulConfig[]` relation to Organization model
   - Ran `bun run db:push` — schema synced successfully

2. **SOUL API Route** (`src/app/api/openclaw/soul/route.ts`)
   - Completely rewrote from filesystem-based to Prisma database-backed
   - Removed: `fs/promises` (readFile, writeFile), `path` imports
   - Added: `import { db } from '@/lib/db'`
   - GET: Queries OpenClawSoulConfig for orgId 'org1', creates with defaults if not found, parses rules JSON
   - PUT: Validates required fields, uses findFirst + update/create pattern, stringifies rules array
   - Helper `toResponse()` converts DB row to API response with parsed rules

### Verification
- `bun run db:push` ✅
- `bun run lint` ✅ (no errors)
- Dev server compiling and serving 200s ✅
