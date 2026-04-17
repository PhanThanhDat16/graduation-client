import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusBadge, TypeTag, TopBar } from '../../components/components-wallet'
import type { Transaction } from '@/types/wallet'
import { useWalletStore } from '@/store/useWalletStore'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  Wallet,
  ArrowUpRight,
  PlusCircle,
  Eye,
  EyeOff,
  Search,
  CalendarArrowDown,
  Activity,
  TrendingUp
} from 'lucide-react'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import TransactionDetailModal from '@/components/components-wallet/Transaction-detail'
import path from '@/constants/path'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

// ─── Page: WalletDashboard ────────────────────────────────────────────────────
export default function WalletDashboard() {
  const navigate = useNavigate()

  // ── Zustand ──────────────────────────────────────────────────────────────────
  const { balance, balanceLoading, transactions, pagination, txLoading, fetchBalance, fetchTransactions } =
    useWalletStore()

  // ── Local UI state ────────────────────────────────────────────────────────────
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [value, onChange] = useState<Value>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  // ── Initial fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchBalance(), fetchTransactions({ page: 1, limit: 10 })])
      setInitialLoading(false)
    }
    init()
  }, [])

  // ── Re-fetch when filters change ──────────────────────────────────────────────
  useEffect(() => {
    fetchTransactions({
      page: 1,
      limit: 10,
      type: (typeFilter as any) || undefined,
      status: (statusFilter as any) || undefined
    })
  }, [typeFilter, statusFilter])

  // ── Refresh from ?refresh query param (after payment redirect) ────────────────
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('refresh')) {
      fetchBalance()
      fetchTransactions({ page: 1, limit: 10 })
      urlParams.delete('refresh')
      window.history.replaceState({}, '', urlParams.toString())
    }
  }, [])

  // ── Client-side search (on top of server filters) ─────────────────────────────
  const filtered = transactions.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (t.description || '').toLowerCase().includes(q) ||
      (t.payment_order_id || '').toLowerCase().includes(q) ||
      t._id.toLowerCase().includes(q)
    )
  })

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTransactions({
        page: newPage,
        limit: 10,
        type: (typeFilter as any) || undefined,
        status: (statusFilter as any) || undefined
      })
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'

  if (initialLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-slate-500">Loading wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <TopBar crumbs={['Tổng quan', 'Ví của tôi']} />

      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tổng quan ví</h1>
            <p className="text-slate-400 mt-1 text-base">Quản lý số dư và theo dõi các giao dịch của bạn.</p>
          </div>
        </div>

        {/* Top Cards: Balance & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hero Balance Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white p-8 rounded-2xl relative overflow-hidden shadow-lg shadow-indigo-900/10">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute right-4 top-4">
                <Wallet size={160} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-2 flex items-center gap-2">
                Số dư ví chính
              </p>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-5xl font-extrabold tracking-tight">
                  {balanceVisible ? (
                    balanceLoading ? (
                      <Loader2Icon className="w-8 h-8 animate-spin" />
                    ) : (
                      formatCurrency(balance)
                    )
                  ) : (
                    '*********'
                  )}
                </h2>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-indigo-200 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm"
                >
                  {balanceVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={() => navigate(path.ADD_FUNDS)}
                  className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-slate-50 px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95"
                >
                  <PlusCircle size={18} /> Nạp tiền
                </button>
                <button
                  onClick={() => navigate(path.WITHDRAW)}
                  className="flex items-center gap-2 bg-indigo-500/30 text-white hover:bg-indigo-500/50 border border-indigo-400/30 px-8 py-3 rounded-full font-bold transition-all active:scale-95 backdrop-blur-sm"
                >
                  <ArrowUpRight size={18} /> Rút tiền
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 className="font-extrabold text-slate-800 tracking-tight mb-6">Thống kê nhanh</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Activity size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Tổng giao dịch</p>
                  <p className="font-bold text-slate-800 text-lg">{pagination.total}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Số dư khả dụng</p>
                  <p className="font-bold text-emerald-600 text-lg">
                    {balanceVisible ? formatCurrency(balance) : '***'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight mb-5">Lịch sử giao dịch</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center justify-between p-6 border-b border-slate-100 gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm mã giao dịch hoặc mô tả..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl py-3 px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none pr-10 relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1em'
                  }}
                >
                  <option value="">Tất cả loại giao dịch</option>
                  <option value="escrow_release">Giải ngân Escrow</option>
                  <option value="withdraw">Rút tiền</option>
                  <option value="deposit">Nạp tiền</option>
                  <option value="admin_fee">Phí nền tảng</option>
                  <option value="escrow_deposit">Ký quỹ Escrow</option>
                  <option value="refund">Hoàn tiền</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl py-3 px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1em'
                  }}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="completed">Thành công</option>
                  <option value="pending">Đang xử lý</option>
                  <option value="failed">Thất bại</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`border rounded-xl py-3 px-4 transition-all flex items-center justify-center ${showCalendar ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 text-slate-500'}`}
                  >
                    <CalendarArrowDown size={18} />
                  </button>
                  {showCalendar && (
                    <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                      <Calendar onChange={onChange} value={value} className="border-0 font-sans" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {txLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2Icon className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-slate-800 font-bold mb-1">Không tìm thấy giao dịch</h3>
                  <p className="text-sm text-slate-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4 rounded-tl-xl">Mã giao dịch</th>
                      <th className="px-6 py-4">Thời gian</th>
                      <th className="px-6 py-4">Mô tả</th>
                      <th className="px-6 py-4">Phân loại</th>
                      <th className="px-6 py-4">Phương thức</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right rounded-tr-xl">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((tx) => (
                      <tr
                        key={tx._id}
                        onClick={() => setSelectedTx(tx)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-slate-500 group-hover:text-indigo-600 transition-colors">
                            {tx.payment_order_id || tx._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-700 truncate max-w-[200px]" title={tx.description}>
                            {tx.description || 'Không có mô tả'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <TypeTag type={tx.type as Transaction['type']} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 capitalize">
                            {tx.method_payment}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={tx.status as Transaction['status']} />
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-bold whitespace-nowrap ${
                            tx.status === 'completed'
                              ? tx.amount > 0
                                ? 'text-emerald-600'
                                : 'text-slate-800'
                              : tx.status === 'failed'
                                ? 'text-red-500 line-through opacity-70'
                                : 'text-slate-400'
                          }`}
                        >
                          {tx.amount > 0 ? '+' : ''}
                          {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Footer */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                <p className="text-sm text-slate-500 font-medium">
                  Hiển thị <span className="font-bold text-slate-800">{filtered.length}</span> / {pagination.total} giao
                  dịch
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 mr-2">
                    Trang {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:border-slate-300 hover:text-slate-700 hover:shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeftIcon size={16} />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:border-slate-300 hover:text-slate-700 hover:shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Gradients */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />

      {selectedTx && <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  )
}
