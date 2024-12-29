import React, { useEffect, useRef } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { useTranslation } from '../hooks/useTranslation'

const ChatArea = ({ 
  pesan, 
  inputPesan, 
  setInputPesan, 
  onSubmit, 
  isLoading,
  isMobile,
  settings,
  setIsSidebarOpen,
  onOpenSettings,
  activeChat
}) => {
  const { t } = useTranslation(settings?.language)
  const chatContainerRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [pesan, isLoading])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat messages */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-4 py-4 ${isMobile ? 'pb-safe-area' : ''}`} ref={chatContainerRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {pesan.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('welcome.title')}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{t('welcome.subtitle')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {pesan.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        inputPesan={inputPesan}
        setInputPesan={setInputPesan}
        onSubmit={onSubmit}
        isLoading={isLoading}
        isMobile={isMobile}
        settings={settings}
      />
    </div>
  )
}

export default ChatArea
