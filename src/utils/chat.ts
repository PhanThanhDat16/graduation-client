import { formatTime } from './date'
import type { ChatGroup, MessageResponse } from '@/types/chat'

// Helper function to convert ChatGroup to Conversation
export const convertChatGroupToConversation = (group: ChatGroup, currentUserId?: string) => {
  const otherMember = group.memberIds.find((m) => m !== currentUserId) || group.memberIds[0]
  return {
    id: group._id,
    user: {
      name: otherMember?.name || group.name || 'Unknown',
      avatar: otherMember?.avatar || '',
      isOnline: false
    },
    lastMessage: group.lastMessage || '',
    time: group.lastMessageAt ? formatTime(group.lastMessageAt) : '',
    unread: group.unreadCount || 0
  }
}

// Helper function to convert ChatMessage to Message
export const convertChatMessageToMessage = (msg: MessageResponse, currentUserId?: string) => {
  return {
    id: msg._id,
    sender: msg.senderName,
    text: msg.content,
    time: new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    isMe: msg.senderId?._id === currentUserId
  }
}
