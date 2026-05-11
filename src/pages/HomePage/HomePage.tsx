import { Link } from 'react-router-dom'
import {
  Search,
  Code,
  PenTool,
  Smartphone,
  Megaphone,
  Briefcase,
  Star,
  ArrowRight,
  ShieldCheck,
  Users,
  DollarSign,
  Clock
} from 'lucide-react'
import { projectService } from '@/apis/projectService'
import { userService } from '@/apis/userService'
import { useQuery } from '@tanstack/react-query'

// --- MOCK DATA ---
const POPULAR_CATEGORIES = [
  { id: 'c1', name: 'Lập trình Web', icon: Code, count: 1240 },
  { id: 'c2', name: 'Thiết kế UI/UX', icon: PenTool, count: 850 },
  { id: 'c3', name: 'Mobile App', icon: Smartphone, count: 432 },
  { id: 'c4', name: 'Digital Marketing', icon: Megaphone, count: 610 }
]

export default function HomePage() {
  const {
    data: projectsResponse,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['projects', 'latest'], // Từ khóa để React Query lưu cache
    queryFn: () => projectService.getProjects({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc', status: 'open' })
  })
  const projects = projectsResponse?.data.data || []

  // Fetch top freelancers with highest rating
  const {
    data: freelancersResponse,
    isLoading: freelancersLoading,
    isError: freelancersError
  } = useQuery({
    queryKey: ['freelancers', 'top'],
    queryFn: () =>
      userService.getFreelancers({
        limit: 4,
        sortBy: 'ratingAvg',
        sortOrder: 'desc',
        isVerified: true
      })
  })
  const topFreelancers = freelancersResponse?.data.data || []

  // 3. Hàm format tiền
  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')
  return (
    <div className="min-h-screen pb-20 bg-page font-body">
      {/* --- HERO SECTION --- */}
      <section className="relative px-4 pt-20 overflow-hidden bg-primary pb-28 sm:px-6">
        {/* Background Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid items-center gap-12 mx-auto max-w-7xl lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Nền tảng Freelance số 1 Việt Nam
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white font-heading sm:text-5xl lg:text-6xl">
              Tìm kiếm <span className="text-[#89CCF5]">nhân tài</span> cho dự án tiếp theo của bạn
            </h1>
            <p className="text-[#93A5E6] text-lg sm:text-xl mb-8 max-w-xl">
              Hàng ngàn freelancer chất lượng cao đang sẵn sàng. Thanh toán an toàn tuyệt đối qua hệ thống Escrow của
              chúng tôi.
            </p>

            {/* Thanh tìm kiếm Hero */}
            <div className="flex items-center max-w-2xl p-2 bg-white shadow-lg rounded-2xl">
              <div className="pl-4 text-text-sub">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Tìm kỹ năng (VD: React, Thiết kế logo...)"
                className="w-full px-4 py-3 font-medium bg-transparent border-none outline-none text-text-main"
              />
              <Link
                to="/projects"
                className="px-6 py-3 font-bold text-white transition-all shadow-sm bg-primary hover:bg-primary/90 rounded-xl whitespace-nowrap"
              >
                Tìm kiếm
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-[#93A5E6]">
              <span>Gợi ý:</span>
              {['Website', 'App Mobile', 'Logo', 'SEO'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Image (Illustrative Placeholder) */}
          <div className="justify-end hidden lg:flex">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                alt="Freelancers working"
                className="border-4 shadow-2xl rounded-2xl border-white/10"
              />
              <div className="absolute flex items-center gap-4 p-5 bg-white shadow-xl -bottom-6 -left-6 text-text-main rounded-2xl">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-extrabold">100%</p>
                  <p className="text-sm font-medium text-text-sub">Thanh toán Escrow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CÁCH HOẠT ĐỘNG --- */}
      <section className="py-20 bg-page">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-extrabold font-heading text-text-main">Mọi thứ hoạt động như thế nào?</h2>
            <p className="text-lg text-text-sub">Quy trình đơn giản, minh bạch và an toàn cho cả hai bên.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-8 text-center transition-all bg-white border shadow-sm rounded-2xl border-border hover:shadow-md group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 transition-transform bg-indigo-50 rounded-2xl text-primary group-hover:scale-110">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-main">1. Đăng dự án</h3>
              <p className="leading-relaxed text-text-sub">
                Mô tả yêu cầu, ngân sách và thời gian mong muốn. Đăng tải hoàn toàn miễn phí.
              </p>
            </div>
            <div className="p-8 text-center transition-all bg-white border shadow-sm rounded-2xl border-border hover:shadow-md group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 transition-transform bg-amber-50 rounded-2xl text-accent group-hover:scale-110">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-main">2. Chọn Freelancer</h3>
              <p className="leading-relaxed text-text-sub">
                Nhận báo giá, xem hồ sơ, đánh giá và chọn người phù hợp nhất cho dự án của bạn.
              </p>
            </div>
            <div className="p-8 text-center transition-all bg-white border shadow-sm rounded-2xl border-border hover:shadow-md group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 transition-transform bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-main">3. Thanh toán An toàn</h3>
              <p className="leading-relaxed text-text-sub">
                Tiền được giữ an toàn trong Ví Escrow. Chỉ giải ngân khi bạn hoàn toàn hài lòng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DANH MỤC PHỔ BIẾN --- */}
      <section className="py-20 bg-white border-y border-border">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="mb-3 text-3xl font-extrabold font-heading text-text-main">Danh mục phổ biến</h2>
              <p className="text-text-sub">Khám phá các kỹ năng được tìm kiếm nhiều nhất</p>
            </div>
            <Link
              to="/projects"
              className="items-center hidden gap-2 font-bold transition-colors sm:flex text-primary hover:text-primary/80"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/projects?category=${cat.id}`}
                className="p-6 transition-all border group bg-page rounded-2xl border-border hover:border-primary/50 hover:shadow-md"
              >
                <cat.icon className="w-10 h-10 mb-4 transition-colors text-text-muted group-hover:text-primary" />
                <h3 className="mb-1 text-lg font-bold transition-colors text-text-main group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="text-sm font-medium text-text-sub">{cat.count} dự án</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- DỰ ÁN MỚI NHẤT --- */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="mb-2 text-3xl font-extrabold text-slate-900">Việc làm mới nhất</h2>
            <p className="text-slate-500">Hàng ngàn cơ hội đang chờ đón bạn.</p>
          </div>
          <Link to="/projects" className="font-bold text-indigo-600 hover:text-indigo-800">
            Xem tất cả &rarr;
          </Link>
        </div>

        {/* Xử lý trạng thái Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Xử lý trạng thái Lỗi */}
        {isError && (
          <div className="py-12 font-bold text-center text-red-500 bg-red-50 rounded-2xl">
            Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau!
          </div>
        )}

        {/* Hiển thị dữ liệu THẬT */}
        {!isLoading && !isError && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="p-6 transition-shadow bg-white border border-slate-200 rounded-2xl hover:shadow-md group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> Mới đăng
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                  <Link to={`/projects/${project._id}`}>{project.title}</Link>
                </h3>

                <p className="mb-4 text-sm text-slate-500 line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.skills?.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 text-xs font-medium rounded text-slate-600 bg-slate-100">
                      {skill}
                    </span>
                  ))}
                  {(project.skills?.length || 0) > 3 && (
                    <span className="px-2 py-1 text-xs font-medium rounded text-slate-400 bg-slate-50">
                      +{(project.skills?.length || 0) - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1 font-extrabold text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                    {formatMoney(project.budgetMin)} {project.budgetMax ? `- ${formatMoney(project.budgetMax)}` : '+'} ₫
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- FREELANCER NỔI BẬT --- */}
      {topFreelancers.length > 0 && (
        <section className="py-20 bg-white border-t border-border">
          <div className="px-4 mx-auto max-w-7xl sm:px-6">
            <h2 className="mb-12 text-3xl font-extrabold font-heading text-text-main">Freelancer Tiêu Biểu</h2>

            {freelancersLoading && (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
            )}

            {freelancersError && (
              <div className="py-12 font-bold text-center text-red-500 bg-red-50 rounded-2xl">
                Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau!
              </div>
            )}

            {!freelancersLoading && !freelancersError && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {topFreelancers.map((freelancer: any) => (
                  <div
                    key={freelancer._id}
                    className="p-6 text-center transition-all bg-white border rounded-2xl border-border hover:shadow-md hover:-translate-y-1"
                  >
                    <img
                      src={freelancer.avatar}
                      alt={freelancer.fullName}
                      className="object-cover w-24 h-24 mx-auto mb-4 border-4 rounded-full shadow-sm border-page"
                    />
                    <h3 className="text-lg font-bold text-text-main">{freelancer.fullName}</h3>
                    <p className="mb-3 text-sm font-medium text-text-sub">{freelancer.description || 'Freelancer'}</p>
                    <div className="flex items-center justify-center gap-1 mb-6 text-sm font-bold text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-text-main">{(freelancer.ratingAvg || 0).toFixed(1)}</span>
                      <span className="font-normal text-text-muted">({freelancer.ratingCount || 0})</span>
                    </div>
                    <Link
                      to={`/freelancers/${freelancer._id}`}
                      className="block w-full bg-page border border-border hover:border-primary/30 text-text-main hover:text-primary px-4 py-2.5 rounded-xl font-bold transition-colors"
                    >
                      Xem hồ sơ
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- BOTTOM CTA --- */}
      <section className="py-12 bg-page">
        <div className="max-w-5xl px-4 mx-auto text-center sm:px-6">
          <div className="relative p-10 overflow-hidden shadow-xl bg-primary rounded-3xl sm:p-14">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

            <h2 className="relative z-10 mb-6 text-3xl font-extrabold leading-tight text-white font-heading sm:text-4xl">
              Sẵn sàng để bắt đầu hành trình mới?
            </h2>
            <p className="relative z-10 text-[#93A5E6] text-lg mb-8 max-w-2xl mx-auto font-medium">
              Tham gia ngay hôm nay để kết nối, làm việc và thanh toán an toàn. Dù bạn muốn thuê chuyên gia hay tìm
              việc, FreeWork đều dành cho bạn.
            </p>

            <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/post-project"
                className="bg-accent hover:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5"
              >
                Đăng Dự Án Ngay
              </Link>
              <Link
                to="/register"
                className="bg-white hover:bg-gray-50 text-primary px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5"
              >
                Trở Thành Freelancer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
