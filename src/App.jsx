import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Settings from './components/Settings'
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

  // Simpan chat ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('chatList', JSON.stringify(chatList))
  }, [chatList])

  // Simpan settings ke localStorage
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
    // Terapkan tema
    document.documentElement.classList.toggle('light', settings.theme === 'light')
    // Terapkan ukuran font
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[settings.fontSize]
  }, [settings])

  // Mendapatkan pesan dari chat yang aktif
  const activeChat = chatList.find(chat => chat.id === activeChatId)
  const pesan = activeChat?.messages || []

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

  const deleteChat = (chatId) => {
    setChatList(prevList => {
      const newList = prevList.filter(chat => chat.id !== chatId)
      // Jika menghapus chat yang aktif, pilih chat pertama atau buat baru
      if (activeChatId === chatId) {
        if (newList.length > 0) {
          setActiveChatId(newList[0].id)
        } else {
          handleNewChat()
        }
      }
      return newList
    })
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
    if (!inputPesan.trim()) return

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
    const currentChat = chatList.find(chat => chat.id === activeChatId)
    if (currentChat?.isNewChat) {
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
      const context = pesan.map(msg => ({
        role: msg.pengirim === 'pengguna' ? 'user' : 'model',
        content: msg.teks
      }))

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  return (
    <div className="fixed inset-0 flex w-full min-h-screen overflow-hidden touch-none">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 touch-none"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`transition-all duration-300 ease-in-out ${
          isMobile
            ? 'fixed inset-y-0 left-0 z-30'
            : 'relative'
        } flex-shrink-0 ${
          isSidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden`}
      >
        <Sidebar
          chatList={chatList}
          onNewChat={handleNewChat}
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onUpdateTitle={updateChatTitle}
          onDeleteChat={deleteChat}
          onClearHistory={clearChatHistory}
          onOpenSettings={toggleSettings}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="h-12 bg-white dark:bg-gray-800/50 backdrop-blur-lg flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                isSidebarOpen && !isMobile ? 'rotate-0' : 'rotate-180'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobile ? "M4 6h16M4 12h16M4 18h16" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
              />
            </svg>
          </button>
          <div className="ml-4 text-gray-900 dark:text-white font-medium">Chat AI Assistant</div>
        </div>

        <ChatArea
          pesan={pesan}
          inputPesan={inputPesan}
          setInputPesan={setInputPesan}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      {isSettingsOpen && (
        <Settings
          isOpen={isSettingsOpen}
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={toggleSettings}
        />
      )}
    </div>
  )
}

export default App
