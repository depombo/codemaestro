'use client';

import { CodeMaestro, ModelName, updateMaestroModel } from '@/app/actions';
import Selector from '@/components/ui/Selector';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';


// https://platform.openai.com/docs/models/continuous-model-upgrades
const MODELS = ['gpt-3.5-turbo', 'gpt-4']
export const ModelSelect = ({ maestro }: { maestro: CodeMaestro }) => {

  const [selected, setSelected] = useState(maestro.model_name as string);
  const path = usePathname();

  const handleChange = (newValue: string) => {
    setSelected(newValue);
    updateMaestroModel(maestro, newValue as ModelName, path)
  };
  return (
    <>
      <Selector options={MODELS} selection={selected} onChange={handleChange} />
    </>
  );
};