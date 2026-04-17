// ─── Reusable: NavItem ────────────────────────────────────────────────────────
interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out ${
        active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  )
}

export default NavItem
