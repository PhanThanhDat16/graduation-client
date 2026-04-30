import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileText,
  BadgePercent,
  Lightbulb
} from 'lucide-react'

import { projectService } from '@/apis/projectService'
import { applicationService } from '@/apis/applicationService'
import InputNumber from '@/components/InputNumber'
import { formatBudget } from '@/utils/fomatters'
import { proposalSchema, type ProposalSchema } from '@/utils/rules'
import { toast } from 'react-toastify'

const SERVICE_FEE_PERCENT = 0.1

const DURATION_OPTIONS = [
  { value: 'less than 1 month', label: 'Dưới 1 tháng', sub: '< 4 tuần' },
  { value: '1 to 3 months', label: '1 - 3 tháng', sub: '4-12 tuần' },
  { value: '3 to 6 months', label: '3 - 6 tháng', sub: '12-24 tuần' },
  { value: 'more than 6 months', label: 'Trên 6 tháng', sub: '> 24 tuần' }
]

export default function SubmitProposalPage() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProposalSchema>({
    resolver: yupResolver(proposalSchema),
    defaultValues: {
      proposal: '',
      proposedBudget: undefined as unknown as number,
      duration: 'less than 1 month'
    }
  })

  const watchedBudget = useWatch({ control, name: 'proposedBudget' }) || 0
  const watchedProposal = useWatch({ control, name: 'proposal' }) || ''

  const serviceFee = watchedBudget * SERVICE_FEE_PERCENT
  const receiveAmount = watchedBudget - serviceFee

  // 1. LẤY THÔNG TIN DỰ ÁN
  const { data: projectRes, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById(projectId as string),
    enabled: !!projectId
  })
  const project = projectRes?.data?.data

  // 2. KIỂM TRA XEM ĐÃ NỘP BÁO GIÁ CHƯA (Mới Thêm)
  const { data: myAppsRes, isLoading: isCheckingApp } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications(),
    enabled: !!projectId
  })

  // Tìm xem trong mảng applications của tôi có cái nào trùng projectId hiện tại không
  const existingApplication = myAppsRes?.data?.data?.find((app) => app.projectId._id === projectId)
  // console.log(myAppsRes)
  const submitMutation = useMutation({
    mutationFn: (body: any) => applicationService.createApplication(body),
    onSuccess: () => {
      toast.success('Gửi báo giá thành công!')
      navigate(`/projects/${projectId}`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra, có thể bạn đã ứng tuyển dự án này rồi!')
    }
  })

  const onSubmit = handleSubmit((data) => {
    submitMutation.mutate({
      projectId,
      proposal: data.proposal,
      proposedBudget: data.proposedBudget
    })
  })

  if (isLoadingProject || isCheckingApp) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-base">Đang kiểm tra thông tin...</p>
      </div>
    )
  }

  // NẾU ĐÃ NỘP ĐƠN RỒI -> CHẶN FORM LẠI (Mới Thêm)
  if (existingApplication) {
    return (
      <div className="bg-slate-50 min-h-screen font-body flex items-center justify-center p-4 text-slate-800">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-lg text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Bạn đã nộp báo giá!</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Bạn đã gửi đề xuất cho dự án <strong className="text-slate-900">"{project?.title}"</strong> vào ngày{' '}
            {new Date(existingApplication.appliedAt).toLocaleDateString('vi-VN')}.
          </p>
          <div className="flex flex-col gap-3">
            {/* Chuyển hướng đến trang quản lý báo giá cá nhân */}
            <button
              onClick={() => navigate('/applications/my')}
              className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Xem chi tiết báo giá đã nộp
            </button>
            <button
              onClick={() => navigate(`/projects/${projectId}`)}
              className="w-full py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Quay lại dự án
            </button>
          </div>
        </div>
      </div>
    )
  }

  // NẾU CHƯA NỘP -> RENDER FORM BÌNH THƯỜNG
  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24 text-slate-800">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-indigo-600 transition-colors group"
          >
            <span className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </span>
            Quay lại
          </button>
          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            Bảo vệ bởi Escrow
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Nộp đề xuất</p>
          <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">Gửi báo giá dự án</h1>
          <p className="text-base text-slate-500 mt-2">Điền đầy đủ thông tin bên dưới để gửi đề xuất đến khách hàng.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* ===== FORM ===== */}
          <div className="w-full lg:flex-1 space-y-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* BOX 1 — Giá thầu */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </span>
                  <h2 className="font-bold text-slate-900 text-lg">Chi phí dịch vụ</h2>
                </div>
                <div className="px-6 py-6 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="max-w-xs">
                      <p className="font-semibold text-base text-slate-800 mb-1">Giá thầu của bạn</p>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Tổng số tiền khách hàng sẽ trả nếu dự án thành công.
                      </p>
                    </div>
                    <div className="w-full md:w-72 shrink-0">
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-sm font-extrabold text-slate-400 z-10 pointer-events-none">
                          VND
                        </span>
                        <Controller
                          control={control}
                          name="proposedBudget"
                          render={({ field }) => (
                            <InputNumber
                              className="w-full"
                              classNameInput={`w-full pl-14 pr-4 py-3.5 border-2 rounded-xl font-bold text-base text-slate-900 outline-none transition-all bg-slate-50 focus:bg-white ${
                                errors.proposedBudget
                                  ? 'border-red-300 focus:border-red-400'
                                  : 'border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10'
                              }`}
                              {...field}
                              value={field.value || ''}
                            />
                          )}
                        />
                      </div>
                      {errors.proposedBudget && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" /> {errors.proposedBudget.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                    <div className="flex items-center justify-between px-5 py-4 text-base">
                      <span className="flex items-center gap-2 text-slate-600 font-medium">
                        <BadgePercent className="w-4 h-4" /> Phí nền tảng (10%)
                      </span>
                      <span className="font-bold text-red-500">– {formatBudget(serviceFee)} ₫</span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4">
                      <span className="text-base font-bold text-slate-800">Bạn thực nhận</span>
                      <span className="text-xl font-extrabold text-emerald-600">{formatBudget(receiveAmount)} ₫</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOX 2 — Thời gian */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                  <span className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </span>
                  <h2 className="font-bold text-slate-900 text-lg">Thời gian hoàn thành</h2>
                </div>
                <div className="px-6 py-6">
                  <p className="text-sm text-slate-500 mb-5">
                    Chọn mốc thời gian thực tế bạn cần để bàn giao sản phẩm.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DURATION_OPTIONS.map((opt) => (
                      <label key={opt.value} className="cursor-pointer">
                        <input type="radio" {...register('duration')} value={opt.value} className="sr-only peer" />
                        <div className="flex flex-col items-center text-center gap-1 px-3 py-4 rounded-xl border-2 border-slate-200 transition-all peer-checked:border-indigo-400 peer-checked:bg-indigo-50/60 hover:border-indigo-200 hover:bg-indigo-50/30">
                          <span className="text-sm font-bold text-slate-800 leading-snug">{opt.label}</span>
                          <span className="text-xs text-slate-500">{opt.sub}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* BOX 3 — Cover Letter */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                  <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <FileText className="w-5 h-5" />
                  </span>
                  <h2 className="font-bold text-slate-900 text-lg">Thư chào giá</h2>
                </div>
                <div className="px-6 py-6 space-y-4">
                  <div className="relative">
                    <textarea
                      {...register('proposal')}
                      rows={10}
                      placeholder="Gợi ý: Trình bày cách bạn tiếp cận bài toán này, các công nghệ sẽ sử dụng và đính kèm link Portfolio của bạn (GitHub, Behance, Google Drive)..."
                      className={`w-full p-5 border-2 rounded-xl text-base text-slate-800 leading-relaxed outline-none transition-all resize-y bg-slate-50 focus:bg-white ${
                        errors.proposal
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10'
                      }`}
                    />
                    <span className="absolute bottom-4 right-4 text-xs font-bold text-slate-400 pointer-events-none">
                      {watchedProposal.length}/5000
                    </span>
                  </div>
                  {errors.proposal && (
                    <p className="text-red-500 text-sm flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {errors.proposal.message}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 italic">
                    * Vui lòng chèn trực tiếp link tài liệu hoặc portfolio vào nội dung thư phía trên.
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-2 pb-8">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-700 text-base font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <span className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Gửi thẳng đến khách hàng
                  </span>
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full sm:w-auto px-10 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-current" />
                        Gửi Báo Giá
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">Thông tin dự án</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                    ĐANG MỞ
                  </span>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Tên dự án</p>
                    <Link
                      to={`/projects/${project?._id}`}
                      className="text-base font-bold text-indigo-600 hover:text-indigo-800 transition-colors line-clamp-2 leading-snug block"
                    >
                      {project?.title}
                    </Link>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Ngân sách</p>
                    <span className="text-base font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                      {formatBudget(project?.budgetMin)} – {formatBudget(project?.budgetMax)} ₫
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">Kỹ năng yêu cầu</p>
                    <div className="flex flex-wrap gap-2">
                      {project?.skills?.map((s: string) => (
                        <span key={s} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <Lightbulb className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-indigo-800">Bí kíp tăng tỷ lệ trúng thầu</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Cá nhân hóa thư — đừng dùng mẫu chung.',
                    'Đính kèm link portfolio liên quan.',
                    'Đặt câu hỏi thể hiện sự hiểu dự án.',
                    'Đặt giá sát ngân sách khách hàng.'
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2.5 text-sm text-indigo-900 font-medium leading-relaxed"
                    >
                      <span className="text-indigo-400 mt-1 shrink-0">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
