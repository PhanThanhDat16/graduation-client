import type { Project, ProjectCreateParams, ProjectQueryParams } from '@/types/project'
import type { ApiResponse, PaginatedResponse } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'

export const projectService = {
  // 1. Tạo dự án mới
  createProject: async (body: ProjectCreateParams) => {
    const res = await axiosInstance.post<ApiResponse<Project>>('/projects', body)
    return res
  },

  // 2. Lấy danh sách dự án (Phân trang, Lọc, Tìm kiếm)
  getProjects: async (params?: ProjectQueryParams) => {
    const res = await axiosInstance.get<PaginatedResponse<Project>>('/projects', { params })
    return res
  },

  // 3. Lấy chi tiết 1 dự án
  getProjectById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Project>>(`/projects/${id}`)
    return res
  },

  // 4. Cập nhật dự án
  updateProject: async (id: string, body: Partial<ProjectCreateParams>) => {
    const res = await axiosInstance.put<ApiResponse<Project>>(`/projects/${id}`, body)
    return res
  },

  // 5. Xóa dự án
  deleteProject: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/projects/${id}`)
    return res
  },

  // 6. Lấy danh sách dự án của Khách hàng hiện tại (Đã đăng nhập)
  getMyProjects: async () => {
    // Mặc dù Swagger ví dụ trả về 1 object, nhưng về logic list sẽ trả về mảng Project[]
    const res = await axiosInstance.get<ApiResponse<Project[]>>('/projects/contractor')
    return res
  },

  // 7. Thích / Bỏ thích dự án
  toggleLikeProject: async (id: string) => {
    const res = await axiosInstance.put<ApiResponse<Project>>(`/projects/like/${id}`)
    return res
  }
}