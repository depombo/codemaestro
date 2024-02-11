'use client'

import Button from '@/components/ui/Button';
import React, { useState, useRef, FormEvent } from 'react';

import { CodeMaestro, Message, messageMaestro } from '../../actions';
import { getBrowserClient } from '@/app/supabase/client';

type UserInputProps = {
  maestro: CodeMaestro;
  messages: Message[];
};

const UserInput = ({ messages, maestro }: UserInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false)
  const supabase = getBrowserClient();
  const lastMessage = messages[messages.length - 1];

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
    if (isLoading) {
      // abort last message
      const { error } = await supabase
        .from("messages")
        .update({ aborted: true })
        .eq("id", lastMessage.id);
      console.error(error);
      setIsLoading(false);
      return;
    }
    const messageToSend = message;
    setIsLoading(true);
    setMessage('');
    await messageMaestro(maestro, messages, messageToSend);
    setIsLoading(false);
  }
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the addition of a new line in the textarea (if you don't want this)
      handleFormSubmit();
    }
  };
  return (
    <div className="p-4 bg-black border-t border-zinc-700">
      <form
        id="messageMaestro"
        onSubmit={handleFormSubmit}
        className='flex flex-row w-full items-center'
      >
        <textarea
          ref={textareaRef}
          onKeyDown={handleKeyPress}
          className={"text-sm w-full rounded-md bg-zinc-800 overflow-scroll-y resize-none p-2 outline-none focus:ring-zinc-700"}
          placeholder="Type here..."
          value={message}
          rows={2}
          onChange={handleInputChange}
          style={{ maxHeight: '8rem' }}
        />
        <Button
          disabled={!isLoading && !message.trim().length}
          className="h-8 w-2 ml-4"
          variant="slim"
          loading={isLoading && !lastMessage.model_name /* loading while maestro starts reply so aborts work */}
          form="messageMaestro"
          type="submit"
        >
          {isLoading ? (!lastMessage.model_name ? "" : "⏸") : "↑"} {/*"■" */}
        </Button>
      </form>
    </div>
  );
};

export default UserInput;
