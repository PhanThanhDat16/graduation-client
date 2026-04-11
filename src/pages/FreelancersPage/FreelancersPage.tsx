import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  Star,
  Heart,
  ChevronDown,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react'

// --- MOCK DATA ---
const CATEGORIES = ['Tất cả', 'Lập trình Web', 'Mobile App', 'UI/UX Design', 'Marketing', 'Data / AI']
const SKILLS = ['ReactJS', 'NodeJS', 'Figma', 'Python', 'SEO', 'Flutter', 'TypeScript']

const MOCK_FREELANCERS = [
  {
    id: 'f1',
    full_name: 'Nguyễn Tấn Sang',
    title: 'Senior Fullstack Developer (MERN / React Native)',
    avatar: 'https://ui-avatars.com/api/?name=Tan+Sang&background=1B2A6B&color=fff',
    is_verified: true,
    rating: 4.9,
    reviews: 124,
    success_rate: 98,
    hourly_rate: 250000,
    earned: '500M+',
    location: 'Đà Nẵng, VN',
    skills: ['ReactJS', 'NodeJS', 'TypeScript', 'MongoDB'],
    bio: 'Hơn 4 năm kinh nghiệm xây dựng Web/Mobile App hiệu suất cao. Chuyên gia về hệ sinh thái JavaScript. Đã từng làm việc với các dự án E-commerce, hệ thống quản lý lớn.',
    is_saved: true
  },
  {
    id: 'f2',
    full_name: 'Trần Thu Hà',
    title: 'Chuyên gia Thiết kế UI/UX & Product Design',
    avatar: 'https://ui-avatars.com/api/?name=Thu+Ha&background=F59E0B&color=fff',
    is_verified: true,
    rating: 5.0,
    reviews: 89,
    success_rate: 100,
    hourly_rate: 150000,
    earned: '200M+',
    location: 'Hà Nội, VN',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
    bio: 'Thiết kế giao diện người dùng tối giản, hiện đại và tập trung vào trải nghiệm (User-centric). Đã hoàn thành hơn 50+ dự án App/Web cho các startup công nghệ.',
    is_saved: false
  },
  {
    id: 'f3',
    full_name: 'Lê Minh Phát',
    title: 'Mobile App Developer (Flutter / iOS / Android)',
    avatar: 'https://ui-avatars.com/api/?name=Minh+Phat&background=16A34A&color=fff',
    is_verified: false,
    rating: 4.7,
    reviews: 32,
    success_rate: 92,
    hourly_rate: 180000,
    earned: '50M+',
    location: 'Hồ Chí Minh, VN',
    skills: ['Flutter', 'Dart', 'Firebase', 'RESTful API'],
    bio: 'Phát triển ứng dụng di động đa nền tảng với Flutter. Tối ưu hóa hiệu năng, tích hợp push notification, payment gateway. Code sạch, dễ bảo trì.',
    is_saved: false
  }
]

