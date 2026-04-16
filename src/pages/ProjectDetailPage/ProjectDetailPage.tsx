import { Link, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Clock,
  DollarSign,
  ArrowLeft,
  Star,
  CheckCircle2,
  Share2,
  Heart,
  MapPin,
  ShieldAlert,
  AlertCircle,
  ChevronRight,
  FileText
} from 'lucide-react'

// --- MOCK DATA (Lấy từ API: GET /projects/:id) ---
const MOCK_PROJECT_DETAIL = {
  _id: 'p1',
  title: 'Phát triển nền tảng E-commerce bằng MERN Stack',
  category: 'Lập trình Web',
  description: `Chúng tôi là một công ty startup về bán lẻ đang cần xây dựng một nền tảng E-commerce đa nhà cung cấp (Multi-vendor).

Yêu cầu chi tiết:
1. Xây dựng giao diện người dùng (User App) và giao diện quản trị (Admin Dashboard).
2. Tích hợp thanh toán trực tuyến: VNPay, Momo.
3. Chức năng quản lý giỏ hàng, đơn hàng, mã giảm giá.
4. Hệ thống đánh giá (Review/Rating) sản phẩm.
5. Tối ưu hóa SEO cơ bản và tốc độ tải trang.

Yêu cầu kỹ thuật:
- Frontend: ReactJS (hoặc Next.js), TailwindCSS.
- Backend: NodeJS, Express.
- Database: MongoDB.

Dự án cần hoàn thành trong vòng 3 tháng. Vui lòng gửi kèm portfolio các dự án tương tự bạn đã làm.`,
  skills: ['ReactJS', 'NodeJS', 'MongoDB', 'Express', 'TailwindCSS', 'Thanh toán VNPay'],
  budget_min: 15000000,
  budget_max: 25000000,
  created_at: '2 giờ trước',
  status: 'open', // open | closed
  likes: 24,
  is_liked_by_me: false,

  // Dữ liệu Join từ bảng Users (Contractor)
  contractor: {
    _id: 'u1',
    full_name: 'TechVision VN',
    isVerified: true,
    address: 'Hồ Chí Minh, Việt Nam',
    rating_avg: 4.8,
    rating_count: 32,
    created_at: 'Tháng 10, 2021',
    total_projects_posted: 15
  },

  applications_count: 5
}

