'use client';

import Button from '@/app/components/ui/Button';

export default async function ManageGithubButton() {
  const openWindow = async () => {
    window.open('https://github.com/apps/codemaestro-sh/installations/new', 'sharer', 'toolbar=0,status=0,width=548,height=548');
  };

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">Manage permissions on GitHub App Page</p>
      <Button
        variant="slim"
        onClick={openWindow}
      >
        Manage on GitHub ↗
      </Button>
    </div>
  );
}
