import { create } from 'zustand'
import { projectService } from '@/apis/projectService'
import type {
  IProject,
  IProjectQuery,
  IProjectPagination,
  ICreateProjectBody,
  IUpdateProjectBody
} from '@/types/project'
import { toast } from 'react-toastify'

// ─── State ─────────────────────────────────────────────────────────────────────
interface ProjectState {
  // Public project list
  projects: IProject[]
  pagination: IProjectPagination
  listLoading: boolean

  // Single project detail
  selectedProject: IProject | null
  detailLoading: boolean

  // My projects (contractor)
  myProjects: IProject[]
  myProjectsLoading: boolean

  // Mutation states
  loading: boolean

  // ── Actions ────────────────────────────────────────────────────────────────
  fetchProjects: (query?: IProjectQuery) => Promise<void>
  fetchProjectById: (id: string) => Promise<void>
  fetchMyProjects: () => Promise<void>
  createProject: (body: ICreateProjectBody) => Promise<IProject | null>
  updateProject: (id: string, body: IUpdateProjectBody) => Promise<IProject | null>
  deleteProject: (id: string) => Promise<boolean>
  likeProject: (id: string, currentUserId: string) => Promise<void>
  clearSelectedProject: () => void
}

const DEFAULT_PAGINATION: IProjectPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1
}

// ─── Store ─────────────────────────────────────────────────────────────────────
export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  pagination: DEFAULT_PAGINATION,
  listLoading: false,

  selectedProject: null,
  detailLoading: false,

  myProjects: [],
  myProjectsLoading: false,

  loading: false,

  // ── Fetch public project list ───────────────────────────────────────────────
  fetchProjects: async (query?: IProjectQuery) => {
    set({ listLoading: true })
    try {
      const res = await projectService.getAllProjects(query)
      set({ projects: res.data, pagination: res.pagination })
    } catch (error) {
      console.error('fetchProjects failed:', error)
      toast.error('Không thể tải danh sách dự án')
    } finally {
      set({ listLoading: false })
    }
  },

  // ── Fetch single project detail ─────────────────────────────────────────────
  fetchProjectById: async (id: string) => {
    set({ detailLoading: true, selectedProject: null })
    try {
      const res = await projectService.getProjectById(id)
      set({ selectedProject: res.data })
    } catch (error) {
      console.error('fetchProjectById failed:', error)
      toast.error('Không thể tải chi tiết dự án')
    } finally {
      set({ detailLoading: false })
    }
  },

  // ── Fetch contractor's own projects ─────────────────────────────────────────
  fetchMyProjects: async () => {
    set({ myProjectsLoading: true })
    try {
      const res = await projectService.getMyProjects()
      set({ myProjects: Array.isArray(res.data) ? res.data : [] })
    } catch (error) {
      console.error('fetchMyProjects failed:', error)
      toast.error('Không thể tải dự án của bạn')
    } finally {
      set({ myProjectsLoading: false })
    }
  },

  // ── Create project ──────────────────────────────────────────────────────────
  createProject: async (body: ICreateProjectBody) => {
    set({ loading: true })
    try {
      const res = await projectService.createProject(body)
      // Append to myProjects list
      set((s) => ({ myProjects: [res.data, ...s.myProjects] }))
      toast.success('Đăng dự án thành công!')
      return res.data
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Đăng dự án thất bại'
      toast.error(msg)
      return null
    } finally {
      set({ loading: false })
    }
  },

  // ── Update project ──────────────────────────────────────────────────────────
  updateProject: async (id: string, body: IUpdateProjectBody) => {
    set({ loading: true })
    try {
      const res = await projectService.updateProject(id, body)
      const updated = res.data
      // Update in both lists
      set((s) => ({
        myProjects: s.myProjects.map((p) => (p._id === id ? updated : p)),
        projects: s.projects.map((p) => (p._id === id ? updated : p)),
        selectedProject: s.selectedProject?._id === id ? updated : s.selectedProject
      }))
      toast.success('Cập nhật dự án thành công!')
      return updated
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Cập nhật dự án thất bại'
      toast.error(msg)
      return null
    } finally {
      set({ loading: false })
    }
  },

  // ── Delete project ──────────────────────────────────────────────────────────
  deleteProject: async (id: string) => {
    set({ loading: true })
    try {
      await projectService.deleteProject(id)
      set((s) => ({
        myProjects: s.myProjects.filter((p) => p._id !== id),
        projects: s.projects.filter((p) => p._id !== id)
      }))
      toast.success('Đã xóa dự án')
      return true
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Xóa dự án thất bại'
      toast.error(msg)
      return false
    } finally {
      set({ loading: false })
    }
  },

  // ── Toggle like (optimistic update) ────────────────────────────────────────
  likeProject: async (id: string, currentUserId: string) => {
    // Optimistic update on both lists
    const toggle = (projects: IProject[]) =>
      projects.map((p) => {
        if (p._id !== id) return p
        const isLiked = p.listLike.includes(currentUserId)
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
          listLike: isLiked ? p.listLike.filter((uid) => uid !== currentUserId) : [...p.listLike, currentUserId]
        }
      })

    set((s) => ({
      projects: toggle(s.projects),
      myProjects: toggle(s.myProjects),
      selectedProject:
        s.selectedProject?._id === id
          ? (() => {
              const p = s.selectedProject!
              const isLiked = p.listLike.includes(currentUserId)
              return {
                ...p,
                likes: isLiked ? p.likes - 1 : p.likes + 1,
                listLike: isLiked ? p.listLike.filter((u) => u !== currentUserId) : [...p.listLike, currentUserId]
              }
            })()
          : s.selectedProject
    }))

    try {
      await projectService.likeProject(id)
    } catch {
      // Rollback on error
      set((s) => ({
        projects: toggle(s.projects),
        myProjects: toggle(s.myProjects)
      }))
    }
  },

  clearSelectedProject: () => set({ selectedProject: null })
}))
