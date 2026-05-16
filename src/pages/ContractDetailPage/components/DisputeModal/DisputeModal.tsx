import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { X, AlertTriangle, ShieldAlert } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { disputeService } from '@/apis/disputeService'

// Validation Schema
const disputeSchema = yup.object({
  reason: yup
    .string()
    .required('Vui lòng nhập lý do/lời khai của bạn')
    .min(20, 'Lý do cần chi tiết hơn (ít nhất 20 ký tự)'),
  requestedResolution: yup.string().default('') // Chỉ bắt buộc ở Giai đoạn 2, sẽ check logic ở hàm submit
})

type DisputeFormData = yup.InferType<typeof disputeSchema>

interface DisputeModalProps {
  isOpen: boolean
  onClose: () => void
  contractId: string
  disputeId?: string | null // Nếu null = Giai đoạn 1 (Mở kiện). Nếu có ID = Giai đoạn 2 (Điền lời khai)
  onSuccess: () => void
}

export default function DisputeModal({ isOpen, onClose, contractId, disputeId, onSuccess }: DisputeModalProps) {
  const isCreating = !disputeId // Trạng thái 1: Mở Dispute mới

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DisputeFormData>({
    resolver: yupResolver(disputeSchema),
    defaultValues: { reason: '', requestedResolution: '' }
  })

  // Reset form mỗi khi mở modal
  useEffect(() => {
    if (isOpen) reset()
  }, [isOpen, reset])

  // MUTATION: Xử lý Gọi API
  const submitMutation = useMutation({
    mutationFn: async (data: DisputeFormData) => {
      if (isCreating) {
        // Giai đoạn 1: Tạo mới (Chỉ cần contractId và reason)
        return await disputeService.createDispute({
          contractId,
          reason: data.reason
        })
      } else {
        // Giai đoạn 2: Bổ sung lời khai (Cần reason và requestedResolution)
        if (!data.requestedResolution) {
          throw new Error('Vui lòng nhập mong muốn giải quyết của bạn.')
        }
        return await disputeService.submitReason(disputeId as string, {
          reason: data.reason,
          requestedResolution: data.requestedResolution
        })
      }
    },
    onSuccess: () => {
      toast.success(isCreating ? 'Đã mở khiếu nại thành công!' : 'Đã gửi lời khai thành công!')
      onSuccess() // Báo cho Component cha load lại data
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.')
    }
  })

  const onSubmit = (data: DisputeFormData) => {
    submitMutation.mutate(data)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Lớp phủ đen (Backdrop) */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Nội dung Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className={`p-6 border-b ${isCreating ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {isCreating ? (
                <ShieldAlert className="w-6 h-6 text-red-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              )}
              <div>
                <h3 className={`text-xl font-black ${isCreating ? 'text-red-900' : 'text-amber-900'}`}>
                  {isCreating ? 'Khởi kiện / Mở khiếu nại' : 'Bổ sung lời khai'}
                </h3>
                <p className={`text-sm mt-1 font-medium ${isCreating ? 'text-red-700' : 'text-amber-700'}`}>
                  {isCreating
                    ? 'Bạn và đối tác sẽ có 1 tiếng để nộp lời khai.'
                    : 'Vui lòng điền thông tin trước khi thời gian đếm ngược kết thúc.'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Nhập liệu */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Cảnh báo Giai đoạn 1 */}
          {isCreating && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Lưu ý quan trọng:</span> Sau khi bạn mở khiếu nại, hệ thống sẽ
              đếm ngược <span className="font-bold text-red-600">1 GIỜ</span>. Cả bạn và đối phương đều phải điền đầy đủ
              lý do. Nếu ai không điền sẽ gặp bất lợi khi Quản trị viên (Staff) phân xử.
            </div>
          )}

          {/* Ô nhập Lý do (Cả 2 giai đoạn đều cần) */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              {isCreating ? 'Lý do bạn muốn khiếu nại là gì?' : 'Lời khai / Bằng chứng của bạn'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Vui lòng trình bày rõ ràng, chi tiết vấn đề bạn đang gặp phải..."
              className={`w-full bg-slate-50 border rounded-xl p-4 text-sm text-slate-900 focus:bg-white focus:ring-1 outline-none resize-none transition-all ${
                errors.reason
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
              }`}
              {...register('reason')}
            />
            {errors.reason && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.reason.message}</p>}
          </div>

          {/* Ô nhập Đề xuất (Chỉ hiển thị ở Giai đoạn 2) */}
          {!isCreating && (
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Mong muốn giải quyết của bạn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Tôi muốn hoàn lại 50% số tiền cọc..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-1 outline-none transition-all"
                {...register('requestedResolution')}
              />
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 ${
                isCreating ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {submitMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isCreating ? 'Mở Khiếu Nại' : 'Gửi Lời Khai'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
