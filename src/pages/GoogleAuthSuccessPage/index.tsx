import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { message } from 'antd'

const GoogleAuthSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAccessToken, fetchMe } = useAuthStore()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    if (accessToken) {
      setAccessToken(accessToken)
      fetchMe()
        .then(() => {
          message.success('Đăng nhập thành công!')
          navigate('/', { replace: true })
        })
        .catch(() => {
          navigate('/login', { replace: true })
        })
    } else {
      message.error('Đăng nhập bằng Google thất bại.')
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate, setAccessToken, fetchMe])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <h2 className="text-xl font-semibold text-gray-700">Đang xử lý đăng nhập...</h2>
      </div>
    </div>
  )
}

export default GoogleAuthSuccessPage
