
import {
  getMaestros,
  getUserDetails,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import MaestroList from './MaestroList';

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
    <MaestroList
      className='grid col-span-1'
      maestros={maestros}
      searchParams={searchParams}
    />
  );
}