import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Wallet,
  Settings,
  MessageCircle,
  Send, // Thêm icon Send cho Việc đã ứng tuyển
  Bell,
  BanknoteArrowDownIcon,
  BanknoteArrowUp,
  Banknote,
  CreditCard
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import path from '@/constants/path'

export default function DashboardSidebar() {
  const location = useLocation()
  const isActive = (pathStr: string, exact?: boolean) =>
    exact ? location.pathname === pathStr : location.pathname.startsWith(pathStr)

  const navItems = [
    {
      icon: <Wallet size={18} />,
      label: 'Ví của tôi',
      path: path.WALLET,
      exact: true
    },
    {
      icon: <BanknoteArrowDownIcon size={18} />,
      label: 'Nạp tiền',
      path: path.ADD_FUNDS,
      exact: false
    },
    {
      icon: <BanknoteArrowUp size={18} />,
      label: 'Rút tiền',
      path: path.WITHDRAW,
      exact: true
    },
    {
      icon: <Banknote size={18} />,
      label: 'Yêu cầu rút tiền',
      path: path.WITHDRAW_REQUESTS,
      exact: false
    },
    {
      icon: <CreditCard size={18} />,
      label: 'Tài khoản ngân hàng',
      path: path.BANK_ACCOUNTS,
      exact: false
    }
  ]

  // Lấy thông tin user từ Store
  const { user } = useAuthStore()

  // Tạm mock role (Nếu chưa có, mặc định là freelancer)
  const userRole = user?.role || 'freelancer'

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:min-h-[calc(100vh-64px)] sticky top-[64px] z-10">
      <div className="p-5 hidden md:block border-b border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Không gian làm việc</p>
      </div>

      <nav className="flex md:flex-col gap-1 p-3 overflow-x-auto md:overflow-visible hide-scrollbar">
        <NavLink
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive('/dashboard') ? 'font-bold bg-indigo-50/70 text-indigo-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <LayoutDashboard size={20} /> Tổng quan
        </NavLink>

        {/* === MENU ĐỘNG THEO ROLE === */}
        {userRole === 'contractor' ? (
          <NavLink
            to={path.MANAGE_PROJECTS}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive('/manage-projects') ? 'font-bold bg-indigo-50/70 text-indigo-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Briefcase size={20} /> Quản lý dự án
          </NavLink>
        ) : (
          <NavLink
            to={path.MY_PROPOSALS}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive('/my-proposals') ? 'font-bold bg-indigo-50/70 text-indigo-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Send size={20} /> Việc đã ứng tuyển
          </NavLink>
        )}
        {/* ============================ */}

        <NavLink
          to={path.CONTRACTS}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive('/contracts') ? 'font-bold bg-indigo-50/70 text-indigo-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <FileText size={20} /> Hợp đồng
        </NavLink>

        <NavLink
          to={path.MESSAGES}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive('/messages') ? 'font-bold bg-indigo-50/70 text-indigo-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <MessageCircle size={20} /> Tin nhắn
        </NavLink>

        <div className="h-px bg-slate-100 my-2 mb-4 hidden md:block mx-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          {' '}
          Ví của tôi
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive(item.path, item.exact) ? 'font-bold bg-indigo-50/70 text-indigo-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}

        <div className="h-px bg-slate-100 my-2 hidden md:block mx-3"></div>

        <NavLink
          to={path.SETTINGS}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive('/settings') ? 'font-bold bg-indigo-50/70 text-indigo-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Settings size={20} /> Cài đặt
        </NavLink>

        <NavLink
          to={path.NOTIFICATIONS}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive('/notifications') ? 'font-bold bg-indigo-50/70 text-indigo-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Bell size={20} /> Thông báo
        </NavLink>
      </nav>
    </aside>
  )
}
