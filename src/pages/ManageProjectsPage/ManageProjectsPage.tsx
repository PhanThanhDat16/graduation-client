import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Clock,
  DollarSign,
  Users,
  ArrowLeft,
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react'

// --- MOCK DATA ---
const MY_PROJECTS = [
  {
    id: 'p1',
    title: 'Phát triển nền tảng E-commerce bằng MERN Stack',
    created_at: '2 giờ trước',
    budget_min: 15000000,
    budget_max: 25000000,
    status: 'open',
    stats: { proposals: 8, interviewing: 2, hired: 0 }
  },
  {
    id: 'p2',
    title: 'Thiết kế UI/UX App Đặt Lịch Spa (Dùng Figma)',
    created_at: '1 ngày trước',
    budget_min: 3000000,
    budget_max: 5000000,
    status: 'open',
    stats: { proposals: 15, interviewing: 4, hired: 0 }
  },
  {
    id: 'p3',
    title: 'Tuyển Dev React Native fix bug app giao hàng',
    created_at: '3 ngày trước',
    budget_min: 5000000,
    budget_max: 8000000,
    status: 'progress',
    stats: { proposals: 22, interviewing: 1, hired: 1 }
  },
  {
    id: 'p4',
    title: 'Viết 20 bài SEO mảng Bất Động Sản',
    created_at: '1 tuần trước',
    budget_min: 1000000,
    budget_max: 2000000,
    status: 'closed',
    stats: { proposals: 45, interviewing: 0, hired: 2 }
  }
]

const MOCK_PROPOSALS = [
  {
    id: 'prop1',
    freelancer: {
      id: 'f1',
      name: 'Nguyễn Tấn Sang',
      avatar: 'https://ui-avatars.com/api/?name=Tan+Sang&background=1B2A6B&color=fff',
      title: 'Senior Fullstack Developer',
      rating: 4.9,
      success_rate: 98
    },
    bid_amount: 20000000,
    estimated_time: '2 tháng',
    cover_letter:
      'Chào bạn, tôi đã đọc kỹ yêu cầu xây dựng E-commerce. Tôi có sẵn kinh nghiệm làm hệ thống tương tự tích hợp VNPay và Momo. Mã nguồn đảm bảo chuẩn Clean Code và dễ dàng mở rộng. Rất mong được trao đổi thêm để chốt scope công việc!',
    status: 'pending'
  },
  {
    id: 'prop2',
    freelancer: {
      id: 'f2',
      name: 'Lê Hoàng Sơn',
      avatar: 'https://ui-avatars.com/api/?name=Hoang+Son&background=F59E0B&color=fff',
      title: 'Backend Node.js Developer',
      rating: 4.7,
      success_rate: 90
    },
    bid_amount: 15000000,
    estimated_time: '3 tháng',
    cover_letter:
      'Tôi chuyên về Backend và có thể thiết kế Database tối ưu cho bạn. Phần Frontend tôi sẽ dùng template có sẵn để tiết kiệm chi phí. Nếu bạn đồng ý hướng này thì hãy phản hồi tôi nhé.',
    status: 'rejected'
  },
  {
    id: 'prop3',
    freelancer: {
      id: 'f3',
      name: 'Trần Thu Hà',
      avatar: 'https://ui-avatars.com/api/?name=Thu+Ha&background=16A34A&color=fff',
      title: 'Frontend React/Vue Expert',
      rating: 5.0,
      success_rate: 100
    },
    bid_amount: 18500000,
    estimated_time: '1.5 tháng',
    cover_letter:
      'Tôi chuyên cắt HTML/CSS và ghép API bằng ReactJS. Đã có source base chuẩn SEO, có thể đẩy nhanh tiến độ cho bạn hoàn thành trước Tết.',
    status: 'interviewing'
  }
]

