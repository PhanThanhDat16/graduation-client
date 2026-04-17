import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TopBar } from '../../components/components-wallet'
import BankDropdown from '../../components/components-wallet/BankDropDownButton'
import {
  Landmark,
  Plus,
  TrendingUp,
  ArrowRight,
  X,
  ShieldOff,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  CreditCard,
  CircleDollarSign,
  Clock
} from 'lucide-react'
import type { IBankAccount, ICreateBankAccount } from '@/types/accountBank'
import { useBankAccountStore } from '@/store/useBankAccountStore'

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' | 'info' }) {
  const colors = {
    success: 'border-emerald-500 bg-emerald-50',
    error: 'border-red-500 bg-red-50',
    info: 'border-indigo-500 bg-indigo-50'
  }
  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-600" />,
    error: <X size={20} className="text-red-600" />,
    info: <Clock size={20} className="text-indigo-600" />
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      className={`fixed top-24 right-8 z-[100] border-l-4 ${colors[type]} backdrop-blur-xl shadow-2xl rounded-xl p-4 flex items-center gap-4 min-w-[320px]`}
    >
      <div className="bg-white/60 p-2 rounded-full">{icons[type]}</div>
      <div>
        <p className="font-bold text-sm text-slate-800">
          {type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : 'Thông báo'}
        </p>
        <p className="text-xs text-slate-500">{message}</p>
      </div>
    </motion.div>
  )
}

