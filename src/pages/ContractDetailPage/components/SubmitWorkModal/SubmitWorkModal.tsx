import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { X, Send, Code, Globe } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { contractService } from '@/apis/contractService'
import type { SubmitContractPayload } from '@/types/contract'
import { submitSchema, type SubmitSchema } from '@/utils/rules'

// Validation Schema (Chỉ check format URL nếu người dùng có nhập)

interface SubmitWorkModalProps {
  isOpen: boolean
  onClose: () => void
  contractId: string
  onSuccess: () => void
}

export default function SubmitWorkModal({ isOpen, onClose, contractId, onSuccess }: SubmitWorkModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SubmitSchema>({
    resolver: yupResolver(submitSchema),
    defaultValues: { githubLink: '', webLink: '' }
  })

  useEffect(() => {
    if (isOpen) reset()
  }, [isOpen, reset])

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitSchema) => {
      // Ép kiểu undefined nếu người dùng để trống
      const payload: SubmitContractPayload = {
        githubLink: data.githubLink || undefined,
        webLink: data.webLink || undefined
      }
      return await contractService.submitContract(contractId, payload)
    },
    onSuccess: () => {
      toast.success('Đã nộp sản phẩm thành công!')
      onSuccess()
      onClose()
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi nộp sản phẩm. Vui lòng thử lại.')
    }
  })

  const onSubmit = (data: SubmitSchema) => {
    // Nếu cả 2 ô đều trống, có thể nhắc nhở nhẹ (Tùy chọn)
    if (!data.githubLink && !data.webLink) {
      if (!window.confirm('Bạn không đính kèm link nào. Vẫn tiếp tục nộp sản phẩm chứ?')) return
    }
    submitMutation.mutate(data)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-indigo-50 border-b border-indigo-100 p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <Send className="w-5 h-5 ml-0.5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-indigo-900">Bàn giao sản phẩm</h3>
              <p className="text-sm font-medium text-indigo-700 mt-0.5">
                Khách hàng sẽ kiểm tra qua các đường link bạn cung cấp.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Github Link */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
              <Code className="w-4 h-4 text-slate-500" /> GitHub Repository (Tuỳ chọn)
            </label>
            <input
              type="text"
              placeholder="https://github.com/username/project"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-1 outline-none transition-all ${
                errors.githubLink
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
              }`}
              {...register('githubLink')}
            />
            {errors.githubLink && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.githubLink.message}</p>
            )}
          </div>

          {/* Web/Live Link */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
              <Globe className="w-4 h-4 text-slate-500" /> Web/Live Link (Tuỳ chọn)
            </label>
            <input
              type="text"
              placeholder="https://your-live-site.com"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-1 outline-none transition-all ${
                errors.webLink
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
              }`}
              {...register('webLink')}
            />
            {errors.webLink && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.webLink.message}</p>}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700">Lưu ý:</span> Trạng thái hợp đồng sẽ chuyển sang{' '}
            <span className="text-indigo-600 font-bold">Đã nộp sản phẩm</span>. Hãy chắc chắn bạn đã cấp quyền truy cập
            cho các link đính kèm.
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Nộp Bài Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
