
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

  // const result = await chat("https://github.com/depombo/journal", "I have several flutter quill editors of different size within a list view. however, if the editor is too large when the keyboard is shown you can no longer see what is being typed, how do I fix it");
  // console.log(result);

  return (
    <div className='flex flex-row grow'>
      <Sidebar
        maestros={maestros}
        searchParams={searchParams}
      />
    </div>
  );
}