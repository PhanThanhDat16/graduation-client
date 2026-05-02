import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, DollarSign, Image as ImageIcon, Flame, X } from 'lucide-react'
import ContractorInfo from '@/components/ContractorInfo/ContractorInfo'
import { formatBudget, isHot, timeAgo } from '@/utils/fomatters'
import type { Project } from '@/types/project'

const CURRENT_USER = { _id: 'user_me_123' }

interface ProjectCardProps {
  project: Project
  onToggleLike: (projectId: string) => void
}

export default function ProjectCard({ project, onToggleLike }: ProjectCardProps) {
  const isLiked = project.listLike?.includes(CURRENT_USER._id)
  const hot = isHot(project)
  const [isViewingImage, setIsViewingImage] = useState(false)
  console.log(project)

  const firstImage = project.images && project.images.length > 0 ? project.images[0] : null
  const extraImagesCount = project.images ? project.images.length - 1 : 0
  return (
    <>
      <div
        className={`bg-white rounded-2xl relative flex flex-col sm:flex-row overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${
          hot
            ? 'border border-orange-200 shadow-[0_4px_20px_rgba(249,115,22,0.08)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] ring-1 ring-orange-50'
            : 'border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-slate-300'
        }`}
      >
        {/* ── ĐƯỜNG LINE MỎNG Ở TRÊN CÙNG ── */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] z-20 transition-colors duration-500 ${
            hot ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-slate-200 group-hover:bg-indigo-500'
          }`}
        />

        {/* ── ĐƯỜNG LINE 2 BÊN SƯỜN ── */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-[1px] z-20 transition-all duration-500 ${
            hot
              ? 'bg-gradient-to-b from-orange-400 to-transparent'
              : 'bg-gradient-to-b from-transparent group-hover:from-indigo-500 to-transparent'
          }`}
        />
        <div
          className={`absolute top-0 bottom-0 right-0 w-[1px] z-20 transition-all duration-500 ${
            hot
              ? 'bg-gradient-to-b from-red-500 to-transparent'
              : 'bg-gradient-to-b from-transparent group-hover:from-indigo-500 to-transparent'
          }`}
        />

        {/* ── BÊN TRÁI: KHUNG ẢNH ── */}
        {firstImage && (
          <div
            onClick={() => setIsViewingImage(true)}
            className="relative w-full sm:w-[240px] md:w-[280px] shrink-0 h-52 sm:h-auto border-b sm:border-b-0 overflow-hidden block bg-slate-50 cursor-pointer"
            title="Bấm để xem ảnh phóng to"
          >
            <img
              src={firstImage}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Overlay gradient nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

            {/* ── BORDER PHẢI: gradient mờ dần xuống ── */}
            <div
              className="absolute top-0 right-0 bottom-0 w-[2px] hidden sm:block z-10"
              style={{
                background: hot
                  ? 'linear-gradient(to bottom, rgba(249,115,22,0.8), rgba(239,68,68,0.4) 55%, transparent)'
                  : 'linear-gradient(to bottom, rgba(148,163,184,0.6), rgba(148,163,184,0.2) 60%, transparent)'
              }}
            />

            {extraImagesCount > 0 && (
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md flex items-center gap-1.5 text-white px-2.5 py-1 rounded-lg border border-white/10 shadow-sm group-hover:bg-black/80 transition-colors">
                <ImageIcon size={14} className="opacity-80" />
                <span className="text-xs font-bold">+{extraImagesCount}</span>
              </div>
            )}
          </div>
        )}

        {/* ── BÊN PHẢI: TOÀN BỘ NỘI DUNG ── */}
        <div className="flex-1 min-w-0 flex flex-col p-5 sm:p-6 relative bg-gradient-to-br from-white to-slate-50/30">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-4 gap-4">
            <Link to={`/profile/${project.contractorId._id}`} className="hover:opacity-80 transition-opacity min-w-0">
              <ContractorInfo contractorId={project.contractorId} />
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              {hot && (
                <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-sm">
                  <Flame size={12} className="animate-pulse" /> Nổi bật
                </span>
              )}
              <button
                onClick={() => onToggleLike(project._id)}
                className={`p-2 rounded-full border transition-all duration-200 ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:bg-slate-50 hover:border-red-200 shadow-sm'
                }`}
                title={isLiked ? 'Bỏ lưu dự án' : 'Lưu dự án'}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current scale-110' : 'scale-100'} transition-transform`} />
              </button>
            </div>
          </div>

          {/* BODY */}
          <Link to={`/projects/${project._id}`} className="mb-3 block">
            <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
              {project.title}
            </h2>
          </Link>

          <div className="flex flex-wrap gap-2 mb-3">
            {project.skills?.slice(0, 4).map((skill: string) => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-indigo-50 border border-indigo-100/60 text-indigo-600 text-[11px] font-bold rounded-md"
              >
                {skill}
              </span>
            ))}
            {(project.skills?.length || 0) > 4 && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-md border border-slate-200/60">
                +{(project.skills?.length || 0) - 4}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 flex-grow mb-6 leading-relaxed">{project.description}</p>

          <div className="h-px bg-slate-100 my-1" />

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto pt-3">
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-1.5 items-center font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 text-sm">
                <DollarSign size={16} />
                {formatBudget(project.budgetMin)} {project.budgetMax ? `- ${formatBudget(project.budgetMax)}` : ''} ₫
              </div>
              <div className="flex gap-1.5 items-center text-xs text-slate-500 font-medium px-1">
                <Clock size={14} /> {timeAgo(project.createdAt)}
              </div>
            </div>
            <Link
              to={`/projects/${project._id}`}
              className="w-full sm:w-auto text-center px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 shrink-0"
            >
              Gửi Báo Giá
            </Link>
          </div>
        </div>
      </div>

      {/* ── MODAL XEM ẢNH FULL MÀN HÌNH ── */}
      {isViewingImage && firstImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center animate-in fade-in backdrop-blur-sm"
          onClick={() => setIsViewingImage(false)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
            onClick={() => setIsViewingImage(false)}
          >
            <X size={28} />
          </button>
          <img
            src={firstImage}
            alt={project.title}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
