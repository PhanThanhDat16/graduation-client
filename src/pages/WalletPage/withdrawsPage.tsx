import { useState, useEffect } from 'react'
import { TopBar, AmountInput } from '../../components/components-wallet'
import {
  ArrowUpRight,
  CheckCircle2Icon,
  Loader2Icon,
  DollarSign,
  X,
  Plus,
  Building2,
  Info,
  ShieldAlert,
  ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import path from '@/constants/path'
import { useWalletStore } from '@/store/useWalletStore'
import { useBankAccountStore } from '@/store/useBankAccountStore'

// ─── Page: WithdrawPage ───────────────────────────────────────────────────────
function WithdrawPage() {
  const [amount, setAmount] = useState('')
  const [bank, setBank] = useState<string>('')
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')

  // STATE: Dùng để bật/tắt Modal Điều Khoản
  const [showTermsModal, setShowTermsModal] = useState(false)

  // ── Zustand ──────────────────────────────────────────────────────────────────
  const { balance, balanceLoading, fetchBalance, createWithdrawRequest, loading: walletLoading } = useWalletStore()
  const { accounts, fetchAccounts } = useBankAccountStore()

  const parsedAmount = parseFloat(amount || '0')
  const fee = parsedAmount * 0.02
  const receive = Math.max(parsedAmount - fee, 0)

  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' ₫'

  useEffect(() => {
    fetchBalance()
    fetchAccounts().then(() => {
      // Auto-select first account after load
      const { accounts } = useBankAccountStore.getState()

      const activeAccounts = accounts.filter((acc) => acc.status === 'active')
      if (activeAccounts.length > 0) setBank(activeAccounts[0]._id)
    })
  }, [])

  const handleWithdraw = async () => {
    setLocalError('')
    setSuccess('')

    if (!parsedAmount || parsedAmount < 100000) {
      setLocalError('Vui lòng nhập số tiền hợp lệ')
      return
    }
    if (parsedAmount > balance) {
      setLocalError('Số dư không đủ để thực hiện giao dịch')
      return
    }
    if (!bank) {
      setLocalError('Vui lòng chọn tài khoản ngân hàng')
      return
    }

    const ok = await createWithdrawRequest({ amount: parsedAmount, accountId: bank })
    if (ok) {
      setSuccess(
        `Yêu cầu rút ${formatCurrency(parsedAmount)} đã được tạo thành công! Giao dịch sẽ được xử lý sớm nhất.`
      )
      setAmount('')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC]">
      <TopBar crumbs={['Tổng quan', 'Ví của tôi', 'Rút tiền']} />
      <div className="flex-1 overflow-auto py-4 md:py-8">
        <div className="max-w-7xl">
          {/* Main Card */}
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden flex flex-col lg:flex-row">
            {/* CỘT TRÁI: Số dư & Nhập liệu */}
            <div className="w-full lg:w-3/5 p-6 sm:p-8 md:p-9 flex flex-col">
              {/* Header */}
              <div className="flex items-start gap-4 sm:gap-5 mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                  <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 sm:mb-2">
                    Rút tiền về thẻ
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm md:text-base font-medium">
                    Chuyển số dư về tài khoản ngân hàng của bạn.
                  </p>
                </div>
              </div>

              {/* Messages */}
              {success && (
                <div className="mb-8 bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-700 flex items-start gap-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2Icon size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{success}</span>
                </div>
              )}
              {localError && (
                <div className="mb-8 bg-red-50/80 border border-red-100 rounded-2xl p-4 text-sm text-red-600 flex items-start gap-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                  <X size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{localError}</span>
                </div>
              )}

              {/* Balance Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 mb-8 text-white shadow-xl shadow-indigo-500/20 group shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
                      Số dư khả dụng
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl md:text-4xl font-black tracking-tight">
                        {balanceLoading ? <Loader2Icon className="w-8 h-8 animate-spin" /> : formatCurrency(balance)}
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Form Input */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Số tiền cần rút</h2>
                <div className="bg-slate-50/50 p-2 rounded-3xl border border-slate-100 transition-colors focus-within:bg-white focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50/50">
                  <AmountInput
                    value={amount}
                    onChange={setAmount}
                    presets={[100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000]}
                    purpose="rút"
                    color="indigo"
                  />
                </div>

                {/* Balance warning */}
                {parsedAmount > balance && balance > 0 && (
                  <div className="flex items-start gap-2.5 px-2 animate-in fade-in">
                    <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-600 font-medium leading-snug">
                      Số tiền yêu cầu vượt quá số dư khả dụng (<strong>{formatCurrency(balance)}</strong>).
                    </p>
                  </div>
                )}

                {/* --- THANH ĐIỀU KHOẢN SIÊU GỌN CHÈN DƯỚI INPUT --- */}
                <div className="mt-4 flex items-center justify-between p-3.5 sm:px-5 bg-slate-50 border border-slate-100 rounded-2xl transition-colors hover:bg-slate-100">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <ShieldAlert size={18} className="text-indigo-500" />
                    <span className="text-[13px] sm:text-sm text-slate-700 font-medium">
                      Quy định & Điều khoản rút tiền
                    </span>
                  </div>
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="flex items-center gap-1 text-[13px] sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
                  >
                    Xem chi tiết
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: Ngân hàng & Xác nhận */}
            <div className="w-full lg:w-2/5 bg-slate-50/80 p-6 sm:p-8 md:p-9 lg:border-l border-slate-100/80 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">
                  2. Tài khoản nhận tiền
                </h2>

                {accounts.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-indigo-300 hover:bg-indigo-50/30">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
                      <Building2 size={24} />
                    </div>
                    <p className="text-slate-600 font-medium mb-4">Bạn chưa liên kết tài khoản ngân hàng nào.</p>
                    <Link
                      to={path.BANK_ACCOUNTS}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                      <Plus size={18} />
                      Thêm tài khoản
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {accounts.map((acc) => (
                      <button
                        key={acc._id}
                        disabled={acc.status === 'inactive'}
                        onClick={() => setBank(acc._id)}
                        className={`group ${acc.status === 'inactive' ? 'cursor-not-allowed opacity-50' : ''} relative w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${
                          bank === acc._id
                            ? 'bg-white border-2 border-indigo-500 shadow-[0_4px_20px_rgb(99,102,241,0.15)]'
                            : 'bg-white border-2 border-transparent shadow-sm hover:shadow-md hover:border-slate-200'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center bg-white shrink-0 overflow-hidden group-hover:scale-105 transition-transform p-1">
                          {acc.logo ? (
                            <img src={acc.logo} alt={acc.bankShortName} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span
                            className={`text-base font-bold line-clamp-1 ${bank === acc._id ? 'text-indigo-700' : 'text-slate-800'}`}
                          >
                            {acc.bankShortName}
                          </span>
                          <span className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                            Tài khoản: ****{acc.accountNumber.slice(-4)}
                          </span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            bank === acc._id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 bg-slate-50'
                          }`}
                        >
                          {bank === acc._id && <CheckCircle2Icon size={14} className="text-white" strokeWidth={3} />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60">
                {/* Summary */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Số tiền rút</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(parsedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Phí dịch vụ (2%)</span>
                    <span className="font-semibold text-rose-500">-{formatCurrency(fee)}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800">Thực nhận</span>
                    <span className="text-lg font-black text-indigo-600">{formatCurrency(receive)}</span>
                  </div>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={
                    walletLoading ||
                    !amount ||
                    !bank ||
                    parsedAmount > balance ||
                    parsedAmount < 100000 ||
                    parsedAmount > 10000000
                  }
                  className="group relative w-full overflow-hidden bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_8px_20px_rgb(99,102,241,0.25)] hover:shadow-[0_10px_25px_rgb(99,102,241,0.35)] disabled:shadow-none flex items-center justify-center gap-3 text-lg"
                >
                  {walletLoading ? (
                    <>
                      <Loader2Icon className="w-5 h-5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Xác nhận rút tiền</span>
                  )}
                </button>

                <div className="mt-5 text-center space-y-1">
                  <p className="text-[13px] text-slate-400 font-medium">
                    Thời gian xử lý giao dịch: <span className="text-slate-600">1–2 giờ làm việc</span>
                  </p>
                  <p className="text-[13px] text-slate-400 font-medium">
                    Hỗ trợ CSKH qua Zalo: <span className="text-indigo-600 font-bold">0369696969</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL QUY ĐỊNH (HIỂN THỊ KHI BẤM NÚT) ─── */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] sm:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            {/* Header Modal */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-[14px] flex items-center justify-center border border-amber-100">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-slate-900">Điều khoản rút tiền</h2>
                </div>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung Quy định */}
            <div className="p-6 sm:p-8 bg-amber-50/30">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-700 font-medium leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>
                    Tên chủ tài khoản ngân hàng phải <strong className="text-amber-900">trùng khớp hoàn toàn</strong>{' '}
                    với họ tên trên hồ sơ FreeWork của bạn để đảm bảo tính chính danh (KYC).
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 font-medium leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>
                    Đối với <strong className="text-amber-900">Doanh nghiệp/Công ty</strong>, vui lòng liên hệ trực tiếp
                    Admin để cung cấp chứng từ kế toán và thực hiện lệnh rút.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 font-medium leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>
                    Nhằm chống gian lận và rửa tiền (AML), các giao dịch có dấu hiệu bất thường sẽ bị tạm giữ để xác
                    minh trong vòng 24h - 48h.
                  </span>
                </li>
              </ul>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-900/20"
              >
                Tôi đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WithdrawPage
