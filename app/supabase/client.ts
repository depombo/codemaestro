'use client';

import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';

export async function getBrowserClient(): Promise<SupabaseClient<Database>> {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
