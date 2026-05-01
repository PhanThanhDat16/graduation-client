import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity,
  Search
} from 'lucide-react'

export default function DashboardPage() {
  // Tạm dùng State này để bạn dễ dàng test chuyển đổi qua lại giữa 2 góc nhìn
  // Trong thực tế, biến này sẽ lấy từ Zustand (useAuthStore)
  const [role, setRole] = useState<'contractor' | 'freelancer'>('contractor')

  // --- MOCK DATA DÀNH CHO CONTRACTOR (KHÁCH HÀNG) ---
  const contractorStats = [
    { title: 'Dự án đang mở', value: '2', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Hợp đồng đang chạy', value: '3', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Tiền trong Escrow', value: '35M ₫', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Đã chi tiêu', value: '120M ₫', icon: DollarSign, color: 'text-slate-600', bg: 'bg-slate-100' }
  ]

  // --- MOCK DATA DÀNH CHO FREELANCER (ỨNG VIÊN) ---
  const freelancerStats = [
    { title: 'Đang ứng tuyển', value: '5', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Hợp đồng đang làm', value: '2', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    {
      title: 'Chờ giải ngân (Escrow)',
      value: '18M ₫',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { title: 'Tổng thu nhập', value: '85M ₫', icon: TrendingUp, color: 'text-slate-600', bg: 'bg-slate-100' }
  ]

  const stats = role === 'contractor' ? contractorStats : freelancerStats

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Nút Test Chuyển đổi Góc nhìn (Chỉ dành cho Dev) */}
      <div className="bg-amber-100 border border-amber-200 rounded-lg p-3 mb-6 flex justify-between items-center">
        <p className="text-xs font-bold text-amber-800 uppercase">Dev Tool: Test góc nhìn hiển thị</p>
        <div className="flex bg-white rounded-md p-1 border border-amber-200 shadow-sm">
          <button
            onClick={() => setRole('contractor')}
            className={`px-3 py-1 text-xs font-bold rounded ${role === 'contractor' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Khách hàng (Contractor)
          </button>
          <button
            onClick={() => setRole('freelancer')}
            className={`px-3 py-1 text-xs font-bold rounded ${role === 'freelancer' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Ứng viên (Freelancer)
          </button>
        </div>
      </div>

      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 mb-1">
            Chào buổi sáng, Nguyễn Tấn Sang! 👋
          </h1>
          <p className="text-sm text-slate-500">
            {role === 'contractor'
              ? 'Cùng xem tiến độ các dự án bạn đang thuê nhé.'
              : 'Dưới đây là tổng quan công việc và thu nhập của bạn.'}
          </p>
        </div>

        {/* Nút Call To Action tùy theo Role */}
        {role === 'contractor' ? (
          <Link
            to="/post-project"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> Đăng dự án mới
          </Link>
        ) : (
          <Link
            to="/projects"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Tìm việc làm
          </Link>
        )}
      </div>

      {/* KHỐI THỐNG KÊ (4 Ô) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-2xl text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-bold text-slate-500">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* KHU VỰC CHIA 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: DANH SÁCH HOẠT ĐỘNG (Chiếm 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-900">
                {role === 'contractor' ? 'Dự án đang cần chú ý' : 'Hợp đồng đang thực hiện'}
              </h2>
              <Link
                to={role === 'contractor' ? '/manage-projects' : '/contracts'}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Dòng 1 */}
              <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    {role === 'contractor' ? <Users className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 hover:text-indigo-600 cursor-pointer transition-colors">
                      Phát triển nền tảng E-commerce MERN Stack
                    </h4>
                    <p className="text-sm text-slate-500">
                      {role === 'contractor' ? 'Có 8 ứng viên mới nộp báo giá.' : 'Deadline: 15/06/2026 - Tiến độ: 35%'}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors shrink-0">
                  {role === 'contractor' ? 'Duyệt báo giá' : 'Nộp báo cáo'}
                </button>
              </div>

              {/* Dòng 2 */}
              <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 hover:text-indigo-600 cursor-pointer transition-colors">
                      {role === 'contractor' ? 'Thiết kế UI/UX App Đặt Lịch' : 'Viết 20 bài SEO mảng Bất Động Sản'}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {role === 'contractor'
                        ? 'Ứng viên đã nộp file. Đang chờ bạn nghiệm thu.'
                        : 'Đã nghiệm thu. Tiền đã về ví.'}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors shrink-0">
                  {role === 'contractor' ? 'Nghiệm thu' : 'Xem thanh toán'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: WIDGETS BỔ TRỢ (Chiếm 1/3) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Box Việc làm đề xuất (Chỉ Freelancer mới thấy) */}
          {role === 'freelancer' && (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-2xl p-6 text-white shadow-md">
              <h3 className="font-bold text-lg mb-2">Gợi ý việc làm cho bạn</h3>
              <p className="text-indigo-200 text-sm mb-6">Dựa trên kỹ năng ReactJS và NodeJS của bạn.</p>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4 hover:bg-white/20 transition-colors cursor-pointer">
                <h4 className="font-bold text-white mb-1 truncate">Tuyển Fullstack Dev maintain app React Native</h4>
                <p className="text-indigo-200 text-xs flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> 10.000.000 - 15.000.000 ₫
                </p>
              </div>

              <button className="w-full py-2 bg-white text-indigo-700 text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-colors">
                Xem thêm 12 việc làm
              </button>
            </div>
          )}

          {/* Box Nạp/Rút Tiền Nhanh */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Thao tác tài chính
            </h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Số dư khả dụng</p>
                <p className="font-extrabold text-slate-900 text-xl">2.500.000 ₫</p>
              </div>
            </div>
            <Link
              to="/wallet"
              className="block w-full text-center py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors text-sm"
            >
              Đi tới Ví Escrow
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
