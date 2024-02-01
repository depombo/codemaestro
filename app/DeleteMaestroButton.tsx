'use client';

import { getBrowserClient } from '@/app/supabase-client';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Props {
  id: number;
}

export default async function DeleteMaestroButton({id}: Props) {
  const router = useRouter();
  const supabase = await getBrowserClient();
  const handleMaestroDelete = async () => {
    const { error } = await supabase
      .from('code_maestros')
      .delete()
      .match({ id: id });
    if (error) {
      console.log(error);
    }
    router.refresh()
  }
  return (
    <Button
      variant="slim"
      onClick={handleMaestroDelete}
    >
      Delete Maestro
    </Button>
  );
}