export default function ManageProjectsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [activeProposalTab, setActiveProposalTab] = useState('all')

  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  // Logic đếm số lượng cho các tab
  const openCount = MY_PROJECTS.filter((p) => p.status === 'open').length
  const progressCount = MY_PROJECTS.filter((p) => p.status === 'progress').length
  const closedCount = MY_PROJECTS.filter((p) => p.status === 'closed').length

  const pendingCount = MOCK_PROPOSALS.filter((p) => p.status === 'pending').length
  const interviewingCount = MOCK_PROPOSALS.filter((p) => p.status === 'interviewing').length
  const rejectedCount = MOCK_PROPOSALS.filter((p) => p.status === 'rejected').length

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] font-body flex flex-col md:flex-row w-full">
      {/* ĐÃ XÓA MỌI CLASS MAX-W VÀ CHỈ ĐỂ W-FULL, GIẢM PADDING XUỐNG P-6 */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {!selectedProject ? (
          /* ── MÀN 1: DANH SÁCH DỰ ÁN ĐÃ ĐĂNG ── */
          <div className="animate-in fade-in duration-300 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-slate-900 mb-1">Dự án của tôi</h1>
                <p className="text-sm text-slate-500">Quản lý tiến độ và duyệt báo giá từ Freelancer.</p>
              </div>
              <Link
                to="/post-project"
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors shrink-0"
              >
                + Đăng dự án mới
              </Link>
            </div>

            {/* BỘ LỌC DỰ ÁN */}
            <div className="flex gap-2 mb-6 bg-slate-200/50 p-1 rounded-lg w-full sm:w-fit overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Tất cả ({MY_PROJECTS.length})
              </button>
              <button
                onClick={() => setActiveTab('open')}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'open' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Đang mở ({openCount})
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'progress' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Đang thực hiện ({progressCount})
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'closed' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Đã đóng ({closedCount})
              </button>
            </div>

            {/* DANH SÁCH DỰ ÁN ĐÃ FILTER */}
            <div className="space-y-4">
              {MY_PROJECTS.filter((project) => activeTab === 'all' || project.status === activeTab).map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
                    {/* Cột 1: Thông tin */}
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/projects/${project.id}`}
                          className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors"
                        >
                          {project.title}
                        </Link>
                        {project.status === 'open' && (
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200 whitespace-nowrap">
                            Đang tuyển
                          </span>
                        )}
                        {project.status === 'progress' && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-200 whitespace-nowrap">
                            Đang làm việc
                          </span>
                        )}
                        {project.status === 'closed' && (
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold border border-slate-200 whitespace-nowrap">
                            Đã đóng
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 font-medium mt-3">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <DollarSign className="w-4 h-4 text-emerald-600" /> {formatMoney(project.budget_min)} -{' '}
                          {formatMoney(project.budget_max)} ₫
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Cập nhật {project.created_at}
                        </span>
                      </div>
                    </div>

                    {/* Cột 2: Thống kê */}
                    <div className="w-full lg:w-auto shrink-0 flex justify-start lg:justify-center">
                      <div className="flex w-full sm:w-fit bg-white border border-slate-200 rounded-lg overflow-hidden divide-x divide-slate-200">
                        <div className="flex-1 sm:flex-none px-4 sm:px-5 py-2 text-center bg-indigo-50/30">
                          <div className="text-lg font-bold text-indigo-600">{project.stats.proposals}</div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wide font-semibold">
                            Báo giá
                          </div>
                        </div>
                        <div className="flex-1 sm:flex-none px-4 sm:px-5 py-2 text-center">
                          <div className="text-lg font-bold text-slate-700">{project.stats.interviewing}</div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wide font-semibold">
                            Phỏng vấn
                          </div>
                        </div>
                        <div className="flex-1 sm:flex-none px-4 sm:px-5 py-2 text-center">
                          <div className="text-lg font-bold text-slate-700">{project.stats.hired}</div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wide font-semibold">
                            Đã Thuê
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cột 3: Hành động */}
                    <div className="w-full lg:w-48 flex flex-col gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-6">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex justify-center items-center gap-2"
                      >
                        <Users className="w-4 h-4" /> Duyệt báo giá
                      </button>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors flex justify-center items-center gap-1">
                          <Edit className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-red-50 hover:text-danger hover:border-red-200 transition-colors flex justify-center items-center gap-1">
                          <Trash2 className="w-3.5 h-3.5" /> Đóng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Fallback khi filter không có kết quả */}
              {MY_PROJECTS.filter((p) => activeTab === 'all' || p.status === activeTab).length === 0 && (
                <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Không có dự án nào trong mục này.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── MÀN 2: CHI TIẾT BÁO GIÁ ── */
          <div className="animate-in slide-in-from-right-4 duration-300 w-full">
            <button
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
            </button>

            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Đang xem Báo giá cho dự án:
                </p>
                <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  {selectedProject.title}
                  <ExternalLink className="w-4 h-4 text-slate-400 cursor-pointer hover:text-indigo-600" />
                </h2>
              </div>
              <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shrink-0">
                <Users className="w-4 h-4" /> {selectedProject.stats.proposals} Báo giá
              </div>
            </div>

            {/* BỘ LỌC ỨNG VIÊN */}
            <div className="flex border-b border-slate-200 mb-6 overflow-x-auto hide-scrollbar w-full">
              <button
                onClick={() => setActiveProposalTab('all')}
                className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeProposalTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Tất cả ({MOCK_PROPOSALS.length})
              </button>
              <button
                onClick={() => setActiveProposalTab('pending')}
                className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeProposalTab === 'pending' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Chưa xử lý ({pendingCount})
              </button>
              <button
                onClick={() => setActiveProposalTab('interviewing')}
                className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeProposalTab === 'interviewing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Đang phỏng vấn ({interviewingCount})
              </button>
              <button
                onClick={() => setActiveProposalTab('rejected')}
                className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeProposalTab === 'rejected' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Lưu trữ / Từ chối ({rejectedCount})
              </button>
            </div>

            {/* DANH SÁCH BÁO GIÁ ĐÃ FILTER */}
            <div className="space-y-4 w-full">
              {MOCK_PROPOSALS.filter(
                (proposal) => activeProposalTab === 'all' || proposal.status === activeProposalTab
              ).map((proposal) => (
                <div
                  key={proposal.id}
                  className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-indigo-300 transition-all ${proposal.status === 'rejected' ? 'opacity-60 bg-slate-50' : ''}`}
                >
                  <div className="flex flex-col xl:flex-row gap-6">
                    <div className="w-full xl:w-72 shrink-0 flex items-start gap-4">
                      <img
                        src={proposal.freelancer.avatar}
                        alt="Avatar"
                        className="w-14 h-14 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <Link
                          to={`/freelancers/${proposal.freelancer.id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block text-lg"
                        >
                          {proposal.freelancer.name}
                        </Link>
                        <p className="text-xs font-medium text-slate-500 mb-2">{proposal.freelancer.title}</p>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {proposal.freelancer.rating}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {proposal.freelancer.success_rate}% Success
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 border-t xl:border-t-0 xl:border-l border-slate-100 pt-5 xl:pt-0 xl:pl-8">
                      <div className="flex flex-wrap gap-8 mb-4">
                        <div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">Mức giá Đề xuất</div>
                          <div className="text-lg font-extrabold text-emerald-600">
                            {formatMoney(proposal.bid_amount)} ₫
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">Thời gian dự kiến</div>
                          <div className="text-base font-bold text-slate-900">{proposal.estimated_time}</div>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-4 text-sm text-slate-700 leading-relaxed mb-5">
                        <span className="font-bold text-slate-900 mr-2">Thư chào hàng:</span>
                        {proposal.cover_letter}
                      </div>

                      {proposal.status !== 'rejected' ? (
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                          <button className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-lg hover:text-danger hover:bg-red-50 hover:border-red-200 transition-colors text-sm flex items-center justify-center gap-2">
                            <XCircle className="w-4 h-4" /> Từ chối
                          </button>
                          <button className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Nhắn tin
                          </button>
                          <button
                            onClick={() => navigate(`/contracts/agreement/${proposal.id}`)}
                            className="px-8 py-2.5 bg-amber-500 text-white font-bold rounded-lg shadow-sm hover:bg-amber-600 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            Tuyển dụng ngay
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 text-slate-600 text-sm font-bold rounded-lg">
                            <XCircle className="w-4 h-4" /> Đã từ chối ứng viên này
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Fallback khi tab không có ứng viên */}
              {MOCK_PROPOSALS.filter((p) => activeProposalTab === 'all' || p.status === activeProposalTab).length ===
                0 && (
                <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Không có ứng viên nào trong mục này.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
