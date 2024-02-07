'use client'

import Button from '@/components/ui/Button';
import React, { useState, useRef, FormEvent } from 'react';
import { CodeMaestro, Message, messageMaestro } from '../../actions';

type UserInputProps = {
  maestro: CodeMaestro;
  pastMessages: Message[];
  className: string;
};

const UserInput = ({ pastMessages, maestro, className }: UserInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    // Automatically adjust the height to fit content
    const textarea = textareaRef.current;
    if (!textarea) return;
    (textarea as HTMLTextAreaElement).style.height = 'auto'; // Reset height to recalculate
    (textarea as HTMLTextAreaElement).style.height = (textarea as HTMLTextAreaElement).scrollHeight + 'px';
  };

  const handleFormSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const messageToSend = message;
    setIsLoading(true);
    setMessage('');
    await messageMaestro(maestro, pastMessages, messageToSend);
    setIsLoading(false);
  }
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the addition of a new line in the textarea (if you don't want this)
      handleFormSubmit();
    }
  };
  return (
    <div className={className}>
      <form
        id="messageMaestro"
        onSubmit={handleFormSubmit}
        className='flex flex-row w-full items-center'
      >
        <textarea
          ref={textareaRef}
          onKeyDown={handleKeyPress}
          className={"text-sm w-full rounded-md bg-zinc-800 overflow-scroll-y resize-none p-2 outline-none"}
          placeholder="Type here..."
          value={message}
          rows={2}
          onChange={handleInputChange}
          style={{ maxHeight: '8rem' }}
        />
        <Button
          className="h-8 w-2 ml-4"
          disabled={isLoading}
          variant="slim"
          form="messageMaestro"
          type="submit"
        >
          ↑
        </Button>
      </form>
    </div>
  );
};

export default UserInput;
