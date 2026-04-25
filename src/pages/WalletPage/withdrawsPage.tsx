import { useState, useEffect } from 'react'
import { AmountInput } from '../../components/components-wallet'
import { ArrowUpRight, CheckCircle2Icon, Loader2Icon, DollarSign, X, Plus, Building2, Info } from 'lucide-react'
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

  const { balance, balanceLoading, fetchBalance, createWithdrawRequest, loading: walletLoading } = useWalletStore()
  const { accounts, fetchAccounts } = useBankAccountStore()

  const parsedAmount = parseFloat(amount || '0')
  const fee = parsedAmount * 0.02
  const receive = Math.max(parsedAmount - fee, 0)

  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' ₫'

  useEffect(() => {
    fetchBalance()
    fetchAccounts().then(() => {
      const { accounts } = useBankAccountStore.getState()
      if (accounts.length > 0) setBank(accounts[0]._id)
    })
  }, [])

  const handleWithdraw = async () => {
    setLocalError('')
    setSuccess('')

    if (!parsedAmount || parsedAmount <= 0) {
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

    const ok = await createWithdrawRequest({ amount: parsedAmount, account_id: bank })
    if (ok) {
      setSuccess(
        `Yêu cầu rút ${formatCurrency(parsedAmount)} đã được tạo thành công! Giao dịch sẽ được xử lý sớm nhất.`
      )
      setAmount('')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC]">
      {/* Đã xóa TopBar ở đây */}

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-start gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
              <ArrowUpRight size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Rút tiền về thẻ
              </h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">
                Chuyển số dư từ hệ thống về tài khoản ngân hàng của bạn.
              </p>
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="mb-8 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700 flex items-start gap-3 backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2Icon size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{success}</span>
            </div>
          )}
          {localError && (
            <div className="mb-8 bg-red-50/80 border border-red-200 rounded-2xl p-4 text-sm text-red-600 flex items-start gap-3 backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-2">
              <X size={20} className="text-red-500 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{localError}</span>
            </div>
          )}

          {/* LAYOUT: 2 Khối Độc Lập (giải quyết triệt để chênh lệch chiều cao) */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            {/* CỘT TRÁI: Số dư & Nhập số tiền */}
            <div className="flex-1 w-full flex flex-col gap-6">
              {/* Thẻ Số Dư */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-2">
                      Số dư khả dụng
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-4xl md:text-5xl font-black tracking-tight">
                        {balanceLoading ? <Loader2Icon className="w-8 h-8 animate-spin" /> : formatCurrency(balance)}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
                    <DollarSign size={28} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Khối Nhập Số Tiền */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100/80">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">1. Số tiền cần rút</h2>
                <div className="bg-slate-50/50 p-2 rounded-[1.5rem] border border-slate-100 transition-colors focus-within:bg-white focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50/50">
                  <AmountInput
                    value={amount}
                    onChange={setAmount}
                    presets={[100000, 500000, 1000000, balance]}
                    purpose="rút"
                    color="indigo"
                  />
                </div>

                {/* Cảnh báo vượt số dư */}
                {parsedAmount > balance && balance > 0 && (
                  <div className="flex items-start gap-2.5 mt-4 px-2 animate-in fade-in">
                    <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-600 font-medium leading-relaxed">
                      Số tiền yêu cầu đang lớn hơn số dư khả dụng (<strong>{formatCurrency(balance)}</strong>). Vui lòng
                      nhập lại.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CỘT PHẢI: Ngân hàng & Tóm tắt (Sử dụng Sticky để cuộn mượt mà) */}
            <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 lg:sticky lg:top-6 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100/80">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">
                  2. Tài khoản nhận tiền
                </h2>

                {accounts.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center bg-slate-50">
                    <div className="w-12 h-12 bg-white text-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <Building2 size={24} />
                    </div>
                    <p className="text-slate-600 text-sm font-medium mb-4">Chưa có tài khoản ngân hàng nào.</p>
                    <Link
                      to={path.BANK_ACCOUNTS}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all w-full justify-center"
                    >
                      <Plus size={18} />
                      Thêm tài khoản
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    {accounts.map((acc) => (
                      <button
                        key={acc._id}
                        onClick={() => setBank(acc._id)}
                        className={`group relative w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${
                          bank === acc._id
                            ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm'
                            : 'bg-white border-2 border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center bg-white shrink-0 overflow-hidden p-1">
                          {acc.logo ? (
                            <img src={acc.logo} alt={acc.bankShortName} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span
                            className={`text-sm font-bold ${bank === acc._id ? 'text-indigo-700' : 'text-slate-800'}`}
                          >
                            {acc.bankShortName}
                          </span>
                          <span className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                            ****{acc._id.slice(-4)}
                          </span>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            bank === acc._id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {bank === acc._id && <CheckCircle2Icon size={12} className="text-white" strokeWidth={4} />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Đường gạch ngang phân cách */}
                <hr className="my-6 border-slate-100" />

                {/* Tổng kết */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Số tiền rút</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(parsedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Phí dịch vụ (2%)</span>
                    <span className="font-semibold text-rose-500">-{formatCurrency(fee)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Thực nhận</span>
                    <span className="text-2xl font-black text-indigo-600">{formatCurrency(receive)}</span>
                  </div>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={walletLoading || !amount || !bank || parsedAmount > balance}
                  className="group w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_8px_20px_rgb(99,102,241,0.25)] hover:shadow-[0_10px_25px_rgb(99,102,241,0.35)] disabled:shadow-none flex items-center justify-center gap-3 text-lg"
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

                <div className="mt-5 text-center flex flex-col gap-1">
                  <span className="text-[13px] text-slate-400 font-medium">Xử lý trong vòng 1–2 giờ làm việc</span>
                  <span className="text-[13px] text-slate-400 font-medium">
                    Hỗ trợ (Zalo): <b className="text-indigo-500">0369696969</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawPage
