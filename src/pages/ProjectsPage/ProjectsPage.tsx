import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, MapPin, CheckCircle2, Star, Clock, DollarSign, Heart, ChevronDown, X } from 'lucide-react'

// ============================================================
// CONSTANTS & MOCK DATA (Giữ nguyên của bạn)
// ============================================================
const CATEGORIES = [
  { label: 'Tất cả', value: '' },
  { label: 'Lập trình Web', value: 'web' },
  { label: 'Mobile App', value: 'mobile' },
  { label: 'UI/UX Design', value: 'uiux' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Data / AI', value: 'data' }
]

const POPULAR_SKILLS = ['ReactJS', 'NodeJS', 'Figma', 'Python', 'SEO', 'Flutter', 'Vue.js', 'TypeScript']

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Ngân sách: Cao → Thấp', value: 'budget_desc' },
  { label: 'Ít báo giá nhất', value: 'bids_asc' },
  { label: 'Nhiều lượt thích', value: 'likes_desc' }
]

const CURRENT_USER = { _id: 'user_me_123' }

const MOCK_MY_APPLICATIONS = [
  { project_id: 'p2', status: 'pending' },
  { project_id: 'p4', status: 'accepted' }
]

// (Tôi thu gọn Mock Projects ở đây cho ngắn, bạn dùng lại y hệt mảng MOCK_PROJECTS của bạn nhé)
const MOCK_PROJECTS = [
  {
    _id: 'p1',
    title: 'Phát triển nền tảng E-commerce bằng MERN Stack',
    description:
      'Cần tìm team có kinh nghiệm làm E-commerce để xây dựng nền tảng bán lẻ. Yêu cầu tích hợp cổng thanh toán VNPay, Momo, giỏ hàng, quản lý kho cơ bản. Dự án cần hoàn thành trong 3 tháng.',
    skills: ['ReactJS', 'NodeJS', 'MongoDB'],
    budget_min: 15000000,
    budget_max: 25000000,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    likes: 24,
    listLike: ['user_abc', 'user_def', 'user_me_123'],
    status: 'open',
    category: 'web',
    contractor: {
      full_name: 'TechVision VN',
      isVerified: true,
      address: 'Hồ Chí Minh',
      avatar: null,
      rating_avg: 4.8,
      rating_count: 32
    },
    applications_count: 5
  },
  {
    _id: 'p2',
    title: 'Thiết kế UI/UX App Đặt Lịch Spa (Figma)',
    description:
      'Cần thiết kế khoảng 15 màn hình cho ứng dụng đặt lịch hẹn Spa. Phong cách tối giản, sang trọng, tone màu pastel. Đã có sẵn wireframe cơ bản, chỉ cần lên visual.',
    skills: ['Figma', 'UI/UX', 'Mobile Design'],
    budget_min: 3000000,
    budget_max: 5000000,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    likes: 45,
    listLike: ['user_abc'],
    status: 'open',
    category: 'uiux',
    contractor: {
      full_name: 'Nguyễn Hoàng Anh',
      isVerified: false,
      address: 'Remote',
      avatar: null,
      rating_avg: 4.2,
      rating_count: 8
    },
    applications_count: 12
  },
  {
    _id: 'p3',
    title: 'Tối ưu hóa tốc độ load web WordPress',
    description:
      'Website WordPress của bên mình đang load khá chậm (~8s). Cần một chuyên gia tối ưu hóa Core Web Vitals, nén ảnh, lazy load, dọn dẹp database để tăng điểm PageSpeed lên 90+.',
    skills: ['WordPress', 'SEO', 'Performance'],
    budget_min: 1000000,
    budget_max: 2000000,
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    likes: 3,
    listLike: [],
    status: 'open',
    category: 'marketing',
    contractor: {
      full_name: 'SEO Agency VN',
      isVerified: true,
      address: 'Hà Nội',
      avatar: null,
      rating_avg: 4.9,
      rating_count: 61
    },
    applications_count: 25
  },
  {
    _id: 'p4',
    title: 'Xây dựng Mobile App quản lý chi tiêu cá nhân (Flutter)',
    description:
      'Cần xây dựng app Flutter cross-platform (iOS & Android) để quản lý chi tiêu cá nhân. Tính năng: thêm giao dịch, phân loại, biểu đồ thống kê theo tháng, xuất PDF báo cáo.',
    skills: ['Flutter', 'Dart', 'Firebase'],
    budget_min: 8000000,
    budget_max: 15000000,
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    likes: 18,
    listLike: ['user_me_123'],
    status: 'open',
    category: 'mobile',
    contractor: {
      full_name: 'Minh Startup Co.',
      isVerified: true,
      address: 'Đà Nẵng',
      avatar: null,
      rating_avg: 0,
      rating_count: 0
    },
    applications_count: 3
  },
  {
    _id: 'p5',
    title: 'Viết content Marketing cho thương hiệu mỹ phẩm',
    description:
      'Cần người viết content cho fanpage Facebook và website thương hiệu mỹ phẩm nội địa. 20 bài/tháng gồm bài đăng mạng xã hội, blog SEO, email marketing. Tone: trẻ trung, gần gũi.',
    skills: ['Content Writing', 'SEO', 'Marketing'],
    budget_min: 2000000,
    budget_max: 4000000,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    likes: 11,
    listLike: [],
    status: 'open',
    category: 'marketing',
    contractor: {
      full_name: 'Beauty Brand HCM',
      isVerified: false,
      address: 'Hồ Chí Minh',
      avatar: null,
      rating_avg: 3.5,
      rating_count: 4
    },
    applications_count: 8
  }
]

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
  if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toLocaleString('vi-VN')
}

