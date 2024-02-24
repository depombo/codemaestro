import Link from 'next/link';
import React from 'react';
import { NewMaestroModal, } from './Modal';
import { CodeMaestro, maestroNamePath } from '../lib/actions';
import Button from '@/app/components/ui/Button';
import { GitHub, } from '@/app/components/icons';
import { SearchParams } from '@/utils/helpers';

const SourceDisplay = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-row justify-start my-4 px-4 py-2 text-white text-sm rounded-full bg-zinc-800">
      <div className="flex-row space-x-2">
        {url.startsWith('https://github.com/') && <GitHub className="h-5 mr-2" />}
      </div>
      <p className='truncate'>{url.replace('https://', '')}</p>
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
      <div className={"flex flex-col cursor-pointer p-4 m-2 border rounded-md border-zinc-700 hover:border-zinc-400"}>
        <div className="mb-1 text-lg font-semibold">{maestro.name}</div>
        <div className="flex flex-col">
          {
            maestro.context_sources.map(s => <SourceDisplay key={s.id} url={s.url} />)
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
      <div className="flex justify-center col-span-2 py-10">
        <Link href={`/${username}?createMaestro=true`}>
          <Button
            variant="slim"
            type="submit"
          >
            New Maestro
          </Button>
        </Link>
      </div>
      {createMaestro && <NewMaestroModal username={username} />}
    </div>
  );
};

export default MaestroList;
