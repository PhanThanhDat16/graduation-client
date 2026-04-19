// --- CẤU TRÚC DỰ ÁN (Dựa trên Schema Backend) ---
export interface Project {
  _id: string
  contractorId: string
  title: string
  description: string
  category: string
  skills: string[]
  budgetMin: number
  budgetMax?: number // Backend trả về có thể thiếu nếu không set
  status: 'draft' | 'open' | 'closed'
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
  status?: 'draft' | 'open' | 'closed'
}

// --- QUERY PARAMS KHI TÌM KIẾM/LỌC DỰ ÁN ---
export interface ProjectQueryParams {
  page?: number | string
  limit?: number | string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  contractorId?: string
  category?: string
  status?: 'draft' | 'open' | 'closed'
  keyword?: string
  budgetMin?: number | string
  budgetMax?: number | string
  likes?: number | string
}
