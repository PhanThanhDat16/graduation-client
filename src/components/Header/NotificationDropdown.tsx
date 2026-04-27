import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck, Trash2, FileSignature, Briefcase, BellRing, Clock } from 'lucide-react'

import { notificationService } from '@/apis/notificationService'
import type { Notification } from '@/types/notification'
import Popover from '@/components/Popover/Popover'

// Hàm helper format thời gian
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Vừa xong'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`
  return date.toLocaleDateString('vi-VN')
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'contract_created':
    case 'contract_signed':
      return <FileSignature className="w-5 h-5 text-indigo-600" />
    case 'project_applied':
      return <Briefcase className="w-5 h-5 text-emerald-600" />
    default:
      return <BellRing className="w-5 h-5 text-blue-600" />
  }
}

export default function NotificationDropdown() {
  const queryClient = useQueryClient()

  // 1. FETCH SỐ LƯỢNG CHƯA ĐỌC
  const { data: unreadData } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 60000
  })
  const unreadCount = unreadData?.data?.data?.unreadCount || 0

  // 2. FETCH DANH SÁCH
  const { data: notifData, isLoading } = useQuery({
    queryKey: ['notifications-list'],
    queryFn: () => notificationService.getNotifications({ limit: 10 })
  })
  const notifications = notifData?.data?.data || []

  // 3. MUTATIONS
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-list'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    }
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-list'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-list'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    }
  })

  const handleNotifClick = (notif: Notification) => {
    if (!notif.is_read) {
      markAsReadMutation.mutate(notif._id)
    }
  }

  // GIAO DIỆN CỦA NỘI DUNG POPOVER (KHUNG DROPDOWN)
  const renderDropdown = (
    <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-900">Thông báo</h3>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Đánh dấu đã đọc
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto overscroll-contain hide-scrollbar">
        {isLoading ? (
          <div className="p-6 text-center text-slate-400 text-sm flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
            Đang tải...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">Bạn không có thông báo nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`group relative p-4 transition-colors hover:bg-slate-50 cursor-pointer flex gap-4 ${!notif.is_read ? 'bg-indigo-50/30' : 'bg-white'}`}
                onClick={() => handleNotifClick(notif)}
              >
                {!notif.is_read && (
                  <span className="absolute top-5 left-2 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                )}
                <div className="shrink-0 mt-0.5">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p
                    className={`text-sm mb-1 line-clamp-2 ${!notif.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}
                  >
                    {notif.title}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">{notif.content}</p>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatTimeAgo(notif.createdAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteMutation.mutate(notif._id)
                  }}
                  className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 text-center bg-white sticky bottom-0">
        <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  )

  return (
    <Popover placement="bottom-end" offsetValue={10} renderPopover={renderDropdown}>
      <button className="relative p-2.5 rounded-full transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer outline-none">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </Popover>
  )
}
