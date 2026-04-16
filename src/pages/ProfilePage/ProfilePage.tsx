import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  ShieldCheck,
  Edit,
  Plus,
  Camera,
  Eye
} from 'lucide-react'

// --- MOCK DATA ---
const FREELANCER_DATA = {
  id: 'f1', // ID của Freelancer này
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
    { name: 'Tiếng Nhật', level: 'Cơ bản (N5)' }
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
    }
  ],
  reviews: [
    {
      id: 'r1',
      client: 'Công ty TNHH TechNova',
      rating: 5,
      date: '10/03/2026',
      comment:
        'Sang làm việc rất chuyên nghiệp, code sạch và giao dự án đúng hạn. Giao tiếp tốt và hiểu rõ logic nghiệp vụ.',
      project_name: 'Xây dựng Dashboard Quản trị CRM'
    }
  ]
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('portfolio')
  const navigate = useNavigate()
  const user = FREELANCER_DATA

  // --- GIẢ LẬP AUTH STATE (Thực tế lấy từ useAuthStore và useParams) ---
  // Đổi `currentUserId` thành 'u2' (hoặc giá trị khác 'f1') để xem giao diện dưới góc nhìn của Khách Hàng
  const currentUserId = 'f1'
  const isOwner = currentUserId === user.id

  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-20">
      {/* Nút Test (Chỉ dành cho Dev - Có thể xóa khi lên production) */}
      <div className="bg-amber-100 text-center py-2 text-xs font-bold text-amber-800">
        Trạng thái hiện tại: {isOwner ? 'CHÍNH CHỦ (Có quyền sửa)' : 'KHÁCH XEM (Chỉ xem, có nút Thuê)'}
      </div>

      {/* ── COVER IMAGE & HEADER ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        {/* Ảnh Bìa */}
        <div className="h-48 md:h-64 w-full relative group">
          <img src={user.cover_image} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {isOwner && (
            <button className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 flex items-center gap-2 text-sm font-bold backdrop-blur-sm border border-white/20">
              <Camera className="w-4 h-4" /> Đổi ảnh bìa
            </button>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative flex flex-col md:flex-row gap-6 md:items-end pb-8">
            {/* Avatar */}
            <div className="-mt-16 md:-mt-20 relative z-10 shrink-0 mx-auto md:mx-0 group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-1.5 shadow-xl relative">
                <img
                  src={user.avatar}
                  alt={user.full_name}
                  className="w-full h-full rounded-full object-cover border border-slate-200"
                />
                {user.is_verified && (
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500 fill-emerald-50" />
                  </div>
                )}
                {isOwner && (
                  <button className="absolute inset-1.5 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Cập nhật</span>
                  </button>
                )}
              </div>
            </div>

            {/* Thông tin cơ bản */}
            <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-slate-900">{user.full_name}</h1>
                {isOwner && (
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <p className="text-lg font-bold text-indigo-600">{user.title}</p>
                {isOwner && (
                  <button className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {user.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Tham gia {user.joined_date}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" /> Có sẵn để nhận việc
                </span>
              </div>
            </div>

            {/* Nút Hành động */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 mt-6 md:mt-0 w-full md:w-auto">
              {!isOwner ? (
                <>
                  <button
                    onClick={() => navigate('/messages')}
                    className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" /> Nhắn tin
                  </button>
                  <button className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Thuê tôi
                  </button>
                </>
              ) : (
                <button className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" /> Xem với tư cách Khách
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* CỘT TRÁI (MAIN INFO - 65%) */}
          <div className="w-full lg:w-[65%] space-y-6">
            {/* Box: Giới thiệu */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative group">
              {isOwner && (
                <button className="absolute top-6 right-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <h2 className="font-bold text-lg text-slate-900 mb-4">Giới thiệu</h2>
              <div className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-line font-medium">
                {user.about}
              </div>
            </div>

            {/* Tabs: Portfolio & Reviews */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 relative">
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'portfolio' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Dự án đã làm ({user.portfolio.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Đánh giá ({user.reviews.length})
                </button>

                {isOwner && activeTab === 'portfolio' && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1 text-xs font-bold">
                      <Plus className="w-4 h-4" /> Thêm
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === 'portfolio' && (
                  <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                    {user.portfolio.map((item) => (
                      <div key={item.id} className="group cursor-pointer relative">
                        <div className="relative h-48 rounded-xl overflow-hidden mb-3 border border-slate-200">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{item.tag}</p>

                        {isOwner && (
                          <button className="absolute top-3 right-3 p-1.5 bg-white text-slate-600 rounded-md shadow-sm opacity-0 group-hover:opacity-100 hover:text-indigo-600 transition-all">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {user.reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                        <h3 className="font-bold text-indigo-700 hover:underline cursor-pointer mb-2">
                          {review.project_name}
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{review.rating}.0</span>
                          <span className="text-xs text-slate-400">{review.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 italic leading-relaxed mb-3">"{review.comment}"</p>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600">
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

          {/* CỘT PHẢI (SIDEBAR - 35%) */}
          <div className="w-full lg:w-[35%] space-y-6">
            {/* Stats Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
              {isOwner && (
                <button className="absolute top-6 right-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <h2 className="font-bold text-lg text-slate-900 mb-5">Thống kê</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-extrabold text-indigo-600 mb-1">{formatMoney(user.hourly_rate)}₫</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Giá theo giờ</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-indigo-600 mb-1">{user.success_rate}%</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thành công</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-indigo-600 mb-1">{user.total_jobs}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dự án hoàn thành</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-indigo-600 mb-1">{user.total_hours}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Giờ làm việc</div>
                </div>
              </div>
            </div>

            {/* Skills Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
              {isOwner && (
                <button className="absolute top-5 right-5 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <h2 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-slate-400" /> Kỹ năng
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Ngoại ngữ */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
              {isOwner && (
                <button className="absolute top-5 right-5 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <h2 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-400" /> Ngoại ngữ
              </h2>
              <div className="space-y-3">
                {user.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-bold text-slate-900">{lang.name}</span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Học vấn */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
              {isOwner && (
                <button className="absolute top-5 right-5 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <h2 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-slate-400" /> Học vấn
              </h2>
              <div className="space-y-4">
                {user.education.map((edu, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-indigo-200">
                    <div className="absolute w-2 h-2 bg-indigo-600 rounded-full -left-[5px] top-1.5"></div>
                    <div className="text-sm font-bold text-slate-900">{edu.school}</div>
                    <div className="text-xs font-bold text-indigo-600 mt-0.5">{edu.degree}</div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">{edu.year}</div>
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
