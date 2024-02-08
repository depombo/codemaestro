import Link from 'next/link';
import {
  getSession,
} from '@/app/actions';
import { Logo } from '@/components/icons';

import s from './Navbar.module.css';

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className={s.root}>
      <div className="px-6 mx-auto py-4">
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
            <div className="ml-6 space-x-2 lg:block">
              <Link href="/profile" className={s.link}>
                {session ? "Profile" : 'Dashboard'}
              </Link>
              <Link href="/pricing" className={s.link}>
                Pricing
              </Link>
              {session && (
                <Link href="/settings" className={s.link}>
                  Settings
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
