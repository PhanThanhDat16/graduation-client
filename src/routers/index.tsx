import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts'
import { HOME_PAGE } from '../constants'
import NotFoundPage from '../pages/NotFoundPage'
import PrivateRoute from './PrivateRoute'
import PrivateRouteLogin from './PrivateRouteLogin'
import HomePage from '../pages/HomePage'

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path={HOME_PAGE} element={<MainLayout />}>
            <Route index element={<HomePage />} />
            {/* main page */}
          </Route>
        </Route>

        <Route element={<PrivateRouteLogin />}>{/* login and register page */}</Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouters
