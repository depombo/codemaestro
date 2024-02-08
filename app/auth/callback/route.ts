import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { getServerClient } from '@/app/supabase/server';
import { getSession, updateGithubTokens } from '@/app/actions';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await getServerClient();
    await supabase.auth.exchangeCodeForSession(code)
  }

  // https://warchantua.hashnode.dev/supabase-and-github-app-authentication-done-right
  // https://github.com/supabase/gotrue-js/issues/131#issuecomment-1566224009
  // save auth token & refresh token for a current user.
  const session = await getSession();
  // uncomment when they fix it
  // https://github.com/orgs/community/discussions/24745
  // if (!session || !session.provider_token || !session.provider_refresh_token) {
  //   throw new Error("session, provider_token or provider_refresh_token are missing")
  // }
  await updateGithubTokens(session!.user.id, session!.provider_token || null, session!.provider_refresh_token || null);

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}