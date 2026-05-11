/**
 * GangNiaga AI OS — Database Client
 *
 * Supports both SQLite (local dev) and PostgreSQL (Vercel/production).
 * The database provider is determined by the DATABASE_URL format:
 *   - file:...        → SQLite (local development)
 *   - postgresql:...  → PostgreSQL (Vercel/production)
 *
 * In development, the PrismaClient instance is cached on globalThis
 * to survive hot-module reloads without creating connection leaks.
 * In production, a new client is created per cold start.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || '';

  // Detect database type for logging
  const dbType = dbUrl.startsWith('file:')
    ? 'SQLite'
    : dbUrl.startsWith('postgresql:')
      ? 'PostgreSQL'
      : 'Unknown';

  // Configure logging based on environment
  const isDev = process.env.NODE_ENV !== 'production';

  const client = new PrismaClient({
    log: isDev
      ? ['query', 'error', 'warn']
      : ['error'],
  });

  if (isDev) {
    console.log(`[DB] Connected to ${dbType} database`);
  }

  return client;
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
