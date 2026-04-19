import { omitBy, isUndefined } from 'lodash'
import useQueryParams from './useQueryParams'

export type QueryConfig = {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  contractorId?: string
  category?: string
  status?: 'draft' | 'open' | 'closed'
  keyword?: string
  budgetMin?: string
  budgetMax?: string
  likes?: string
}
export default function useProjectQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()

  // Đọc dữ liệu từ URL xuống và parse đúng kiểu dữ liệu
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      keyword: queryParams.keyword,
      category: queryParams.category,
      budgetMin: queryParams.budgetMin,
      budgetMax: queryParams.budgetMax,
      sortBy: queryParams.sortBy || 'createdAt',
      sortOrder: queryParams.sortOrder || 'desc',
      status: queryParams.status || 'open'
    },
    isUndefined
  )

  return queryConfig
}
