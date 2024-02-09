
import {
  getSession,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Settings from './Settings';


export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    return redirect('/signin');
  }

  return (
    <>
      <Navbar />
      <Settings />
    </>
  );
}