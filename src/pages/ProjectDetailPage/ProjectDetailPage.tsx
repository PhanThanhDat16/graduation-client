'use client'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  Loader2,
  Tag,
  CheckCircle2,
  MapPin
} from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import { useAuthStore } from '@/store/useAuthStore'

export default function ProjectDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { selectedProject, detailLoading, fetchProjectById, likeProject, clearSelectedProject } = useProjectStore()
  const { user } = useAuthStore()

  const currentUserId = (user as any)?._id || (user as any)?.id || ''
  const currentUserRole = (user as any)?.role || 'freelancer'

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (id) fetchProjectById(id)
    return () => clearSelectedProject()
  }, [id])

  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (detailLoading) {
    return (
      <div className="bg-page min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-text-sub">Đang tải dự án...</p>
        </div>
      </div>
    )
  }

  if (!selectedProject) {
    return (
      <div className="bg-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-text-main mb-2">Không tìm thấy dự án</p>
          <Link to="/projects" className="text-primary font-semibold hover:underline">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  const project = selectedProject
  const contractorData = project.contractorId as any
  const contractorId = typeof project.contractorId === 'string' ? project.contractorId : contractorData?._id

  const isOwner = currentUserRole === 'contractor' && currentUserId === contractorId
  const isOtherContractor = currentUserRole === 'contractor' && !isOwner
  const isFreelancer = currentUserRole === 'freelancer' || !currentUserRole

  const isLiked = project.listLike.includes(currentUserId)
  const isOpen = project.status === 'open'

  const timeAgo = (iso: string) => {
    const diff = new Date().getTime() - new Date(iso).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    return `${days} ngày trước`
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
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${isOpen ? 'bg-green-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                >
                  {isOpen ? 'Đang mở nhận báo giá' : 'Đã đóng'}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">
                  <Tag className="w-3 h-3" /> {project.category}
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary mb-4 leading-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-text-sub">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Đã đăng {timeAgo(project.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" /> {project.likes} lượt lưu
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-text-main hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4" /> {copied ? 'Đã sao chép!' : 'Chia sẻ'}
              </button>
              {isFreelancer && currentUserId && (
                <button
                  onClick={() => likeProject(project._id, currentUserId)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-colors shadow-sm ${isLiked ? 'bg-red-50 border-red-200 text-danger' : 'bg-white border-border text-text-main hover:bg-gray-50'}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-danger text-danger' : ''}`} />
                  {isLiked ? 'Đã lưu' : 'Lưu dự án'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="w-full lg:w-[65%] space-y-6">
            {isOtherContractor && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  Bạn đang xem dự án này dưới góc độ là một Khách Hàng (Contractor). Bạn không thể ứng tuyển vào dự án
                  của người khác.
                </p>
              </div>
            )}

            {/* Mô tả */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">Mô tả công việc</h2>
              <div className="text-text-main text-[15px] leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            </div>

            {/* Kỹ năng */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">
                Kỹ năng chuyên môn yêu cầu
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {project.skills.length > 0 ? (
                  project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-page border border-border rounded-xl text-sm font-bold text-text-sub hover:border-primary hover:text-primary transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-text-muted italic">Không yêu cầu kỹ năng cụ thể</p>
                )}
              </div>
            </div>

            {/* Hoạt động */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 border-b border-border pb-4">
                Hoạt động trên dự án này
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-primary mb-1">{project.likes}</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Lượt lưu</div>
                </div>
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-emerald-600 mb-1 capitalize">{project.status}</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Trạng thái</div>
                </div>
                <div className="bg-page rounded-xl p-4 text-center border border-border">
                  <div className="text-2xl font-extrabold text-indigo-600 mb-1">{project.category}</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Danh mục</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="w-full lg:w-[35%] space-y-6">
            {/* Budget + Action */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-primary shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text-muted uppercase mb-1">Ngân sách dự kiến</div>
                  <div className="text-xl font-extrabold text-emerald-600">
                    {formatMoney(project.budgetMin)} – {formatMoney(project.budgetMax)} ₫
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-text-sub bg-page w-fit px-2 py-1 rounded">
                    <ShieldAlert className="w-3.5 h-3.5 text-accent" /> Thanh toán Escrow
                  </div>
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={() => navigate('/manage-projects')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" /> Quản lý dự án này
                </button>
              )}

              {isFreelancer && isOpen && (
                <button
                  onClick={() => navigate(`/submit-proposal/${project._id}`)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" /> Gửi Báo Giá Ngay
                </button>
              )}

              {isFreelancer && !isOpen && (
                <div className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Dự án đã đóng
                </div>
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

            {/* Thông tin nhà tuyển dụng */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-text-main mb-5">Về khách hàng này</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-extrabold text-primary text-lg mb-1">
                    {contractorData?.name || contractorData?.email || 'Ẩn danh'}
                  </div>
                  {contractorData?.email && (
                    <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> {contractorData.email}
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-text-muted shrink-0" />
                  <div>
                    <div className="font-bold text-text-main">Việt Nam</div>
                    <div className="text-text-muted text-xs">Múi giờ: GMT+7</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-5 h-5 text-text-muted shrink-0" />
                  <div>
                    <div className="font-bold text-text-main">
                      Thành viên từ{' '}
                      {new Date(project.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report */}
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
