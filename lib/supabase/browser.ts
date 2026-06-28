import { createClient } from '@supabase/supabase-js';

let client: ReturnType<typeof createClient> | null = null;

/**
 * Anon-key browser client. Only has permissions granted by RLS policies.
 */
export function getBrowserClient() {
  if (client) return client;
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const key = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  client = createClient(url, key);
  return client;
}
