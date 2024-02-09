
import {
  getMaestros,
  getUserDetails,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import MaestroList from './MaestroList';
import Navbar from '@/components/ui/Navbar';
import { SearchParams } from '@/utils/helpers';

type Props = {
  searchParams: SearchParams;
  params: { username: string };
};

export default async function ChatPage({ params, searchParams }: Props) {
  // TODO get user from actual param
  const userDetails = await getUserDetails();
  if (!userDetails) {
    return redirect('/signin');
  }
  const maestros = await getMaestros();

  return (
    <>
      <Navbar params={params} />
      <MaestroList
        user={userDetails}
        className='grid col-span-1'
        maestros={maestros!}
        searchParams={searchParams}
      />
    </>
  );
}