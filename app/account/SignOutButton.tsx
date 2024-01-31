'use client';

import { getBrowserClient } from '@/app/supabase-client';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default async function SignOutButton() {
  const router = useRouter();
  const supabase = await getBrowserClient();
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }
  return (
    <Button
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  );
}
