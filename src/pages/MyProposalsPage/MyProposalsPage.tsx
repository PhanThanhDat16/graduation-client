import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Briefcase,
  Eye,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Trash2,
  ExternalLink
} from 'lucide-react'

// --- MOCK DATA CAO CẤP ---
const MY_SUBMITTED_PROPOSALS = [
  {
    id: 'prop-1',
    project: {
      id: 'p1',
      title: 'Phát triển nền tảng E-commerce bằng MERN Stack',
      client_name: 'Công ty TNHH Giải Pháp Số',
      budget: '15.000.000 - 25.000.000 ₫',
      location: 'Đà Nẵng',
      isVerified: true
    },
    my_bid: 20000000,
    estimated_time: '2 tháng',
    submitted_at: '2 giờ trước',
    status: 'interviewing', // Đang phỏng vấn
    is_viewed_by_client: true,
    cover_letter: 'Chào bạn, tôi đã có kinh nghiệm 4 năm với MERN stack và đã từng làm 2 sàn E-commerce tương tự...'
  },
  {
    id: 'prop-2',
    project: {
      id: 'p2',
      title: 'Thiết kế UI/UX App Đặt Lịch Spa (Figma)',
      client_name: 'Hải Nguyễn Spa',
      budget: '3.000.000 - 5.000.000 ₫',
      location: 'Hồ Chí Minh',
      isVerified: false
    },
    my_bid: 4500000,
    estimated_time: '2 tuần',
    submitted_at: '3 ngày trước',
    status: 'pending', // Chờ duyệt
    is_viewed_by_client: false,
    cover_letter: 'Tôi có thể thiết kế theo phong cách Minimalist, tập trung vào trải nghiệm người dùng (UX)...'
  },
  {
    id: 'prop-3',
    project: {
      id: 'p3',
      title: 'Tối ưu hóa Database và API NodeJS',
      client_name: 'TechNova Global',
      budget: '5.000.000 - 8.000.000 ₫',
      location: 'Hà Nội',
      isVerified: true
    },
    my_bid: 6500000,
    estimated_time: '1 tháng',
    submitted_at: '1 tuần trước',
    status: 'hired', // Trúng thầu
    is_viewed_by_client: true,
    cover_letter: 'Tôi sẽ sử dụng Redis để caching và tối ưu lại các câu query MongoDB chậm của hệ thống...'
  },
  {
    id: 'prop-4',
    project: {
      id: 'p4',
      title: 'Maintain hệ thống React Native cũ',
      client_name: 'Startup FastDelivery',
      budget: 'Thỏa thuận',
      location: 'Đà Nẵng',
      isVerified: true
    },
    my_bid: 12000000,
    estimated_time: '3 tháng',
    submitted_at: '2 tuần trước',
    status: 'rejected', // Bị từ chối
    is_viewed_by_client: true,
    cover_letter: 'Tôi đã xem qua source code và nhận thấy cần nâng cấp phiên bản React Native lên mới nhất...'
  }
]

