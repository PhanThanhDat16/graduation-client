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
  LogIn,
  CheckCircle2 // Thêm icon Check
} from 'lucide-react'
import { projectService } from '@/apis/projectService'
import { applicationService } from '@/apis/applicationService' // Thêm API application
import ContractorInfo from '@/components/ContractorInfo/ContractorInfo'
import { formatBudget, timeAgo } from '@/utils/fomatters'
import { useAuthStore } from '@/store/useAuthStore'

export default function ProjectDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  // LẤY THÔNG TIN USER TỪ STORE
  const { user } = useAuthStore()
  const isGuest = !user
  const currentUserRole = user?.role
  const currentUserId = user?._id || user?.id

  // GỌI API LẤY CHI TIẾT DỰ ÁN
  const {
    data: axiosResponse,
    isLoading: isLoadingProject,
    isError
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id as string),
    enabled: !!id
  })
  const project = axiosResponse?.data?.data

  // KIỂM TRA ĐÃ ỨNG TUYỂN CHƯA (Chỉ chạy khi user đã đăng nhập là Freelancer)
  const { data: myAppsRes, isLoading: isLoadingApps } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications(),
    enabled: !isGuest && currentUserRole === 'freelancer'
  })

  // Kiểm tra xem trong mảng applications của tôi có chứa id project này không
  const existingApplication = myAppsRes?.data?.data?.find((app) => app.projectId._id === id)
  console.log(myAppsRes)
  const hasApplied = !!existingApplication

  // --- XỬ LÝ LOADING CHUNG ---
  const isLoading = isLoadingProject || (currentUserRole === 'freelancer' && isLoadingApps)

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

  // --- TÍNH TOÁN QUYỀN ---
  const isOwner = currentUserRole === 'contractor' && currentUserId === project.contractorId
  const isOtherContractor = currentUserRole === 'contractor' && !isOwner
  const isFreelancer = currentUserRole === 'freelancer'
  const isLikedByMe = currentUserId ? project.listLike?.includes(currentUserId) : false

  const handleRequireLogin = () => {
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
          <div className="w-full lg:w-[65%] space-y-6">
            {/* Nếu đã nộp đơn, hiện một khung nhắc nhở nhẹ ở trên cùng */}
            {hasApplied && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-800 text-sm">Bạn đã nộp báo giá cho dự án này</h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    Đề xuất của bạn đã được gửi đi vào ngày{' '}
                    {new Date(existingApplication.appliedAt).toLocaleDateString('vi-VN')}. Khách hàng sẽ sớm phản hồi.
                  </p>
                </div>
              </div>
            )}

            {isOtherContractor && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  Bạn đang xem dự án này dưới góc độ là một Khách Hàng (Contractor). Bạn không thể ứng tuyển vào dự án
                  của người khác.
                </p>
              </div>
            )}

            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">Mô tả công việc</h2>
              <div className="text-text-main text-[15px] leading-relaxed whitespace-pre-line break-words">
                {project.description}
              </div>
            </div>

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

          <div className="w-full lg:w-[35%] space-y-6">
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

              {/* --- RENDER NÚT DỰA VÀO QUYỀN VÀ TRẠNG THÁI --- */}
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
                  onClick={() =>
                    hasApplied ? navigate('/applications/my') : navigate(`/submit-proposal/${project._id}`)
                  }
                  className={`w-full font-bold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${
                    hasApplied
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                      : 'bg-primary hover:bg-primary/90 text-white shadow-md'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Xem Báo Giá Của Bạn
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" /> Gửi Báo Giá Ngay
                    </>
                  )}
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

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-text-main mb-5">Về khách hàng này</h3>
              <ContractorInfo contractorId={project.contractorId} />
            </div>

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
