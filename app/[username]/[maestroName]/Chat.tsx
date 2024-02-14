'use client';

import {
  Message,
  CodeMaestro,
  User,
} from '@/app/actions';
import { getBrowserClient } from '../../supabase/client';
import { useRef, useState, useEffect } from 'react';
import { MaestroMessage, UserMessage } from './Message';
import UserInput from './UserInput';
import Test from './Test';

type ChatProps = {
  maestro: CodeMaestro;
  user: User;
  pastMessages: Message[];
};

export default function Chat({ maestro, user, pastMessages }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(pastMessages);
  const [loaded, setLoaded] = useState<boolean>(false);
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
        setMessages([...messages, payload.new])
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
        setMessages(
          messages
            .map(m => m.id === payload.new.id && !payload.new.aborted ? payload.new : m)
        )
      }
    )
    .subscribe()

  const onDelMessage = (msg: Message) => {
    msg.deleted = true;
    setMessages(messages.map(m => m.id === msg.id ? msg : m));
    supabase
      .from('messages')
      .update({ deleted: true })
      .eq('id', msg.id)
      .then(resp => {
        if (resp.error) console.error(resp.error)
      })
  }

  const allMessagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    const elem = allMessagesRef.current;
    if (!elem) return;
    const scrollDiff = (elem.scrollHeight - elem.scrollTop) - elem.clientHeight;
    // console.log(elem.scrollHeight, elem.scrollTop, elem.clientHeight)
    // console.log(scrollDiff)
    if (!loaded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      setLoaded(true);
    }
    // console.log(scrollDiff)
    if (scrollDiff < 150) {
      elem.scrollTop = elem.scrollHeight;
      //messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }
  useEffect(scrollToBottom, [messages])
  // setInterval(scrollToBottom, 1000)

  return <Test />

  return (
    <>
      <div ref={allMessagesRef} className="flex-1 py-4 px-8 sm:px-20 overflow-y-auto">
        {
          messages
            .filter(m => !m.deleted)
            .map(m => (
              m.model_name ?
                <MaestroMessage
                  key={m.id}
                  name={maestro.name}
                  msg={m}
                  onDelMessage={onDelMessage}
                />
                :
                <UserMessage
                  key={m.id}
                  name={user.full_name || "You"}
                  avatarUrl={user.avatar_url || ""}
                  msg={m}
                  onDelMessage={onDelMessage}
                />
            ))
        }
        <div ref={messagesEndRef} />
      </div>
      <UserInput
        maestro={maestro}
        messages={messages}
      />
    </>

  );
}