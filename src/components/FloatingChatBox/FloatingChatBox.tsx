import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Send, Loader } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreSocketIO } from '@/store/useStoreSocketIO'
import { guestConversationService } from '@/apis/guestConversationService'
import { emitGuestJoinConversation, listenNewMessage } from '@/services/socketConversation'

interface Message {
  id: string
  sender: string
  text: string
  time: string
  isMe: boolean
}

export default function FloatingChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [showGuestNameInput, setShowGuestNameInput] = useState(false)
  const [guestGroupId, setGuestGroupId] = useState<string | null>(null)
  const [isLoadingGuestConversation, setIsLoadingGuestConversation] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  const user = useAuthStore((state) => state.user)
  const { socket } = useStoreSocketIO()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const cleanupNewMessageRef = useRef<(() => void) | undefined>(undefined)

  // Helper: fetch messages for a guest group
  const fetchGuestMessages = useCallback(async (groupId: string) => {
    try {
      setIsLoadingMessages(true)
      const response = await guestConversationService.getMessages(groupId)
      const convertedMessages: Message[] = (response.data || []).map((msg: any) => ({
        id: msg._id,
        sender: msg.senderId?.full_name || 'Hỗ trợ',
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isMe: false // Guest messages — we'll determine isMe by comparing senderId with stored memberId
      }))

      // Mark messages from guest as "isMe"
      const { memberId } = guestConversationService.getStoredGuestConversation()
      if (memberId) {
        convertedMessages.forEach((msg: Message, idx: number) => {
          const rawMsg = (response.data || [])[idx]
          if (rawMsg?.senderId?._id === memberId) {
            msg.isMe = true
          }
        })
      }

      // API now returns oldest first, correct order for display
      setMessages(convertedMessages)
    } catch (error) {
      console.error('[FloatingChatBox] Error fetching guest messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  // Setup new_message listener
  const setupNewMessageListener = useCallback(
    (groupId: string) => {
      if (!socket) return

      // Cleanup previous listener
      if (cleanupNewMessageRef.current) {
        cleanupNewMessageRef.current()
      }

      const { memberId } = guestConversationService.getStoredGuestConversation()

      cleanupNewMessageRef.current = listenNewMessage(socket, (data: any) => {
        // Only process messages for this group
        if (data.groupId !== groupId) return

        // Skip own messages — already handled via optimistic update + API response
        const senderIdStr = data.senderId?._id || data.senderId
        if (memberId && senderIdStr === memberId) return

        const newMessage: Message = {
          id: data._id || Date.now().toString(),
          sender: data.senderId?.full_name || 'Hỗ trợ',
          text: data.content,
          time: new Date(data.createdAt || Date.now()).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          isMe: false
        }

        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m.id === newMessage.id)) return prev
          return [...prev, newMessage]
        })
      })
    },
    [socket]
  )

  // Initialize guest conversation on component mount if it exists in localStorage
  useEffect(() => {
    const { memberId, groupId, guestName: storedGuestName } = guestConversationService.getStoredGuestConversation()

    if (memberId && groupId && !user && socket) {
      setIsGuestMode(true)
      setGuestGroupId(groupId)
      if (storedGuestName) {
        setGuestName(storedGuestName)
      }

      // Join conversation room
      emitGuestJoinConversation(socket, groupId)

      // Fetch existing messages
      fetchGuestMessages(groupId)

      // Listen for new messages
      setupNewMessageListener(groupId)
    }
  }, [user, socket, fetchGuestMessages, setupNewMessageListener])

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (cleanupNewMessageRef.current) {
        cleanupNewMessageRef.current()
      }
    }
  }, [])

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // When user logs in, merge guest conversation if exists
  useEffect(() => {
    if (!user) return

    // Check both in-memory state and localStorage for pending guest conversation
    const { memberId } = guestConversationService.getStoredGuestConversation()
    if (memberId) {
      console.log('[FloatingChatBox] User logged in, merging guest conversation')
      mergeGuestConversation()
    }
  }, [user])

  const createGuestConversation = async () => {
    if (!guestName.trim()) return

    setIsLoadingGuestConversation(true)
    try {
      const response = await guestConversationService.createGuestConversation(guestName.trim())
      const { user_id, group_id } = response.data

      // Store in localStorage for persistence (including guest name)
      guestConversationService.storeGuestConversation(user_id, group_id, guestName.trim())

      // Join conversation room + notify staff via socket
      if (socket?.connected) {
        emitGuestJoinConversation(socket, group_id)

        // Setup new message listener
        setupNewMessageListener(group_id)
      } else {
        console.warn('[FloatingChatBox] Socket not connected, cannot join conversation')
      }

      setGuestGroupId(group_id)
      setIsGuestMode(true)
      setShowGuestNameInput(false)

      // Fetch messages (including the default "tôi cần hỗ trợ" message)
      await fetchGuestMessages(group_id)
    } catch (error) {
      console.error('[FloatingChatBox] Error creating guest conversation:', error)
      alert('Không thể tạo cuộc trò chuyện. Vui lòng thử lại.')
    } finally {
      setIsLoadingGuestConversation(false)
    }
  }

  const mergeGuestConversation = async () => {
    const { memberId } = guestConversationService.getStoredGuestConversation()

    if (!memberId || !user) return

    try {
      await guestConversationService.mergeGuestConversation(memberId)
      console.log('[FloatingChatBox] Guest conversation merged successfully')

      // Cleanup listener
      if (cleanupNewMessageRef.current) {
        cleanupNewMessageRef.current()
        cleanupNewMessageRef.current = undefined
      }

      // Clear guest conversation from localStorage
      guestConversationService.clearStoredGuestConversation()

      // Switch to authenticated mode (component will hide since user is logged in)
      setIsGuestMode(false)
      setGuestGroupId(null)
      setGuestName('')
    } catch (error) {
      console.error('[FloatingChatBox] Error merging conversation:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return

    // Add message to UI optimistically
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: guestName,
      text: messageInput,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }

    setMessages((prev) => [...prev, newMessage])
    const messageContent = messageInput
    setMessageInput('')

    if (isGuestMode && guestGroupId) {
      try {
        const response = await guestConversationService.saveGuestMessage(guestGroupId, guestName, messageContent)
        // Update optimistic message ID with real _id from server
        // so socket dedup check will catch the duplicate
        const savedMsg = response.data
        if (savedMsg?._id) {
          setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, id: savedMsg._id } : msg)))
        }
      } catch (error) {
        console.error('[FloatingChatBox] Error saving guest message:', error)
        // Remove message from UI if save fails
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id))
        alert('Không thể gửi tin nhắn. Vui lòng thử lại.')
      }
    }
  }

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)
  }

  // Hide FloatingChatBox when user is logged in
  if (user) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-40 flex items-center justify-center text-white transition-colors duration-200 bg-indigo-600 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 hover:bg-indigo-700 hover:scale-110"
        title="Mở chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  // Guest conversation mode — active chat
  if (isGuestMode && guestGroupId) {
    return (
      <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 text-white border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-t-2xl">
          <div>
            <h3 className="font-bold">Chat với hỗ trợ</h3>
            <p className="text-xs text-indigo-100">Khách: {guestName}</p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false)
            }}
            className="p-1 transition-colors rounded-lg hover:bg-indigo-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-slate-50">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.isMe
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-200 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isMe ? 'text-indigo-100' : 'text-slate-500'}`}>{msg.time}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Guest Login Prompt */}
        <div className="px-3 py-2 text-xs text-center text-blue-700 border-t border-blue-200 bg-blue-50">
          <p className="mb-2">Đăng nhập để tiếp tục cuộc trò chuyện của bạn</p>
          <button
            onClick={() => {
              window.location.href = '/login'
            }}
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            Đăng nhập ngay
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2 px-3 py-3 bg-white border-t border-slate-200 shrink-0 rounded-b-2xl">
          <input
            type="text"
            placeholder="Nhắn tin..."
            value={messageInput}
            onChange={handleMessageInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage()
              }
            }}
            className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Show guest name input
  if (showGuestNameInput) {
    return (
      <div className="fixed z-50 h-auto p-6 bg-white border shadow-2xl bottom-6 right-6 w-96 rounded-2xl border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Bắt đầu cuộc trò chuyện</h3>
          <button
            onClick={() => {
              setShowGuestNameInput(false)
              setIsOpen(false)
            }}
            className="p-1 transition-colors rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Tên của bạn</label>
            <input
              type="text"
              placeholder="Nhập tên của bạn..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createGuestConversation()
                }
              }}
              className="w-full px-3 py-2 text-sm border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoadingGuestConversation}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowGuestNameInput(false)
                setIsOpen(false)
              }}
              className="flex-1 px-4 py-2 font-medium transition-colors border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
              disabled={isLoadingGuestConversation}
            >
              Hủy
            </button>
            <button
              onClick={createGuestConversation}
              disabled={!guestName.trim() || isLoadingGuestConversation}
              className="flex-1 px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isLoadingGuestConversation ? 'Đang tạo...' : 'Bắt đầu'}
            </button>
          </div>

          <p className="text-xs text-center text-slate-500">
            Bạn cũng có thể{' '}
            <a href="/login" className="text-indigo-600 hover:underline">
              đăng nhập
            </a>{' '}
            để sử dụng tất cả tính năng
          </p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated and not in guest mode
  return (
    <div className="fixed z-50 h-auto p-6 bg-white border shadow-2xl bottom-6 right-6 w-96 rounded-2xl border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">Tin nhắn</h3>
        <button onClick={() => setIsOpen(false)} className="p-1 transition-colors rounded-lg hover:bg-slate-100">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="space-y-4 text-center">
        <p className="text-sm text-slate-600">Chọn một cách để liên hệ với chúng tôi</p>

        <button
          onClick={() => setShowGuestNameInput(true)}
          className="w-full py-2 font-semibold transition-colors rounded-lg bg-slate-100 text-slate-900 hover:bg-slate-200"
        >
          Chat như khách
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">hoặc</span>
          </div>
        </div>

        <button
          onClick={() => {
            window.location.href = '/login'
          }}
          className="w-full py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  )
}
