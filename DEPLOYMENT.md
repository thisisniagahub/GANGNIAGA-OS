# 🚀 GangNiaga AI OS — Deployment Guide

> Complete guide for deploying GangNiaga AI OS to production

---

## Prerequisites

### System Requirements
| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.x+ | 20.x+ |
| Bun | 1.0+ | Latest |
| RAM | 2GB | 4GB+ |
| Disk | 1GB | 5GB+ |
| CPU | 1 core | 2+ cores |

### Environment Variables
```env
# Database
DATABASE_URL="file:./db/custom.db"

# AI SDK (Required for all AI features)
ZAI_API_KEY=your_zai_api_key_here

# Authentication (Phase 1)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Integrations (Phase 3)
QUICKBOOKS_CLIENT_ID=your_qb_client_id
QUICKBOOKS_CLIENT_SECRET=your_qb_client_secret
XERO_CLIENT_ID=your_xero_client_id
XERO_CLIENT_SECRET=your_xero_client_secret

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=GangNiaga AI OS
```

---

## Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-org/gangniaga-ai-os.git
cd gangniaga-ai-os

# Install dependencies
bun install

# Set up database
bun run db:push

# Start development server
bun run dev
```

### Development Scripts
| Script | Description |
|--------|-------------|
| `bun run dev` | Start Next.js dev server on port 3000 |
| `bun run lint` | Run ESLint checks |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run db:reset` | Reset database (destructive) |

### Development Server Log
```bash
# Check dev server logs
tail -f dev.log
```

---

## Production Deployment

### Option 1: Vercel (⭐ #1 Recommended — Easiest & Fastest)

Vercel is the creator of Next.js and provides the most seamless deployment experience. The free tier is sufficient to get started, and scaling is automatic.

---

#### Prerequisites

