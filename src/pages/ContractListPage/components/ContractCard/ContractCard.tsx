import { Link } from 'react-router-dom'
import { Calendar, FileSignature, ArrowRight, User } from 'lucide-react'
import type { Contract } from '@/types/contract'
import { formatBudget } from '@/utils/fomatters'

interface ContractCardProps {
  contract: Contract
  userRole: 'contractor' | 'freelancer'
}

const STATUS_MAP: Record<string, { label: string; dot: string; badge: string; bar: string }> = {
  draft: {
    label: 'Chờ chữ ký',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-400'
  },
  pendingAgreement: {
    label: 'Chờ chữ ký',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-400'
  },
  waitingPayment: {
    label: 'Chờ thanh toán',
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    bar: 'bg-blue-400'
  },
  running: {
    label: 'Đang thực hiện',
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    bar: 'bg-indigo-500'
  },
  submitted: {
    label: 'Chờ nghiệm thu',
    dot: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    bar: 'bg-purple-500'
  },
  completed: {
    label: 'Đã hoàn thành',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500'
  },
  cancelled: {
    label: 'Đã huỷ',
    dot: 'bg-red-400',
    badge: 'bg-red-50 text-red-600 border-red-200',
    bar: 'bg-red-400'
  }
}

const getStatus = (status: string) =>
  STATUS_MAP[status] ?? {
    label: 'Không xác định',
    dot: 'bg-slate-400',
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
    bar: 'bg-slate-300'
  }

export default function ContractCard({ contract, userRole }: ContractCardProps) {
  const isContractor = userRole === 'contractor'
  const partnerRole = isContractor ? 'Freelancer' : 'Khách hàng'

  const projectTitle = contract.projectId?.title || 'Hợp đồng Dịch vụ'
  const partnerName = isContractor
    ? contract.freelancerId?.fullName
    : contract.contractorId?.fullName || 'Chưa cập nhật'
  const status = getStatus(contract.status)

  return (
    <div className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 shadow-sm">
      {/* Top color bar */}
      <div className={`h-1 w-full ${status.bar}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Row 1: ID + Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
            #{contract._id.slice(-6).toUpperCase()}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${status.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Row 2: Title + Amount */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {projectTitle ? (
                projectTitle
              ) : (
                <span className="inline-block w-48 h-5 bg-slate-100 animate-pulse rounded-lg" />
              )}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Giá trị</p>
            <p className="text-lg font-black text-emerald-600 whitespace-nowrap">
              {formatBudget(contract.totalAmount)} ₫
            </p>
          </div>
        </div>

        {/* Row 3: Partner */}
        <div className="flex items-center gap-2.5 mb-5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{partnerRole}</p>
            {partnerName ? (
              <p className="text-sm font-bold text-slate-700 truncate">{partnerName}</p>
            ) : (
              <span className="inline-block w-28 h-4 bg-slate-200 animate-pulse rounded mt-0.5" />
            )}
          </div>
        </div>

        {/* Row 4: Dates */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2.5 text-sm bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Deadline</p>
              <p className="font-bold text-slate-700 text-xs">
                {new Date(contract.deadline).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
            <FileSignature className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ngày tạo</p>
              <p className="font-bold text-slate-700 text-xs">
                {new Date(contract.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        {/* Row 5: CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <Link
            to={`/contracts/${contract._id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-2xl transition-all duration-200 shadow-sm hover:shadow-indigo-500/25 hover:shadow-md active:scale-[0.98]"
          >
            Xem chi tiết
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
