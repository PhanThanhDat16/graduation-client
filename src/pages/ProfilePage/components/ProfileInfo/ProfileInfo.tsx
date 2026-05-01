import { Mail, Phone, Calendar, User as UserIcon, ShieldCheck } from 'lucide-react'
import type { UserProfile } from '@/types/user'

const formatDate = (isoString?: string) => {
  if (!isoString) return 'Chưa cập nhật'
  return new Date(isoString).toLocaleDateString('vi-VN')
}

const translateGender = (gender?: string) => {
  switch (gender) {
    case 'male':
      return 'Nam'
    case 'female':
      return 'Nữ'
    default:
      return 'Khác'
  }
}

export default function ProfileInfo({ profile }: { profile: UserProfile }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-6 md:p-8 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 mb-4">Giới thiệu</h2>
        <div className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-line font-medium">
          {profile.description ? (
            profile.description
          ) : (
            <span className="text-slate-400 italic">Người dùng này chưa cập nhật thông tin giới thiệu.</span>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 bg-slate-50/30">
        <h2 className="text-base font-bold text-slate-900 mb-5">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Mail size={14} /> Email
            </p>
            <p className="text-[15px] font-semibold text-slate-800">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Phone size={14} /> Số điện thoại
            </p>
            <p className="text-[15px] font-semibold text-slate-800">{profile.phone || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Calendar size={14} /> Ngày sinh
            </p>
            <p className="text-[15px] font-semibold text-slate-800">{formatDate(profile.birthday)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <UserIcon size={14} /> Giới tính
            </p>
            <p className="text-[15px] font-semibold text-slate-800">{translateGender(profile.gender)}</p>
          </div>

          <div className="sm:col-span-2 pt-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl">
              <ShieldCheck size={20} className={profile.isVerified ? 'text-emerald-500' : 'text-slate-400'} />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Xác thực danh tính (KYC)</p>
                <p className="text-xs text-slate-500 font-medium">
                  {profile.isVerified
                    ? 'Tài khoản đã được hệ thống xác minh an toàn.'
                    : 'Tài khoản chưa cung cấp giấy tờ xác minh.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
