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

  // Graceful error handling for connection issues
  client.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (error: unknown) {
      // Log database errors with context
      const message = error instanceof Error ? error.message : String(error);

      if (
        message.includes('P1001') ||
        message.includes('Can\'t reach database')
      ) {
        console.error(
          `[DB] Cannot reach database server. ` +
          `Type: ${dbType}, URL prefix: ${dbUrl.substring(0, 20)}...`
        );
      } else if (
        message.includes('P1002') ||
        message.includes('Timed out')
      ) {
        console.error(
          `[DB] Database connection timed out. ` +
          `Type: ${dbType}, URL prefix: ${dbUrl.substring(0, 20)}...`
        );
      } else if (
        message.includes('P2002') ||
        message.includes('Unique constraint')
      ) {
        // Unique constraint violations are expected in upsert patterns — just re-throw
        throw error;
      } else if (
        message.includes('P2025') ||
        message.includes('Record not found')
      ) {
        // Record not found is a normal flow — just re-throw
        throw error;
      } else {
        console.error(`[DB] Prisma error in ${params.model}.${params.action}:`, message);
      }

      throw error;
    }
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
