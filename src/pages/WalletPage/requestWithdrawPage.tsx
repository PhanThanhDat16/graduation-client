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
  Calendar,
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
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        Chờ duyệt
      </span>
    )
  if (status === 'approved' || status === 'paid')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Hoàn tất
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      Từ chối
    </span>
  )
}

// ─── Info Row (used in modal) ─────────────────────────────────────────────────
function InfoRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
      <div className={`text-base font-semibold text-slate-800 ${mono ? 'font-mono tracking-wider' : ''}`}>{value}</div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RequestWithdrawPage() {
  const { withdrawRequests: requests, withdrawRequestsLoading: loading, fetchWithdrawRequests } = useWalletStore()

  const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<WithdrawStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchRequests = useCallback(() => {
    fetchWithdrawRequests()
  }, [fetchWithdrawRequests])

  useEffect(() => {
    fetchRequests()
  }, [])

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
    <div className="flex-1 overflow-auto bg-slate-50 font-sans text-slate-900">
      <div className="p-8 space-y-8">
        {/* ── Header ── */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Rút tiền</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Hệ thống xử lý và phê duyệt các yêu cầu thanh toán tài chính tập trung.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Chờ duyệt */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Chờ duyệt</p>
              <h3 className="text-4xl font-black text-amber-600 tracking-tight">{countPending}</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500/80">Yêu cầu cần xử lý</p>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
              <Clock size={28} strokeWidth={1.5} />
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Tổng tiền chờ xử lý</p>
              <h3 className="text-4xl font-black text-indigo-700 tracking-tight">
                {formatCurrency(totalPending)}
                <span className="text-lg font-medium text-indigo-400 ml-1">đ</span>
              </h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400/70">Ước tính</p>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-700 shrink-0">
              <Landmark size={28} strokeWidth={1.5} />
            </div>
          </div>

          {/* Thành công */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Thành công hôm nay</p>
              <h3 className="text-4xl font-black text-emerald-600 tracking-tight">{todaySuccess}</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500/80">Đã giải ngân</p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={28} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {/* Status pills */}
            <div className="flex gap-2 flex-wrap">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key as any)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    filterStatus === tab.key
                      ? 'bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tên, email, số tài khoản..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
                <Calendar size={15} />
                <span className="hidden md:inline">Tháng này</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
                <Filter size={15} />
                <span className="hidden md:inline">Bộ lọc</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    Mã GD
                  </th>
                  <th className="px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    Họ tên
                  </th>
                  <th className="px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    Ngân hàng
                  </th>
                  <th className="px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    Số tài khoản
                  </th>
                  <th className="px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    Số tiền
                  </th>
                  <th className="px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                        <span className="text-sm">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Search size={32} className="opacity-30" />
                        <span className="text-sm">Không tìm thấy yêu cầu nào</span>
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
                        className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                      >
                        {/* Mã GD */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                            #WD-{req._id.toUpperCase()}
                          </span>
                        </td>

                        {/* Họ tên */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                              <User size={13} className="text-indigo-500" />
                            </div>
                            <span className="font-semibold text-slate-800 whitespace-nowrap">
                              {account?.userId?.name || account?.accountName || '—'}
                            </span>
                          </div>
                        </td>

                        {/* Ngân hàng */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
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
                            <span className="font-semibold text-slate-800 whitespace-nowrap text-sm">
                              {account?.bankShortName || '—'}
                            </span>
                          </div>
                        </td>

                        {/* Số tài khoản */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-0.5 rounded tracking-wider">
                            {account?.accountNumber || '—'}
                          </span>
                        </td>

                        {/* Số tiền */}
                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900 whitespace-nowrap">
                            {formatCurrency(req.amount)} ₫
                          </span>
                        </td>

                        {/* Trạng thái */}
                        <td className="px-5 py-4 text-center">
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
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Hiển thị <span className="font-bold text-slate-700">{filteredRequests.length}</span> / {requests.length}{' '}
              yêu cầu
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
              pending: { text: 'Chờ phê duyệt', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
              approved: { text: 'Đã hoàn tất', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
              paid: { text: 'Đã hoàn tất', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
              rejected: { text: 'Đã từ chối', cls: 'bg-rose-100 text-rose-700 border-rose-200' }
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
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setSelectedRequest(null)}
                />

                {/* Modal */}
                <motion.div
                  className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                  initial={{ scale: 0.96, y: 24 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 24 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                >
                  {/* ── Modal Header ── */}
                  <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 px-8 py-6 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                        <ShieldAlert size={22} className="text-indigo-200" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold leading-snug">Chi tiết yêu cầu rút tiền</h3>
                        <p className="text-sm text-indigo-300 mt-0.5 font-mono">
                          #WD-{selectedRequest._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* ── Scrollable body ── */}
                  <div className="overflow-y-auto flex-1">
                    {/* High-risk warning */}
                    {isHighRisk && isPending && (
                      <div className="px-8 pt-7">
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3">
                          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
                          <div>
                            <p className="text-sm font-bold text-rose-800">Cảnh báo rủi ro cao</p>
                            <p className="text-sm text-rose-700/80 mt-1 leading-relaxed">
                              Số tiền rút vượt ngưỡng 50.000.000đ. Vui lòng xác minh kỹ danh tính trước khi phê duyệt.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Amount hero ── */}
                    <div className="mx-8 mt-7 mb-2 bg-gradient-to-br from-slate-50 to-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Số tiền yêu cầu rút
                      </p>
                      <p className="text-6xl font-black text-indigo-700 leading-none">
                        {formatCurrency(selectedRequest.amount)}
                        <span className="text-3xl font-semibold text-indigo-400 ml-2">đ</span>
                      </p>
                      <div className="mt-5">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${statusMeta.cls}`}
                        >
                          {statusMeta.text}
                        </span>
                      </div>
                    </div>

                    {/* ── Info Sections ── */}
                    <div className="px-8 py-6 space-y-8">
                      {/* Người nhận */}
                      <div>
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <User size={16} className="text-indigo-600" />
                          </div>
                          <h4 className="text-base font-bold text-slate-800">Thông tin người nhận</h4>
                        </div>
                        <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                          <div className="px-5 py-4">
                            <InfoRow label="Họ và tên" value={account?.userId?.name || account?.accountName || '—'} />
                          </div>
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Email xác thực"
                              value={
                                <span className="flex items-center gap-2">
                                  <Mail size={14} className="text-slate-400 shrink-0" />
                                  {account?.userId?.email || 'N/A'}
                                </span>
                              }
                            />
                          </div>
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Cấp độ tài khoản"
                              value={
                                <span className="flex items-center gap-2">
                                  <BadgeCheck size={16} className="text-indigo-500" />
                                  <span className="text-indigo-700 font-bold">Member</span>
                                </span>
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Thông tin ngân hàng */}
                      <div>
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <CreditCard size={16} className="text-emerald-600" />
                          </div>
                          <h4 className="text-base font-bold text-slate-800">Thông tin ngân hàng</h4>
                        </div>
                        <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Ngân hàng"
                              value={
                                <span className="flex items-center gap-3">
                                  {account?.logo && (
                                    <span className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-1 shrink-0">
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
                                <span className="flex items-center gap-2">
                                  <Hash size={14} className="text-slate-400 shrink-0" />
                                  <span className="font-mono text-lg tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-lg text-slate-900">
                                    {account?.accountNumber || '—'}
                                  </span>
                                </span>
                              }
                            />
                          </div>
                          <div className="px-5 py-4">
                            <InfoRow
                              label="Chủ tài khoản (in trên thẻ)"
                              value={
                                <span className="uppercase font-bold tracking-wider text-slate-900">
                                  {account?.accountName || '—'}
                                </span>
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                          Lịch sử hệ thống
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                            <div>
                              <p className="text-xs text-slate-500 font-medium">Khởi tạo yêu cầu</p>
                              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}
                              </p>
                            </div>
                          </div>
                          {selectedRequest.processed_at && (
                            <div className="flex items-start gap-3">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <div>
                                <p className="text-xs text-slate-500 font-medium">Xử lý lúc</p>
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
                  {isPending ? (
                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 text-center flex items-center justify-center gap-2 shrink-0">
                      <CheckCircle2 size={16} className="text-slate-500" />{' '}
                      <p className="text-sm text-slate-500 font-medium">Yêu cầu này đang chờ xử lý.</p>
                    </div>
                  ) : (
                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 text-center flex items-center justify-center gap-2 shrink-0">
                      <CheckCircle2 size={16} className="text-emerald-500" />{' '}
                      <p className="text-sm text-emerald-500 font-medium">Yêu cầu này đã được xử lý xong.</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )
          })()}
      </AnimatePresence>
    </div>
  )
}
