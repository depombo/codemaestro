import Navbar from "@/components/ui/Navbar";
import { ModelSelect } from "./ModelSelect";
import { getMaestro, } from "@/app/actions";
import { SearchParams } from '@/utils/helpers';
import { DeleteConfirmationMaestroModal, CreateCtxSrcModal } from "../../Modal";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { GithubBadge } from "../../MaestroList";

type Props = {
  params: { username: string, maestroName: string };
  searchParams: SearchParams
};

export default async function ChatPage({ searchParams, params }: Props) {
  const { username, maestroName } = params;
  const maestro = await getMaestro(params.maestroName);
  const deleteMaestro = !!searchParams?.deleteMaestro;
  const createSource = !!searchParams?.createSource;
  return (
    <>
      <Navbar params={params} />
      <ModelSelect maestro={maestro} />
      <Link href={`/${username}/${maestroName}/config?createSource=true`}>
        <Button
          variant="slim"
          type="submit"
        >
          New Context Source
        </Button>
      </Link>
      {
        createSource &&
        <CreateCtxSrcModal
          redirectPath={`/${username}/${maestroName}/config`}
          maestro={maestro}
        />
      }
      <div className="flex flex-col">
        {
          maestro.context_sources.map(s => <GithubBadge summary={false} key={s.id} url={s.url} />)
        }
      </div>
      <Link href={`/${username}/${maestroName}/config?deleteMaestro=true`}>
        <Button
          variant="slim"
          type="submit"
        >
          Delete
        </Button>
      </Link>
      {
        deleteMaestro &&
        <DeleteConfirmationMaestroModal
          cancelPath={`/${username}/${maestroName}/config`}
          delPath={`/${username}`}
          maestro={maestro}
        />
      }
    </>
  );
}