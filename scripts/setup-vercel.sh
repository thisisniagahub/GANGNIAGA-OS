#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# GangNiaga AI OS — Vercel Database Setup Script
#
# This script sets up the PostgreSQL database on Vercel by running
# Prisma migrations and seeding the database with initial data.
#
# Usage:
#   bash scripts/setup-vercel.sh
#
# Prerequisites:
#   - DATABASE_URL must be set to a PostgreSQL connection string
#   - Prisma schema provider must be set to "postgresql"
# ──────────────────────────────────────────────────────────────────

set -euo pipefail

echo "🚀 GangNiaga AI OS — Vercel Database Setup"
echo "=========================================="

# ─── Validate Environment ──────────────────────────────────────

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo "   Set it to your PostgreSQL connection string, e.g.:"
  echo '   export DATABASE_URL="postgresql://user:password@host/database?sslmode=require"'
  exit 1
fi

if [[ "$DATABASE_URL" == file:* ]]; then
  echo "⚠️  WARNING: DATABASE_URL appears to be a SQLite URL (starts with file:)"
  echo "   Vercel requires a PostgreSQL database."
  echo "   Please update DATABASE_URL to a PostgreSQL connection string."
  echo ""
  echo "   Options:"
  echo "   - Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres"
  echo "   - Neon:            https://neon.tech"
  echo "   - Supabase:        https://supabase.com"
  exit 1
fi

echo "✅ DATABASE_URL is set (PostgreSQL detected)"
echo ""

# ─── Step 1: Generate Prisma Client ───────────────────────────

echo "📦 Step 1/3: Generating Prisma client..."
if npx prisma generate; then
  echo "✅ Prisma client generated"
else
  echo "❌ Failed to generate Prisma client"
  exit 1
fi
echo ""

# ─── Step 2: Run Migrations ───────────────────────────────────

echo "🗄️  Step 2/3: Running database migrations..."
if npx prisma migrate deploy; then
  echo "✅ Database migrations applied"
else
  echo "❌ Failed to run migrations"
  echo ""
  echo "   Troubleshooting:"
  echo "   - Check that DATABASE_URL is correct"
  echo "   - Ensure the database is accessible from your environment"
  echo "   - Run 'npx prisma migrate status' for details"
  exit 1
fi
echo ""

# ─── Step 3: Seed Database ────────────────────────────────────

echo "🌱 Step 3/3: Seeding database with initial data..."
if bunx tsx prisma/seed.ts; then
  echo "✅ Database seeded successfully"
else
  echo "❌ Failed to seed database"
  echo ""
  echo "   You can retry seeding manually with:"
  echo "   bun run db:seed"
  exit 1
fi
echo ""

# ─── Success ──────────────────────────────────────────────────

echo "=========================================="
echo "🎉 Vercel database setup completed!"
echo ""
echo "   Next steps:"
echo "   1. Verify your deployment at your Vercel URL"
echo "   2. Set NEXTAUTH_SECRET and other env vars in Vercel dashboard"
echo "   3. Test the application endpoints"
echo "=========================================="
