import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, FileText, Wallet, Settings, MessageCircle, Send, Bell } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function DashboardSidebar() {
  const location = useLocation()

  // Hàm kiểm tra xem route hiện tại có khớp không (để hiện màu đậm)
  const isActive = (path: string) => location.pathname.includes(path)

  const { user } = useAuthStore()
  // Mock role, sau này lấy trực tiếp từ user.role thực tế
  const userRole = user?.role || 'freelancer'

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:min-h-[calc(100vh-64px)] sticky top-[64px] z-10">
      <div className="p-5 hidden md:block border-b border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Không gian làm việc</p>
      </div>

      <nav className="flex md:flex-col gap-1 p-3 overflow-x-auto md:overflow-visible hide-scrollbar">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
            isActive('/dashboard')
              ? 'font-bold bg-indigo-50/70 text-indigo-700'
              : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Tổng quan
        </Link>

        {/* === MENU ĐỘNG THEO ROLE === */}
        {userRole === 'contractor' ? (
          <Link
            to="/manage-projects"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
              isActive('/manage-projects')
                ? 'font-bold bg-indigo-50/70 text-indigo-700'
                : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Quản lý dự án
          </Link>
        ) : (
          <Link
            to="/applications/my" // ĐÃ SỬA: Trỏ về đúng trang MyApplicationsPage
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
              isActive('/applications/my') // ĐÃ SỬA: Check đúng active route
                ? 'font-bold bg-indigo-50/70 text-indigo-700'
                : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" /> Việc đã ứng tuyển
          </Link>
        )}
        {/* ============================ */}

        <Link
          to="/contracts"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
            isActive('/contracts')
              ? 'font-bold bg-indigo-50/70 text-indigo-700'
              : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Hợp đồng
        </Link>

        <Link
          to="/wallet"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
            isActive('/wallet')
              ? 'font-bold bg-indigo-50/70 text-indigo-700'
              : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" /> Ví Escrow
        </Link>

        <Link
          to="/messages"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
            isActive('/messages')
              ? 'font-bold bg-indigo-50/70 text-indigo-700'
              : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <MessageCircle className="w-4 h-4" /> Tin nhắn
        </Link>

        <Link
          to="/notifications"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
            isActive('/notifications')
              ? 'font-bold bg-indigo-50/70 text-indigo-700'
              : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" /> Thông báo
        </Link>

        <div className="h-px bg-slate-100 my-2 hidden md:block mx-3"></div>

        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
            isActive('/settings')
              ? 'font-bold bg-indigo-50/70 text-indigo-700'
              : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" /> Cài đặt
        </Link>
      </nav>
    </aside>
  )
}
