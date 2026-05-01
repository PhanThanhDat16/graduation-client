import type { Transaction } from '@/types/wallet'

// ─── Reusable: StatusBadge ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Transaction['status'] }) {
  const map = {
    completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    failed: 'bg-red-100 text-red-600 border border-red-200'
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${map[status]}`}>{status}</span>
  )
}

export default StatusBadge