| Requirement | Details |
|-------------|---------|
| **GitHub account** | Your repo must be hosted on GitHub |
| **Vercel account** | Sign up at [vercel.com](https://vercel.com) — free tier works |
| **PostgreSQL database** | Required (SQLite does NOT work on Vercel — no persistent file system) |

---

#### Step 1: Set Up PostgreSQL Database

Since Vercel's serverless environment has no persistent file system, you **must** use PostgreSQL instead of SQLite. Choose one of these options:

| Option | Provider | Free Tier | Setup Difficulty |
|--------|----------|-----------|------------------|
| **A** | Vercel Postgres | ✅ 256MB storage | 🟢 Easiest — one click |
| **B** | [Neon](https://neon.tech) | ✅ 0.5GB storage | 🟢 Easy |
| **C** | [Supabase](https://supabase.com) | ✅ 500MB storage | 🟢 Easy |

**Option A: Vercel Postgres (Easiest)**
1. Go to your Vercel dashboard → **Storage** → **Create Database** → **Postgres**
2. Select the free plan and connect it to your project
3. The `DATABASE_URL` environment variable is **automatically set** — skip to Step 3

**Option B: Neon**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string from the dashboard — it looks like:
   ```
   postgresql://username:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

**Option C: Supabase**
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database** → copy the connection string (URI format)
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

> 💡 **Save your `postgresql://` connection string** — you'll need it in Step 4.

---

#### Step 2: Update Prisma Schema for PostgreSQL

Before deploying, you must change the database provider from SQLite to PostgreSQL:

1. Open `prisma/schema.prisma`
2. Change the `provider` line:

```diff
datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
   url      = env("DATABASE_URL")
}
```

3. Commit this change to your repository:
```bash
git add prisma/schema.prisma
git commit -m "chore: switch Prisma provider to PostgreSQL for Vercel deployment"
git push origin main
```

> ⚠️ **Important**: This change is required for Vercel. SQLite will not work on Vercel because serverless functions have no persistent file system.

---

#### Step 3: Connect GitHub Repo to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository (if it doesn't appear, click **"Adjust GitHub App Permissions"**)
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `./` (default) |
| **Build Command** | `bun run vercel-build` |
| **Install Command** | `bun install` |
| **Output Directory** | `.next` (default) |

5. **Region**: Select **Singapore (sin1)** for ASEAN users, or the closest region to your target audience

> 💡 The `vercel-build` script (defined in `package.json`) runs `prisma generate && prisma db push && next build` to ensure your database schema is synchronized before the app starts.

---

#### Step 4: Set Environment Variables in Vercel

Before clicking "Deploy", add all required environment variables in the Vercel project settings:

**Required Variables:**

| Variable | Value | How to Get It |
|----------|-------|---------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | From Step 1 (auto-set if using Vercel Postgres) |
| `ZAI_API_KEY` | Your AI API key | From your AI provider dashboard |
| `NEXTAUTH_SECRET` | Random base64 string | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |

**Optional Variables:**

| Variable | Purpose |
|----------|---------|
| `TELEGRAM_BOT_TOKEN` | OpenClaw Telegram channel integration |
| `DISCORD_BOT_TOKEN` | OpenClaw Discord channel integration |
| `SLACK_BOT_TOKEN` | OpenClaw Slack channel integration |
| `GOOGLE_CLIENT_ID` | Google OAuth sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth sign-in |
| `NEXT_PUBLIC_APP_URL` | Public app URL for SEO/metadata |
| `NEXT_PUBLIC_APP_NAME` | App display name (default: "GangNiaga AI OS") |

To add variables:
1. In the Vercel import screen, expand **"Environment Variables"**
2. Add each variable with its value
3. Ensure all are set for **Production**, **Preview**, and **Development** environments

> 💡 You can also add/edit variables later at **Vercel Dashboard → Your Project → Settings → Environment Variables**.

---

#### Step 5: Deploy

1. Click **"Deploy"** in the Vercel dashboard
2. Wait for the build to complete (typically 2–4 minutes on first deploy)
3. The build process will:
   - Run `bun install` to install dependencies
   - Run `prisma generate` to generate the Prisma client
   - Run `prisma db push` to sync the database schema
   - Run `next build` to build the Next.js application
4. Once complete, you'll see a 🎉 success screen with your deployment URL

> 💡 **Subsequent deploys** happen automatically whenever you push to the `main` branch.

---

#### Step 6: Set Up Vercel Postgres (If Using Option A from Step 1)

If you didn't set up Vercel Postgres during Step 1, you can do it now:

1. Go to **Vercel Dashboard** → Your Project → **Storage** tab
2. Click **"Create Database"** → Select **"Postgres"**
3. Choose the free **Hobby** plan
4. Click **"Create & Connect"**
5. Select your project and connect it
6. The `DATABASE_URL` environment variable is **automatically injected** — no manual setup needed
7. Redeploy the project for the variable to take effect:
   ```bash
   # Via Vercel CLI
   vercel --prod
   # Or trigger a redeploy from the Vercel dashboard → Deployments → ⋯ → Redeploy
   ```

---

#### Post-Deployment Verification

After your first successful deploy, verify everything is working:

1. **App loads** — Visit your Vercel URL (e.g., `https://gangniaga-ai-os.vercel.app`)
2. **Dashboard API** — Test: `https://your-app.vercel.app/api/dashboard` (should return JSON)
3. **OpenClaw Gateway** — Test: `https://your-app.vercel.app/api/openclaw/gateway` (should return gateway status)
4. **Database connectivity** — If the dashboard API returns data, your database connection is working
5. **Custom domain** (optional) — Set up at **Vercel Dashboard → Your Project → Settings → Domains**

---

#### GitHub Auto-Deploy Setup

Vercel automatically integrates with GitHub for continuous deployment:

| Feature | How It Works |
|---------|-------------|
| **Auto-deploy on push** | Every push to `main` triggers a production deployment |
| **Preview deployments** | Every Pull Request gets a unique preview URL |
| **Rollback** | Click **⋯** → **Redeploy** on any previous deployment in the Vercel dashboard |
| **Branch protection** | Only `main` deploys to production; other branches get preview URLs |

**CI/CD with GitHub Actions (Advanced):**

For more control over deployments (e.g., staging → production workflow), set up these GitHub repository secrets:

| Secret | How to Get It |
|--------|---------------|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | Run `vercel link` and check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Run `vercel link` and check `.vercel/project.json` |

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run lint
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

#### Troubleshooting Vercel

| Issue | Cause | Solution |
|-------|-------|----------|
| **Build fails with Prisma errors** | Prisma Client not generated | Ensure `postinstall` script in `package.json` runs `prisma generate`. The `vercel-build` script should include it. |
| **SQLite errors on deploy** | SQLite not supported on Vercel | You MUST switch to PostgreSQL (see Step 2). Vercel's serverless functions have no persistent file system. |
| **`DATABASE_URL` not found** | Missing environment variable | Go to Vercel Dashboard → Your Project → Settings → Environment Variables → add `DATABASE_URL` |
| **Environment variable errors** | Vars not set or typo | Check Vercel Dashboard → Settings → Environment Variables. Ensure all required vars are set for Production environment. |
| **504 Gateway Timeout** | Long-running API calls | Add `"maxDuration": 60` to `vercel.json` for routes that need more time. Free tier max is 10s; Pro max is 60s. |
| **`prisma db push` fails** | Bad connection string or DB not reachable | Verify your `DATABASE_URL` is correct and the database is accessible from Vercel's servers. Check SSL mode. |
| **Build succeeds but page shows 500** | Runtime error (missing env var, DB issue) | Check Vercel Function Logs: Dashboard → Your Project → Deployments → Function Logs |
| **CSS/styling broken** | Tailwind CSS not built | Ensure `next build` completes without errors. Check that `tailwind.config.ts` includes all component paths. |
| **API routes return 404** | Route not deployed | Ensure API files are in `src/app/api/` directory. Check Vercel build logs for any compilation errors. |

**Increasing Function Timeout:**

If you have long-running AI API calls, add this to `vercel.json`:

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

> ⚠️ **Note**: `maxDuration` values above 10 seconds require a Vercel Pro plan.

**Checking Build Logs:**

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the failed deployment
3. Expand **"Build Log"** to see the full output
4. Expand **"Function Log"** to see runtime errors

---

### Option 2: Docker

#### Dockerfile
```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN bun run db:generate

# Build
RUN bun run build

# Expose port
EXPOSE 3000

# Start
CMD ["bun", "run", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./db/custom.db
      - ZAI_API_KEY=${ZAI_API_KEY}
    volumes:
      - ./db:/app/db
    restart: unless-stopped

  # Future: PostgreSQL for production
  # postgres:
  #   image: postgres:16-alpine
  #   environment:
  #     POSTGRES_DB: gangniaga
  #     POSTGRES_USER: gangniaga
  #     POSTGRES_PASSWORD: ${DB_PASSWORD}
  #   volumes:
  #     - pgdata:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"
```

```bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f app
```

### Option 3: VPS (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone and setup
git clone https://github.com/your-org/gangniaga-ai-os.git
cd gangniaga-ai-os
bun install
bun run db:push

# Build for production
bun run build

# Start with PM2
bun add -g pm2
pm2 start "bun run start" --name gangniaga
pm2 save
pm2 startup
```

#### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Caddy Gateway (Current Setup)

The project includes a Caddyfile for the built-in gateway:

```
# Caddyfile is at /home/z/my-project/Caddyfile
# Handles:
# - Port 3000 → Next.js app
# - Port 3003 → WebSocket service (future)
# - XTransformPort query parameter for cross-service requests
```

### Gateway Rules
- All API requests to other services must use `?XTransformPort={PORT}`
- Never use absolute URLs like `http://localhost:3003/api/test`
- Use relative paths: `/api/test?XTransformPort=3003`
- WebSocket connections: `io("/?XTransformPort=3003")`

---

## Database Management

### SQLite (Current)
```bash
# Push schema changes
bun run db:push

# Reset database (WARNING: deletes all data)
bun run db:reset

# View database
bunx prisma studio
```

### PostgreSQL Migration (Phase 5)
```bash
# 1. Update prisma/schema.prisma
#    datasource db {
#      provider = "postgresql"
#      url      = env("DATABASE_URL")
#    }

# 2. Set new DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost:5432/gangniaga"

# 3. Run migration
bunx prisma migrate dev --name init-postgresql

# 4. Migrate data from SQLite
bunx prisma db seed
```

### pgvector Setup (Phase 5)
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to AgentMemory
ALTER TABLE "AgentMemory" ADD COLUMN embedding vector(1536);

-- Create similarity search index
CREATE INDEX ON "AgentMemory" USING ivfflat (embedding vector_cosine_ops);
```

---

## Monitoring & Logging

### Application Logging
```bash
# Dev server logs
tail -f dev.log

# PM2 logs (production)
pm2 logs gangniaga

# Docker logs
docker-compose logs -f app
```

### Health Checks
```bash
# Basic health check
curl -f http://localhost:3000/api || exit 1

# Database connectivity
curl -f http://localhost:3000/api/dashboard || exit 1
```

### Performance Monitoring
- **Vercel Analytics** — Built-in for Vercel deployments
- **Sentry** — Error tracking (add `@sentry/nextjs`)
- **PostHog** — Product analytics
- **Uptime Robot** — Uptime monitoring

---

## Security Checklist

### Pre-Deployment
- [ ] All environment variables set (no defaults in code)
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] API keys are not committed to git
- [ ] `.env.local` is in `.gitignore`
- [ ] Database file is not in git
- [ ] CORS headers configured properly
- [ ] Rate limiting enabled on API routes

### Post-Deployment
- [ ] HTTPS enabled (automatic with Vercel/Caddy)
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured
- [ ] Input validation on all API routes
- [ ] SQL injection protection (Prisma parameterized queries)
- [ ] XSS protection (React auto-escaping + CSP headers)
- [ ] CSRF protection (SameSite cookies)

### Security Headers (next.config.ts)
```typescript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  },
];
```

---

## Backup & Recovery

### Database Backup
```bash
# SQLite backup
cp db/custom.db backups/custom-$(date +%Y%m%d).db

# Automated daily backup (crontab)
0 2 * * * cp /home/z/my-project/db/custom.db /backups/custom-$(date +\%Y\%m\%d).db
```

### PostgreSQL Backup (Phase 5)
```bash
# Full backup
pg_dump -U gangniaga -d gangniaga > backup-$(date +%Y%m%d).sql

# Restore
psql -U gangniaga -d gangniaga < backup-20250101.sql
```

---

## Scaling Considerations

### Current Limits (SQLite)
- **Concurrent writes**: 1 at a time
- **Database size**: ~140TB theoretical, practical limit ~1GB
- **Connections**: Single file lock
- **Recommended users**: < 10 concurrent

### Scaling Path
| Users | Database | Infrastructure |
|-------|----------|---------------|
| 1-10 | SQLite | Single VPS |
| 10-100 | PostgreSQL | 2 VPS (app + DB) |
| 100-1000 | PostgreSQL + Redis | Kubernetes |
| 1000+ | PostgreSQL + Redis + CDN | Multi-region |

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `Module not found` | Missing dependencies | `bun install` |
| `Prisma Client not generated` | Missing client | `bun run db:generate` |
| Port 3000 in use | Another process | `lsof -ti:3000 \| xargs kill` |
| AI responses fail | Missing `ZAI_API_KEY` | Set environment variable |
| Database locked | SQLite concurrent writes | Restart dev server |
| Build fails | TypeScript errors | `bun run lint` to identify |

### Emergency Procedures
```bash
# Restart application
pm2 restart gangniaga

# Rollback deployment
vercel --prod --yes

# Database restore
cp backups/custom-20250101.db db/custom.db
```

---

*Last updated: March 2025 | Version: v0.3.0*
