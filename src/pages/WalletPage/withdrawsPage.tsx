import { useState, useEffect } from 'react'
import { TopBar, AmountInput } from '../../components/components-wallet'
import { ArrowUpRight, CheckCircle2Icon, Loader2Icon, DollarSign, X, Plus } from 'lucide-react'
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
      setLocalError('Số dư không đủ')
      return
    }
    if (!bank) {
      setLocalError('Vui lòng chọn tài khoản ngân hàng')
      return
    }

    const ok = await createWithdrawRequest({ amount: parsedAmount, account_id: bank })
    if (ok) {
      setSuccess(
        `Yêu cầu rút tiền ${formatCurrency(parsedAmount)} đã được tạo thành công! Giao dịch sẽ được admin xử lý sớm nhất.`
      )
      setAmount('')
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <TopBar crumbs={['Tổng quan', 'Ví của tôi', 'Rút tiền']} />

      <div className="p-8 max-w-xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-2xl mb-4">
              <ArrowUpRight size={24} color="white" />
            </div>
            <h1 className="text-2xl font-black text-indigo-500">Rút tiền</h1>
            <p className="text-base text-slate-400 mt-1">Rút tiền về tài khoản ngân hàng của bạn</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-emerald-50 flex gap-2 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700 items-center">
              <CheckCircle2Icon color="green" size={24} /> {success}
            </div>
          )}

          {/* Error Message */}
          {localError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-center gap-2">
              <X size={24} color="red" /> {localError}
            </div>
          )}

          {/* Available Balance */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-sm text-indigo-400 font-semibold uppercase tracking-widest mb-0.5">Số dư khả dụng</p>
              <p className="text-2xl font-black text-indigo-700">
                {balanceLoading ? <Loader2Icon className="w-6 h-6 animate-spin inline" /> : formatCurrency(balance)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg">
              <DollarSign size={24} color="white" />
            </div>
          </div>

          <div className="space-y-5">
            <AmountInput
              value={amount}
              onChange={setAmount}
              presets={[100000, 500000, 1000000]}
              purpose="rút"
              color="indigo"
            />

            {/* Bank select */}
            <div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3 block">
                Chọn tài khoản nhận tiền
              </label>
              {accounts.length === 0 ? (
                <div className="flex justify-center mt-4">
                  <Link
                    to={path.BANK_ACCOUNTS}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                  >
                    <Plus size={16} />
                    Thêm tài khoản ngân hàng
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {accounts.map((acc) => (
                    <button
                      key={acc._id}
                      onClick={() => setBank(acc._id)}
                      className={`relative flex items-center gap-3 p-3 border rounded-xl transition-all ${
                        bank === acc._id
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center overflow-hidden">
                        {acc.logo && (
                          <img src={acc.logo} alt={acc.bankShortName} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{acc.bankShortName}</span>
                      {bank === acc._id && <span className="absolute top-2 right-2 text-indigo-600">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="border border-slate-100 rounded-xl p-4 space-y-2 bg-slate-50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-semibold">Số tiền rút</span>
                <span className="font-semibold text-slate-800">{formatCurrency(parsedAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-semibold">Phí dịch vụ (2%)</span>
                <span className="font-semibold text-red-500">-{formatCurrency(fee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="text-sm font-bold text-slate-800">Bạn sẽ nhận được</span>
                <span className="font-black text-indigo-600">{formatCurrency(receive)}</span>
              </div>
            </div>

            {/* Balance warning */}
            {parsedAmount > balance && balance > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">⚠</span>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Số tiền yêu cầu vượt quá số dư khả dụng của bạn là <strong>{formatCurrency(balance)}</strong>.
                </p>
              </div>
            )}

            <button
              onClick={handleWithdraw}
              disabled={walletLoading || !amount || !bank}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all text-white font-bold py-3.5 rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {walletLoading ? (
                <>
                  <Loader2Icon className="w-4 h-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                <>Rút tiền</>
              )}
            </button>
            <p className="text-sm text-slate-500 text-center mt-1">Thời gian xử lý: 1–2 giờ</p>
            <p className="text-sm text-slate-500 text-center mt-1">Mọi thắc mắc liên hệ: 0369696969 (Zalo)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawPage
