import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import Logo from '@/components/icons/Logo';


export default function ChatPage() {
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
    <div className="max-w-6xl flex flex-col items-center w-full h-full ">
      <div className="flex items-start">
        <div className="flex flex-col w-full p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                {/* White Rectangle */}
                {/* Black SVG content */}
                <rect width="100%" height="100%" rx="15" ry="15" fill="white" />

                <Logo height="24" width="24" x="5" y="4" fill="black" stroke="zinc-700"/>
              </svg>
              <span className="text-sm ml-3 font-semibold text-gray-200">Deno Backend Maestro</span>
            </div>
            <p className="text-sm font-normal ml-10 py-3 text-gray-200">That's awesome. I think our users will really appreciate the improvements.</p>
        </div>
      </div>

    </div>
  );
}