import React, { useState, useRef, useEffect } from 'react'

const ChatInput = ({ inputPesan, setInputPesan, onSubmit, isLoading }) => {
  const [rows, setRows] = useState(1)
  const textareaRef = useRef(null)
  const maxRows = 5

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputPesan])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const newRows = Math.min(
      Math.max(Math.ceil(textarea.scrollHeight / 24), 1),
      maxRows
    )
    setRows(newRows)
    textarea.style.height = `${Math.min(textarea.scrollHeight, 24 * maxRows)}px`
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && inputPesan.trim()) {
        onSubmit(e)
      }
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm">
          <textarea
            ref={textareaRef}
            rows={rows}
            value={inputPesan}
            onChange={(e) => setInputPesan(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan Anda..."
            className="block w-full resize-none bg-transparent py-3 pl-4 pr-16 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 focus:outline-none text-base"
            style={{
              minHeight: '48px',
              maxHeight: `${24 * maxRows}px`
            }}
          />
          <div className="absolute right-2 bottom-2 flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                if (!isLoading && inputPesan.trim()) {
                  onSubmit(e)
                }
              }}
              disabled={isLoading || !inputPesan.trim()}
              className={`rounded-xl p-2 ${
                isLoading || !inputPesan.trim()
                  ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                  : 'text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105 transition-all'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          Tekan Enter untuk mengirim, Shift + Enter untuk baris baru
        </div>
      </div>
    </div>
  )
}

export default ChatInput
