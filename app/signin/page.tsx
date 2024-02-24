import { getSession, getUserDetails } from '@/lib/actions';
import AuthUI from './AuthUI';

import { redirect } from 'next/navigation';
import { Logo } from '@/components/icons';
import Navbar from '@/components/ui/Navbar';

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    const user = await getUserDetails();
    return redirect(`/${user?.username}`);
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between p-3 m-auto">
          <div className="flex justify-center pb-20">
            <div className="rounded-full bg-white">
              <Logo className='p-4' width="80px" height="80px" />
            </div>
          </div>
          <Logo className='p-2' />
          <AuthUI />
        </div>
      </div>
    </>
  );
}
