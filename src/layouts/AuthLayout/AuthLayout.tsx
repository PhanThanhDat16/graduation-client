import AuthSidebar from '@/components/AuthSidebar'
import { Outlet } from 'react-router-dom'
// import AuthSidebar from '@/components/AuthSidebar'

export default function AuthLayout() {
  return (
    <>
      <Outlet />
      <AuthSidebar />
    </>
  )
}
