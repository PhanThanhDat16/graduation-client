import { useState } from 'react'
import {
  MapPin,
  Star,
  Clock,
  Mail,
  CheckCircle2,
  Award,
  GraduationCap,
  Globe,
  ExternalLink,
  ThumbsUp,
  ShieldCheck
} from 'lucide-react'

// --- MOCK DATA ---
const FREELANCER_DATA = {
  id: 'f1',
  full_name: 'Nguyễn Tấn Sang',
  title: 'Senior Fullstack Developer (MERN / React Native)',
  avatar: 'https://ui-avatars.com/api/?name=Tan+Sang&background=1B2A6B&color=fff&size=256',
  cover_image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
  is_verified: true,
  location: 'Đà Nẵng, Việt Nam',
  joined_date: 'Tháng 9, 2023',
  hourly_rate: 250000,
  success_rate: 98,
  total_jobs: 42,
  total_hours: 1250,
  about: `Xin chào! Tôi là Sang, một Fullstack Developer với hơn 4 năm kinh nghiệm trong việc xây dựng các ứng dụng Web và Mobile hiệu suất cao.

Thế mạnh của tôi là hệ sinh thái JavaScript/TypeScript (ReactJS, NodeJS, Express, MongoDB, Prisma). Tôi yêu thích việc tối ưu hóa UI/UX và viết code sạch, dễ bảo trì theo chuẩn SOLID.

Những gì tôi có thể giúp bạn:
- Xây dựng Web App, SaaS, E-commerce, Landing Page.
- Phát triển Mobile App đa nền tảng với React Native.
- Tối ưu hóa hiệu suất website, SEO.
- Tích hợp cổng thanh toán (VNPay, Momo, Stripe).`,
  skills: ['ReactJS', 'NodeJS', 'TypeScript', 'MongoDB', 'Prisma', 'TailwindCSS', 'React Native', 'MySQL'],
  languages: [
    { name: 'Tiếng Việt', level: 'Bản ngữ' },
    { name: 'Tiếng Anh', level: 'Giao tiếp tốt' },
    { name: 'Tiếng Nhật', level: 'Cơ bản (N5)' } // Theo context bạn đang học tiếng Nhật ;)
  ],
  education: [{ school: 'Đại học Duy Tân', degree: 'Kỹ sư Phần mềm', year: '2022 - 2026' }],
  portfolio: [
    {
      id: 'pf1',
      title: 'Hệ thống Quản lý Bất động sản',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
      tag: 'Web App'
    },
    {
      id: 'pf2',
      title: 'Shopee Clone E-commerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&q=80',
      tag: 'Fullstack'
    },
    {
      id: 'pf3',
      title: 'App Đặt lịch Spa (React Native)',
      image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=500&q=80',
      tag: 'Mobile App'
    }
  ],
  reviews: [
    {
      id: 'r1',
      client: 'Công ty TNHH TechNova',
      rating: 5,
      date: '10/03/2026',
      comment:
        'Sang làm việc rất chuyên nghiệp, code sạch và giao dự án đúng hạn. Giao tiếp tốt và hiểu rõ logic nghiệp vụ. Chắc chắn sẽ hợp tác tiếp!',
      project_name: 'Xây dựng Dashboard Quản trị CRM'
    },
    {
      id: 'r2',
      client: 'Hải Nguyễn',
      rating: 5,
      date: '15/01/2026',
      comment: 'Bạn dev hỗ trợ rất nhiệt tình, fix bug nhanh gọn. App chạy mượt trên cả iOS và Android.',
      project_name: 'Fix bug và tối ưu React Native App'
    }
  ]
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('portfolio')
  const user = FREELANCER_DATA

  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  return (
    <div className="bg-page min-h-screen font-body pb-20">
      {/* ── COVER IMAGE & HEADER ── */}
      <div className="bg-white border-b border-border">
        {/* Ảnh Bìa */}
        <div className="h-48 md:h-64 w-full relative">
          <img src={user.cover_image} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative flex flex-col md:flex-row gap-6 md:items-end pb-8">
            {/* Avatar (Kéo lên đè vào ảnh bìa) */}
            <div className="-mt-16 md:-mt-20 relative z-10 shrink-0 mx-auto md:mx-0">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-1.5 shadow-lg relative">
                <img
                  src={user.avatar}
                  alt={user.full_name}
                  className="w-full h-full rounded-full object-cover border border-border"
                />
                {user.is_verified && (
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500 fill-emerald-50" />
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin cơ bản */}
            <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
              <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text-main mb-1">{user.full_name}</h1>
              <p className="text-lg font-bold text-primary mb-3">{user.title}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-medium text-text-sub">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {user.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Tham gia {user.joined_date}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-4 h-4" /> Có sẵn để nhận việc
                </span>
              </div>
            </div>

            {/* Nút Hành động */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 mt-6 md:mt-0 w-full md:w-auto">
              <button className="px-6 py-2.5 bg-white border border-border text-text-main font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Nhắn tin
              </button>
              <button className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Thuê tôi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ==========================================
              CỘT TRÁI (MAIN INFO - 65%)
          ========================================== */}
          <div className="w-full lg:w-[65%] space-y-6">
            {/* Box: Giới thiệu */}
            <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4">Giới thiệu</h2>
              <div className="text-text-sub text-[15px] leading-relaxed whitespace-pre-line">{user.about}</div>
            </div>

            {/* Tabs: Portfolio & Reviews */}
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'portfolio' ? 'border-primary text-primary bg-indigo-50/50' : 'border-transparent text-text-sub hover:text-text-main hover:bg-gray-50'}`}
                >
                  Dự án đã làm ({user.portfolio.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary bg-indigo-50/50' : 'border-transparent text-text-sub hover:text-text-main hover:bg-gray-50'}`}
                >
                  Đánh giá từ khách hàng ({user.reviews.length})
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === 'portfolio' && (
                  <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                    {user.portfolio.map((item) => (
                      <div key={item.id} className="group cursor-pointer">
                        <div className="relative h-48 rounded-xl overflow-hidden mb-3 border border-border">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-text-muted mt-1">{item.tag}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {user.reviews.map((review) => (
                      <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                        <h3 className="font-bold text-primary hover:underline cursor-pointer mb-2">
                          {review.project_name}
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-text-main">{review.rating}.0</span>
                          <span className="text-xs text-text-muted">{review.date}</span>
                        </div>
                        <p className="text-sm text-text-sub italic leading-relaxed mb-3">"{review.comment}"</p>
                        <div className="text-xs font-bold text-text-main flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                            {review.client.charAt(0)}
                          </div>
                          {review.client}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==========================================
              CỘT PHẢI (SIDEBAR - 35%)
          ========================================== */}
          <div className="w-full lg:w-[35%] space-y-6">
            {/* Stats Box */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-5">Thống kê</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-extrabold text-primary mb-1">{formatMoney(user.hourly_rate)}₫</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Giá theo giờ</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary mb-1">{user.success_rate}%</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Tỷ lệ thành công</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary mb-1">{user.total_jobs}</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Dự án hoàn thành</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary mb-1">{user.total_hours}</div>
                  <div className="text-xs font-bold text-text-muted uppercase">Giờ làm việc</div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-3">
                <ThumbsUp className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs font-medium text-primary/80 leading-relaxed">
                  Freelancer có lịch sử làm việc cực kỳ tốt, luôn phản hồi nhanh và được khách hàng đánh giá cao.
                </p>
              </div>
            </div>

            {/* Skills Box */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-text-sub" /> Kỹ năng
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-page border border-border rounded-lg text-xs font-bold text-text-sub hover:border-primary hover:text-primary cursor-pointer transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Ngoại ngữ */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-text-sub" /> Ngoại ngữ
              </h2>
              <div className="space-y-3">
                {user.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex justify-between items-center border-b border-page pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-bold text-text-main">{lang.name}</span>
                    <span className="text-xs font-medium text-text-sub bg-page px-2 py-1 rounded">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Học vấn */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-lg text-text-main mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-text-sub" /> Học vấn
              </h2>
              <div className="space-y-4">
                {user.education.map((edu, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-border">
                    <div className="absolute w-2 h-2 bg-border rounded-full -left-[5px] top-1.5"></div>
                    <div className="text-sm font-bold text-text-main">{edu.school}</div>
                    <div className="text-xs font-medium text-text-sub">{edu.degree}</div>
                    <div className="text-xs text-text-muted mt-1">{edu.year}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
