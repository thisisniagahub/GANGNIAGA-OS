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

### Option 1: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel --prod
```

#### Vercel Configuration
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `bun install`
- **Environment Variables**: Set all required env vars in Vercel dashboard

#### `vercel.json` (if needed)
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "bun install",
  "regions": ["sin1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "ZAI_API_KEY": "@zai-api-key"
  }
}
```

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

*Last updated: January 2025 | Version: v0.2.0*
