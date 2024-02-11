'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

type props = {
  aPath: string,
  aLabel: string,
  bPath: string,
  bLabel: string,
}

const TabbedButton = ({ aPath, aLabel, bPath, bLabel }: props) => {
  const pathName = usePathname();
  const [activeTab, setActiveTab] = useState(pathName === aPath ? aPath : bPath);
  const router = useRouter();

  return (
    <div className="bg-zinc-700 p-1 rounded-lg inline-flex">
      <button
        onClick={() => {
          setActiveTab(aPath);
          router.push(aPath, {
            scroll: false,
          })
        }}
        className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === aPath
          ? 'bg-white text-black'
          : 'text-white hover:bg-gray-700 hover:text-white'
          }`}
      >
        {aLabel}
      </button>
      <button
        onClick={() => {
          setActiveTab(bPath);
          router.push(bPath, {
            scroll: false,
          })
        }}
        className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === bPath
          ? 'bg-white text-black'
          : 'text-white hover:bg-gray-700 hover:text-white'
          }`}
      >
        {bLabel}
      </button>
    </div>
  );
};

export default TabbedButton;