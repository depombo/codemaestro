import Button from '@/components/ui/Button';
import {
  CodeMaestro,
  createMaestro,
  deleteMaestro,
} from '@/app/actions';
import Logo from '@/components/icons/Logo';
import Link from 'next/link';
import { ReactNode } from 'react';

export const CreateMaestroModal = () => (
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

export const DeleteConfirmationMaestroModal = ({ maestro }: { maestro: CodeMaestro }) => (
  <div className="fixed inset-0 bg-black/80 overflow-y-auto h-full w-full flex items-center justify-center">
    <div className="shadow-lg">
      <div className="p-4 bg-black">
        <Card
          title={`Are you sure you want to delete ${maestro.name} Maestro?`}
          description="This cannot be undone."
          footer={
            <div className='flex flex-row justify-between'>
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <form id="deleteMaestro" action={deleteMaestro.bind(null, maestro.id)}>
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
                <Link href={`/chat/${maestro.id}`}>
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
          <Logo fill='white' stroke='zinc-700' />
        </div>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}