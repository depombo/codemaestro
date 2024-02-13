import Navbar from "@/components/ui/Navbar";
import { ModelSelect } from "./ModelSelect";
import { getMaestro, } from "@/app/actions";
import { SearchParams } from '@/utils/helpers';
import { DeleteConfirmationMaestroModal, CreateCtxSrcModal } from "../../Modal";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { GitHub } from "@/components/icons";

type ConfigProps = {
  params: { username: string, maestroName: string };
  searchParams: SearchParams
};

export default async function ConfigPage({ searchParams, params }: ConfigProps) {
  const { username, maestroName } = params;
  const maestro = await getMaestro(params.maestroName);
  const deleteMaestro = !!searchParams?.deleteMaestro;
  const createSource = !!searchParams?.createSource;
  return (
    <div className="mb-32">
      <Navbar params={params} />
      <div className="p-5">
        <Card
          title="CodeMaestro Configuration"
          description={'Select AI Model'}
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">Delete this CodeMaestro.</p>
              <Link href={`/${username}/${maestroName}/config?deleteMaestro=true`}>
                <Button
                  variant="slim"
                  type="submit"
                >
                  Delete CodeMaestro
                </Button>
              </Link>
            </div>
          }
        >
          <ModelSelect maestro={maestro} />
        </Card>
      </div>

      <div className="px-4 mx-auto px-8">
        <h1 className="text-2xl font-bold text-white text-center">
          Context Sources
        </h1>
      </div>
      {
        createSource &&
        <CreateCtxSrcModal
          redirectPath={`/${username}/${maestroName}/config`}
          maestro={maestro}
        />
      }
      <div className="grid p-8 md:gap-6 md:grid-cols-2">
        {
          maestro.context_sources.map(s => <Card
            title={<Link className="hover:text-zinc-300" href={s.url}>{s.url.replace("https://", "")}</Link>}
            logo={
              <div className="flex flex-row space-x-4">
                {/* TODO display lock instead of GH logo */}
                {/* {s.user_id !== null ? <GitHub /> : null} */}
                {s.url.startsWith("https://github.com") ? <GitHub /> : null}
              </div>
            }
            footer={
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <p className="pb-4 sm:pb-0">Delete this context source.</p>
                {/* TODO Delete context source */}
                <Link href={`/${username}/${maestroName}/config?deleteMaestro=true`}>
                  <Button
                    variant="slim"
                    type="submit"
                  >
                    Delete Context
                  </Button>
                </Link>
              </div>
            }
          >
            {/* TODO humanize */}
            <p>{s.last_updated_at}</p>
          </Card>)
        }
      </div>
      <div className="w-full m-auto pb-14 flex justify-center">
        <Link href={`/${username}/${maestroName}/config?createSource=true`}>
          <Button
            variant="slim"
            type="submit"
          >
            New Context Source
          </Button>
        </Link>
      </div>

      {
        deleteMaestro &&
        <DeleteConfirmationMaestroModal
          cancelPath={`/${username}/${maestroName}/config`}
          delPath={`/${username}`}
          maestro={maestro}
        />
      }
    </div>
  );
}