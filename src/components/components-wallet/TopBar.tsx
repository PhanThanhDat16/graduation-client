// ─── Reusable: TopBar ─────────────────────────────────────────────────────────
function TopBar({ crumbs }: { crumbs?: string[] }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        {crumbs?.map((c, i) => (
          <span key={c} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            <span
              className={
                i === crumbs.length - 1
                  ? 'text-indigo-600 font-semibold text-[16px]'
                  : 'text-[16px] text-slate-600 cursor-pointer'
              }
            >
              {c}
            </span>
          </span>
        ))}
      </div>
    </header>
  )
}

export default TopBar
