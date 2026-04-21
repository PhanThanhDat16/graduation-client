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
  Users
} from 'lucide-react'

// --- MOCK DATA ---
const POPULAR_CATEGORIES = [
  { id: 'c1', name: 'Lập trình Web', icon: Code, count: 1240 },
  { id: 'c2', name: 'Thiết kế UI/UX', icon: PenTool, count: 850 },
  { id: 'c3', name: 'Mobile App', icon: Smartphone, count: 432 },
  { id: 'c4', name: 'Digital Marketing', icon: Megaphone, count: 610 }
]

const FEATURED_PROJECTS = [
  {
    id: 'p1',
    title: 'Thiết kế Landing Page cho chiến dịch Tết',
    budget: '2,000,000đ - 5,000,000đ',
    skills: ['Figma', 'UI/UX', 'Photoshop'],
    time: 'Đăng 2 giờ trước',
    proposals: 5
  },
  {
    id: 'p2',
    title: 'Lập trình ứng dụng React Native',
    budget: '15,000,000đ - 30,000,000đ',
    skills: ['React Native', 'NodeJS', 'MongoDB'],
    time: 'Đăng 5 giờ trước',
    proposals: 12
  },
  {
    id: 'p3',
    title: 'Viết nội dung chuẩn SEO mảng Công nghệ',
    budget: '500,000đ - 1,000,000đ',
    skills: ['Copywriting', 'SEO', 'Content'],
    time: 'Đăng 1 ngày trước',
    proposals: 25
  }
]

const TOP_FREELANCERS = [
  {
    id: 'f1',
    name: 'Trần Lê Nam',
    role: 'Fullstack Developer',
    rating: 4.9,
    reviews: 124,
    avatar: 'https://ui-avatars.com/api/?name=Tran+Nam&background=1B2A6B&color=fff'
  },
  {
    id: 'f2',
    name: 'Nguyễn Hà',
    role: 'UI/UX Designer',
    rating: 5.0,
    reviews: 89,
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Ha&background=F59E0B&color=fff'
  },
  {
    id: 'f3',
    name: 'Phạm Minh',
    role: 'Mobile Dev',
    rating: 4.8,
    reviews: 56,
    avatar: 'https://ui-avatars.com/api/?name=Pham+Minh&background=16A34A&color=fff'
  },
  {
    id: 'f4',
    name: 'Lê Thu',
    role: 'Marketing Expert',
    rating: 4.9,
    reviews: 210,
    avatar: 'https://ui-avatars.com/api/?name=Le+Thu&background=DC2626&color=fff'
  }
]

