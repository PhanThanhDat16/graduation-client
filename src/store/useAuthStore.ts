import { create } from 'zustand'
import { authService } from '../apis/authService'
import type { AuthState, BodyRegister, BodyResendOTP, BodyVerifyOtpRegister } from '../types/store'
import { message } from 'antd'

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken })
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false })
  },
  register: async (body: BodyRegister) => {
    try {
      set({ loading: true })
      const res = await authService.register(body)
      message.success('Đăng ký thành công! Mã xác thực đã được gửi.')
      console.log(res)
      return true
    } catch (error: any) {
      console.log(error)
      message.error('Đăng ký không thành công. Email hoặc số điện thoại đã được sử dụng.')
      return false
    } finally {
      set({ loading: false })
    }
  },
  verifyOTP: async (body: BodyVerifyOtpRegister) => {
    try {
      set({ loading: true })
      const res = await authService.verifyOTP(body)
      message.success('Xác thực OTP thành công.')
      console.log(res)
      return true
    } catch (error) {
      console.log(error)
      message.error('Mã OTP không chính xác.')
      return false
    } finally {
      set({ loading: false })
    }
  },
  resendOTP: async (body: BodyResendOTP) => {
    try {
      set({ loading: true })
      const res = await authService.resendOTP(body)
      message.success('Đã gửi lại mã xác thực.')
      console.log(res)
      return true
    } catch (error) {
      console.log(error)
      message.error('Vui lòng thử lại sau.')
      return false
    } finally {
      set({ loading: false })
    }
  },
  logIn: async (email, password) => {
    try {
      set({ loading: true })
      const res = await authService.logIn(email, password)
      get().setAccessToken(res.data.data.accessToken)
      message.success('Đăng nhập thành công!')
      get().fetchMe()
    } catch (error) {
      console.error(error)
      message.error('Đăng nhập không thành công!')
    } finally {
      set({ loading: false })
    }
  },

  logOut: async () => {
    try {
      await authService.logOut()
      get().clearState()
      message.success('Logout thành công!')
    } catch (error) {
      console.error(error)
      message.error('Lỗi xảy ra khi logout. Hãy thử lại!')
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true })
      const res = await authService.fetchMe()
      set({ user: res.data.data })
    } catch (error) {
      console.error(error)
      set({ user: null, accessToken: null })
      message.error('Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!')
    } finally {
      set({ loading: false })
    }
  },

  refresh: async () => {
    try {
      set({ loading: true })
      const { user, fetchMe, setAccessToken } = get()
      const res = await authService.refresh()

      setAccessToken(res.data.data.accessToken)

      if (!user) {
        await fetchMe()
      }
    } catch (error) {
      if (error === 401) {
        get().clearState()
        return
      }
      if (error === 403) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
        get().clearState()
        return
      }
      message.error('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      set({ loading: false })
    }
  }
}))
