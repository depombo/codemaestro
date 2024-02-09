'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const TabbedButton = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(!!searchParams.get('bookmarked') ? 'bookmarked' : 'allMessages'); // Default to 'allMessages'
  const pathName = usePathname();
  const router = useRouter();

  return (
    <div className="bg-zinc-700 p-1 rounded-lg inline-flex">
      <button
        onClick={() => {
          setActiveTab('allMessages');
          router.push(pathName, {
            scroll: false,
          })
        }}
        className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'allMessages'
          ? 'bg-white text-black'
          : 'text-white hover:bg-gray-700 hover:text-white'
          }`}
      >
        All messages
      </button>
      <button
        onClick={() => {
          setActiveTab('bookmarked');
          router.push(`${pathName}?bookmarked=true`, {
            scroll: false,
          })
        }}
        className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'bookmarked'
          ? 'bg-white text-black'
          : 'text-white hover:bg-gray-700 hover:text-white'
          }`}
      >
        Bookmarked
      </button>
    </div>
  );
};

export default TabbedButton;