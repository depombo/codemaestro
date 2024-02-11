'use client';

import Selector from '@/components/ui/Selector';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';


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
      <Selector options={MODELS} selection={selected} onChange={handleChange} />
    </>
  );
};