import { ChevronDown, ArrowDownWideNarrow } from 'lucide-react'

export interface SortOption {
  label: string
  value: string
}

interface SortDropdownProps {
  options: SortOption[]
  value: string
  onChange: (value: string) => void
}

export default function SortDropdown({ options, value, onChange }: SortDropdownProps) {
  return (
    <div className="relative inline-flex items-center w-full sm:w-auto group">
      {/* Icon trang trí bên trái */}
      <div className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors group-hover:text-indigo-500">
        <ArrowDownWideNarrow className="w-4 h-4" />
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-auto appearance-none bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-slate-700 outline-none cursor-pointer transition-all hover:border-indigo-300 hover:bg-slate-50 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="font-medium text-slate-700 py-1">
            {o.label}
          </option>
        ))}
      </select>

      {/* Mũi tên thả xuống bên phải */}
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none transition-colors group-hover:text-indigo-500" />
    </div>
  )
}