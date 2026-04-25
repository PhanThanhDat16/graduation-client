import { Link } from 'react-router-dom'
import { DollarSign, FileText, ExternalLink, Trash2 } from 'lucide-react'
import { formatBudget } from '@/utils/fomatters'
import type { Application } from '@/types/application'

import { getStatus } from '../../constants'

interface ApplicationCardProps {
  app: Application
  deletingId: string | null
  onDelete: (id: string) => void
  onViewDetail: (app: Application) => void
}

export default function ApplicationCard({ app, deletingId, onDelete, onViewDetail }: ApplicationCardProps) {
  const sc = getStatus(app.status)
  const pd = app.projectId as any
  const projectId = typeof pd === 'string' ? pd : pd?._id || ''
  const projectTitle = typeof pd === 'object' ? pd?.title : 'Dự án (Đang cập nhật)'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
      {deletingId === app._id && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        </div>
      )}

      {/* Vạch màu trạng thái BÊN TRÁI (như bản gốc của bạn) */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${sc.bar}`} />

      <div className="p-5 sm:p-6 pl-6 sm:pl-8">
        {/* HEADER CARD */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${sc.badge}`}
              >
                <sc.icon className="w-3.5 h-3.5" /> {sc.label}
              </span>
              <span className="text-xs font-medium text-slate-400">
                Gửi ngày: {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <Link to={`/projects/${projectId}`}>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                {projectTitle}
              </h3>
            </Link>
          </div>

          {/* Mức giá */}
          <div className="shrink-0 flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-base font-extrabold text-slate-900">{formatBudget(app.proposedBudget)} ₫</span>
          </div>
        </div>

        {/* PREVIEW THƯ CHÀO GIÁ */}
        <div className="text-sm text-slate-600 leading-relaxed line-clamp-2 italic mb-6">"{app.proposal}"</div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => onViewDetail(app)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors flex-1 sm:flex-none"
          >
            <FileText className="w-4 h-4" /> Chi tiết
          </button>

          <Link
            to={`/projects/${projectId}`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex-1 sm:flex-none"
          >
            Xem dự án <ExternalLink className="w-4 h-4" />
          </Link>

          {app.status === 'pending' && (
            <button
              onClick={() => onDelete(app._id)}
              disabled={deletingId === app._id}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 ml-auto"
              title="Rút báo giá"
            >
              <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Rút hồ sơ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
