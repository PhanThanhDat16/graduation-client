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
  },
  updateProfile: async (body: Partial<UserProfile>) => {
    const res = await axiosInstance.put<ApiResponse<UserProfile>>('/users/profile', body)
    return res
  },

  // uploadAvatar: async (file: File) => {
  //   const formData = new FormData()
  //   formData.append('avatar', file)
  //   const res = await axiosInstance.post<ApiResponse<UserProfile>>('/upload/avatar', formData)
  //   return res
  // }
  uploadAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)

    const res = await axiosInstance.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res
  }
}
