import Link from 'next/link';
import React from 'react';
import { CreateMaestroModal, DeleteConfirmationMaestroModal, GithubBadge } from './Modal';
import { CodeMaestro } from '../actions';
import Button from '@/components/ui/Button';

interface MaestroCardProps {
  maestro: CodeMaestro;
  selected: boolean;
  searchParams: Record<string, string> | null | undefined;
}

const MaestroCard = ({ maestro, selected, searchParams }: MaestroCardProps) => {
  const deleteMaestro = searchParams?.deleteMaestro;
  const card = (
    <div key={maestro.id} className={selected ? "w-full p-4 my-8 border rounded-md black" : "w-full p-4 my-8 border rounded-md border-zinc-700"}>
      <div className="flex flex-row justify-between">
        <div className="mb-1 text-l font-medium">{maestro.name}</div>
        {
          selected && <Link href={`/chat/${maestro.id}?deleteMaestro=true`}>
            ✖
          </Link>
        }
      </div>
      <div className="flex">
        <GithubBadge name={maestro.github_repo_name} />
      </div>
      {deleteMaestro && <DeleteConfirmationMaestroModal maestro={maestro} />}
    </div>
  );
  return !selected ? <Link href={`/chat/${maestro.id}`}>{card}</Link> : card;
};

interface SidebarProps {
  maestros: CodeMaestro[];
  selectedMaestroId?: string;
  searchParams: Record<string, string> | null | undefined;
}

const Sidebar = ({ maestros, selectedMaestroId, searchParams }: SidebarProps) => {
  const createMaestro = searchParams?.createMaestro;
  return (
    <div className='flex flex-col items-center p-4 bg-zinc-800 h-full'>
      {
        maestros.map(m => (
          <MaestroCard
            selected={m.id.toString() === selectedMaestroId}
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
