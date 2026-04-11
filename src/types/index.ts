export type ContractQuery = {
  page: number
  limit: number
  search?: string
  pagination?: Pagination
  isActive?: string | boolean
}
export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