export default function MyProposalsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  const allCount = MY_SUBMITTED_PROPOSALS.length
  const activeCount = MY_SUBMITTED_PROPOSALS.filter((p) => p.status === 'interviewing' || p.status === 'hired').length
  const pendingCount = MY_SUBMITTED_PROPOSALS.filter((p) => p.status === 'pending').length
  const archivedCount = MY_SUBMITTED_PROPOSALS.filter((p) => p.status === 'rejected').length

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] font-body flex flex-col md:flex-row">
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="animate-in fade-in duration-300 mb-8">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mb-2">Việc đã ứng tuyển</h1>
          <p className="text-sm text-slate-500">
            Quản lý và theo dõi trạng thái các báo giá (Proposal) bạn đã gửi cho Khách hàng.
          </p>
        </div>

        {/* TABS ĐIỀU HƯỚNG */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-xl w-full sm:w-fit overflow-x-auto hide-scrollbar shadow-inner">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            Tất cả ({allCount})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'active' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            Đang hoạt động ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            Chờ duyệt ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'archived' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            Từ chối / Lưu trữ ({archivedCount})
          </button>
        </div>

        {/* DANH SÁCH PROPOSALS */}
        <div className="space-y-6">
          {MY_SUBMITTED_PROPOSALS.filter((p) => {
            if (activeTab === 'active') return p.status === 'interviewing' || p.status === 'hired'
            if (activeTab === 'pending') return p.status === 'pending'
            if (activeTab === 'archived') return p.status === 'rejected'
            return true
          }).map((proposal) => (
            <div
              key={proposal.id}
              className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group ${proposal.status === 'rejected' ? 'opacity-75' : ''}`}
            >
              {/* --- CARD HEADER: TRẠNG THÁI --- */}
              <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  {proposal.status === 'pending' && (
                    <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> Đang chờ Khách duyệt
                    </span>
                  )}
                  {proposal.status === 'interviewing' && (
                    <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-200">
                      <MessageSquare className="w-3.5 h-3.5" /> Khách đang phỏng vấn
                    </span>
                  )}
                  {proposal.status === 'hired' && (
                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã trúng thầu dự án
                    </span>
                  )}
                  {proposal.status === 'rejected' && (
                    <span className="flex items-center gap-1.5 bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                      <XCircle className="w-3.5 h-3.5" /> Hồ sơ không phù hợp
                    </span>
                  )}

                  {proposal.is_viewed_by_client && proposal.status === 'pending' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                      <Eye className="w-3.5 h-3.5" /> Khách đã xem
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-400">Nộp lúc: {proposal.submitted_at}</div>
              </div>

              {/* --- CARD BODY: THÔNG TIN DỰ ÁN --- */}
              <div className="p-6">
                <Link
                  to={`/projects/${proposal.project.id}`}
                  className="font-heading font-bold text-xl text-slate-900 hover:text-indigo-600 transition-colors inline-flex items-center gap-2 mb-3"
                >
                  {proposal.project.title}
                  <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 font-medium mb-6">
                  <span className="flex items-center gap-1.5 text-slate-900">
                    <Briefcase className="w-4 h-4 text-slate-400" /> {proposal.project.client_name}
                    {proposal.project.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-500 ml-0.5" aria-label="Đã xác thực" />
                    )}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" /> {proposal.project.location}
                  </span>
                </div>

                {/* Khung So sánh Ngân sách & Báo giá */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  <div className="flex-1 pb-4 sm:pb-0 sm:pr-6">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Ngân sách của khách
                    </p>
                    <p className="font-bold text-slate-700 text-lg">{proposal.project.budget}</p>
                  </div>
                  <div className="flex-1 pt-4 sm:pt-0 sm:pl-6">
                    <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                      Báo giá của bạn
                    </p>
                    <div className="flex items-end gap-3">
                      <p className="font-extrabold text-indigo-700 text-2xl leading-none">
                        {formatMoney(proposal.my_bid)} ₫
                      </p>
                      <p className="text-sm font-bold text-slate-500 mb-0.5">trong {proposal.estimated_time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- CARD FOOTER: NÚT HÀNH ĐỘNG --- */}
              <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row justify-end items-center gap-3">
                {proposal.status === 'hired' ? (
                  <Link
                    to="/contracts"
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" /> Xem Hợp đồng
                  </Link>
                ) : proposal.status === 'interviewing' ? (
                  <Link
                    to="/messages"
                    className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Tiếp tục thảo luận
                  </Link>
                ) : proposal.status === 'pending' ? (
                  <>
                    <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors flex justify-center items-center gap-2 shadow-sm">
                      Xem thư chào hàng
                    </button>
                    <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-red-200 text-danger text-sm font-bold rounded-xl hover:bg-red-50 transition-colors flex justify-center items-center gap-2 shadow-sm">
                      <Trash2 className="w-4 h-4" /> Rút hồ sơ
                    </button>
                  </>
                ) : (
                  <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
                    Xóa khỏi lịch sử
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Fallback Trống */}
          {MY_SUBMITTED_PROPOSALS.filter((p) => {
            if (activeTab === 'active') return p.status === 'interviewing' || p.status === 'hired'
            if (activeTab === 'pending') return p.status === 'pending'
            if (activeTab === 'archived') return p.status === 'rejected'
            return true
          }).length === 0 && (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-slate-900 mb-2">Chưa có dữ liệu</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Bạn không có báo giá nào trong trạng thái này. Hãy dạo quanh nền tảng để tìm kiếm những cơ hội mới nhé!
              </p>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Tìm việc ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
