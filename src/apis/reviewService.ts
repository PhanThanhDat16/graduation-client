import axiosInstance from '@/utils/axiosInstance'
import type { Review, ReviewQueryParams } from '@/types/review'
import type { PaginatedResponse } from '@/types/utils'

export const reviewService = {
  // Lấy reviews của Freelancer
  getFreelancerReviews: async (freelancerId: string, params?: ReviewQueryParams) => {
    const res = await axiosInstance.get<PaginatedResponse<Review>>(`/reviews/freelancer/${freelancerId}`, { params })
    return res
  },

  // Lấy reviews của Contractor
  getContractorReviews: async (contractorId: string, params?: ReviewQueryParams) => {
    const res = await axiosInstance.get<PaginatedResponse<Review>>(`/reviews/contractor/${contractorId}`, { params })
    return res
  }
}
