import { Link } from 'react-router-dom'
import { Shield, Globe, ArrowRight, Heart } from 'lucide-react' // Đã xóa các icon brand bị lỗi

// --- CÁC ICON MẠNG XÃ HỘI TỰ VẼ BẰNG SVG (Thay thế cho Lucide) ---
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
      clipRule="evenodd"
    />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.847-3.037-1.846 0-2.13 1.445-2.13 2.939v5.667H9.361V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-slate-900 pb-8 font-body border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── TOP SECTION: NEWSLETTER ── */}
        {/* <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-extrabold text-white mb-2">Đăng ký nhận bản tin</h3>
            <p className="text-sm text-slate-400">
              Nhận những cơ hội việc làm và mẹo phát triển sự nghiệp mới nhất mỗi tuần.
            </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative w-full md:w-80">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="Địa chỉ Email của bạn..."
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shrink-0">
              Đăng ký
            </button>
          </div>
        </div> */}

        {/* ── MAIN LINKS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 py-12 border-b border-slate-800">
          {/* Cột 1: Brand (Chiếm 2 cột trên Desktop) */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group w-fit">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-indigo-600 shadow-lg group-hover:-translate-y-0.5 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading text-2xl font-extrabold text-white tracking-tight">
                Freelance<span className="text-indigo-400">VN</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 pr-4">
              Nền tảng kết nối nhân tài tự do với các doanh nghiệp hàng đầu Việt Nam. Giao dịch an toàn, làm việc hiệu
              quả, thanh toán đảm bảo qua hệ thống Escrow.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cột 2: Khách Hàng */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Dành cho Khách hàng</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  to="/post-project"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Đăng dự án mới
                </Link>
              </li>
              <li>
                <Link
                  to="/freelancers"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Tìm kiếm Freelancer
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Đảm bảo thanh toán
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Chính sách hoàn tiền
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Freelancer */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Dành cho Freelancer</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/projects" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Khám phá việc làm
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Tạo hồ sơ chuyên nghiệp
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Rút tiền doanh thu
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Cẩm nang thành công
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Công ty */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Về FreelanceVN</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Liên hệ hỗ trợ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Blog & Tin tức
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 5: Pháp lý */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Pháp lý & Điều khoản</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/terms" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/cookie" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Chính sách Cookie
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />{' '}
                  Nguyên tắc cộng đồng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── BOTTOM SECTION: COPYRIGHT & LOCALE ── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1">
            © {new Date().getFullYear()} FreelanceVN. Coded with{' '}
            <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-0.5" /> in Da Nang.
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Globe className="w-4 h-4" /> Tiếng Việt (VN)
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors font-mono">VND (₫)</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
