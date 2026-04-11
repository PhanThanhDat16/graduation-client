import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export default function MainLayout() {
  const { refresh } = useAuthStore()
  useEffect(() => {
    refresh()
  }, [])
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
