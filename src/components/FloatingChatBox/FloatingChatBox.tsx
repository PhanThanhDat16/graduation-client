import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Search, ArrowLeft, Loader } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreSocketIO } from '@/store/useStoreSocketIO'
import { guestConversationService } from '@/apis/guestConversationService'
import { guestConversationSocketService } from '@/services/guestConversationSocket'
import { chatService } from '@/apis/chatService'
import { convertChatGroupToConversation, convertChatMessageToMessage } from '@/utils/chat'
// import { TypingIndicator } from '@/components/TypingIndicator/TypingIndicator'

interface Conversation {
  id: string
  user: {
    name: string
    avatar: string
    isOnline: boolean
  }
  lastMessage: string
  time: string
  unread: number
}

interface Message {
  id: string
  sender: string
  text: string
  time: string
  isMe: boolean
}

export default function FloatingChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeChat, setActiveChat] = useState<Conversation | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [showGuestNameInput, setShowGuestNameInput] = useState(false)
  const [guestGroupId, setGuestGroupId] = useState<string | null>(null)
  const [isLoadingGuestConversation, setIsLoadingGuestConversation] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  const user = useAuthStore((state) => state.user)
  const { socket } = useStoreSocketIO()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize guest conversation on component mount if it exists
  useEffect(() => {
    const { memberId, groupId, guestName: storedGuestName } = guestConversationService.getStoredGuestConversation()

    if (memberId && groupId && !user && socket) {
      // Restore guest conversation
      setIsGuestMode(true)
      setGuestGroupId(groupId)
      if (storedGuestName) {
        setGuestName(storedGuestName)
      }
      // join conversation with shared socket
      guestConversationSocketService.joinConversation(groupId, socket)

      // Listen for new messages
      guestConversationSocketService.onNewMessage(socket, (data) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: data.guest_name || 'Support',
          text: data.text,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isMe: false
        }
        setMessages((prev) => [...prev, newMessage])
      })
    }
  }, [user, socket])

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // When user logs in while in guest mode, merge conversation
  useEffect(() => {
    if (user && isGuestMode && guestGroupId) {
      console.log('[FloatingChatBox] User logged in, merging guest conversation')
      mergeGuestConversation()
    }
  }, [user])

  // Fetch conversations for authenticated user when chat opens
  useEffect(() => {
    if (isOpen && user && !isGuestMode) {
      fetchConversations()
    }
  }, [isOpen, user, isGuestMode])

  // Fetch messages when activeChat changes
  useEffect(() => {
    if (activeChat && user) {
      fetchMessages(activeChat.id)
    }
  }, [activeChat, user])

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true)
      const response = await chatService.getGroups()
      const convertedConversations = response.data.map((group) => convertChatGroupToConversation(group, user?._id))
      setConversations(convertedConversations)
    } catch (error) {
      console.error('[FloatingChatBox] Error fetching conversations:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const fetchMessages = async (groupId: string) => {
    try {
      setIsLoadingMessages(true)
      const response = await chatService.getMessages(groupId)
      const convertedMessages = response.data.map((msg) => convertChatMessageToMessage(msg, user?._id))
      setMessages(convertedMessages)
    } catch (error) {
      console.error('[FloatingChatBox] Error fetching messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const createGuestConversation = async () => {
    if (!guestName.trim()) return

    setIsLoadingGuestConversation(true)
    try {
      const response = await guestConversationService.createGuestConversation(guestName.trim())
      const { member_id, group_id } = response.data

      // Store in localStorage for persistence (including guest name)
      guestConversationService.storeGuestConversation(member_id, group_id, guestName.trim())

      // Join conversation with shared socket from MainLayout
      if (socket?.connected) {
        guestConversationSocketService.joinConversation(group_id, socket)

        // Listen for new messages
        guestConversationSocketService.onNewMessage(socket, (data) => {
          const newMessage: Message = {
            id: Date.now().toString(),
            sender: data.guest_name || 'Support',
            text: data.text,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isMe: false
          }
          setMessages((prev) => [...prev, newMessage])
        })
      } else {
        console.warn('[FloatingChatBox] Socket not connected, cannot join conversation')
      }

      setGuestGroupId(group_id)
      setIsGuestMode(true)
      setShowGuestNameInput(false)
      setGuestName('')
      setMessages([])
    } catch (error) {
      console.error('[FloatingChatBox] Error creating guest conversation:', error)
      alert('Không thể tạo cuộc trò chuyện. Vui lòng thử lại.')
    } finally {
      setIsLoadingGuestConversation(false)
    }
  }

  const mergeGuestConversation = async () => {
    const { memberId, groupId } = guestConversationService.getStoredGuestConversation()

    if (!memberId || !user) return

    try {
      await guestConversationService.mergeGuestConversation(memberId)
      console.log('[FloatingChatBox] Guest conversation merged successfully')

      // Leave guest conversation room
      if (groupId && socket?.connected) {
        guestConversationSocketService.leaveConversation(groupId, socket)
      }

      // Clear guest conversation from localStorage
      guestConversationService.clearStoredGuestConversation()

      // Switch to authenticated mode
      setIsGuestMode(false)
      setGuestGroupId(null)
      setGuestName('')
    } catch (error) {
      console.error('[FloatingChatBox] Error merging conversation:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return

    // Add message to UI
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: isGuestMode ? guestName : 'Bạn',
      text: messageInput,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }

    setMessages([...messages, newMessage])
    const messageContent = messageInput

    if (isGuestMode && guestGroupId) {
      // Save guest message via API
      try {
        console.log('[FloatingChatBox] Saving guest message:', messageContent)
        await guestConversationService.saveGuestMessage(guestGroupId, guestName, messageContent)
        console.log('[FloatingChatBox] Guest message saved successfully')

        // Also send via socket for real-time updates
        guestConversationSocketService.sendMessage(guestGroupId, messageContent, guestName, socket)
      } catch (error) {
        console.error('[FloatingChatBox] Error saving guest message:', error)
        // Remove message from UI if save fails
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id))
        alert('Không thể gửi tin nhắn. Vui lòng thử lại.')
      }
    }

    setMessageInput('')
  }

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessageInput(value)
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

  // Guest conversation mode
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
              setIsGuestMode(false)
              setGuestGroupId(null)
            }}
            className="p-1 transition-colors rounded-lg hover:bg-indigo-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-900 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isMe ? 'text-indigo-100' : 'text-slate-500'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Guest Login Prompt */}
        {!user && (
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
        )}

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
  if (!user && !isGuestMode) {
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

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-t-2xl">
        <h3 className="font-bold">Tin nhắn</h3>
        <button
          onClick={() => {
            setIsOpen(false)
            setActiveChat(null)
          }}
          className="p-1 transition-colors rounded-lg hover:bg-indigo-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className={`w-full flex flex-col border-r border-slate-200 ${activeChat ? 'hidden' : 'flex'}`}>
          {/* Search */}
          <div className="p-3 border-b border-slate-200 shrink-0">
            <div className="relative">
              <Search className="absolute w-4 h-4 -translate-y-1/2 text-slate-400 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full py-2 pr-3 text-sm rounded-lg outline-none pl-9 bg-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 p-2 space-y-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-5 h-5 text-slate-400 animate-spin" />
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className="flex items-start w-full gap-2 p-2 text-left transition-colors rounded-lg hover:bg-slate-100"
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.user.avatar}
                      alt={chat.user.name}
                      className="object-cover w-10 h-10 border rounded-full border-slate-200"
                    />
                    {chat.user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold truncate text-slate-900">{chat.user.name}</p>
                      <span className="text-[10px] text-slate-400 ml-2">{chat.time}</span>
                    </div>
                    <p className="text-xs truncate text-slate-500">{chat.lastMessage}</p>
                  </div>

                  {chat.unread > 0 && (
                    <div className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 ml-2">
                      {chat.unread}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        {activeChat && (
          <div className="flex flex-col w-full">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
              <button onClick={() => setActiveChat(null)} className="p-1 -ml-2 text-slate-400 hover:text-indigo-600">
                <ArrowLeft className="w-4 h-4" />
              </button>

              <img
                src={activeChat.user.avatar}
                alt={activeChat.user.name}
                className="object-cover w-8 h-8 border rounded-full border-slate-200"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900">{activeChat.user.name}</p>
                <p className="text-xs text-emerald-600">
                  {activeChat.user.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-slate-50">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-5 h-5 text-slate-400 animate-spin" />
                </div>
              ) : messages.length > 0 ? (
                <>
                  {messages.map((msg) => (
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
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <p className="text-sm">Chưa có tin nhắn nào</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 px-3 py-3 bg-white border-t border-slate-200 shrink-0">
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
        )}
      </div>
    </div>
  )
}
