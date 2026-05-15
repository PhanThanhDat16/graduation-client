import { useState, useEffect } from 'react'
import { TopBar, AmountInput } from '../../components/components-wallet'
import {
  CheckCircle2Icon,
  Loader2Icon,
  DollarSign,
  X,
  ShieldAlert, // <--- Import thêm ShieldAlert
  ArrowRight
} from 'lucide-react'
import { usePaymentStore } from '@/store/usePaymentStore'

// ─── Page: AddFundsPage ───────────────────────────────────────────────────────
function AddFundsPage() {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'momo' | 'vnpay'>('momo')
  const [desc, setDesc] = useState('')

  // STATE MỚI: Bật tắt modal điều khoản nạp tiền
  const [showTermsModal, setShowTermsModal] = useState(false)

  const { loading, error, createMoMoPayment, createVNPayPayment, clearError } = usePaymentStore()

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleDeposit = async () => {
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount < 100000) return

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Card */}
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden flex flex-col lg:flex-row">
            {/* CỘT TRÁI: Nhập liệu */}
            <div className="w-full lg:w-3/5 p-8 md:p-9 flex flex-col justify-center">
              {/* Header section */}
              <div className="flex items-start gap-5 mb-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                  <DollarSign size={26} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    Nạp tiền vào ví
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm md:text-base font-medium">
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
                      presets={[100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000]}
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
                    placeholder="Ví dụ: Nạp tiền vào tài khoản ví cá nhân..."
                    rows={3}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50/50 focus:border-emerald-300 focus:bg-white transition-all duration-200 resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: Thanh toán & Xác nhận */}
            <div className="w-full lg:w-2/5 bg-slate-50/80 p-8 md:p-9 lg:border-l border-slate-100/80 flex flex-col justify-between">
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
                        {method === m.key && <CheckCircle2Icon size={14} className="text-white" strokeWidth={3} />}
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
                  disabled={loading || !amount || parseFloat(amount) < 100000 || parseFloat(amount) > 10000000}
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
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Điều khoản
                  </button>{' '}
                  của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL ĐIỀU KHOẢN NẠP TIỀN ─── */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] sm:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            {/* Header Modal */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-[14px] flex items-center justify-center border border-emerald-100">
                  <ShieldAlert className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-slate-900">Điều khoản nạp tiền</h2>
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
            <div className="p-6 sm:p-8 bg-emerald-50/30">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-700 font-medium leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>
                    Số tiền nạp tối thiểu là <strong className="text-emerald-700">100.000 ₫</strong> và tối đa là{' '}
                    <strong className="text-emerald-700">10.000.000 ₫</strong> cho mỗi giao dịch.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 font-medium leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>
                    FreeWork <strong className="text-emerald-700">không thu phí</strong> giao dịch nạp tiền. Số dư trong
                    ví được dùng để thanh toán Escrow an toàn cho Freelancer.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700 font-medium leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>
                    Giao dịch thường được xử lý tức thì. Nếu sau 15 phút số dư chưa cập nhật, vui lòng liên hệ CSKH với
                    mã tham chiếu thanh toán để được hỗ trợ.
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
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

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
