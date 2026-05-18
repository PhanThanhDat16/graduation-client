import { useState } from 'react'
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, Users } from 'lucide-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'

import { userService } from '@/apis/userService'
import useFreelancerQueryConfig from '@/hooks/useFreelancerQueryConfig'

// --- COMPONENTS ---
import Pagination from '@/components/Pagination/Pagination'
import SortDropdown from '@/components/SortDropDown'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import FreelancerCard from '@/components/FreelancerCard'
import HeroSection from '@/components/HeroSection/HeroSection'
import SearchBar from '@/components/SearchBar'

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'createdAt_desc' },
  { label: 'Đánh giá cao nhất', value: 'rating_desc' },
  { label: 'Cũ nhất', value: 'createdAt_asc' }
]

export default function FreelancersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryConfig = useFreelancerQueryConfig()

  const [searchInput, setSearchInput] = useState(queryConfig.keyword || '')

  // --- API CALL ---
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['freelancers', queryConfig],
    staleTime: 0,
    queryFn: () => userService.getFreelancers(queryConfig),
    placeholderData: keepPreviousData
  })

  const apiResponse = axiosResponse?.data
  const freelancers = apiResponse?.data || []
  const totalPages = apiResponse?.pagination?.totalPages || 1
  const totalItems = apiResponse?.pagination?.total || 0

  // --- HANDLERS URL ---
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

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-20">
      {/* ── HERO BANNER & SEARCH BỘP CHUNG VÀO 1 KHỐI ── */}
      <HeroSection
        icon={<Users size={32} className="text-blue-400" />}
        title="Khám phá mạng lưới"
        highlightWord="Chuyên gia"
        subtitle="Hàng ngàn Freelancer tài năng đã được xác thực, sẵn sàng biến ý tưởng của bạn thành hiện thực."
      >
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearchSubmit}
          onClear={handleClearSearch}
          placeholder="Tìm kiếm theo tên freelancer, kỹ năng..."
        />
      </HeroSection>

      {/* ── MAIN CONTENT (1 CỘT CHÍNH GIỮA) ── */}
      {/* ĐÃ FIX: Thu hẹp max-w-4xl và đổi -mt-12 thành -mt-6 để giao diện đè lên mượt mà */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        {/* TOOLBAR */}
        <div className="bg-white rounded-2xl p-4 sm:px-6 sm:py-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <span className="text-sm text-slate-500 font-medium">
            Tìm thấy <strong className="text-slate-900 text-base">{totalItems}</strong> hồ sơ chuyên gia
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm text-slate-400 hidden sm:block">Sắp xếp theo:</span>
            <div className="w-full sm:w-auto">
              <SortDropdown
                options={SORT_OPTIONS}
                value={`${queryConfig.sortBy || 'createdAt'}_${queryConfig.sortOrder || 'desc'}`}
                onChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        {/* DANH SÁCH THẺ FREELANCER */}
        <div className="space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p className="font-bold text-slate-500 text-sm animate-pulse">Đang tải danh sách nhân tài...</p>
            </div>
          ) : freelancers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <EmptyState onReset={() => navigate(location.pathname)} />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">
              {freelancers.map((freelancer: any) => (
                <FreelancerCard key={freelancer._id} freelancer={freelancer} />
              ))}
            </div>
          )}
        </div>

        {/* PHÂN TRANG */}
        <div className="mt-10">
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
