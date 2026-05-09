import axios from 'axios'
import axiosInstance from '@/utils/axiosInstance'

const AI_BASE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000'

/**
 * AI Chat API Service
 * Handles communication with the Python AI service
 */
export const aiService = {
  /**
   * Send a message to the AI assistant and get a response.
   * This calls the Python FastAPI AI service directly.
   */
  sendMessage: async (data: {
    message: string
    groupId: string
    userId: string
    userType: string
  }): Promise<{ message: string; group_id: string; user_type: string }> => {
    const res = await axios.post(
      `${AI_BASE_URL}/api/chat`,
      {
        message: data.message,
        group_id: data.groupId,
        user_id: data.userId,
        user_type: data.userType
      },
      { timeout: 60000 } // AI may take longer to respond
    )
    return res.data
  },

  /**
   * Find existing AI chat group for the current user, or return null.
   * Uses the main backend API (Node.js).
   */
  findExistingGroup: async () => {
    const res = await axiosInstance.get('conversations/groups', {
      params: { type: 'ai_chat' }
    })
    const groups = Array.isArray(res.data?.data) ? res.data.data : []
    return groups.length > 0 ? groups[0] : null
  },

  /**
   * Create a new AI chat group via the main backend API (Node.js).
   */
  createGroup: async () => {
    const res = await axiosInstance.post('conversations/groups', {
      type: 'ai_chat',
      memberIds: []
    })
    return res.data?.data
  }
}
