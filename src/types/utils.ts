export interface ApiResponse<T> {
  message: string
  data: T
}

// Định nghĩa cấu trúc Response phân trang dùng chung
export interface PaginatedResponse<T> {
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
