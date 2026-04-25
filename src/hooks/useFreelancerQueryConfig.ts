import { omitBy, isUndefined } from 'lodash'
import useQueryParams from './useQueryParams'

export type FreelancerQueryConfig = {
  page?: string
  limit?: string
  keyword?: string
  category?: string
  budgetMin?: string
  budgetMax?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  role?: string // Quan trọng: Để filter đúng freelancer
}

export default function useFreelancerQueryConfig() {
  const queryParams: FreelancerQueryConfig = useQueryParams()

  const queryConfig: FreelancerQueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      keyword: queryParams.keyword,
      category: queryParams.category,
      budgetMin: queryParams.budgetMin,
      budgetMax: queryParams.budgetMax,
      sortBy: queryParams.sortBy || 'createdAt',
      sortOrder: queryParams.sortOrder || 'desc',
      role: 'freelancer'
    },
    isUndefined
  )

  return queryConfig
}
