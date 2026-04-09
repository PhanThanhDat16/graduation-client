import type { UserResponse } from './user'

export type BodyRegister = Omit<UserResponse, '_id' | 'createdAt' | 'updatedAt' | 'isVerified'>
export type BodyVerifyOtpRegister = {
  email: string
  otp: string
  purpose: 'register' | 'reset_password'
}
export type BodyResendOTP = Pick<BodyVerifyOtpRegister, 'email' | 'purpose'>
export interface AuthState {
  accessToken: string | null
  user: UserResponse | null
  loading: boolean

  setAccessToken: (accessToken: string) => void
  clearState: () => void

  logIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  fetchMe: () => Promise<void>
  refresh: () => Promise<void>
  register: (body: BodyRegister) => Promise<boolean>
  verifyOTP: (body: BodyVerifyOtpRegister) => Promise<boolean>
  resendOTP: (body: BodyResendOTP) => Promise<boolean>
}
