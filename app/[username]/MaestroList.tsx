import Link from 'next/link';
import React from 'react';
import { CreateMaestroModal, DeleteConfirmationMaestroModal } from './Modal';
import { CodeMaestro, User, maestroNamePath } from '../actions';
import Button from '@/components/ui/Button';
import { GitHub, Trash } from '@/components/icons';

const GithubBadge = ({ name, hyperlink }: { name: string, hyperlink: boolean }) => {
  const badge = (
    <span className="flex items-center space-x-2 my-4 px-3 py-2 text-white text-sm bg-zinc-800 rounded-full">
      <GitHub className="h-5" />
      <p>{name}</p>
      {/* <button
      className="text-gray-500 hover:text-red-500 focus:outline-none"
    >
      &#10005;
    </button> */}
    </span>
  );
  return (
    hyperlink ? <Link href={`https://github.com/${name}`} target="_blank" rel="noopener noreferrer">
      {badge}
    </Link>
      :
      badge
  )
};

interface MaestroCardProps {
  maestro: CodeMaestro;
  searchParams: Record<string, string> | null | undefined;
  username: string,
}

const MaestroCard = ({ maestro, searchParams, username }: MaestroCardProps) => {
  const deleteMaestro = searchParams?.deleteMaestro;
  const cleanPath = maestroNamePath(maestro.name);
  return (
    <div className={"flex flex-col p-4 m-2 border rounded-md border-zinc-700"}>
      <div className="flex flex-row justify-between">
        <div className="mb-1 text-l font-medium">{maestro.name}</div>
        <Link className='text-sm' href={`/${username}?deleteMaestro=${cleanPath}`}>
          <Trash className="h-4" fill="white" />
        </Link>
      </div>
      <div className="flex flex-col">
        {
          maestro.github_repo_names.map(n => <GithubBadge key={n} hyperlink={true} name={n} />)
        }
      </div>
      <Link href={`/${username}/${cleanPath}`}>
        <Button
          variant="slim"
          type="submit"
        >
          Chat
        </Button>
      </Link>
      {
        deleteMaestro === cleanPath &&
        <DeleteConfirmationMaestroModal
          redirectPath={`/${username}`}
          maestro={maestro}
        />
      }
    </div>
  );
};

interface MaestroListProps {
  maestros: CodeMaestro[];
  selectedMaestroId?: number;
  searchParams: Record<string, string> | null | undefined;
  className: string;
  user: User;
}

const MaestroList = ({ maestros, searchParams, user, className }: MaestroListProps) => {
  const createMaestro = searchParams?.createMaestro;
  return (
    <div className={className}>
      {
        maestros.map(m => (
          <MaestroCard
            key={m.id}
            username={user.username!}
            maestro={m}
            searchParams={searchParams}
          />
        ))
      }
      <Link href={`/${user.username}?createMaestro=true`}>
        <Button
          variant="slim"
          type="submit"
        >
          New Maestro
        </Button>
      </Link>
      {createMaestro && <CreateMaestroModal redirectPath={`/${user.username}`} />}
    </div>
  );
};

export default MaestroList;
