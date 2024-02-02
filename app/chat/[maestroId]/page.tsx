import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  getMaestros,
  messageMaestro,
  getUserDetails,
} from '@/app/actions';
import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import AutoGrowingTextarea from '../AutoGrowingTextarea';
import Sidebar from '../Sidebar';

type ChatPageProps = {
  params: { maestroId: string };
  searchParams: Record<string, string> | null | undefined;
};

export default async function ChatPage({ params, searchParams }: ChatPageProps) {

  const userDetails = await getUserDetails();
  if (!userDetails) {
    return redirect('/signin');
  }

  const maestros = await getMaestros();
  const maestroId = params.maestroId;
  const maestro = maestros.filter(m => m.id.toString() === maestroId).pop();
  if (!maestro) return <h2 className="text-center">Something went wrong!</h2>

  // const result = await chat("https://github.com/depombo/journal", "I have several flutter quill editors of different size within a list view. however, if the editor is too large when the keyboard is shown you can no longer see what is being typed, how do I fix it");
  // console.log(result);

  return (
    <div className='flex flex-row'>
      <Sidebar
        selectedMaestroId={maestroId}
        maestros={maestros}
        searchParams={searchParams}
      />

      <div className="flex flex-col grow items-center p-4">

        <div className='flex flex-col h-full'>
          <div className="flex items-start">
            <div className="flex flex-col w-full p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white">
                  <Logo className='p-2' />
                </div>
                <span className="text-sm ml-3 font-semibold text-gray-200">{maestro?.name}</span>
              </div>
              <p className="text-sm font-normal ml-14 text-gray-200">That's awesome. I think our users will really appreciate the improvements.</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex flex-col w-full p-4">
              <div className="flex items-center">
                <img src={userDetails.avatar_url || ''} alt="User Avatar" className="w-10 h-10 rounded-full" />
                <span className="text-sm ml-3 font-semibold text-gray-200">{userDetails.full_name}</span>
              </div>
              <p className="text-sm font-normal ml-14 text-gray-200">That's awesome. I think our users will really appreciate the improvements.</p>
            </div>
          </div>

        </div>

        <form id="messageMaestro" action={messageMaestro} className="flex items-start w-4/5">
          <div className="flex flex-col w-full p-4">
            <AutoGrowingTextarea
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