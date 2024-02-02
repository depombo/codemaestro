'use client'

import React, { useState, useRef } from 'react';

const AutoGrowingTextarea = ({ ...props }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    // Automatically adjust the height to fit content
    const textarea = textareaRef.current;
    if (!textarea) return;
    (textarea as HTMLTextAreaElement).style.height = 'auto'; // Reset height to recalculate
    (textarea as HTMLTextAreaElement).style.height = (textarea as HTMLTextAreaElement).scrollHeight + 'px';
  };

  return (
    <textarea
      ref={textareaRef}
      className={"w-full text-sm rounded-md bg-zinc-800 resize-none overflow-scroll-y p-2 w-full outline-none"}
      placeholder="Type here..."
      value={value}
      rows={1}
      onChange={handleInputChange}
      style={{ maxHeight: '8rem' }}
      {...props}
    />
  );
};

export default AutoGrowingTextarea;
