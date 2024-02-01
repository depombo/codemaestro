import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  getSession,
  getUserDetails,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import { chat } from '../llm';

export default async function ChatPage() {
  const userDetails = await getUserDetails();
  if (!userDetails) {
    return redirect('/signin');
  }

  // const result = await chat("https://github.com/depombo/journal", "I have several flutter quill editors of different size within a list view. however, if the editor is too large when the keyboard is shown you can no longer see what is being typed, how do I fix it");
  // console.log(result);

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