
import {
  getMaestros,
  getUserDetails,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import MaestroList from './MaestroList';

type Props = {
  searchParams: Record<string, string> | null | undefined;
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
    <MaestroList
      className='grid col-span-1'
      maestros={maestros!}
      searchParams={searchParams}
    />
  );
}