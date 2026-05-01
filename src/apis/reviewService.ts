import axiosInstance from '@/utils/axiosInstance'
import type { Review, ReviewQueryParams, CreateReviewBody } from '@/types/review'
import type { ApiResponse, PaginatedResponse } from '@/types/utils'

export const reviewService = {
  createReview: async (body: CreateReviewBody) => {
    return await axiosInstance.post<ApiResponse<Review>>('/reviews', body)
  },

  // Dùng cho trang Admin hoặc tìm kiếm tổng hợp
  getAllReviews: async (params?: ReviewQueryParams) => {
    return await axiosInstance.get<PaginatedResponse<Review>>('/reviews', { params })
  },

  // Lấy đánh giá của một User cụ thể (truyền type = true để lấy những đánh giá họ ĐƯỢC NHẬN)
  getReviewsByUserId: async (userId: string, type: boolean = true) => {
    return await axiosInstance.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`, {
      params: { type }
    })
  },

  getMyReviews: async (type?: boolean) => {
    return await axiosInstance.get<ApiResponse<Review[]>>('/reviews/me', {
      params: { type }
    })
  },

  getAverageRating: async (userId: string) => {
    return await axiosInstance.get<ApiResponse<{ averageRating: number; totalReviews: number }>>(
      `/reviews/user/${userId}/average-rating`
    )
  },

  updateReview: async (id: string, body: { rating?: number; comment?: string }) => {
    return await axiosInstance.put<ApiResponse<Review>>(`/reviews/${id}`, body)
  },

  deleteReview: async (id: string) => {
    return await axiosInstance.delete<ApiResponse<null>>(`/reviews/${id}`)
  }
}
