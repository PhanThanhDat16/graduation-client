import { useState } from 'react'
import { Star, Loader2Icon, ArrowDown, ArrowUp, MessageSquareQuote } from 'lucide-react'
import type { Review } from '@/types/review'

interface ProfileReviewsProps {
  reviews: Review[]
  loading: boolean
}

export default function ProfileReviews({ reviews, loading }: ProfileReviewsProps) {
  const [showAll, setShowAll] = useState(false)

  const displayReviews = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" /> Đánh giá từ đối tác
        </h2>
        <span className="bg-amber-50 text-amber-600 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-100">
          {reviews.length}
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
          <Loader2Icon className="w-6 h-6 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Đang tải đánh giá...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
          <MessageSquareQuote size={32} className="text-slate-300" />
          <p className="text-sm text-slate-500 font-medium">Chưa có đánh giá nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayReviews.map((review) => {
            // Lấy thông tin người viết từ Backend
            const reviewer = review.reviewerId as any
            const reviewerName = reviewer?.fullName || 'Người dùng hệ thống'
            const reviewerInitial = reviewerName.charAt(0).toUpperCase()

            return (
              <div key={review._id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                    <span className="text-sm font-bold text-slate-900 ml-1">{review.rating}.0</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <p className="text-[15px] text-slate-700 leading-relaxed mb-4">"{review.comment}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden shrink-0">
                    {reviewer?.avatar ? (
                      <img src={reviewer.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      reviewerInitial
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{reviewerName}</p>
                    {reviewer?._id && (
                      <p className="text-xs font-medium text-slate-400">ID: ****{reviewer._id.slice(-4)}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-amber-200 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
        >
          {showAll ? (
            <>
              Thu gọn đánh giá <ArrowUp size={16} />
            </>
          ) : (
            <>
              Xem tất cả {reviews.length} đánh giá <ArrowDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  )
}
