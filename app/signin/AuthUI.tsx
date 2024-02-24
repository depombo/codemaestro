'use client';

import { getBrowserClient } from '@/app/lib/supabase/client';
import { GitHub } from '@/app/components/icons';
import Button from '@/app/components/ui/Button';
import { getURL } from '@/utils/helpers';

// https://supabase.com/docs/guides/auth/social-login/auth-github
export default async function AuthUI() {
  const supabase = getBrowserClient();
  const handleSignin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${getURL()}/auth/callback`
      }
    })
  }
  return (
    <Button
      variant="slim"
      onClick={handleSignin}
    >
      <GitHub className="mr-4 h-5" />
      Continue with Github
    </Button>
  );
}