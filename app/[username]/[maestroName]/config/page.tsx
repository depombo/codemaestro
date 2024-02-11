import Navbar from "@/components/ui/Navbar";
import { ModelSelect } from "./ModelSelect";


type Props = {
  params: { username: string };
};

export default async function ChatPage({ params }: Props) {
  return (
    <>
      <Navbar params={params} />
      <ModelSelect />
    </>
  );
}