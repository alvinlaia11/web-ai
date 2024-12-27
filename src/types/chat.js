/**
 * @typedef {Object} Message
 * @property {string} id - ID pesan
 * @property {string} role - Peran pengirim (user/assistant)
 * @property {string} content - Isi pesan
 * @property {string} timestamp - Waktu pengiriman
 */

/**
 * @typedef {Object} Chat
 * @property {string} id - ID chat
 * @property {string} title - Judul chat
 * @property {Array<Message>} messages - Daftar pesan dalam chat
 * @property {string} lastMessage - Pesan terakhir
 * @property {string} createdAt - Waktu pembuatan
 * @property {string} updatedAt - Waktu terakhir diupdate
 */

/**
 * @typedef {Object} AIConfig
 * @property {string} modelId - ID model AI yang digunakan
 * @property {number} temperature - Parameter kreativitas (0-1)
 * @property {number} maxTokens - Maksimum token yang digunakan
 * @property {string} apiKey - API key untuk layanan AI
 */

// Export konstanta untuk role pesan
export const MessageRoles = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
}

// Export konstanta untuk status loading
export const LoadingStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success'
}
