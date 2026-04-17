import type { Transaction } from '@/types/wallet'

// ─── Reusable: TypeTag ────────────────────────────────────────────────────────
function TypeTag({ type }: { type: Transaction['type'] }) {
  return (
    <span className="bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1 rounded text-[13px] font-mono">
      {type}
    </span>
  )
}

export default TypeTag
