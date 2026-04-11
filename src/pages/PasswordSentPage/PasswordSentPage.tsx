import { useNavigate, useLocation } from 'react-router-dom'

export default function PasswordSentPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const emailFromState = location.state?.email || 'email của bạn'

  return (
    <div className="w-full lg:w-1/2 min-h-screen bg-white relative flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-24 py-12 font-body overflow-y-auto">
      <div className="w-full max-w-xl mx-auto mt-8 flex flex-col items-center text-center">
        {/* Icon Thành Công (Checkmark xịn xò) */}
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
          <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cấp lại mật khẩu thành công!</h1>

        <p className="text-gray-500 mb-8 leading-relaxed text-lg">
          Hệ thống đã tạo một mật khẩu mới và gửi đến địa chỉ <br className="hidden md:block" />
          <span className="font-bold text-indigo-950">{emailFromState}</span>
        </p>

        {/* Bảng hướng dẫn */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10 w-full text-left">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Bước tiếp theo:
          </h3>
          <ul className="text-amber-700 text-sm space-y-2 ml-7 list-disc">
            <li>
              Vui lòng kiểm tra <strong>Hộp thư đến</strong> hoặc mục <strong>Spam (Thư rác)</strong>.
            </li>
            <li>Sử dụng mật khẩu mới trong email để đăng nhập.</li>
            <li>Nên đổi lại mật khẩu của riêng bạn ngay sau khi đăng nhập thành công.</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-xl font-bold text-white bg-indigo-950 hover:bg-indigo-900 shadow-lg shadow-indigo-950/20 transition-all duration-300"
        >
          Quay lại trang Đăng nhập
        </button>
      </div>
    </div>
  )
}
