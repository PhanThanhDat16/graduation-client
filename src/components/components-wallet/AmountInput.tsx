import { useMemo } from 'react'

const formatNumber = (value: string) => {
  const number = value.replace(/\D/g, '')
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parseNumber = (value: string) => {
  return value.replace(/\D/g, '')
}

export default function AmountInput({
  value,
  onChange,
  presets,
  purpose,
  color
}: {
  value: string
  onChange: (v: string) => void
  presets: number[]
  purpose: string
  color: string
}) {
  const formatted = useMemo(() => formatNumber(value), [value])
  const numericValue = useMemo(() => Number(parseNumber(value)), [value])

  return (
    <div>
      <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
        Số Tiền {purpose}
      </label>

      {/* INPUT */}
      <div className="relative mb-3 shadow-sm">
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-${color}-600 font-bold`}>₫</span>

        <input
          type="text"
          value={formatted}
          onChange={(e) => {
            const raw = parseNumber(e.target.value)
            onChange(raw)
          }}
          placeholder={`Nhập số tiền cần ${purpose}`}
          className={`w-full border-[1.5px] border-${color}-500 rounded-xl py-3.5 pl-8 pr-4 text-lg font-bold text-${color}-600 bg-slate-50 focus:ring-2 focus:ring-${color}-300`}
        />
      </div>
      {numericValue < 100000 && <p className="text-red-500 text-sm mt-1 mb-2 ">Số tiền tối thiểu là 100.000đ</p>}

      {/* PRESETS */}
      <div className="flex gap-2 flex-wrap">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange(String(p))}
            className={`px-4 py-1.5 rounded-lg border text-sm font-semibold transition-all 
              ${
                value === String(p)
                  ? `bg-${color}-600 border-${color}-600 text-white`
                  : `border-${color}-200 text-${color}-600 hover:bg-${color}-50`
              }`}
          >
            {p.toLocaleString()} ₫
          </button>
        ))}
      </div>
    </div>
  )
}
