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
        <div className="relative flex flex-row justify-between py-2 align-center md:py-4">
          <div className="flex items-center flex-1">
              <Link href="/" className={s.logo} aria-label="Logo">
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                {/* White Rectangle */}
                {/* Black SVG content */}
                <rect width="100%" height="100%" rx="15" ry="15" fill="white" />

                <Logo height="32" x="1" y="4" fill="black" stroke="zinc-700"/>
              </svg>
              </Link>

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
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {userDetails && userDetails.avatar_url ? (
              <div className="relative inline-block text-left">
                <Link href="/account">
                  <button type="button" className="text-white focus:outline-none">
                    <img src={userDetails.avatar_url} alt="User Avatar" className="w-12 h-12 rounded-full" />
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
