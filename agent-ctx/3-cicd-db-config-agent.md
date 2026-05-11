# Task ID: 3 — CI/CD & DB Config Agent

## Task: Create GitHub Actions CI/CD workflow and update Prisma for dual DB support

### Work Log

**Part 1: Created `/home/z/my-project/.github/workflows/deploy.yml`**
- GitHub Actions CI/CD workflow with 3 jobs:
  - `lint`: Lint & Type Check — runs on every push/PR to main
    - Uses Bun (latest) + Node.js 20
    - Steps: checkout, setup bun, setup node, bun install, db:generate, ESLint
    - Does NOT run build (Vercel handles deployment builds)
  - `deploy-preview`: Deploys preview on pull requests (only after lint passes)
    - Uses amondnet/vercel-action@v25
    - Requires VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID secrets
  - `deploy-production`: Deploys to production on push to main (only after lint passes)
    - Uses amondnet/vercel-action@v25 with `--prod` flag
    - Requires same Vercel secrets
- Validated YAML syntax with Python yaml.safe_load — passes ✓

**Part 2: Updated `/home/z/my-project/prisma/schema.prisma`**
- Added dual-database support comment to datasource block:
  - `provider = "sqlite"  // Change to "postgresql" for Vercel/production deployment`
- Chose Option A (simple comment approach) as specified — Prisma doesn't support dynamic provider switching
- For Vercel/production: change provider to "postgresql" and set a PostgreSQL DATABASE_URL

**Part 3: Verification**
- `bun run lint` passes clean with no errors ✓
- YAML file is valid ✓
- Dev server still running ✓

### Stage Summary
- GitHub Actions CI/CD workflow created with lint, deploy-preview, and deploy-production jobs
- Prisma schema updated with dual-DB documentation comment (SQLite local / PostgreSQL production)
- All checks pass, no regressions
