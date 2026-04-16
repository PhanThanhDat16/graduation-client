import { useState, useEffect } from 'react'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Clock,
  Plus,
  Download,
  Search,
  Filter,
  Building2,
  CheckCircle2,
  X,
  QrCode,
  Smartphone,
  ChevronLeft,
  Loader2
} from 'lucide-react'

// --- MOCK DATA ---
const WALLET_DATA = {
  available_balance: 2500000,
  escrow_balance: 15000000,
  total_earned: 45500000,
  bank_linked: {
    bank_name: 'Vietcombank',
    account_no: '**** **** 8899',
    holder_name: 'NGUYEN TAN SANG'
  }
}

const TRANSACTIONS = [
  {
    id: 'tx1',
    type: 'earning',
    title: 'Thanh toán HĐ: Website E-commerce',
    date: '14/04/2026 09:15',
    amount: 12000000,
    status: 'completed',
    ref: 'HD-2026-882'
  },
  {
    id: 'tx2',
    type: 'escrow_hold',
    title: 'Tạm giữ Escrow: App React Native',
    date: '12/04/2026 14:30',
    amount: -15000000,
    status: 'completed',
    ref: 'ESC-2026-901'
  },
  {
    id: 'tx3',
    type: 'withdrawal',
    title: 'Rút tiền về Vietcombank (**** 8899)',
    date: '10/04/2026 08:00',
    amount: -5000000,
    status: 'pending',
    ref: 'WD-2026-005'
  },
  {
    id: 'tx4',
    type: 'deposit',
    title: 'Nạp tiền qua VNPay',
    date: '05/04/2026 10:20',
    amount: 20000000,
    status: 'completed',
    ref: 'DEP-2026-112'
  },
  {
    id: 'tx5',
    type: 'refund',
    title: 'Hoàn tiền Escrow: Hủy hợp đồng SEO',
    date: '01/04/2026 16:45',
    amount: 5000000,
    status: 'completed',
    ref: 'REF-2026-099'
  }
]

