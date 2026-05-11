/**
 * GangNiaga AI OS — Supabase Client
 *
 * Provides a Supabase client for database operations via REST API.
 * Works both locally and on Vercel (no direct PostgreSQL connection needed).
 *
 * Environment Variables:
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for server-side operations
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Anon key for client-side operations
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Server-side client with service role key (bypasses RLS)
let _supabaseServer: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (!_supabaseServer && supabaseUrl && supabaseServiceKey) {
    _supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    });
  }
  if (!_supabaseServer) {
    throw new Error(
      'Supabase client not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }
  return _supabaseServer;
}

// Client-side client with anon key (respects RLS)
let _supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_supabaseClient && supabaseUrl && supabaseAnonKey) {
    _supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    });
  }
  if (!_supabaseClient) {
    throw new Error(
      'Supabase client not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }
  return _supabaseClient;
}

/**
 * Check if Supabase is configured and available.
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && (supabaseServiceKey || supabaseAnonKey));
}

/**
 * Check if the Supabase database is reachable.
 */
export async function isSupabaseAvailable(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getSupabaseServer();
    const { error } = await client.from('organizations').select('id').limit(1);
    return !error || error.code !== '42P01'; // 42P01 = relation does not exist
  } catch {
    return false;
  }
}
