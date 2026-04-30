export interface Review {
  _id: string
  contract_id: string
  contractor_id: string
  freelancer_id: string
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
  contractor_id?: string
  freelancer_id?: string
  rating?: number
  minRating?: number
  maxRating?: number
}
