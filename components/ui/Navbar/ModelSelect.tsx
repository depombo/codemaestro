'use client';

import { IconSeparator } from '@/components/icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Selector from '../Selector';


// https://platform.openai.com/docs/models/continuous-model-upgrades
const MODELS = ['gpt-3.5-turbo', 'gpt-4']

export function getModel(param: string | null): string {
  if (!param) return MODELS[0];
  const idx = MODELS.indexOf(param);
  if (idx < 0) return MODELS[0];
  return MODELS[idx];
}

export const ModelSelect = () => {

  const pathName = usePathname();
  if (pathName.split('/').filter(s => s.length > 1).length !== 2) return;
  const searchParams = useSearchParams();
  const model = searchParams.get('model') || 'gpt-3.5-turbo';
  const [selected, setSelected] = useState(model);
  const router = useRouter();

  const handleChange = (newValue: string) => {
    // https://nextjs.org/docs/app/api-reference/functions/use-router#disabling-scroll-restoration
    router.push(`${pathName}?model=${newValue}`, {
      scroll: false,
    })
  };
  return (
    <>
      <IconSeparator className="mx-4 size-6" stroke="rgb(113 113 122)" />
      <div className='flex flex-row items-center'>
        <Selector options={MODELS} selection={selected} onChange={handleChange} />
      </div>
    </>
  );
};