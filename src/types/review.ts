export interface PopulatedUser {
  _id: string
  fullName: string
  email: string
  avatar?: string
}

export interface Review {
  _id: string
  contractId: string
  reviewerId: PopulatedUser | string
  revieweeId: PopulatedUser | string
  role: 'freelancer' | 'contractor'
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface ReviewQueryParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  contractId?: string
  reviewerId?: string
  revieweeId?: string
  role?: 'freelancer' | 'contractor'
  rating?: number
  minRating?: number
  maxRating?: number
}
export interface CreateReviewBody {
  contractId: string
  rating: number
  comment: string
}
