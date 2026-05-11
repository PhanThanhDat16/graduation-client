import axiosInstance from '../utils/axiosInstance'
import type { ApiResponse } from '@/types/utils'

export interface PersonalDashboardResponse {
  role: 'contractor' | 'freelancer'
  fullName: string
  stats: {
    openProjects?: number
    activeContracts: number
    escrowAmount: number
    totalSpent?: number
    totalEarned?: number
    applications?: number
  }
  walletBalance: number
  recentProjects?: any[]
  recentContracts?: any[]
  recentApplications?: any[]
}

export const dashboardService = {
  getPersonalDashboard: async () => {
    const res = await axiosInstance.get<ApiResponse<PersonalDashboardResponse>>('/dashboard/personal')
    return res
  }
}
