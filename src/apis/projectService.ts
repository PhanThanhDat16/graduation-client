import type { Project, ProjectCreateParams, ProjectQueryParams } from '@/types/project'
import type { ApiResponse, PaginatedResponse } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'

export const projectService = {
  createProject: async (body: ProjectCreateParams) => {
    const res = await axiosInstance.post<ApiResponse<Project>>('/projects', body)
    return res
  },
  getProjects: async (params?: ProjectQueryParams) => {
    const res = await axiosInstance.get<PaginatedResponse<Project>>('/projects', { params })
    return res
  },
  getProjectById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Project>>(`/projects/${id}`)
    return res
  }
}
