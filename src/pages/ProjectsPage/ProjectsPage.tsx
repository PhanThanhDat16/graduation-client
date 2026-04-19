import { useState, useCallback } from 'react'
import { Link, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Search, Clock, DollarSign, Heart, ChevronDown, X } from 'lucide-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { projectService } from '@/apis/projectService'
import ContractorInfo from '@/components/ContractorInfo/ContractorInfo'
import { formatBudget, isHot, timeAgo } from '@/utils/fomatters'
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import FilterSidebar from './components/FilterSidebar/FilterSidebar'
import useProjectQueryConfig from '@/hooks/useProjectQueryConfig'
import { omit } from 'lodash'

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'createdAt_desc' },
  { label: 'Ngân sách: Cao → Thấp', value: 'budgetMax_desc' },
  { label: 'Nhiều lượt thích', value: 'likes_desc' }
]

const CURRENT_USER = { _id: 'user_me_123' }

export default function ProjectsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryConfig = useProjectQueryConfig()

  const [searchInput, setSearchInput] = useState(queryConfig.keyword || '')

  // --- GỌI API ---
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['projects', queryConfig],
    queryFn: () => projectService.getProjects(queryConfig),
    placeholderData: keepPreviousData
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
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
  }, [])

  return (
    <div className="bg-page min-h-screen font-body pb-20">
      {/* ... BANNER GIỮ NGUYÊN ... */}
      <div className="bg-primary pt-12 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Tìm dự án freelance <span className="text-[#89CCF5]">phù hợp</span>
          </h1>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
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
            <button onClick={handleClearSearch} className="p-1 text-text-muted hover:text-danger">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleSearchSubmit}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hidden sm:block"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* ── SIDEBAR FILTERS ── */}
        <div className="w-full lg:w-[280px] shrink-0 sticky top-24">
          <FilterSidebar queryConfig={queryConfig} />
        </div>

        {/* ── PROJECT LIST ── */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-text-sub font-medium">
              Tìm thấy <strong className="text-text-main">{totalItems}</strong> dự án
            </span>
            <div className="relative">
              <select
                value={`${queryConfig.sortBy}_${queryConfig.sortOrder}`}
                onChange={handleSortChange}
                className="appearance-none bg-white border border-border rounded-xl px-4 py-2 pr-10 text-sm font-bold text-text-main outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: Number(queryConfig.limit || 4) }).map((_, i) => <ProjectCardSkeleton key={i} />)
            ) : projects.length === 0 ? (
              <EmptyState onReset={() => navigate(location.pathname)} />
            ) : (
              projects.map((project) => {
                const isLiked = project.listLike?.includes(CURRENT_USER._id)
                const hot = isHot(project)

                return (
                  <div
                    key={project._id}
                    className="bg-white border border-border rounded-2xl p-6 relative flex flex-col shadow-sm group hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${hot ? 'bg-accent' : 'bg-transparent group-hover:bg-primary'}`}
                    ></div>

                    <div className="flex justify-between items-start mb-4 gap-4">
                      <ContractorInfo contractorId={project.contractorId} />
                      <div className="flex gap-2">
                        {hot && (
                          <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">
                            🔥 Nổi bật
                          </span>
                        )}
                        <button onClick={() => handleToggleLike(project._id)} className="p-2 border rounded-xl">
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-text-muted'}`} />
                        </button>
                      </div>
                    </div>

                    <Link to={`/projects/${project._id}`} className="mb-3 block">
                      <h2 className="font-extrabold text-lg text-primary line-clamp-1 hover:text-accent">
                        {project.title}
                      </h2>
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills?.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-page border text-[11px] font-bold rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-text-sub line-clamp-2 flex-grow mb-6">{project.description}</p>
                    <div className="h-px bg-border mb-4"></div>

                    <div className="flex justify-between items-center gap-4 mt-auto">
                      <div className="flex gap-4">
                        <div className="flex gap-1 items-center font-bold text-emerald-600 text-sm">
                          <DollarSign className="w-4 h-4" /> {formatBudget(project.budgetMin)}{' '}
                          {project.budgetMax ? `- ${formatBudget(project.budgetMax)}` : ''} ₫
                        </div>
                        <div className="flex gap-1 items-center text-xs text-text-sub font-medium">
                          <Clock className="w-4 h-4" /> {timeAgo(project.createdAt)}
                        </div>
                      </div>
                      <Link
                        to={`/projects/${project._id}`}
                        className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl"
                      >
                        Gửi Báo Giá
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold border ${Number(queryConfig.page) === page ? 'bg-primary text-white border-primary' : 'bg-white text-text-sub hover:bg-page'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
