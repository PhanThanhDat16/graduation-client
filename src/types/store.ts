import type { UserProfile } from './user'

export type BodyRegister = Omit<UserProfile, '_id' | 'createdAt' | 'updatedAt' | 'isVerified'>
export type BodyVerifyOtpRegister = {
  email: string
  otp: string
  purpose: 'register' | 'resetPassword'
}
export type BodyResendOTP = Pick<BodyVerifyOtpRegister, 'email' | 'purpose'>
export interface AuthState {
  accessToken: string | null
  user: UserProfile | null
  loading: boolean
  updating: boolean

  setAccessToken: (accessToken: string) => void
  clearState: () => void

  logIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  fetchMe: () => Promise<void>
  refresh: () => Promise<void>
  register: (body: BodyRegister) => Promise<boolean>
  verifyOTP: (body: BodyVerifyOtpRegister) => Promise<boolean>
  resendOTP: (body: BodyResendOTP) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  verifyOTPPassword: (email: string, otp: string) => Promise<boolean>
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<boolean>
}
