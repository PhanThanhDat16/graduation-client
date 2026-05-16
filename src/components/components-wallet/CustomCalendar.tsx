import { useState, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, CalendarDays } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DateRange {
  start: Date | null
  end: Date | null
}

interface CustomCalendarProps {
  selectedRange: DateRange
  onRangeChange: (range: DateRange) => void
  onClose: () => void
  /** Array of date strings (ISO) that have transactions */
  transactionDates?: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const WEEKDAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const MONTHS_VI = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12'
]

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isInRange(day: Date, range: DateRange) {
  if (!range.start || !range.end) return false
  const t = day.getTime()
  const s = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate()).getTime()
  const e = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate()).getTime()
  return t >= s && t <= e
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CustomCalendar({
  selectedRange,
  onRangeChange,
  onClose,
  transactionDates = []
}: CustomCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [selectingEnd, setSelectingEnd] = useState(false)

  // Set of dates that have transactions (YYYY-MM-DD strings)
  const txDateSet = useMemo(() => {
    const set = new Set<string>()
    transactionDates.forEach((d) => {
      const date = new Date(d)
      set.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
    })
    return set
  }, [transactionDates])

  const hasTx = useCallback(
    (day: Date) => txDateSet.has(`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`),
    [txDateSet]
  )

  // Navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else setViewMonth((m) => m + 1)
  }

  // Build calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1)

  const calendarDays = useMemo(() => {
    const days: { date: Date; isCurrentMonth: boolean }[] = []
    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, prevMonthDays - i)
      days.push({ date: d, isCurrentMonth: false })
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(viewYear, viewMonth, i), isCurrentMonth: true })
    }
    // Next month leading days
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(viewYear, viewMonth + 1, i), isCurrentMonth: false })
    }
    return days
  }, [viewYear, viewMonth, daysInMonth, firstDay, prevMonthDays])

  // Click handler: first click = start, second click = end
  const handleDayClick = (day: Date) => {
    if (!selectingEnd || !selectedRange.start) {
      // First click – set start
      onRangeChange({ start: day, end: null })
      setSelectingEnd(true)
    } else {
      // Second click – set end
      const start = selectedRange.start
      if (day.getTime() < start.getTime()) {
        onRangeChange({ start: day, end: start })
      } else {
        onRangeChange({ start, end: day })
      }
      setSelectingEnd(false)
    }
  }

  // Hover preview range
  const previewRange: DateRange = useMemo(() => {
    if (selectingEnd && selectedRange.start && hoverDate) {
      if (hoverDate.getTime() < selectedRange.start.getTime()) {
        return { start: hoverDate, end: selectedRange.start }
      }
      return { start: selectedRange.start, end: hoverDate }
    }
    return selectedRange
  }, [selectingEnd, selectedRange, hoverDate])

  const clearRange = () => {
    onRangeChange({ start: null, end: null })
    setSelectingEnd(false)
  }

  // Format label
  const formatDate = (d: Date | null) => {
    if (!d) return '—'
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div
      className="w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
      style={{
        animation: 'calendarSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Inline keyframes */}
      <style>{`
        @keyframes calendarSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 px-5 py-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-200" />
            <span className="text-sm font-semibold text-indigo-100">Lọc theo ngày</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Selected range display */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-center backdrop-blur-sm">
            <p className="text-indigo-200 text-[10px] uppercase tracking-wider mb-0.5">Từ ngày</p>
            <p className="font-bold text-white">{formatDate(selectedRange.start)}</p>
          </div>
          <div className="w-4 h-px bg-indigo-300/50" />
          <div className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-center backdrop-blur-sm">
            <p className="text-indigo-200 text-[10px] uppercase tracking-wider mb-0.5">Đến ngày</p>
            <p className="font-bold text-white">{formatDate(selectedRange.end)}</p>
          </div>
        </div>
      </div>

      {/* ── Month nav ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-bold text-slate-800 text-sm tracking-tight">
          {MONTHS_VI[viewMonth]} {viewYear}
        </h3>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-700"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Weekday headers ── */}
      <div className="grid grid-cols-7 px-4 pt-3">
        {WEEKDAYS_VI.map((wd) => (
          <div key={wd} className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* ── Days grid ── */}
      <div className="grid grid-cols-7 px-4 pb-3">
        {calendarDays.map(({ date, isCurrentMonth }, idx) => {
          const isToday = isSameDay(date, today)
          const isStart = selectedRange.start && isSameDay(date, selectedRange.start)
          const isEnd = selectedRange.end && isSameDay(date, selectedRange.end)
          const inRange = isInRange(date, previewRange)
          const inPreviewOnly = selectingEnd && !isInRange(date, selectedRange) && inRange
          const hasTransaction = hasTx(date)

          return (
            <div key={idx} className="relative flex items-center justify-center">
              {/* Range background bar */}
              {inRange && (
                <div
                  className={`absolute inset-y-0.5 inset-x-0 ${
                    inPreviewOnly ? 'bg-indigo-50' : 'bg-indigo-100/60'
                  } ${isStart ? 'rounded-l-lg' : ''} ${isEnd ? 'rounded-r-lg' : ''}`}
                />
              )}

              <button
                onClick={() => handleDayClick(date)}
                onMouseEnter={() => setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
                className={`
                  relative z-10 w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150
                  ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
                  ${isToday && !isStart && !isEnd ? 'ring-2 ring-indigo-200 ring-inset font-bold text-indigo-600' : ''}
                  ${
                    isStart || isEnd
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                      : inRange
                        ? 'text-indigo-700 font-semibold'
                        : 'hover:bg-slate-100'
                  }
                `}
              >
                {date.getDate()}

                {/* Transaction indicator dot */}
                {hasTransaction && isCurrentMonth && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isStart || isEnd ? 'bg-white' : 'bg-emerald-500'
                    }`}
                  />
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Footer actions ── */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => {
            const t = new Date()
            setViewYear(t.getFullYear())
            setViewMonth(t.getMonth())
            handleDayClick(t)
            // Select only today
            onRangeChange({ start: t, end: t })
            setSelectingEnd(false)
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
        >
          Hôm nay
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={clearRange}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={onClose}
            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-1.5 rounded-lg shadow-sm"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  )
}
