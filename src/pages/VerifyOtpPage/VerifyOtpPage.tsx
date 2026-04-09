import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { message } from 'antd'

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromState = location.state?.email || ''

  const { loading, verifyOTP, resendOTP } = useAuthStore()

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [countdown, setCountdown] = useState(60)
  const canResend = countdown === 0

  useEffect(() => {
    if (!emailFromState) {
      navigate('/register')
    }
  }, [emailFromState, navigate])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('')
    if (pasteData.some((char) => isNaN(Number(char)))) return

    const newOtp = [...otp]
    pasteData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)
    inputRefs.current[Math.min(pasteData.length, 5)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length < 6) {
      return message.warning('Vui lòng nhập đủ 6 số xác thực!')
    }

    // 2. Bắn data lên Store
    const isSuccess = await verifyOTP({
      email: emailFromState,
      otp: otpCode,
      purpose: 'register'
    })
    if (isSuccess) {
      // Có thể truyền email sang trang login để điền sẵn vào ô email cho tiện
      navigate('/login', { state: { email: emailFromState } })
    }
  }

  const handleResend = async () => {
    const isSuccess = await resendOTP({
      email: emailFromState,
      purpose: 'register'
    })
    if (isSuccess) {
      // message.success(`Đã gửi lại mã tới ${emailFromState}`)
      setCountdown(60)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4 font-body overflow-hidden z-50">
      {/* Background indigo phủ phần trên */}
      <div className="absolute top-0 left-0 w-full h-80 bg-indigo-950 rounded-b-[4rem] md:rounded-b-[10rem]"></div>

      {/* Card trắng */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] p-8 relative z-10 border border-gray-100">
        {/* Nút Quay lại */}
        <button
          onClick={() => navigate('/register')}
          className="absolute top-6 left-6 text-gray-400 hover:text-indigo-950 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Icon Mail */}
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
          <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">Xác thực Email</h1>
          <p className="text-gray-500 text-sm">
            Chúng tôi vừa gửi một mã gồm 6 chữ số tới <br />
            <span className="font-bold text-indigo-950">{emailFromState}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 6 Ô Nhập OTP */}
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all ${
                  digit
                    ? 'border-indigo-950 bg-indigo-50 text-indigo-950'
                    : 'border-gray-200 bg-white focus:border-amber-500 focus:shadow-md'
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
              loading || otp.join('').length < 6
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-950 hover:bg-indigo-900 shadow-xl shadow-indigo-950/20 hover:-translate-y-1'
            }`}
          >
            {loading ? 'Đang xác thực...' : 'Xác Nhận'}
          </button>
        </form>

        {/* Gửi lại mã */}
        <div className="mt-8 text-center text-sm">
          <p className="text-gray-500 mb-2">Chưa nhận được mã?</p>
          {canResend ? (
            <button
              type="button"
              disabled={loading}
              onClick={handleResend}
              className="font-bold text-amber-600 hover:text-amber-700 transition-colors"
            >
              {loading ? 'Đang gửi lại mã...' : 'Gửi lại mã ngay'}
            </button>
          ) : (
            <p className="font-medium text-gray-400">
              Gửi lại mã sau <span className="text-indigo-950 font-bold">{countdown}s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
