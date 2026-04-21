// ─── Enums ────────────────────────────────────────────────────────────────────
export type ProjectStatus = 'draft' | 'open' | 'closed'

// ─── Core Entity ──────────────────────────────────────────────────────────────
export interface IProject {
  _id: string
  contractorId: string | IContractorPopulated
  title: string
  description: string
  category: string
  skills: string[]
  budgetMin: number
  budgetMax: number
  status: ProjectStatus
  likes: number
  listLike: string[]
  createdAt: string
  updatedAt: string
}

/** Populated contractor info when API joins User */
export interface IContractorPopulated {
  _id: string
  fullName: string
  email: string
  avatar?: string
}

// ─── Request Bodies ────────────────────────────────────────────────────────────
export interface ICreateProjectBody {
  title: string
  description: string
  category: string
  skills?: string[]
  budgetMin: number
  budgetMax: number
  status?: ProjectStatus
}

export interface IUpdateProjectBody {
  title?: string
  description?: string
  category?: string
  skills?: string[]
  budgetMin?: number
  budgetMax?: number
  status?: ProjectStatus
}

// ─── Query / Filter ───────────────────────────────────────────────────────────
export interface IProjectQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  contractorId?: string
  category?: string
  status?: ProjectStatus
  keyword?: string
  likes?: number
  budgetMin?: number
  budgetMax?: number
}

// ─── API Response Shapes ──────────────────────────────────────────────────────
export interface IProjectPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IProjectListResponse {
  message: string
  data: IProject[]
  pagination: IProjectPagination
}

export interface IProjectResponse {
  message: string
  data: IProject
}
