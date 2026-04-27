import type { ChatGroup, ChatMessage } from '@/apis/chatService'
import { formatTime } from './date'

// Helper function to convert ChatGroup to Conversation
export const convertChatGroupToConversation = (group: ChatGroup, currentUserId?: string) => {
  const otherMember = group.members.find((m) => m.user_id !== currentUserId) || group.members[0]
  return {
    id: group._id,
    user: {
      name: otherMember?.name || group.name || 'Unknown',
      avatar: otherMember?.avatar || '',
      isOnline: false
    },
    lastMessage: group.lastMessage || '',
    time: group.lastMessageTime ? formatTime(group.lastMessageTime) : '',
    unread: group.unread || 0
  }
}

// Helper function to convert ChatMessage to Message
export const convertChatMessageToMessage = (msg: ChatMessage, currentUserId?: string) => {
  return {
    id: msg._id,
    sender: msg.senderName,
    text: msg.content,
    time: new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    isMe: msg.senderId === currentUserId
  }
}
