import { useState } from 'react'
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
  PlayCircle
} from 'lucide-react'
import { toast } from 'react-toastify' // Thay alert bằng toast cho chuyên nghiệp

import { contractService } from '@/apis/contractService'
import { useAuthStore } from '@/store/useAuthStore'
import { formatBudget } from '@/utils/fomatters'
import PaymentModal from './components/PaymentModal' // Đảm bảo bạn đã tạo file này theo code tôi gửi lúc nãy
import { projectService } from '@/apis/projectService'

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [signature, setSignature] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // 1. FETCH DỮ LIỆU HỢP ĐỒNG
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => contractService.getContractById(id as string),
    enabled: !!id
  })

  const contract = axiosResponse?.data?.data

  // 2. NHẬN DIỆN VAI TRÒ & TRẠNG THÁI
  const userRole = user?.role || 'freelancer'
  const isContractor = userRole === 'contractor'

  const hasAgreed = isContractor ? contract?.contractorAgreed : contract?.freelancerAgreed
  const partnerAgreed = isContractor ? contract?.freelancerAgreed : contract?.contractorAgreed

  // 3. MUTATIONS (CÁC HÀNH ĐỘNG CẬP NHẬT TRẠNG THÁI)
  const agreeMutation = useMutation({
    mutationFn: () => contractService.agreeToContract(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      toast.success('Đã ký xác nhận hợp đồng thành công!')
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại.')
  })

  const cancelMutation = useMutation({
    // Đổi mutationFn thành hàm async để gọi 2 API
    mutationFn: async () => {
      // 1. Gọi API Hủy Hợp đồng
      await contractService.cancelContract(id as string)

      // 2. Gọi API Cập nhật Dự án về trạng thái 'open'
      const projectId = contract?.projectId._id as string
      await projectService.updateProject(projectId, { status: 'open' })
    },
    onSuccess: () => {
      // Load lại thông tin Hợp đồng
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      queryClient.invalidateQueries({ queryKey: ['my-contracts'] })
      queryClient.invalidateQueries({ queryKey: ['my-projects'] })

      toast.success('Hợp đồng đã được huỷ. Dự án mở tuyển trở lại!')
    },
    onError: () => toast.error('Không thể huỷ hợp đồng lúc này.')
  })

  const submitMutation = useMutation({
    mutationFn: () => contractService.submitContract(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      toast.success('Đã nộp sản phẩm cho Khách hàng!')
    }
  })

  const completeMutation = useMutation({
    mutationFn: () => contractService.completeContract(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      toast.success('Đã nghiệm thu và giải ngân thành công!')
    }
  })

  // 4. HANDLERS
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

  // 5. RENDER LOGIC: NÚT ACTION TRÊN TOOLBAR
  const renderActionButtons = () => {
    if (contract?.status === 'waitingPayment') {
      const needToPay = isContractor
        ? contract.paymentInfo?.contractorMustPay > 0
        : contract.paymentInfo?.freelancerMustPay > 0

      if (needToPay) {
        return (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
          >
            <Wallet className="w-4 h-4" /> Thanh toán cọc ngay
          </button>
        )
      }
    }

    if (contract?.status === 'running' && !isContractor) {
      return (
        <button
          onClick={() => submitMutation.mutate()}
          disabled={submitMutation.isPending}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-70"
        >
          <Send className="w-4 h-4" /> {submitMutation.isPending ? 'Đang gửi...' : 'Nộp sản phẩm'}
        </button>
      )
    }

    if (contract?.status === 'submitted' && isContractor) {
      return (
        <button
          onClick={() => completeMutation.mutate()}
          disabled={completeMutation.isPending}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm disabled:opacity-70"
        >
          <CheckSquare className="w-4 h-4" /> {completeMutation.isPending ? 'Đang xử lý...' : 'Nghiệm thu & Giải ngân'}
        </button>
      )
    }

    return null
  }

  // UI LOADING & LỖI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Đang tải tài liệu hợp đồng...</p>
      </div>
    )
  }

  if (!contract) return <div className="text-center py-20 font-bold text-slate-500">Không tìm thấy hợp đồng</div>

  const contractorInfo = contract.contractorId as any
  const freelancerInfo = contract.freelancerId as any

  return (
    <div className="bg-slate-100 min-h-screen font-body pb-24 text-slate-800">
      {/* ── TOOLBAR ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Mã HĐ: #{contract._id.slice(-6).toUpperCase()}
              </p>
              <h1 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                Chi tiết Hợp đồng
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              <Printer className="w-4 h-4" /> In PDF
            </button>

            {/* Hiển thị Action Button tương ứng với Trạng thái */}
            {renderActionButtons()}
          </div>
        </div>
      </div>

      {/* ── STATUS BANNER ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {contract.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-6">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Hợp đồng đã bị huỷ</p>
              <p className="text-sm">Một trong hai bên đã từ chối hoặc quá hạn xác nhận.</p>
            </div>
          </div>
        )}

        {(contract.status === 'draft' || contract.status === 'pendingAgreement') && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đang chờ chữ ký xác nhận</p>
              <p className="text-sm mt-1">
                {!hasAgreed
                  ? 'Vui lòng đọc kỹ các điều khoản bên dưới. Nếu đồng ý, hãy điền chữ ký điện tử ở cuối trang để xác nhận.'
                  : !partnerAgreed
                    ? 'Bạn đã ký. Đang chờ đối tác kiểm tra và chấp thuận hợp đồng này.'
                    : 'Đang xử lý...'}
              </p>
            </div>
          </div>
        )}

        {contract.status === 'waitingPayment' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-start gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Cả 2 bên đã xác nhận!</p>
              <p className="text-sm mt-1">
                {isContractor
                  ? 'Vui lòng thanh toán số tiền cọc để dự án chính thức bắt đầu.'
                  : 'Đang chờ Khách hàng thanh toán tiền cọc vào ví Escrow. Sàn sẽ thông báo khi tiền đã an toàn.'}
              </p>
            </div>
          </div>
        )}

        {contract.status === 'running' && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-xl flex items-start gap-3 mb-6">
            <PlayCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Dự án đang được thực hiện</p>
              <p className="text-sm mt-1">
                {!isContractor
                  ? 'Tiền cọc đã được lưu trong ví Escrow an toàn. Hãy bắt đầu công việc và nộp sản phẩm khi hoàn thành nhé!'
                  : 'Freelancer đang tiến hành công việc. Bạn sẽ nhận được thông báo khi có sản phẩm bàn giao.'}
              </p>
            </div>
          </div>
        )}

        {contract.status === 'submitted' && (
          <div className="bg-purple-50 border border-purple-200 text-purple-800 p-4 rounded-xl flex items-start gap-3 mb-6">
            <Send className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đã nộp sản phẩm</p>
              <p className="text-sm mt-1">
                {isContractor
                  ? 'Freelancer đã nộp sản phẩm. Vui lòng kiểm tra và tiến hành nghiệm thu để giải ngân.'
                  : 'Sản phẩm đã được gửi thành công. Đang chờ khách hàng nghiệm thu.'}
              </p>
            </div>
          </div>
        )}

        {contract.status === 'completed' && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Hợp đồng hoàn tất</p>
              <p className="text-sm mt-1">Dự án đã được nghiệm thu và tiền đã được giải ngân thành công.</p>
            </div>
          </div>
        )}
      </div>

      {/* ── BẢN HỢP ĐỒNG ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
        <div className="bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-16 border border-slate-200 relative overflow-hidden">
          {contract.status === 'cancelled' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span className="text-9xl font-black text-red-600 -rotate-45">CANCELLED</span>
            </div>
          )}

          <div className="text-center mb-12">
            <h2 className="text-lg font-bold uppercase">Cộng hòa Xã hội Chủ nghĩa Việt Nam</h2>
            <h3 className="text-sm font-bold uppercase underline mb-8">Độc lập - Tự do - Hạnh phúc</h3>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-wide">
              Hợp Đồng Dịch Vụ Tự Do
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Mã số: {contract._id}</p>
          </div>

          <div className="space-y-8 mb-10 text-[15px] leading-relaxed">
            <p>Hôm nay, ngày {new Date(contract.createdAt).toLocaleDateString('vi-VN')}. Chúng tôi gồm có:</p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold text-lg mb-3 uppercase text-indigo-900">
                Bên A (Bên thuê dịch vụ / Khách hàng)
              </h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-bold w-32 inline-block">Họ và tên:</span> {contractorInfo?.fullName || '---'}
                </li>
                <li>
                  <span className="font-bold w-32 inline-block">Email liên hệ:</span> {contractorInfo?.email || '---'}
                </li>
                <li>
                  <span className="font-bold w-32 inline-block">Vai trò:</span> Chủ đầu tư dự án
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold text-lg mb-3 uppercase text-indigo-900">
                Bên B (Bên cung cấp dịch vụ / Freelancer)
              </h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-bold w-32 inline-block">Họ và tên:</span> {freelancerInfo?.fullName || '---'}
                </li>
                <li>
                  <span className="font-bold w-32 inline-block">Email liên hệ:</span> {freelancerInfo?.email || '---'}
                </li>
                <li>
                  <span className="font-bold w-32 inline-block">Vai trò:</span> Chuyên gia thực hiện dự án
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
              <h3 className="font-bold text-lg mb-2">Điều 1: Nội dung công việc</h3>
              <div className="mt-3 p-4 bg-slate-50 border-l-4 border-slate-300 italic whitespace-pre-line rounded-r-xl">
                {contract.contractorTerms}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Điều 2: Thời gian thực hiện</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Hợp đồng bắt đầu có hiệu lực kể từ khi Bên A hoàn tất thanh toán tiền cọc vào ví trung gian (Escrow).
                </li>
                <li>
                  Thời hạn bàn giao sản phẩm dự kiến (Deadline):{' '}
                  <strong className="text-red-600">{new Date(contract.deadline).toLocaleDateString('vi-VN')}</strong>.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Điều 3: Phí dịch vụ & Thanh toán</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Tổng thù lao Bên A đồng ý thanh toán cho Bên B là:{' '}
                  <strong>{formatBudget(contract.totalAmount)} VNĐ</strong>.
                </li>
                <li>Khoản tiền này sẽ được giữ an toàn bởi hệ thống Escrow trong suốt quá trình thực hiện dự án.</li>
                <li>Tiền chỉ được giải ngân cho Bên B khi Bên A xác nhận nghiệm thu sản phẩm đạt yêu cầu.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t-2 border-slate-100">
            <div className="grid grid-cols-2 gap-8 text-center">
              {/* CỘT CHỮ KÝ BÊN A */}
              <div>
                <h4 className="font-bold text-lg uppercase text-slate-900">Đại diện Bên A</h4>
                <p className="text-sm text-slate-500 mb-8">(Khách hàng)</p>

                {contract.contractorAgreed ? (
                  <div className="inline-block p-4 border-2 border-emerald-500 rounded-lg bg-emerald-50 text-emerald-700 animate-in zoom-in">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold uppercase">Đã xác nhận</p>
                    <p className="text-xs mt-1">{contractorInfo?.fullName}</p>
                  </div>
                ) : isContractor && contract.status !== 'cancelled' ? (
                  <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 mb-2">Gõ tên bạn để ký điện tử:</p>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder={user?.fullName}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3 outline-none focus:border-indigo-500 font-serif italic"
                    />
                    <button
                      onClick={handleAgree}
                      disabled={agreeMutation.isPending}
                      className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm"
                    >
                      Ký & Chấp thuận
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-400 italic mt-8">Đang chờ ký...</p>
                )}
              </div>

              {/* CỘT CHỮ KÝ BÊN B */}
              <div>
                <h4 className="font-bold text-lg uppercase text-slate-900">Đại diện Bên B</h4>
                <p className="text-sm text-slate-500 mb-8">(Freelancer)</p>

                {contract.freelancerAgreed ? (
                  <div className="inline-block p-4 border-2 border-emerald-500 rounded-lg bg-emerald-50 text-emerald-700 animate-in zoom-in">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold uppercase">Đã xác nhận</p>
                    <p className="text-xs mt-1">{freelancerInfo?.fullName}</p>
                  </div>
                ) : !isContractor && contract.status !== 'cancelled' ? (
                  <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 mb-2">Gõ tên bạn để ký điện tử:</p>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder={user?.fullName}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3 outline-none focus:border-indigo-500 font-serif italic"
                    />
                    <button
                      onClick={handleAgree}
                      disabled={agreeMutation.isPending}
                      className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      Ký & Chấp thuận
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-400 italic mt-8">Đang chờ ký...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* NÚT HUỶ HỢP ĐỒNG */}
        {!hasAgreed && contract.status !== 'cancelled' && contract.status !== 'waitingPayment' && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-sm px-4 py-2 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Tôi không đồng ý với các điều khoản này (Huỷ Hợp đồng)
            </button>
          </div>
        )}
      </div>

      {/* NHÚNG MODAL THANH TOÁN */}
      {showPaymentModal && (
        <PaymentModal
          contract={contract}
          userRole={userRole as 'contractor' | 'freelancer'}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  )
}
