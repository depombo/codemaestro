import Link from 'next/link';
import React from 'react';
import { NewMaestroModal, } from './Modal';
import { CodeMaestro, maestroNamePath } from '../actions';
import Button from '@/components/ui/Button';
import { GitHub, } from '@/components/icons';
import { SearchParams } from '@/utils/helpers';

export const GithubBadge = ({ url, summary }: { url: string, summary: boolean }) => {
  const text = (
    !summary ? <Link className="hover:text-zinc-300" href={url} target="_blank" rel="noopener noreferrer">
      {url}
    </Link>
      :
      url
  )
  return (
    <div className="flex flex-row justify-between my-4 px-4 py-2 text-white text-sm bg-zinc-800 rounded-full">
      <div className="flex flex-row space-x-2">
        {url.startsWith('https://github.com/') && <GitHub className="h-5" />}
        {text}
      </div>
      {!summary && <button
        className="text-white hover:text-red-500 focus:outline-none"
      >
        &#10005;
      </button>}
    </div>
  );

};

interface MaestroCardProps {
  maestro: CodeMaestro;
  path: string
}

const MaestroCard = ({ maestro, path }: MaestroCardProps) => {
  return (
    <Link href={`${path}`}>
      <div className={"flex flex-col p-4 m-2 border rounded-md border-zinc-700"}>
        <div className="mb-1 text-l font-medium">{maestro.name}</div>
        <div className="flex flex-col">
          {
            maestro.context_sources.map(s => <GithubBadge key={s.id} summary={true} url={s.url} />)
          }
        </div>
        <div className="flex flex-row justify-between">
        </div>
      </div>
    </Link>
  );
};

interface MaestroListProps {
  maestros: CodeMaestro[];
  searchParams: SearchParams;
  className: string;
  params: { username: string };
}

const MaestroList = ({ maestros, params, searchParams, className }: MaestroListProps) => {
  const { username } = params;
  const createMaestro = searchParams?.createMaestro;
  return (
    <div className={className}>
      {
        maestros.map(m => (
          <MaestroCard
            key={m.id}
            maestro={m}
            path={`/${username}/${maestroNamePath(m.name)}`}
          />
        ))
      }
      <Link href={`/${username}?createMaestro=true`}>
        <Button
          variant="slim"
          type="submit"
        >
          New Maestro
        </Button>
      </Link>
      {createMaestro && <NewMaestroModal username={username} />}
    </div>
  );
};

export default MaestroList;
