import { useEffect, useMemo, useState } from 'react'

interface Bank {
  id: number
  name: string
  code: string
  shortName: string
  logo: string
}

interface Props {
  value?: string
  onChange?: (value: string) => void
}

export default function BankDropdown({ value, onChange }: Props) {
  const [banks, setBanks] = useState<Bank[]>([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('https://api.vietqr.io/v2/banks')
      .then((res) => res.json())
      .then((data) => {
        setBanks(data.data)
      })
  }, [])

  const selected = useMemo(() => {
    if (!value || banks.length === 0) return undefined
    return banks.find((b) => b.shortName === value)
  }, [value, banks])

  const handleSelect = (bank: Bank) => {
    setOpen(false)
    onChange?.(bank.shortName)
  }

  const filteredBanks = banks.filter((b) => b.shortName.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="relative w-full max-w-md">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition"
      >
        {selected ? (
          <div className="flex items-center gap-3 justify-center">
            <img src={selected.logo} alt="logo" className="w-18 h-10" />
            <span className="font-medium">{selected.shortName}</span>
          </div>
        ) : (
          <span className="text-gray-400">Chọn ngân hàng</span>
        )}
        <span className="text-gray-500">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Tìm ngân hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredBanks.map((bank) => (
              <div
                key={bank.id}
                onClick={() => handleSelect(bank)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
              >
                <img src={bank.logo} alt="logo" className="w-18 h-10" />
                <span>{bank.shortName}</span>
              </div>
            ))}

            {filteredBanks.length === 0 && (
              <div className="p-4 text-center text-gray-400">Không tìm thấy ngân hàng</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
