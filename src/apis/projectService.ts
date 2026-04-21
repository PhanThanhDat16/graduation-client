import axiosInstance from '@/utils/axiosInstance'
import type {
  ICreateProjectBody,
  IUpdateProjectBody,
  IProjectQuery,
  IProjectListResponse,
  IProjectResponse
} from '@/types/project'

export const projectService = {
  // ─── Public: Get All Projects (with filters + pagination) ─────────────────
  getAllProjects: async (query?: IProjectQuery): Promise<IProjectListResponse> => {
    const res = await axiosInstance.get<IProjectListResponse>('/projects', { params: query })
    return res.data
  },

  // ─── Public: Get Project By ID ─────────────────────────────────────────────
  getProjectById: async (id: string): Promise<IProjectResponse> => {
    const res = await axiosInstance.get<IProjectResponse>(`/projects/${id}`)
    return res.data
  },

  // ─── Auth: Get My Projects (contractor) ───────────────────────────────────
  getMyProjects: async (): Promise<{ message: string; data: IProjectResponse['data'][] }> => {
    const res = await axiosInstance.get('/projects/contractor')
    return res.data
  },

  // ─── Auth: Create Project ─────────────────────────────────────────────────
  createProject: async (body: ICreateProjectBody): Promise<IProjectResponse> => {
    const res = await axiosInstance.post<IProjectResponse>('/projects', body)
    return res.data
  },

  // ─── Auth: Update Project ─────────────────────────────────────────────────
  updateProject: async (id: string, body: IUpdateProjectBody): Promise<IProjectResponse> => {
    const res = await axiosInstance.put<IProjectResponse>(`/projects/${id}`, body)
    return res.data
  },

  // ─── Auth: Delete Project ─────────────────────────────────────────────────
  deleteProject: async (id: string): Promise<{ message: string }> => {
    const res = await axiosInstance.delete(`/projects/${id}`)
    return res.data
  },

  // ─── Auth: Toggle Like ────────────────────────────────────────────────────
  likeProject: async (id: string): Promise<IProjectResponse> => {
    const res = await axiosInstance.put<IProjectResponse>(`/projects/like/${id}`)
    return res.data
  }
}
