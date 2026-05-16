import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Wallet, ArrowRight, Loader2Icon, AlertTriangle, ShieldCheck } from 'lucide-react'
import { contractService } from '@/apis/contractService'
import { useWalletStore } from '@/store/useWalletStore'
import { toast } from 'react-toastify'
import path from '@/constants/path'

interface PaymentModalProps {
  contract: any
  userRole: 'contractor' | 'freelancer'
  onClose: () => void
}

export default function PaymentModal({ contract, userRole, onClose }: PaymentModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Lấy balance từ Wallet Store
  const { balance, fetchBalance, balanceLoading } = useWalletStore()

  useEffect(() => {
    fetchBalance() // Cập nhật lại số dư mới nhất khi mở Modal
  }, [fetchBalance])

  // Lấy số tiền người này cần phải thanh toán từ Backend
  const amountToPay =
    userRole === 'contractor' ? contract.paymentInfo.contractorMustPay : contract.paymentInfo.freelancerMustPay

  const isEnoughBalance = balance >= amountToPay

  // Mutation Thanh toán
  const payMutation = useMutation({
    mutationFn: () => contractService.payContract(contract._id),
    onSuccess: () => {
      toast.success('Thanh toán ký quỹ thành công!')
      queryClient.invalidateQueries({ queryKey: ['contract', contract._id] })
      queryClient.invalidateQueries({ queryKey: ['my-contracts'] })
      fetchBalance() // Cập nhật lại ví
      onClose()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Thanh toán thất bại.')
    }
  })

  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" />
            Thanh toán Ký quỹ (Escrow)
          </h3>
          <button
            onClick={onClose}
            disabled={payMutation.isPending}
            className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Box hiển thị số tiền */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
            <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Số tiền cần thanh toán</p>
            <p className="text-4xl font-black text-indigo-700">
              {formatCurrency(amountToPay)} <span className="text-2xl text-indigo-400">₫</span>
            </p>
            {userRole === 'contractor' && contract.adminFee > 0 && (
              <p className="text-xs text-indigo-500 font-medium mt-2">
                (Đã bao gồm {formatCurrency(contract.adminFee)}₫ phí nền tảng)
              </p>
            )}
          </div>

          {/* Box hiển thị số dư ví */}
          <div
            className={`rounded-2xl p-4 border flex items-center justify-between ${
              isEnoughBalance ? 'bg-white border-slate-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isEnoughBalance ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-600'
                }`}
              >
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Số dư ví hiện tại</p>
                {balanceLoading ? (
                  <Loader2Icon size={16} className="animate-spin text-slate-400 mt-1" />
                ) : (
                  <p className={`font-bold ${isEnoughBalance ? 'text-slate-800' : 'text-red-600'}`}>
                    {formatCurrency(balance)} ₫
                  </p>
                )}
              </div>
            </div>

            {!isEnoughBalance && !balanceLoading && (
              <div className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-100 px-2 py-1 rounded">
                <AlertTriangle size={12} /> Thiếu {formatCurrency(amountToPay - balance)} ₫
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            {isEnoughBalance ? (
              <button
                onClick={() => payMutation.mutate()}
                disabled={payMutation.isPending || balanceLoading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {payMutation.isPending ? (
                  <>
                    <Loader2Icon size={18} className="animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} /> Xác nhận thanh toán
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate(path.ADD_FUNDS)}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Wallet size={18} /> Nạp thêm tiền vào ví <ArrowRight size={18} />
              </button>
            )}
          </div>

          <p className="text-xs text-center text-slate-500 font-medium px-4">
            Số tiền sẽ được giữ an toàn bởi hệ thống Escrow và chỉ được giải ngân khi dự án hoàn tất.
          </p>
        </div>
      </div>
    </div>
  )
}
