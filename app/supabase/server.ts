'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers';

// https://supabase.com/docs/guides/auth/server-side/creating-a-client?environment=api-route#creating-a-client
// https://github.com/vercel/next.js/tree/canary/examples/with-supabase/utils/supabase

// works for server action and router handlers
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function getServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  );
}