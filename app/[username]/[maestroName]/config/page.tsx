import Navbar from "@/components/ui/Navbar";
import { ModelSelect } from "./ModelSelect";
import { getMaestro, } from "@/app/actions";
import { SearchParams } from '@/utils/helpers';
import { DeleteConfirmationMaestroModal } from "../../Modal";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Props = {
  params: { username: string, maestroName: string };
  searchParams: SearchParams
};

export default async function ChatPage({ searchParams, params }: Props) {
  const { username, maestroName } = params;
  const maestro = await getMaestro(params.maestroName);
  const deleteMaestro = !!searchParams?.deleteMaestro;
  return (
    <>
      <Navbar params={params} />
      <ModelSelect maestro={maestro} />
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
          redirectPath={`/${username}`}
          maestro={maestro}
        />
      }
    </>
  );
}