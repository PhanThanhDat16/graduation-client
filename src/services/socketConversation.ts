export const emitJoinConversation = (socket: any, groupId: string) => {
  if (socket) {
    socket.emit('join_conversation', { groupId })
  }
}

export function listenNewConversation(socket: any, fnc: () => void | Promise<void>) {
  if (!socket) return

  const handler = async () => {
    await fnc()
  }

  socket.on('new_conversation', handler)

  // return cleanup
  return () => {
    socket.off('new_conversation', handler)
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
    socket.emit('guest_join_conversation', { groupId })
  }
}

// Listen for new messages in conversation (real-time)
export function listenNewMessage(socket: any, fnc: (message: any) => void) {
  if (!socket) return

  socket.on('new_message', fnc)

  return () => {
    socket.off('new_message', fnc)
  }
}
