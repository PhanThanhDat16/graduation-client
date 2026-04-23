import { Link } from 'react-router-dom'
import { X, FileText, ArrowUpRight, ExternalLink, Trash2 } from 'lucide-react'
import { formatBudget } from '@/utils/fomatters'
import type { Application } from '@/types/application'
import { getStatus } from '../../constants'

interface ApplicationModalProps {
  app: Application | null
  deletingId: string | null
  onClose: () => void
  onDelete: (id: string) => void
}

export default function ApplicationModal({ app, deletingId, onClose, onDelete }: ApplicationModalProps) {
  if (!app) return null

  const sc = getStatus(app.status)
  const pd = app.projectId as any
  const projectTitle = typeof pd === 'object' ? pd?.title : 'Dự án (Đang cập nhật)'
  const projectId = typeof pd === 'string' ? pd : pd?._id || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Thanh màu trạng thái trên cùng */}
        <div className={`h-1.5 w-full shrink-0 ${sc.bar}`} />

        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" /> Chi tiết Báo giá
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal (Cuộn được) */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Thông tin nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Giá đề xuất</p>
              <div className="text-2xl font-extrabold text-emerald-600 flex items-baseline gap-1">
                {formatBudget(app.proposedBudget)} <span className="text-sm font-bold text-emerald-600">₫</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Trạng thái</p>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold w-fit ${sc.badge}`}
              >
                <sc.icon className="w-4 h-4" /> {sc.label}
              </span>
            </div>
          </div>

          {/* Thông tin dự án */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Dự án ứng tuyển</p>
            <Link
              to={`/projects/${projectId}`}
              className="text-[15px] font-semibold text-slate-900 hover:text-blue-600 transition-colors flex items-start gap-1.5 group"
            >
              <span className="leading-snug">{projectTitle}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Nội dung thư */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nội dung thư chào giá</p>
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {app.proposal}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex flex-col sm:flex-row items-center justify-end gap-3 bg-slate-50">
          {app.status === 'pending' && (
            <button
              onClick={() => onDelete(app._id)}
              disabled={deletingId === app._id}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Rút báo giá
            </button>
          )}
          <Link
            to={`/projects/${projectId}`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
          >
            Xem dự án <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
