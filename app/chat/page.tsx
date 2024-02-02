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
import { chat } from '../llm';
import GitHub from '@/components/icons/GitHub';
import Link from 'next/link';
import { ReactNode } from 'react';
import { CreateMaestroModal, GithubBadge } from './Modal';

type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined;
};

export default async function ChatPage({ searchParams }: SearchParamProps) {

  const userDetails = await getUserDetails();
  if (!userDetails) {
    return redirect('/signin');
  }

  const maestros = await getMaestros();

  const createMaestro = searchParams?.createMaestro;

  // const result = await chat("https://github.com/depombo/journal", "I have several flutter quill editors of different size within a list view. however, if the editor is too large when the keyboard is shown you can no longer see what is being typed, how do I fix it");
  // console.log(result);

  return (
    <div className='flex flex-row'>
      <div className='flex flex-col items-center w-1/5 h-1/5 p-4'>
        {
          maestros.map(m => (
            <Link key={m.id} href={`/chat/${m.id}`}>
              <div className="w-full max-w-3xl m-auto my-8 border rounded-md border-zinc-700">
                <div className="px-4 py-4">
                  <div className="flex justify-between py-2 px-1">
                    <div className='pr-10'>
                      <h3 className="mb-1 text-2xl font-medium">{m.name}</h3>
                      {/* <p className="text-zinc-300">{description}</p> */}
                    </div>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <div className="flex">
                      <GithubBadge name={m.github_repo_name} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

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

        {createMaestro && <CreateMaestroModal />}

      </div>
    {/* <div className="flex flex-col items-center w-4/5 h-4/5 p-4">

      <div className="flex items-start">
        <div className="flex flex-col w-full p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white">
                <Logo className='p-2'/>
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

    </div> */}
    </div>
  );
}

interface Props {
  title?: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-4 py-4">
        <div className="flex justify-between py-2 px-1">
          <div className='pr-10'>
            <h3 className="mb-1 text-2xl font-medium">{title}</h3>
            <p className="text-zinc-300">{description}</p>
          </div>
          <Logo fill='white' stroke='zinc-700'/>
        </div>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}