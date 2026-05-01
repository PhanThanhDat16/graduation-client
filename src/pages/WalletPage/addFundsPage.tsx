import { useState, useEffect } from 'react'
import { TopBar, AmountInput } from '../../components/components-wallet'
import { Loader2Icon, Wallet, X, CheckCircle2, ArrowRight } from 'lucide-react'
import { usePaymentStore } from '@/store/usePaymentStore'

// ─── Page: AddFundsPage ───────────────────────────────────────────────────────
function AddFundsPage() {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'momo' | 'vnpay'>('momo')
  const [desc, setDesc] = useState('')

  const { loading, error, createMoMoPayment, createVNPayPayment, clearError } = usePaymentStore()

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
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC]">
      <TopBar crumbs={['Tổng quan', 'Ví của tôi', 'Nạp tiền vào ví']} />

      <div className="flex-1 overflow-auto py-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden flex flex-col lg:flex-row">
            {/* CỘT TRÁI: Nhập liệu (Chiếm không gian lớn hơn một chút) */}
            <div className="w-full lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              {/* Header section */}
              <div className="flex items-start gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                  <Wallet size={26} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    Nạp tiền vào ví
                  </h1>
                  <p className="text-slate-500 text-sm md:text-base font-medium">
                    Bổ sung số dư an toàn và nhanh chóng.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-8 bg-red-50/80 border border-red-100 rounded-2xl p-4 text-sm text-red-600 flex items-start gap-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                  <X size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              {/* Form Input */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Số tiền cần nạp</h2>
                  <div className="bg-slate-50/50 p-2 rounded-3xl border border-slate-100 transition-colors focus-within:bg-white focus-within:border-emerald-200 focus-within:ring-4 focus-within:ring-emerald-50/50">
                    <AmountInput
                      value={amount}
                      onChange={setAmount}
                      presets={[50000, 100000, 500000, 1000000]}
                      purpose="nạp"
                      color="emerald"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Lời nhắn (Tùy chọn)</h2>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Ví dụ: Nạp tiền thanh toán đơn hàng..."
                    rows={3}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50/50 focus:border-emerald-300 focus:bg-white transition-all duration-200 resize-none text-base"
                  />
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: Thanh toán & Xác nhận (Nền khác màu để phân biệt) */}
            <div className="w-full lg:w-2/5 bg-slate-50/80 p-8 md:p-12 lg:border-l border-slate-100/80 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">
                  3. Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  {(
                    [
                      {
                        key: 'momo',
                        name: 'Ví MoMo',
                        desc: 'Quét mã QR qua ứng dụng MoMo',
                        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-300x300.png'
                      },
                      {
                        key: 'vnpay',
                        name: 'VNPAY',
                        desc: 'Thanh toán qua thẻ ATM/Banking',
                        logo: 'https://i.pinimg.com/736x/f9/5e/a2/f95ea23c297af3170d9d75173bed9d7e.jpg'
                      }
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMethod(m.key)}
                      className={`group relative w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${
                        method === m.key
                          ? 'bg-white border-2 border-emerald-500 shadow-[0_4px_20px_rgb(16,185,129,0.15)]'
                          : 'bg-white border-2 border-transparent shadow-sm hover:shadow-md hover:border-slate-200'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center bg-white shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                        <img src={m.logo} alt={m.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span
                          className={`text-base font-bold ${method === m.key ? 'text-emerald-700' : 'text-slate-800'}`}
                        >
                          {m.name}
                        </span>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">{m.desc}</span>
                      </div>

                      {/* Custom Radio Circle */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          method === m.key ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-slate-50'
                        }`}
                      >
                        {method === m.key && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200/60">
                {/* Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
                    <span>Phí giao dịch</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
                    <span>Thời gian xử lý</span>
                    <span className="text-slate-800">Tức thì</span>
                  </div>
                </div>

                <button
                  onClick={handleDeposit}
                  disabled={loading || !amount}
                  className="group relative w-full overflow-hidden bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_8px_20px_rgb(16,185,129,0.25)] hover:shadow-[0_10px_25px_rgb(16,185,129,0.35)] disabled:shadow-none flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="w-6 h-6 animate-spin" />
                      <span>Đang kết nối...</span>
                    </>
                  ) : (
                    <>
                      <span>Tiến hành thanh toán</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-[13px] text-slate-400 text-center mt-5 font-medium px-4">
                  Giao dịch được bảo mật với mã hóa 256-bit. <br className="hidden lg:block" />
                  Đọc thêm về{' '}
                  <a href="#" className="text-emerald-600 hover:underline">
                    Điều khoản
                  </a>{' '}
                  của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay - Minimalist approach */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5 max-w-sm w-11/12 mx-auto transform animate-in zoom-in-95">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center">
                <Loader2Icon className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Đang xử lý</h3>
              <p className="text-sm text-slate-500 font-medium">Vui lòng không đóng trình duyệt...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddFundsPage
