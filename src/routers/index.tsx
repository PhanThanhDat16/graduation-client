import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFoundPage from '../pages/NotFoundPage'
import PrivateRoute from './PrivateRoute'
import PrivateRouteLogin from './PrivateRouteLogin'
import LoginPage from '@/pages/LoginPage'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import AuthLayout from '@/layouts/AuthLayout/AuthLayout'
import path from '@/constants/path'
import RegisterPage from '@/pages/RegisterLayout'
import HomePage from '@/pages/HomePage'
import VerifyOtpPage from '@/pages/VerifyOtpPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import PasswordSentPage from '@/pages/PasswordSentPage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import ProjectListPage from '@/pages/ProjectsPage'
import PostProjectPage from '@/pages/PostProjectPage'
import ProfilePage from '@/pages/ProfilePage'
import FreelancersPage from '@/pages/FreelancersPage'

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={path.HOME_PAGE} element={<HomePage />} />
          <Route path={path.PROJECTS} element={<ProjectListPage />} />
          <Route path={path.PROJECT_DETAIL} element={<ProjectDetailPage />} />
          <Route path={path.FREELANCERS} element={<FreelancersPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path={path.POST_PROJECT} element={<PostProjectPage />} />
            <Route path={path.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<PrivateRouteLogin />}>
          <Route element={<AuthLayout />}>
            <Route path={path.REGISTER} element={<RegisterPage />} />
            <Route path={path.LOGIN} element={<LoginPage />} />
            <Route path={path.VERIFY_OTP} element={<VerifyOtpPage />} />
            <Route path={path.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={path.PASSWORK_SEND} element={<PasswordSentPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouters
