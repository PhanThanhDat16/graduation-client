import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Clock, DollarSign, Heart, ChevronDown, X, MapPin, Loader2 } from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { IProject, IProjectQuery } from '@/types/project'

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Tất cả', value: '' },
  { label: 'Lập trình Web', value: 'Lập trình Web' },
  { label: 'Mobile App', value: 'Mobile App' },
  { label: 'UI/UX Design', value: 'UI/UX Design' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Data / AI', value: 'Data / AI' },
  { label: 'Viết lách & Dịch thuật', value: 'Viết lách & Dịch thuật' }
]

const POPULAR_SKILLS = ['ReactJS', 'NodeJS', 'Figma', 'Python', 'SEO', 'Flutter', 'Vue.js', 'TypeScript']

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Ngân sách: Cao → Thấp', value: 'budget_desc' },
  { label: 'Nhiều lượt thích', value: 'likes_desc' }
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(isoString: string) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

function formatBudget(num: number) {
  return num.toLocaleString('vi-VN')
}

function isHot(project: IProject) {
  const hoursSincePosted = (Date.now() - new Date(project.createdAt).getTime()) / 3600000
  return project.likes >= 10 && hoursSincePosted <= 48
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function ProjectCardSkeleton() {
  return (
    <div className="bg-white border border-border rounded-xl p-6 relative overflow-hidden">
      <div className="animate-pulse">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
          <div className="flex flex-col gap-2">
            <div className="w-32 h-3 bg-gray-200 rounded"></div>
            <div className="w-20 h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-3/4 h-5 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
        <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-16 bg-white border border-border rounded-xl">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-lg font-bold text-text-main mb-2">Không tìm thấy dự án phù hợp</h3>
      <p className="text-sm text-text-sub mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      <button
        onClick={onReset}
        className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
      >
        Xóa bộ lọc
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { projects, pagination, listLoading, fetchProjects, likeProject } = useProjectStore()
  const { user } = useAuthStore()
  const currentUserId = (user as any)?._id || (user as any)?.id || ''

  // Filter state (client-side on top of API)
  const [searchValue, setSearchValue] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [onlySaved, setOnlySaved] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  // Build query for API
  const buildQuery = useCallback((): IProjectQuery => {
    const q: IProjectQuery = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      status: 'open'
    }

    if (activeCategory) q.category = activeCategory
    if (searchValue.trim()) q.keyword = searchValue.trim()
    if (budgetMin) q.budgetMin = Number(budgetMin)
    if (budgetMax) q.budgetMax = Number(budgetMax)

    if (sortBy === 'likes_desc') {
      q.sortBy = 'likes'
      q.sortOrder = 'desc'
    }

    if (sortBy === 'budget_desc') {
      q.sortBy = 'budgetMax'
      q.sortOrder = 'desc'
    }

    if (sortBy === 'newest') {
      q.sortBy = 'createdAt'
      q.sortOrder = 'desc'
    }

    return q
  }, [currentPage, activeCategory, searchValue, budgetMin, budgetMax, sortBy])

  useEffect(() => {
    fetchProjects(buildQuery())
  }, [fetchProjects, buildQuery])

  const handleToggleLike = useCallback(
    (projectId: string) => {
      likeProject(projectId, currentUserId)
    },
    [likeProject, currentUserId]
  )

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchValue('')
    setActiveCategory('')
    setSelectedSkills([])
    setBudgetMin('')
    setBudgetMax('')
    setOnlySaved(false)
    setSortBy('newest')
    setCurrentPage(1)
  }

  // Client-side skill filter (server doesn't support array skill filter)
  const filtered = projects.filter((p) => {
    if (selectedSkills.length > 0 && !selectedSkills.some((s) => p.skills.includes(s))) return false
    if (onlySaved && !p.listLike.includes(currentUserId)) return false
    return true
  })

  const totalPages = pagination.totalPages

  return (
    <div className="bg-page min-h-screen font-body pb-20">
      {/* ── HERO ── */}
      <div className="bg-primary pt-12 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {pagination.total}+ dự án đang mở
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Tìm dự án freelance <span className="text-[#89CCF5]">phù hợp kỹ năng của bạn</span>
          </h1>
          <p className="text-[#93A5E6] text-sm sm:text-base max-w-xl mx-auto">
            Kết nối trực tiếp với nhà tuyển dụng uy tín trên toàn quốc
          </p>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-7 relative z-20">
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-border flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="w-5 h-5 text-text-muted ml-3" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Tìm theo tên dự án, kỹ năng... (VD: ReactJS, Figma, SEO...)"
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-main py-2"
          />
          {searchValue && (
            <button onClick={() => setSearchValue('')} className="p-1 text-text-muted hover:text-danger">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => fetchProjects(buildQuery())}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors hidden sm:block"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* ── SIDEBAR FILTERS ── */}
        <div className="w-full lg:w-[280px] shrink-0 sticky top-24">
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-gray-50/50">
              <span className="font-bold text-sm text-text-main flex items-center gap-2">
                <Filter className="w-4 h-4 text-text-sub" /> Bộ lọc
              </span>
              <button onClick={handleReset} className="text-xs font-bold text-danger hover:underline">
                Xóa tất cả
              </button>
            </div>

            {/* Danh mục */}
            <div className="px-5 py-5 border-b border-border">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Danh mục</div>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.value}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${activeCategory === cat.value ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={activeCategory === cat.value}
                      onChange={() => {
                        setActiveCategory(cat.value)
                        setCurrentPage(1)
                      }}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span
                      className={`text-sm ${activeCategory === cat.value ? 'text-primary font-bold' : 'text-text-sub font-medium'}`}
                    >
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ngân sách */}
            <div className="px-5 py-5 border-b border-border">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Ngân sách (VND)</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={budgetMin}
                  onChange={(e) => {
                    setBudgetMin(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full bg-page border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <span className="text-text-muted">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={budgetMax}
                  onChange={(e) => {
                    setBudgetMax(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full bg-page border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Kỹ năng */}
            <div className="px-5 py-5 border-b border-border">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Kỹ năng phổ biến</div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((skill) => {
                  const active = selectedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${active ? 'bg-indigo-50 border-primary/30 text-primary' : 'bg-white border-border text-text-sub hover:border-gray-300'}`}
                    >
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Khác */}
            <div className="px-5 py-5">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Tùy chọn khác</div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlySaved}
                  onChange={() => setOnlySaved(!onlySaved)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text-sub">Dự án đã lưu</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── PROJECT LIST ── */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-text-sub font-medium">
              Hiển thị <strong className="text-text-main">{pagination.total}</strong> dự án
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="appearance-none bg-white border border-border rounded-xl px-4 py-2 pr-10 text-sm font-bold text-text-main outline-none cursor-pointer shadow-sm"
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
            {listLoading ? (
              Array.from({ length: 4 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              filtered.map((project) => {
                const isLiked = project.listLike.includes(currentUserId)
                const hot = isHot(project)

                return (
                  <div
                    key={project._id}
                    className="bg-white border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${hot ? 'bg-amber-400' : 'bg-transparent group-hover:bg-primary'}`}
                    ></div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary font-extrabold text-sm shrink-0">
                          {(project.contractorId as any)?.fullName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-main">
                            {(project.contractorId as any)?.fullName || 'Ẩn danh'}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-text-sub font-medium">
                            <MapPin className="w-3 h-3" /> Việt Nam
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hot && (
                          <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            🔥 Nổi bật
                          </span>
                        )}
                        <button
                          onClick={() => (currentUserId ? handleToggleLike(project._id) : undefined)}
                          title={currentUserId ? undefined : 'Đăng nhập để lưu dự án'}
                          className={`p-2 rounded-xl border transition-colors ${isLiked ? 'bg-red-50 border-red-200' : 'bg-white border-border hover:bg-gray-50'}`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-text-muted'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <Link to={`/projects/${project._id}`} className="block mb-3">
                      <h2 className="font-heading font-extrabold text-lg text-primary hover:text-accent transition-colors line-clamp-1">
                        {project.title}
                      </h2>
                    </Link>

                    {/* Category badge */}
                    <span className="inline-block mb-3 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-full border border-indigo-200">
                      {project.category}
                    </span>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-page border border-border text-text-sub text-[11px] font-bold rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-sub leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                    <div className="h-px bg-border mb-4"></div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          {formatBudget(project.budgetMin)} – {formatBudget(project.budgetMax)} ₫
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-text-sub">
                          <Clock className="w-4 h-4" /> {timeAgo(project.createdAt)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-text-sub">
                          <Heart className="w-3.5 h-3.5" /> {project.likes}
                        </div>
                      </div>

                      <Link
                        to={`/projects/${project._id}`}
                        className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white hover:bg-primary/90 text-sm font-bold rounded-xl text-center transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {!listLoading && totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold border transition-colors ${currentPage === page ? 'bg-primary text-white border-primary' : 'bg-white text-text-sub border-border hover:bg-page'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {/* Loading indicator for page changes */}
          {listLoading && projects.length > 0 && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
