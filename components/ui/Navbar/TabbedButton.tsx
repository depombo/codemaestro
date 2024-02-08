'use client';

import React, { useState } from 'react';

const TabbedButton = () => {
  const [activeTab, setActiveTab] = useState('allMail'); // Default to 'allMail'

  return (
    <div className="bg-zinc-700 p-1 rounded-lg inline-flex">
      <button
        onClick={() => setActiveTab('allMail')}
        className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'allMail'
          ? 'bg-white text-black'
          : 'text-white hover:bg-gray-700 hover:text-white'
          }`}
      >
        All messages
      </button>
      <button
        onClick={() => setActiveTab('unread')}
        className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'unread'
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