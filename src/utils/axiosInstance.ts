import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.defaults.withCredentials = true

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

    // những api không cần check
    if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh-token')) {
      return Promise.reject(error)
    }

    originalRequest._retryCount = originalRequest._retryCount || 0

    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1

      try {
        const res = await axiosInstance.post('/auth/refresh-token')
        const newAccessToken = res.data.accessToken

        useAuthStore.getState().setAccessToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().clearState()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
