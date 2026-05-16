import axiosInstance from '@/utils/axiosInstance'

/**
 * Chat API Service
 * Handles chat groups and messages for authenticated users
 */

export const chatService = {
  /**
   * Get all chat groups for authenticated user
   */
  getGroups: async (type?: string) => {
    const res = await axiosInstance.get('conversations/groups', {
      params: type ? { type } : {}
    })
    return res.data
  },

  /**
   * Get messages from a specific chat group
   */
  getMessages: async (groupId: string, params?: { page?: number; limit?: number }) => {
    const res = await axiosInstance.get(`chat/groups/${groupId}/messages`, { params })
    return res.data
  },

  /**
   * Get members of a specific chat group
   */
  getMembers: async (groupId: string) => {
    const res = await axiosInstance.get(`chat/groups/${groupId}/members`)
    return res.data
  },

  /**
   * Create a new chat group
   */
  createGroup: async (data: { type: string; memberIds: string[] }) => {
    const res = await axiosInstance.post('conversations/groups', data)
    return res.data
  },

  /**
   * Send a message to a chat group
   */
  sendMessage: async (
    groupId: string,
    data: { content: string; userId: string; type: string; guestName: string; senderType: string }
  ) => {
    const res = await axiosInstance.post(`chat/groups/${groupId}/messages`, { ...data })
    return res.data
  },
  getTotalUnreadCount: async (): Promise<number> => {
    try {
      const res = await axiosInstance.get('conversations/groups')
      const groups = res.data?.data || []

      // Duyệt qua tất cả các nhóm và cộng dồn thuộc tính unreadCount
      const totalUnread = groups.reduce((total: number, group: any) => {
        return total + (group.unreadCount || 0)
      }, 0)

      return totalUnread
    } catch (error) {
      console.error('Error calculating total unread chat count:', error)
      return 0
    }
  }
}
