import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ShieldCheck } from 'lucide-react'

import { contractService } from '@/apis/contractService'
import { useAuthStore } from '@/store/useAuthStore'

// Import các Component dùng chung
import ContractCard from './components/ContractCard'
import StatusTabs, { type TabItem } from '@/components/StatusTabs/StatusTabs' // Đường dẫn của bạn
import SortDropdown, { type SortOption } from '@/components/SortDropDown/SortDropdown' // Component mới của bạn

// Định nghĩa các tuỳ chọn sắp xếp
const SORT_OPTIONS: SortOption[] = [
  { label: 'Cập nhật mới nhất', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' },
  { label: 'Giá trị cao nhất', value: 'highestPrice' },
  { label: 'Giá trị thấp nhất', value: 'lowestPrice' }
]

export default function ContractListPage() {
  const { user } = useAuthStore()
  const userRole = user?.role || 'freelancer'

  // State quản lý Bộ lọc và Sắp xếp
  const [activeTab, setActiveTab] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<string>('newest')

  // FETCH DANH SÁCH HỢP ĐỒNG
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['my-contracts'],
    queryFn: () => contractService.getMyContracts()
  })
  const contracts = axiosResponse?.data?.data || []

  // LOGIC ĐẾM SỐ LƯỢNG CHO TỪNG TAB
  const counts = {
    all: contracts.length,
    pending: contracts.filter((c) => ['draft', 'pendingAgreement', 'waitingPayment'].includes(c.status)).length,
    running: contracts.filter((c) => ['running', 'submitted', 'dispute'].includes(c.status)).length,
    completed: contracts.filter((c) => ['completed', 'cancelled'].includes(c.status)).length
  }

  const TAB_CONFIG: TabItem[] = [
    { id: 'all', label: 'Tất cả', count: counts.all },
    { id: 'pending', label: 'Cần xử lý', count: counts.pending },
    { id: 'running', label: 'Đang thực hiện', count: counts.running },
    { id: 'completed', label: 'Đã đóng', count: counts.completed }
  ]

  // LOGIC LỌC DỮ LIỆU (Filter by Status)
  const filteredContracts = contracts.filter((contract) => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return ['draft', 'pendingAgreement', 'waitingPayment'].includes(contract.status)
    if (activeTab === 'running') return ['running', 'submitted', 'dispute'].includes(contract.status)
    if (activeTab === 'completed') return ['completed', 'cancelled'].includes(contract.status)
    return true
  })

  // LOGIC SẮP XẾP DỮ LIỆU (Sort by Order)
  const sortedAndFilteredContracts = [...filteredContracts].sort((a, b) => {
    switch (sortOrder) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'highestPrice':
        return b.totalAmount - a.totalAmount
      case 'lowestPrice':
        return a.totalAmount - b.totalAmount
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-200 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Escrow Protection
              </p>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mb-3">Quản lý Hợp đồng</h1>
              <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
                {userRole === 'contractor'
                  ? 'Theo dõi trạng thái các hợp đồng bạn đã tạo, thanh toán tiền cọc và nghiệm thu sản phẩm.'
                  : 'Kiểm tra các hợp đồng Khách hàng gửi cho bạn, ký xác nhận và theo dõi trạng thái thanh toán.'}
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-6 shrink-0">
              <div className="text-center">
                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Tổng Hợp Đồng</p>
                <p className="text-2xl font-black text-indigo-700">{counts.all}</p>
              </div>
              <div className="w-px bg-indigo-200"></div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Cần Hành Động</p>
                <p className="text-2xl font-black text-amber-600">{counts.pending}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <StatusTabs tabs={TAB_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="shrink-0 w-full sm:w-auto">
            <SortDropdown options={SORT_OPTIONS} value={sortOrder} onChange={setSortOrder} />
          </div>
        </div>

        {/* DANH SÁCH RENDER */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 h-[200px] animate-pulse">
                <div className="w-1/3 h-4 bg-slate-200 rounded mb-4"></div>
                <div className="w-2/3 h-6 bg-slate-200 rounded mb-8"></div>
                <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : sortedAndFilteredContracts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có hợp đồng nào</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {activeTab === 'all'
                ? 'Bạn chưa có bất kỳ hợp đồng nào trên hệ thống. Hãy bắt đầu một dự án mới nhé!'
                : 'Không có hợp đồng nào phù hợp với danh mục bạn vừa chọn.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lặp qua mảng đã được Sort và Filter */}
            {sortedAndFilteredContracts.map((contract) => (
              <ContractCard key={contract._id} contract={contract} userRole={userRole} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
