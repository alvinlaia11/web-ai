import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      loading: false,
      error: null,

      // Actions
      setActiveChat: (chatId) => 
        set({ activeChat: chatId }),

      addChat: (chat) => 
        set((state) => ({ 
          chats: [...state.chats, chat],
          activeChat: chat.id 
        })),

      deleteChat: (chatId) =>
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== chatId)
          return {
            chats: newChats,
            activeChat: state.activeChat === chatId ? (newChats.length > 0 ? newChats[0].id : null) : state.activeChat
          }
        }),

      clearAllChats: () =>
        set({
          chats: [],
          activeChat: null
        }),

      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  lastMessage: message.content,
                  updatedAt: new Date().toISOString()
                }
              : chat
          )
        })),

      updateChatTitle: (chatId, title) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { 
              ...chat, 
              title,
              titleKey: null // Hapus titleKey saat judul diubah manual
            } : chat
          )
        })),

      setLoading: (loading) => 
        set({ loading }),

      setError: (error) => 
        set({ error }),

      // Helpers
      getActiveChat: () => {
        const state = get()
        return state.chats.find((chat) => chat.id === state.activeChat)
      },

      createNewChat: (settings = { language: 'id' }) => {
        const newChat = {
          id: Date.now(),
          titleKey: 'newChat',  
          messages: [],
          lastMessage: '',
          isNewChat: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        get().addChat(newChat)
        return newChat
      }
    }),
    {
      name: 'chat-store',
      version: 1,
    }
  )
)

export default useChatStore
