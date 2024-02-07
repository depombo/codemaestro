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
  params: { maestroName: string };
};

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getUserDetails();
  if (!user) {
    return redirect('/signin');
  }
  const maestroName = params.maestroName;
  if (!maestroName) {
    return redirect('/profile');
  }
  const maestros = await getMaestros();
  const maestro = maestros.filter(m => maestroNamePath(m.name) === maestroName).pop();
  if (!maestro) return <h2 className="text-center">Something went wrong!</h2>

  const pastMessages = await getMessages(maestro.id);

  return (
    <div className="flex flex-col">
      <ChatHistory
        className="flex-1 p-4"
        user={user}
        maestro={maestro}
        pastMessages={pastMessages}
      />

      <UserInput
        className="w-full sticky bottom-0 p-4 bg-black border-t border-zinc-700"
        maestro={maestro}
        pastMessages={pastMessages}
      />

    </div>
  );
}