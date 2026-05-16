import { useState, useMemo } from 'react'
import { Lock, Eye, EyeOff, Shield, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import Input from '@/components/Input/Input'
import { passwordSchema, type PasswordSchema } from '@/utils/rules'
import { userService } from '@/apis/userService'

interface Props {
  onClose: () => void
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<PasswordSchema>({
    resolver: yupResolver(passwordSchema)
  })

  const newPasswordValue = useWatch({
    control,
    name: 'newPassword',
    defaultValue: ''
  })

  const pwdStrength = useMemo(() => {
    if (!newPasswordValue) return 0

    let s = 0
    if (newPasswordValue.length >= 8) s++
    if (/[A-Z]/.test(newPasswordValue)) s++
    if (/[0-9]/.test(newPasswordValue)) s++
    if (/[!@#$%^&*]/.test(newPasswordValue)) s++
    return s
  }, [newPasswordValue])

  const onSubmit = async (data: PasswordSchema) => {
    try {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }

      await userService.updatePassword(payload)

      toast.success('Đổi mật khẩu thành công!')
      onClose()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Mật khẩu không đúng!'
      toast.error(errorMessage)
      console.error('Lỗi đổi mật khẩu:', error)
    }
  }

  const inputClass =
    'w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 shadow-sm'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[28px] sm:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER MODAL */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-[18px] flex items-center justify-center border border-indigo-100 shadow-sm">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-900 tracking-tight">Đổi mật khẩu</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Bảo mật tài khoản của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY MODAL */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          <form id="change-pwd-form" onSubmit={handleSubmit(onSubmit)}>
            {/* MẬT KHẨU HIỆN TẠI */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu hiện tại</label>
              <div className="relative group">
                <Lock className="absolute top-3.5 left-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 z-10 transition-colors" />
                <Input
                  type={showPwd.current ? 'text' : 'password'}
                  register={register}
                  name="currentPassword"
                  placeholder="Nhập mật khẩu cũ..."
                  classNameInput={inputClass}
                  errorMessage={errors.currentPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd({ ...showPwd, current: !showPwd.current })}
                  className="absolute top-3.5 right-4 z-10 text-slate-400 hover:text-indigo-600 transition-colors bg-transparent"
                >
                  {showPwd.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* MẬT KHẨU MỚI */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu mới</label>
              <div className="relative group">
                <Lock className="absolute top-3.5 left-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 z-10 transition-colors" />
                <Input
                  type={showPwd.new ? 'text' : 'password'}
                  register={register}
                  name="newPassword"
                  placeholder="Nhập mật khẩu mới..."
                  classNameInput={inputClass}
                  errorMessage={errors.newPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd({ ...showPwd, new: !showPwd.new })}
                  className="absolute top-3.5 right-4 z-10 text-slate-400 hover:text-indigo-600 transition-colors bg-transparent"
                >
                  {showPwd.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* BẢNG ĐÁNH GIÁ MẬT KHẨU (Bọc trong hộp xám) */}
              {newPasswordValue && (
                <div className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex gap-1.5 h-1.5 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-full flex-1 rounded-full transition-all duration-500 ${
                          i <= pwdStrength
                            ? pwdStrength <= 2
                              ? 'bg-red-500'
                              : pwdStrength === 3
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
                    <p
                      className={`flex items-center gap-2 text-[13px] font-medium transition-colors ${pwdStrength >= 1 ? 'text-emerald-600' : 'text-slate-500'}`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Tối thiểu 8 ký tự
                    </p>
                    <p
                      className={`flex items-center gap-2 text-[13px] font-medium transition-colors ${/[A-Z]/.test(newPasswordValue) ? 'text-emerald-600' : 'text-slate-500'}`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Có chữ in hoa
                    </p>
                    <p
                      className={`flex items-center gap-2 text-[13px] font-medium transition-colors ${/[0-9]/.test(newPasswordValue) ? 'text-emerald-600' : 'text-slate-500'}`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Có chữ số
                    </p>
                    <p
                      className={`flex items-center gap-2 text-[13px] font-medium transition-colors ${/[!@#$%^&*]/.test(newPasswordValue) ? 'text-emerald-600' : 'text-slate-500'}`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Ký tự đặc biệt
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* XÁC NHẬN MẬT KHẨU MỚI */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Xác nhận mật khẩu mới</label>
              <div className="relative group">
                <Lock className="absolute top-3.5 left-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 z-10 transition-colors" />
                <Input
                  type={showPwd.confirm ? 'text' : 'password'}
                  register={register}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới..."
                  classNameInput={inputClass}
                  errorMessage={errors.confirmPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd({ ...showPwd, confirm: !showPwd.confirm })}
                  className="absolute top-3.5 right-4 z-10 text-slate-400 hover:text-indigo-600 transition-colors bg-transparent"
                >
                  {showPwd.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* LƯU Ý */}
            <div className="flex items-start gap-2.5 bg-indigo-50/50 text-indigo-700 p-3.5 rounded-xl border border-indigo-100">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">
                Bạn sẽ bị đăng xuất khỏi tất cả các thiết bị khác sau khi đổi mật khẩu thành công.
              </p>
            </div>
          </form>
        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-5 sm:px-8 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-[28px] sm:rounded-b-[32px]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="change-pwd-form"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
          >
            {isSubmitting ? (
              <span className="animate-spin border-2 border-white/20 border-t-white w-4 h-4 rounded-full" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            Cập nhật mật khẩu
          </button>
        </div>
      </div>
    </div>
  )
}
