import axiosInstance from '@/utils/axiosInstance'

/**
 * Chat API Service
 * Handles chat groups and messages for authenticated users
 */

export interface ChatGroup {
  _id: string
  memberIds: string[]
  ownerId: string | null
  type: string
  disputeId: string | null
  assignedStaffId: string | null
  lastMessage: string
  lastMessageAt: string | null
  lastSenderId: {
    _id: string
    full_name: string
    avatar: string
  } | null
  createdAt: string
  unreadCount: number
}

export interface ChatMessage {
  _id: string
  groupId: string
  senderId: {
    _id: string
    full_name: string
    avatar: string
  } | null
  type: string
  content: string
  replyTo: any
  createdAt: string
}

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
  getMessages: async (groupId: string) => {
    const res = await axiosInstance.get(`chat/groups/${groupId}/messages`)
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
  sendMessage: async (groupId: string, data: { content: string; userId: string; type?: string }) => {
    const res = await axiosInstance.post(`chat/groups//${groupId}/messages`, data)
    return res.data
  }
}
