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
# Database (PRIMARY — Supabase PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=https://psefokmrwtsftdberqtt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Database (FALLBACK — SQLite, local dev only)
DATABASE_URL="file:./db/custom.db"

# AI — OpenRouter (PRIMARY for Vercel)
OPENROUTER_API_KEY_1=sk-or-v1-...
OPENROUTER_API_KEY_2=  # Optional, for round-robin
OPENROUTER_API_KEY_3=  # Optional
OPENROUTER_API_KEY_4=  # Optional
OPENROUTER_MODEL=openrouter/owl-alpha
OPENROUTER_APP_NAME=GangNiaga AI OS
OPENROUTER_APP_URL=https://your-app.vercel.app

# AI — OpenAI (Alternative for Vercel)
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=  # Optional custom endpoint
OPENAI_CHAT_MODEL=gpt-4o
OPENAI_IMAGE_MODEL=dall-e-3
OPENAI_TTS_MODEL=tts-1
OPENAI_ASR_MODEL=whisper-1

# AI — Z AI Gateway (Internal/sandbox only, NOT accessible from Vercel)
ZAI_BASE_URL=http://172.25.136.193:8080/v1
ZAI_API_KEY=  # Auto-configured in sandbox

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Messaging Gateway
TELEGRAM_BOT_TOKEN=
# WhatsApp configured via API

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=GangNiaga AI OS
```

---

## Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/thisisniagahub/GANGNIAGA-OS.git
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
| **Supabase project** | Already configured — PostgreSQL database is set up |

> ✅ **Supabase PostgreSQL is ALREADY SET UP.** No need to create a new database. The project URL is `https://psefokmrwtsftdberqtt.supabase.co` with 27 tables and seed data.

---

#### Step 1: Connect GitHub Repo to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select the GitHub repository: **`thisisniagahub/GANGNIAGA-OS`**
   - If it doesn't appear, click **"Adjust GitHub App Permissions"**
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `./` (default) |
| **Build Command** | `prisma generate && next build` (configured in `vercel.json`) |
| **Install Command** | `bun install` |
| **Output Directory** | `.next` (default) |
| **Region** | Singapore (sin1) — configured in `vercel.json` |

> 💡 The `vercel.json` is already configured with the correct buildCommand (`prisma generate && next build`) and region (`sin1`). No manual build command override needed.

> ⚠️ **Important**: The Prisma schema uses `provider = "sqlite"` for local development. In production (Vercel), the app uses the **Supabase REST API** as the primary database, NOT Prisma with PostgreSQL directly. This dual-database pattern allows local SQLite development while using Supabase in production.

---

#### Step 2: Set Environment Variables in Vercel

Before clicking "Deploy", add all required environment variables in the Vercel project settings:

**Required Variables:**

