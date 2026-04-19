// src/apis/applicationService.ts
import axiosInstance from '../utils/axiosInstance'
import type { ApiResponse, PaginatedResponse } from '@/types/utils'
import type {
  Application,
  ApplicationQueryParams,
  CreateApplicationBody,
  UpdateApplicationBody
} from '@/types/application'

export const applicationService = {
  // 1. Freelancer: Nộp báo giá mới
  createApplication: async (body: CreateApplicationBody) => {
    return await axiosInstance.post<ApiResponse<Application>>('/applications', body)
  },

  // 2. Freelancer: Lấy danh sách báo giá của mình
  getMyApplications: async (params?: ApplicationQueryParams) => {
    return await axiosInstance.get<PaginatedResponse<Application>>('/applications/my', { params })
  },

  // 3. Freelancer: Lấy chi tiết 1 báo giá (Để xem lại hoặc sửa)
  getApplicationById: async (id: string) => {
    return await axiosInstance.get<ApiResponse<Application>>(`/applications/${id}`)
  },

  // 4. Freelancer: Sửa báo giá
  updateApplication: async (id: string, body: UpdateApplicationBody) => {
    return await axiosInstance.put<ApiResponse<Application>>(`/applications/${id}`, body)
  },

  // 5. Freelancer: Rút/Hủy báo giá
  deleteApplication: async (id: string) => {
    return await axiosInstance.delete<{ message: string }>(`/applications/${id}`)
  },

  // 6. Contractor: Lấy danh sách báo giá theo ID dự án
  getApplicationsByProject: async (projectId: string, params?: ApplicationQueryParams) => {
    return await axiosInstance.get<PaginatedResponse<Application>>(`/applications/project/${projectId}`, { params })
  },

  // 7. Contractor: Duyệt (Chấp nhận/Từ chối) ứng viên
  updateApplicationStatus: async (id: string, status: 'accepted' | 'rejected') => {
    return await axiosInstance.put<ApiResponse<Application>>(`/applications/${id}/status`, { status })
  }
}