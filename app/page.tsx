import {
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import Logo from '@/components/icons/Logo';

export default async function UserDashboard() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  }

  const updateName = async (formData: FormData) => {
    'use server';

    const newName = formData.get('name') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    const { error } = await supabase
      .from('users')
      .update({ full_name: newName })
      .eq('id', user?.id);
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Code Maestros
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Chat with Code Maestros with knowledge of specific codebases
          </p>
        </div>
      </div>

      <div className="p-4">
        <Card
          title="Default Code Maestro"
          description="Code Maestro without any context"
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <Button
                variant="slim"
                type="submit"
                form="nameForm"
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Chat with Maestro
              </Button>
            </div>
          }
        >
        </Card>
      </div>

      <div className="p-4">
        <Card
          title="New Code Maestro"
          description="Enter a name for the new Code Maestro and a Github repo to start chatting with it"
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <Button
                variant="slim"
                type="submit"
                form="nameForm"
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Create Maestro
              </Button>
            </div>
          }
        >
          <form id="nameForm" action={updateName}>
            <div className="mt-8 mb-4 text-xl font-semibold">
              <input
                title="Maestro Name"
                type="text"
                name="name"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                placeholder="Name"
                maxLength={64}
              />
            </div>
            <div className="mt-8 mb-4 text-xl font-semibold">
              {/* TODO create labels */}
                <input
                title="Maestro Context"
                  type="text"
                  name="name"
                  className="w-1/2 p-3 rounded-md bg-zinc-800"
                  placeholder="Github repository URL"
                  maxLength={64}
                />
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}

interface Props {
  title?: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <div className="flex justify-between py-2 px-1">
          <div>
            <h3 className="mb-1 text-2xl font-medium">{title}</h3>
            <p className="text-zinc-300">{description}</p>
          </div>
          <Logo fill='white' stroke='zinc-700'/>
        </div>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}
