/**
 * GangNiaga AI OS — Database Client
 *
 * Supports both SQLite (local dev) and PostgreSQL (Vercel/production).
 * The database provider is determined by the DATABASE_URL format:
 *   - file:...        → SQLite (local development)
 *   - postgresql:...  → PostgreSQL (Vercel/production)
 *   - empty/missing   → No database (graceful degradation)
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
      : 'None';

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

// Only create PrismaClient if DATABASE_URL is set and non-empty
const dbUrl = process.env.DATABASE_URL || '';
const shouldCreateClient = dbUrl.length > 0 && dbUrl !== '""';

export const db = shouldCreateClient
  ? (globalForPrisma.prisma ?? createPrismaClient())
  : null as unknown as PrismaClient; // Null when no database configured

if (shouldCreateClient && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

/**
 * Check if the database is available and connected.
 * Use this before making database calls to gracefully handle
 * cases where no database is configured (e.g., first Vercel deploy).
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  if (!shouldCreateClient) return false;
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
