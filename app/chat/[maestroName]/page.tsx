import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  getMaestros,
  messageMaestro,
  getMessages,
  getUserDetails,
  maestroNamePath,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import AutoGrowingTextarea from '../AutoGrowingTextarea';
import Sidebar from '../Sidebar';

const MaestroMessage = ({ name, message }: { name: string, message: string }) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col w-full p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white">
            <Logo className='p-2' />
          </div>
          <span className="text-sm ml-3 font-semibold text-gray-200">{name}</span>
        </div>
        <p className="text-sm font-normal ml-14 text-gray-200">{message}</p>
      </div>
    </div>
  )
};

const UserMessage = ({ name, message, avatarUrl }: { name: string, message: string, avatarUrl: string }) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col w-full p-4">
        <div className="flex items-center">
          <img src={avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <span className="text-sm ml-3 font-semibold text-gray-200">{name}</span>
        </div>
        <p className="text-sm font-normal ml-14 text-gray-200">{message}</p>
      </div>
    </div>
  )
};

type ChatPageProps = {
  params: { maestroName: string };
  searchParams: Record<string, string> | null | undefined;
};

export default async function ChatPage({ params, searchParams }: ChatPageProps) {

  const userDetails = await getUserDetails();
  if (!userDetails) {
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

        <div className='flex flex-col h-full'>
          {
            pastMessages.map(m => (
              m.model_name ?
                <MaestroMessage
                  key={m.id}
                  name={maestro.name}
                  message={m.message}
                />
                :
                <UserMessage
                  key={m.id}
                  name={userDetails.full_name || "You"}
                  avatarUrl={userDetails.avatar_url || ""}
                  message={m.message}
                />
            ))
          }
        </div>

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