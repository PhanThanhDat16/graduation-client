import type { UserProfile, UserQueryParams } from '@/types/user'
import axiosInstance from '../utils/axiosInstance'
import type { ApiResponse, PaginatedResponse } from '@/types/utils'
export const userService = {
  getUsers: async (params?: UserQueryParams) => {
    const res = await axiosInstance.get<PaginatedResponse<UserProfile>>('/users', { params })
    return res
  },

  getUserById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<UserProfile>>(`/users/${id}`)
    return res
  }
}
