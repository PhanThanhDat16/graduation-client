import { useState, useCallback } from 'react'
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'

import { projectService } from '@/apis/projectService'
import useProjectQueryConfig from '@/hooks/useProjectQueryConfig'

// Components
import FilterSidebar from './components/FilterSidebar/FilterSidebar'
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import Pagination from '@/components/Pagination/Pagination'
import SortDropdown from '@/components/SortDropDown'

// IMPORT COMPONENT SORT MỚI

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'createdAt_desc' },
  { label: 'Ngân sách: Cao → Thấp', value: 'budgetMax_desc' },
  { label: 'Nhiều lượt thích', value: 'likes_desc' }
]

export default function ProjectsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryConfig = useProjectQueryConfig()

  const [searchInput, setSearchInput] = useState(queryConfig.keyword || '')

  // --- API CALL ---
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['projects', queryConfig],
    queryFn: () => projectService.getProjects(queryConfig),
    placeholderData: keepPreviousData
  })
  // console.log(axiosResponse)

  const apiResponse = axiosResponse?.data
  const projects = apiResponse?.data || []
  const totalPages = apiResponse?.pagination?.totalPages || 1
  const totalItems = apiResponse?.pagination?.total || 0

  // --- HANDLERS ---
  const handleSearchSubmit = () => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ ...queryConfig, keyword: searchInput, page: '1' } as any).toString()
    })
  }

  const handleClearSearch = () => {
    setSearchInput('')
    const newConfig = omit(queryConfig, ['keyword'])
    navigate({
      pathname: location.pathname,
      search: createSearchParams(newConfig as any).toString()
    })
  }

  // ĐÃ SỬA: Nhận trực tiếp chuỗi value từ SortDropdown
  const handleSortChange = (value: string) => {
    const [sortField, sortOrder] = value.split('_')
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ ...queryConfig, sortBy: sortField, sortOrder, page: '1' } as any).toString()
    })
  }

  const handlePageChange = (page: number) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ ...queryConfig, page: page.toString() } as any).toString()
    })
  }

  const handleToggleLike = useCallback((projectId: string) => {
    console.log('Toggle like for project:', projectId)
    // Implement your mutation here
  }, [])

  return (
    <div className="bg-page min-h-screen font-body pb-20">
      {/* HERO SECTION */}
      <div className="bg-primary pt-12 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Tìm dự án freelance <span className="text-[#89CCF5]">phù hợp</span>
          </h1>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-5xl mx-auto px-4 -mt-7 relative z-20">
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-border flex items-center gap-2">
          <Search className="w-5 h-5 text-text-muted ml-3" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Tìm theo tên dự án, kỹ năng..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-main py-2"
          />
          {searchInput && (
            <button onClick={handleClearSearch} className="p-1 text-text-muted hover:text-danger transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleSearchSubmit}
            className="bg-primary hover:bg-primary/90 transition-colors text-white px-6 py-2.5 rounded-xl text-sm font-bold hidden sm:block"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR */}
        <div className="w-full lg:w-[280px] shrink-0 sticky top-24">
          <FilterSidebar queryConfig={queryConfig} />
        </div>

        {/* LISTING */}
        <div className="flex-1 w-full min-w-0">
          {/* TOOLBAR */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <span className="text-sm text-text-sub font-medium">
              Tìm thấy <strong className="text-text-main">{totalItems}</strong> dự án
            </span>

            {/* GỌI SORT DROPDOWN MỚI TẠI ĐÂY */}
            <SortDropdown
              options={SORT_OPTIONS}
              value={`${queryConfig.sortBy}_${queryConfig.sortOrder}`}
              onChange={handleSortChange}
            />
          </div>

          {/* PROJECT CARDS */}
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: Number(queryConfig.limit || 4) }).map((_, i) => <ProjectCardSkeleton key={i} />)
            ) : projects.length === 0 ? (
              <EmptyState onReset={() => navigate(location.pathname)} />
            ) : (
              projects.map((project: any) => (
                <ProjectCard key={project._id} project={project} onToggleLike={handleToggleLike} />
              ))
            )}
          </div>

          {/* PAGINATION */}
          <Pagination
            currentPage={Number(queryConfig.page || 1)}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
