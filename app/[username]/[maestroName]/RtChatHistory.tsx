'use client';

import {
  Message,
  CodeMaestro,
  User,
} from '@/app/actions';
import { getBrowserClient } from '../../supabase/client';
import { useEffect, useRef, useState, } from 'react';
import { MaestroMessage, UserMessage } from './Message';
import { SearchParams } from '@/utils/helpers';

type RtChatHistoryProps = {
  maestro: CodeMaestro;
  user: User;
  pastMessages: Message[];
  searchParams: SearchParams;
  className: string;
};

export default function ChatHistory({ maestro, user, pastMessages, searchParams, className }: RtChatHistoryProps) {
  const bookmarked = !!searchParams?.bookmarked;
  const [rtMessages, setRtMessages] = useState<Message[]>(pastMessages);
  const supabase = getBrowserClient();
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
      (payload) => {
        setRtMessages([...rtMessages, payload.new])
        scrollToBottom()
      }
    )
    .on<Message>(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `maestro_id=eq.${maestro.id}`,
      },
      (payload) => {
        setRtMessages(
          rtMessages
            .map(m => m.id === payload.new.id ? payload.new : m)
        )
      }
    )
    .subscribe()

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  // useEffect(scrollToBottom, [rtMessages]);

  return (
    <div className={className}>
      {
        rtMessages.filter(m => !bookmarked || bookmarked === m.bookmarked).map(m => (
          m.model_name ?
            <MaestroMessage
              key={m.id}
              name={maestro.name}
              msg={m}
            />
            :
            <UserMessage
              key={m.id}
              name={user.full_name || "You"}
              avatarUrl={user.avatar_url || ""}
              msg={m}
            />
        ))
      }
      <div ref={messagesEndRef} />
    </div>
  );
}