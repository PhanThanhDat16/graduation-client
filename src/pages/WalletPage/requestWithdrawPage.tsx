import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  Landmark,
  X,
  BadgeCheck,
  ShieldAlert,
  User,
  Mail,
  CreditCard,
  Hash
} from 'lucide-react'
import { useWalletStore } from '@/store/useWalletStore'
import type { WithdrawRequest, WithdrawStatus, PopulatedAccount } from '@/types/wallet'

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount)

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium bg-amber-50 text-amber-600 border border-amber-200/60 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        Chờ duyệt
      </span>
    )
  if (status === 'approved' || status === 'paid')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Hoàn tất
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium bg-rose-50 text-rose-600 border border-rose-200/60 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      Từ chối
    </span>
  )
}

// ─── Info Row (used in modal) ─────────────────────────────────────────────────
function InfoRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      <div className={`text-base font-medium text-slate-900 ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RequestWithdrawPage() {
  const { adminWithdrawRequests: requests, adminLoading: loading, fetchAllWithdrawRequests } = useWalletStore()

  const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<WithdrawStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchRequests = useCallback(() => {
    fetchAllWithdrawRequests()
  }, [fetchAllWithdrawRequests])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const filteredRequests = useMemo(
    () =>
      requests.filter((req) => {
        const account = req.account_id as PopulatedAccount
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          req._id.toLowerCase().includes(q) ||
          account?.userId?.name?.toLowerCase().includes(q) ||
          account?.userId?.email?.toLowerCase().includes(q) ||
          account?.accountNumber?.includes(q)
        return matchesStatus && matchesSearch
      }),
    [requests, filterStatus, searchQuery]
  )

  const totalPending = requests.filter((r) => r.status === 'pending').reduce((s, r) => s + r.amount, 0)
  const countPending = requests.filter((r) => r.status === 'pending').length
  const todaySuccess = requests.filter(
    (r) =>
      (r.status === 'approved' || r.status === 'paid') &&
      new Date(r.createdAt).toDateString() === new Date().toDateString()
  ).length

  const STATUS_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ duyệt' },
    { key: 'approved', label: 'Đã duyệt' },
    { key: 'rejected', label: 'Từ chối' }
  ] as const

  return (
    <div className="flex-1 overflow-auto bg-[#F8FAFC] text-slate-900">
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Rút tiền</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
            Hệ thống xử lý và phê duyệt các yêu cầu thanh toán tài chính tập trung.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Chờ duyệt */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 flex items-center justify-between transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-500">Chờ duyệt</p>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{countPending}</h3>
              <p className="text-[13px] font-medium text-amber-500">Yêu cầu cần xử lý</p>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
              <Clock size={28} strokeWidth={2} />
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 flex items-center justify-between transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-500">Tổng tiền chờ xử lý</p>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-baseline gap-1">
                {formatCurrency(totalPending)}
                <span className="text-lg font-bold text-slate-400">đ</span>
              </h3>
              <p className="text-[13px] font-medium text-indigo-500">Ước tính</p>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Landmark size={28} strokeWidth={2} />
            </div>
          </div>

          {/* Thành công */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 flex items-center justify-between transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-500">Thành công hôm nay</p>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{todaySuccess}</h3>
              <p className="text-[13px] font-medium text-emerald-500">Đã giải ngân</p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle2 size={28} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          {/* Filter Bar */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {/* Status pills */}
            <div className="flex gap-2 flex-wrap bg-slate-100/50 p-1 rounded-xl border border-slate-100">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key as any)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === tab.key
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tên, email, số tài khoản..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-400"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
                <Filter size={16} className="text-slate-500" />
                <span className="hidden md:inline">Bộ lọc</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Mã GD
                  </th>
                  <th className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Họ tên
                  </th>
                  <th className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Ngân hàng
                  </th>
                  <th className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Số tài khoản
                  </th>
                  <th className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap text-center">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        <span className="text-sm font-medium">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                          <Search size={24} className="text-slate-300" />
                        </div>
                        <span className="text-sm font-medium">Không tìm thấy yêu cầu nào</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const account = req.account_id as PopulatedAccount
                    return (
                      <tr
                        key={req._id}
                        onClick={() => setSelectedRequest(req)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        {/* Mã GD */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-[13px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                            #WD-{req._id.slice(-6).toUpperCase()}
                          </span>
                        </td>

                        {/* Họ tên */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                              <User size={14} className="text-indigo-500" />
                            </div>
                            <span className="font-medium text-slate-800 whitespace-nowrap">
                              {account?.userId?.name || account?.accountName || '—'}
                            </span>
                          </div>
                        </td>

                        {/* Ngân hàng */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-sm">
                              {account?.logo ? (
                                <img
                                  src={account.logo}
                                  alt={account.bankShortName}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Landmark size={14} className="text-slate-400" />
                              )}
                            </div>
                            <span className="font-medium text-slate-700 whitespace-nowrap text-[13px]">
                              {account?.bankShortName || '—'}
                            </span>
                          </div>
                        </td>

                        {/* Số tài khoản */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-[13px] font-medium text-slate-600">
                            {account?.accountNumber || '—'}
                          </span>
                        </td>

                        {/* Số tiền */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 whitespace-nowrap">
                            {formatCurrency(req.amount)} ₫
                          </span>
                        </td>

                        {/* Trạng thái */}
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={req.status} />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              Hiển thị <span className="font-bold text-slate-700">{filteredRequests.length}</span> trên tổng số{' '}
              {requests.length} yêu cầu
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Detail Modal
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedRequest &&
          (() => {
            const account = selectedRequest.account_id as PopulatedAccount
            const isHighRisk = selectedRequest.amount >= 50_000_000
            const isPending = selectedRequest.status === 'pending'

            const statusMeta = {
              pending: { text: 'Đang chờ duyệt', cls: 'bg-amber-100 text-amber-700 border-amber-200/60' },
              approved: { text: 'Đã hoàn tất', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200/60' },
              paid: { text: 'Đã giải ngân', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200/60' },
              rejected: { text: 'Đã từ chối', cls: 'bg-rose-100 text-rose-700 border-rose-200/60' }
            }[selectedRequest.status] ?? {
              text: selectedRequest.status,
              cls: 'bg-slate-100 text-slate-600 border-slate-200'
            }

            return (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  onClick={() => setSelectedRequest(null)}
                />

                {/* Modal */}
                <motion.div
                  className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[92vh] border border-slate-100"
                  initial={{ scale: 0.96, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                  {/* ── Modal Header ── */}
                  <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                        <ShieldAlert size={24} className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-snug">Chi tiết rút tiền</h3>
                        <p className="text-[13px] text-slate-500 mt-0.5 font-mono font-medium">
                          Mã GD: #WD-{selectedRequest._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* ── Scrollable body ── */}
                  <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {/* High-risk warning */}
                    {isHighRisk && isPending && (
                      <div className="px-8 pt-6">
                        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 flex gap-3">
                          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                          <div>
                            <p className="text-sm font-bold text-rose-800">Cảnh báo rủi ro cao</p>
                            <p className="text-[13px] text-rose-700/80 mt-1.5 leading-relaxed font-medium">
                              Số tiền rút vượt ngưỡng <strong className="text-rose-700">50.000.000đ</strong>. Vui lòng
                              kiểm tra lại tính hợp lệ của tài khoản trước khi duyệt.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Amount hero ── */}
                    <div className="mx-8 mt-6 mb-2 bg-slate-50/50 border border-slate-100 rounded-3xl p-8 text-center">
                      <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Số tiền yêu cầu
                      </p>
                      <p className="text-5xl font-extrabold text-indigo-600 leading-none tracking-tight">
                        {formatCurrency(selectedRequest.amount)}
                        <span className="text-3xl font-bold text-indigo-400 ml-1.5">đ</span>
                      </p>
                      <div className="mt-5">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border shadow-sm ${statusMeta.cls}`}
                        >
                          {statusMeta.text}
                        </span>
                      </div>
                    </div>

                    {/* ── Info Sections ── */}
                    <div className="px-8 py-6 space-y-8">
                      {/* Người nhận */}
                      <div>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <User size={16} className="text-indigo-500" />
                          </div>
                          <h4 className="text-base font-bold text-slate-800">Thông tin người yêu cầu</h4>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                          <div className="px-5 py-4">
                            <InfoRow label="Họ và tên" value={account?.userId?.name || account?.accountName || '—'} />
                          </div>
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Email xác thực"
                              value={
                                <span className="flex items-center gap-2">
                                  <Mail size={16} className="text-slate-400 shrink-0" />
                                  {account?.userId?.email || 'N/A'}
                                </span>
                              }
                            />
                          </div>
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Cấp độ tài khoản"
                              value={
                                <span className="flex items-center gap-2 text-indigo-600 font-bold">
                                  <BadgeCheck size={18} />
                                  Member
                                </span>
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Thông tin ngân hàng */}
                      <div>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <CreditCard size={16} className="text-emerald-500" />
                          </div>
                          <h4 className="text-base font-bold text-slate-800">Tài khoản thụ hưởng</h4>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Ngân hàng"
                              value={
                                <span className="flex items-center gap-3">
                                  {account?.logo && (
                                    <span className="w-9 h-9 rounded-lg border border-slate-100 bg-white flex items-center justify-center overflow-hidden p-1 shrink-0 shadow-sm">
                                      <img
                                        src={account.logo}
                                        alt={account.bankShortName}
                                        className="w-full h-full object-contain"
                                      />
                                    </span>
                                  )}
                                  <span>{account?.bankShortName || '—'}</span>
                                </span>
                              }
                            />
                          </div>
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Số tài khoản"
                              value={
                                <span className="flex items-center gap-2 text-slate-900">
                                  <Hash size={16} className="text-slate-400 shrink-0" />
                                  <span className="font-mono text-lg tracking-widest font-semibold">
                                    {account?.accountNumber || '—'}
                                  </span>
                                </span>
                              }
                            />
                          </div>
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Tên chủ thẻ"
                              value={
                                <span className="uppercase font-bold tracking-wider text-slate-800">
                                  {account?.accountName || '—'}
                                </span>
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-5">
                          Lịch sử hệ thống
                        </p>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <span className="w-3 h-3 rounded-full border-2 border-indigo-500 bg-white block mt-1 relative z-10" />
                              {selectedRequest.processed_at && (
                                <div className="absolute top-4 left-1.5 bottom-[-20px] w-0.5 bg-slate-200" />
                              )}
                            </div>
                            <div>
                              <p className="text-[13px] text-slate-500 font-medium">Khởi tạo yêu cầu</p>
                              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}
                              </p>
                            </div>
                          </div>

                          {selectedRequest.processed_at && (
                            <div className="flex items-start gap-4">
                              <span className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-emerald-500 block mt-1 relative z-10" />
                              <div>
                                <p className="text-[13px] text-slate-500 font-medium">Hoàn tất xử lý lúc</p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                  {new Date(selectedRequest.processed_at).toLocaleString('vi-VN')}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Footer Actions ── */}
                  <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-center shrink-0">
                    {isPending ? (
                      <div className="flex items-center gap-2 text-amber-600">
                        <Clock size={16} />
                        <p className="text-sm font-medium">Hệ thống đang chờ xử lý yêu cầu này.</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500">
                        <CheckCircle2
                          size={16}
                          className={selectedRequest.status === 'rejected' ? 'text-rose-500' : 'text-emerald-500'}
                        />
                        <p className="text-sm font-medium">
                          Yêu cầu này đã được {selectedRequest.status === 'rejected' ? 'từ chối' : 'giải ngân'}.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )
          })()}
      </AnimatePresence>
    </div>
  )
}
