import { useAuthStore } from '@/store/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRouteLogin = () => {
  const { accessToken } = useAuthStore()
  if (accessToken) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default PrivateRouteLogin
