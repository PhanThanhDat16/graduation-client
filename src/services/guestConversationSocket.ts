import { Socket } from 'socket.io-client'

/**
 * Guest Conversation Socket Service
 * Uses shared socket connection from MainLayout (useStoreSocketIO)
 * No separate socket connection for guests
 */

export const guestConversationSocketService = {
  /**
   * Join conversation room using shared socket
   */
  joinConversation: (conversationId: string, socket: Socket | null) => {
    if (!socket || !socket.connected) {
      console.warn('[GuestSocket] Socket not available or connected')
      return
    }

    socket.emit('join_conversation', { conversationId })
  },

  /**
   * Leave conversation room
   */
  leaveConversation: (conversationId: string, socket: Socket | null) => {
    if (!socket || !socket.connected) {
      console.warn('[GuestSocket] Socket not available or connected')
      return
    }

    socket.emit('leave_conversation', { conversationId })
  },

  /**
   * Listen for new messages in conversation
   */
  onNewMessage: (socket: Socket | null, callback: (message: any) => void) => {
    if (!socket) {
      console.warn('[GuestSocket] Socket not available')
      return
    }

    socket.on('conversation_message', callback)
  },

  /**
   * Send message to conversation
   */
  sendMessage: (conversationId: string, message: string, guestName: string, socket: Socket | null) => {
    if (!socket || !socket.connected) {
      console.warn('[GuestSocket] Socket not available or connected')
      return
    }

    socket.emit('send_message', {
      conversation_id: conversationId,
      text: message,
      guest_name: guestName
    })
  }
}
