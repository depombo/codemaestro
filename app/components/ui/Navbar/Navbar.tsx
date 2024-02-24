import Link from 'next/link';
import {
  getUserDetails
} from '@/app/lib/actions';
import { IconSeparator, Logo } from '@/app/components/icons';

import s from './Navbar.module.css';
import TabbedButton from '../TabbedButton';

export default async function Navbar({
  params,
}: {
  params?: { username?: string, maestroName?: string },
},
) {
  const user = await getUserDetails();
  const { maestroName, username } = params || {};
  const isProfile = !!username;
  const isChat = !!maestroName;

  return (
    <nav className={"bg-black z-40 border-b border-zinc-700"}>
      <div className="py-2 px-4 md:px-8">
        <div className="flex flex-row justify-between align-center md:py-4">
          <div className="flex flex-row items-center">
            <Link href="/">
              <Logo height="24" x="1" y="4" fill="white" />
            </Link>

            {
              user ? (
                <>
                  <IconSeparator className="mx-4 size-6" stroke="rgb(113 113 122)" />
                  <Link href={`/${user.username}`}>
                    <img src={user.avatar_url!} alt="User Avatar" className="w-6 h-6 mr-3 rounded-full" />
                  </Link>
                  <Link href={`/${user.username}`}>
                    {user.username}
                  </Link>
                </>
              )
                :
                <Link href="/">
                  <p className='ml-2 font-bold'>CodeMaestro</p>
                </Link>
            }
            {isChat && <><IconSeparator className="mx-4 size-6" stroke="rgb(113 113 122)" /> {maestroName} </>}
          </div>

          <div className="flex justify-end flex-1 space-x-8 px-8 items-center align-center">
            {isChat && <TabbedButton aLabel="Chat" aPath={`/${username}/${maestroName}`} bPath={`/${username}/${maestroName}/config`} bLabel="Config" />}
            {!user && <>
              <Link className={s.link} href="/signin">
                Dashboard
              </Link>
              <Link href="/pricing" className={s.link}>
                Pricing
              </Link>
            </>
            }
            {
              isProfile && !isChat && <TabbedButton aLabel="CodeMaestros" aPath={`/${username}`} bPath={`/${username}/account`} bLabel="Account" />
            }
          </div>
        </div>
      </div>
    </nav>
  );
}
