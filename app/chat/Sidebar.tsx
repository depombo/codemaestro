import Link from 'next/link';
import React from 'react';
import { CreateMaestroModal, DeleteConfirmationMaestroModal } from './Modal';
import { CodeMaestro } from '../actions';
import Button from '@/components/ui/Button';
import GitHub from '@/components/icons/GitHub';

const GithubBadge = ({ name, hyperlink }: { name: string, hyperlink: boolean }) => {
  const badge = (
    <span className="flex items-center space-x-2 my-4 px-3 py-2 text-white text-sm bg-zinc-900 rounded-full">
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
  const cleanPath = maestro.name.replace(/[^a-z0-9]+/gi, "");
  const card = (
    <div className={selected ? "w-full p-4 my-8 border rounded-md black" : "w-full p-4 my-8 border rounded-md border-zinc-700"}>
      <div className="flex flex-row justify-between">
        <div className="mb-1 text-l font-medium">{maestro.name}</div>
        {
          selected && <Link href={`/chat/${cleanPath}?deleteMaestro=true`}>
            ✖
          </Link>
        }
      </div>
      <div className="flex">
        <GithubBadge hyperlink={selected} name={maestro.github_repo_name} />
      </div>
      {deleteMaestro && <DeleteConfirmationMaestroModal maestro={maestro} />}
    </div>
  );
  return !selected ? <Link href={`/chat/${cleanPath}`}>{card}</Link> : card;
};

interface SidebarProps {
  maestros: CodeMaestro[];
  selectedMaestroId?: number;
  searchParams: Record<string, string> | null | undefined;
}

const Sidebar = ({ maestros, selectedMaestroId, searchParams }: SidebarProps) => {
  const createMaestro = searchParams?.createMaestro;
  return (
    <div className='flex flex-col items-center p-4 bg-zinc-800 h-full'>
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
