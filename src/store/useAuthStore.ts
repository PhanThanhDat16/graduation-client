import { create } from 'zustand'
import { authService } from '../apis/authService'
import type { AuthState, BodyRegister, BodyResendOTP, BodyVerifyOtpRegister } from '../types/store'
import { message } from 'antd'
import type { UserProfile } from '@/types/user'
import { userService } from '@/apis/userService'

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  updating: false,

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
  logIn: async (email: string, password: string) => {
    try {
      set({ loading: true })
      const res = await authService.logIn(email, password)
      console.log(res)
      get().setAccessToken(res.data.data.accessToken)
      message.success('Đăng nhập thành công!')
      // console.log(res)
      // console.log(res.data.data.accessToken)
      get().fetchMe()
    } catch (error) {
      console.error(error)
      message.error('Đăng nhập không thành công!')
    } finally {
      set({ loading: false })
    }
  },
  forgotPassword: async (email: string) => {
    try {
      set({ loading: true })
      const res = await authService.forgotPassword(email)
      console.log(res)
      message.success('Mã xác thực đã được gửi đến email của bạn!')
      return true
    } catch (error) {
      console.error(error)
      message.error('Email không tồn tại trong hệ thống.')
      return false
    } finally {
      set({ loading: false })
    }
  },
  verifyOTPPassword: async (email: string, password: string) => {
    try {
      set({ loading: true })
      const res = await authService.verifyOTPPassword(email, password)
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
      console.log(res)
      // console.log(res)
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
    } catch (error: any) {
      const status = error.status
      if (status === 401 || status === 403) {
        get().clearState()
        return
      }
      message.error('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      set({ loading: false })
    }
  },
  updateProfile: async (data: Partial<UserProfile>) => {
    try {
      set({ updating: true })
      const res = await userService.updateProfile(data)

      // Cập nhật lại user state với data mới trả về từ server
      set({ user: res.data.data })
      message.success('Cập nhật thông tin thành công!')
      return true
    } catch (error: any) {
      console.error(error)
      message.error(error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại!')
      return false
    } finally {
      set({ updating: false })
    }
  },

  uploadAvatar: async (file: File) => {
    set({ updating: true })
    try {
      const uploadRes = await userService.uploadAvatar(file)
      const imageUrl = uploadRes.data.data.image
      console.log(imageUrl)
      // Sau khi upload thành công, gọi lại fetchMe để cập nhật URL avatar mới nhất
      await get().updateProfile({ avatar: imageUrl })
      await get().fetchMe()
      message.success('Cập nhật ảnh đại diện thành công!')
      return true
    } catch (error: any) {
      console.error(error)
      message.error(error.response?.data?.message || 'Upload ảnh thất bại. Kích thước có thể quá lớn.')
      return false
    } finally {
      set({ updating: false })
    }
  }
}))
