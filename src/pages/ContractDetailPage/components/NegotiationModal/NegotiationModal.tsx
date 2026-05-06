import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { X, Handshake, CalendarClock, SplitSquareHorizontal, Ban } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { disputeService } from '@/apis/disputeService'
import { formatBudget } from '@/utils/fomatters'
import { negotiationSchema } from '@/utils/rules'
// Định nghĩa Type trực tiếp để không bị phụ thuộc vào Yup
interface FormData {
  resolutionType: 'extend' | 'cancel' | 'split'
  freelancerAmount?: number
  contractorAmount?: number
  newDeadline?: string
}

interface NegotiationModalProps {
  isOpen: boolean
  onClose: () => void
  disputeId: string
  totalEscrowAmount: number
  currentDeadline: string
  onSuccess: () => void
}

export default function NegotiationModal({
  isOpen,
  onClose,
  disputeId,
  totalEscrowAmount,
  currentDeadline,
  onSuccess
}: NegotiationModalProps) {
  const [selectedType, setSelectedType] = useState<'extend' | 'cancel' | 'split' | null>(null)
  const [sliderValue, setSliderValue] = useState(50)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(negotiationSchema) as any, // Ép kiểu chỗ này để Yup không cãi
    defaultValues: { resolutionType: 'split' }
  })
  // Gọi hàm này ngay khi bấm Đóng Modal
  const handleClose = () => {
    reset()
    setSelectedType(null)
    setSliderValue(50)
    onClose()
  }

  // --- LOGIC THANH TRƯỢT CHIA TIỀN ---
  useEffect(() => {
    if (selectedType === 'split') {
      const flAmount = (totalEscrowAmount * sliderValue) / 100
      const ctAmount = totalEscrowAmount - flAmount
      setValue('freelancerAmount', flAmount)
      setValue('contractorAmount', ctAmount)
    }
  }, [sliderValue, selectedType, totalEscrowAmount, setValue])

  // --- MUTATION ---
  const proposeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // 1. Validation cho trường hợp Gia hạn
      if (data.resolutionType === 'extend' && !data.newDeadline) {
        throw new Error('Vui lòng chọn hạn chót mới.')
      }

      // 2. Chuẩn bị Payload
      const payload: any = {
        resolutionType: data.resolutionType
      }

      // Trường hợp: GIA HẠN
      if (data.resolutionType === 'extend' && data.newDeadline) {
        payload.newDeadline = data.newDeadline
      }

      // Trường hợp: CHIA TIỀN (Sử dụng giá trị từ slider)
      if (data.resolutionType === 'split') {
        payload.freelancerAmount = data.freelancerAmount
        payload.contractorAmount = data.contractorAmount
      }

      // Freelancer = 0, Contractor = 100% tiền
      if (data.resolutionType === 'cancel') {
        payload.freelancerAmount = 0
        payload.contractorAmount = totalEscrowAmount
      }

      return await disputeService.proposeResolution(disputeId, payload)
    },
    onSuccess: () => {
      toast.success('Đã gửi đề xuất thương lượng!')
      onSuccess()
      handleClose()
    },
    onError: (err: any) => {
      // Hiện thông báo lỗi chi tiết từ server nếu có
      const errMsg = err?.response?.data?.message || err.message || 'Lỗi khi gửi đề xuất.'
      toast.error(errMsg)
    }
  })

  const onSubmit = (data: FormData) => {
    proposeMutation.mutate(data)
  }

  const handleSelectType = (type: 'extend' | 'cancel' | 'split') => {
    setSelectedType(type)
    setValue('resolutionType', type)
  }

  if (!isOpen) return null

  const flAmountDisplay = (totalEscrowAmount * sliderValue) / 100
  const ctAmountDisplay = totalEscrowAmount - flAmountDisplay

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-blue-50 border-b border-blue-100 p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-blue-900">Đề xuất giải quyết</h3>
              <p className="text-sm font-medium text-blue-700 mt-0.5">Đưa ra phương án để thỏa thuận với đối tác.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900">
              Chọn phương án <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleSelectType('split')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'split' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <SplitSquareHorizontal
                  className={`w-5 h-5 ${selectedType === 'split' ? 'text-blue-600' : 'text-slate-400'}`}
                />
                <div className="text-left">
                  <p className={`font-bold ${selectedType === 'split' ? 'text-blue-900' : 'text-slate-700'}`}>
                    Hoàn tất & Chia tiền
                  </p>
                  <p className="text-xs text-slate-500">Cả 2 cùng thỏa thuận phân chia số tiền ký quỹ.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('extend')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'extend' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <CalendarClock
                  className={`w-5 h-5 ${selectedType === 'extend' ? 'text-amber-500' : 'text-slate-400'}`}
                />
                <div className="text-left">
                  <p className={`font-bold ${selectedType === 'extend' ? 'text-amber-900' : 'text-slate-700'}`}>
                    Gia hạn thời gian
                  </p>
                  <p className="text-xs text-slate-500">Thêm thời gian để Freelancer hoàn thiện sản phẩm.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('cancel')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'cancel' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'
                }`}
              >
                <Ban className={`w-5 h-5 ${selectedType === 'cancel' ? 'text-red-500' : 'text-slate-400'}`} />
                <div className="text-left">
                  <p className={`font-bold ${selectedType === 'cancel' ? 'text-red-900' : 'text-slate-700'}`}>
                    Hủy hợp đồng
                  </p>
                  <p className="text-xs text-slate-500">Hủy bỏ giao dịch, hoàn trả 100% tiền cọc cho khách.</p>
                </div>
              </button>
            </div>
            {errors.resolutionType && (
              <p className="text-red-500 text-xs font-medium">{errors.resolutionType.message}</p>
            )}
          </div>

          <div className="min-h-[120px]">
            {!selectedType && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <p className="text-sm text-slate-400 font-medium">Vui lòng chọn 1 phương án ở trên</p>
              </div>
            )}

            {selectedType === 'extend' && (
              <div className="space-y-2 animate-in slide-in-from-right-4">
                <label className="block text-sm font-bold text-slate-900">Chọn hạn chót mới (New Deadline)</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('newDeadline')}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Hạn chót hiện tại:{' '}
                  <span className="font-bold text-slate-700">
                    {new Date(currentDeadline).toLocaleDateString('vi-VN')}
                  </span>
                </p>
              </div>
            )}

            {selectedType === 'cancel' && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-200 animate-in slide-in-from-right-4">
                <p className="text-sm text-red-800 font-medium leading-relaxed">
                  <strong className="font-black">Lưu ý:</strong> Nếu đối phương đồng ý hủy hợp đồng, Freelancer sẽ không
                  nhận được thù lao và toàn bộ số tiền <strong>{formatBudget(totalEscrowAmount)} ₫</strong> sẽ được hoàn
                  trả về ví của Khách hàng.
                </p>
              </div>
            )}

            {selectedType === 'split' && (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div className="flex justify-between items-end">
                  <label className="block text-sm font-bold text-slate-900">Phân chia số tiền</label>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Tổng: {formatBudget(totalEscrowAmount)} ₫
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">
                      Freelancer Nhận
                    </p>
                    <p className="text-lg font-black text-indigo-700">{formatBudget(flAmountDisplay)} ₫</p>
                    <p className="text-xs font-bold mt-1 text-indigo-400">{sliderValue}%</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
                      Khách Được Hoàn
                    </p>
                    <p className="text-lg font-black text-emerald-700">{formatBudget(ctAmountDisplay)} ₫</p>
                    <p className="text-xs font-bold mt-1 text-emerald-400">{100 - sliderValue}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={proposeMutation.isPending || !selectedType}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {proposeMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Gửi Đề Xuất
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
