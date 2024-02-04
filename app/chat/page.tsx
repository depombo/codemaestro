
import {
  getMaestros,
  getUserDetails,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';

type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined;
};

export default async function ChatPage({ searchParams }: SearchParamProps) {
  const userDetails = await getUserDetails();
  if (!userDetails) {
    return redirect('/signin');
  }
  const maestros = await getMaestros();

  return (
    <Sidebar
      className='grid col-span-1'
      maestros={maestros}
      searchParams={searchParams}
    />
  );
}