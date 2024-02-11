import Button from '@/components/ui/Button';
import {
  CodeMaestro,
  createMaestro,
  createAndJoinSource,
  deleteMaestro,
} from '@/app/actions';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const BaseModal = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed inset-0 bg-black/80 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="shadow-lg">
        <div className="p-4 bg-black">
          {children}
        </div>
      </div>
    </div>
  )
}

export const CreateCtxSrcModal = ({ maestro, redirectPath }: { maestro: CodeMaestro, redirectPath: string }) => (
  <BaseModal>
    <Card
      title="New Context Source URL"
      description="Enter the url for the new context source to use with this maestro"
      footer={
        <div className='flex flex-row justify-between'>
          <Link href={redirectPath}>
            <Button
              outline={true}
              variant="slim"
            >
              Cancel
            </Button>
          </Link>
          <Button
            variant="slim"
            type="submit"
            form="createSrc"
          >
            Create context source
          </Button>
        </div>
      }
    >
      <form id="createSrc" action={createAndJoinSource.bind(null, maestro, redirectPath)}>
        <div className="mt-8 mb-2 ml-2 text-l font-semibold">
          <label>GitHub repo or website URL</label>
        </div>
        <div className="mt-4 mb-4 text-l font-semibold">
          <input
            type="text"
            name="url"
            className="w-1/2 p-3 rounded-md bg-zinc-800"
            placeholder="https://github.com/denoland/deno_std"
          />
        </div>
      </form>
    </Card>
  </BaseModal>
)


export const NewMaestroModal = ({ username }: { username: string }) => (
  <BaseModal>
    <Card
      title="New Code Maestro"
      description="Enter a name and an initial context source to create a Code Maestro to chat with"
      footer={
        <div className='flex flex-row justify-between'>
          <Link href={`/${username}`}>
            <Button
              outline={true}
              variant="slim"
            >
              Cancel
            </Button>
          </Link>
          <Button
            variant="slim"
            type="submit"
            form="createMaestro"
          >
            Create Maestro
          </Button>
        </div>
      }
    >
      <form id="createMaestro" action={createMaestro.bind(null, username)}>
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
          <label>GitHub Repository or Website URL</label>
        </div>
        <div className="mt-4 mb-4 text-l font-semibold">
          <input
            type="text"
            name="url"
            className="w-1/2 p-3 rounded-md bg-zinc-800"
            placeholder="https://github.com/denoland/deno_std"
          />
        </div>
      </form>
    </Card>
  </BaseModal>
)

export const DeleteConfirmationMaestroModal = ({ maestro, cancelPath, delPath }: { maestro: CodeMaestro, cancelPath: string, delPath: string }) => (
  <BaseModal>
    <Card
      title={`Are you sure you want to delete ${maestro.name} Maestro?`}
      description="This cannot be undone."
      footer={
        <div className='flex flex-row justify-between'>
          <Link href={cancelPath}>
            <Button
              variant="slim"
              outline={true}
            >
              Cancel
            </Button>
          </Link>
          <form id="deleteMaestro" action={deleteMaestro.bind(null, maestro.id, delPath)}>
            <Button
              variant="slim"
              type="submit"
              form="deleteMaestro"
            >
              Delete
            </Button>
          </form>
        </div>
      }
    >
    </Card>
  </BaseModal>
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