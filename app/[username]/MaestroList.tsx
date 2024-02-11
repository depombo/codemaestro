import Link from 'next/link';
import React from 'react';
import { CreateMaestroModal, } from './Modal';
import { CodeMaestro, maestroNamePath } from '../actions';
import Button from '@/components/ui/Button';
import { GitHub, } from '@/components/icons';
import { SearchParams } from '@/utils/helpers';

const GithubBadge = ({ url, hyperlink }: { url: string, hyperlink: boolean }) => {
  const badge = (
    <span className="flex items-center space-x-2 my-4 px-3 py-2 text-white text-sm bg-zinc-800 rounded-full">
      {
        url.startsWith('https://github.com/') ?
          <>
            <GitHub className="h-5" />
            <p>{url.split('https://github.com/')[1]}</p>
          </>
          :
          <p>{url}</p>
      }

      {/* <button
      className="text-gray-500 hover:text-red-500 focus:outline-none"
    >
      &#10005;
    </button> */}
    </span>
  );
  return (
    hyperlink ? <Link href={url} target="_blank" rel="noopener noreferrer">
      {badge}
    </Link>
      :
      badge
  )
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
            maestro.context_sources.map(s => <GithubBadge key={s.id} hyperlink={false} url={s.url} />)
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
      {createMaestro && <CreateMaestroModal redirectPath={`/${username}`} />}
    </div>
  );
};

export default MaestroList;
