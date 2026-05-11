import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Wallet,
  ChevronDown,
  User,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Home,
  FolderSearch,
  Users,
  MoreHorizontal,
  Search,
  MessageSquare,
  Briefcase,
  Building2,
  Mail,
  LayoutDashboard,
  Send,
  Heart // Đã thêm icon Heart
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import path from '@/constants/path'
import { useWalletStore } from '@/store/useWalletStore'
import NotificationDropdown from './NotificationDropdown'

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

  const userRole = user?.role || 'freelancer'

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

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname)
    setIsMobileMenuOpen(false)
    setIsDropdownOpen(false)
    setIsMoreMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      <div className="container px-4 mx-auto lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* --- TRÁI: LOGO & NAVIGATION --- */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary shadow-sm group-hover:-translate-y-0.5 transition-transform">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <span className="hidden text-xl font-extrabold tracking-tight font-heading text-primary sm:block">
                Free<span className="text-accent">Work</span>
              </span>
            </Link>

            <nav className="items-center hidden gap-1 lg:flex">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-indigo-50 text-primary'
                    : 'text-text-sub hover:text-primary hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" /> <span>Trang chủ</span>
              </Link>
              <Link
                to="/projects"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.includes('/projects')
                    ? 'bg-indigo-50 text-primary'
                    : 'text-text-sub hover:text-primary hover:bg-gray-100'
                }`}
              >
                <FolderSearch className="w-4 h-4" /> <span>Tìm dự án</span>
              </Link>
              <Link
                to="/freelancers"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.includes('/freelancers')
                    ? 'bg-indigo-50 text-primary'
                    : 'text-text-sub hover:text-primary hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" /> <span>Tìm freelancer</span>
              </Link>

              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isMoreMenuOpen ? 'bg-page text-primary' : 'text-text-sub hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" /> <span>Thêm</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <Link
                      to="/about"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                    >
                      <Building2 className="w-4 h-4" /> Về FreeWork
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-page hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Liên hệ với chúng tôi
                    </Link>
                    <div className="h-px my-1 bg-border"></div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* --- PHẢI: ACTIONS --- */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {!accessToken ? (
              <div className="items-center hidden gap-2 sm:flex">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold transition-colors rounded-lg text-primary hover:bg-indigo-50"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary/90"
                >
                  Đăng Ký
                </Link>
              </div>
            ) : (
              <>
                {/* === NÚT CALL-TO-ACTION THEO ROLE === */}
                <div className="hidden mr-2 sm:block">
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

                {/* === NÚT DỰ ÁN ĐÃ LƯU (MỚI) === */}
                <Link
                  to="/saved-projects"
                  className="relative hidden p-2 transition-colors rounded-lg text-text-sub hover:bg-rose-50 hover:text-rose-500 sm:flex group"
                  title="Dự án đã lưu"
                >
                  <Heart className="w-5 h-5 transition-colors group-hover:fill-rose-100" />
                </Link>

                <Link
                  to="/messages"
                  className="relative hidden p-2 transition-colors rounded-lg text-text-sub hover:bg-gray-100 hover:text-primary sm:flex"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent border-2 border-white"></span>
                </Link>

                <NotificationDropdown />

                {/* Wallet Balance Pill */}
                <Link
                  to="/wallet"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 mx-1 rounded-lg bg-indigo-50 text-primary border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  <Wallet className="w-4 h-4 text-accent" />
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
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${user?.fullName || 'NV'}&background=1B2A6B&color=fff`
                      }
                      alt="Avatar"
                      className="object-cover w-8 h-8 border rounded-full shadow-sm border-slate-200"
                    />
                    <ChevronDown
                      className={`h-4 w-4 text-text-muted hidden sm:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 mb-1 border-b border-border bg-slate-50/50">
                        <p className="text-sm font-bold truncate text-text-main">{user?.fullName || 'Người dùng'}</p>
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

                      {/* === NÚT DỰ ÁN ĐÃ LƯU TRONG DROPDOWN (MỚI) === */}
                      <Link
                        to="/saved-projects"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-text-main hover:bg-rose-50 hover:text-rose-600 transition-colors group"
                      >
                        <Heart className="w-4 h-4 transition-colors text-text-sub group-hover:text-rose-500" /> Dự án đã
                        lưu
                      </Link>

                      <Link
                        to={`/profile/${user?._id}`}
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
              className="p-2 ml-1 transition-colors rounded-lg lg:hidden text-text-sub hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="absolute w-full duration-200 bg-white border-t shadow-lg lg:hidden border-border animate-in slide-in-from-top-2">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50"
            >
              <Home className="w-4 h-4 text-text-sub" /> Trang chủ
            </Link>
            <Link
              to="/projects"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50"
            >
              <FolderSearch className="w-4 h-4 text-text-sub" /> Tìm dự án
            </Link>
            <Link
              to="/freelancers"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50"
            >
              <Users className="w-4 h-4 text-text-sub" /> Tìm freelancer
            </Link>

            {accessToken && (
              <>
                <div className="h-px mx-3 my-2 bg-border"></div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-primary bg-indigo-50 mt-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" /> Bảng điều khiển
                </Link>

                {/* === NÚT DỰ ÁN ĐÃ LƯU TRONG MOBILE MENU (MỚI) === */}
                <Link
                  to="/saved-projects"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-rose-50 hover:text-rose-600 mt-1"
                >
                  <Heart className="w-4 h-4 text-text-sub" /> Dự án đã lưu
                </Link>

                <Link
                  to="/wallet"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 mt-1"
                >
                  <Wallet className="w-4 h-4 text-text-sub" /> Ví Escrow
                  <span className="px-2 py-1 ml-auto text-xs font-bold rounded-md text-primary bg-indigo-50">
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
                  className="py-2 text-sm font-bold text-center border rounded-lg border-border text-text-main"
                >
                  Đăng nhập
                </Link>
                <Link to="/register" className="py-2 text-sm font-bold text-center text-white rounded-lg bg-primary">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="pt-2 mt-2 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-red-50 flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
