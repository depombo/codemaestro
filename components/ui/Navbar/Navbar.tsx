import Link from 'next/link';
import {
  getUserDetails
} from '@/app/actions';
import { IconSeparator, Logo } from '@/components/icons';

import s from './Navbar.module.css';
import { ModelSelect } from './ModelSelect';
import TabbedButton from './TabbedButton';

export default async function Navbar() {
  const user = await getUserDetails();

  return (
    <nav className={s.root}>
      <div className="px-6 mx-auto py-4">
        <div className="flex flex-row justify-between align-center md:py-4">
          <div className="flex flex-row items-center">
            <Link href="/">
              <Logo height="24" x="1" y="4" fill="white" />
            </Link>
            {/* <Link href="/">
              <p className='ml-2 font-bold'>CodeMaestro</p>
            </Link> */}
            <IconSeparator className="mx-4 size-6" stroke="rgb(113 113 122)" />
            <Link href={`/${user?.username}`}>
              <img src={user?.avatar_url!} alt="User Avatar" className="w-6 h-6 mr-3 rounded-full" />
            </Link>
            <Link href={`/${user?.username}`}>
              {user?.username}
            </Link>
            <ModelSelect />
          </div>

          <div className="flex justify-end flex-1 space-x-8 items-center align-center">
            <TabbedButton />
            {/* <div className="ml-6 space-x-2 lg:block">
              {!session && (
                <Link href="/profile" className={s.link}>
                  Dashboard
                </Link>
              )}
              <Link href="/pricing" className={s.link}>
                Pricing
              </Link>
              {session && (
                <Link href="/settings" className={s.link}>
                  Settings
                </Link>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
