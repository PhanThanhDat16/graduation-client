// Định nghĩa cấu trúc của 1 thông báo
export interface Notification {
  _id: string
  user_id: any // Có thể là chuỗi ID hoặc Object User (nếu được populate)
  type: string
  title: string
  content: string
  is_read: boolean
  createdAt: string
  updated_at: string
}

// Các tham số (query) dùng để lọc và phân trang khi lấy danh sách
export interface NotificationQueryParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  type?: string
  is_read?: boolean
}

// Kiểu trả về cho API đếm số lượng chưa đọc
export interface UnreadCountData {
  unreadCount: number
}

// Kiểu trả về cho các hành động hàng loạt (Bulk actions)
export interface BulkUpdateData {
  modifiedCount: number
}

export interface BulkDeleteData {
  deletedCount: number
}
