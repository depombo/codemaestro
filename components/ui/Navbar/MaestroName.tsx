'use client';

import { IconSeparator } from '@/components/icons';
import { usePathname } from 'next/navigation';
import React from 'react';

export const MaestroName = () => {

  const pathName = usePathname();
  const pathSplit = pathName.split('/').filter(s => s.length > 1);
  if (pathSplit.length < 2) return;
  const maestroName = pathSplit[1];

  return (
    <>
      <IconSeparator className="mx-4 size-6" stroke="rgb(113 113 122)" />
      {maestroName}
    </>
  );
};