function getInitials(fullName: string) {
  if (!fullName) return '?'
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
}

function isHot(project: any) {
  const hoursSincePosted = (Date.now() - new Date(project.created_at).getTime()) / 3600000
  return project.likes >= 10 && hoursSincePosted <= 48
}

function getCompetitionLevel(count: number) {
  if (count <= 5)
    return { label: 'Thấp', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', pct: 20 }
  if (count <= 15)
    return { label: 'Trung bình', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', pct: 55 }
  return { label: 'Cao', color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', pct: 88 }
}

const APPLICATION_STATUS_MAP: Record<string, any> = {
  pending: { label: 'Đang chờ duyệt', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  accepted: { label: 'Đã được chọn', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  rejected: { label: 'Không phù hợp', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' }
}

// ============================================================
// COMPONENTS
// ============================================================

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

// ============================================================
// MAIN PAGE
// ============================================================
export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [myApplications, setMyApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchValue, setSearchValue] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [onlyRemote, setOnlyRemote] = useState(false)
  const [onlySaved, setOnlySaved] = useState(false)

  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 4

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(MOCK_PROJECTS)
      setMyApplications(MOCK_MY_APPLICATIONS)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value)
    setCurrentPage(1)
  }

  const handleToggleLike = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p._id !== projectId) return p
        const isLiked = p.listLike.includes(CURRENT_USER._id)
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
          listLike: isLiked
            ? p.listLike.filter((id: string) => id !== CURRENT_USER._id)
            : [...p.listLike, CURRENT_USER._id]
        }
      })
    )
  }, [])

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
    setOnlyVerified(false)
    setOnlyRemote(false)
    setOnlySaved(false)
    setSortBy('newest')
    setCurrentPage(1)
  }

  // Lọc & Sắp xếp
  const filtered = projects
    .filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false
      if (onlyVerified && !p.contractor.isVerified) return false
      if (onlyRemote && p.contractor.address !== 'Remote') return false
      if (onlySaved && !p.listLike.includes(CURRENT_USER._id)) return false
      if (budgetMin && p.budget_max < Number(budgetMin)) return false
      if (budgetMax && p.budget_min > Number(budgetMax)) return false
      if (selectedSkills.length > 0 && !selectedSkills.some((s) => p.skills.includes(s))) return false
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase()
        return p.title.toLowerCase().includes(q) || p.skills.some((s: string) => s.toLowerCase().includes(q))
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'budget_desc') return b.budget_max - a.budget_max
      if (sortBy === 'bids_asc') return a.applications_count - b.applications_count
      if (sortBy === 'likes_desc') return b.likes - a.likes
      return 0
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="bg-page min-h-screen font-body pb-20">
      {/* ── HERO BANNER ── */}
      <div className="bg-primary pt-12 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            2,450+ dự án đang mở
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Tìm dự án freelance <span className="text-[#89CCF5]">phù hợp kỹ năng của bạn</span>
          </h1>
          <p className="text-[#93A5E6] text-sm sm:text-base max-w-xl mx-auto">
            Kết nối trực tiếp với nhà tuyển dụng uy tín trên toàn quốc
          </p>
        </div>
      </div>

      {/* ── SEARCH BAR (Nổi lên trên banner) ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-7 relative z-20">
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-border flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="w-5 h-5 text-text-muted ml-3" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Tìm theo tên dự án, kỹ năng... (VD: ReactJS, Figma, SEO...)"
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-main py-2"
          />
          {searchValue && (
            <button onClick={() => setSearchValue('')} className="p-1 text-text-muted hover:text-danger">
              <X className="w-5 h-5" />
            </button>
          )}
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors hidden sm:block">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
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
                      onChange={() => setActiveCategory(cat.value)}
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
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="w-full bg-page border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <span className="text-text-muted">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
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
              <div className="space-y-3">
                {[
                  { label: 'Chỉ nhà tuyển dụng đã xác thực', val: onlyVerified, set: setOnlyVerified },
                  { label: 'Cho phép làm Remote', val: onlyRemote, set: setOnlyRemote },
                  { label: 'Dự án đã lưu', val: onlySaved, set: setOnlySaved }
                ].map(({ label, val, set }) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={() => set(!val)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-sub">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PROJECT LIST ── */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-text-sub font-medium">
              Hiển thị <strong className="text-text-main">{filtered.length}</strong> dự án
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            ) : paginated.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              paginated.map((project) => {
                const isLiked = project.listLike.includes(CURRENT_USER._id)
                const hot = isHot(project)
                const comp = getCompetitionLevel(project.applications_count)
                const myApp = myApplications.find((a) => a.project_id === project._id)
                const appStatus = myApp ? APPLICATION_STATUS_MAP[myApp.status] : null

                return (
                  <div
                    key={project._id}
                    className="bg-white border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* Left Accent Bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${hot ? 'bg-accent' : 'bg-transparent group-hover:bg-primary'}`}
                    ></div>

                    {/* Header Card */}
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary font-extrabold text-sm shrink-0">
                          {getInitials(project.contractor.full_name)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-main">{project.contractor.full_name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            {project.contractor.isVerified && (
                              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                              </span>
                            )}
                            {project.contractor.rating_count > 0 && (
                              <span className="flex items-center gap-1 text-amber-700 font-bold">
                                <Star className="w-3 h-3 fill-accent text-accent" />{' '}
                                {project.contractor.rating_avg.toFixed(1)}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-text-sub font-medium">
                              <MapPin className="w-3 h-3" /> {project.contractor.address}
                            </span>
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
                          onClick={() => handleToggleLike(project._id)}
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

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map((skill: string) => (
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

                    {/* Competition Bar */}
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-text-muted uppercase">Mức độ cạnh tranh</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${comp.bg} ${comp.text}`}>
                          {comp.label} · {project.applications_count} báo giá
                        </span>
                      </div>
                      <div className="h-1.5 bg-page rounded-full overflow-hidden">
                        <div
                          className={`h-full ${comp.color} rounded-full transition-all duration-500`}
                          style={{ width: `${comp.pct}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="h-px bg-border mb-4"></div>

                    {/* Footer Card */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          {formatBudget(project.budget_min)} – {formatBudget(project.budget_max)} ₫
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-text-sub">
                          <Clock className="w-4 h-4" /> {timeAgo(project.created_at)}
                        </div>
                      </div>

                      {appStatus ? (
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${appStatus.bg} ${appStatus.text}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${appStatus.dot}`}></span>
                          {appStatus.label}
                        </div>
                      ) : (
                        <Link
                          to={`/projects/${project._id}`}
                          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white hover:bg-primary/90 text-sm font-bold rounded-xl text-center transition-colors"
                        >
                          Gửi Báo Giá
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
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
        </div>
      </div>
    </div>
  )
}
