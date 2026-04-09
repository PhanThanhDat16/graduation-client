import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { authSchema, type AuthSchema } from '@/utils/rules'
import { omit } from 'lodash'
import Input from '@/components/Input'
import InputNumber from '@/components/InputNumber'

export default function RegisterPage() {
  const navigate = useNavigate()
  // Lấy hàm register từ Zustand và đổi tên thành registerUser
  const { register: registerUser, loading } = useAuthStore()

  // Setup react-hook-form
  const {
    register: registerForm, // Đổi tên hàm register của RHF để không trùng với Zustand
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm<AuthSchema>({
    resolver: yupResolver(authSchema),
    defaultValues: {
      gender: 'male',
      role: ''
    }
  })

  // Dùng watch để theo dõi thay đổi (phục vụ cho UI)
  const watchRole = useWatch({
    control,
    name: 'role'
  })

  const watchPassword = useWatch({
    control,
    name: 'password',
    defaultValue: ''
  })

  // Hàm tính toán độ mạnh mật khẩu dựa trên giá trị watch được
  const getPasswordStrength = () => {
    if (!watchPassword || watchPassword.length === 0) return { width: '0%', color: 'bg-gray-200' }
    if (watchPassword.length < 6) return { width: '33%', color: 'bg-red-500' }
    if (watchPassword.length < 10) return { width: '66%', color: 'bg-amber-500' }
    return { width: '100%', color: 'bg-green-500' }
  }
  const onSubmit = handleSubmit(async (data) => {
    // const { confirm_password, ...payload } = data
    const body = omit(data, ['confirm_password'])
    const isSuccess = await registerUser(body as any)
    if (isSuccess) {
      navigate('/verify-otp', { state: { email: data.email } })
    }
  })

  return (
    <div className="w-full lg:w-1/2 min-h-screen bg-white relative flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-24 py-12 font-body overflow-y-auto">
      {/* Logo */}
      <Link to="/" className="absolute top-8 left-8 md:left-12 lg:left-16 xl:left-24 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-950 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <span className="font-heading font-bold text-xl text-indigo-950">
          Freelance<span className="text-amber-500">VN</span>
        </span>
      </Link>

      <div className="w-full max-w-xl mx-auto mt-12 lg:mt-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tạo tài khoản mới</h1>
        <p className="text-gray-500 mb-8">Điền thông tin bên dưới để tham gia nền tảng.</p>

        {/* Bọc form bằng handleSubmit của RHF */}
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Card chọn Role (Sử dụng setValue và watch thay vì register) */}
          <div>
            {/* Card chọn Role */}
            <div>
              <div className="grid grid-cols-2 gap-4 mb-1">
                {/* Card Contractor */}
                <div
                  onClick={() => setValue('role', 'contractor', { shouldValidate: true })}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                    watchRole === 'contractor'
                      ? 'border-indigo-950 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-200 bg-white'
                  }`}
                >
                  <svg
                    className={`w-7 h-7 mb-3 transition-colors ${watchRole === 'contractor' ? 'text-indigo-950' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <h3
                    className={`font-bold text-sm ${watchRole === 'contractor' ? 'text-indigo-950' : 'text-gray-700'}`}
                  >
                    Tôi là Contractor
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Tìm freelancer cho dự án</p>
                </div>

                {/* Card Freelancer */}
                <div
                  onClick={() => setValue('role', 'freelancer', { shouldValidate: true })}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                    watchRole === 'freelancer'
                      ? 'border-indigo-950 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-200 bg-white'
                  }`}
                >
                  <svg
                    className={`w-7 h-7 mb-3 transition-colors ${watchRole === 'freelancer' ? 'text-indigo-950' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h3
                    className={`font-bold text-sm ${watchRole === 'freelancer' ? 'text-indigo-950' : 'text-gray-700'}`}
                  >
                    Tôi là Freelancer
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Tìm việc và kiếm tiền</p>
                </div>
              </div>

              {/* Hiển thị lỗi cho Role */}
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message as string}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <Input
                register={registerForm}
                classNameInput={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all placeholder-gray-400 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                name="fullName"
                placeholder="Nguyễn Văn A"
                errorMessage={errors.fullName?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                register={registerForm}
                classNameInput={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                name="email"
                placeholder="email@example.com"
                errorMessage={errors.email?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => {
                  return (
                    <InputNumber
                      type="text"
                      placeholder="0973616354"
                      classNameInput={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all placeholder-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      // onChange={field.onChange}
                      // value={field.value}
                      // ref={field.ref}
                      {...field}
                    />
                  )
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <Input
                type="date"
                register={registerForm}
                classNameInput={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all placeholder-gray-400 ${errors.birthday ? 'border-red-500' : 'border-gray-300'}`}
                name="birthday"
                errorMessage={errors.birthday?.message}
              />
              {/* <input
                type="date"
                {...registerForm('birthday')}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all text-gray-700 ${errors.birthday ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday.message as string}</p>} */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                {...registerForm('gender')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-950 outline-none transition-all text-gray-700 bg-white cursor-pointer"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <Input
                register={registerForm}
                classNameInput={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all placeholder-gray-400 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                name="address"
                placeholder="123 Nguyễn Văn Linh, Đà Nẵng"
                errorMessage={errors.address?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <Input
                type="password"
                register={registerForm}
                classNameInput={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                name="password"
                placeholder="••••••••"
                errorMessage={errors.password?.message}
              />
              <div className="h-1.5 w-full bg-gray-100 rounded-full mt-2 overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 ${getPasswordStrength().color}`}
                  style={{ width: getPasswordStrength().width }}
                ></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
              <Input
                type="password"
                register={registerForm}
                classNameInput={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-950 outline-none transition-all placeholder-gray-400 ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}
                name="confirm_password"
                placeholder="••••••••"
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <label className="flex items-start pt-2 cursor-pointer group">
            <input
              type="checkbox"
              required // Dùng standard HTML validation cho checkbox điều khoản
              className="mt-1 w-4 h-4 text-indigo-950 rounded border-gray-300 focus:ring-indigo-950 cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-600 leading-relaxed">
              Tôi đồng ý với{' '}
              <Link to="/terms" className="text-indigo-950 font-bold hover:text-amber-600 transition-colors">
                Điều khoản
              </Link>{' '}
              và{' '}
              <Link to="/privacy" className="text-indigo-950 font-bold hover:text-amber-600 transition-colors">
                Chính sách bảo mật
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 mt-4 rounded-xl font-bold text-white transition-all duration-200 ${
              loading
                ? 'bg-indigo-950/70 cursor-not-allowed'
                : 'bg-indigo-950 hover:bg-indigo-900 shadow-lg shadow-indigo-950/20'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-indigo-950 hover:text-amber-600 transition-colors">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
