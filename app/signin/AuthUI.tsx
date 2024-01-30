'use client';

import { getBrowserClient } from '@/app/supabase-server';
import { getURL } from '@/utils/helpers';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default async function AuthUI() {
  const supabase = await getBrowserClient();
  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={['github']}
        providerScopes={{github: 'read:user'}}
        redirectTo={`${getURL()}/auth/callback`}
        onlyThirdPartyProviders={true}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#52525b'
              }
            }
          }
        }}
        theme="dark"
      />
    </div>
  );
}
