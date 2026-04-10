import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuthStore } from '@/store/useAuthStore'
import Input from '@/components/Input'
import { authSchema, type AuthSchema } from '@/utils/rules'
import path from '@/constants/path'

const forgotPassworkSchema = authSchema.pick(['email'])
type forgotPassworkFormData = Pick<AuthSchema, 'email'>

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { forgotPassword, loading } = useAuthStore()

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors }
  } = useForm<forgotPassworkFormData>({
    resolver: yupResolver(forgotPassworkSchema),
    defaultValues: { email: '' }
  })

  const onSubmit = handleSubmit(async (data) => {
    const isSuccess = await forgotPassword(data.email)

    if (isSuccess) {
      navigate(path.VERIFY_OTP, {
        state: {
          email: data.email,
          purpose: 'forgot_password'
        }
      })
    }
  })

  return (
    <div className="w-full lg:w-1/2 min-h-screen bg-white relative flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-24 py-12 font-body overflow-y-auto">
      {/* Nút Quay Lại Trang Đăng Nhập */}
      <button
        onClick={() => navigate('/login')}
        className="absolute top-8 left-8 md:left-12 lg:left-16 xl:left-24 flex items-center gap-2 text-gray-400 hover:text-indigo-950 transition-colors"
      >
        <div className="w-8 h-8 rounded flex items-center justify-center border border-gray-200">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span className="font-bold text-sm hidden sm:block">Quay lại Đăng nhập</span>
      </button>

      <div className="w-full max-w-xl mx-auto mt-12 lg:mt-8">
        {/* Icon Ổ Khóa (Báo hiệu bảo mật) */}
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">Quên mật khẩu?</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Đừng lo lắng! Hãy nhập email bạn đã đăng ký, chúng tôi sẽ gửi mã xác thực để giúp bạn đặt lại mật khẩu mới.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
            <Input
              type="email"
              register={registerForm}
              classNameInput={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              name="email"
              placeholder="nhapemail@example.com"
              errorMessage={errors.email?.message}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-2 rounded-xl font-bold text-white transition-all duration-300 ${
              loading
                ? 'bg-indigo-950/70 cursor-not-allowed'
                : 'bg-indigo-950 hover:bg-indigo-900 shadow-lg shadow-indigo-950/20'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Gửi Mã Xác Thực'}
          </button>
        </form>
      </div>
    </div>
  )
}
