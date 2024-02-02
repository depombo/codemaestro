import Link from 'next/link';
import {
  getServerClient,
  getSession,
  getUserDetails,
} from '@/app/actions';
import Logo from '@/components/icons/Logo';

import s from './Navbar.module.css';

export default async function Navbar() {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails(),
  ]);

  return (
    <nav className={s.root}>
      <div className="max-w-6xl px-6 mx-auto py-4">
        <div className="flex flex-row justify-between align-center md:py-4">
          <div className="flex flex-row items-center">
            <Link href="/">
              <Logo height="32" x="1" y="4" fill="white" stroke="zinc-700" />
            </Link>
            <Link href="/">

              <p className='ml-2 font-bold'>CodeMaestro</p>
            </Link>

          </div>


          <div className="flex justify-end flex-1 space-x-8 items-center align-center">
            {session ? (
              <div className="ml-6 space-x-2 lg:block">
                <Link href="/chat" className={s.link}>
                  Chat
                </Link>
                {session && (
                  <Link href="/account" className={s.link}>
                    Account
                  </Link>
                )}
                <Link href="/pricing" className={s.link}>
                  Pricing
                </Link>
              </div>
            ) : (
              <Link href="/signin" className={s.link}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
