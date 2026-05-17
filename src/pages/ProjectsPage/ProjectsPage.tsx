import { useState } from 'react'
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { toast } from 'react-toastify'
import { useAuthStore } from '@/store/useAuthStore'
import HeroSection from '@/components/HeroSection/HeroSection'
import SearchBar from '@/components/SearchBar/SearchBar'

// IMPORT COMPONENT SORT MỚI

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'createdAtDesc' },
  { label: 'Ngân sách: Cao → Thấp', value: 'budgetMaxDesc' },
  { label: 'Nhiều lượt thích', value: 'likesDesc' }
]

export default function ProjectsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const queryConfig = useProjectQueryConfig()
  const { user } = useAuthStore()
  const [searchInput, setSearchInput] = useState(queryConfig.keyword || '')

  // --- API CALL ---
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['projects', queryConfig],
    queryFn: () => projectService.getProjects(queryConfig),
    staleTime: 0,
    placeholderData: keepPreviousData
  })
  const toggleLikeMutation = useMutation({
    mutationFn: (projectId: string) => projectService.toggleLikeProject(projectId),
    onSuccess: () => {
      // Khi thả tim thành công, tự động refetch lại danh sách dự án
      // để nút Tim cập nhật trạng thái ngay lập tức
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
    }
  })

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

  const handleToggleLike = (projectId: string) => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để lưu dự án bạn nhé!')
      return
    }

    toggleLikeMutation.mutate(projectId)
  }

  return (
    <div className="min-h-screen pb-20 bg-page font-body">
      {/* HERO SECTION */}
      <HeroSection
        icon={<Briefcase size={32} className="text-indigo-400" />}
        title="Tìm dự án freelance"
        highlightWord="phù hợp"
        subtitle="Hàng ngàn cơ hội việc làm mới được cập nhật mỗi ngày từ các khách hàng uy tín."
      >
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearchSubmit}
          onClear={handleClearSearch}
          placeholder="Tìm theo tên dự án, kỹ năng..."
        />
      </HeroSection>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-start gap-8 px-4 pt-12 mx-auto max-w-7xl sm:px-6 lg:flex-row">
        {/* SIDEBAR */}
        <div className="w-full lg:w-[280px] shrink-0 sticky top-24">
          <FilterSidebar queryConfig={queryConfig} />
        </div>

        {/* LISTING */}
        <div className="flex-1 w-full min-w-0">
          {/* TOOLBAR */}
          <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
            <span className="text-sm font-medium text-text-sub">
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
              projects.map((project: any) => {
                return <ProjectCard key={project._id} project={project} onToggleLike={handleToggleLike} />
              })
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