export default function HomePage() {
  return (
    <div className="bg-page font-body min-h-screen pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-primary pt-20 pb-28 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Nền tảng Freelance số 1 Việt Nam
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Tìm kiếm <span className="text-[#89CCF5]">nhân tài</span> cho dự án tiếp theo của bạn
            </h1>
            <p className="text-[#93A5E6] text-lg sm:text-xl mb-8 max-w-xl">
              Hàng ngàn freelancer chất lượng cao đang sẵn sàng. Thanh toán an toàn tuyệt đối qua hệ thống Escrow của
              chúng tôi.
            </p>

            {/* Thanh tìm kiếm Hero */}
            <div className="bg-white p-2 rounded-2xl flex items-center shadow-lg max-w-2xl">
              <div className="pl-4 text-text-sub">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Tìm kỹ năng (VD: React, Thiết kế logo...)"
                className="w-full bg-transparent border-none text-text-main px-4 py-3 outline-none font-medium"
              />
              <Link
                to="/projects"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm whitespace-nowrap"
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
          <div className="hidden lg:flex justify-end">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                alt="Freelancers working"
                className="rounded-2xl shadow-2xl border-4 border-white/10"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-text-main p-5 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-extrabold text-xl">100%</p>
                  <p className="text-text-sub text-sm font-medium">Thanh toán Escrow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CÁCH HOẠT ĐỘNG --- */}
      <section className="py-20 bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading font-extrabold text-3xl text-text-main mb-4">Mọi thứ hoạt động như thế nào?</h2>
            <p className="text-text-sub text-lg">Quy trình đơn giản, minh bạch và an toàn cho cả hai bên.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border text-center hover:shadow-md transition-all group">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-text-main mb-3">1. Đăng dự án</h3>
              <p className="text-text-sub leading-relaxed">
                Mô tả yêu cầu, ngân sách và thời gian mong muốn. Đăng tải hoàn toàn miễn phí.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border text-center hover:shadow-md transition-all group">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-text-main mb-3">2. Chọn Freelancer</h3>
              <p className="text-text-sub leading-relaxed">
                Nhận báo giá, xem hồ sơ, đánh giá và chọn người phù hợp nhất cho dự án của bạn.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border text-center hover:shadow-md transition-all group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-text-main mb-3">3. Thanh toán An toàn</h3>
              <p className="text-text-sub leading-relaxed">
                Tiền được giữ an toàn trong Ví Escrow. Chỉ giải ngân khi bạn hoàn toàn hài lòng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DANH MỤC PHỔ BIẾN --- */}
      <section className="py-20 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading font-extrabold text-3xl text-text-main mb-3">Danh mục phổ biến</h2>
              <p className="text-text-sub">Khám phá các kỹ năng được tìm kiếm nhiều nhất</p>
            </div>
            <Link
              to="/projects"
              className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/projects?category=${cat.id}`}
                className="group bg-page p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
              >
                <cat.icon className="w-10 h-10 text-text-muted group-hover:text-primary transition-colors mb-4" />
                <h3 className="font-bold text-lg text-text-main mb-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-text-sub font-medium">{cat.count} dự án</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- DỰ ÁN MỚI NHẤT --- */}
      <section className="py-20 bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-extrabold text-3xl text-text-main mb-12">Dự án mới nhất</h2>

          <div className="space-y-4">
            {FEATURED_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between group"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-primary group-hover:text-accent transition-colors cursor-pointer mb-2">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-text-sub mb-4">
                    <span className="text-emerald-600 font-bold">{project.budget}</span>
                    <span className="w-1 h-1 bg-border rounded-full"></span>
                    <span>{project.time}</span>
                    <span className="w-1 h-1 bg-border rounded-full"></span>
                    <span>{project.proposals} báo giá</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-page border border-border text-text-sub px-3 py-1 rounded-full text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  <Link
                    to={`/projects/${project.id}`}
                    className="w-full md:w-auto block text-center bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
                  >
                    Gửi báo giá
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/projects"
              className="inline-block bg-white border border-border shadow-sm text-text-main hover:text-primary px-8 py-3 rounded-xl font-bold transition-all hover:bg-gray-50"
            >
              Xem thêm hàng ngàn dự án khác
            </Link>
          </div>
        </div>
      </section>

      {/* --- FREELANCER NỔI BẬT --- */}
      <section className="py-20 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-extrabold text-3xl text-text-main mb-12">Freelancer Tiêu Biểu</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOP_FREELANCERS.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white p-6 rounded-2xl border border-border text-center hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-page object-cover shadow-sm"
                />
                <h3 className="font-bold text-lg text-text-main">{freelancer.name}</h3>
                <p className="text-sm font-medium text-text-sub mb-3">{freelancer.role}</p>
                <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-sm mb-6">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-text-main">{freelancer.rating}</span>
                  <span className="text-text-muted font-normal">({freelancer.reviews})</span>
                </div>
                <Link
                  to={`/freelancers/${freelancer.id}`}
                  className="block w-full bg-page border border-border hover:border-primary/30 text-text-main hover:text-primary px-4 py-2.5 rounded-xl font-bold transition-colors"
                >
                  Xem hồ sơ
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="py-12 bg-page">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-primary rounded-3xl p-10 sm:p-14 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

            <h2 className="relative z-10 font-heading font-extrabold text-3xl sm:text-4xl text-white mb-6 leading-tight">
              Sẵn sàng để bắt đầu hành trình mới?
            </h2>
            <p className="relative z-10 text-[#93A5E6] text-lg mb-8 max-w-2xl mx-auto font-medium">
              Tham gia ngay hôm nay để kết nối, làm việc và thanh toán an toàn. Dù bạn muốn thuê chuyên gia hay tìm
              việc, FreeWork đều dành cho bạn.
            </p>

            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
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
