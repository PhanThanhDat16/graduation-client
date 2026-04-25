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

  const handleDeposit = async () => {
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0) return

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
      {/* Đã xóa TopBar ở đây */}

      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 border-b border-slate-100 pb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-emerald-200">
              <Wallet size={24} color="white" />
            </div>
            <h1 className="text-2xl font-black text-emerald-600 mb-2">Nạp tiền vào ví</h1>
            <p className="text-sm text-slate-500">Nạp tiền vào ví để thực hiện các giao dịch trên hệ thống.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-3 w-full">
              <X size={20} className="text-red-500 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* CHIA LAYOUT LÀM 2 CỘT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Cột Trái: Thông tin số tiền & Mô tả */}
            <div className="space-y-6">
              <AmountInput
                value={amount}
                onChange={setAmount}
                presets={[50000, 100000, 500000, 1000000]}
                purpose="nạp"
                color="emerald"
              />

              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3 block">
                  Mô tả giao dịch (Tùy chọn)
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Nhập nội dung chuyển tiền..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl p-4 text-base text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors resize-none"
                />
              </div>
            </div>

            {/* Cột Phải: Phương thức thanh toán & Xác nhận */}
            <div className="space-y-6 lg:border-l lg:border-slate-100 lg:pl-12 flex flex-col justify-between">
              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4 block">
                  Phương thức thanh toán
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      {
                        key: 'momo',
                        name: 'Ví MoMo',
                        desc: 'Quét mã QR',
                        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-300x300.png'
                      },
                      {
                        key: 'vnpay',
                        name: 'VNPay',
                        desc: 'Thẻ ATM/Banking',
                        logo: 'https://i.pinimg.com/736x/f9/5e/a2/f95ea23c297af3170d9d75173bed9d7e.jpg'
                      }
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMethod(m.key)}
                      className={`relative border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 ${
                        method === m.key
                          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
                        <img src={m.logo} alt={m.name} className="w-7 h-7 object-contain" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span
                          className={`text-sm font-bold ${method === m.key ? 'text-emerald-700' : 'text-slate-700'}`}
                        >
                          {m.name}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">{m.desc}</span>
                      </div>
                      {method === m.key && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                {/* Fee */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base text-slate-500 font-medium">Phí giao dịch</span>
                  <span className="text-base font-bold text-emerald-600">Miễn phí</span>
                </div>

                <button
                  onClick={handleDeposit}
                  disabled={loading || !amount}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận nạp tiền'
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center leading-relaxed mt-4">
                  Bằng cách nhấp vào nút trên, bạn đồng ý với{' '}
                  <span className="text-emerald-600 hover:underline cursor-pointer font-semibold">
                    Điều khoản dịch vụ
                  </span>{' '}
                  và xác nhận số tiền sẽ được cộng trực tiếp vào ví.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 border border-slate-100">
            <Loader2Icon className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-slate-700">Đang chuyển hướng đến cổng thanh toán...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddFundsPage
