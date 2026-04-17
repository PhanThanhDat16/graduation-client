// ─── Reusable: StatCard ───────────────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  )
}

export default StatCard
