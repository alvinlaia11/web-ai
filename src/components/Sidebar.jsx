import React, { useState } from 'react'

const Sidebar = ({ 
  chatList, 
  onNewChat, 
  isOpen, 
  isMobile, 
  onClose,
  activeChatId,
  setActiveChatId,
  onUpdateTitle,
  onDeleteChat,
  onClearHistory,
  onOpenSettings
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingChatId, setEditingChatId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [showMenu, setShowMenu] = useState(null)

  // Fungsi untuk membersihkan format Markdown
  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Hapus **bold**
      .replace(/\*(.*?)\*/g, '$1')      // Hapus *italic*
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Hapus [link](url)
      .replace(/`(.*?)`/g, '$1')        // Hapus `code`
  }

  const filteredChats = chatList.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditClick = (chat) => {
    setEditingChatId(chat.id)
    setEditTitle(chat.title)
  }

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onUpdateTitle(editingChatId, editTitle.trim())
    }
    setEditingChatId(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle()
    }
  }

  const handleMenuClick = (e, chatId) => {
    e.stopPropagation()
    setShowMenu(showMenu === chatId ? null : chatId)
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    onDeleteChat(chatId)
    setShowMenu(null)
  }

  const handleClearHistory = (e, chatId) => {
    e.stopPropagation()
    onClearHistory(chatId)
    setShowMenu(null)
  }

  if (!isOpen) return null

  return (
    <div className="w-80 h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Header dengan tombol close untuk mobile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          onClick={() => {
            onNewChat()
            if (isMobile) onClose()
          }}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-3 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Chat Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              setActiveChatId(chat.id)
              if (isMobile) onClose()
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeChatId === chat.id
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">
                {chat.title.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 text-left truncate">
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-300/50"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="font-medium">{chat.title}</h3>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {cleanMarkdown(chat.lastMessage)}
              </p>
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditClick(chat)
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 dark:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleMenuClick(e, chat.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 dark:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dropdown Menu */}
            {showMenu === chat.id && (
              <div 
                className="fixed transform translate-x-[-90%] w-48 rounded-md shadow-lg bg-gray-50 dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-[9999]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1">
                  <button
                    onClick={(e) => handleClearHistory(e, chat.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-purple-400 dark:hover:text-purple-300 transition-colors"
                  >
                    Hapus Riwayat Chat
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 dark:text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-300 dark:hover:text-red-400 transition-colors"
                  >
                    Hapus Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer dengan tombol settings */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Pengaturan</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
