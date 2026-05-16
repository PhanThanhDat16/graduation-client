import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'
import { message } from 'antd'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// gắn access vào header req
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// tự động gọi refresh api khi access token hết hạn
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    // những api không cần retry refresh
    if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh-token')) {
      return Promise.reject(error)
    }

    // Chỉ retry 1 lần khi access token hết hạn (401 hoặc 403)
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const res = await axiosInstance.post('/auth/refresh-token')
        const newAccessToken = res.data.data.accessToken

        useAuthStore.getState().setAccessToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
        useAuthStore.getState().clearState()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
