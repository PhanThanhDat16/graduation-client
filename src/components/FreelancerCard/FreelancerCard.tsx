import { Link } from 'react-router-dom'
import { MapPin, Star, ShieldCheck, ExternalLink, CalendarDays } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/apis/userService'

interface FreelancerCardProps {
  freelancer: any
}

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const formatMoney = (amount: number) => (amount ? amount.toLocaleString('vi-VN') : '0')

  // --- GỌI API PROFILE CHO TỪNG CARD ---
  const { data: profileRes, isLoading: isProfileLoading } = useQuery({
    queryKey: ['freelancer-profile', freelancer._id],
    queryFn: () => userService.getUserById(freelancer._id),
    staleTime: 0
  })

  const profileData = profileRes?.data?.data || {}
  const fullData = { ...freelancer, ...profileData }

  // --- MAPPING DỮ LIỆU ---
  const fullName = fullData.fullName || 'Người dùng ẩn danh'
  const isVerified = fullData.isVerified ?? false
  const rating = fullData.ratingAvg ?? 5.0 // Dùng ?? để giữ giá trị 0 nếu có
  const reviews = fullData.ratingCount ?? 0
  const location = fullData.address || 'Việt Nam'

  const title = fullData.title || fullData.category || 'Freelancer'
  const desc = fullData.description || 'Chuyên gia này chưa cập nhật thông tin giới thiệu chi tiết trên hệ thống.'
  console.log(fullData)
  const hourlyRate = fullData.hourlyRate || 0

  const joinYear = fullData.createdAt ? new Date(fullData.createdAt).getFullYear() : ''

  const avatar =
    fullData.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1e293b&color=fff&size=256`

  return (
    <div className="bg-white rounded-2xl relative flex flex-col sm:flex-row overflow-hidden group transition-all duration-300 hover:-translate-y-1 border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-slate-300">
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 transition-colors duration-500 bg-slate-200 group-hover:bg-indigo-500" />
      <div className="absolute top-0 bottom-0 left-0 w-[1px] z-20 transition-all duration-500 bg-gradient-to-b from-transparent group-hover:from-indigo-500 to-transparent" />

      {/* ── BÊN TRÁI: KHUNG ẢNH ── */}
      <div className="relative w-full sm:w-[220px] shrink-0 h-48 sm:h-auto overflow-hidden bg-slate-100 border-b sm:border-b-0 sm:border-r border-slate-200 cursor-pointer">
        <Link to={`/freelancers/${freelancer._id}`} className="block w-full h-full">
          <img
            src={avatar}
            alt={fullName}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

          {isVerified && (
            <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
              <ShieldCheck size={14} /> Xác thực
            </div>
          )}

          {hourlyRate > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">
              {formatMoney(hourlyRate)} ₫ <span className="text-white/70 font-medium font-serif">/h</span>
            </div>
          )}
        </Link>
      </div>

      {/* ── BÊN PHẢI: THÔNG TIN ── */}
      <div className="flex-1 min-w-0 flex flex-col p-5 sm:p-6 relative bg-gradient-to-br from-white to-slate-50/30">
        {/* HEADER: Xóa nút Tim, chỉ giữ Tên */}
        <div className="mb-3">
          <Link
            to={`/freelancers/${freelancer._id}`}
            className="hover:opacity-80 transition-opacity inline-block group/title max-w-full"
          >
            <h2 className="font-extrabold text-xl text-slate-900 truncate group-hover/title:text-indigo-600 transition-colors flex items-center gap-2">
              {fullName}
              <ExternalLink size={16} className="text-slate-300 group-hover/title:text-indigo-400 shrink-0" />
            </h2>
          </Link>

          {isProfileLoading ? (
            <div className="h-4 bg-slate-200 rounded animate-pulse w-48 mt-2" />
          ) : (
            <p className="text-sm font-bold text-indigo-600 mt-1 truncate">{title}</p>
          )}
        </div>

        {/* THỐNG KÊ */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm mb-4">
          <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md border border-amber-100/50">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-bold text-amber-700">{rating}</span>
            <span className="text-amber-600/70 text-xs font-bold">({reviews})</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs">
            <MapPin className="w-4 h-4 text-slate-400" /> <span className="truncate max-w-[200px]">{location}</span>
          </div>
        </div>

        {/* MÔ TẢ */}
        {isProfileLoading ? (
          <div className="space-y-2 mb-6">
            <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
            <div className="h-3 bg-slate-100 rounded animate-pulse w-5/6" />
          </div>
        ) : (
          <p className="text-sm text-slate-600 line-clamp-2 flex-grow mb-6 leading-relaxed">{desc}</p>
        )}

        <div className="h-px bg-slate-100 my-1" />

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            {joinYear && (
              <>
                <CalendarDays size={14} /> Thành viên từ năm {joinYear}
              </>
            )}
          </div>

          <Link
            to={`/freelancers/${freelancer._id}`}
            className="w-full sm:w-auto text-center px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shrink-0"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  )
}
