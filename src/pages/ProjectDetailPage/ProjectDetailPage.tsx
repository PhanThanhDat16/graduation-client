import { useState } from 'react'
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
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react'
import { projectService } from '@/apis/projectService'
import { applicationService } from '@/apis/applicationService'
import ContractorInfo from '@/components/ContractorInfo/ContractorInfo'
import { formatBudget, timeAgo } from '@/utils/fomatters'
import { useAuthStore } from '@/store/useAuthStore'
import ImageGalleryModal from '@/components/ImageGalleryModal'

export default function ProjectDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  // State quản lý xem ảnh full màn hình
  const [viewingImageIndex, setViewingImageIndex] = useState<number | null>(null)
  // LẤY THÔNG TIN USER TỪ STORE
  const { user } = useAuthStore()
  const isGuest = !user
  const currentUserRole = user?.role
  const currentUserId = user?._id

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

  // KIỂM TRA ĐÃ ỨNG TUYỂN CHƯA
  const { data: myAppsRes, isLoading: isLoadingApps } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications(),
    enabled: !isGuest && currentUserRole === 'freelancer'
  })

  const existingApplication = myAppsRes?.data?.data?.find((app: any) => app.projectId._id === id)
  const hasApplied = !!existingApplication

  // --- XỬ LÝ LOADING CHUNG ---
  const isLoading = isLoadingProject || (currentUserRole === 'freelancer' && isLoadingApps)

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen pt-12 pb-20 px-4 flex justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse mt-20">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải thông tin dự án...</p>
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="bg-slate-50 min-h-screen pt-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy dự án</h2>
          <p className="text-slate-500 mb-6">Dự án này có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  // --- TÍNH TOÁN QUYỀN ---
  const isOwner = currentUserRole === 'contractor' && currentUserId === project.contractorId._id
  const isOtherContractor = currentUserRole === 'contractor' && !isOwner
  const isFreelancer = currentUserRole === 'freelancer'
  const isLikedByMe = currentUserId ? project.listLike?.includes(currentUserId) : false

  const handleRequireLogin = () => {
    navigate('/login', { state: { from: location.pathname } })
  }

  return (
    <>
      <div className="bg-slate-50 min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900">
        {/* ── BREADCRUMB & BACK NAV ── */}
        <div className="bg-white border-b border-slate-200 pt-6 pb-6 shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm font-medium text-slate-500 mb-5">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors shrink-0 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
              <span className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full shrink-0"></span>
              <Link to="/projects" className="hover:text-indigo-600 transition-colors whitespace-nowrap">
                Khám phá Dự án
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-800 line-clamp-1 font-semibold">{project.category || 'Tất cả'}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 mb-4 leading-tight break-words">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-slate-600">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold border ${
                      project.status === 'open'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {project.status === 'open' ? 'Đang mở nhận báo giá' : 'Đã đóng'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" /> Đã đăng {timeAgo(project.createdAt)}
                  </span>
                </div>
              </div>

              {/* Nút thao tác nhanh trên Header */}
              <div className="flex items-center gap-3 shrink-0">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
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
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all shadow-sm ${
                      isLikedByMe
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-500 hover:border-red-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLikedByMe ? 'fill-red-500 text-red-500' : ''}`} />
                    {isLikedByMe ? 'Đã lưu' : 'Lưu dự án'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
            {/* CỘT TRÁI (NỘI DUNG CHÍNH) */}
            <div className="w-full lg:w-[65%] space-y-6">
              {/* Thông báo đã ứng tuyển */}
              {hasApplied && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                  <div className="bg-emerald-100 p-2 rounded-full shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 text-base mb-1">Bạn đã nộp báo giá cho dự án này</h3>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      Đề xuất của bạn đã được gửi đi vào ngày{' '}
                      <span className="font-bold">
                        {new Date(existingApplication.appliedAt).toLocaleDateString('vi-VN')}
                      </span>
                      . Khách hàng sẽ sớm phản hồi lại cho bạn.
                    </p>
                  </div>
                </div>
              )}

              {/* Thông báo Contractor khác */}
              {isOtherContractor && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                  <div className="bg-amber-100 p-2 rounded-full shrink-0">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-base mb-1">Tài khoản Khách hàng</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Bạn đang xem dự án này dưới góc độ là một Khách Hàng (Contractor). Bạn không thể ứng tuyển vào dự
                      án của người khác.
                    </p>
                  </div>
                </div>
              )}

              {/* Mô tả chi tiết */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-extrabold text-xl text-slate-900 mb-5 border-b border-slate-100 pb-4">
                  Mô tả công việc
                </h2>
                <div className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-line break-words">
                  {project.description}
                </div>
              </div>

              {/* Hình ảnh đính kèm (GALLERY MỚI) */}
              {project.images && project.images.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="font-extrabold text-xl text-slate-900 mb-5 border-b border-slate-100 pb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-500" /> Hình ảnh đính kèm
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {project.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setViewingImageIndex(idx)} // <-- Truyền INDEX vào state thay vì URL
                        className="aspect-video rounded-xl overflow-hidden cursor-pointer group border border-slate-200 shadow-sm relative bg-slate-50"
                      >
                        <img
                          src={img}
                          alt={`Project Attachment ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kỹ năng */}
              {project.skills && project.skills.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="font-extrabold text-xl text-slate-900 mb-5 border-b border-slate-100 pb-4">
                    Kỹ năng chuyên môn yêu cầu
                  </h2>
                  <div className="flex flex-wrap gap-2.5">
                    {project.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-indigo-50 border border-indigo-100/60 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Thống kê */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-extrabold text-xl text-slate-900 mb-5 border-b border-slate-100 pb-4">
                  Hoạt động trên dự án này
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <div className="text-2xl font-extrabold text-indigo-600 mb-1">0</div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Báo giá đã gửi</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <div className="text-2xl font-extrabold text-indigo-600 mb-1">0</div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Đang phỏng vấn</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <div className="text-2xl font-extrabold text-indigo-600 mb-1">0</div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Thư mời gửi đi</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <div className="text-2xl font-extrabold text-indigo-600 mb-1">{project.likes || 0}</div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Lượt lưu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (THAO TÁC & THÔNG TIN CONTRACTOR) */}
            <div className="w-full lg:w-[35%] space-y-6 lg:sticky lg:top-24">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">
                      Ngân sách dự kiến
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 break-words">
                      {formatBudget(project.budgetMin)}{' '}
                      {project.budgetMax ? `- ${formatBudget(project.budgetMax)}` : ''}{' '}
                      <span className="text-slate-500 text-base font-medium">₫</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 w-fit px-2 py-1 rounded-md uppercase">
                      <ShieldAlert className="w-3.5 h-3.5" /> Thanh toán Escrow
                    </div>
                  </div>
                </div>

                {/* --- RENDER NÚT DỰA VÀO QUYỀN VÀ TRẠNG THÁI --- */}
                {project.status !== 'open' ? (
                  <button
                    disabled
                    className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <AlertCircle className="w-5 h-5" /> Dự án đã đóng
                  </button>
                ) : isGuest ? (
                  <button
                    onClick={handleRequireLogin}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" /> Đăng nhập để ứng tuyển
                  </button>
                ) : isOwner ? (
                  <button
                    onClick={() =>
                      navigate(`/manage-projects/${project._id}/applications
                      `)
                    }
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-5 h-5" /> Quản lý dự án này
                  </button>
                ) : isFreelancer ? (
                  <button
                    onClick={() =>
                      hasApplied ? navigate('/applications/my') : navigate(`/submit-proposal/${project._id}`)
                    }
                    className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      hasApplied
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm'
                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5'
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
                    className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <AlertCircle className="w-5 h-5" /> Không thể ứng tuyển
                  </button>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-900 mb-5">Về khách hàng này</h3>
                <Link
                  to={`/profile/${project.contractorId._id}`}
                  className="hover:opacity-80 transition-opacity block p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50"
                >
                  <ContractorInfo contractorId={project.contractorId} />
                </Link>
              </div>

              {!isOwner && !isGuest && (
                <button className="w-full text-center text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1.5 py-2">
                  <AlertCircle className="w-4 h-4" /> Báo cáo bài đăng vi phạm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL XEM ẢNH FULL MÀN HÌNH ── */}
      {viewingImageIndex !== null && project.images && (
        <ImageGalleryModal
          images={project.images}
          initialIndex={viewingImageIndex}
          onClose={() => setViewingImageIndex(null)}
        />
      )}
    </>
  )
}
