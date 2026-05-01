import { useState } from 'react'
import { X, Loader2Icon, User, Phone, MapPin, AlignLeft, Calendar } from 'lucide-react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useAuthStore } from '@/store/useAuthStore'
import type { UserProfile } from '@/types/user'
import { profileSchema, type ProfileSchema } from '@/utils/rules'

interface EditProfileModalProps {
  profile: UserProfile
  onClose: () => void
}
type EditProfileFormValues = Omit<ProfileSchema, 'birthday' | 'avatar'> & {
  birthday: string
}

export default function EditProfileModal({ profile, onClose }: EditProfileModalProps) {
  const { updateProfile } = useAuthStore()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  // Cắt chuỗi để lấy định dạng YYYY-MM-DD cho thẻ input
  const formattedBirthday = profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : ''

  // 2. Truyền Type mới vào useForm, dùng `as any` ở resolver để ép TypeScript bỏ qua lỗi lệch kiểu Date vs String
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditProfileFormValues>({
    resolver: yupResolver(profileSchema) as any,
    defaultValues: {
      fullName: profile.fullName || '',
      phone: profile.phone || '',
      birthday: formattedBirthday,
      gender: profile.gender || 'other',
      address: profile.address || '',
      description: profile.description || ''
    }
  })

  // 3. Hàm Submit (Dùng any để hứng data sau khi đã được Yup validate và tự động transform string thành Date object)
  const onSubmit = async (data: any) => {
    setIsLoading(true)

    // Xử lý cẩn thận ngày sinh: Nếu Yup đã convert thành Date thì dùng luôn, nếu chưa thì tạo Date mới
    const birthdayISO =
      data.birthday instanceof Date
        ? data.birthday.toISOString()
        : data.birthday
          ? new Date(data.birthday).toISOString()
          : undefined

    const success = await updateProfile({
      ...data,
      birthday: birthdayISO
    })

    if (success) {
      toast.success('Cập nhật thông tin thành công!')
      queryClient.invalidateQueries({ queryKey: ['userProfile', profile._id] })
      onClose()
    } else {
      toast.error('Cập nhật thất bại, vui lòng thử lại.')
    }

    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h3 className="font-bold text-lg text-slate-900">Cập nhật hồ sơ</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Họ và Tên */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <User size={16} className="text-indigo-500" /> Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>}
              </div>

              {/* Số điện thoại */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone size={16} className="text-indigo-500" /> Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
              </div>

              {/* Ngày sinh */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar size={16} className="text-indigo-500" /> Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('birthday')}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.birthday ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.birthday && <p className="text-xs text-red-500 font-medium">{errors.birthday.message}</p>}
              </div>

              {/* Giới tính */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender')}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none ${
                    errors.gender ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500 font-medium">{errors.gender.message}</p>}
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin size={16} className="text-indigo-500" /> Địa chỉ
              </label>
              <input
                type="text"
                {...register('address')}
                placeholder="Ví dụ: 123 Nguyễn Văn Linh, Đà Nẵng..."
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.address ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address.message}</p>}
            </div>

            {/* Giới thiệu bản thân */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <AlignLeft size={16} className="text-indigo-500" /> Giới thiệu bản thân
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Viết vài dòng giới thiệu về kinh nghiệm và kỹ năng của bạn..."
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-sm shadow-indigo-200"
          >
            {isLoading && <Loader2Icon size={16} className="animate-spin" />}
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}
