import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Wallet,
  Send,
  CheckSquare,
  PlayCircle,
  ShieldAlert,
  MessageSquare,
  Handshake,
  CalendarClock,
  Star
} from 'lucide-react'
import { toast } from 'react-toastify'

import { contractService } from '@/apis/contractService'
import { disputeService } from '@/apis/disputeService'
import { projectService } from '@/apis/projectService'
import { useAuthStore } from '@/store/useAuthStore'
import { reviewService } from '@/apis/reviewService'
import { formatBudget } from '@/utils/fomatters'
import { useCountdown } from '@/hooks/useCountdown'

import PaymentModal from './components/PaymentModal'
import DisputeModal from './components/DisputeModal'
import SubmitWorkModal from './components/SubmitWorkModal'
import DisputeDossier from './components/DisputeDossier'
import NegotiationModal from './components/NegotiationModal'
import ReviewModal from './components/ReviewModal'

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  // --- STATES ---
  const [signature, setSignature] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [showNegotiationModal, setShowNegotiationModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  // 1. FETCH DATA
  const { data: axiosResponse, isLoading: isContractLoading } = useQuery({
    queryKey: ['contract', id],
    staleTime: 0,
    queryFn: () => contractService.getContractById(id as string),
    enabled: !!id
  })
  const contract = axiosResponse?.data?.data

  const { data: disputeRes } = useQuery({
    queryKey: ['dispute-contract', id],
    queryFn: () => disputeService.getDisputeByContract(id as string),
    enabled: !!id
  })
  const currentDispute = disputeRes?.data?.data

  const { data: reviewRes } = useQuery({
    queryKey: ['review-contract', id],
    queryFn: () => reviewService.getReviewByContractId(id as string),
    enabled: !!id && contract?.status === 'completed'
  })
  const reviews = reviewRes?.data?.data || []
  // Tìm review mà MÌNH (Contractor) đã viết
  const existingReview = Array.isArray(reviews)
    ? reviews.find((r: any) => {
        const reviewerId = typeof r.reviewerId === 'string' ? r.reviewerId : r.reviewerId?._id
        return reviewerId === user?._id
      })
    : null

  // 2. ROLE CHECK (Nhận diện Khách hàng / Freelancer bằng ID)
  const contractorIdStr =
    typeof contract?.contractorId === 'string' ? contract?.contractorId : contract?.contractorId?._id

  const isContractor = user?._id === contractorIdStr
  const userRole = isContractor ? 'contractor' : 'freelancer'

  const hasAgreed = isContractor ? contract?.contractorAgreed : contract?.freelancerAgreed
  const partnerAgreed = isContractor ? contract?.freelancerAgreed : contract?.contractorAgreed

  // 3. COUNTDOWN LOGIC
  const { minutes, seconds, isExpired } = useCountdown(currentDispute?.reasonDeadline)

  const contractDeadline = (contract?.expandCount || 0) > 0 ? contract?.expandDeadline : contract?.deadline
  const {
    days: cDays,
    hours: cHours,
    minutes: cMin,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    seconds: cSec,
    isExpired: cExpired
  } = useCountdown(contractDeadline)

  const checkDeadlineMutation = useMutation({
    mutationFn: () => disputeService.checkDeadline(currentDispute._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispute-contract', id] })
    }
  })

  useEffect(() => {
    if (isExpired && currentDispute?.status === 'pending_reasons') {
      checkDeadlineMutation.mutate()
    }
  }, [isExpired, currentDispute?.status])

  // 4. MUTATIONS (Các hành động cập nhật trạng thái)
  const agreeMutation = useMutation({
    mutationFn: () => contractService.agreeToContract(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      toast.success('Đã ký xác nhận hợp đồng thành công!')
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại.')
  })

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await contractService.cancelContract(id as string)
      const projectId = typeof contract?.projectId === 'string' ? contract?.projectId : contract?.projectId?._id
      await projectService.updateProject(projectId as string, { status: 'open' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      queryClient.invalidateQueries({ queryKey: ['my-contracts'] })
      queryClient.invalidateQueries({ queryKey: ['my-projects'] })
      toast.success('Hợp đồng đã được huỷ. Dự án mở tuyển trở lại!')
    },
    onError: () => toast.error('Không thể huỷ hợp đồng lúc này.')
  })

  const completeMutation = useMutation({
    mutationFn: () => contractService.completeContract(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      toast.success('Đã nghiệm thu và giải ngân thành công!')
    }
  })

  const escalateMutation = useMutation({
    mutationFn: () => disputeService.escalateDispute(currentDispute._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispute-contract', id] })
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      toast.success('Đã đẩy khiếu nại lên Ban Quản Trị!')
    },
    onError: () => toast.error('Lỗi khi yêu cầu Admin.')
  })

  const agreeResolutionMutation = useMutation({
    mutationFn: () => disputeService.agreeResolution(currentDispute._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispute-contract', id] })
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      toast.success('Đã đồng ý với đề xuất! Tranh chấp đã được giải quyết.')
    },
    onError: () => toast.error('Lỗi khi xác nhận đồng ý.')
  })

  // 5. HANDLERS
  const handleAgree = () => {
    if (signature.trim().length < 2) {
      toast.warning('Vui lòng nhập đầy đủ Họ và Tên để làm chữ ký điện tử.')
      return
    }
    if (window.confirm('Bạn có chắc chắn muốn ký và chấp thuận hợp đồng này?')) {
      agreeMutation.mutate()
    }
  }

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc chắn muốn HUỶ hợp đồng này không? Hành động này không thể hoàn tác.')) {
      cancelMutation.mutate()
    }
  }

  // 6. RENDER LOGIC: NÚT ACTION TRÊN TOOLBAR
  const renderActionButtons = () => {
    const isDisputeActive =
      currentDispute && !['resolved', 'auto_closed', 'staff_cancelled'].includes(currentDispute.status)

    // --- A. LUỒNG TRANH CHẤP ---
    if (isDisputeActive) {
      const myReason = isContractor ? currentDispute.contractorReason : currentDispute.freelancerReason
      const iHaveSubmittedReason = myReason && myReason.trim().length > 0

      if (currentDispute.status === 'pending_reasons') {
        if (!iHaveSubmittedReason) {
          return (
            <button
              onClick={() => setShowDisputeModal(true)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white transition-colors shadow-sm bg-amber-600 hover:bg-amber-700 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4" /> Bổ sung lời khai
            </button>
          )
        } else {
          return (
            <button
              disabled
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold cursor-not-allowed text-slate-500 bg-slate-200 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4" /> Đang chờ đối tác...
            </button>
          )
        }
      }

      if (currentDispute.status === 'waiting_escalation') {
        return (
          <button
            onClick={() => escalateMutation.mutate()}
            disabled={escalateMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white transition-colors bg-red-600 shadow-sm hover:bg-red-700 rounded-xl disabled:opacity-50"
          >
            <ShieldAlert className="w-4 h-4" /> Yêu cầu Admin phân xử
          </button>
        )
      }

      return (
        <button
          onClick={() => navigate(`/messages`)}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white transition-colors shadow-sm bg-slate-800 hover:bg-slate-900 rounded-xl"
        >
          <MessageSquare className="w-4 h-4" /> Vào Box Chat
        </button>
      )
    }

    // --- B. LUỒNG BÌNH THƯỜNG ---
    if (contract?.status === 'waiting_payment') {
      const hasPaid = isContractor ? contract.contractorPaid : contract.freelancerPaid
      const needToPay = isContractor
        ? contract.paymentInfo?.contractorRemaining > 0
        : contract.paymentInfo?.freelancerRemaining > 0
      if (hasPaid) {
        return (
          <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold border text-emerald-600 bg-emerald-50 border-emerald-200 rounded-xl">
            <CheckCircle2 className="w-4 h-4" /> Bạn đã thanh toán. Chờ đối tác...
          </div>
        )
      }
      if (needToPay) {
        return (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white transition-colors shadow-sm bg-emerald-600 hover:bg-emerald-700 rounded-xl"
          >
            <Wallet className="w-4 h-4" /> Thanh toán cọc ngay
          </button>
        )
      }
    }

    if (contract?.status === 'running') {
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDisputeModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 transition-colors border border-red-200 shadow-sm bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl"
          >
            <AlertTriangle className="w-4 h-4" /> Khiếu nại
          </button>
          {!isContractor && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white transition-colors bg-indigo-600 shadow-sm hover:bg-indigo-700 rounded-xl"
            >
              <Send className="w-4 h-4" /> Nộp sản phẩm
            </button>
          )}
        </div>
      )
    }

    if (contract?.status === 'submitted') {
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDisputeModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 transition-colors border border-red-200 shadow-sm bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl"
          >
            <AlertTriangle className="w-4 h-4" /> Khiếu nại
          </button>
          {isContractor && (
            <button
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white transition-colors shadow-sm bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-70"
            >
              <CheckSquare className="w-4 h-4" />{' '}
              {completeMutation.isPending ? 'Đang xử lý...' : 'Nghiệm thu & Giải ngân'}
            </button>
          )}
        </div>
      )
    }

    if (contract?.status === 'completed') {
      if (isContractor) {
        if (existingReview) {
          return (
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-yellow-600 border border-yellow-200 bg-yellow-50 rounded-xl">
              <Star className="w-4 h-4 fill-yellow-500" /> Đã đánh giá
            </div>
          )
        }
        return (
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white transition-colors bg-yellow-500 shadow-sm hover:bg-yellow-600 rounded-xl animate-pulse"
          >
            <Star className="w-4 h-4 fill-white" /> Đánh giá Freelancer
          </button>
        )
      }
    }

    return null
  }

  // 7. RENDER LOGIC: KHU VỰC THƯƠNG LƯỢNG (Chỉ hiện khi Admin đã vào - negotiating)
  const renderNegotiationArea = () => {
    // Chỉ hiện khi Admin đã Join (negotiating) hoặc đang chờ Review
    if (!['negotiating', 'admin_review'].includes(currentDispute?.status)) return null

    // Kiểm tra xem ĐÃ CÓ ĐỀ XUẤT CHƯA: Dựa vào việc resolutionType có tồn tại hay không
    const hasProposal = !!currentDispute.resolutionType

    if (hasProposal) {
      // Xác định ai là người đề xuất:
      // Nếu mình là Contractor và contractorAgreed=true, freelancerAgreed=false => Mình là người đề xuất
      // Nếu mình là Freelancer và freelancerAgreed=true, contractorAgreed=false => Mình là người đề xuất
      const iAmAgreed = isContractor ? currentDispute.contractorAgreed : currentDispute.freelancerAgreed
      const partnerAgreed = isContractor ? currentDispute.freelancerAgreed : currentDispute.contractorAgreed

      const isMyProposal = iAmAgreed && !partnerAgreed
      const amountFormat = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫'

      return (
        <div className="max-w-4xl px-4 mx-auto mb-8 sm:px-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 border-2 border-blue-200 shadow-sm bg-blue-50 rounded-2xl">
            <h3 className="flex items-center gap-2 mb-3 text-lg font-black text-blue-900">
              <Handshake className="w-5 h-5 text-blue-600" />
              Đề xuất giải quyết hiện tại
            </h3>

            <div className="p-4 mb-5 bg-white border border-blue-100 rounded-xl">
              <p className="mb-3 text-sm font-medium text-slate-600">
                Người đề xuất: <strong className="text-slate-900">{isMyProposal ? 'Bạn' : 'Đối phương'}</strong>
              </p>

              <div className="p-3 border rounded-lg bg-slate-50 border-slate-100">
                {currentDispute.resolutionType === 'cancel' && (
                  <p className="flex items-center gap-2 font-bold text-red-600">
                    <XCircle className="w-4 h-4" /> Hủy hợp đồng (Hoàn tiền 100% cho Khách)
                  </p>
                )}
                {currentDispute.resolutionType === 'extend' && (
                  <p className="flex items-center gap-2 font-bold text-amber-600">
                    <CalendarClock className="w-4 h-4" /> Gia hạn thêm đến:{' '}
                    {new Date(currentDispute.newDeadline).toLocaleDateString('vi-VN')}
                  </p>
                )}
                {currentDispute.resolutionType === 'split' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Freelancer nhận</span>
                      <strong className="text-lg text-indigo-600">
                        {amountFormat(currentDispute.freelancerAmount || 0)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Khách được hoàn</span>
                      <strong className="text-lg text-emerald-600">
                        {amountFormat(currentDispute.contractorAmount || 0)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nút hành động */}
            {isMyProposal ? (
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 text-sm font-bold text-blue-600 animate-pulse">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Đang chờ đối phương xác nhận đề xuất này...
                </p>
                <button
                  onClick={() => setShowNegotiationModal(true)}
                  className="text-xs font-bold underline w-fit text-slate-500 hover:text-blue-600"
                >
                  Thay đổi đề xuất khác
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Bạn có chắc chắn ĐỒNG Ý với đề xuất này? Tiền sẽ được chia và tranh chấp kết thúc.'
                      )
                    ) {
                      agreeResolutionMutation.mutate()
                    }
                  }}
                  disabled={agreeResolutionMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Đồng ý & Chốt hồ sơ
                </button>

                <button
                  onClick={() => setShowNegotiationModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-xl transition-all"
                >
                  Đưa ra đề xuất khác
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // Nếu chưa có ai đề xuất gì
    return (
      <div className="max-w-4xl px-4 mx-auto mb-8 sm:px-6 animate-in fade-in">
        <div className="p-8 text-center border-2 border-dashed bg-slate-50 border-slate-300 rounded-2xl">
          <Handshake className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <h3 className="mb-1 text-lg font-bold text-slate-700">Bàn Thương Lượng</h3>
          <p className="max-w-md mx-auto mb-5 text-sm leading-relaxed text-slate-500">
            Staff đã tham gia. Bây giờ hai bên có thể đưa ra đề xuất chia tiền hoặc gia hạn để tự giải quyết nhanh
            chóng.
          </p>
          <button
            onClick={() => setShowNegotiationModal(true)}
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white transition-all shadow-lg bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            Đưa ra đề xuất giải quyết
          </button>
        </div>
      </div>
    )
  }

  // ====================== RENDERING ======================
  if (isContractLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
        <p className="font-medium text-slate-500">Đang tải tài liệu hợp đồng...</p>
      </div>
    )
  }

  if (!contract) return <div className="py-20 font-bold text-center text-slate-500">Không tìm thấy hợp đồng</div>

  const contractorInfo = contract.contractorId as any
  const freelancerInfo = contract.freelancerId as any
  const isDisputeActive =
    currentDispute && !['resolved', 'auto_closed', 'staff_cancelled'].includes(currentDispute.status)

  return (
    <div className="min-h-screen pb-24 bg-slate-100 font-body text-slate-800">
      {/* ── TOOLBAR ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-40 shadow-sm">
        <div className="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 transition-colors text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Mã HĐ: #{contract._id.slice(-6).toUpperCase()}
              </p>
              <h1 className="flex items-center gap-2 text-xl font-extrabold font-heading text-slate-900">
                Chi tiết Hợp đồng
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="items-center hidden gap-2 px-4 py-2 text-sm font-bold transition-colors sm:flex text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
              <Printer className="w-4 h-4" /> In PDF
            </button>
            {renderActionButtons()}
          </div>
        </div>
      </div>

      {/* ── STATUS BANNER ── */}
      <div className="max-w-4xl px-4 mx-auto mt-8 sm:px-6">
        {/* BANNER TRANH CHẤP */}
        {isDisputeActive && (
          <div className="flex flex-col items-center gap-5 p-5 mb-6 text-red-900 border-2 border-red-200 shadow-sm bg-red-50 rounded-2xl md:flex-row md:items-start">
            <div className="flex items-start flex-1 w-full gap-3">
              <ShieldAlert className="w-6 h-6 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="text-lg font-black">Dự án đang xảy ra tranh chấp!</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-red-700">
                  {currentDispute.status === 'pending_reasons'
                    ? 'Hai bên có thời gian để điền biểu mẫu bổ sung lời khai / bằng chứng bảo vệ quyền lợi của mình.'
                    : currentDispute.status === 'waiting_escalation'
                      ? 'Đã thu thập đủ lời khai. Vui lòng bấm "Yêu cầu Admin phân xử" ở thanh công cụ phía trên.'
                      : 'Hồ sơ khiếu nại đã được chuyển lên Ban Quản Trị. Quản trị viên sẽ sớm tham gia vào nhóm chat để hỗ trợ giải quyết.'}
                </p>
              </div>
            </div>

            {/* ĐỒNG HỒ ĐẾM NGƯỢC */}
            {currentDispute.status === 'pending_reasons' && (
              <div className="bg-white border-2 border-red-200 rounded-xl px-4 py-2 text-center shadow-sm min-w-[140px] shrink-0 w-full md:w-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Thời gian còn lại</p>
                <div className="flex items-center justify-center gap-1 font-mono text-2xl font-black text-red-600 animate-pulse">
                  {isExpired ? '00:00' : `${minutes}:${seconds}`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CÁC BANNER BÌNH THƯỜNG KHÁC */}
        {!isDisputeActive && contract.status === 'cancelled' && (
          <div className="flex items-start gap-3 p-4 mb-6 text-red-700 border border-red-200 bg-red-50 rounded-xl">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Hợp đồng đã bị huỷ</p>
              <p className="text-sm">Một trong hai bên đã từ chối hoặc quá hạn xác nhận.</p>
            </div>
          </div>
        )}

        {!isDisputeActive && (contract.status === 'draft' || contract.status === 'pending_agreement') && (
          <div className="flex items-start gap-3 p-4 mb-6 border bg-amber-50 border-amber-200 text-amber-800 rounded-xl">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đang chờ chữ ký xác nhận</p>
              <p className="mt-1 text-sm">
                {!hasAgreed
                  ? 'Vui lòng đọc kỹ các điều khoản bên dưới. Nếu đồng ý, hãy điền chữ ký điện tử ở cuối trang để xác nhận.'
                  : !partnerAgreed
                    ? 'Bạn đã ký. Đang chờ đối tác kiểm tra và chấp thuận hợp đồng này.'
                    : 'Đang xử lý...'}
              </p>
            </div>
          </div>
        )}

        {!isDisputeActive && contract.status === 'waiting_payment' && (
          <div className="p-4 mb-6 text-blue-800 border border-blue-200 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Cả 2 bên đã xác nhận! Vui lòng thanh toán cọc để dự án bắt đầu.</p>
                <div className="flex items-center gap-4 mt-3">
                  <div
                    className={`flex items-center gap-1.5 text-sm font-bold ${contract.contractorPaid ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Khách hàng {contract.contractorPaid ? 'đã cọc' : 'chưa cọc'}
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-sm font-bold ${contract.freelancerPaid ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Freelancer {contract.freelancerPaid ? 'đã cọc' : 'chưa cọc'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isDisputeActive && contract.status === 'running' && (
          <div className="flex items-start justify-between gap-5 p-4 mb-6 text-indigo-800 border border-indigo-200 bg-indigo-50 rounded-xl">
            <div className="flex items-start gap-3">
              <PlayCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Dự án đang được thực hiện</p>
                <p className="mt-1 text-sm">
                  {!isContractor
                    ? 'Tiền cọc đã được lưu trong ví Escrow an toàn. Hãy bắt đầu công việc và nộp sản phẩm khi hoàn thành nhé!'
                    : 'Freelancer đang tiến hành công việc. Bạn sẽ nhận được thông báo khi có sản phẩm bàn giao.'}
                </p>
              </div>
            </div>

            {/* COUNTDOWN DEADLINE */}
            <div className="flex-col items-end hidden md:flex shrink-0">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Thời hạn còn lại</p>
              <div className="flex items-center gap-1.5 font-mono">
                {cExpired ? (
                  <span className="font-bold text-red-500">Đã quá hạn</span>
                ) : (
                  <>
                    {cDays > 0 && (
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-indigo-600">{cDays}</span>
                        <span className="text-[8px] uppercase font-bold text-slate-400 -mt-1">Ngày</span>
                      </div>
                    )}
                    {cDays > 0 && <span className="font-bold text-indigo-300">:</span>}
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-black text-indigo-600">{cHours}</span>
                      <span className="text-[8px] uppercase font-bold text-slate-400 -mt-1">Giờ</span>
                    </div>
                    <span className="font-bold text-indigo-300">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-black text-indigo-600">{cMin}</span>
                      <span className="text-[8px] uppercase font-bold text-slate-400 -mt-1">Phút</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!isDisputeActive && contract.status === 'submitted' && (
          <div className="flex items-start gap-3 p-4 mb-6 text-purple-800 border border-purple-200 bg-purple-50 rounded-xl">
            <Send className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đã nộp sản phẩm</p>
              <p className="mt-1 text-sm">
                {isContractor ? (
                  <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-xl">
                    <p className="text-sm leading-relaxed text-slate-700">
                      Freelancer đã nộp sản phẩm. Vui lòng kiểm tra và tiến hành nghiệm thu để giải ngân.
                    </p>

                    <div className="mt-4 space-y-3">
                      {contract.githubLink && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-slate-700">Github Repository:</span>

                          <a
                            href={contract.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-800"
                          >
                            xem tại đây
                          </a>
                        </div>
                      )}

                      {contract.webLink && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-slate-700">Website Demo:</span>

                          <a
                            href={contract.webLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-800"
                          >
                            xem tại đây
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  'Sản phẩm đã được gửi thành công. Đang chờ khách hàng nghiệm thu.'
                )}
              </p>
            </div>
          </div>
        )}

        {!isDisputeActive && contract.status === 'completed' && (
          <div className="flex items-start gap-3 p-4 mb-6 border bg-emerald-50 border-emerald-200 text-emerald-800 rounded-xl">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Hợp đồng hoàn tất</p>
              <p className="mt-1 text-sm">Dự án đã được nghiệm thu và tiền đã được giải ngân thành công.</p>
            </div>
          </div>
        )}
      </div>

      {/* ── HỒ SƠ TRANH CHẤP & THƯƠNG LƯỢNG ── */}
      {isDisputeActive && <DisputeDossier currentDispute={currentDispute} />}
      {renderNegotiationArea()}

      {/* ── BẢN HỢP ĐỒNG ── */}
      <div className="max-w-4xl px-4 mx-auto mb-12 sm:px-6">
        <div className="bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-16 border border-slate-200 relative overflow-hidden">
          {contract.status === 'cancelled' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span className="font-black text-red-600 uppercase -rotate-45 text-9xl">Cancelled</span>
            </div>
          )}
          {isDisputeActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="font-black tracking-tighter text-red-600 uppercase -rotate-45 text-9xl">Disputed</span>
            </div>
          )}

          <div className="mb-12 text-center">
            <h2 className="text-lg font-bold uppercase">Cộng hòa Xã hội Chủ nghĩa Việt Nam</h2>
            <h3 className="mb-8 text-sm font-bold underline uppercase">Độc lập - Tự do - Hạnh phúc</h3>
            <h1 className="text-2xl font-black tracking-wide uppercase sm:text-3xl text-slate-900">
              Hợp Đồng Dịch Vụ Tự Do
            </h1>
            <p className="mt-2 font-medium text-slate-500">Mã số: {contract._id}</p>
          </div>

          <div className="space-y-8 mb-10 text-[15px] leading-relaxed">
            <p>Hôm nay, ngày {new Date(contract.createdAt).toLocaleDateString('vi-VN')}. Chúng tôi gồm có:</p>

            <div className="p-6 border bg-slate-50 rounded-xl border-slate-100">
              <h3 className="mb-3 text-lg font-bold text-indigo-900 uppercase">
                Bên A (Bên thuê dịch vụ / Khách hàng)
              </h3>
              <ul className="space-y-2">
                <li>
                  <span className="inline-block w-32 font-bold">Họ và tên:</span> {contractorInfo?.fullName || '---'}
                </li>
                <li>
                  <span className="inline-block w-32 font-bold">Email liên hệ:</span> {contractorInfo?.email || '---'}
                </li>
                <li>
                  <span className="inline-block w-32 font-bold">Vai trò:</span> Chủ đầu tư dự án
                </li>
              </ul>
            </div>

            <div className="p-6 border bg-slate-50 rounded-xl border-slate-100">
              <h3 className="mb-3 text-lg font-bold text-indigo-900 uppercase">
                Bên B (Bên cung cấp dịch vụ / Freelancer)
              </h3>
              <ul className="space-y-2">
                <li>
                  <span className="inline-block w-32 font-bold">Họ và tên:</span> {freelancerInfo?.fullName || '---'}
                </li>
                <li>
                  <span className="inline-block w-32 font-bold">Email liên hệ:</span> {freelancerInfo?.email || '---'}
                </li>
                <li>
                  <span className="inline-block w-32 font-bold">Vai trò:</span> Chuyên gia thực hiện dự án
                </li>
              </ul>
            </div>

            <p>
              Hai bên cùng thống nhất ký kết Hợp đồng Dịch vụ thông qua nền tảng <strong>FreelanceVN</strong> với các
              điều khoản:
            </p>
          </div>

          <div className="space-y-6 text-[15px] leading-relaxed">
            <div>
              <h3 className="mb-2 text-lg font-bold">Điều 1: Nội dung công việc</h3>
              <div className="p-4 mt-3 italic whitespace-pre-line border-l-4 bg-slate-50 border-slate-300 rounded-r-xl">
                {contract.contractorTerms}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold">Điều 2: Thời gian thực hiện</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Hợp đồng bắt đầu có hiệu lực kể từ khi Bên A hoàn tất thanh toán tiền cọc vào ví trung gian (Escrow).
                </li>
                <li>
                  Thời hạn bàn giao sản phẩm dự kiến (Deadline):{' '}
                  <strong className={cExpired ? 'text-red-600' : 'text-indigo-600'}>
                    {contractDeadline ? new Date(contractDeadline).toLocaleDateString('vi-VN') : '---'}
                  </strong>
                  {contract.expandCount > 0 && (
                    <span className="ml-2 text-xs italic font-bold text-amber-600">
                      (Đã gia hạn {contract.expandCount} lần)
                    </span>
                  )}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold">Điều 3: Phí dịch vụ & Thanh toán</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Tổng thù lao Bên A đồng ý thanh toán cho Bên B là:{' '}
                  <strong>{formatBudget(contract.totalAmount)} VNĐ</strong>.
                </li>
                <li>Khoản tiền này sẽ được giữ an toàn bởi hệ thống Escrow trong suốt quá trình thực hiện dự án.</li>
                <li>Tiền chỉ được giải ngân cho Bên B khi Bên A xác nhận nghiệm thu sản phẩm đạt yêu cầu.</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 mt-12 border-t-2 border-slate-100">
            <div className="grid grid-cols-2 gap-8 text-center">
              {/* CỘT CHỮ KÝ BÊN A */}
              <div>
                <h4 className="text-lg font-bold uppercase text-slate-900">Đại diện Bên A</h4>
                <p className="mb-8 text-sm text-slate-500">(Khách hàng)</p>

                {contract.contractorAgreed ? (
                  <div className="inline-block p-4 border-2 rounded-lg border-emerald-500 bg-emerald-50 text-emerald-700 animate-in zoom-in">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold uppercase">Đã xác nhận</p>
                    <p className="mt-1 text-xs">{contractorInfo?.fullName}</p>
                  </div>
                ) : isContractor && contract.status !== 'cancelled' ? (
                  <div className="p-4 text-left border bg-slate-50 rounded-xl border-slate-200">
                    <p className="mb-2 text-xs font-bold text-slate-500">Gõ tên bạn để ký điện tử:</p>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder={user?.fullName}
                      className="w-full px-3 py-2 mb-3 font-serif text-sm italic border rounded-lg outline-none border-slate-300 focus:border-indigo-500"
                    />
                    <button
                      onClick={handleAgree}
                      disabled={agreeMutation.isPending}
                      className="w-full py-2 text-sm font-bold text-white transition-colors rounded-lg bg-slate-900 hover:bg-slate-800"
                    >
                      Ký & Chấp thuận
                    </button>
                  </div>
                ) : (
                  <p className="mt-8 italic text-slate-400">Đang chờ ký...</p>
                )}
              </div>

              {/* CỘT CHỮ KÝ BÊN B */}
              <div>
                <h4 className="text-lg font-bold uppercase text-slate-900">Đại diện Bên B</h4>
                <p className="mb-8 text-sm text-slate-500">(Freelancer)</p>

                {contract.freelancerAgreed ? (
                  <div className="inline-block p-4 border-2 rounded-lg border-emerald-500 bg-emerald-50 text-emerald-700 animate-in zoom-in">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold uppercase">Đã xác nhận</p>
                    <p className="mt-1 text-xs">{freelancerInfo?.fullName}</p>
                  </div>
                ) : !isContractor && contract.status !== 'cancelled' ? (
                  <div className="p-4 text-left border bg-slate-50 rounded-xl border-slate-200">
                    <p className="mb-2 text-xs font-bold text-slate-500">Gõ tên bạn để ký điện tử:</p>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder={user?.fullName}
                      className="w-full px-3 py-2 mb-3 font-serif text-sm italic border rounded-lg outline-none border-slate-300 focus:border-indigo-500"
                    />
                    <button
                      onClick={handleAgree}
                      disabled={agreeMutation.isPending}
                      className="w-full py-2 text-sm font-bold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                      Ký & Chấp thuận
                    </button>
                  </div>
                ) : (
                  <p className="mt-8 italic text-slate-400">Đang chờ ký...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* NÚT HUỶ HỢP ĐỒNG */}
        {!hasAgreed && contract.status !== 'cancelled' && contract.status !== 'waiting_payment' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:text-red-700"
            >
              <AlertTriangle className="w-4 h-4" />
              Tôi không đồng ý với các điều khoản này (Huỷ Hợp đồng)
            </button>
          </div>
        )}
      </div>

      {/* ── CÁC MODAL ── */}
      {showPaymentModal && (
        <PaymentModal
          contract={contract}
          userRole={userRole as 'contractor' | 'freelancer'}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showSubmitModal && (
        <SubmitWorkModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          contractId={contract._id}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['contract', contract._id] })}
        />
      )}

      {showDisputeModal && (
        <DisputeModal
          isOpen={showDisputeModal}
          onClose={() => setShowDisputeModal(false)}
          contractId={contract._id}
          disputeId={currentDispute?._id || null}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['dispute-contract', id] })
            queryClient.invalidateQueries({ queryKey: ['contract', id] })
          }}
        />
      )}

      {showNegotiationModal && (
        <NegotiationModal
          isOpen={showNegotiationModal}
          onClose={() => setShowNegotiationModal(false)}
          disputeId={currentDispute?._id}
          totalEscrowAmount={contract.totalAmount}
          currentDeadline={contract.deadline}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['dispute-contract', id] })
          }}
        />
      )}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        contractId={id as string}
        freelancerName={freelancerInfo?.fullName || 'Freelancer'}
      />
    </div>
  )
}
