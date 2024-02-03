'use server'

import { Database } from '@/types_db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { RedirectType, redirect } from 'next/navigation';
import { chat } from './llm';
import { getServerClient } from './supabase/server';

// server actions that can be used in client or server react components
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
// https://www.youtube.com/watch?v=dDpZfOQBMaU

// TODO zod data validation

export type Message = Database['public']['Tables']['messages']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type CodeMaestro = Database['public']['Tables']['code_maestros']['Row'];
// TODO mappers once it makes sense or add into CodeMaestro type
export const maestroNamePath = (name: string) => name.replace(/[^a-z0-9]+/gi, "");

export const getMessages = async (maestroId: number) => {
  const supabase = await getServerClient();
  const { error, data } = await supabase
    .from('messages')
    .select('*')
    .eq('maestro_id', maestroId);
  if (error) {
    console.error(error);
  }
  return data || [];
};

export const messageMaestro = async (maestro: CodeMaestro, pastMessages: Message[], formData: FormData) => {
  const message = formData.get('message') as string;
  const supabase = await getServerClient();
  // save user message
  const { error } = await supabase
    .from('messages')
    .insert({ maestro_id: maestro.id, message: message, user_id: maestro.user_id })
  if (error) {
    console.error(error);
  }
  revalidatePath(`/chat/${maestroNamePath(maestro.name)}`);

  const modelName = "gpt-3.5-turbo";
  const outputStream = await chat(message, maestro, pastMessages, modelName);
  const aiMessageFields = { maestro_id: maestro.id, user_id: maestro.user_id, model_name: modelName };
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
  revalidatePath(`/chat/${maestroNamePath(maestro.name)}`);
};

export const updateName = async (formData: FormData) => {
  const supabase = await getServerClient();

  const newName = formData.get('name') as string;
  const session = await getSession();
  if (!session) redirect('/signin')
  const user = session.user;
  const { error } = await supabase
    .from('users')
    .update({ full_name: newName })
    .eq('id', user?.id);
  if (error) {
    console.error(error);
  }
  redirect('/account', RedirectType.push);
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

export const getMaestros = async () => {
  const session = await getSession();
  if (!session) redirect('/signin')
  const user = session.user;
  const supabase = await getServerClient();
  const { error, data } = await supabase
    .from('code_maestros')
    .select('*')
    .eq('user_id', user?.id as string);
  if (error) {
    console.error(error);
  }
  return data || [];
};

export const deleteMaestro = async (id: number) => {
  const supabase = await getServerClient();
  const { error } = await supabase
    .from('code_maestros')
    .delete()
    .match({ id: id });
  if (error) {
    console.error(error);
  }
  redirect('/chat', RedirectType.push);
}

export const createMaestro = async (formData: FormData) => {
  const session = await getSession();
  // console.log(formData);
  const name = formData.get('name') as string;
  const repo = formData.get('repo') as string;
  if (!session) redirect('/signin')
  const user = session.user;
  const supabase = await getServerClient();
  const { error } = await supabase
    .from('code_maestros')
    .insert({ user_id: user?.id as string, name: name, github_repo_name: repo })
  if (error) {
    console.error(error);
  }
  // TODO send to chat specific to this maestro
  redirect(`/chat`, RedirectType.push);
};


export async function getSession() {
  try {
    const supabase = await getServerClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
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
    console.error(error.message);
  }
  return data ?? [];
};
