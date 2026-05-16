import type { ProjectCreateParams } from './project'

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export interface Application {
  _id: string
  projectId: ProjectCreateParams & { _id: string }
  freelancerId: {
    _id: string
    email: string
  }
  proposal: string
  proposedBudget: number
  status: ApplicationStatus
  appliedAt: string
}

export interface ApplicationQueryParams {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  projectId?: string
  freelancerId?: string
  status?: ApplicationStatus
}

export interface CreateApplicationBody {
  projectId: string
  proposal: string
  proposedBudget: number
}

export interface UpdateApplicationBody {
  proposal?: string
  proposedBudget?: number
}
