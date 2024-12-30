import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import DeleteConfirmation from './DeleteConfirmation'

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
  onClearAllChats,
  settings,
  onEditMode
}) => {
  const { t } = useTranslation(settings?.language)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingChatId, setEditingChatId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, chatId: null, type: 'single' })
  const editInputRef = useRef(null)

  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingChatId])

  useEffect(() => {
    onEditMode(editingChatId !== null)
  }, [editingChatId, onEditMode])

  // Fungsi untuk membersihkan format Markdown
  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Hapus **bold**
      .replace(/\*(.*?)\*/g, '$1')      // Hapus *italic*
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Hapus [link](url)
      .replace(/`(.*?)`/g, '$1')        // Hapus `code`
  }

  const filteredChats = chatList.filter(chat => {
    const chatTitle = chat.titleKey ? t(`chat.${chat.titleKey}`) : (chat.title || t('chat.untitled'))
    const chatLastMessage = chat.lastMessage || ''
    return (
      chatTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatLastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleEditClick = (e, chat) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingChatId(chat.id)
    setEditTitle(chat.titleKey ? t(`chat.${chat.titleKey}`) : (chat.title || t('chat.untitled')))
  }

  const handleSaveTitle = () => {
    if (editingChatId && editTitle.trim()) {
      onUpdateTitle(editingChatId, editTitle.trim())
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setEditingChatId(null)
    }
  }

  const handleChatClick = (chatId) => {
    // Jangan lakukan apa-apa jika sedang dalam mode edit
    if (editingChatId) {
      return
    }
    setActiveChatId(chatId)
    if (isMobile) {
      onClose()
    }
  }

  const handleInputBlur = (e) => {
    const relatedTarget = e.relatedTarget
    // Hanya simpan jika klik di luar area edit
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      handleSaveTitle()
    }
  }

  const handleDeleteClick = (e, chatId) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteConfirmation({ isOpen: true, chatId, type: 'single' })
  }

  const handleClearAllClick = (e) => {
    e.preventDefault()
    setDeleteConfirmation({ isOpen: true, chatId: null, type: 'all' })
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmation.type === 'single' && deleteConfirmation.chatId) {
      onDeleteChat(deleteConfirmation.chatId)
    } else if (deleteConfirmation.type === 'all') {
      onClearAllChats()
    }
    setDeleteConfirmation({ isOpen: false, chatId: null, type: 'single' })
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
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className={`group relative flex items-center p-3 space-x-3 cursor-pointer transition-all duration-200 ${
                  activeChatId === chat.id 
                    ? 'bg-purple-50 dark:bg-purple-900/20' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {(chat.titleKey ? t(`chat.${chat.titleKey}`) : (chat.title || t('chat.untitled'))).charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {editingChatId === chat.id ? (
                    <div className="flex-1 min-w-0 max-w-[calc(100%-3rem)]">
                      <div>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={handleKeyPress}
                          onBlur={handleInputBlur}
                          autoFocus
                          className="w-full max-w-full px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-purple-300 dark:border-purple-600 rounded focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 text-sm"
                          ref={editInputRef}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div title={chat.title} className="text-sm font-medium text-gray-600 dark:text-white truncate">
                          {chat.titleKey ? t(`chat.${chat.titleKey}`) : (chat.title || t('chat.untitled'))}
                        </div>
                        {chat.lastMessage && (
                          <div title={chat.lastMessage} className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {cleanMarkdown(chat.lastMessage)}
                          </div>
                        )}
                      </div>
                      <div className={`flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${editingChatId ? 'hidden' : ''}`}>
                        <button
                          title="Edit Chat"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(e, chat)
                          }}
                          className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg transition-colors active:shadow-none focus:outline-none select-none"
                        >
                          <svg className="w-4 h-4 select-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{WebkitTapHighlightColor: 'transparent'}} draggable="false">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          title="Delete Chat"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(e, chat.id)
                          }}
                          className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg transition-colors active:shadow-none focus:outline-none select-none"
                        >
                          <svg className="w-4 h-4 select-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{WebkitTapHighlightColor: 'transparent'}} draggable="false">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className={`absolute right-2 space-x-1 ${
                  activeChatId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity ${editingChatId ? 'hidden' : ''}`}>
                  <button
                    title="Edit Chat"
                    onClick={(e) => handleEditClick(e, chat)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg transition-colors active:shadow-none focus:outline-none select-none"
                  >
                    <svg className="w-4 h-4 select-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{WebkitTapHighlightColor: 'transparent'}} draggable="false">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    title="Delete Chat"
                    onClick={(e) => handleDeleteClick(e, chat.id)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg transition-colors active:shadow-none focus:outline-none select-none"
                  >
                    <svg className="w-4 h-4 select-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{WebkitTapHighlightColor: 'transparent'}} draggable="false">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div>
                <p className="text-lg font-medium">{t('chat.empty')}</p>
                <p className="text-sm">{t('chat.startNew')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>{t('sidebar.settings')}</span>
          </button>
          <button
            onClick={handleClearAllClick}
            className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{t('sidebar.clearAllChats')}</span>
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, chatId: null, type: 'single' })}
          onConfirm={handleConfirmDelete}
          settings={settings}
          title={deleteConfirmation.type === 'all' ? t('deleteConfirmation.clearAllTitle') : t('deleteConfirmation.title')}
          message={deleteConfirmation.type === 'all' ? t('deleteConfirmation.clearAllMessage') : t('deleteConfirmation.message')}
        />
      </div>
    </>
  )
}

export default Sidebar
