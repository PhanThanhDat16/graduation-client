import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Settings,
  ShieldAlert,
  Circle,
  Check,
  ExternalLink
} from 'lucide-react'

// --- MOCK DATA CAO CẤP ---
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'finance',
    title: 'Tiền đã được giải ngân vào ví!',
    message: 'Khách hàng Công ty TNHH Giải Pháp Số đã nghiệm thu và giải ngân 20.000.000 ₫ cho dự án E-commerce.',
    time: '10 phút trước',
    isRead: false,
    actionLink: '/wallet',
    actionText: 'Kiểm tra ví ngay'
  },
  {
    id: 2,
    type: 'project',
    title: 'Chúc mừng Sang! Báo giá đã được duyệt',
    message:
      'Báo giá của bạn cho dự án "Tối ưu API NodeJS" đã được TechNova Global chấp nhận. Hãy vào ký hợp đồng ngay.',
    time: '2 giờ trước',
    isRead: false,
    actionLink: '/contracts',
    actionText: 'Xem hợp đồng'
  },
  {
    id: 3,
    type: 'message',
    title: 'Tin nhắn mới từ Hải Nguyễn',
    message: '"Chào bạn, mình vừa gửi kèm file thiết kế Figma mới nhất, bạn check nhé..."',
    time: 'Hôm qua, 15:30',
    isRead: true,
    senderAvatar: 'https://ui-avatars.com/api/?name=Hai+Nguyen&background=F59E0B&color=fff'
  },
  {
    id: 4,
    type: 'system',
    title: 'Bảo mật tài khoản',
    message:
      'Hệ thống phát hiện thiết bị đăng nhập mới từ IP 113.160.xxx tại Đà Nẵng. Nếu không phải bạn, hãy đổi mật khẩu.',
    time: '3 ngày trước',
    isRead: true
  },
  {
    id: 5,
    type: 'finance',
    title: 'Khách hàng đã nạp tiền Escrow',
    message: 'Hải Nguyễn Spa đã nạp đủ 5.000.000 ₫ vào quỹ bảo lãnh. Bạn có thể bắt đầu làm việc một cách an toàn.',
    time: '4 ngày trước',
    isRead: true
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'unread'

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  // Logic render Icon hoặc Avatar tùy thuộc vào loại thông báo
  const renderNotificationIcon = (noti: any) => {
    if (noti.senderAvatar) {
      return (
        <img
          src={noti.senderAvatar}
          alt="Sender Avatar"
          className="w-12 h-12 rounded-full border border-slate-200 shadow-sm object-cover"
        />
      )
    }

    switch (noti.type) {
      case 'finance':
        return (
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
        )
      case 'project':
        return (
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5 text-indigo-600" />
          </div>
        )
      case 'system':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
            <Bell className="w-5 h-5 text-slate-500" />
          </div>
        )
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead
    return true
  })

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] font-body">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mb-2 flex items-center gap-3">
              Thông báo
              {unreadCount > 0 && (
                <span className="bg-danger text-white text-sm font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {unreadCount} mới
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500">Quản lý các bản cập nhật về dự án, tin nhắn và thanh toán của bạn.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" /> Đánh dấu đã đọc tất cả
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS LỌC (FILTERS) */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-xl w-full sm:w-fit overflow-x-auto hide-scrollbar shadow-inner">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeFilter === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeFilter === 'unread' ? 'bg-white text-indigo-700 shadow-sm flex items-center gap-2' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 flex items-center gap-2'}`}
          >
            Chưa đọc <span className="w-2 h-2 rounded-full bg-danger"></span>
          </button>
        </div>

        {/* DANH SÁCH THÔNG BÁO */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((noti) => (
              <div
                key={noti.id}
                onClick={() => markAsRead(noti.id)}
                className={`group p-5 sm:p-6 flex items-start gap-4 transition-all cursor-pointer hover:bg-slate-50 ${!noti.isRead ? 'bg-indigo-50/40' : ''}`}
              >
                {/* Khu vực Icon / Avatar */}
                <div className="shrink-0 relative">
                  {renderNotificationIcon(noti)}
                  {/* Chấm xanh báo hiệu Unread */}
                  {!noti.isRead && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-600 border-2 border-white rounded-full shadow-sm"></div>
                  )}
                </div>

                {/* Nội dung chính */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1.5">
                    <h3
                      className={`text-base truncate pr-4 ${!noti.isRead ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'}`}
                    >
                      {noti.title}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap shrink-0">{noti.time}</span>
                  </div>

                  <p
                    className={`text-sm leading-relaxed mb-3 ${!noti.isRead ? 'text-slate-700 font-medium' : 'text-slate-500'}`}
                  >
                    {noti.message}
                  </p>

                  {/* Nút hành động nhanh (Nếu có) */}
                  {noti.actionLink && (
                    <div className="mt-2">
                      <Link
                        to={noti.actionLink}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        onClick={(e) => e.stopPropagation()} // Ngăn chặn trigger onClick của thẻ div to
                      >
                        {noti.actionText} <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Các action ẩn hiện khi Hover (Nút Read/Unread) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:block">
                  {!noti.isRead ? (
                    <button
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Đánh dấu đã đọc"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Đánh dấu chưa đọc"
                    >
                      <Circle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* TRẠNG THÁI TRỐNG (EMPTY STATE) */}
          {filteredNotifications.length === 0 && (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Không có thông báo nào</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                {activeFilter === 'unread'
                  ? 'Tuyệt vời! Bạn đã đọc hết tất cả các thông báo mới.'
                  : 'Hiện tại hệ thống chưa có thông báo nào mới dành cho bạn.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
