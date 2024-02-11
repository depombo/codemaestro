import {
  getMessages,
  getUserDetails,
  getMaestro,
} from '@/app/actions';
import { redirect } from 'next/navigation';
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
    <div className="flex flex-col justify-between h-screen">
      <Navbar params={params} />
      <ChatHistory
        user={user}
        maestro={maestro}
        pastMessages={pastMessages}
      />
    </div>
  );
}