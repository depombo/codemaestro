import Logo from '@/components/icons/Logo';

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as style } from 'react-syntax-highlighter/dist/esm/styles/prism'


// https://www.mozzlog.com/blog/fix-react-markdown-tailwindcss-nextjs
// https://www.mozzlog.com/blog/react-markdown-custom-renderer
export const MaestroMessage = ({ name, message, model }: { name: string, message: string, model: string }) => {
  return (
    <div className="items-start">
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white">
            <Logo className='p-2' />
          </div>
          <span className="text-sm ml-3 font-semibold text-gray-200">{name} <sup className='font-normal'>{model}</sup></span>

        </div>
        <ReactMarkdown
          className='ml-14'
          components={{
            code: ({ children, className, node, ...rest }) => {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <div className='p-4'>
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
          }} children={message} />
      </div>
    </div>
  )
};

export const UserMessage = ({ name, message, avatarUrl }: { name: string, message: string, avatarUrl: string }) => {
  return (
    <div className="items-start">
      <div className="p-4">
        <div className="flex items-center">
          <img src={avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <span className="text-sm ml-3 font-semibold text-gray-200">{name}</span>
        </div>
        <p className="text-sm break-all font-normal ml-14 text-gray-200">{message}</p>
      </div>
    </div>
  )
};