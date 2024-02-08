'use client';

import { IconSeparator } from '@/components/icons';
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
  if (!pathName.includes('/chat/')) return;
  const searchParams = useSearchParams();
  const model = searchParams.get('model') || 'gpt-3.5-turbo';
  const [selected, setSelected] = useState(model);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    router.push(`${pathName}?model=${newValue}`)
  };
  return (
    <>
      <IconSeparator className="mx-4 size-6" stroke="rgb(113 113 122)" />
      <div className='flex flex-row items-center'>
        <select onChange={handleChange} className='bg-black appearance-none focus:ring-transparent border-none cursor-pointer'>
          {MODELS.map((model, index) => (
            <option key={index} value={model} selected={model === selected}>
              {model} {/* {option.value === selected && ' ▼'} */}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};