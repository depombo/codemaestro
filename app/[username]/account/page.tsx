
import {
  getSession,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Account from './Account';

type Props = {
  params: { username: string };
};


export default async function SettingsPage({ params }: Props) {
  const session = await getSession();
  if (!session) {
    return redirect('/signin');
  }

  return (
    <>
      <Navbar params={params} />
      <Account />
    </>
  );
}