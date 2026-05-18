import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, ChevronDown, User, Settings, LogOut, Shield, MessageSquare, ArrowLeft } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/store/useAuthStore'
import { useWalletStore } from '@/store/useWalletStore'
import { useStoreSocketIO } from '@/store/useStoreSocketIO'
import { listenNewMessage } from '@/services/socketConversation'

import NotificationDropdown from '../Header/NotificationDropdown'

export default function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user, logOut } = useAuthStore()
  const { balance, fetchBalance } = useWalletStore()
  const { socket } = useStoreSocketIO()
  const queryClient = useQueryClient()

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  // Click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // // 1. Fetch TỔNG số lượng TIN NHẮN chưa đọc
  // const { data: chatUnreadCount = 0 } = useQuery({
  //   queryKey: ['chat-total-unread-count'],
  //   queryFn: () => chatService.getTotalUnreadCount(),
  //   // Tự động load lại mỗi 1 phút (60000ms) để sync data
  //   refetchInterval: 60000
  // })

  // 2. Lắng nghe socket để cập nhật số tin nhắn realtime
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (data: any) => {
      // Chỉ tăng đếm (gọi lại API) nếu người gửi KHÔNG phải là mình
      const msgSenderId = typeof data.senderId === 'object' ? data.senderId?._id : data.senderId
      if (user && msgSenderId !== user._id) {
        // Có tin nhắn mới từ người khác -> F5 lại cục đếm chưa đọc
        queryClient.invalidateQueries({ queryKey: ['chat-total-unread-count'] })
      }
    }

    listenNewMessage(socket, handleNewMessage)
  }, [socket, user, queryClient])

  return (
    <header className="print:hidden sticky top-0 z-50 w-full bg-white border-b border-slate-200 h-16 flex items-center">
      {/* 🌟 KHỐI 1: CHỨA LOGO 🌟 */}
      <div className="w-auto md:w-64 h-full flex items-center px-4 md:px-5 md:border-r border-slate-200 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-indigo-600 shadow-sm">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading text-xl font-extrabold text-slate-900 hidden sm:block tracking-tight">
            Free<span className="text-indigo-600">Work</span>
          </span>
        </Link>
      </div>

      {/* 🌟 KHỐI 2: CHỨA ACTIONS 🌟 */}
      <div className="flex-1 h-full px-4 md:px-8 flex items-center justify-between">
        {/* Nút quay lại */}
        <div>
          <Link
            to="/projects"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Chợ dự án
          </Link>
        </div>

        {/* Các nút Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* NÚT TIN NHẮN (MESSAGE) */}
          <Link
            to="/messages"
            title="Tin nhắn"
            className="relative w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />

            {/* Chấm đỏ đếm số tin nhắn hoạt động dựa trên logic tính tổng
            {chatUnreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in">
                {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
              </span>
            )} */}
          </Link>

          {/* NÚT THÔNG BÁO (BELL) - Component tự xử lý UI bên trong */}
          <NotificationDropdown />

          {/* NÚT VÍ TIỀN */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 mx-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-sm">
            <Wallet className="w-4 h-4" /> {balance.toLocaleString('vi-VN')} ₫
          </div>

          {/* DROPDOWN AVATAR */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.fullName || 'NV'}&background=4f46e5&color=fff`
                }
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 mb-1 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName || 'Người dùng'}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role || 'Khách hàng'}</p>
                </div>
                <Link
                  to={`/profile/${user?._id}`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                >
                  <User className="w-4 h-4" /> Hồ sơ cá nhân
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                >
                  <Settings className="w-4 h-4" /> Cài đặt
                </Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <button
                  onClick={() => {
                    logOut()
                    setIsDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
