export const emitJoinConversation = (socket: any, groupId: string) => {
  if (socket) {
    socket.emit('joinConversation', { groupId })
  }
}

export function listenNewConversation(socket: any, fnc: () => void | Promise<void>) {
  if (!socket) return

  const handler = async () => {
    await fnc()
  }

  socket.on('newConversation', handler)

  // return cleanup
  return () => {
    socket.off('newConversation', handler)
  }
}

/**
 * Guest Conversation Socket Service
 * Format follows socket_conversation.ts pattern
 * Uses shared socket connection from MainLayout (useStoreSocketIO)
 */

// Emit guest join conversation (triggers 'new_conversation' event to staff)
export const emitGuestJoinConversation = (socket: any, groupId: string) => {
  if (socket) {
    socket.emit('guestJoinConversation', { groupId })
  }
}

// Listen for new messages in conversation (real-time)
export function listenNewMessage(socket: any, fnc: (message: any) => void) {
  if (!socket) return

  socket.on('newMessage', fnc)

  return () => {
    socket.off('newMessage', fnc)
  }
}
