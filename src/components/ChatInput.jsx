import React, { useState, useRef, useEffect } from 'react'

const ChatInput = ({ inputPesan, setInputPesan, onSubmit, isLoading }) => {
  const [rows, setRows] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const textareaRef = useRef(null)
  const maxRows = isMobile ? 3 : 5 // Batasi baris di mobile

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputPesan])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const lineHeight = isMobile ? 20 : 24 // Lebih kecil di mobile
    const newRows = Math.min(
      Math.max(Math.ceil(textarea.scrollHeight / lineHeight), 1),
      maxRows
    )
    setRows(newRows)
    textarea.style.height = `${Math.min(textarea.scrollHeight, lineHeight * maxRows)}px`
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && inputPesan.trim()) {
        onSubmit(e)
      }
    }
  }

  const handleFocus = () => {
    if (isMobile) {
      // Scroll ke textarea setelah delay kecil untuk memastikan keyboard sudah muncul
      setTimeout(() => {
        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }, 300)
    }
  }

  return (
    <div className={`p-2 sm:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ${isMobile ? 'pb-4' : ''}`}>
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm">
          <textarea
            ref={textareaRef}
            rows={rows}
            value={inputPesan}
            onChange={(e) => setInputPesan(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Ketik pesan Anda..."
            className={`block w-full resize-none bg-transparent py-2.5 sm:py-3 pl-3 sm:pl-4 pr-12 sm:pr-16 
              text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 focus:outline-none 
              ${isMobile ? 'text-sm' : 'text-base'}`}
            style={{
              minHeight: isMobile ? '40px' : '48px',
              maxHeight: `${(isMobile ? 20 : 24) * maxRows}px`,
              lineHeight: isMobile ? '20px' : '24px'
            }}
          />
          <div className={`absolute ${isMobile ? 'right-1.5' : 'right-2'} flex items-center h-full pr-1`}>
            <button
              onClick={onSubmit}
              disabled={isLoading || !inputPesan.trim()}
              className={`p-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center ${isMobile ? 'text-sm' : 'text-base'}`}
              style={{
                height: isMobile ? '32px' : '40px',
                width: isMobile ? '32px' : '40px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}>
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
