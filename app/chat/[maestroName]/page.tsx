import Button from '@/components/ui/Button';
import {
  getMaestros,
  messageMaestro,
  getMessages,
  getUserDetails,
  maestroNamePath,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import AutoGrowingTextarea from '../AutoGrowingTextarea';
import Sidebar from '../Sidebar';
import ChatHistory from '../ChatHistory';

type ChatPageProps = {
  params: { maestroName: string };
  searchParams: Record<string, string> | null | undefined;
};

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
  const user = await getUserDetails();
  if (!user) {
    return redirect('/signin');
  }

  const maestros = await getMaestros();
  const maestroName = params.maestroName;
  const maestro = maestros.filter(m => maestroNamePath(m.name) === maestroName).pop();
  if (!maestro) return <h2 className="text-center">Something went wrong!</h2>

  const pastMessages = await getMessages(maestro.id);

  return (
    <div className="grid grid-cols-6 gap-4 max-h-screen">
      <Sidebar
        className="grid col-span-1 overflow-auto border-r border-zinc-700"
        selectedMaestroId={maestro.id}
        maestros={maestros}
        searchParams={searchParams}
      />

      <div className="grid col-span-5 items-center">

        <ChatHistory
          className="max-h-96 overflow-auto"
          user={user}
          maestro={maestro}
          pastMessages={pastMessages}
        />

        <form
          id="messageMaestro"
          action={messageMaestro.bind(null, maestro, pastMessages)}
          className="items-start w-4/5"
        >
          <AutoGrowingTextarea
            name="message"
          />
          <Button
            className="h-8 w-2"
            variant="slim"
            form="messageMaestro"
            type="submit"
          >
            ↑
          </Button>
        </form>

      </div>
    </div>
  );
}