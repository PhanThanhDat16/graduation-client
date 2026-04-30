import axiosInstance from '@/utils/axiosInstance'

/**
 * Guest Conversation API Service
 * Handles creating and managing guest conversations using chat_groups
 */

export interface CreateGuestConversationResponse {
  message: string
  data: {
    group_id: string
    member_id: string
    guest_name: string
    created_at: string
  }
}

export interface ConversationResponse {
  message: string
  data: {
    group_id: string
    member_id: string | null
    owner_id: string | null
    guest_name: string | null
    created_at: string
  }
}

export interface SaveMessageResponse {
  message: string
  data: {
    _id: string
    groupId: string
    senderId: string | null
    senderType: 'user' | 'guest'
    senderName: string | null
    type: string
    content: string
    createdAt: string
  }
}

export const guestConversationService = {
  /**
   * Create a new guest conversation (creates chat_group with type='guest_support')
   */
  createGuestConversation: async (guestName: string) => {
    const res = await axiosInstance.post('conversations/guest', {
      guestName: guestName
    })
    return res.data
  },

  /**
   * Get conversation by member_id (for guest conversations)
   */
  getConversationByMemberId: async (memberId: string) => {
    const res = await axiosInstance.get('conversations/guest', {
      params: { memberId: memberId }
    })
    return res.data
  },

  /**
   * Get conversation (chat_group) by ID
   */
  getConversation: async (groupId: string) => {
    const res = await axiosInstance.get(`conversations/${groupId}`)
    return res.data
  },

  /**
   * Merge guest conversation to user account (called after login)
   */
  mergeGuestConversation: async (guestUserId: string) => {
    const res = await axiosInstance.post('conversations/merge', {
      guestUserId: guestUserId
    })
    return res.data
  },

  /**
   * Save guest message to conversation
   */
  saveGuestMessage: async (groupId: string, guestName: string, content: string) => {
    const memberId = localStorage.getItem('memberId')
    const res = await axiosInstance.post(`chat/groups/${groupId}/messages`, {
      guestName: guestName,
      content: content,
      type: 'text',
      ...(memberId ? { userId: memberId } : {})
    })
    return res.data
  },

  /**
   * Get messages for guest conversation (no auth required)
   */
  getMessages: async (groupId: string) => {
    const res = await axiosInstance.get(`chat/groups/${groupId}/messages/guest`)
    return res.data
  },

  /**
   * Store guest conversation IDs and name in localStorage
   */
  storeGuestConversation: (memberId: string, groupId: string, guestName: string): void => {
    localStorage.setItem('memberId', memberId)
    localStorage.setItem('groupId', groupId)
    localStorage.setItem('guestName', guestName)
  },

  /**
   * Retrieve guest conversation IDs and name from localStorage
   */
  getStoredGuestConversation: (): { memberId: string | null; groupId: string | null; guestName: string | null } => {
    return {
      memberId: localStorage.getItem('memberId'),
      groupId: localStorage.getItem('groupId'),
      guestName: localStorage.getItem('guestName')
    }
  },

  /**
   * Clear stored guest conversation IDs and name
   */
  clearStoredGuestConversation: (): void => {
    localStorage.removeItem('memberId')
    localStorage.removeItem('groupId')
    localStorage.removeItem('guestName')
  }
}
