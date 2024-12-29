import React, { useRef } from 'react'
import ReactMarkdown from 'react-markdown'

const ChatMessage = ({ message }) => {
  const isAI = message.pengirim === 'ai'
  const messageRef = useRef(null)

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4 relative`} ref={messageRef}>
      <div 
        className={`flex items-start space-x-3 max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}
      >
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          isAI 
            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400' 
            : 'bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-400 dark:to-rose-400'
        }`}>
          {isAI ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white dark:text-gray-900" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white dark:text-gray-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className={`rounded-2xl px-4 py-2 ${
          isAI 
            ? 'bg-blue-100 dark:bg-gray-700/50 text-gray-900 dark:text-white' 
            : 'bg-purple-500 dark:bg-purple-400 text-white dark:text-gray-900'
        }`}>
          <ReactMarkdown 
            className="prose dark:prose-invert"
            components={{
              p: ({node, ...props}) => <p className="m-0" {...props} />,
              a: ({node, ...props}) => <a className="text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-purple-700 dark:text-purple-300" {...props} />,
              em: ({node, ...props}) => <em className="text-purple-600 dark:text-purple-200" {...props} />,
              code: ({node, inline, ...props}) => 
                inline 
                  ? <code className="bg-blue-50 dark:bg-gray-700/50 rounded px-1" {...props} />
                  : <code className="block bg-blue-50 dark:bg-gray-700/50 rounded p-2 my-2 overflow-x-auto" {...props} />
            }}
          >
            {message.teks}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
