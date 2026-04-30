import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search,
  Send,
  CheckCheck,
  ArrowLeft,
  MessageSquare,
  Plus,
  Loader,
  HeadphonesIcon,
  FileText
} from 'lucide-react'
import { chatService } from '@/apis/chatService'
import type { ChatGroup, ChatMessage } from '@/apis/chatService'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreSocketIO } from '@/store/useStoreSocketIO'
import { emitJoinConversation, listenNewConversation, listenNewMessage } from '@/services/socketConversation'
import dayjs from 'dayjs'

type TabType = 'user_support' | 'contract_chat'

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('user_support')
  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const user = useAuthStore((state) => state.user)
  const { socket } = useStoreSocketIO()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch groups for current tab (silent = no loading spinner)
  const fetchGroups = useCallback(
    async (silent = false) => {
      if (!silent) setLoadingGroups(true)
      try {
        const res = await chatService.getGroups(activeTab)
        const data = Array.isArray(res.data) ? res.data : []
        data.map((group: any) => {
          emitJoinConversation(socket, group._id)
        })
        setGroups(data)
      } catch (error) {
        console.error('[MessagesPage] Error fetching groups:', error)
        if (!silent) setGroups([])
      } finally {
        if (!silent) setLoadingGroups(false)
      }
    },
    [activeTab]
  )

  // Fetch messages for active group
  const fetchMessages = useCallback(async (groupId: string) => {
    setLoadingMessages(true)
    try {
      const res = await chatService.getMessages(groupId)
      const data = Array.isArray(res.data) ? res.data : []
      setMessages(data)
    } catch (error) {
      console.error('[MessagesPage] Error fetching messages:', error)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  // Listen for new conversations
  useEffect(() => {
    if (!socket) return
    const cleanup = listenNewConversation(socket, fetchGroups)
    return () => {
      cleanup && cleanup()
    }
  }, [socket])

  // Join room + listen for new messages when active group changes
  useEffect(() => {
    if (!socket || !activeGroup) return

    const groupId = activeGroup._id

    // Join the conversation room
    emitJoinConversation(socket, groupId)

    // Listen for new messages (direct socket.on pattern — matching admin)
    const handleNewMessage = (data: any) => {
      // Skip own messages (already added optimistically)
      const msgSenderId = typeof data.senderId === 'object' ? data.senderId?._id : data.senderId
      if (user && msgSenderId === user._id) return

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === data._id)
        if (exists) return prev
        return [...prev, data]
      })
    }

    listenNewMessage(socket, handleNewMessage)
  }, [socket, activeGroup?._id, user])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle selecting a group
  const handleSelectGroup = async (group: ChatGroup) => {
    setActiveGroup(group)
    await fetchMessages(group._id)
  }

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setActiveGroup(null)
    setMessages([])
  }

  // Create user_support group with default message
  const handleCreateSupportGroup = async () => {
    if (!user || creatingGroup) return

    setCreatingGroup(true)
    try {
      const res = await chatService.createGroup({
        type: 'user_support',
        memberIds: []
      })

      const newGroup = res.data

      // Send default message
      if (newGroup?._id) {
        await chatService.sendMessage(newGroup._id, {
          content: 'tôi cần hỗ trợ',
          userId: user._id,
          type: 'text'
        })

        // Join room when created (to receive the new_message event for the default message)
        if (socket) {
          emitJoinConversation(socket, newGroup._id)
        }
      }

      // Refresh groups and select the new one
      await fetchGroups()
      if (newGroup) {
        setActiveGroup(newGroup)
        await fetchMessages(newGroup._id)
      }
    } catch (error) {
      console.error('[MessagesPage] Error creating support group:', error)
    } finally {
      setCreatingGroup(false)
    }
  }

  // Send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeGroup || !user || sendingMessage) return

    const content = messageInput.trim()
    setSendingMessage(true)
    setMessageInput('')

    // Optimistic add
    const optimisticMsg: ChatMessage = {
      _id: Date.now().toString(),
      groupId: activeGroup._id,
      senderId: { _id: user._id, full_name: user.full_name || '', avatar: user.avatar || '' },
      type: 'text',
      content,
      replyTo: null,
      createdAt: new Date().toISOString()
    }
    setMessages((prev) => [...prev, optimisticMsg])

    try {
      const res = await chatService.sendMessage(activeGroup._id, {
        content,
        userId: user._id,
        type: 'text'
      })

      // Update optimistic message ID with real _id
      const savedMsg = res.data
      if (savedMsg?._id) {
        setMessages((prev) => prev.map((m) => (m._id === optimisticMsg._id ? { ...m, _id: savedMsg._id } : m)))
      }

      // Refresh group list silently to update lastMessage order
      fetchGroups(true)
    } catch (error) {
      console.error('[MessagesPage] Error sending message:', error)
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m._id !== optimisticMsg._id))
      setMessageInput(content)
    } finally {
      setSendingMessage(false)
    }
  }

  // Check if user_support groups exist (to show/hide + button)
  const hasUserSupportGroup = activeTab === 'user_support' && groups.length > 0

  // Filter groups by search
  const filteredGroups = groups.filter((g) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (g.lastMessage || '').toLowerCase().includes(query) || g._id.toLowerCase().includes(query)
  })

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl md:flex-row">
        {/* ==========================================
            CỘT TRÁI: DANH SÁCH HỘI THOẠI
        ========================================== */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 ${activeGroup ? 'hidden md:flex' : 'flex'}`}
        >
          {/* Tab Selector */}
          <div className="p-3 bg-white border-b border-slate-200 shrink-0">
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => handleTabChange('user_support')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'user_support'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <HeadphonesIcon className="w-3.5 h-3.5" />
                Hỗ trợ
              </button>
              <button
                onClick={() => handleTabChange('contract_chat')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'contract_chat'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Hợp đồng
              </button>
            </div>
          </div>

          {/* Search + Create */}
          <div className="p-4 bg-white border-b border-slate-200 shrink-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute w-4 h-4 -translate-y-1/2 text-slate-400 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                />
              </div>
              {activeTab === 'user_support' && !hasUserSupportGroup && (
                <button
                  onClick={handleCreateSupportGroup}
                  disabled={creatingGroup}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-slate-300 shrink-0"
                  title="Tạo cuộc hỗ trợ mới"
                >
                  {creatingGroup ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* List Groups */}
          <div className="flex-1 p-2 space-y-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
            {loadingGroups ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 text-slate-400 animate-spin" />
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100">
                  <MessageSquare className="w-7 h-7 text-slate-300" />
                </div>
                <p className="mb-1 text-sm text-slate-500">Chưa có cuộc trò chuyện nào</p>
                {activeTab === 'user_support' && (
                  <p className="text-xs text-slate-400">Nhấn nút + để tạo yêu cầu hỗ trợ</p>
                )}
              </div>
            ) : (
              filteredGroups.map((group) => (
                <button
                  key={group._id}
                  onClick={() => handleSelectGroup(group)}
                  className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                    activeGroup?._id === group._id
                      ? 'bg-indigo-50 border border-indigo-100'
                      : 'hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative mt-1 shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        group.type === 'contract_chat' ? 'bg-amber-100' : 'bg-indigo-100'
                      }`}
                    >
                      {group.type === 'contract_chat' ? (
                        <FileText className="w-5 h-5 text-amber-600" />
                      ) : (
                        <HeadphonesIcon className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3
                        className={`text-sm truncate pr-2 ${
                          group.unreadCount > 0 ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'
                        }`}
                      >
                        {group.type === 'contract_chat' ? `Hợp đồng #${group._id.slice(-6)}` : 'Hỗ trợ khách hàng'}
                      </h3>
                      <span
                        className={`text-[10px] shrink-0 ${
                          group.unreadCount > 0 ? 'font-bold text-indigo-600' : 'text-slate-400'
                        }`}
                      >
                        {group.lastMessageAt ? dayjs(group.lastMessageAt).format('HH:mm') : ''}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        group.unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-500'
                      }`}
                    >
                      {group.lastMessage || 'Chưa có tin nhắn'}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {group.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-2">
                      {group.unreadCount}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* ==========================================
            CỘT PHẢI: KHUNG CHAT CHI TIẾT
        ========================================== */}
        {activeGroup ? (
          <div className={`flex-1 flex flex-col bg-white min-w-0 ${!activeGroup ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="z-10 flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm border-slate-200 shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveGroup(null)}
                  className="p-2 -ml-2 md:hidden text-slate-400 hover:text-indigo-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    activeGroup.type === 'contract_chat' ? 'bg-amber-100' : 'bg-indigo-100'
                  }`}
                >
                  {activeGroup.type === 'contract_chat' ? (
                    <FileText className="w-5 h-5 text-amber-600" />
                  ) : (
                    <HeadphonesIcon className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {activeGroup.type === 'contract_chat'
                      ? `Hợp đồng #${activeGroup._id.slice(-6)}`
                      : 'Hỗ trợ khách hàng'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeGroup.type === 'contract_chat' ? 'Thảo luận hợp đồng' : 'Yêu cầu hỗ trợ'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/30">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-slate-400">Chưa có tin nhắn nào</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId?._id === user?._id
                  const showDate =
                    idx === 0 ||
                    dayjs(msg.createdAt).format('DD/MM/YYYY') !==
                      dayjs(messages[idx - 1].createdAt).format('DD/MM/YYYY')

                  return (
                    <div key={msg._id || idx}>
                      {showDate && (
                        <div className="mb-4 text-center">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                            {dayjs(msg.createdAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      )}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && (
                          <span className="text-[10px] text-slate-400 mb-1 ml-1">
                            {msg.senderId?.full_name || 'Hỗ trợ'}
                          </span>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className="flex items-center gap-1 px-1 mt-1">
                            <span className="text-[10px] text-slate-400">{dayjs(msg.createdAt).format('HH:mm')}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <div className="flex items-end gap-2 p-2 transition-all border bg-slate-50 border-slate-200 rounded-2xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent border-none text-sm px-3 py-3 outline-none resize-none max-h-32 min-h-[44px]"
                  rows={1}
                />
                <div className="flex items-center gap-2 px-1 pb-1 shrink-0">
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendingMessage}
                    className={`p-2.5 rounded-xl transition-all ${
                      messageInput.trim()
                        ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-col items-center justify-center flex-1 hidden md:flex bg-slate-50/50">
            <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-indigo-50">
              <MessageSquare className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Tin nhắn của bạn</h3>
            <p className="max-w-sm text-center text-slate-500">
              Chọn một cuộc hội thoại ở danh sách bên trái để bắt đầu trao đổi.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
