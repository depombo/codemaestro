import {
  getMaestros,
  createMaestro,
  deleteMaestro,
} from '@/app/supabase-server';
import Button from '@/components/ui/Button';
import { ReactNode } from 'react';
import Link from 'next/link';

import Logo from '@/components/icons/Logo';
import Github from '@/components/icons/GitHub';
import DeleteMaestroButton from './DeleteMaestroButton';

export default async function UserDashboard() {

  const maestros = await getMaestros();

  const GithubBadge = ({name}: {name: string}) => {
    return (
      <Link href={`https://github.com/${name}`} target="_blank" rel="noopener noreferrer">
        <span className="flex items-center space-x-2 my-4 px-3 py-2 text-white text-sm bg-zinc-800 rounded-full">
          <Github className="h-5" />
          <p>{name}</p>
          {/* <button
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            &#10005;
          </button> */}
        </span>
      </Link>
    )
  };

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Code Maestros
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Chat with Code Maestros with knowledge of specific codebases
          </p>
        </div>
      </div>

      {
        maestros.map(m => (
          <div className="p-4">
            <Card
              title={m.name}
              footer={
                <div className='flex flex-row justify-between'>
                  <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                    <Link href='/chat'>
                      <Button
                        variant="slim"
                        type="submit"
                      >
                        Chat with Maestro
                      </Button>
                    </Link>
                  </div>
                    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                        <DeleteMaestroButton id={m.id} />
                    </div>
                </div>
              }
            >
              <div className="flex">
                <GithubBadge name={m.github_repo_name} />
              </div>
            </Card>
          </div>
        ))
      }

      <div className="p-4">
        <Card
          title="New Code Maestro"
          description="Enter the name and contextual Github repositories to create a Code Maestro to chat with"
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <Button
                variant="slim"
                type="submit"
                form="maestroForm"
              >
                Create Maestro
              </Button>
            </div>
          }
        >
          <form id="maestroForm" action={createMaestro}>
            <div className="mt-6 mb-2 ml-2 text-l font-semibold">
              <label>Maestro Name</label>
            </div>
            <div className="mt-4 mb-4 text-l font-semibold">
              <input
                type="text"
                name="name"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                placeholder="Deno Backend"
                maxLength={64}
              />
            </div>
            <div className="mt-8 mb-2 ml-2 text-l font-semibold">
              <label>Github Repository Name</label>
            </div>
            <div className="mt-4 mb-4 text-l font-semibold">
                {/* TODO add validation that repo is valid */}
                <input
                  type="text"
                  name="repo"
                  className="w-1/2 p-3 rounded-md bg-zinc-800"
                  placeholder="denoland/deno_std"
                />
                {/* TODO multiple repo support */}
                {/* <Button
                  className="mx-8"
                  variant="slim"
                  width={1}
                  disabled={false}
                >
                  +
                </Button> */}
            </div>
          </form>
        </Card>
      </div>
    </section>
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
          <div>
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
