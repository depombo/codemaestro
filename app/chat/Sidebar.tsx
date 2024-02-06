import Link from 'next/link';
import React from 'react';
import { CreateMaestroModal, DeleteConfirmationMaestroModal } from './Modal';
import { CodeMaestro, maestroNamePath } from '../actions';
import Button from '@/components/ui/Button';
import GitHub from '@/components/icons/GitHub';
import Trash from '@/components/icons/Trash';

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
  selected: boolean;
  searchParams: Record<string, string> | null | undefined;
}

const MaestroCard = ({ maestro, selected, searchParams }: MaestroCardProps) => {
  const deleteMaestro = searchParams?.deleteMaestro;
  const cleanPath = maestroNamePath(maestro.name);
  const card = (
    <div className={selected ? "flex flex-col p-4 m-2 border border-zinc-700 rounded-md bg-zinc-700" : "flex flex-col p-4 m-2 border rounded-md border-zinc-700"}>
      <div className="flex flex-row justify-between">
        <div className="mb-1 text-l font-medium">{maestro.name}</div>
        {
          selected && <Link className='text-sm' href={`/chat/${cleanPath}?deleteMaestro=true`}>
            <Trash className="h-4" fill="white" />
          </Link>
        }
      </div>
      <div className="flex flex-col">
        {
          maestro.github_repo_names.map(n => <GithubBadge key={n} hyperlink={selected} name={n} />)
        }
      </div>
      {deleteMaestro && selected && <DeleteConfirmationMaestroModal maestro={maestro} />}
    </div>
  );
  return !selected ? <Link href={`/chat/${cleanPath}`}>{card}</Link> : card;
};

interface SidebarProps {
  maestros: CodeMaestro[];
  selectedMaestroId?: number;
  searchParams: Record<string, string> | null | undefined;
  className: string;
}

const Sidebar = ({ maestros, selectedMaestroId, searchParams, className }: SidebarProps) => {
  const createMaestro = searchParams?.createMaestro;
  return (
    <div className={className}>
      {
        maestros.map(m => (
          <MaestroCard
            key={m.id}
            selected={m.id === selectedMaestroId}
            maestro={m}
            searchParams={searchParams}
          />
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
  );
};

export default Sidebar;
