
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
    <div className='flex flex-row grow'>
      <Sidebar
        maestros={maestros}
        searchParams={searchParams}
      />
    </div>
  );
}