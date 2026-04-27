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
import ProjectsPage from '@/pages/ProjectsPage'
// import PostProjectPage from '@/pages/PostProjectPage'
import ProfilePage from '@/pages/ProfilePage'
import FreelancersPage from '@/pages/FreelancersPage'
import WalletPage from '@/pages/WalletPage/walletPage'
import AddFundsPage from '@/pages/WalletPage/addFundsPage'
import WithdrawPage from '@/pages/WalletPage/withdrawsPage'
import RequestWithdrawPage from '@/pages/WalletPage/requestWithdrawPage'
import BankAccountPage from '@/pages/WalletPage/bankAccountPage'
import PaymentResultPage from '@/components/components-wallet/notification-payment'
import ManageProjectsPage from '@/pages/ManageProjectsPage'
import DashboardLayout from '@/layouts/DashboardLayout'
import ContractsPage from '@/pages/ContractListPage'
import ContractAgreementPage from '@/pages/ContractAgreementPage'
import ContractWorkspacePage from '@/pages/ContractWorkspacePage'
import MessagesPage from '@/pages/MessagesPage'
import DashboardPage from '@/pages/DashboardPage/DashboardPage'
import SubmitProposalPage from '@/pages/SubmitProposalPage'
import NotificationsPage from '@/pages/NotificationsPage'
import MyApplicationsPage from '@/pages/MyApplicationsPage/MyApplicationsPage'
import ProjectApplicationsPage from '@/pages/ProjectApplicationsPage/ProjectApplicationsPage'
import EditProjectPage from '@/pages/EditProjectPage'
import PostProjectPage from '@/pages/PostProjectPage'
import ContractCreatePage from '@/pages/ContractCreatePage'
import ContractDetailPage from '@/pages/ContractDetailPage'
import GoogleAuthSuccessPage from '@/pages/GoogleAuthSuccessPage'

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={path.AUTH_SUCCESS} element={<GoogleAuthSuccessPage />} />
          <Route path={path.HOME_PAGE} element={<HomePage />} />
          <Route path={path.PROJECTS} element={<ProjectsPage />} />
          <Route path={path.PROJECT_DETAIL} element={<ProjectDetailPage />} />
          <Route path={path.FREELANCERS} element={<FreelancersPage />} />
          <Route path={path.PAYMENT_RESULT} element={<PaymentResultPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path={path.POST_PROJECT} element={<PostProjectPage />} />
            <Route path={path.EDIT_PROJECT} element={<EditProjectPage />} />
            <Route path={path.PROFILE} element={<ProfilePage />} />
            <Route path={path.FREELANCER_DETAIL} element={<ProfilePage />} />
            <Route path={path.SUBMIT_PROPOSAL} element={<SubmitProposalPage />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path={path.DASHBOARD} element={<DashboardPage />} />
            <Route path={path.MANAGE_PROJECTS} element={<ManageProjectsPage />} />
            <Route path={path.CONTRACTS} element={<ContractsPage />} />
            <Route path={path.CONTRACTS_AGREEMENT} element={<ContractAgreementPage />} />
            <Route path={path.CONTRACTS_WORKSPACE} element={<ContractWorkspacePage />} />
            <Route path={path.MESSAGES} element={<MessagesPage />} />
            <Route path={path.MY_APPLYCATIONS} element={<MyApplicationsPage />} />
            <Route path={path.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={path.WALLET} element={<WalletPage />} />
            <Route path={path.ADD_FUNDS} element={<AddFundsPage />} />
            <Route path={path.WITHDRAW} element={<WithdrawPage />} />
            <Route path={path.WITHDRAW_REQUESTS} element={<RequestWithdrawPage />} />
            <Route path={path.BANK_ACCOUNTS} element={<BankAccountPage />} />
            <Route path={path.PROJECT_APPLICATIONS} element={<ProjectApplicationsPage />} />
            <Route path={path.CONTRACT_CREATE} element={<ContractCreatePage />} />
            <Route path={path.CONTRACT_DETAIL} element={<ContractDetailPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRouteLogin />}>
          <Route element={<AuthLayout />}>
            <Route path={path.REGISTER} element={<RegisterPage />} />
            <Route path={path.LOGIN} element={<LoginPage />} />
            <Route path={path.VERIFY_OTP} element={<VerifyOtpPage />} />
            <Route path={path.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={path.PASSWORD_SEND} element={<PasswordSentPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouters
