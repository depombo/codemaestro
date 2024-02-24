import {
  getMessages,
  getUserDetails,
  getMaestro,
} from '@/app/lib/actions';
import { redirect } from 'next/navigation';
import Chat from './Chat';
import Navbar from '@/app/components/ui/Navbar';

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
      <Chat
        user={user}
        maestro={maestro}
        pastMessages={pastMessages}
      />
    </div>
  );
}