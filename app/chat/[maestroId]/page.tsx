import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  createMaestro,
  deleteMaestro,
  getMaestros,
  getSession,
  getUserDetails,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import { chat } from '../../llm';
import GitHub from '@/components/icons/GitHub';
import Link from 'next/link';
import { ReactNode } from 'react';
import { DeleteConfirmationMaestroModal, GithubBadge } from '../Modal';
import AutoGrowingTextarea from '../AutoGrowingTextarea';
import Trash from '@/components/icons/Trash';

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
  const deleteMaestro = searchParams?.deleteMaestro;
  const maestroId = params.maestroId;
  const maestro = maestros.filter(m => m.id.toString() === maestroId).pop();
  if (!maestro) return <h2 className="text-center">Something went wrong!</h2>

  // const result = await chat("https://github.com/depombo/journal", "I have several flutter quill editors of different size within a list view. however, if the editor is too large when the keyboard is shown you can no longer see what is being typed, how do I fix it");
  // console.log(result);

  return (
    <div className='flex flex-row'>
      <div className='flex flex-col items-center p-4 bg-zinc-800 h-full'>
        {
          maestros.map(m => (
            m.id === maestro.id ?
              (
                <div key={m.id} className={m.id === maestro.id ? "w-full p-4 my-8 border rounded-md black" : "w-full p-4 my-8 border rounded-md border-zinc-700"}>
                  <div className="flex flex-row justify-between">
                    <div className="mb-1 text-l font-medium">{m.name}</div>
                    <Link href={`/chat/${maestroId}?deleteMaestro=true`}>
                      ✖
                    </Link>
                  </div>
                  <div className="flex">
                    <GithubBadge name={m.github_repo_name} />
                  </div>
                  {deleteMaestro && <DeleteConfirmationMaestroModal name={m.name} id={m.id} />}
                </div>
              )
              :
              (
                <Link href={`/chat/${m.id}`}>
                  <div className={m.id === maestro.id ? "w-full p-4 my-8 border rounded-md white" : "w-full p-4 my-8 border rounded-md border-zinc-700"}>
                    <div className="flex justify-between py-2 px-1">
                      <div className="mb-1 text-l font-medium">{m.name}</div>
                    </div>
                    <div className="flex">
                      <GithubBadge name={m.github_repo_name} />
                    </div>
                  </div>
                </Link>
              )
          ))
        }
        <Link href='/chat?createMaestro=true'>
          <Button
            variant="slim"
            type="submit"
          >
            New Maestro
          </Button>
        </Link>
      </div>

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

        <div className="flex items-start w-4/5">
          <div className="flex flex-col w-full p-4">
            <form id="nameForm">
              <AutoGrowingTextarea
              />
            </form>
          </div>
          <div className='flex py-4'>
            <Button
              className='h-8 w-2'
              variant="slim"
              type="submit"
            >
              ↑
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}