// ─── Add Account Modal ────────────────────────────────────────────────────────
function AddAccountModal({
  onClose,
  onAdd,
  isLoading
}: {
  onClose: () => void
  onAdd: (acc: ICreateBankAccount) => void
  isLoading: boolean // Nhận loading từ parent để disable nút
}) {
  const [formData, setFormData] = useState({
    code: '',
    bankShortName: '',
    accountNumber: '',
    owner: '',
    logo: ''
  })

  const [banksList, setBanksList] = useState<any[]>([])

  useEffect(() => {
    fetch('https://api.vietqr.io/v2/banks')
      .then((r) => r.json())
      .then((res) => setBanksList(res.data || []))
      .catch(() => setBanksList([]))
  }, [])

  const errors = useMemo(() => {
    const newErrors = { bank: '', accountNumber: '', owner: '' }

    if (formData.bankShortName && !formData.code) {
      newErrors.bank = 'Ngân hàng không hợp lệ'
    }

    if (formData.accountNumber && formData.accountNumber.length < 6) {
      newErrors.accountNumber = 'Số tài khoản phải có ít nhất 6 ký số'
    }

    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/
    if (formData.owner && !nameRegex.test(formData.owner)) {
      newErrors.owner = 'Tên không được chứa số hoặc ký tự đặc biệt'
    }

    return newErrors
  }, [formData])

  const handleBankChange = (val: string) => {
    const found = banksList.find((b) => b.shortName === val)
    setFormData((prev) => ({
      ...prev,
      bankShortName: val,
      code: found?.code || '',
      logo: found?.logo || ''
    }))
  }

  // Kiểm tra form có thực sự valid để enable nút không
  const isFormValid = useMemo(() => {
    return (
      formData.bankShortName &&
      formData.accountNumber.length >= 6 &&
      formData.owner.trim() !== '' &&
      !errors.bank &&
      !errors.accountNumber &&
      !errors.owner
    )
  }, [formData, errors])

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={!isLoading ? onClose : undefined} // Không cho đóng khi đang load
    >
      <motion.div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center px-8">
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-white">Thêm tài khoản mới</h2>
          </div>
          {!isLoading && (
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8 space-y-5">
          {/* Ngân hàng */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Ngân hàng</label>
            <BankDropdown value={formData.bankShortName} onChange={handleBankChange} />
            {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
          </div>

          {/* Số tài khoản */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Số tài khoản</label>
            <input
              type="text" // Dùng text để kiểm soát độ dài dễ hơn
              disabled={isLoading}
              value={formData.accountNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, '') }))}
              placeholder="Nhập số tài khoản..."
              className={`w-full border ${errors.accountNumber ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-indigo-300 transition-all`}
            />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
          </div>

          {/* Chủ tài khoản */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Chủ tài khoản</label>
            <input
              type="text"
              disabled={isLoading}
              value={formData.owner}
              onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value.toUpperCase() }))}
              placeholder="NGUYEN VAN A"
              className={`w-full border ${errors.owner ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-indigo-300 transition-all uppercase`}
            />
            {errors.owner && <p className="text-red-500 text-xs mt-1">{errors.owner}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              disabled={isLoading}
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={() => onAdd({ ...formData, accountName: formData.owner.trim(), status: 'active' })}
              disabled={!isFormValid || isLoading}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Thêm tài khoản'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({
  account,
  onClose,
  onToggle,
  onDelete
}: {
  account: IBankAccount
  onClose: () => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  const isActive = account.status === 'active'
  const maskedNumber = account.accountNumber.replace(/(.{4})/g, '$1 ').trim()

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className="relative h-48">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-8 bottom-4">
              <Landmark size={120} className="text-white" />
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-md transition-colors"
          >
            <X size={18} />
          </button>

          {/* Floating icon */}
          <div className="absolute -bottom-8 left-8 bg-white p-4 rounded-2xl shadow-lg border border-slate-100">
            {account.logo ? (
              <img src={account.logo} alt={account.bankShortName} className="w-18 h-12 object-contain" />
            ) : (
              <Landmark size={48} className="text-indigo-600" />
            )}
          </div>
        </div>

        <div className="p-8 pt-14">
          {/* Title + Badge */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{account.bankShortName}</h2>
              <p className="text-slate-400 text-base mt-1">Tài khoản thanh toán</p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isActive
                  ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                  : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
              }`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Số tài khoản</p>
              <p className="font-mono text-lg font-bold text-slate-800">{maskedNumber}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Chủ tài khoản</p>
              <p className="text-lg font-bold text-slate-800">{account.accountName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Ngày kết nối</p>
              <p className="text-lg font-bold text-slate-800">{account.createdAt.split('T')[0]}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Loại tiền tệ</p>
              <p className="text-lg font-bold text-slate-800">VNĐ</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onToggle(account._id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                isActive
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 ring-1 ring-amber-200'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 ring-1 ring-emerald-200'
              }`}
            >
              {isActive ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
              {isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
            </button>
            <button
              onClick={() => onDelete(account._id)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 ring-1 ring-red-200 font-bold transition-all"
            >
              <Trash2 size={16} />
              Xóa
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Account Card ─────────────────────────────────────────────────────────────
function AccountCard({ account, onClick }: { account: IBankAccount; onClick: () => void }) {
  if (!account) return null

  const isActive = account.status === 'active'
  const last4 = account.accountNumber.slice(-4) || '****'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={isActive ? { y: -4 } : undefined}
      onClick={onClick}
      className={`group relative p-8 rounded-2xl transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-900/10 border border-stone-200 hover:border-stone-400'
          : 'bg-slate-50/60 opacity-60 grayscale border border-slate-200/50 cursor-not-allowed'
      }`}
    >
      {/* Top row: icon + badge */}
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3.5 rounded-xl ${isActive ? 'bg-indigo-50' : 'bg-slate-100'}`}>
          {account.logo ? (
            <img
              src={account.logo}
              alt={account.bankShortName}
              className="w-18 h-8 object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = 'fallback-url-icon-bank'
              }}
            />
          ) : (
            <Landmark size={28} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
          )}
        </div>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
            isActive
              ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
              : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Bank name + masked number */}
      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1">{account.bankShortName}</h3>
      <p className="text-slate-400 font-mono tracking-[0.2em] text-sm mb-6">•••• •••• •••• {last4}</p>

      {/* Bottom row */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Chủ tài khoản</p>
          <p className="text-sm font-bold text-slate-700">{account.accountName}</p>
        </div>
        {isActive ? (
          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={18} />
          </div>
        ) : (
          <ShieldOff size={18} className="text-slate-300" />
        )}
      </div>
    </motion.div>
  )
}

// ─── Add Card Slot ────────────────────────────────────────────────────────────
function AddCardSlot({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-indigo-50/30 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer group min-h-[260px]"
    >
      <div className="h-16 w-16 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors group-hover:scale-110 transform duration-300">
        <Plus size={28} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
      </div>
      <p className="font-bold text-slate-600 group-hover:text-indigo-600 transition-colors text-sm">
        Thêm tài khoản mới
      </p>
      <p className="text-sm text-center mt-2 px-4 text-slate-400">
        Kết nối thêm các tài khoản ngân hàng của bạn vào hệ thống.
      </p>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BankAccountPage() {
  const { accounts, loading, fetchAccounts, createAccount, toggleStatus, deleteAccount } = useBankAccountStore()
  const [selected, setSelected] = useState<IBankAccount | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleToggle = async (id: string) => {
    const { success, message } = await toggleStatus(id)
    setSelected(null)
    showToast(message, success ? 'info' : 'error')
  }

  const handleAdd = async (data: ICreateBankAccount) => {
    const { success, message } = await createAccount(data)
    if (success) setShowAddModal(false)
    showToast(message, success ? 'success' : 'error')
    if (!success) setShowAddModal(false)
  }

  const handleDelete = async (id: string) => {
    const { success, message } = await deleteAccount(id)
    setSelected(null)
    showToast(message, success ? 'success' : 'error')
  }

  // Các hàm handleAdd, handleDelete nên dùng optional chaining: accounts?.length
  const activeCount = accounts?.filter((a) => a.status === 'active').length || 0
  const disabledCount = accounts?.filter((a) => a.status === 'inactive').length || 0

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <TopBar crumbs={['Tổng quan', 'Ví của tôi', 'Tài khoản ngân hàng']} />

      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý tài khoản ngân hàng</h1>
            <p className="text-slate-400 mt-1 text-base">Theo dõi và quản lý danh sách tài khoản cá nhân của bạn.</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hero Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute right-4 top-4 ">
                <Landmark size={160} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-2">
                Tổng tài khoản kết nối
              </p>
              <h2 className="text-5xl font-extrabold tracking-tight mb-4">{accounts.length}</h2>
              <div className="flex gap-3 mt-4">
                <span className="flex items-center gap-1.5 text-sm bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                  <TrendingUp size={14} />
                  {activeCount} đang hoạt động
                </span>
                {disabledCount > 0 && (
                  <span className="flex items-center gap-1.5 text-sm bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                    <ShieldOff size={14} />
                    {disabledCount} vô hiệu hóa
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-extrabold text-slate-800 tracking-tight mb-5">Thống kê nhanh</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CreditCard size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-base text-slate-400 mb-2">Tổng tài khoản</p>
                  <p className="text-base font-bold text-slate-800">{accounts.length} tài khoản</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <CircleDollarSign size={22} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-base text-slate-400 mb-2">Đang hoạt động</p>
                  <p className="text-base font-bold text-emerald-600">{activeCount} tài khoản</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <ShieldOff size={22} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-base text-slate-400 mb-2">Vô hiệu hóa</p>
                  <p className="text-base font-bold text-slate-500">{disabledCount} tài khoản</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight mb-5">Danh sách tài khoản</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {accounts?.map((acc) => (
                <AccountCard key={acc._id} account={acc} onClick={() => setSelected(acc)} />
              ))}
            </AnimatePresence>
            <AddCardSlot onClick={() => setShowAddModal(true)} />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <DetailModal
            account={selected}
            onClose={() => setSelected(null)}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      {/* Add Account Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddAccountModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} isLoading={loading} />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>

      {/* Decorative Gradients */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}
