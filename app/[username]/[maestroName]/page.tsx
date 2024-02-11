import {
  getMessages,
  getUserDetails,
  getMaestro,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import UserInput from './UserInput';
import ChatHistory from './ChatHistory';
import Navbar from '@/components/ui/Navbar';

type ChatPageProps = {
  params: { maestroName: string, username: string };
};

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getUserDetails();
  if (!user) {
    return redirect('/signin');
  }
  const maestro = await getMaestro(params.maestroName);
  const pastMessages = await getMessages(maestro.id);

  return (
    <>
      <Navbar params={params} />
      <ChatHistory
        className="flex-col pt-4 pb-32 px-8 sm:px-20"
        user={user}
        maestro={maestro}
        pastMessages={pastMessages}
      />
      <UserInput
        className="fixed w-full bottom-0 h-28 p-4 bg-black border-t border-zinc-700"
        maestro={maestro}
        pastMessages={pastMessages}
      />
    </>
  );
}