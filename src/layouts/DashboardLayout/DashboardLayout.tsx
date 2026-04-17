import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-body flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex flex-col md:flex-row w-full">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
