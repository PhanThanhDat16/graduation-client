import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingChatBox from '@/components/FloatingChatBox'
import { Outlet } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreSocketIO } from '@/store/useStoreSocketIO'

export default function MainLayout() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore()
  const { connect, disconnect } = useStoreSocketIO()

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

  // Initialize socket connection for logged-in users
  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [])

  if (starting) {
    return <div className="flex items-center justify-center h-screen">Đang tải trang...</div>
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <Outlet />
      </main>
      <FloatingChatBox />
      <Footer />
    </>
  )
}
