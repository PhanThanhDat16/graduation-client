import axiosInstance from '@/utils/axiosInstance'

/**
 * Chat API Service
 * Handles chat groups and messages for authenticated users
 */

export interface ChatGroup {
  _id: string
  name?: string
  type: string
  members: Array<{
    user_id: string
    name: string
    avatar?: string
    role?: string
  }>
  lastMessage?: string
  lastMessageTime?: string
  unread?: number
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  _id: string
  groupId: string
  senderId: string
  senderType: 'user' | 'guest'
  senderName: string
  type: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface ListGroupsResponse {
  message: string
  data: ChatGroup[]
}

export interface GetMessagesResponse {
  message: string
  data: ChatMessage[]
}

export interface GetMembersResponse {
  message: string
  data: Array<{
    user_id: string
    name: string
    avatar?: string
    role?: string
    isOnline?: boolean
  }>
}

export const chatService = {
  /**
   * Get all chat groups for authenticated user
   */
  getGroups: async () => {
    const res = await axiosInstance.get('chat/groups')
    return res.data as ListGroupsResponse
  },

  /**
   * Get messages from a specific chat group
   */
  getMessages: async (groupId: string) => {
    const res = await axiosInstance.get(`chat/groups/${groupId}/messages`)
    return res.data as GetMessagesResponse
  },

  /**
   * Get members of a specific chat group
   */
  getMembers: async (groupId: string) => {
    const res = await axiosInstance.get(`chat/groups/${groupId}/members`)
    return res.data as GetMembersResponse
  },

  /**
   * Create a new chat group
   */
  createGroup: async (data: { name: string; members: string[] }) => {
    const res = await axiosInstance.post('chat/groups', data)
    return res.data
  }
}
