import { Logo } from '@/components/icons';

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MessageFooter } from './MessageFooter';
import { Message } from '@/lib/actions';

// https://www.mozzlog.com/blog/fix-react-markdown-tailwindcss-nextjs
// https://www.mozzlog.com/blog/react-markdown-custom-renderer
export const MaestroMessage = ({ name, msg, onDelMessage }: { name: string, msg: Message, onDelMessage: Function }) => {
  return (
    <div className="p-4">
      <div className="flex">
        <div className="w-6 h-6 rounded-full bg-white">
          <Logo className='p-1' height="24" width="24" />
        </div>
        <span className="text-sm ml-3 font-semibold text-gray-200">{name} <sup className='font-normal'>{msg.model_name}</sup></span>

      </div>
      <ReactMarkdown
        className='ml-10'
        components={{
          code: ({ children, className, node, ...rest }) => {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <div className='py-2'>
                <SyntaxHighlighter
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  className={'text-sm'}
                  style={style}
                />
              </div>

            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          },
          p: ({ ...props }) => (
            <p className="leading-relaxed mb-2 text-sm" {...props} />
          ),
          h1: ({ ...props }) => (
            <h1 className="font-bold text-3xl" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="font-bold text-2xl" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="font-bold text-xl" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="font-bold text-lg" {...props} />
          ),
          h5: ({ ...props }) => (
            <h5 className="font-bold text-base" {...props} />
          ),
          h6: ({ ...props }) => (
            <h6 className="font-bold text-sm" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul
              style={{
                display: "block",
                listStyleType: "disc",
                paddingInlineStart: "40px",
              }}
              className='text-sm mb-2'
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              style={{
                display: "block",
                listStyleType: "decimal",
                paddingInlineStart: "40px",
              }}
              className='text-sm'
              {...props}
            />
          ),
        }} children={msg.message} />
      <MessageFooter onDelMessage={onDelMessage} msg={msg} />
    </div>
  )
};

export const UserMessage = ({ name, msg, avatarUrl, onDelMessage }: { name: string, msg: Message, avatarUrl: string, onDelMessage: Function }) => {
  return (
    <div className="p-4">
      <div className="flex">
        <img src={avatarUrl} alt="User Avatar" className="w-6 h-6 rounded-full" />
        <span className="text-sm ml-3 font-semibold text-gray-200">{name}</span>
      </div>
      <p className="whitespace-pre whitespace-pre-wrap text-sm break-all font-normal ml-10 text-gray-200">{msg.message}</p>
      <MessageFooter onDelMessage={onDelMessage} msg={msg} />
    </div>
  )
};