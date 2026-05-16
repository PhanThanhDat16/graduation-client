export interface ContractorInfo {
  _id: string
  fullName: string
  avatar?: string
  ratingAvg?: number | null
  isVerified: boolean
  address?: string
  ratingCount?: number | null
}
export interface Project {
  _id: string
  contractorId: ContractorInfo
  title: string
  description: string
  category: string
  skills: string[]
  images?: string[]
  budgetMin: number
  budgetMax?: number // Backend trả về có thể thiếu nếu không set
  status: 'progress' | 'open' | 'closed'
  likes: number
  listLike: string[]
  createdAt: string
  updatedAt: string
}

// --- REQUEST BODY KHI TẠO DỰ ÁN ---
export interface ProjectCreateParams {
  title: string
  description: string
  category: string
  skills?: string[]
  budgetMin: number
  budgetMax?: number
  status?: 'progress' | 'open' | 'closed'
  images?: string[]
}

// --- QUERY PARAMS KHI TÌM KIẾM/LỌC DỰ ÁN ---
export interface ProjectQueryParams {
  page?: number | string
  limit?: number | string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  contractorId?: string
  category?: string
  status?: 'progress' | 'open' | 'closed'
  keyword?: string
  budgetMin?: number | string
  budgetMax?: number | string
  likes?: number | string
}
