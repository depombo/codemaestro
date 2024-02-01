import ManageStripeButton from './ManageStripeButton';
import SignOutButton from './SignOutButton';
import {
  getServerClient,
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import Button from '@/components/ui/Button';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import Stripe from '@/components/icons/Stripe';
import GitHub from '@/components/icons/GitHub';

export default async function Account() {

  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  const user = session?.user;
  const ghUser = session.user.user_metadata.user_name;

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const updateName = async (formData: FormData) => {
    'use server';
    const supabase = await getServerClient();

    const newName = formData.get('name') as string;
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
    const supabase = await getServerClient();

    const newEmail = formData.get('email') as string;
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
            Account
          </h1>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Authentication"
          logo={<GitHub fill='white' height='50' width='50'/>}
          description={'Manage the connection between CodeMaestro and GitHub'}
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">Manage permissions on CodeMaestro's GitHub App Page</p>
              <Link href="https://github.com/apps/codemaestro-sh" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="slim"
                >
                  Manage on GitHub ↗
                </Button>
              </Link>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold hover:text-zinc-400">
            <Link href={"https://github.com/" + ghUser} target="_blank" rel="noopener noreferrer">@{ghUser}</Link>
          </div>
        </Card>
        <Card
          title="Plan"
          logo={<Stripe fill='white'/>}
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : 'You are not currently subscribed to any plan.'
          }
          footer={<ManageStripeButton session={session} />}
        >
          <div className="mt-8 mb-4 text-xl font-semibold hover:text-zinc-400">
            {subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/pricing">Choose your plan</Link>
            )}
          </div>
        </Card>
        <Card
          title="Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">64 characters maximum</p>
              <Button
                variant="slim"
                type="submit"
                form="nameForm"
                disabled={true}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Update Name
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="nameForm" action={updateName}>
              <input
                type="text"
                name="name"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                defaultValue={userDetails?.full_name ?? ''}
                placeholder="Your name"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
        <Card
          title="Email"
          description="Please enter the email address you want to use to login."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                We will email you to verify the change.
              </p>
              <Button
                variant="slim"
                type="submit"
                form="emailForm"
                disabled={true}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Update Email
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="emailForm" action={updateEmail}>
              <input
                type="text"
                name="email"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                defaultValue={user ? user.email : ''}
                placeholder="Your email"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
      </div>
      <div className="w-full m-auto pb-8 flex justify-center">
       <SignOutButton />
      </div>
    </section>
  );
}

interface Props {
  title: string;
  logo?: ReactNode;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, logo, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-4 py-4">
        <div className="flex justify-between py-2 px-1">
          <div>
            <h3 className="mb-1 text-2xl font-medium">{title}</h3>
            <p className="text-zinc-300">{description}</p>
          </div>
          <div className='mr-4'>
            {logo}
          </div>
        </div>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}