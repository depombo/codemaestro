import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  getServerClient,
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';

import { cookies } from "next/headers";

import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";


export default async function ChatPage() {
  const cookieStore = cookies();

  const supabase = await getServerClient(cookieStore);

  const [session, userDetails, subscription] = await Promise.all([
    getSession(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!session || !userDetails) {
    return redirect('/signin');
  }

  const loader = new GithubRepoLoader(
    "https://github.com/depombo/lfdepombo.com",
    {
      branch: "main",
      recursive: false,
      unknown: "warn",
      maxConcurrency: 5, // Defaults to 2
    }
  );
  const docs = [];
  for await (const doc of loader.loadAsStream()) {
    docs.push(doc);
  }

  // const vectorStore = await SupabaseVectorStore.fromDocuments(
  //   docs,
  //   new OpenAIEmbeddings(),
  //   {
  //     client: supabase,
  //     tableName: "documents",
  //     queryName: "match_documents",
  //   }
  // );

  return (
    <div className="flex flex-col items-center w-4/5 h-4/5 p-4">

      <div className="flex items-start">
        <div className="flex flex-col w-full p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white">
                <Logo className='p-2'/>
              </div>
              <span className="text-sm ml-3 font-semibold text-gray-200">Deno Backend Maestro</span>
            </div>
            <p className="text-sm font-normal ml-14 text-gray-200">That's awesome. I think our users will really appreciate the improvements.</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex flex-col w-full p-4">
            <div className="flex items-center">
              <img src={userDetails.avatar_url || ''} alt="User Avatar" className="w-10 h-10 rounded-full" />
              <span className="text-sm ml-3 font-semibold text-gray-200">You</span>
            </div>
            <p className="text-sm font-normal ml-14 text-gray-200">That's awesome. I think our users will really appreciate the improvements.</p>
        </div>
      </div>

    </div>
  );
}