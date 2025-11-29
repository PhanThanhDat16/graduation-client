import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <div className="main-layout">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
