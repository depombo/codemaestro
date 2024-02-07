import Button from "@/components/ui/Button";
import Link from "next/link";

export default async function Homepage() {
  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Code Maestros
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Chat with an AI that understands your code
          </p>
          <div className="max-w-2xl m-auto mt-10 items-center">
            <Link href="/profile"><Button variant="slim">Get started</Button></Link>
          </div>

        </div>
      </div>
    </section>
  );
}
