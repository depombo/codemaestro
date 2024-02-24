
import {
  getMaestros,
  getUserDetails,
} from '@/app/lib/actions';
import { redirect } from 'next/navigation';
import MaestroList from './MaestroList';
import Navbar from '@/app/components/ui/Navbar';
import { SearchParams } from '@/utils/helpers';

type Props = {
  searchParams: SearchParams;
  params: { username: string };
};

export default async function ChatPage({ params, searchParams }: Props) {
  const maestros = await getMaestros();

  return (
    <>
      <Navbar params={params} />
      <MaestroList
        params={params}
        className='grid space-4 p-4 grid-cols-2'
        maestros={maestros!}
        searchParams={searchParams}
      />
    </>
  );
}