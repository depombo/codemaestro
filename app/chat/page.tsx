import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import Logo from '@/components/icons/Logo';



export default async function ChatPage() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  if (!session || !userDetails) {
    return redirect('/signin');
  }

  const supabase = createClientComponentClient<Database>();
  const messages: any[] = [
    {
      role: 'user',
      content: `
      You're an AI assistant who answers questions about documents.

      You're a chat bot, so keep your replies succinct.

      You're only allowed to use the documents below to answer the question.

      If the question isn't related to these documents, say:
      "Sorry, I couldn't find any information on that."

      If the information isn't available in the below documents, say:
      "Sorry, I couldn't find any information on that."

      Do not go off topic.

      Documents:
    `,
    },
  ]
  const isLoading = false;

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