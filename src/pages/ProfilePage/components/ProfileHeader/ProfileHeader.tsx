import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, MapPin, CheckCircle2, Mail, Briefcase, Edit, Star, Loader2Icon, Clock } from 'lucide-react'
import type { UserProfile } from '@/types/user'

const translateRole = (role?: string) => {
  switch (role) {
    case 'freelancer':
      return 'Freelancer'
    case 'contractor':
      return 'Khách hàng (Client)'
    case 'admin':
      return 'Quản trị viên'
    case 'staff':
      return 'Nhân viên'
    default:
      return 'Người dùng'
  }
}

interface ProfileHeaderProps {
  profile: UserProfile
  isOwner: boolean
  updating: boolean
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEditClick?: () => void
}

export default function ProfileHeader({ profile, isOwner, updating, onAvatarChange, onEditClick }: ProfileHeaderProps) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const joinedDate = profile.createdAt
    ? `Tháng ${new Date(profile.createdAt).getMonth() + 1}, ${new Date(profile.createdAt).getFullYear()}`
    : '—'

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm relative z-10 pb-6">
      {/* ── ẢNH BÌA ── */}
      <div className="h-40 md:h-52 w-full relative bg-slate-800">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2000&q=80"
          alt="Cover"
          className="w-full h-full object-cover opacity-80"
        />
        {/* {isOwner && (
          <button className="absolute top-4 right-4 px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-xs font-semibold transition-all">
            <Camera size={14} /> Đổi ảnh bìa
          </button>
        )} */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-end">
          {/* ── AVATAR ── */}
          <div className="-mt-16 sm:-mt-20 relative z-10 shrink-0 group">
            <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white rounded-full p-1.5 shadow-md relative">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative border border-slate-200">
                {updating ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <Loader2Icon className="w-8 h-8 animate-spin text-indigo-500" />
                  </div>
                ) : (
                  <img
                    src={
                      profile.avatar ||
                      `https://ui-avatars.com/api/?name=${profile.fullName || 'User'}&background=1B2A6B&color=fff&size=256`
                    }
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                )}

                {isOwner && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={updating}
                    className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Camera className="w-8 h-8 mb-1" />
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={onAvatarChange} accept="image/*" className="hidden" />
            </div>
          </div>

          {/* ── THÔNG TIN HEADER ── */}
          <div className="flex-1 mt-2 sm:mt-0 sm:pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                {profile.fullName}
                {profile.isVerified && (
                  <CheckCircle2 size={24} className="text-emerald-500 fill-emerald-50">
                    <title>Đã xác thực</title>
                  </CheckCircle2>
                )}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-600 font-medium">
                <span className="font-bold text-indigo-600">{translateRole(profile.role)}</span>

                <span className="flex items-center gap-1 text-slate-700">
                  <Star size={16} className={profile.ratingAvg ? 'text-amber-500 fill-amber-500' : 'text-slate-300'} />
                  {profile.ratingAvg ? (
                    <span className="font-bold">
                      {profile.ratingAvg.toFixed(1)}{' '}
                      <span className="text-slate-400 font-normal">({profile.ratingCount} đánh giá)</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Chưa có đánh giá</span>
                  )}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin size={15} className="text-slate-400" /> {profile.address || 'Chưa cập nhật'}
                </span>
                <span className="flex items-center gap-1.5 border-l border-slate-300 pl-4 ml-2">
                  <Clock size={15} className="text-slate-400" /> Tham gia {joinedDate}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex gap-3">
              {!isOwner && (
                <>
                  <button
                    onClick={() => navigate('/messages')}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Mail size={18} /> Nhắn tin
                  </button>
                  {profile.role === 'freelancer' && (
                    <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm shadow-indigo-200 hover:-translate-y-0.5">
                      <Briefcase size={18} /> Mời làm việc
                    </button>
                  )}
                </>
              )}
              {isOwner && (
                <button
                  onClick={onEditClick}
                  className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                  title="Chỉnh sửa thông tin"
                >
                  <Edit size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
