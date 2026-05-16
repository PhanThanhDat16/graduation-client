import { useState } from 'react'
import { Star, X, MessageSquare, Send } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { reviewService } from '@/apis/reviewService'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  contractId: string
  freelancerName: string
}

export default function ReviewModal({ isOpen, onClose, contractId, freelancerName }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const reviewMutation = useMutation({
    mutationFn: () =>
      reviewService.createReview({
        contractId,
        rating,
        comment: comment.trim()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-contract', contractId] })
      toast.success('Cảm ơn bạn đã gửi đánh giá!')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể gửi đánh giá lúc này.')
    }
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim().length < 10) {
      toast.warning('Vui lòng nhập nhận xét ít nhất 10 ký tự.')
      return
    }
    reviewMutation.mutate()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md overflow-hidden duration-300 bg-white shadow-2xl rounded-3xl animate-in zoom-in-95">
        {/* Header */}
        <div className="relative h-32 p-6 text-white bg-gradient-to-br from-indigo-600 to-violet-700">
          <button
            onClick={onClose}
            className="absolute p-2 transition-colors rounded-full top-4 right-4 hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            </div>
            <h2 className="text-xl font-black">Đánh giá Freelancer</h2>
          </div>
          <p className="text-sm font-medium text-indigo-100">
            Bạn nghĩ sao về chất lượng làm việc của {freelancerName}?
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex flex-col items-center mb-8">
            <p className="mb-4 text-xs font-bold tracking-widest text-center uppercase text-slate-400">
              Mức độ hài lòng của bạn
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90 hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-bold text-slate-600">
              {rating === 1 && '😓 Rất không hài lòng'}
              {rating === 2 && '😕 Không hài lòng'}
              {rating === 3 && '😐 Bình thường'}
              {rating === 4 && '🙂 Hài lòng'}
              {rating === 5 && '🤩 Tuyệt vời!'}
            </p>
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-2 px-1 mb-2 text-xs font-bold tracking-widest uppercase text-slate-400">
              <MessageSquare className="w-3 h-3" /> Nhận xét chi tiết
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ thêm về trải nghiệm làm việc cùng Freelancer này..."
              rows={4}
              className="w-full px-4 py-3 text-sm leading-relaxed transition-all border outline-none resize-none bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={reviewMutation.isPending}
              className="flex items-center justify-center w-full gap-2 py-4 font-black text-white transition-all shadow-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-2xl shadow-indigo-200 disabled:opacity-50"
            >
              {reviewMutation.isPending ? (
                <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Gửi đánh giá ngay
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-sm font-bold transition-colors text-slate-400 hover:text-slate-600"
            >
              Để sau
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
