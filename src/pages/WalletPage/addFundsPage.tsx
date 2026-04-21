import { useState, useEffect } from 'react'
import { AmountInput } from '../../components/components-wallet'
import { Loader2Icon, Wallet, X } from 'lucide-react'
import { usePaymentStore } from '@/store/usePaymentStore'

// ─── Page: AddFundsPage ───────────────────────────────────────────────────────
function AddFundsPage() {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'momo' | 'vnpay'>('momo')
  const [desc, setDesc] = useState('')

  const { loading, error, createMoMoPayment, createVNPayPayment, clearError } = usePaymentStore()

  // Clear any leftover error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const parsedAmount = parseFloat(amount || '0')

  const handleDeposit = async () => {
    if (!parsedAmount || parsedAmount < 100000 || parsedAmount > 10000000) return

    clearError()

    if (method === 'momo') {
      const data = await createMoMoPayment({
        amount: parsedAmount,
        type: 'deposit',
        method: 'momo',
        description: desc
      })
      if (data?.payUrl) {
        window.location.href = data.payUrl
      }
    } else {
      const data = await createVNPayPayment({
        amount: parsedAmount,
        type: 'deposit',
        method: 'vnpay',
        description: desc
      })
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl
      }
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-8 max-w-xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {/* Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl mb-4">
              <Wallet size={24} color="white" />
            </div>
            <h1 className="text-xl font-black text-emerald-600 mb-1">Nạp tiền vào ví</h1>
            <p className="text-sm text-slate-400 mt-1">Nạp tiền vào ví để thực hiện giao dịch.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-center gap-2">
              <X size={18} color="red" /> {error}
            </div>
          )}

          <div className="space-y-6">
            <AmountInput
              value={amount}
              onChange={setAmount}
              presets={[50000, 100000, 500000, 1000000]}
              purpose="nạp"
              color="emerald"
            />

            {/* Payment Method */}
            <div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3 block">
                Phương thức thanh toán
              </label>

              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    {
                      key: 'momo',
                      name: 'MoMo',
                      desc: 'Thanh toán QR',
                      logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-300x300.png'
                    },
                    {
                      key: 'vnpay',
                      name: 'VNPay',
                      desc: 'Thanh toán VNPay',
                      logo: 'https://i.pinimg.com/736x/f9/5e/a2/f95ea23c297af3170d9d75173bed9d7e.jpg'
                    }
                  ] as const
                ).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={`relative border rounded-xl p-4 flex items-center gap-4 transition-all ${
                      method === m.key
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
                      <img src={m.logo} alt={m.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className={`text-sm font-semibold ${method === m.key ? 'text-emerald-600' : 'text-slate-800'}`}
                      >
                        {m.name}
                      </span>
                      <span className="text-sm text-slate-400">{m.desc}</span>
                    </div>
                    {method === m.key && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
                Mô tả giao dịch (Tùy chọn)
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Mô tả giao dịch..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl p-3 text-base text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            </div>

            {/* Fee */}
            <div className="flex justify-between items-center py-3 border-t border-slate-100">
              <span className="text-sm text-slate-500 font-bold">Phí giao dịch</span>
              <span className="text-sm font-bold text-slate-500">0 ₫</span>
            </div>

            {loading && (
              <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-3">
                  <Loader2Icon className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-sm text-slate-600">Đang chuyển đến cổng thanh toán...</p>
                </div>
              </div>
            )}

            <button
              onClick={handleDeposit}
              disabled={loading || !amount || parsedAmount < 100000 || parsedAmount > 10000000}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all text-white font-bold py-3.5 rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                  Đang chuyển đến cổng thanh toán...
                </>
              ) : (
                'Nạp tiền'
              )}
            </button>

            <p className="text-sm text-slate-400 text-center leading-relaxed">
              Bằng cách nhấp vào 'Nạp tiền', bạn đồng ý với{' '}
              <span className="text-indigo-500 hover:underline cursor-pointer font-semibold">Điều khoản dịch vụ</span>{' '}
              và xác nhận rằng tiền sẽ được ghi có vào tài khoản của bạn ngay lập tức.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFundsPage
