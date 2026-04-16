import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Calendar,
  UploadCloud,
  ShieldCheck,
  Star
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

// --- MOCK DATA: DANH SÁCH HỢP ĐỒNG ---
const MOCK_CONTRACTS = [
  {
    id: 'ct-1',
    project_title: 'Phát triển E-commerce MERN Stack',
    client: {
      name: 'Công ty TNHH Giải Pháp Số',
      avatar: 'https://ui-avatars.com/api/?name=Giai+Phap&background=0D9488&color=fff'
    },
    freelancer: {
      name: 'Nguyễn Tấn Sang',
      avatar: 'https://ui-avatars.com/api/?name=Tan+Sang&background=1B2A6B&color=fff'
    },
    amount: 20000000,
    status: 'active', // Đang thực hiện
    start_date: '10/04/2026',
    deadline: '10/06/2026',
    progress: 45
  },
  {
    id: 'ct-2',
    project_title: 'Thiết kế UI/UX App Đặt Lịch Spa',
    client: { name: 'Hải Nguyễn', avatar: 'https://ui-avatars.com/api/?name=Hai+Nguyen&background=F59E0B&color=fff' },
    freelancer: {
      name: 'Nguyễn Tấn Sang',
      avatar: 'https://ui-avatars.com/api/?name=Tan+Sang&background=1B2A6B&color=fff'
    },
    amount: 5000000,
    status: 'pending_escrow', // Chờ nạp tiền cọc
    start_date: '16/04/2026',
    deadline: '30/04/2026',
    progress: 0
  },
  {
    id: 'ct-3',
    project_title: 'Fix bug React Native App Giao Hàng',
    client: {
      name: 'FastLogistics VN',
      avatar: 'https://ui-avatars.com/api/?name=Fast+Logistics&background=4F46E5&color=fff'
    },
    freelancer: {
      name: 'Nguyễn Tấn Sang',
      avatar: 'https://ui-avatars.com/api/?name=Tan+Sang&background=1B2A6B&color=fff'
    },
    amount: 8000000,
    status: 'completed', // Đã xong
    start_date: '01/03/2026',
    deadline: '15/03/2026',
    progress: 100
  }
]

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const { user } = useAuthStore()

  const userRole = user?.role || 'freelancer'

  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] flex flex-col md:flex-row font-body">
      <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="animate-in fade-in duration-300 mb-8">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mb-2">Quản lý Hợp đồng</h1>
          <p className="text-sm text-slate-500">
            {userRole === 'contractor'
              ? 'Theo dõi tiến độ, nghiệm thu và thanh toán cho các Freelancer của bạn.'
              : 'Theo dõi các dự án đang thực hiện, nộp báo cáo và nhận thanh toán.'}
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-xl w-full sm:w-fit overflow-x-auto hide-scrollbar shadow-inner">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'active' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            Đang thực hiện
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'completed' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            Đã hoàn thành
          </button>
        </div>

        {/* DANH SÁCH HỢP ĐỒNG */}
        <div className="space-y-6">
          {MOCK_CONTRACTS.filter(
            (c) =>
              activeTab === 'all' ||
              (activeTab === 'active' && (c.status === 'active' || c.status === 'pending_escrow')) ||
              (activeTab === 'completed' && c.status === 'completed')
          ).map((contract) => {
            // Logic đổi người hiển thị dựa vào role
            const displayUser = userRole === 'contractor' ? contract.freelancer : contract.client
            const displayRoleLabel = userRole === 'contractor' ? 'Freelancer' : 'Khách hàng'

            return (
              <div
                key={contract.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Header Card Hợp đồng */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Mã: {contract.id.toUpperCase()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    {contract.status === 'active' && (
                      <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-200">
                        <Clock className="w-3.5 h-3.5" /> Đang thực hiện
                      </span>
                    )}
                    {contract.status === 'pending_escrow' && (
                      <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Chờ cọc tiền (Escrow)
                      </span>
                    )}
                    {contract.status === 'completed' && (
                      <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã nghiệm thu & Trả tiền
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/contracts/workspace/${contract.id}`}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                  >
                    Vào phòng làm việc &rarr;
                  </Link>
                </div>

                {/* Body Card */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cột trái: Thông tin Dự án & Đối tác */}
                    <div className="flex-1">
                      <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-4">
                        {contract.project_title}
                      </h3>

                      <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl w-fit mb-6">
                        <img
                          src={displayUser.avatar}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full border border-slate-200"
                        />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {displayRoleLabel}
                          </p>
                          <p className="font-bold text-slate-800">{displayUser.name}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-slate-600">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          Khởi tạo: <strong className="text-slate-800">{contract.start_date}</strong>
                        </span>
                        <span className="flex items-center gap-2 text-danger">
                          <Clock className="w-4 h-4" />
                          Deadline: <strong>{contract.deadline}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Cột giữa: Tiền bạc & Tiến độ */}
                    <div className="w-full lg:w-72 shrink-0 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        Tổng giá trị <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </p>
                      <p className="font-extrabold text-2xl text-emerald-600 mb-6">{formatMoney(contract.amount)} ₫</p>

                      {contract.status !== 'pending_escrow' && (
                        <div>
                          <div className="flex justify-between items-center text-xs font-bold mb-2">
                            <span className="text-slate-500">Tiến độ công việc</span>
                            <span className="text-indigo-600">{contract.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${contract.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cột phải: Actions (Thay đổi theo Role) */}
                    <div className="w-full lg:w-48 shrink-0 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                      {/* === NÚT CỦA CONTRACTOR === */}
                      {userRole === 'contractor' && (
                        <>
                          {contract.status === 'pending_escrow' && (
                            <Link
                              to="/wallet"
                              className="w-full px-3 py-3 bg-amber-500 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                            >
                              <DollarSign className="w-4 h-4 shrink-0" /> Nạp tiền Escrow
                            </Link>
                          )}
                          {contract.status === 'active' && (
                            <>
                              <button className="w-full px-4 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Nghiệm thu
                              </button>
                              <button className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                Yêu cầu sửa đổi
                              </button>
                            </>
                          )}
                          {contract.status === 'completed' && (
                            <button className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                              <Star className="w-4 h-4 text-amber-500" /> Đánh giá
                            </button>
                          )}
                        </>
                      )}

                      {/* === NÚT CỦA FREELANCER === */}
                      {userRole === 'freelancer' && (
                        <>
                          {contract.status === 'pending_escrow' && (
                            <button
                              disabled
                              className="w-full px-4 py-3 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <Clock className="w-4 h-4" /> Đợi khách nạp cọc
                            </button>
                          )}
                          {contract.status === 'active' && (
                            <>
                              <button className="w-full px-4 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                <UploadCloud className="w-4 h-4" /> Nộp sản phẩm
                              </button>
                              <button className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                Báo cáo tiến độ
                              </button>
                            </>
                          )}
                          {contract.status === 'completed' && (
                            <Link
                              to="/wallet"
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors flex items-center justify-center gap-2"
                            >
                              <DollarSign className="w-4 h-4" /> Kiểm tra ví
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Fallback khi trống */}
          {MOCK_CONTRACTS.filter(
            (c) =>
              activeTab === 'all' ||
              (activeTab === 'active' && (c.status === 'active' || c.status === 'pending_escrow')) ||
              (activeTab === 'completed' && c.status === 'completed')
          ).length === 0 && (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-slate-900 mb-2">Chưa có hợp đồng nào</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Bạn chưa có hợp đồng nào trong danh mục này.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
