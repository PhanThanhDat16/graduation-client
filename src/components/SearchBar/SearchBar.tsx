import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  onSearch: () => void
  onClear: () => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, onSearch, onClear, placeholder = 'Tìm kiếm...' }: SearchBarProps) {
  return (
    <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-slate-200/20 flex items-center gap-2 border-2 border-transparent focus-within:border-blue-400 transition-colors">
      <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-base text-slate-700 py-2 sm:py-3 px-2 placeholder:text-slate-400 font-medium"
      />
      {value && (
        <button onClick={onClear} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={onSearch}
        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-8 py-3.5 rounded-xl text-sm font-bold hidden sm:block shrink-0 shadow-md hover:shadow-blue-500/30 active:scale-95"
      >
        Tìm kiếm
      </button>
    </div>
  )
}
