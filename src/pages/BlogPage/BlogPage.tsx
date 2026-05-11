import { Link } from 'react-router-dom'
import { Newspaper, Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react'
import HeroSection from '@/components/HeroSection/HeroSection'

// --- MOCK DATA (Dữ liệu cứng) ---
const BLOG_POSTS = [
  {
    id: 'post-1',
    title: 'Bí quyết "chốt deal" thành công với khách hàng quốc tế trên FreeWork',
    excerpt:
      'Làm thế nào để vượt qua rào cản ngôn ngữ và văn hóa để giành được những hợp đồng giá trị cao? Khám phá ngay 5 bước chuẩn bị hồ sơ "vạn người mê".',
    category: 'Kinh nghiệm',
    date: '10/05/2026',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    author: 'Trần Minh Quân',
    isFeatured: true
  },
  {
    id: 'post-2',
    title: 'Top 7 kỹ năng IT được săn đón nhất nửa cuối năm 2026',
    excerpt:
      'Thị trường Freelance đang khát nhân lực ở những mảng nào? Liệu AI có làm thay đổi hoàn toàn cục diện của ngành lập trình?',
    category: 'Xu hướng',
    date: '08/05/2026',
    readTime: '8 phút đọc',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    author: 'Lê Hoàng Kim',
    isFeatured: false
  },
  {
    id: 'post-3',
    title: 'Hướng dẫn sử dụng Ví Escrow an toàn cho người mới',
    excerpt:
      'Hiểu rõ cơ chế thanh toán tạm giữ (Escrow) để bảo vệ quyền lợi của bạn, nói không với rủi ro bùng tiền hoặc chậm thanh toán.',
    category: 'Hướng dẫn',
    date: '05/05/2026',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop',
    author: 'Nguyễn admin',
    isFeatured: false
  },
  {
    id: 'post-4',
    title: 'Câu chuyện thành công: Từ sinh viên năm 3 đến Top Rated Freelancer',
    excerpt:
      'Cùng trò chuyện với bạn Nam - người đã kiếm được hơn $10,000 từ việc thiết kế UI/UX part-time ngay khi còn đang ngồi trên ghế nhà trường.',
    category: 'Cảm hứng',
    date: '01/05/2026',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    author: 'Đội ngũ FreeWork',
    isFeatured: false
  }
]

export default function BlogPage() {
  const featuredPost = BLOG_POSTS.find((post) => post.isFeatured) || BLOG_POSTS[0]
  const recentPosts = BLOG_POSTS.filter((post) => !post.isFeatured)

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24">
      {/* ── TẬN DỤNG HERO SECTION VỪA LÀM ── */}
      <HeroSection
        icon={<Newspaper size={32} className="text-blue-400" />}
        title="Blog &"
        highlightWord="Tin tức"
        subtitle="Cập nhật những xu hướng công nghệ, kinh nghiệm làm việc tự do và các câu chuyện thành công mới nhất từ cộng đồng FreeWork."
      />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-12">
        {/* 1. BÀI VIẾT NỔI BẬT (FEATURED POST) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col lg:flex-row gap-6 lg:gap-10 group transition-all">
          {/* Ảnh Cover */}
          <div className="w-full lg:w-3/5 h-64 sm:h-80 lg:h-[400px] overflow-hidden rounded-2xl relative">
            <Link to={`/blog/${featuredPost.id}`}>
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            </Link>
          </div>

          {/* Nội dung Featured */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center py-4 lg:py-8 lg:pr-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wider rounded-lg">
                {featuredPost.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Clock size={14} /> {featuredPost.readTime}
              </div>
            </div>

            <Link to={`/blog/${featuredPost.id}`} className="block group/title">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 leading-tight mb-4 group-hover/title:text-indigo-600 transition-colors">
                {featuredPost.title}
              </h2>
            </Link>

            <p className="text-slate-600 text-base leading-relaxed mb-8 line-clamp-3">{featuredPost.excerpt}</p>

            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User size={16} />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-800">{featuredPost.author}</p>
                  <p className="text-xs text-slate-400">{featuredPost.date}</p>
                </div>
              </div>

              <Link
                to={`/blog/${featuredPost.id}`}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-400 flex items-center justify-center transition-all"
              >
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. DANH SÁCH BÀI VIẾT GẦN ĐÂY */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 font-heading">Bài viết mới nhất</h3>
            <Link to="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hidden sm:block">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 overflow-hidden group flex flex-col"
              >
                <Link to={`/blog/${post.id}`} className="block h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-800 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Tag size={12} className="text-indigo-500" /> {post.category}
                  </div>
                </Link>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {post.readTime}
                    </span>
                  </div>

                  <Link to={`/blog/${post.id}`} className="block mb-2 flex-1">
                    <h4 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </Link>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-5">{post.excerpt}</p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-800">{post.author}</span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      Đọc tiếp <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. NEWSLETTER CTA (Hộp đăng ký nhận tin) */}
        <div className="mt-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">Đừng bỏ lỡ những tin tức mới nhất</h3>
            <p className="text-indigo-100 text-sm sm:text-base mb-8">
              Đăng ký nhận bản tin hàng tuần để cập nhật các dự án chất lượng, mẹo làm việc hiệu quả và tin tức từ
              FreeWork.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 px-4 py-3 rounded-xl outline-none focus:bg-white/20 transition-colors"
              />
              <button className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 hover:shadow-lg transition-all active:scale-95">
                Đăng ký ngay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
