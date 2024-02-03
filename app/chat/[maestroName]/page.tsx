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

  // const result = await chat("https://github.com/depombo/journal", "I have several flutter quill editors of different size within a list view. however, if the editor is too large when the keyboard is shown you can no longer see what is being typed, how do I fix it");
  // console.log(result);

  return (
    <div className='flex flex-row'>
      <Sidebar
        selectedMaestroId={maestro.id}
        maestros={maestros}
        searchParams={searchParams}
      />

      <div className="flex flex-col grow items-center p-4">

        <ChatHistory
          user={user}
          maestro={maestro}
          pastMessages={pastMessages}
        />

        <form id="messageMaestro" action={messageMaestro.bind(null, maestro, pastMessages)} className="flex items-start w-4/5">
          <div className="flex flex-col w-full p-4">
            <AutoGrowingTextarea
              name="message"
            />
          </div>
          <div className="flex py-4">
            <Button
              className="h-8 w-2"
              variant="slim"
              form="messageMaestro"
              type="submit"
            >
              ↑
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}