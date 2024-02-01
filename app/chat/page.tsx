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

const GithubBadge = ({name}: {name: string}) => {
  return (
    <Link href={`https://github.com/${name}`} target="_blank" rel="noopener noreferrer">
      <span className="flex items-center space-x-2 my-4 px-3 py-2 text-white text-sm bg-zinc-800 rounded-full">
        <GitHub className="h-5" />
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

const CreateMaestroModal= () => (
  <div className="fixed inset-0 bg-black/80 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="shadow-lg">
        <div className="p-4 bg-black">
          <Card
            title="New Code Maestro"
            description="Enter the name and Github repositories to create a Code Maestro to chat with"
            footer={
              <div className='flex flex-row justify-between'>
                <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                  <Button
                    variant="slim"
                    type="submit"
                    form="createMaestro"
                  >
                    Create Maestro
                  </Button>
                </div>
                <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                  <Link href="/chat">
                    <Button
                      variant="slim"
                    >
                      Close
                    </Button>
                  </Link>
                </div>
              </div>
            }
          >
            <form id="createMaestro" action={createMaestro}>
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
      </div>
    </div>
)

const DeleteConfirmationMaestroModal = ({id, name}: {id: number, name: string}) => (
  <div className="fixed inset-0 bg-black/80 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="shadow-lg">
        <div className="p-4 bg-black">
          <Card
            title={`Are you sure you want to delete ${name} Maestro?`}
            description="This cannot be undone."
            footer={
              <div className='flex flex-row justify-between'>
                <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                  <form id="deleteMaestro" action={deleteMaestro}>
                    <input hidden={true} type="number" name="maestroId" value={id} />
                      <Button
                        variant="slim"
                        type="submit"
                        form="deleteMaestro"
                      >
                        Delete
                      </Button>
                  </form>
                </div>
                <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                  <Link href="/chat">
                    <Button
                      variant="slim"
                    >
                      Close
                    </Button>
                  </Link>
                </div>
              </div>
            }
          >
          </Card>
        </div>
      </div>
    </div>
)

type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined;
};

export default async function ChatPage({ searchParams }: SearchParamProps) {

  const userDetails = await getUserDetails();
  if (!userDetails) {
    return redirect('/signin');
  }

  const maestros = await getMaestros();

  const maestroId = searchParams?.maestroId;

  const maestro = maestroId ? maestros.filter(m => m.id.toString() === maestroId)[0] : undefined;
  const createMaestro = searchParams?.createMaestro;
  const deleteMaestro = searchParams?.deleteMaestro;

  // const result = await chat("https://github.com/depombo/journal", "I have several flutter quill editors of different size within a list view. however, if the editor is too large when the keyboard is shown you can no longer see what is being typed, how do I fix it");
  // console.log(result);

  return (
    <div className='flex flex-row'>
      <div className='flex flex-col items-center w-1/5 h-1/5 p-4'>
        {
          maestros.map(m => (
            <Link href={`/chat?maestroId=${m.id}`}>
              <div className={maestro && m.id === maestro?.id ? "w-full max-w-3xl m-auto my-8 border rounded-md white" : "w-full max-w-3xl m-auto my-8 border rounded-md border-zinc-700"}>
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
                    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                      {
                        maestro && m.id === maestro?.id &&
                          <Link href="/chat?deleteMaestro=true">
                            <Button
                              variant="slim"
                            >
                              Delete
                            </Button>
                          </Link>
                      }
                    </div>
                  </div>
                </div>
                {deleteMaestro && <DeleteConfirmationMaestroModal name={m.name} id={m.id} />}
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
    <div className="flex flex-col items-center w-4/5 h-4/5 p-4">

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

    </div>
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