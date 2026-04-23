import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Wallet,
  ChevronDown,
  User,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Shield,
  Home,
  FolderSearch,
  Users,
  MoreHorizontal,
  Search,
  MessageSquare,
  Briefcase,
  Newspaper,
  Building2,
  Mail,
  Headset,
  LayoutDashboard,
  Send
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import path from '@/constants/path'
import { useWalletStore } from '@/store/useWalletStore'

export default function Header() {
  const location = useLocation()
  const [prevPathname, setPrevPathname] = useState(location.pathname)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const navigate = useNavigate()

  const { balance, fetchBalance } = useWalletStore()
  const { user, accessToken, logOut } = useAuthStore()

  // Tạm mock data (Nếu user chưa có role, mặc định là freelancer)
  const userRole = user?.role || 'freelancer'
  const unreadCount = 2

  const dropdownRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (accessToken) fetchBalance()
  }, [fetchBalance, accessToken])

  const handleLogout = async () => {
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
    await logOut()
    navigate(path.LOGIN)
  }

  // 2. Kiểm tra ngay trong lúc render (KHÔNG dùng useEffect)
  if (location.pathname !== prevPathname) {
    // Nếu URL thay đổi, cập nhật lại URL cũ và đóng các menu
    setPrevPathname(location.pathname)
    setIsMobileMenuOpen(false)
    setIsDropdownOpen(false)
    setIsMoreMenuOpen(false)
  }

  // Hiệu ứng đổ bóng khi cuộn trang
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 font-body ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white border-b border-border'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* --- TRÁI: LOGO & NAVIGATION --- */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary shadow-sm group-hover:-translate-y-0.5 transition-transform">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <span className="font-heading text-xl font-extrabold text-primary hidden sm:block tracking-tight">
                Freelance<span className="text-accent">VN</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-indigo-50 text-primary'
                    : 'text-text-sub hover:text-primary hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4" /> <span>Trang chủ</span>
              </Link>
              <Link
                to="/projects"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.includes('/projects')
                    ? 'bg-indigo-50 text-primary'
                    : 'text-text-sub hover:text-primary hover:bg-gray-100'
                }`}
              >
                <FolderSearch className="h-4 w-4" /> <span>Tìm dự án</span>
              </Link>
              <Link
                to="/freelancers"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.includes('/freelancers')
                    ? 'bg-indigo-50 text-primary'
                    : 'text-text-sub hover:text-primary hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4" /> <span>Tìm freelancer</span>
              </Link>

              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isMoreMenuOpen ? 'bg-page text-primary' : 'text-text-sub hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  <MoreHorizontal className="h-4 w-4" /> <span>Thêm</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <Link
                      to="/blog"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                    >
                      <Newspaper className="h-4 w-4" /> Blog & Tin tức
                    </Link>
                    <Link
                      to="/about"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                    >
                      <Building2 className="h-4 w-4" /> Về FreelanceVN
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" /> Liên hệ với chúng tôi
                    </Link>
                    <div className="h-px bg-border my-1"></div>
                    <Link
                      to="/faq"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                    >
                      <Headset className="h-4 w-4" /> Trung tâm hỗ trợ (FAQ)
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* --- PHẢI: ACTIONS --- */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {!accessToken ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-primary hover:bg-indigo-50 rounded-lg transition-colors hidden sm:block"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
                >
                  Đăng Ký
                </Link>
              </div>
            ) : (
              <>
                {/* === NÚT CALL-TO-ACTION THEO ROLE === */}
                <div className="hidden sm:block mr-2">
                  {userRole === 'contractor' ? (
                    <Link
                      to="/post-project"
                      className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-primary border border-indigo-100 text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition-colors shadow-sm"
                      title="Đăng dự án mới"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span className="hidden lg:block">Đăng dự án</span>
                    </Link>
                  ) : (
                    <Link
                      to="/projects"
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition-colors shadow-sm"
                      title="Tìm việc ngay"
                    >
                      <Search className="w-4 h-4" />
                      <span className="hidden lg:block">Tìm việc ngay</span>
                    </Link>
                  )}
                </div>

                <Link
                  to="/messages"
                  className="relative p-2 rounded-lg text-text-sub hover:bg-gray-100 hover:text-primary transition-colors hidden sm:flex"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent border-2 border-white"></span>
                </Link>

                <button className="relative p-2 rounded-lg text-text-sub hover:bg-gray-100 hover:text-primary transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Wallet Balance Pill */}
                <Link
                  to="/wallet"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 mx-1 rounded-lg bg-indigo-50 text-primary border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  <Wallet className="h-4 w-4 text-accent" />
                  <span className="text-sm font-bold">{balance.toLocaleString('vi-VN')} ₫</span>
                </Link>

                {/* Avatar Dropdown */}
                <div className="relative ml-1" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full hover:bg-gray-100 transition-colors outline-none"
                  >
                    <img
                      src={
                        user?.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${user?.fullName || 'NV'}&background=1B2A6B&color=fff`
                      }
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover shadow-sm border border-slate-200"
                    />
                    <ChevronDown
                      className={`h-4 w-4 text-text-muted hidden sm:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 mb-1 border-b border-border bg-slate-50/50">
                        <p className="text-sm font-bold text-text-main truncate">{user?.fullName || 'Người dùng'}</p>
                        <p className="text-xs font-medium text-text-muted mt-0.5">{user?.email}</p>
                      </div>

                      {/* --- MENU THEO ROLE --- */}
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-primary hover:bg-indigo-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" /> Bảng điều khiển
                      </Link>

                      {userRole === 'contractor' ? (
                        <Link
                          to="/manage-projects"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-text-sub" /> Quản lý dự án
                        </Link>
                      ) : (
                        <Link
                          to="/applications/my"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                        >
                          <Send className="w-4 h-4 text-text-sub" /> Việc đã nộp
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4 text-text-sub" /> Hồ sơ cá nhân
                      </Link>
                      <Link
                        to="/contracts"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                      >
                        <FileText className="w-4 h-4 text-text-sub" /> Hợp đồng
                      </Link>
                      <Link
                        to="/wallet"
                        className="flex md:hidden items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-text-sub" /> Ví Escrow
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                      >
                        <Settings className="w-4 h-4 text-text-sub" /> Cài đặt
                      </Link>

                      {userRole === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors mt-1"
                        >
                          <ShieldAlert className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}

                      <div className="my-1 border-t border-border"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-danger hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              className="lg:hidden p-2 rounded-lg text-text-sub hover:bg-gray-100 transition-colors ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white absolute w-full shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50"
            >
              <Home className="h-4 w-4 text-text-sub" /> Trang chủ
            </Link>
            <Link
              to="/projects"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50"
            >
              <FolderSearch className="h-4 w-4 text-text-sub" /> Tìm dự án
            </Link>
            <Link
              to="/freelancers"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50"
            >
              <Users className="h-4 w-4 text-text-sub" /> Tìm freelancer
            </Link>

            {accessToken && (
              <>
                <div className="h-px bg-border my-2 mx-3"></div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-primary bg-indigo-50 mt-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" /> Bảng điều khiển
                </Link>

                <Link
                  to="/wallet"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 mt-1"
                >
                  <Wallet className="h-4 w-4 text-text-sub" /> Ví Escrow
                  <span className="ml-auto text-xs font-bold text-primary bg-indigo-50 px-2 py-1 rounded-md">
                    {balance.toLocaleString('vi-VN')} ₫
                  </span>
                </Link>

                {userRole === 'contractor' ? (
                  <Link
                    to="/post-project"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-primary hover:bg-indigo-50 mt-1"
                  >
                    <Briefcase className="w-4 h-4" /> Đăng dự án mới
                  </Link>
                ) : (
                  <Link
                    to="/projects"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-emerald-600 hover:bg-emerald-50 mt-1"
                  >
                    <Search className="w-4 h-4" /> Tìm việc ngay
                  </Link>
                )}
              </>
            )}

            {!accessToken ? (
              <div className="grid grid-cols-2 gap-3 pt-4 pb-2 mt-2 border-t border-border">
                <Link
                  to="/login"
                  className="text-center py-2 rounded-lg border border-border text-text-main text-sm font-bold"
                >
                  Đăng nhập
                </Link>
                <Link to="/register" className="text-center py-2 rounded-lg bg-primary text-white text-sm font-bold">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="pt-2 mt-2 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-red-50 flex items-center gap-3"
                >
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
