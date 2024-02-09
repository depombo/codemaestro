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
  searchParams: Record<string, string> | null | undefined;
};

export default function ChatHistory({ maestro, user, pastMessages, className, searchParams }: ChatHistoryProps) {
  const bookmarked = !!searchParams?.bookmarked;
  return (
    <div className={className}>
      {
        pastMessages.filter(m => !bookmarked || bookmarked === m.bookmarked).map(m => (
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
        searchParams={searchParams}
        pastMessages={pastMessages}
        user={user}
        maestro={maestro}
      />
    </div>
  );
}