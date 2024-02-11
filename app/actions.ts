'use server'

import { Database } from '@/types_db';
import { revalidatePath } from 'next/cache';
import { RedirectType, redirect } from 'next/navigation';
import { chat, isSrcPrivate } from './llm';
import { getServerClient } from './supabase/server';
import { Session } from '@supabase/supabase-js';

// server actions that can be used in client or server react components
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
// https://www.youtube.com/watch?v=dDpZfOQBMaU

// TODO zod data validation

export type Message = Database['public']['Tables']['messages']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
type ContextSource = Database['public']['Tables']['context_sources']['Row'];
export type CodeMaestro = Database['public']['Tables']['code_maestros']['Row'] & { 'context_sources': ContextSource[] };
export type ModelName = Database['public']['Enums']['model_name'];
// TODO remove and sanitize at creation
export const maestroNamePath = (name: string) => name.replace(/[^a-z0-9]+/gi, "");

export const getMessages = async (maestroId: number) => {
  const supabase = await getServerClient();
  const { error, data } = await supabase
    .from('messages')
    .select('*')
    .order('created_at')
    .eq('maestro_id', maestroId);
  if (error) {
    console.error(error);
  }
  return data || [];
};

export const messageMaestro = async (maestro: CodeMaestro, pastMessages: Message[], newMessage: string) => {
  const { id: maestro_id, user_id, model_name } = maestro;
  const supabase = await getServerClient();
  // save user message
  const { error } = await supabase
    .from('messages')
    .insert({ maestro_id, message: newMessage, user_id })
  if (error) {
    console.error(error);
  }

  const outputStream = await chat(newMessage, maestro, pastMessages, model_name);
  const aiMessageFields = { maestro_id, user_id, model_name };
  // save ai messages
  let output = ''
  const { data, error: aiMessageError } = await supabase
    .from('messages')
    .insert({ message: output, ...aiMessageFields })
    .select('id')
  const aiMessageId = data?.[0]?.id;
  if (!aiMessageId) return console.error('insert of initial ai message failed')
  if (aiMessageError) console.error(aiMessageError);
  for await (const chunk of outputStream) {
    output += chunk;
    const { error: aiMessageError } = await supabase
      .from('messages')
      .update({ message: output, ...aiMessageFields })
      .eq('id', data?.[0]?.id)
    if (aiMessageError) {
      console.error(aiMessageError);
    }
  }
};

export const updateName = async (formData: FormData) => {
  const supabase = await getServerClient();
  const newName = formData.get('name') as string;
  const session = await getSession();
  if (!session) redirect('/signin')
  const user = session.user;
  const { error } = await supabase
    .from("users")
    .update({ full_name: newName })
    .eq("id", user?.id);
  if (error) {
    console.error(error);
  }
  redirect('/account', RedirectType.push);
};

export const updateUsername = async (formData: FormData) => {
  const supabase = await getServerClient();
  const newUsername = formData.get('name') as string;
  const session = await getSession();
  if (!session) redirect('/signin')
  const { error } = await supabase
    .from("users")
    .update({
      username: newUsername,
    })
    .eq("id", session.user.id);
  if (error) {
    console.error(error);
  }
};

export const updateGithubTokens = async (accessToken: string | null, refreshToken: string | null) => {
  const supabase = await getServerClient();
  const session = await getSession();
  if (!session) redirect('/signin')
  const { error } = await supabase
    .from("users")
    .update({
      github_provider_token: accessToken,
      github_provider_refresh_token: refreshToken,
    })
    .eq("id", session.user.id);
  if (error) {
    console.error(error);
  }
};

export const updateEmail = async (formData: FormData) => {
  const supabase = await getServerClient();
  const session = await getSession();
  if (!session) redirect('/signin')
  const newEmail = formData.get('email') as string;
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) {
    console.error(error);
  }
  revalidatePath('/account');
};

export const getMaestros = async (): Promise<CodeMaestro[] | null> => {
  const session = await getSession();
  if (!session) redirect('/signin')
  const user = session.user;
  const supabase = await getServerClient();
  const { error, data } = await supabase
    .from('code_maestros')
    .select('*, context_sources(*)')
    .eq('user_id', user?.id);
  if (error) {
    console.error(error);
  }
  return data as CodeMaestro[];
};

export const getMaestro = async (name: string): Promise<CodeMaestro> => {
  const maestros = await getMaestros();
  const maestro = maestros?.filter(m => maestroNamePath(m.name) === name).pop();
  if (!maestro) throw Error(`Maestro with name ${name} does not exist`);
  return maestro;
}

export const updateMaestroModel = async (maestro: CodeMaestro, newModelName: ModelName) => {
  const supabase = await getServerClient();
  const { error } = await supabase
    .from("code_maestros")
    .update({ model_name: newModelName })
    .eq("id", maestro.id);
  if (error) {
    console.error(error);
  }
}

export const deleteMaestro = async (id: number, redirectPath: string) => {
  const supabase = await getServerClient();
  const { error } = await supabase
    .from('code_maestros')
    .delete()
    .match({ id: id });
  if (error) {
    console.error(error);
  }
  redirect(redirectPath, RedirectType.push);
}

const createAndJoinSource = async (url: string, maestro: CodeMaestro) => {
  const session = await getSession();
  if (!session) redirect('/signin')
  const user = session.user;
  const src = {
    user_id: await isSrcPrivate(url) ? user?.id : null,
    url,
  }
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('context_sources')
    .insert(src)
    .select()
    .single();
  if (error) console.error(error);
  let source = data;
  if (error?.code === '23505' || !data) {
    const { data, error } = await supabase
      .from('context_sources')
      .select()
      .eq("url", url)
      .single();
    if (error) console.error(error);
    source = data;
  }
  const { error: errorJ } = await supabase
    .from('maestro_context')
    .insert({
      source_id: source!.id,
      maestro_id: maestro.id,
    });
  if (errorJ) console.error(error);
};


export const createMaestro = async (username: string, formData: FormData) => {
  const session = await getSession();
  const name = formData.get('name') as string;
  if (!session) redirect('/signin')
  const user = session.user;
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('code_maestros')
    .insert({ user_id: user?.id as string, name: name })
    .select()
    .single();
  if (error) console.error(error);
  const url = formData.get('url') as string;
  await createAndJoinSource(url, { ...data!, context_sources: [] });
  redirect(`/${username}/${maestroNamePath(name)}`, RedirectType.push);
};

// TODO error handling and solidify type
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await getServerClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();
    // if (!session) redirect('/signin');
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUserDetails(): Promise<User | null> {
  try {
    const supabase = await getServerClient();
    const session = await getSession();
    if (!session) redirect('/signin')
    const { data } = await supabase
      .from('users')
      .select('*')
      .match({ id: session.user.id })
      .single();
    return data;
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
    console.error(error.message);
  }
  return data ?? [];
};
