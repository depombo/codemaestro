import Navbar from "@/components/ui/Navbar";
import { ModelSelect } from "./ModelSelect";
import { getMaestro } from "@/app/actions";


type Props = {
  params: { username: string, maestroName: string };
};

export default async function ChatPage({ params }: Props) {
  const maestro = await getMaestro(params.maestroName);
  return (
    <>
      <Navbar params={params} />
      <ModelSelect maestro={maestro} />
    </>
  );
}