export default function FreelancersPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  return (
    <div className="bg-page min-h-screen font-body pb-20">
      {/* --- PAGE HEADER --- */}
      <div className="bg-white border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary mb-2">
            Tìm kiếm Freelancer tài năng
          </h1>
          <p className="text-text-sub text-sm">
            Kết nối với hơn 14,000+ chuyên gia đã được xác thực sẵn sàng cho dự án của bạn.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ==========================================
              CỘT TRÁI: BỘ LỌC (SIDEBAR FILTERS)
          ========================================== */}
          <div className={`lg:w-1/4 shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-border">
                <h2 className="font-bold text-base text-text-main flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-text-sub" /> Bộ Lọc
                </h2>
                <button className="text-xs font-semibold text-text-muted hover:text-danger transition-colors">
                  Xóa tất cả
                </button>
              </div>

              {/* Danh mục */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-text-main mb-3">Lĩnh vực chuyên môn</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={activeCategory === cat}
                        onChange={() => setActiveCategory(cat)}
                        className="w-4 h-4 text-primary bg-page border-border focus:ring-primary"
                      />
                      <span
                        className={`text-sm transition-colors ${activeCategory === cat ? 'font-bold text-primary' : 'text-text-sub group-hover:text-text-main font-medium'}`}
                      >
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mức giá theo giờ */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-text-main mb-3">Giá theo giờ (VND)</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    className="w-full bg-page border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                  <span className="text-text-muted">-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    className="w-full bg-page border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Tiêu chí */}
              <div className="mb-6 border-t border-border pt-6">
                <h3 className="font-semibold text-sm text-text-main mb-3">Tiêu chí Freelancer</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" />
                    <span className="text-sm font-medium text-text-sub">Đã xác thực danh tính</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" />
                    <span className="text-sm font-medium text-text-sub">Tỷ lệ thành công {'>'} 90%</span>
                  </label>
                </div>
              </div>

              {/* Kỹ năng */}
              <div>
                <h3 className="font-semibold text-sm text-text-main mb-3">Kỹ năng</h3>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <label key={skill} className="cursor-pointer">
                      <input type="checkbox" className="peer sr-only" />
                      <span className="inline-block px-3 py-1.5 bg-page border border-border text-text-sub text-xs font-bold rounded-lg peer-checked:bg-indigo-50 peer-checked:border-primary/30 peer-checked:text-primary transition-all hover:border-gray-300">
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================
              CỘT PHẢI: TÌM KIẾM & DANH SÁCH FREELANCER
          ========================================== */}
          <div className="lg:w-3/4 flex-1">
            {/* Search & Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, kỹ năng..."
                  className="w-full bg-white border border-border rounded-xl text-sm text-text-main pl-10 pr-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select className="appearance-none bg-white border border-border rounded-xl text-sm text-text-main font-bold pl-4 pr-10 py-2.5 outline-none cursor-pointer hover:bg-gray-50 shadow-sm">
                    <option>Đánh giá cao nhất</option>
                    <option>Giá: Thấp đến Cao</option>
                    <option>Giá: Cao đến Thấp</option>
                    <option>Nhiều giờ làm việc nhất</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  className="lg:hidden p-2.5 bg-white border border-border rounded-xl text-text-sub hover:text-primary shadow-sm"
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List Freelancers */}
            <div className="space-y-4">
              {MOCK_FREELANCERS.map((freelancer) => (
                <div
                  key={freelancer.id}
                  className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={freelancer.avatar}
                        alt={freelancer.full_name}
                        className="w-20 h-20 rounded-full object-cover border border-border"
                      />
                      {freelancer.is_verified && (
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <Link to={`/freelancers/${freelancer.id}`}>
                          <h2 className="font-heading font-extrabold text-xl text-primary hover:text-accent transition-colors">
                            {freelancer.full_name}
                          </h2>
                        </Link>

                        {/* Save Button */}
                        <button
                          className={`p-2 rounded-xl border transition-colors shrink-0 ${freelancer.is_saved ? 'bg-red-50 border-red-200' : 'bg-white border-border hover:bg-gray-50'}`}
                        >
                          <Heart
                            className={`w-4 h-4 ${freelancer.is_saved ? 'fill-danger text-danger' : 'text-text-muted'}`}
                          />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-text-main mb-3">{freelancer.title}</p>

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm mb-4">
                        <div className="flex items-center gap-1 font-bold text-text-main">
                          <span className="text-emerald-600">{formatMoney(freelancer.hourly_rate)}₫</span> / giờ
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                          <span className="font-bold text-text-main">{freelancer.rating}</span>
                          <span className="text-text-muted">({freelancer.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-main font-bold">
                          <ShieldCheck className="w-4 h-4 text-primary" /> {freelancer.success_rate}% Thành công
                        </div>
                        <div className="flex items-center gap-1.5 text-text-sub font-medium">
                          <MapPin className="w-4 h-4" /> {freelancer.location}
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-text-sub leading-relaxed mb-4 line-clamp-2">{freelancer.bio}</p>

                      {/* Skills & Action */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                          {freelancer.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 bg-page border border-border text-text-sub text-[11px] font-bold rounded-lg hover:border-primary hover:text-primary transition-colors cursor-pointer"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/freelancers/${freelancer.id}`}
                          className="w-full sm:w-auto px-6 py-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-white font-bold text-sm rounded-xl transition-colors text-center shrink-0"
                        >
                          Xem hồ sơ
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination UI */}
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-white text-text-sub hover:bg-page transition-colors disabled:opacity-50 font-bold"
                disabled
              >
                &lt;
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-white text-text-main hover:bg-page transition-colors font-bold">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-white text-text-main hover:bg-page transition-colors font-bold">
                3
              </button>
              <span className="text-text-muted px-1">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-white text-text-sub hover:bg-page transition-colors font-bold">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
