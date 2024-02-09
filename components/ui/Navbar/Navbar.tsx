import Link from 'next/link';
import {
  getUserDetails
} from '@/app/actions';
import { IconSeparator, Logo } from '@/components/icons';

import s from './Navbar.module.css';
import { ModelSelect } from './ModelSelect';
import TabbedButton from './TabbedButton';

export default async function Navbar({
  params,
}: {
  params?: { username?: string, maestroName?: string },
},
) {
  const user = await getUserDetails();
  const isChat = !!params && !!params.maestroName;

  return (
    <nav className={"sticky top-0 bg-black z-40 transition-all duration-150 h-16 md:h-20 border-b border-zinc-700"}>
      <div className="p-2 mx-auto">
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
            {isChat && <><IconSeparator className="mx-4 size-6" stroke="rgb(113 113 122)" /> {params.maestroName} </>}
            {isChat && <ModelSelect />}
          </div>

          <div className="flex justify-end flex-1 space-x-8 px-8 items-center align-center">
            {isChat && <TabbedButton />}
            {!user && <Link className={s.link} href="/signin">
              Dashboard
            </Link>}
            {user && !isChat && <Link href="/settings" className={s.link}>
              Settings
            </Link>
            }
            {
              !isChat && <Link href="/pricing" className={s.link}>
                Pricing
              </Link>
            }

          </div>
        </div>
      </div>
    </nav>
  );
}
