import {
  getMaestros,
  getMessages,
  getUserDetails,
  maestroNamePath,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import UserInput from './UserInput';
import ChatHistory from './ChatHistory';

type ChatPageProps = {
  searchParams: Record<string, string> | null | undefined;
  params: { maestroName: string };
};

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
  const user = await getUserDetails();
  if (!user) {
    return redirect('/signin');
  }
  const maestroName = params.maestroName;
  if (!maestroName) {
    return redirect('/profile');
  }
  const maestros = await getMaestros();
  const maestro = maestros?.filter(m => maestroNamePath(m.name) === maestroName).pop();
  if (!maestro) return <h2 className="text-center">Something went wrong!</h2>

  const pastMessages = await getMessages(maestro.id);

  return (
    <>
      <ChatHistory
        className="flex-col pt-4 pb-32 px-8 sm:px-20"
        user={user}
        maestro={maestro}
        pastMessages={pastMessages}
        searchParams={searchParams}
      />
      <UserInput
        className="fixed w-full bottom-0 h-28 p-4 bg-black border-t border-zinc-700"
        maestro={maestro}
        pastMessages={pastMessages}
      />
    </>
  );
}