import type { Pagination } from '.'

export interface ChatGroup {
  _id: string
  memberIds: string[]
  ownerId: {
    _id: string
    fullName: string
    avatar: string
  } | null
  type: string
  disputeId?: string | null
  assignedStaffId?: string | null
  lastMessage: string
  lastMessageAt: string | null
  lastSenderId: {
    _id: string
    fullName: string
    avatar: string
  } | null
  createdAt: string
  unreadCount: number
}

export type MessageResponse = {
  _id: string
  groupId: string
  senderId: {
    _id: string
    fullName: string
    avatar: string
  }
  type: 'text' | 'image'
  senderType: string
  senderName: string | null
  content: string
  createdAt: string
}

export type MessageListResponse = {
  data: MessageResponse[]
  pagination: Pagination
}
