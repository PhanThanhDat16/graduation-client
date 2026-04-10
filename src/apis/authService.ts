import axiosInstance from '../utils/axiosInstance'
import type { BodyRegister, BodyResendOTP, BodyVerifyOtpRegister } from '@/types/store'

export const authService = {
  register: async (body: BodyRegister) => {
    const res = await axiosInstance.post('users/register', body)
    return res
  },
  verifyOTP: async (body: BodyVerifyOtpRegister) => {
    const res = await axiosInstance.post('/email/verify-otp', body)
    return res
  },
  resendOTP: async (body: BodyResendOTP) => {
    const res = await axiosInstance.post('/email/resend-otp', body)
    return res
  },
  logIn: async (email: string, password: string) => {
    const res = await axiosInstance.post('auth/login', { email, password })
    return res
  },
  forgotPassword: async (email: string) => {
    const res = await axiosInstance.post('auth/password/forgot', { email })
    return res
  },
  verifyOTPPassword: async (email: string, otp: string) => {
    const res = await axiosInstance.post('auth/password/verify-otp', { email, otp })
    return res
  },

  logOut: async () => {
    const res = await axiosInstance.post('/auth/logout', {}, { withCredentials: true })
    return res
  },

  fetchMe: async () => {
    const res = await axiosInstance.get('/users/profile')
    return res
  },

  refresh: async () => {
    const res = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true })
    return res
  }
}
