'use client'

import Button from '@/components/ui/Button';
import React, { useState, useRef, FormEvent } from 'react';
import { CodeMaestro, Message, messageMaestro } from '../actions';

type UserInputProps = {
  maestro: CodeMaestro;
  pastMessages: Message[];
};

const UserInput = ({ pastMessages, maestro }: UserInputProps) => {
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

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const messageToSend = message;
    setIsLoading(true);
    setMessage('');
    await messageMaestro(maestro, pastMessages, messageToSend);
    setIsLoading(false);
  }

  return (
    <form
      id="messageMaestro"
      onSubmit={handleFormSubmit}
      className="items-start w-4/5"
    >
      <textarea
        ref={textareaRef}
        className={"w-full text-sm rounded-md bg-zinc-800 resize-none overflow-scroll-y p-2 w-full outline-none"}
        placeholder="Type here..."
        value={message}
        rows={1}
        onChange={handleInputChange}
        style={{ maxHeight: '8rem' }}
      />
      <Button
        className="h-8 w-2"
        disabled={isLoading}
        variant="slim"
        form="messageMaestro"
        type="submit"
      >
        ↑
      </Button>
    </form>
  );
};

export default UserInput;