export default function ProjectDetailPage() {
  const navigate = useNavigate()
  // const { id } = useParams()
  const project = MOCK_PROJECT_DETAIL

  // --- GIẢ LẬP AUTH STATE (Thực tế lấy từ useAuthStore) ---
  const currentUserRole = 'freelancer' // 'freelancer' | 'contractor'
  const currentUserId = 'u2' // ID của người đang đăng nhập

  const isOwner = currentUserRole === 'contractor' && currentUserId === project.contractor._id
  const isOtherContractor = currentUserRole === 'contractor' && !isOwner
  const isFreelancer = currentUserRole === 'freelancer'

  // Format tiền
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('vi-VN')
  }

  return (
    <div className="bg-page min-h-screen font-body pb-20">
      {/* ── BREADCRUMB & BACK NAV ── */}
      <div className="bg-white border-b border-border pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 text-sm font-medium text-text-sub mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <span className="w-1 h-1 bg-border rounded-full"></span>
            <Link to="/projects" className="hover:text-primary transition-colors">
              Khám phá Dự án
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-text-main">{project.category}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary mb-4 leading-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-text-sub">
                <span className="flex items-center gap-1.5 bg-green-50 text-emerald-700 px-2.5 py-1 rounded-md font-bold">
                  Đang mở nhận báo giá
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Đã đăng {project.created_at}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {project.contractor.address}
                </span>
              </div>
            </div>

            {/* Nút thao tác nhanh trên Header */}
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-text-main hover:bg-gray-50 transition-colors shadow-sm">
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>
              {isFreelancer && (
                <button
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-colors shadow-sm ${project.is_liked_by_me ? 'bg-red-50 border-red-200 text-danger' : 'bg-white border-border text-text-main hover:bg-gray-50'}`}
                >
                  <Heart className={`w-4 h-4 ${project.is_liked_by_me ? 'fill-danger text-danger' : ''}`} />
                  {project.is_liked_by_me ? 'Đã lưu' : 'Lưu dự án'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ==========================================
              CỘT TRÁI: CHI TIẾT DỰ ÁN (70%)
          ========================================== */}
          <div className="w-full lg:w-[65%] space-y-6">
            {/* Cảnh báo dành cho Contractor đi lướt dạo */}
            {isOtherContractor && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  Bạn đang xem dự án này dưới góc độ là một Khách Hàng (Contractor). Bạn không thể ứng tuyển vào dự án
                  của người khác. Hãy chuyển sang tài khoản Freelancer nếu bạn muốn nhận việc.
                </p>
              </div>
            )}

            {/* Box 1: Mô tả chi tiết */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">Mô tả công việc</h2>
              <div className="text-text-main text-[15px] leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            </div>

            {/* Box 2: Kỹ năng & Chuyên môn */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">
                Kỹ năng chuyên môn yêu cầu
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-page border border-border rounded-xl text-sm font-bold text-text-sub hover:border-primary hover:text-primary transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 3: Hoạt động dự án */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">
                Hoạt động trên dự án này
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">{project.applications_count}</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Báo giá đã gửi</div>
                </div>
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">0</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Đang phỏng vấn</div>
                </div>
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">1</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Thư mời gửi đi</div>
                </div>
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">{project.likes}</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Lượt lưu</div>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================
              CỘT PHẢI: SIDEBAR (35%)
          ========================================== */}
          <div className="w-full lg:w-[35%] space-y-6">
            {/* Box Action & Budget */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-primary shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text-muted uppercase mb-1">Ngân sách dự kiến</div>
                  <div className="text-xl font-extrabold text-emerald-600">
                    {formatMoney(project.budget_min)} - {formatMoney(project.budget_max)} ₫
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-text-sub bg-page w-fit px-2 py-1 rounded">
                    <ShieldAlert className="w-3.5 h-3.5 text-accent" /> Thanh toán Escrow
                  </div>
                </div>
              </div>

              {/* RENDER NÚT DỰA VÀO ROLE */}
              {isOwner && (
                <button
                  onClick={() => navigate('/manage-projects')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" /> Quản lý dự án này
                </button>
              )}

              {isFreelancer && (
                <button
                  onClick={() => navigate(`/submit-proposal/${project._id}`)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" /> Gửi Báo Giá Ngay
                </button>
              )}

              {isOtherContractor && (
                <button
                  disabled
                  className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" /> Không thể ứng tuyển
                </button>
              )}
            </div>

            {/* Box Thông tin Khách hàng (Contractor) */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-text-main mb-5">Về khách hàng này</h3>

              <div className="space-y-4">
                {/* Tên & Xác thực */}
                <div>
                  <div className="font-extrabold text-primary text-lg mb-1">{project.contractor.full_name}</div>
                  {project.contractor.isVerified ? (
                    <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Đã xác thực thanh toán
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm font-bold text-text-muted">
                      <AlertCircle className="w-4 h-4" /> Chưa xác thực thanh toán
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current opacity-30" />
                  </div>
                  <span className="text-sm font-bold text-text-main">{project.contractor.rating_avg.toFixed(1)}</span>
                  <span className="text-sm text-text-muted">({project.contractor.rating_count} đánh giá)</span>
                </div>

                <div className="h-px bg-border my-2"></div>

                {/* Info List */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-text-muted shrink-0" />
                    <div>
                      <div className="font-bold text-text-main">{project.contractor.address}</div>
                      <div className="text-text-muted">Giờ địa phương: 14:30 PM</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Briefcase className="w-5 h-5 text-text-muted shrink-0" />
                    <div>
                      <div className="font-bold text-text-main">
                        {project.contractor.total_projects_posted} công việc đã đăng
                      </div>
                      <div className="text-text-muted">Tỉ lệ tuyển dụng: 75%</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-5 h-5 text-text-muted shrink-0" />
                    <div>
                      <div className="font-bold text-text-main">Thành viên từ {project.contractor.created_at}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box Report */}
            {!isOwner && (
              <button className="w-full text-center text-sm font-semibold text-text-muted hover:text-danger transition-colors flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" /> Báo cáo bài đăng vi phạm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
