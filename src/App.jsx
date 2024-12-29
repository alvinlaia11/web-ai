import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Settings from './components/Settings'
import DeleteConfirmation from './components/DeleteConfirmation'
import AIService from './services/aiService'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [inputPesan, setInputPesan] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeChatId, setActiveChatId] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings')
    return savedSettings ? JSON.parse(savedSettings) : {
      theme: 'dark',
      language: 'id',
      fontSize: 'medium'
    }
  })
  
  // Menyimpan semua chat dalam format: { id, title, lastMessage, messages: [] }
  const [chatList, setChatList] = useState(() => {
    const savedChats = localStorage.getItem('chatList')
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats)
      if (parsedChats.length > 0) {
        setActiveChatId(parsedChats[0].id)
        return parsedChats
      }
    }
    return []
  })

  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, chatId: null })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)

  // Simpan chat ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('chatList', JSON.stringify(chatList))
  }, [chatList])

  // Simpan settings ke localStorage
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
    // Terapkan tema dengan benar menggunakan class 'dark'
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    // Terapkan ukuran font
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[settings.fontSize]
  }, [settings])

  // Mendapatkan pesan dari chat yang aktif
  const activeChat = chatList.find(chat => chat.id === activeChatId)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'Chat Baru',
      lastMessage: '',
      isNewChat: true,
      messages: []
    }
    setChatList(prev => [...prev, newChat])
    setActiveChatId(newChat.id)
    if (isMobile) setIsSidebarOpen(false)
  }

  // Jika tidak ada chat, buat chat baru
  useEffect(() => {
    if (chatList.length === 0) {
      handleNewChat()
    }
  }, [chatList.length])

  const updateChatTitle = (chatId, newTitle) => {
    setChatList(prevList =>
      prevList.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    )
  }

  const handleDeleteChat = (chatId) => {
    setDeleteConfirmation({ isOpen: true, chatId })
  }

  const confirmDelete = () => {
    const { chatId } = deleteConfirmation
    const newChatList = chatList.filter(chat => chat.id !== chatId)
    setChatList(newChatList)
    
    if (chatId === activeChatId) {
      setActiveChatId(newChatList.length > 0 ? newChatList[0].id : null)
    }

    setDeleteConfirmation({ isOpen: false, chatId: null })
  }

  const clearChatHistory = (chatId) => {
    setChatList(prevList =>
      prevList.map(chat =>
        chat.id === chatId 
          ? { ...chat, messages: [], lastMessage: '' }
          : chat
      )
    )
  }

  const generateTitleFromMessage = async (message) => {
    try {
      const response = await AIService.sendMessage(
        `Buatkan judul singkat (maksimal 6 kata) yang menggambarkan topik dari pesan berikut: "${message}"`,
        []
      )
      return response.trim()
    } catch (error) {
      console.error('Error generating title:', error)
      return 'Chat Baru'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputPesan.trim() || isLoading) return

    // Tutup sidebar di mobile saat mengirim pesan
    if (isMobile) {
      setIsSidebarOpen(false)
    }

    setIsLoading(true)
    // Gunakan activeChat yang sudah dideklarasikan sebelumnya

    const userMessage = {
      id: Date.now(),
      pengirim: 'pengguna',
      teks: inputPesan,
    }

    // Update pesan di chat yang aktif
    setChatList(prevList =>
      prevList.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    )

    setInputPesan('')
    if (isMobile) setIsSidebarOpen(false)

    // Generate title for new chat
    if (activeChat?.isNewChat) {
      const newTitle = await generateTitleFromMessage(inputPesan)
      updateChatTitle(activeChatId, newTitle)
      setChatList(prevList =>
        prevList.map(chat =>
          chat.id === activeChatId ? { ...chat, isNewChat: false } : chat
        )
      )
    }

    setIsLoading(true)
    try {
      const context = activeChat?.messages.map(msg => ({
        role: msg.pengirim === 'pengguna' ? 'user' : 'model',
        content: msg.teks
      })) || []

      const aiResponse = await AIService.sendMessage(inputPesan, context)
      
      const aiMessage = {
        id: Date.now(),
        pengirim: 'ai',
        teks: aiResponse,
      }
      
      // Update pesan dan lastMessage di chat yang aktif
      setChatList(prevList =>
        prevList.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
                lastMessage: aiResponse
              }
            : chat
        )
      )
    } catch (error) {
      console.error('Error saat berkomunikasi dengan AI:', error)
      const errorMessage = {
        id: Date.now(),
        pengirim: 'ai',
        teks: 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.',
      }
      setChatList(prevList =>
        prevList.map(chat =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId)
    // Tutup sidebar di mobile saat memilih chat
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  // Fungsi untuk handle pull-to-refresh
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = async (e) => {
    const currentY = e.touches[0].clientY
    const pull = currentY - startY

    if (pull > 150 && !isRefreshing && window.scrollY === 0) { // Hanya refresh jika ditarik ke bawah >150px dan di posisi atas
      setIsRefreshing(true)
      
      // Reload halaman
      try {
        window.location.reload()
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 flex bg-white dark:bg-gray-900">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 touch-none"
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? 'fixed inset-y-0 left-0 z-30'
            : 'relative'
        } flex-shrink-0 ${
          isSidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200 dark:border-gray-700`}
      >
        <Sidebar
          chatList={chatList}
          onNewChat={handleNewChat}
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
          activeChatId={activeChatId}
          setActiveChatId={handleChatSelect}
          onUpdateTitle={updateChatTitle}
          onDeleteChat={handleDeleteChat}
          onClearHistory={clearChatHistory}
          onOpenSettings={toggleSettings}
          settings={settings}
        />
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-white text-purple-600 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarOpen ? "M4 6h16M4 12h16M4 18h16" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
              />
            </svg>
          </button>
          <div className="ml-4 text-gray-900 dark:text-white font-medium">Chat AI Assistant</div>
        </div>

        <ChatArea
          pesan={activeChat?.messages || []}
          inputPesan={inputPesan}
          setInputPesan={setInputPesan}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>

      {/* Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={setSettings}
        onClose={toggleSettings}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
        onConfirm={() => {
          handleConfirmDelete(deleteConfirmation.chatId)
          setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })
        }}
      />
    </div>
  )
}

export default App
