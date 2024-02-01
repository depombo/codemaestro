'use server'

import { Database } from '@/types_db';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getServerClient(): Promise<SupabaseClient<Database>> {
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

export const getMaestros = async () => {
  const session = await getSession();
  const user = session?.user;

  const supabase = await getServerClient();
  const { error, data } = await supabase
    .from('code_maestros')
    .select('*')
    .eq('user_id', user?.id as string);
  if (error) {
    console.log(error);
  }
  return data || [];
};


export const createMaestro = async (formData: FormData) => {
  const session = await getSession();
  // console.log(formData);
  const name = formData.get('name') as string;
  const repo = formData.get('repo') as string;
  const user = session?.user;

  const supabase = await getServerClient();
  const { error } = await supabase
    .from('code_maestros')
    .insert({ user_id: user?.id as string, name: name, github_repo_name: repo })
  if (error) {
    console.log(error);
  }
};


export async function getSession() {
  try {
    const supabase = await getServerClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (!session) {
      return redirect('/signin');
    }
    return session;
  } catch (error) {
    console.error('Error:', error);
    return redirect('/signin');
  }
}

export async function getUserDetails() {
  try {
    const supabase = await getServerClient();
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getSubscription() {
  try {
    const supabase = await getServerClient();
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle()
      .throwOnError();
    return subscription;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};
