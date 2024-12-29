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
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, chatId: null, chatTitle: '' })
  const [editModal, setEditModal] = useState({ isOpen: false, chatId: null, chatTitle: '' })
  const editInputRef = useRef(null)

  // Reset editing state when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setEditingChatId(null)
      setEditTitle('')
      setEditModal({ isOpen: false, chatId: null, chatTitle: '' })
    }
  }, [isOpen])

  useEffect(() => {
    if (editingChatId && editInputRef.current && !isMobile) {
      editInputRef.current.focus()
    }
  }, [editingChatId, isMobile])

  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/\`(.*?)\`/g, '$1')
  }

  const filteredChats = chatList.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditClick = (e, chat) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isMobile) {
      // Hentikan event bubbling dan tunda pembukaan modal
      setTimeout(() => {
        setEditModal({ isOpen: true, chatId: chat.id, chatTitle: chat.title });
      }, 100);
    } else {
      setEditingChatId(chat.id)
      setEditTitle(chat.title)
    }
  }

  const handleSaveTitle = (chatId, newTitle) => {
    if (newTitle.trim()) {
      onUpdateTitle(chatId, newTitle.trim())
    }
    
    // Reset states
    setEditingChatId(null)
    setEditTitle('')
    setEditModal({ isOpen: false, chatId: null, chatTitle: '' })
  }

  const handleDeleteClick = (e, chat) => {
    e.stopPropagation()
    setDeleteModal({ isOpen: true, chatId: chat.id, chatTitle: chat.title })
  }

  const handleConfirmDelete = () => {
    onDeleteChat(deleteModal.chatId)
    setDeleteModal({ isOpen: false, chatId: null, chatTitle: '' })
    if (isMobile) onClose()
  }

  const handleChatClick = (chatId) => {
    if (!editingChatId) {
      setActiveChatId(chatId)
      if (isMobile) onClose()
    }
  }

  // Mobile Edit Modal Component
  const EditModal = () => {
    const [localTitle, setLocalTitle] = useState(editModal.chatTitle);
    
    if (!editModal.isOpen) return null;

    const handleModalClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={handleModalClick}
      >
        <div 
          className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" 
          onClick={handleModalClick}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('sidebar.editChat')}
            </h3>
          </div>
          <div className="p-4" onClick={handleModalClick}>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => {
                e.stopPropagation();
                setLocalTitle(e.target.value);
              }}
              onClick={handleModalClick}
              onFocus={handleModalClick}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2 p-4 bg-gray-50 dark:bg-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditModal({ isOpen: false, chatId: null, chatTitle: '' });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveTitle(editModal.chatId, localTitle);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null

  return (
    <>
      <div className="h-full flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
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
              onChange={(e) => {
                e.stopPropagation();
                setSearchQuery(e.target.value)
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleChatClick(chat.id)
              }}
              className={`group relative flex items-center p-3 space-x-3 cursor-pointer transition-all duration-200 ${
                activeChatId === chat.id 
                  ? 'bg-purple-50 dark:bg-purple-900/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              } rounded-lg`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {chat.title.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {editingChatId === chat.id && !isMobile ? (
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveTitle(chat.id, editTitle)
                  }}>
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editTitle}
                      onChange={(e) => {
                        e.stopPropagation();
                        setEditTitle(e.target.value)
                      }}
                      className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                  </form>
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
              <div className={`flex-shrink-0 flex items-center space-x-1 ${!isMobile && 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(e, chat)
                  }}
                  className="p-1.5 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(e, chat)
                  }}
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

        {/* Settings Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings()
            }}
            className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>{t('sidebar.settings')}</span>
          </button>
        </div>
      </div>

      {/* Edit Modal for Mobile */}
      <EditModal />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={(e) => {
          e.stopPropagation();
          setDeleteModal({ isOpen: false, chatId: null, chatTitle: '' })
        }}
        onConfirm={handleConfirmDelete}
        chatTitle={deleteModal.chatTitle}
      />
    </>
  )
}

export default Sidebar
