import {
  Message,
  CodeMaestro,
  User,
} from '@/app/actions';
import { MaestroMessage, UserMessage } from './Message';
import RtChatHistory from './RtChatHistory';

type ChatHistoryProps = {
  maestro: CodeMaestro;
  user: User;
  pastMessages: Message[];
  className: string;
};

export default function ChatHistory({ maestro, user, pastMessages, className }: ChatHistoryProps) {
  return (
    <div className={className}>
      {
        pastMessages.map(m => (
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
      <RtChatHistory
        pastMessages={pastMessages}
        user={user}
        maestro={maestro}
      />
    </div>
  );
}