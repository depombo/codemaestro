'use client';

import {
  Message,
  CodeMaestro,
  User,
} from '@/app/actions';
import Logo from '@/components/icons/Logo';
import { getBrowserClient } from '../supabase/client';
import { useState } from 'react';

const MaestroMessage = ({ name, message }: { name: string, message: string }) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col w-full p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white">
            <Logo className='p-2' />
          </div>
          <span className="text-sm ml-3 font-semibold text-gray-200">{name}</span>
        </div>
        <p className="text-sm font-normal ml-14 text-gray-200">{message}</p>
      </div>
    </div>
  )
};

const UserMessage = ({ name, message, avatarUrl }: { name: string, message: string, avatarUrl: string }) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col w-full p-4">
        <div className="flex items-center">
          <img src={avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <span className="text-sm ml-3 font-semibold text-gray-200">{name}</span>
        </div>
        <p className="text-sm font-normal ml-14 text-gray-200">{message}</p>
      </div>
    </div>
  )
};

type ChatHistoryProps = {
  maestro: CodeMaestro;
  user: User;
  pastMessages: Message[];
};

export default function ChatHistory({ maestro, user, pastMessages }: ChatHistoryProps) {
  const [messages, setMessages] = useState(pastMessages);
  const supabase = getBrowserClient()
  supabase
    .channel('messages-db')
    .on<Message>(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `maestro_id=eq.${maestro.id}`,
      },
      (payload) => setMessages([...messages, payload.new])
    )
    .on<Message>(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `maestro_id=eq.${maestro.id}`,
      },
      (payload) => setMessages(
        messages
          .map(m => m.id === payload.new.id ? payload.new : m)
      )
    )
    .subscribe()

  return (
    <div className='flex flex-row'>

      <div className="flex flex-col grow items-center p-4">

        <div className='flex flex-col h-full'>
          {
            messages.map(m => (
              m.model_name ?
                <MaestroMessage
                  key={m.id}
                  name={maestro.name}
                  message={m.message}
                />
                :
                <UserMessage
                  key={m.id}
                  name={user.full_name || "You"}
                  avatarUrl={user.avatar_url || ""}
                  message={m.message}
                />
            ))
          }
        </div>
      </div>
    </div>
  );
}