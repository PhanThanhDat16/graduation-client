import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import { Outlet } from 'react-router-dom'
import { useStoreSocketIO } from '@/store/useStoreSocketIO'
import { useEffect } from 'react'

export default function DashboardLayout() {
  const { connect, disconnect } = useStoreSocketIO()

  // Connect to Socket.IO when the component mounts and disconnect when it unmounts
  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-body">
      <DashboardHeader />
      <div className="flex flex-col flex-1 w-full md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 w-full p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
