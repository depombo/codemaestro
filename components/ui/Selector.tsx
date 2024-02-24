'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IconDoubleCaretSelect } from '../icons';

const Selector = ({ options, onChange, selection }: { options: string[], onChange: Function, selection: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(selection);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-full px-2 py-2 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:bg-zinc-700 focus:outline-none"
      >
        {selectedOption}
        <IconDoubleCaretSelect className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 w-full rounded-md shadow-lg shadow-zinc-900 bg-black ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {options.map((option, index) => (
              <a
                key={index}
                className="block px-4 py-2 text-sm rounded-md text-white hover:bg-zinc-700 hover:text-white"
                role="menuitem"
                onClick={() => {
                  setSelectedOption(option);
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Selector;
