import Link from 'next/link';
import {
  getSession,
  getUserDetails,
} from '@/app/supabase-server';
import Logo from '@/components/icons/Logo';

import s from './Navbar.module.css';

export default async function Navbar() {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails(),
  ]);

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto ">
        <div className="flex flex-row justify-between py-2 align-center md:py-4">
          <div className="flex flex-row items-center">
            <Link href="/">
              <Logo height="32" x="1" y="4" fill="white" stroke="zinc-700"/>
              </Link>
              <Link href="/">

              <p className='ml-2 font-bold'>Code Maestro</p>
              </Link>

          </div>

            {/* <nav className="hidden ml-6 space-x-2 lg:block">
              <Link href="/pricing" className={s.link}>
                Pricing
              </Link>
              {session && (
                <Link href="/account" className={s.link}>
                  Account
                </Link>
              )}
            </nav> */}
          <div className="flex justify-end flex-1 space-x-8">
            {userDetails && userDetails.avatar_url ? (
              <div className="relative inline-block text-left">
                <Link href="/account">
                  <button type="button" className="text-white focus:outline-none">
                    <img src={userDetails.avatar_url} alt="User Avatar" className="w-10 h-10 rounded-full" />
                  </button>
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
