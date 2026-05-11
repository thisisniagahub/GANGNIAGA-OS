# Task 3 — DB Vercel Compatibility & Seed Script

## Summary
Made the database Vercel-compatible and created a comprehensive seed script with idempotent upsert patterns.

## Files Modified
- `prisma/schema.prisma` — Added dual-database header comments with migration instructions
- `src/lib/db.ts` — Added dual-database support, error handling middleware, database type detection
- `package.json` — Added seed, db:seed, postmigrate scripts

## Files Created
- `prisma/seed.ts` — Comprehensive seed script (org, user, soul config, 5 skills, memories, gateway, channels)
- `scripts/setup-vercel.sh` — Vercel deployment setup script (validate, migrate, seed)
- `.env.production.example` — Production environment variable template

## Key Decisions
1. Seed script uses `@prisma/client` directly (not `@/lib/db`) to avoid Next.js deps
2. Skills check both `name` and `slug` unique constraints; handles old slug migration
3. Prisma schema comments use `//` not `#` (Prisma validation rejects `#`)
4. db.ts middleware re-throws P2002/P2025 errors for normal upsert/CRUD flows

## Verification
- `bun run db:push` ✅
- `bunx tsx prisma/seed.ts` (first run) ✅ — all data created
- `bunx tsx prisma/seed.ts` (second run) ✅ — all skipped (idempotent)
- `bun run lint` ✅ — no errors
- Dev server serving 200s ✅
