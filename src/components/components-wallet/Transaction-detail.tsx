import { useEffect, useRef } from 'react'
import CopyToast from './Copytoast'
import { useCopyToast } from '@/utils/copy'
import {
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCcw,
  ShieldCheck,
  Landmark,
  Banknote,
  Copy,
  Wallet2
} from 'lucide-react'
import type { Transaction } from '@/types/wallet'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(Math.abs(amount)) + ' ₫'

const formatDatetime = (iso: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full',
    timeStyle: 'medium'
  }).format(new Date(iso))

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<
  Transaction['status'],
  { label: string; icon: React.ReactNode; color: string; bg: string; ring: string }
> = {
  completed: {
    label: 'Thành công',
    icon: <CheckCircle2 size={20} />,
    color: 'text-emerald-700',
    bg: 'bg-emerald-300',
    ring: 'ring-emerald-300'
  },
  pending: {
    label: 'Đang xử lý',
    icon: <Clock size={16} />,
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    ring: 'ring-slate-200'
  },
  failed: {
    label: 'Thất bại',
    icon: <XCircle size={16} />,
    color: 'text-white',
    bg: 'bg-red-600',
    ring: 'ring-red-600'
  },
  cancelled: {
    label: 'Đã huỷ',
    icon: <Ban size={16} />,
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    ring: 'ring-slate-200'
  }
}

const headerGradient = {
  completed: 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500',
  pending: 'bg-gradient-to-br from-slate-500 via-slate-400 to-slate-500',
  failed: 'bg-gradient-to-br from-red-600 via-red-500 to-rose-500',
  cancelled: 'bg-gradient-to-br from-slate-500 via-slate-400 to-slate-500'
}

// ─── Type config ──────────────────────────────────────────────────────────────

const typeConfig: Record<Transaction['type'], { label: string; icon: React.ReactNode; amountColor: string }> = {
  deposit: {
    label: 'Nạp tiền',
    icon: <ArrowDownLeft size={20} />,
    amountColor: 'text-emerald-600'
  },
  withdraw: {
    label: 'Rút tiền',
    icon: <ArrowUpRight size={20} />,
    amountColor: 'text-red-500'
  },
  refund: {
    label: 'Hoàn tiền',
    icon: <RefreshCcw size={20} />,
    amountColor: 'text-blue-600'
  },
  escrow_release: {
    label: 'Giải phóng ký quỹ',
    icon: <ShieldCheck size={20} />,
    amountColor: 'text-emerald-600'
  },
  escrow_deposit: {
    label: 'Ký quỹ',
    icon: <ShieldCheck size={20} />,
    amountColor: 'text-slate-600'
  },
  admin_fee: {
    label: 'Phí dịch vụ',
    icon: <Landmark size={20} />,
    amountColor: 'text-red-500'
  }
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  mono = false,
  copyable = false,
  onCopy
}: {
  label: string
  value: string
  mono?: boolean
  copyable?: boolean
  onCopy?: () => void
}) {
  const copy = () => {
    navigator.clipboard.writeText(value).catch(() => {})
    onCopy?.()
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-[15px] font-semibold text-slate-400 shrink-0 pt-0.5">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={`text-[15px] text-right break-all ${mono ? 'font-mono text-xs text-slate-600' : 'font-medium text-slate-700'}`}
        >
          {value}
        </span>
        {copyable && (
          <button
            onClick={copy}
            className="shrink-0 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Sao chép"
          >
            <Copy size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface TransactionDetailModalProps {
  transaction: Transaction | null
  onClose: () => void
}

export default function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { visible, trigger } = useCopyToast()

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (!transaction) return null

  const status = statusConfig[transaction.status] ?? statusConfig.cancelled
  const type = typeConfig[transaction.type] ?? {
    label: transaction.type,
    icon: <Banknote size={20} />,
    amountColor: 'text-slate-600'
  }

  const isPositive = transaction.amount > 0
  const amountDisplay = isPositive
    ? `+${formatCurrency(transaction.amount)}`
    : transaction.amount < 0
      ? `-${formatCurrency(transaction.amount)}`
      : formatCurrency(0)

  const txId = transaction.payment_order_id || transaction._id.slice(-12).toUpperCase()

  return (
    /* Overlay */
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      style={{ animation: 'fadeIn 0.18s ease' }}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* ── Header strip ── */}
        <div className={`relative ${headerGradient[transaction.status]} px-6 pt-8 pb-10`}>
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={16} />
          </button>

          {/* Type icon */}
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-4">
            {type.icon}
          </div>

          <p className="text-white/70 text-sm font-medium mb-1">{type.label}</p>

          {/* Amount */}
          <p className={`text-3xl font-black tracking-tight text-white mb-3`}>{amountDisplay}</p>

          {/* Status badge */}
          <span
            className={`inline-flex items-center font-semibold gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ring-1 ${status.color} ${status.bg} ${status.ring}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        {/* ── Decorative notch ── */}
        <div className="relative -mt-px flex">
          <div className="w-6 h-6 bg-slate-50 rounded-br-full" />
          <div className={`flex-1 ${headerGradient[transaction.status]} h-6`} />
          <div className="flex-1 flex gap-1.5 items-center justify-center" style={{ marginTop: '-6px' }} />
          <div className={`flex-1 ${headerGradient[transaction.status]} h-6`} />
          <div className="w-6 h-6 bg-slate-50 rounded-bl-full" />
        </div>

        {/* Dashed separator */}
        <div className="mx-6 border-t-2 border-dashed border-slate-100 -mt-3 mb-1" />

        {/* ── Body ── */}
        <div className="px-6 pt-2 pb-6 space-y-1">
          {/* Transaction info */}
          <div className="bg-slate-50 rounded-2xl px-4 py-1 mb-3">
            <InfoRow label="Mã giao dịch" value={txId} mono copyable onCopy={trigger} />
            {transaction._id && <InfoRow label="ID hệ thống" value={transaction._id} mono copyable onCopy={trigger} />}
            <InfoRow label="Thời gian" value={formatDatetime(transaction.createdAt)} />
            <InfoRow label="Phương thức" value={transaction.method_payment || 'Không xác định'} />
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="bg-slate-50 rounded-2xl px-4 py-3 mb-3">
              <p className="text-[15px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Mô tả</p>
              <p className="text-[14px] text-slate-700 leading-relaxed mt-3">{transaction.description}</p>
            </div>
          )}

          {/* Method detail */}
          <div className="bg-slate-50 rounded-2xl px-4 py-3 mb-3">
            <p className="text-[15px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Đơn vị thực hiện</p>
            <div className="gap-2 flex items-center border border-slate-200 rounded-lg w-fit">
              {/* Logo */}
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                {transaction.method_payment === 'momo' ? (
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-300x300.png"
                    alt={transaction.method_payment}
                    className="w-8 h-8 object-contain"
                  />
                ) : transaction.method_payment === 'vnpay' ? (
                  <img
                    src="https://i.pinimg.com/736x/f9/5e/a2/f95ea23c297af3170d9d75173bed9d7e.jpg"
                    alt={transaction.method_payment}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Wallet2 size={24} />
                )}
              </div>

              {/* Name */}
              <span className="text-[15px] font-semibold text-slate-800 mr-3">{transaction.method_payment}</span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-8 pb-8">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-2xl ${headerGradient[transaction.status]} hover:opacity-80 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-indigo-200`}
          >
            Đóng
          </button>
        </div>
      </div>
      <CopyToast visible={visible} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}
