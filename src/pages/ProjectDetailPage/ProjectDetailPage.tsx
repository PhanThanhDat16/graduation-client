import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Briefcase,
  Clock,
  DollarSign,
  ArrowLeft,
  Share2,
  Heart,
  ShieldAlert,
  AlertCircle,
  ChevronRight,
  FileText,
  LogIn
} from 'lucide-react'
import { projectService } from '@/apis/projectService'
import ContractorInfo from '@/components/ContractorInfo/ContractorInfo'
import { formatBudget, timeAgo } from '@/utils/fomatters'
import { useAuthStore } from '@/store/useAuthStore'

export default function ProjectDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  // LẤY THÔNG TIN USER THẬT TỪ STORE
  const { user } = useAuthStore()

  // GỌI API LẤY CHI TIẾT DỰ ÁN
  const {
    data: axiosResponse,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id as string),
    enabled: !!id // Chỉ gọi API khi có id
  })
  const project = axiosResponse?.data?.data

  // --- XỬ LÝ TRẠNG THÁI LOADING & ERROR ---
  if (isLoading) {
    return (
      <div className="bg-page min-h-screen pt-12 pb-20 px-4 flex justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-sub font-medium">Đang tải thông tin dự án...</p>
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="bg-page min-h-screen pt-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-border">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-main mb-2">Không tìm thấy dự án</h2>
          <p className="text-text-sub mb-6">Dự án này có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  // --- TÍNH TOÁN QUYỀN (PERMISSIONS) ĐỘNG DỰA VÀO STORE ---
  const isGuest = !user // Chưa đăng nhập
  const currentUserRole = user?.role
  const currentUserId = user?._id || user?.id

  const isOwner = currentUserRole === 'contractor' && currentUserId === project.contractorId
  const isOtherContractor = currentUserRole === 'contractor' && !isOwner
  const isFreelancer = currentUserRole === 'freelancer'
  const isLikedByMe = currentUserId ? project.listLike?.includes(currentUserId) : false

  // Xử lý khi Khách vãng lai bấm vào các nút yêu cầu đăng nhập
  const handleRequireLogin = () => {
    // Đẩy sang trang login, kèm theo state chứa URL hiện tại để login xong quay lại đúng dự án này
    navigate('/login', { state: { from: location.pathname } })
  }

  return (
    <div className="bg-page min-h-screen font-body pb-20">
      {/* ── BREADCRUMB & BACK NAV ── */}
      <div className="bg-white border-b border-border pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm font-medium text-text-sub mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-primary transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <span className="hidden sm:block w-1 h-1 bg-border rounded-full shrink-0"></span>
            <Link to="/projects" className="hover:text-primary transition-colors whitespace-nowrap">
              Khám phá Dự án
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-text-main line-clamp-1">{project.category || 'Tất cả'}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary mb-4 leading-tight break-words">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-text-sub">
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold ${project.status === 'open' ? 'bg-green-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  {project.status === 'open' ? 'Đang mở nhận báo giá' : 'Đã đóng'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Đã đăng {timeAgo(project.createdAt)}
                </span>
              </div>
            </div>

            {/* Nút thao tác nhanh trên Header */}
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-text-main hover:bg-gray-50 transition-colors shadow-sm">
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>

              {/* Nếu là Khách hoặc Freelancer thì hiển thị nút Lưu */}
              {(isGuest || isFreelancer) && (
                <button
                  onClick={
                    isGuest
                      ? handleRequireLogin
                      : () => {
                          console.log('Gọi API Like Project')
                        }
                  }
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-colors shadow-sm ${isLikedByMe ? 'bg-red-50 border-red-200 text-danger' : 'bg-white border-border text-text-main hover:bg-gray-50'}`}
                >
                  <Heart className={`w-4 h-4 ${isLikedByMe ? 'fill-danger text-danger' : ''}`} />
                  {isLikedByMe ? 'Đã lưu' : 'Lưu dự án'}
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
              CỘT TRÁI: CHI TIẾT DỰ ÁN (65%)
          ========================================== */}
          <div className="w-full lg:w-[65%] space-y-6">
            {/* Cảnh báo dành cho Contractor đi lướt dạo */}
            {isOtherContractor && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  Bạn đang xem dự án này dưới góc độ là một Khách Hàng (Contractor). Bạn không thể ứng tuyển vào dự án
                  của người khác.
                </p>
              </div>
            )}

            {/* Box 1: Mô tả chi tiết */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">Mô tả công việc</h2>
              <div className="text-text-main text-[15px] leading-relaxed whitespace-pre-line break-words">
                {project.description}
              </div>
            </div>

            {/* Box 2: Kỹ năng */}
            {project.skills && project.skills.length > 0 && (
              <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">
                  Kỹ năng chuyên môn yêu cầu
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {project.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-page border border-border rounded-xl text-sm font-bold text-text-sub hover:border-primary hover:text-primary transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Box 3: Hoạt động dự án */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">
                Hoạt động trên dự án này
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">0</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Báo giá đã gửi</div>
                </div>
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">0</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Đang phỏng vấn</div>
                </div>
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">0</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Thư mời gửi đi</div>
                </div>
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">{project.likes || 0}</div>
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
                  <div className="text-xl font-extrabold text-emerald-600 break-words">
                    {formatBudget(project.budgetMin)} {project.budgetMax ? `- ${formatBudget(project.budgetMax)}` : ''}{' '}
                    ₫
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-text-sub bg-page w-fit px-2 py-1 rounded">
                    <ShieldAlert className="w-3.5 h-3.5 text-accent" /> Thanh toán Escrow
                  </div>
                </div>
              </div>

              {/* RENDER NÚT DỰA VÀO ROLE VÀ TRẠNG THÁI */}
              {project.status !== 'open' ? (
                <button
                  disabled
                  className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" /> Dự án đã đóng
                </button>
              ) : isGuest ? (
                <button
                  onClick={handleRequireLogin}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-primary border border-primary/20 font-bold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" /> Đăng nhập để ứng tuyển
                </button>
              ) : isOwner ? (
                <button
                  onClick={() => navigate('/manage-projects')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" /> Quản lý dự án này
                </button>
              ) : isFreelancer ? (
                <button
                  onClick={() => navigate(`/submit-proposal/${project._id}`)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" /> Gửi Báo Giá Ngay
                </button>
              ) : (
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

              {/* COMPONENT CONTRACTOR ĐƯỢC TÁI SỬ DỤNG */}
              <ContractorInfo contractorId={project.contractorId} />
            </div>

            {/* Box Report */}
            {!isOwner && !isGuest && (
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
