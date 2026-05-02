import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, DollarSign, FileText, Mail, MessageSquare, PenTool, ExternalLink } from 'lucide-react'
import { formatBudget } from '@/utils/fomatters'
import type { Application } from '@/types/application'

const getStatusUI = (status: string) => {
  switch (status) {
    case 'accepted':
      return { label: 'Đã trúng thầu', class: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' }
    case 'rejected':
      return { label: 'Đã từ chối', class: 'bg-red-50 text-red-600 border-red-100' }
    case 'pending':
    default:
      return { label: 'Chưa xử lý', class: 'bg-amber-50 text-amber-700 border-amber-200' }
  }
}

interface ContractorAppCardProps {
  app: Application
  processingId: string | null
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected') => void
}

export default function ContractorAppCard({ app, processingId, onUpdateStatus }: ContractorAppCardProps) {
  const navigate = useNavigate()
  console.log(app)
  const statusUI = getStatusUI(app.status)
  const isRejected = app.status === 'rejected'
  const isAccepted = app.status === 'accepted'
  const isProcessing = processingId === app._id

  // BÓC TÁCH DỮ LIỆU FREELANCER
  const fData = app.freelancerId as any
  const fId = typeof fData === 'string' ? fData : fData?._id || ''
  const fEmail = typeof fData === 'object' && fData?.email ? fData.email : ''
  const fNameRaw =
    typeof fData === 'object' && fData?.fullName ? fData.fullName : fEmail ? fEmail.split('@')[0] : 'Ứng viên ẩn danh'
  const fName = fNameRaw.charAt(0).toUpperCase() + fNameRaw.slice(1)
  const fAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fName)}&background=4F46E5&color=fff&size=128`

  return (
    <div
      className={`relative bg-white border rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
        isRejected
          ? 'border-slate-200 opacity-60 grayscale-[30%] bg-slate-50'
          : isAccepted
            ? 'border-emerald-300 shadow-[0_8px_30px_rgba(16,185,129,0.12)] ring-1 ring-emerald-50'
            : 'border-slate-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-indigo-200'
      }`}
    >
      {/* Lớp phủ loading khi đang call API */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* ── THÔNG TIN FREELANCER ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
        <div className="flex items-start gap-4 min-w-0">
          {' '}
          {/* min-w-0 chống tràn */}
          <img
            src={fAvatar}
            alt={fName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-slate-100 shrink-0 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            {' '}
            {/* Thêm flex-1 và min-w-0 */}
            <Link
              to={`/freelancers/${fId}`}
              className="font-extrabold text-lg sm:text-xl text-slate-900 hover:text-indigo-600 transition-colors truncate block"
              title={fName}
            >
              {fName}
            </Link>
            <p className="text-sm font-medium text-slate-500 mt-0.5 mb-2">Freelancer</p>
            {fEmail && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-md border border-slate-200/60 w-fit max-w-full">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{fEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
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

      {/* ── THÔNG TIN BÁO GIÁ ── */}
      <div
        className={`rounded-xl p-5 mb-6 border ${isAccepted ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50/50 border-slate-100'}`}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-4 pb-4 border-b border-slate-200/60">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mức giá đề xuất</p>
            <p className="text-xl font-extrabold text-emerald-600 flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              {formatBudget(app.proposedBudget)} <span className="text-sm">₫</span>
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Thư chào giá
          </p>
          {/* FIX TRÀN CHỮ NẰM Ở ĐÂY: break-words */}
          <div className="p-4 bg-white border border-slate-200/60 rounded-lg rounded-tl-none relative">
            <div className="absolute -top-3 left-0 w-3 h-3 bg-white border-t border-l border-slate-200/60"></div>
            <p className="text-[14px] text-slate-700 leading-relaxed italic whitespace-pre-line break-words">
              "{app.proposal}"
            </p>
          </div>
        </div>
      </div>

      {/* ── HÀNH ĐỘNG ── */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        {isRejected ? (
          <span className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-500 text-sm font-bold rounded-xl">
            <XCircle className="w-4 h-4" /> Đã từ chối ứng viên này
          </span>
        ) : isAccepted ? (
          // NÚT XEM HỢP ĐỒNG KHI ĐÃ TRÚNG THẦU
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <span className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" /> Trúng thầu
            </span>
            <button
              // Note: Nếu API báo giá của bạn có trả về contractId thì dùng app.contractId, không thì chuyển hướng về trang /contracts chung
              onClick={() => navigate((app as any).contractId ? `/contracts/${(app as any).contractId}` : '/contracts')}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white text-sm font-extrabold rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Xem Hợp Đồng <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => onUpdateStatus(app._id, 'rejected')}
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 text-slate-500 text-sm font-bold rounded-xl hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Từ chối
            </button>

            <button
              onClick={() => (window.location.href = `mailto:${fEmail}`)}
              className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Liên hệ
            </button>

            <button
              onClick={() => navigate(`/contracts/create/${app._id}`)}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
            >
              <PenTool className="w-4 h-4" /> Tạo Hợp Đồng
            </button>
          </>
        )}
      </div>
    </div>
  )
}
