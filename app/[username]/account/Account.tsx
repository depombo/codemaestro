import ManageStripeButton from './ManageStripeButton';
import SignOutButton from './SignOutButton';
import {
  updateName,
  getSession,
  getUserDetails,
  getSubscription,
  updateUsername
} from '@/app/actions';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { Stripe, GitHub } from '@/components/icons';
import ManageGithubButton from './ManageGithubButton';

export default async function Settings() {

  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  if (!session) redirect('/signin')
  const ghUser = session.user.user_metadata.user_name;

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-20 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center">
            Account
          </h1>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Authentication"
          logo={<GitHub fill='white' height='50' width='50' />}
          description={'Manage the connection between CodeMaestro and GitHub'}
          footer={
            <ManageGithubButton />
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold hover:text-zinc-400">
            <Link href={"https://github.com/" + ghUser} target="_blank" rel="noopener noreferrer">@{ghUser}</Link>
          </div>
        </Card>
        <Card
          title="Plan"
          logo={<Stripe fill='white' />}
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
          title="Username"
          description="Please enter your unique username."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">Only ASCII letters, digits, and the characters ., -, and _.</p>
              <Button
                variant="slim"
                type="submit"
                form="usernameForm"
                disabled={false}
              >
                Update Username
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="nameForm" action={updateUsername}>
              <input
                type="text"
                name="username"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                defaultValue={userDetails?.username ?? ''}
                placeholder="Your name"
                maxLength={64}
              />
            </form>
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
                disabled={false}
              >
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
        {/* <Card
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
        </Card> */}
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