import { CheckCircle2, XCircle, Clock } from 'lucide-react'

export const STATUS_CONFIG = {
  accepted: {
    label: 'Trúng thầu',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    glow: 'hover:shadow-emerald-100',
    bar: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
    dot: 'bg-emerald-500',
    pulse: false,
    icon: CheckCircle2
  },
  rejected: {
    label: 'Từ chối',
    badge: 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/20',
    glow: 'hover:shadow-red-100',
    bar: 'bg-gradient-to-r from-red-400 to-red-500',
    dot: 'bg-red-500',
    pulse: false,
    icon: XCircle
  },
  pending: {
    label: 'Đang chờ',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    glow: 'hover:shadow-amber-100',
    bar: 'bg-gradient-to-r from-amber-400 to-amber-500',
    dot: 'bg-amber-500',
    pulse: true,
    icon: Clock
  }
} as const

export const getStatus = (s: string) => STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending
