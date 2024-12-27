// Konfigurasi API Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = 'https://generativelanguage.googleapis.com/v1beta'

/**
 * Kelas untuk mengelola interaksi dengan Gemini API
 */
class AIService {
  constructor() {
    this.apiKey = API_KEY
  }

  /**
   * Mengirim pesan ke Gemini dan mendapatkan respons
   * @param {string} message - Pesan dari pengguna
   * @param {Array} context - Konteks percakapan sebelumnya
   * @returns {Promise} - Promise yang mengandung respons AI
   */
  async sendMessage(message, context = []) {
    try {
      // Format konteks untuk Gemini
      const formattedContext = context.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))

      const response = await fetch(`${API_URL}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            ...formattedContext,
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini')
      }

      const candidate = data.candidates[0]
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('Invalid response format from Gemini')
      }

      return candidate.content.parts[0].text
    } catch (error) {
      console.error('Error in Gemini Service:', error)
      throw error
    }
  }

  /**
   * Mengirim pesan dengan streaming (real-time response)
   * @param {string} message - Pesan dari pengguna
   * @param {Array} context - Konteks percakapan sebelumnya
   * @param {Function} onChunk - Callback untuk setiap chunk response
   */
  async sendMessageStream(message, context = [], onChunk) {
    try {
      const formattedContext = context.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))

      const response = await fetch(`${API_URL}/models/gemini-pro:streamGenerateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            ...formattedContext,
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                onChunk(data.candidates[0].content.parts[0].text)
              }
            } catch (e) {
              console.warn('Error parsing streaming response:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in Gemini Streaming Service:', error)
      throw error
    }
  }

  /**
   * Menganalisis gambar menggunakan Gemini Vision
   * @param {string} image - Base64 encoded image
   * @param {string} prompt - Prompt untuk analisis gambar
   * @returns {Promise} - Promise yang mengandung respons AI
   */
  async analyzeImage(image, prompt) {
    try {
      const response = await fetch(`${API_URL}/models/gemini-pro-vision:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1000,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini Vision API Error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Error in Gemini Vision Service:', error)
      throw error
    }
  }
}

export default new AIService()
