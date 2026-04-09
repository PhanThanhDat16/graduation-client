import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore()
  const [starting, setStarting] = useState(true)

  const hasInit = useRef(false)

  useEffect(() => {
    if (hasInit.current) return
    hasInit.current = true

    const run = async () => {
      if (!accessToken) {
        await refresh()
      }

      if (!user) {
        await fetchMe()
      }

      setStarting(false)
    }

    run()
  }, [])

  if (starting || loading) {
    return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Outlet />
    </>
  )
}

export default PrivateRoute
