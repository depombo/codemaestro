import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { getServerClient } from '@/app/supabase/server';
import { getSession, getUserDetails, } from '@/app/actions';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await getServerClient();
    await supabase.auth.exchangeCodeForSession(code)

    // https://warchantua.hashnode.dev/supabase-and-github-app-authentication-done-right
    // https://github.com/supabase/gotrue-js/issues/131#issuecomment-1566224009
    // save auth token & refresh token for a current user.
    const session = await getSession();
    // uncomment when they fix it
    // https://github.com/orgs/community/discussions/24745
    // if (!session || !session.provider_token || !session.provider_refresh_token) {
    //   throw new Error("session, provider_token or provider_refresh_token are missing")
    // }
    const user = await getUserDetails();
    const { error } = await supabase
      .from("users")
      .update({
        github_provider_token: session!.provider_token,
        github_provider_refresh_token: session!.provider_refresh_token,
        // set username from github if not set in user
        // TODO these should all live in the supabase auth user creation trigger
        // so username can be non nullable, but whatever
        username: user?.username || session?.user.user_metadata.preferred_username,
      })
      .eq("id", user?.id!)
    console.error(error);
    // TODO ensure this is unique
    // if (error) throw error;
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}