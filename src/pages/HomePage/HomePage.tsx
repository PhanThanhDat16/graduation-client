import React from 'react'
import { Link } from 'react-router-dom'
import type { UserResponse } from '@/types/user' // Đổi đường dẫn cho khớp với project của bạn

// --- ĐỊNH NGHĨA TYPE CHO UI DỰA TRÊN USER RESPONSE ---
interface FreelancerCard extends UserResponse {
  ratingAvg: number
  ratingCount: number
  skills: string[]
  jobTitle: string
}

interface ProjectCard {
  _id: string
  title: string
  budgetMin: number
  budgetMax: number
  type: string
  skills: string[]
  createdAt: string
}

interface CategoryCard {
  _id: string
  name: string
  count: number
  icon: string
}

export default function HomePage() {
  // --- MOCK DATA CHUẨN TYPESCRIPT ---

  const categories: CategoryCard[] = [
    { _id: 'c1', name: 'Lập trình Web', count: 1250, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    {
      _id: 'c2',
      name: 'Mobile App',
      count: 840,
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
    },
    {
      _id: 'c3',
      name: 'Thiết kế UI/UX',
      count: 920,
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      _id: 'c4',
      name: 'Marketing & SEO',
      count: 650,
      icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
    }
  ]

  const recentProjects: ProjectCard[] = [
    {
      _id: 'p1',
      title: 'Ứng dụng Thương mại điện tử clone Shopee',
      budgetMin: 15000000,
      budgetMax: 20000000,
      type: 'Dự án cố định',
      skills: ['ReactJS', 'NodeJS', 'Tailwind'],
      createdAt: '2 giờ trước'
    },
    {
      _id: 'p2',
      title: 'Thiết kế Landing Page Bất Động Sản',
      budgetMin: 3000000,
      budgetMax: 5000000,
      type: 'Dự án cố định',
      skills: ['Figma', 'UI/UX'],
      createdAt: '4 giờ trước'
    },
    {
      _id: 'p3',
      title: 'Bảo trì hệ thống Server & Database',
      budgetMin: 200000,
      budgetMax: 300000,
      type: 'Theo giờ',
      skills: ['Linux', 'Prisma', 'AWS'],
      createdAt: '5 giờ trước'
    }
  ]

  const topFreelancers: FreelancerCard[] = [
    {
      _id: 'u1',
      email: 'nhintppd07772@fpt.edu.vn',
      fullName: 'Nguyễn Tấn Sang',
      role: 'freelancer', // Khớp chuẩn type 'admin' | 'staff' | 'freelancer' | 'contructor'
      address: 'Đà Nẵng',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      status: 'active',
      // Các trường mở rộng cho UI
      ratingAvg: 5.0,
      ratingCount: 42,
      skills: ['ReactJS', 'NodeJS', 'Prisma'],
      jobTitle: 'Fullstack Developer'
    },
    {
      _id: 'u2',
      email: 'mai.tran@example.com',
      fullName: 'Trần Thị Mai',
      role: 'freelancer',
      address: 'Hồ Chí Minh',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      status: 'active',
      ratingAvg: 4.9,
      ratingCount: 86,
      skills: ['Figma', 'Wireframing'],
      jobTitle: 'Senior UI/UX Designer'
    },
    {
      _id: 'u3',
      email: 'hai.le@example.com',
      fullName: 'Lê Hoàng Hải',
      role: 'freelancer',
      address: 'Hà Nội',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
      status: 'active',
      ratingAvg: 4.8,
      ratingCount: 24,
      skills: ['Flutter', 'React Native'],
      jobTitle: 'Mobile App Expert'
    },
    {
      _id: 'u4',
      email: 'dung.pham@example.com',
      fullName: 'Phạm Văn Dũng',
      role: 'freelancer',
      address: 'Đà Nẵng',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      status: 'active',
      ratingAvg: 5.0,
      ratingCount: 105,
      skills: ['SEO', 'Google Ads'],
      jobTitle: 'SEO Specialist'
    }
  ]

  // Hàm format tiền tệ VNĐ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="font-body bg-gray-50 min-h-screen">
      {/* ================= HERO SECTION ================= */}
      {/* (Phần Hero giữ nguyên giao diện như cũ, không ảnh hưởng bởi mock data) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-[#2A3B8C] to-[#4B3B8C] pt-20 pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="col-span-12 lg:col-span-7 text-center lg:text-left">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-6">
                Kết nối Tài năng,
                <br /> <span className="text-amber-500">Kiến tạo Thành công</span>
              </h1>
              <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto lg:mx-0">
                Nền tảng freelance hàng đầu Việt Nam — Nơi contractor và freelancer gặp gỡ an toàn qua hệ thống ví
                Escrow bảo đảm.
              </p>

              <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl max-w-3xl mx-auto lg:mx-0 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                  <div className="md:col-span-5 flex items-center px-4 py-2">
                    <svg
                      className="w-6 h-6 text-gray-400 mr-2 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm dự án hoặc freelancer..."
                      className="w-full focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                  </div>
                  <div className="hidden md:block md:col-span-1 mx-auto h-8 w-px bg-gray-200"></div>
                  <div className="md:col-span-3 px-4 py-2 border-t md:border-t-0 border-gray-100">
                    <select className="w-full bg-transparent text-gray-600 focus:outline-none cursor-pointer truncate font-medium">
                      <option>Tất cả danh mục</option>
                      <option>Thiết kế UI/UX</option>
                      <option>Lập trình Web</option>
                      <option>Mobile App</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 md:py-2.5 rounded-xl md:rounded-full transition duration-300 shadow-lg shadow-amber-500/30">
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-12">
                <span className="text-sm text-indigo-200 font-medium">Gợi ý nhanh:</span>
                {['ReactJS', 'Thiết kế UI/UX', 'Mobile App', 'SEO', 'Viết nội dung'].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-1.5 rounded-full border border-indigo-400/40 text-indigo-100 text-sm hover:bg-indigo-800/60 hover:text-white transition cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-indigo-800/50">
                <div className="text-center md:text-left">
                  <div className="font-heading text-3xl font-bold text-white mb-1">12,500+</div>
                  <div className="text-indigo-200 text-sm font-medium">Dự án được tạo</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-heading text-3xl font-bold text-white mb-1">8,200+</div>
                  <div className="text-indigo-200 text-sm font-medium">Freelancer sẵn sàng</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-heading text-3xl font-bold text-amber-500 mb-1">98%</div>
                  <div className="text-indigo-200 text-sm font-medium">Hoàn thành đúng hạn</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block col-span-5 relative">
              <div className="absolute inset-0 bg-amber-500 blur-[100px] opacity-20 rounded-full"></div>
              <div className="relative bg-white rounded-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] shadow-indigo-950/50 border border-gray-100/50 overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gray-50 h-8 flex items-center px-4 space-x-2 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-5 bg-gray-50 h-[380px] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="w-32 h-6 bg-gray-200 rounded-md"></div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                      <div className="w-16 h-4 bg-gray-100 rounded"></div>
                      <div className="w-24 h-6 bg-indigo-950/20 rounded"></div>
                    </div>
                    <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                      <div className="w-16 h-4 bg-gray-100 rounded"></div>
                      <div className="w-24 h-6 bg-amber-500/20 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="w-full h-4 bg-gray-100 rounded mb-3"></div>
                    <div className="w-3/4 h-4 bg-gray-100 rounded mb-3"></div>
                    <div className="w-5/6 h-4 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DANH MỤC PHỔ BIẾN ================= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">Khám phá theo danh mục</h2>
              <p className="text-gray-500">Tìm kiếm các kỹ năng phù hợp nhất cho dự án của bạn.</p>
            </div>
            <Link
              to="/categories"
              className="hidden md:flex items-center font-semibold text-amber-500 hover:text-amber-600 transition"
            >
              Xem tất cả{' '}
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="group cursor-pointer bg-gray-50 hover:bg-white rounded-2xl p-6 border border-transparent hover:border-amber-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-indigo-50 text-indigo-950 group-hover:bg-amber-500 group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{new Intl.NumberFormat('vi-VN').format(cat.count)} dự án</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= QUY TRÌNH & VÍ ESCROW CỐT LÕI ================= */}
      {/* (Giữ nguyên không thay đổi logic data) */}
      <section className="py-20 bg-indigo-50 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-500 font-bold tracking-wider text-sm uppercase">Quy trình an toàn</span>
            <h2 className="font-heading text-3xl font-bold text-indigo-950 mt-2 mb-4">Cách FreelanceVN bảo vệ bạn</h2>
            <p className="text-gray-600">
              Với hệ thống ví Escrow độc quyền, tiền của Contractor được giữ an toàn và Freelancer được đảm bảo thanh
              toán 100% khi hoàn thành đúng tiến độ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center relative">
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-indigo-200 border-t-2 border-dashed border-indigo-300"></div>
              <div className="w-20 h-20 mx-auto bg-white border-4 border-indigo-950 text-indigo-950 rounded-full flex items-center justify-center font-heading text-2xl font-bold mb-6 relative z-10">
                1
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Thỏa thuận Hợp đồng</h3>
              <p className="text-gray-600 text-sm">
                Hai bên chốt yêu cầu, chi phí và thời hạn. Hợp đồng điện tử được lưu vết trên hệ thống.
              </p>
            </div>
            <div className="text-center relative">
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-indigo-200 border-t-2 border-dashed border-indigo-300"></div>
              <div className="w-20 h-20 mx-auto bg-amber-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6 relative z-10">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Nạp tiền vào Escrow</h3>
              <p className="text-gray-600 text-sm">
                Contractor thanh toán qua VNPay. Hệ thống Admin khóa số tiền này lại (Locked) trong suốt dự án.
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto bg-white border-4 border-indigo-950 text-indigo-950 rounded-full flex items-center justify-center font-heading text-2xl font-bold mb-6 relative z-10">
                3
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Nghiệm thu & Giải ngân</h3>
              <p className="text-gray-600 text-sm">
                Dự án hoàn thành, Contractor xác nhận, tiền tự động được Release về ví của Freelancer để rút.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DỰ ÁN NỔI BẬT ================= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900">Dự án mới nhất</h2>
            <Link to="/projects" className="font-semibold text-indigo-950 hover:text-amber-500 transition">
              Xem tất cả dự án &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:border-indigo-200 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {project.type}
                    </span>
                    <span className="text-gray-400 text-xs">{project.createdAt}</span>
                  </div>
                  <h3 className="font-bold text-xl text-indigo-950 hover:text-amber-500 cursor-pointer transition-colors mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <div className="text-amber-600 font-bold text-lg mb-4">
                    {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1.5 rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-2.5 bg-indigo-50 text-indigo-950 font-bold rounded-xl hover:bg-indigo-950 hover:text-white transition-colors duration-300">
                    Ứng tuyển ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FREELANCER TIÊU BIỂU ================= */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Các Chuyên gia hàng đầu</h2>
            <p className="text-gray-600">
              Hợp tác cùng những freelancer có đánh giá tốt nhất, được kiểm chứng năng lực qua hàng trăm dự án.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topFreelancers.map((free) => (
              <div
                key={free._id}
                className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={free.avatarUrl}
                    alt={free.fullName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-indigo-50 mx-auto"
                  />
                  <div className="absolute bottom-1 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <h3 className="font-bold text-lg text-gray-900">{free.fullName}</h3>
                <p className="text-amber-600 text-sm font-medium mb-3">{free.jobTitle}</p>

                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {free.address}
                </div>

                <div className="flex items-center justify-center gap-4 mb-auto border-t border-b border-gray-50 py-3">
                  <div className="text-center">
                    <div className="flex items-center text-amber-500 font-bold justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {free.ratingAvg.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">Đánh giá</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{free.ratingCount}</div>
                    <div className="text-xs text-gray-400">Dự án</div>
                  </div>
                </div>

                <button className="w-full mt-5 py-2 border border-indigo-950 text-indigo-950 font-bold rounded-xl hover:bg-indigo-950 hover:text-white transition-colors">
                  Xem hồ sơ
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-white border border-gray-200 font-bold text-gray-700 rounded-full hover:border-amber-500 hover:text-amber-600 transition">
              Tải thêm Freelancer
            </button>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-950"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 opacity-30 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn sàng để bắt đầu dự án tiếp theo?
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
            Tham gia cùng hàng ngàn cá nhân và doanh nghiệp đang thay đổi cách họ làm việc với FreelanceVN.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-1"
            >
              Tôi muốn Thuê người
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-full hover:bg-white hover:text-indigo-950 transition transform hover:-translate-y-1 backdrop-blur-sm"
            >
              Tôi muốn Tìm việc
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