| Variable | Value | How to Get It |
|----------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://psefokmrwtsftdberqtt.supabase.co` | Already configured in Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase Dashboard → Settings → API → service_role key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Dashboard → Settings → API → anon/public key |
| `DATABASE_URL` | `file:./db/custom.db` | Keep as-is for Prisma client generation |
| `OPENROUTER_API_KEY_1` | `sk-or-v1-...` | From [openrouter.ai](https://openrouter.ai) → Keys |
| `NEXTAUTH_SECRET` | Random base64 string | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |

**AI Provider Variables:**

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENROUTER_API_KEY_1` | Primary OpenRouter key (PRIMARY AI provider for Vercel) | ✅ Yes |
| `OPENROUTER_API_KEY_2` | Round-robin key #2 | No |
| `OPENROUTER_API_KEY_3` | Round-robin key #3 | No |
| `OPENROUTER_API_KEY_4` | Round-robin key #4 | No |
| `OPENROUTER_MODEL` | Model to use (default: `openrouter/owl-alpha`) | No |
| `OPENROUTER_APP_NAME` | App name for OpenRouter (default: `GangNiaga AI OS`) | No |
| `OPENROUTER_APP_URL` | Your app URL for OpenRouter ranking | No |
| `OPENAI_API_KEY` | OpenAI key (alternative provider) | No |
| `OPENAI_BASE_URL` | Custom OpenAI endpoint | No |
| `OPENAI_CHAT_MODEL` | Chat model (default: `gpt-4o`) | No |
| `OPENAI_IMAGE_MODEL` | Image generation model (default: `dall-e-3`) | No |
| `OPENAI_TTS_MODEL` | Text-to-speech model (default: `tts-1`) | No |
| `OPENAI_ASR_MODEL` | Speech-to-text model (default: `whisper-1`) | No |

> ⚠️ **Do NOT set `ZAI_BASE_URL` or `ZAI_API_KEY` on Vercel.** The Z AI Gateway (`http://172.25.136.193:8080/v1`) is an internal/sandbox-only service and is NOT accessible from Vercel's serverless functions. Use OpenRouter (primary) or OpenAI (alternative) for production AI.

**Optional Variables:**

| Variable | Purpose |
|----------|---------|
| `TELEGRAM_BOT_TOKEN` | OpenClaw Telegram channel integration |
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

#### Step 3: Deploy

1. Click **"Deploy"** in the Vercel dashboard
2. Wait for the build to complete (typically 2–4 minutes on first deploy)
3. The build process will:
   - Run `bun install` to install dependencies
   - Run `prisma generate` to generate the Prisma client
   - Run `next build` to build the Next.js application
4. Once complete, you'll see a 🎉 success screen with your deployment URL

> 💡 **Subsequent deploys** happen automatically whenever you push to the `main` branch.

---

#### Step 4: Post-Deployment Verification

After your first successful deploy, verify everything is working:

1. **App loads** — Visit your Vercel URL (e.g., `https://gangniaga-ai-os.vercel.app`)
2. **AI Provider Status** — Test: `https://your-app.vercel.app/api/ai/status` (should return AI provider availability)
3. **Messaging Gateway Status** — Test: `https://your-app.vercel.app/api/gateway/status` (should return gateway channel status)
4. **OpenClaw Gateway** — Test: `https://your-app.vercel.app/api/openclaw/gateway` (should return gateway status)
5. **Database connectivity** — If the dashboard API returns data, your Supabase connection is working
6. **Custom domain** (optional) — Set up at **Vercel Dashboard → Your Project → Settings → Domains**

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

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | `<your-vercel-token>` |
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
| **Build fails with Prisma errors** | Prisma Client not generated | Ensure `vercel.json` buildCommand includes `prisma generate`. |
| **`DATABASE_URL` not found** | Missing environment variable | Go to Vercel Dashboard → Your Project → Settings → Environment Variables → add `DATABASE_URL` |
| **Supabase connection fails** | Missing or wrong keys | Verify `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly. |
| **AI responses fail** | Missing OpenRouter/OpenAI keys | Ensure `OPENROUTER_API_KEY_1` is set. Do NOT rely on ZAI Gateway from Vercel. |
| **Environment variable errors** | Vars not set or typo | Check Vercel Dashboard → Settings → Environment Variables. Ensure all required vars are set for Production environment. |
| **504 Gateway Timeout** | Long-running AI API calls | Add `"maxDuration": 60` to `vercel.json` for routes that need more time. Free tier max is 10s; Pro max is 60s. |
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
      - NEXT_PUBLIC_SUPABASE_URL=https://psefokmrwtsftdberqtt.supabase.co
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - OPENROUTER_API_KEY_1=${OPENROUTER_API_KEY_1}
    volumes:
      - ./db:/app/db
    restart: unless-stopped
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
git clone https://github.com/thisisniagahub/GANGNIAGA-OS.git
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

### Dual-Database Pattern

GangNiaga AI OS uses a dual-database pattern:

| Environment | Database | Access Method |
|-------------|----------|---------------|
| **Local Dev** | SQLite (`file:./db/custom.db`) | Prisma Client directly |
| **Production (Vercel)** | Supabase PostgreSQL | Supabase REST API (dual-client) |

### SQLite (Local Development)
```bash
# Push schema changes
bun run db:push

# Reset database (WARNING: deletes all data)
bun run db:reset

# View database
bunx prisma studio
```

### Supabase PostgreSQL (Production)
- **Project URL**: `https://psefokmrwtsftdberqtt.supabase.co`
- **Tables**: 27 tables with seed data
- **Dual-client pattern**:
  - **Server-side**: `supabase-server.ts` — uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
  - **Client-side**: `supabase-client.ts` — uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (respects RLS)

### Supabase Dashboard
1. Go to [supabase.com](https://supabase.com) → Your Project
2. **Table Editor** — View and edit all 27 tables
3. **SQL Editor** — Run custom SQL queries
4. **Authentication** — Manage users (when auth is implemented)
5. **Settings → API** — Find your project URL and API keys

### pgvector Setup (Future)
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

# AI provider status
curl -f http://localhost:3000/api/ai/status || exit 1

# Messaging gateway status
curl -f http://localhost:3000/api/gateway/status || exit 1

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
- [ ] Supabase service role key is kept secret (server-side only)

### Post-Deployment
- [ ] HTTPS enabled (automatic with Vercel/Caddy)
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured
- [ ] Input validation on all API routes
- [ ] SQL injection protection (Prisma parameterized queries)
- [ ] XSS protection (React auto-escaping + CSP headers)
- [ ] CSRF protection (SameSite cookies)
- [ ] Supabase RLS policies configured for production

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
# SQLite backup (local dev)
cp db/custom.db backups/custom-$(date +%Y%m%d).db

# Automated daily backup (crontab)
0 2 * * * cp /home/z/my-project/db/custom.db /backups/custom-$(date +\%Y\%m\%d).db
```

### Supabase Backup
```bash
# Supabase provides automatic daily backups on paid plans
# For manual backup via pg_dump:
pg_dump -U postgres -h aws-0-[region].pooler.supabase.com -d postgres > backup-$(date +%Y%m%d).sql

# Restore
psql -U postgres -h aws-0-[region].pooler.supabase.com -d postgres < backup-20250101.sql
```

> 💡 Supabase free tier includes automatic daily backups retained for 7 days.

---

## Scaling Considerations

### Current Architecture
| Environment | Database | AI Provider | Limits |
|-------------|----------|-------------|--------|
| **Sandbox** | SQLite + Supabase | Z AI Gateway (internal) | Single user, no external access |
| **Vercel** | Supabase PostgreSQL | OpenRouter / OpenAI | Serverless, auto-scaling |

### Scaling Path
| Users | Database | AI Provider | Infrastructure |
|-------|----------|-------------|---------------|
| 1-10 | Supabase Free | OpenRouter | Vercel Free |
| 10-100 | Supabase Pro | OpenRouter + caching | Vercel Pro |
| 100-1000 | Supabase Pro + Redis | Multi-provider + queue | Vercel Pro + Edge |
| 1000+ | Dedicated PostgreSQL | Custom AI infra | Multi-region |

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `Module not found` | Missing dependencies | `bun install` |
| `Prisma Client not generated` | Missing client | `bun run db:generate` |
| Port 3000 in use | Another process | `lsof -ti:3000 \| xargs kill` |
| AI responses fail (local) | Missing `ZAI_API_KEY` | Z AI Gateway auto-configured in sandbox |
| AI responses fail (Vercel) | Missing `OPENROUTER_API_KEY_1` | Set OpenRouter key in Vercel env vars |
| Supabase connection fails | Missing or wrong keys | Verify all 3 Supabase env vars are set |
| Database locked | SQLite concurrent writes | Restart dev server |
| Build fails | TypeScript errors | `bun run lint` to identify |

### Emergency Procedures
```bash
# Restart application
pm2 restart gangniaga

# Rollback deployment
vercel --prod --yes

# Database restore (SQLite)
cp backups/custom-20250101.db db/custom.db

# Redeploy from Vercel dashboard
# Vercel Dashboard → Deployments → ⋯ → Redeploy
```

---

*Last updated: March 2025 | Version: v0.3.0*
