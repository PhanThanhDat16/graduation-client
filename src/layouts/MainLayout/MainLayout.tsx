import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export default function MainLayout() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore()
  const [starting, setStarting] = useState(true)

  const hasInit = useRef(false)

  useEffect(() => {
    if (hasInit.current) return
    hasInit.current = true

    const run = async () => {
      try {
        if (!accessToken) {
          await refresh()
        } else if (!user) {
          await fetchMe()
        }
      } finally {
        setStarting(false)
      }
    }

    run()
  }, [])

  if (starting) {
    return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>
  }
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