export default function WalletPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  // --- STATE CHO MODALS ---
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

  // State Nạp tiền
  const [depositStep, setDepositStep] = useState(1) // 1: Nhập tiền & Chọn cổng, 2: Quét QR
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'momo'>('vnpay')
  const [timeLeft, setTimeLeft] = useState(600) // 10 phút đếm ngược cho QR
  const [orderCode, setOrderCode] = useState('')

  const formatMoney = (amount: number) => {
    const isNegative = amount < 0
    const formatted = Math.abs(amount).toLocaleString('vi-VN')
    return isNegative ? `-${formatted}` : `+${formatted}`
  }

  const getTxConfig = (type: string, status: string) => {
    if (status === 'pending')
      return {
        icon: Clock,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        sign: 'text-amber-600'
      }
    switch (type) {
      case 'earning':
      case 'deposit':
      case 'refund':
        return {
          icon: ArrowDownLeft,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          sign: 'text-emerald-600'
        }
      case 'withdrawal':
        return {
          icon: ArrowUpRight,
          color: 'text-slate-700',
          bg: 'bg-slate-100',
          border: 'border-slate-200',
          sign: 'text-slate-900'
        }
      case 'escrow_hold':
        return {
          icon: ShieldCheck,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
          border: 'border-indigo-100',
          sign: 'text-slate-900'
        }
      default:
        return {
          icon: Wallet,
          color: 'text-slate-500',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          sign: 'text-slate-900'
        }
    }
  }

  // Đếm ngược QR
  useEffect(() => {
    if (depositStep === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [depositStep, timeLeft])

  const closeDepositModal = () => {
    setIsDepositOpen(false)
    setTimeout(() => {
      setDepositStep(1)
      setAmount('')
      setTimeLeft(600)
    }, 300) // Reset sau khi đóng animation
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300 relative">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-2xl text-slate-900 mb-1">Ví Escrow & Thanh toán</h1>
        <p className="text-sm text-slate-500">Quản lý số dư, nạp/rút tiền và theo dõi lịch sử giao dịch an toàn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* THẺ VÍ (2 CỘT) */}
        <div className="lg:col-span-2 relative bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute -top-24 -right-10 opacity-10 pointer-events-none">
            <ShieldCheck className="w-64 h-64" />
          </div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-indigo-200 font-medium text-sm mb-1 uppercase tracking-wider">Số dư khả dụng</p>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  {WALLET_DATA.available_balance.toLocaleString('vi-VN')}
                </h2>
                <span className="text-xl sm:text-2xl font-bold text-indigo-300 mb-1">₫</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 mt-8 pt-5 border-t border-white/20">
            <div>
              <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">Đang tạm giữ (Escrow)</p>
              <p className="font-bold text-lg flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />{' '}
                {WALLET_DATA.escrow_balance.toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <div>
              <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">Tổng thu nhập</p>
              <p className="font-bold text-lg">{WALLET_DATA.total_earned.toLocaleString('vi-VN')} ₫</p>
            </div>
          </div>
        </div>

        {/* HÀNH ĐỘNG (1 CỘT) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" /> Ngân hàng liên kết
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-900 text-sm">{WALLET_DATA.bank_linked.bank_name}</span>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                Đã xác minh
              </span>
            </div>
            <p className="text-slate-500 font-mono text-sm tracking-widest">{WALLET_DATA.bank_linked.account_no}</p>
            <p className="text-slate-500 text-xs mt-1">{WALLET_DATA.bank_linked.holder_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsDepositOpen(true)}
              className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Nạp tiền
            </button>
            <button
              onClick={() => setIsWithdrawOpen(true)}
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-colors text-sm"
            >
              <Download className="w-4 h-4" /> Rút tiền
            </button>
          </div>
        </div>
      </div>

      {/* LỊCH SỬ GIAO DỊCH (Giữ nguyên) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-lg text-slate-900">Lịch sử giao dịch</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã GD..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>
            <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex px-2 pt-2 border-b border-slate-100 overflow-x-auto hide-scrollbar bg-slate-50/50">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeFilter === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter('in')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeFilter === 'in' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            Tiền vào
          </button>
          <button
            onClick={() => setActiveFilter('out')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeFilter === 'out' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            Tiền ra
          </button>
          <button
            onClick={() => setActiveFilter('escrow')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeFilter === 'escrow' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            Tạm giữ Escrow
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {TRANSACTIONS.filter(
            (tx) =>
              activeFilter === 'all' ||
              (activeFilter === 'in' && (tx.type === 'earning' || tx.type === 'deposit' || tx.type === 'refund')) ||
              (activeFilter === 'out' && tx.type === 'withdrawal') ||
              (activeFilter === 'escrow' && tx.type === 'escrow_hold')
          ).map((tx) => {
            const config = getTxConfig(tx.type, tx.status)
            const Icon = config.icon
            return (
              <div
                key={tx.id}
                className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${config.bg} ${config.color} ${config.border}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <span>{tx.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="uppercase tracking-wider">{tx.ref}</span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pl-14 sm:pl-0">
                  <div className={`font-extrabold text-base mb-1 ${config.sign}`}>{formatMoney(tx.amount)} ₫</div>
                  {tx.status === 'completed' && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> Thành công
                    </div>
                  )}
                  {tx.status === 'pending' && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      <Clock className="w-3 h-3" /> Đang xử lý
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: RÚT TIỀN (WITHDRAWAL)
      ===================================================================== */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-900">Rút tiền về Ngân hàng</h2>
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="p-2 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Chuyển tiền đến</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{WALLET_DATA.bank_linked.bank_name}</p>
                    <p className="text-sm text-slate-500 font-mono tracking-widest">
                      {WALLET_DATA.bank_linked.account_no}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-slate-700">Số tiền cần rút (VND)</label>
                  <span className="text-xs text-slate-500">
                    Tối đa:{' '}
                    <span className="font-bold text-indigo-600">
                      {WALLET_DATA.available_balance.toLocaleString('vi-VN')} ₫
                    </span>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">VND</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2 mb-6">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Lệnh rút tiền sẽ được xử lý trong vòng 2-4 tiếng làm việc. Phí giao dịch:{' '}
                  <strong className="text-emerald-600">Miễn phí</strong>.
                </p>
              </div>

              <button className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors">
                Xác nhận Rút tiền
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: NẠP TIỀN (DEPOSIT) - CÓ TÍCH HỢP QR MOMO/VNPAY
      ===================================================================== */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                {depositStep === 2 && (
                  <button
                    onClick={() => setDepositStep(1)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="font-bold text-lg text-slate-900">
                  {depositStep === 1 ? 'Nạp tiền vào Ví' : 'Thanh toán QR'}
                </h2>
              </div>
              <button
                onClick={closeDepositModal}
                className="p-2 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung thay đổi theo Step */}
            <div className="p-6 overflow-y-auto">
              {/* BƯỚC 1: NHẬP SỐ TIỀN & CHỌN CỔNG */}
              {depositStep === 1 && (
                <div className="animate-in slide-in-from-left-4 duration-300">
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nhập số tiền (VND)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Tối thiểu 50.000đ"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                    />
                    <div className="flex gap-2 mt-3">
                      {['500000', '1000000', '5000000'].map((val) => (
                        <button
                          key={val}
                          onClick={() => setAmount(val)}
                          className="flex-1 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          {Number(val).toLocaleString('vi-VN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3">Phương thức thanh toán</label>
                    <div className="space-y-3">
                      {/* Lựa chọn VNPay */}
                      <label
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="vnpay"
                          checked={paymentMethod === 'vnpay'}
                          onChange={() => setPaymentMethod('vnpay')}
                          className="hidden"
                        />
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mr-4">
                          <QrCode className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">VNPAY-QR</p>
                          <p className="text-xs text-slate-500">Quét mã qua ứng dụng Ngân hàng</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'vnpay' ? 'border-blue-500' : 'border-slate-300'}`}
                        >
                          {paymentMethod === 'vnpay' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                        </div>
                      </label>

                      {/* Lựa chọn Momo */}
                      <label
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-pink-500 bg-pink-50/30 ring-1 ring-pink-500' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="momo"
                          checked={paymentMethod === 'momo'}
                          onChange={() => setPaymentMethod('momo')}
                          className="hidden"
                        />
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center shrink-0 mr-4">
                          <Smartphone className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">Ví MoMo</p>
                          <p className="text-xs text-slate-500">Thanh toán siêu tốc qua app MoMo</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'momo' ? 'border-pink-500' : 'border-slate-300'}`}
                        >
                          {paymentMethod === 'momo' && <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>}
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Khi bấm tiếp tục, random mã 1 lần và lưu vào State
                      setOrderCode(`DEP-${Math.floor(100000 + Math.random() * 900000)}`)
                      setDepositStep(2)
                    }}
                    disabled={!amount || Number(amount) < 50000}
                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tiếp tục thanh toán
                  </button>
                </div>
              )}

              {/* BƯỚC 2: HIỂN THỊ MÃ QR */}
              {depositStep === 2 && (
                <div className="animate-in slide-in-from-right-4 duration-300 text-center">
                  {/* Branding Header Momo/VNPay */}
                  <div className="mb-6">
                    {paymentMethod === 'vnpay' ? (
                      <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-extrabold text-lg rounded-lg border border-blue-100 tracking-wider">
                        VNPAY<span className="text-red-500">QR</span>
                      </div>
                    ) : (
                      <div className="inline-block px-4 py-1.5 bg-pink-50 text-pink-600 font-extrabold text-lg rounded-lg border border-pink-100 tracking-wider">
                        MoMo
                      </div>
                    )}
                    <p className="text-sm text-slate-500 mt-2 font-medium">Mở ứng dụng và quét mã để thanh toán</p>
                  </div>

                  {/* QR Code Container */}
                  <div
                    className={`relative mx-auto w-56 h-56 rounded-2xl border-2 flex items-center justify-center mb-6 p-2 ${paymentMethod === 'momo' ? 'border-pink-500/30 bg-pink-50/10' : 'border-blue-500/30 bg-blue-50/10'}`}
                  >
                    {/* Dùng API tạo QR mock để nhìn thật hơn */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MockPaymentForFreelanceVN-${amount}`}
                      alt="QR Code"
                      className="w-full h-full object-contain rounded-xl mix-blend-multiply"
                    />

                    {/* Icon đè ở giữa QR */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-1.5 rounded-lg shadow-md border border-slate-100">
                        {paymentMethod === 'momo' ? (
                          <Smartphone className="w-6 h-6 text-pink-600" />
                        ) : (
                          <QrCode className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Thông tin đơn hàng */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left border border-slate-100">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200 border-dashed">
                      <span className="text-sm text-slate-500">Số tiền:</span>
                      <span className="text-xl font-extrabold text-indigo-600">
                        {Number(amount).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-500">Mã đơn hàng:</span>
                      <span className="text-sm font-bold text-slate-900 uppercase">{orderCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Giao dịch cho:</span>
                      <span className="text-sm font-bold text-slate-900">FreelanceVN Wallet</span>
                    </div>
                  </div>

                  {/* Countdown & Loading */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang chờ thanh toán...
                    </div>
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1">
                      Mã QR sẽ hết hạn sau:
                      <span className={`text-sm ${timeLeft < 60 ? 'text-red-500' : 'text-slate-900'}`}>
                        {Math.floor(timeLeft / 60)
                          .toString()
                          .padStart(2, '0')}
                        :{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
