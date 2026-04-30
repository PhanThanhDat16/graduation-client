import type { ApiResponse, PaginatedResponse } from '@/types/utils'
import type {
  Notification,
  NotificationQueryParams,
  UnreadCountData,
  BulkUpdateData,
  BulkDeleteData
} from '@/types/notification'
import axiosInstance from '@/utils/axiosInstance'

export const notificationService = {
  // 1. Lấy danh sách thông báo của tôi (có phân trang, lọc)
  getNotifications: async (params?: NotificationQueryParams) => {
    return await axiosInstance.get<PaginatedResponse<Notification>>('/notifications/me', { params })
  },

  // 2. Đếm số lượng thông báo chưa đọc (Dùng cho icon Chuông trên Header)
  getUnreadCount: async () => {
    return await axiosInstance.get<ApiResponse<UnreadCountData>>('/notifications/me/unread-count')
  },

  // 3. Đánh dấu TẤT CẢ là đã đọc
  markAllAsRead: async () => {
    return await axiosInstance.put<ApiResponse<BulkUpdateData>>('/notifications/me/read-all')
  },

  // 4. Xoá TẤT CẢ thông báo
  deleteAllNotifications: async () => {
    return await axiosInstance.delete<ApiResponse<BulkDeleteData>>('/notifications/me/all')
  },

  // 5. Đánh dấu 1 thông báo cụ thể là đã đọc
  markAsRead: async (id: string) => {
    return await axiosInstance.put<ApiResponse<Notification>>(`/notifications/${id}/read`)
  },

  // 6. Xoá 1 thông báo cụ thể
  deleteNotification: async (id: string) => {
    return await axiosInstance.delete<ApiResponse<null>>(`/notifications/${id}`)
  },

  // 7. Lấy chi tiết 1 thông báo
  getNotificationById: async (id: string) => {
    return await axiosInstance.get<ApiResponse<Notification>>(`/notifications/${id}`)
  }
}
