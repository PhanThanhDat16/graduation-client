import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, DollarSign, FileText, Mail, MessageSquare } from 'lucide-react'
import { formatBudget } from '@/utils/fomatters'
import type { Application } from '@/types/application'

// Helper UI nội bộ của Card
const getStatusUI = (status: string) => {
  switch (status) {
    case 'accepted':
      return { label: 'Đã trúng thầu', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'rejected':
      return { label: 'Đã từ chối', class: 'bg-red-50 text-red-600 border-red-200' }
    case 'pending':
    default:
      return { label: 'Chưa xử lý', class: 'bg-amber-50 text-amber-700 border-amber-200' }
  }
}

interface ApplicationCardProps {
  app: Application
  processingId: string | null
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected') => void
}

export default function ApplicationCard({ app, processingId, onUpdateStatus }: ApplicationCardProps) {
  const statusUI = getStatusUI(app.status)
  const isRejected = app.status === 'rejected'
  const isAccepted = app.status === 'accepted'
  const isProcessing = processingId === app._id

  // Xử lý dữ liệu an toàn
  const fData = app.freelancerId as any
  const fId = typeof fData === 'string' ? fData : fData?._id || ''
  const fEmail = typeof fData === 'object' && fData?.email ? fData.email : ''
  const fNameRaw =
    typeof fData === 'object' && fData?.fullName ? fData.fullName : fEmail ? fEmail.split('@')[0] : 'Ứng viên ẩn danh'
  const fName = fNameRaw.charAt(0).toUpperCase() + fNameRaw.slice(1)
  const fAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fName)}&background=4F46E5&color=fff&size=128`

  return (
    <div
      className={`relative bg-white border rounded-2xl p-6 sm:p-8 shadow-sm transition-all ${isRejected ? 'border-slate-200 opacity-75' : isAccepted ? 'border-emerald-200 shadow-emerald-100' : 'border-slate-200 hover:shadow-md'}`}
    >
      {isProcessing && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* HEADER: INFO FREELANCER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
        <div className="flex items-start gap-4">
          <img
            src={fAvatar}
            alt={fName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-slate-100 shrink-0"
          />
          <div>
            <Link
              to={`/freelancers/${fId}`}
              className="font-extrabold text-lg sm:text-xl text-slate-900 hover:text-indigo-600 transition-colors"
            >
              {fName}
            </Link>
            <p className="text-sm font-medium text-slate-500 mt-0.5 mb-2">Freelancer</p>
            {fEmail && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 w-fit">
                <Mail className="w-3.5 h-3.5" /> {fEmail}
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${statusUI.class}`}
          >
            {statusUI.label}
          </span>
          <span className="text-xs text-slate-400 font-medium sm:mt-2">
            Nộp: {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>

      {/* BODY: BÁO GIÁ */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6">
        <div className="mb-4 pb-4 border-b border-slate-200/60">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mức giá đề xuất</p>
          <p className="text-xl font-extrabold text-emerald-600 flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            {formatBudget(app.proposedBudget)} <span className="text-sm">₫</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Thư chào giá
          </p>
          <p className="text-[15px] text-slate-700 leading-relaxed italic whitespace-pre-line">"{app.proposal}"</p>
        </div>
      </div>

      {/* FOOTER: HÀNH ĐỘNG */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        {isRejected ? (
          <span className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-500 text-sm font-bold rounded-xl">
            <XCircle className="w-4 h-4" /> Đã từ chối ứng viên này
          </span>
        ) : isAccepted ? (
          <span className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-6 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-xl">
            <CheckCircle2 className="w-5 h-5" /> Đã chốt ứng viên này
          </span>
        ) : (
          <>
            <button
              onClick={() => onUpdateStatus(app._id, 'rejected')}
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 border-2 border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Từ chối
            </button>
            <button
              onClick={() => (window.location.href = `mailto:${fEmail}`)}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Liên hệ
            </button>
            <button
              onClick={() => onUpdateStatus(app._id, 'accepted')}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-2.5 bg-slate-900 text-white text-sm font-extrabold rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> Duyệt báo giá
            </button>
          </>
        )}
      </div>
    </div>
  )
}
