export interface UserProfile {
  _id: string
  email: string
  fullName: string
  phone?: string
  address?: string
  birthday?: string
  gender?: string
  role: 'freelancer' | 'contractor' | 'admin'
  avatar?: string
  isVerified: boolean
  status: 'active' | 'inactive' | 'banned'
  ratingAvg?: number | null
  ratingCount?: number | null
  createdAt: string
}

export interface UserQueryParams {
  page?: number | string
  limit?: number | string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  role?: string
  status?: string
  isVerified?: boolean
  keyword?: string
}
