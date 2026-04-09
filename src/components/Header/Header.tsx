import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Lấy state từ Zustand
  const { user, accessToken, logOut } = useAuthStore()

  // Hiệu ứng đổ bóng khi scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      } font-body`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Hệ thống Grid 12 cột */}
        <div className="grid grid-cols-12 h-20 items-center gap-4">
          {/* 1. Logo (Chiếm 3/12 cột trên Desktop) */}
          <Link to="/" className="col-span-8 lg:col-span-3 flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-950 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span className="font-heading font-bold text-2xl text-indigo-950 tracking-tight">
              Freelance<span className="text-amber-500">VN</span>
            </span>
          </Link>

          {/* 2. Menu Navigation (Chiếm 5/12 cột, căn giữa) */}
          <nav className="hidden lg:flex col-span-5 justify-center space-x-8 font-medium text-gray-600">
            <Link to="/projects" className="hover:text-amber-500 transition-colors">
              Tìm Dự Án
            </Link>
            <Link to="/freelancers" className="hover:text-amber-500 transition-colors">
              Tìm Freelancer
            </Link>
            <Link to="/pricing" className="hover:text-amber-500 transition-colors">
              Bảng giá
            </Link>
            <Link to="/blog" className="hover:text-amber-500 transition-colors">
              Blog
            </Link>
          </nav>

          {/* 3. Vùng Actions bên phải (Chiếm 4/12 cột, căn phải) */}
          <div className="hidden lg:flex col-span-4 justify-end items-center space-x-4">
            {!accessToken ? (
              // Trạng thái: CHƯA đăng nhập
              <>
                <Link
                  to="/login"
                  className="text-indigo-950 font-semibold border border-indigo-950 px-5 py-2 rounded-full hover:bg-indigo-50 transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-amber-600 shadow-md transition-colors"
                >
                  Đăng Ký
                </Link>
              </>
            ) : (
              // Trạng thái: ĐÃ đăng nhập
              <div className="flex items-center gap-5">
                {/* Ví Tiền */}
                <Link
                  to="/wallet"
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 text-indigo-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="font-semibold text-sm text-indigo-950">2,500,000 ₫</span>
                </Link>

                {/* Chuông thông báo */}
                <Link to="/notifications" className="relative cursor-pointer group">
                  <svg
                    className="w-6 h-6 text-gray-600 group-hover:text-indigo-950 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    3
                  </span>
                </Link>

                {/* Avatar & Dropdown Menu */}
                <div className="relative group cursor-pointer pt-2 pb-2">
                  <img
                    src={user?.avatarUrl || 'https://i.pravatar.cc/150?img=11'}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-amber-500 transition-colors"
                  />

                  {/* Dropdown Menu (Hiển thị khi hover) */}
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-950 font-medium"
                    >
                      Hồ sơ của tôi
                    </Link>
                    <Link
                      to="/projects"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-950 font-medium"
                    >
                      Quản lý dự án
                    </Link>
                    <Link
                      to="/wallet"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-950 flex justify-between items-center font-medium"
                    >
                      <span>Ví & Giao dịch</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-950 font-medium"
                    >
                      Cài đặt
                    </Link>
                    <div className="my-1 border-t border-gray-100"></div>
                    <button
                      onClick={logOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Nút Hamburger (Mobile) */}
          <div className="col-span-4 lg:hidden flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
