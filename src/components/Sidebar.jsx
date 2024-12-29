import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import DeleteConfirmationModal from './DeleteConfirmationModal'

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
  onOpenSettings,
  settings
}) => {
  const { t } = useTranslation(settings?.language)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingChatId, setEditingChatId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [showMenu, setShowMenu] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, chatId: null, chatTitle: '' })
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [isLongPress, setIsLongPress] = useState(false)

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

  const handleEditClick = (e, chat) => {
    e.stopPropagation() // Mencegah trigger event parent
    setEditingChatId(chat.id)
    setEditTitle(chat.title)
    setShowMenu(null) // Tutup menu saat mulai edit
  }

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onUpdateTitle(editingChatId, editTitle.trim())
    }
    setEditingChatId(null)
    setShowMenu(null) // Tutup menu setelah save
  }

  const handleKeyPress = (e) => {
    e.stopPropagation() // Mencegah trigger event parent
    if (e.key === 'Enter') {
      handleSaveTitle()
    }
  }

  const handleMenuClick = (e, chatId) => {
    e.stopPropagation()
    setShowMenu(showMenu === chatId ? null : chatId)
  }

  const handleDeleteClick = (e, chat) => {
    e.stopPropagation()
    setDeleteModal({ isOpen: true, chatId: chat.id, chatTitle: chat.title })
  }

  const handleConfirmDelete = () => {
    onDeleteChat(deleteModal.chatId)
    setDeleteModal({ isOpen: false, chatId: null, chatTitle: '' })
  }

  const handleTouchStart = (e, chatId) => {
    e.stopPropagation()
    const timer = setTimeout(() => {
      setShowMenu(chatId)
      setIsLongPress(true)
    }, 500) // 500ms untuk long press
    setLongPressTimer(timer)
  }

  const handleTouchEnd = (e) => {
    e.stopPropagation()
    if (longPressTimer) {
      clearTimeout(longPressTimer)
    }
    // Jika bukan long press, biarkan click event normal terjadi
    setTimeout(() => {
      setIsLongPress(false)
    }, 100)
  }

  const handleChatClick = (chatId) => {
    if (!isLongPress) {
      setActiveChatId(chatId)
      if (isMobile) {
        onClose()
      }
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="h-full flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
            <span className="font-medium">{t('sidebar.newChat')}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder={t('sidebar.searchPlaceholder')}
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
          {filteredChats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              onTouchStart={(e) => handleTouchStart(e, chat.id)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={(e) => {
                if (longPressTimer) {
                  clearTimeout(longPressTimer)
                }
              }}
              className={`group relative flex items-center p-3 space-x-3 cursor-pointer transition-all duration-200 ${
                activeChatId === chat.id 
                  ? 'bg-purple-50 dark:bg-purple-900/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {chat.title.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {editingChatId === chat.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => {
                      e.stopPropagation()
                      setEditTitle(e.target.value)
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onBlur={handleSaveTitle}
                    onKeyPress={handleKeyPress}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {cleanMarkdown(chat.lastMessage)}
                    </p>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-1">
                <button
                  onClick={(e) => handleEditClick(e, chat)}
                  className="p-1.5 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleDeleteClick(e, chat)}
                  className="p-1.5 bg-red-50 text-red-400 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{t('sidebar.settings')}</span>
          </button>
        </div>
      </div>

      {/* Menu Items - Tampilkan sebagai modal di mobile */}
      {showMenu !== null && (
        <div 
          className={`${isMobile ? 'fixed inset-x-0 bottom-0 p-4 bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg z-50' : 'absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5'}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEditClick(e, chatList.find(chat => chat.id === showMenu))
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {t('sidebar.editChat')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick(e, chatList.find(chat => chat.id === showMenu))
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {t('sidebar.deleteChat')}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, chatId: null, chatTitle: '' })}
        onConfirm={handleConfirmDelete}
        chatTitle={deleteModal.chatTitle}
      />
    </>
  )
}

export default Sidebar
