import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Bell,
  CheckCheck,
  Trash2,
  FileSignature,
  Briefcase,
  BellRing,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

import { notificationService } from '@/apis/notificationService'
import type { Notification } from '@/types/notification'
import { toast } from 'react-toastify'

// Hàm format thời gian (Giống trong Header)
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
    case 'contractCreated':
    case 'contractSigned':
      return <FileSignature className="w-5 h-5 text-indigo-600" />
    case 'projectApplied':
      return <Briefcase className="w-5 h-5 text-emerald-600" />
    default:
      return <BellRing className="w-5 h-5 text-blue-600" />
  }
}

export default function NotificationListPage() {
  const queryClient = useQueryClient()

  // States cho Phân trang & Bộ lọc
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // 1. FETCH DANH SÁCH THÔNG BÁO (Có truyền params filter & pagination)
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['notifications', page, limit, filter],
    queryFn: () =>
      notificationService.getNotifications({
        page,
        limit,
        isRead: filter === 'unread' ? false : undefined
      })
  })

  // Bóc tách dữ liệu phân trang từ API trả về
  const notifications = axiosResponse?.data?.data || []
  const totalPages = (axiosResponse?.data as any)?.totalPages || 1

  // 2. MUTATIONS (CÁC HÀNH ĐỘNG CẬP NHẬT)
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    }
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      toast.success('Đã đánh dấu tất cả là đã đọc!')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    }
  })

  const deleteAllMutation = useMutation({
    mutationFn: () => notificationService.deleteAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      toast.success('Đã xoá toàn bộ thông báo!')
    }
  })

  // HANDLERS
  const handleNotifClick = (notif: Notification) => {
    if (!notif.isRead) {
      markAsReadMutation.mutate(notif._id)
    }
    // Ở đây sau này sẽ gọi hàm redirect sang trang tương ứng
    // Ví dụ: if(notif.type === 'contract_created') navigate(...)
  }

  const handleDeleteAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá TẤT CẢ thông báo không? Hành động này không thể hoàn tác.')) {
      deleteAllMutation.mutate()
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* ── HEADER TRANG ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-black text-3xl text-slate-900 mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8 text-indigo-600" />
              Thông báo của bạn
            </h1>
            <p className="text-slate-500 text-sm">Quản lý và theo dõi các hoạt động quan trọng.</p>
          </div>

          {/* CÁC NÚT HÀNH ĐỘNG HÀNG LOẠT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending || notifications.length === 0}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" /> Đánh dấu đã đọc
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={deleteAllMutation.isPending || notifications.length === 0}
              className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Xoá tất cả
            </button>
          </div>
        </div>

        {/* ── TABS LỌC ── */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setFilter('all')
              setPage(1)
            }}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Tất cả thông báo
          </button>
          <button
            onClick={() => {
              setFilter('unread')
              setPage(1)
            }}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'unread'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Chưa đọc
          </button>
        </div>

        {/* ── DANH SÁCH THÔNG BÁO ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-medium">Đang tải thông báo...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Bell className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Không có thông báo nào</h3>
              <p className="text-slate-500 max-w-sm leading-tight">
                {filter === 'unread'
                  ? 'Bạn đã đọc hết tất cả các thông báo. Quá tuyệt vời!'
                  : 'Hộp thư của bạn hiện đang trống. Các thông báo mới sẽ xuất hiện tại đây.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif: Notification) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotifClick(notif)}
                  className={`group relative p-5 transition-colors hover:bg-slate-50 cursor-pointer flex gap-5 items-start ${
                    !notif.isRead ? 'bg-indigo-50/20' : 'bg-white'
                  }`}
                >
                  {/* Chấm xanh */}
                  {!notif.isRead && (
                    <span className="absolute top-1/2 -translate-y-1/2 left-3 w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}

                  <div className="shrink-0 pl-4 sm:pl-2">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      {getNotificationIcon(notif.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-12">
                    <p
                      className={`text-base mb-1.5 ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{notif.content}</p>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {formatTimeAgo(notif.createdAt)}
                    </p>
                  </div>

                  {/* Nút Xoá (Hiện khi hover trên Desktop, luôn hiện mờ mờ trên Mobile) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMutation.mutate(notif._id)
                    }}
                    className="absolute top-5 right-5 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                    title="Xoá thông báo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── PHÂN TRANG (PAGINATION) ── */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Trước
            </button>
            <span className="text-sm font-bold text-slate-600">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
            >
              Sau <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
