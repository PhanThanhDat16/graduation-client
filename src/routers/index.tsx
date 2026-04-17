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
import WalletLayout from '@/layouts/WalletLayout/WalletLayout'
import WalletDashboard from '@/pages/WalletPage/walletPage'
import AddFundsPage from '@/pages/WalletPage/addFundsPage'
import WithdrawPage from '@/pages/WalletPage/withdrawsPage'
import RequestWithdrawPage from '@/pages/WalletPage/requestWithdrawPage'
import BankAccountPage from '@/pages/WalletPage/bankAccountPage'
import PaymentResultPage from '@/components/components-wallet/notification-payment'
import ManageProjectsPage from '@/pages/ManageProjectsPage'
import DashboardLayout from '@/layouts/DashboardLayout'
//import WalletPage from '@/pages/WalletPage'
import ContractsPage from '@/pages/ContractsPage'
import ContractAgreementPage from '@/pages/ContractAgreementPage'
import ContractWorkspacePage from '@/pages/ContractWorkspacePage'
import MessagesPage from '@/pages/MessagesPage'
import DashboardPage from '@/pages/DashboardPage'
import SubmitProposalPage from '@/pages/SubmitProposalPage'
import MyProposalsPage from '@/pages/MyProposalsPage'
import NotificationsPage from '@/pages/NotificationsPage'

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={path.HOME_PAGE} element={<HomePage />} />
          <Route path={path.PROJECTS} element={<ProjectListPage />} />
          <Route path={path.PROJECT_DETAIL} element={<ProjectDetailPage />} />
          <Route path={path.FREELANCERS} element={<FreelancersPage />} />
          <Route path={path.PAYMENT_RESULT} element={<PaymentResultPage />} />

          {/* Wallet sub-pages share the WalletLayout sidebar */}
          <Route element={<WalletLayout />}>
            <Route path={path.WALLET} element={<WalletDashboard />} />
            <Route path={path.ADD_FUNDS} element={<AddFundsPage />} />
            <Route path={path.WITHDRAW} element={<WithdrawPage />} />
            <Route path={path.WITHDRAW_REQUESTS} element={<RequestWithdrawPage />} />
            <Route path={path.BANK_ACCOUNTS} element={<BankAccountPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path={path.POST_PROJECT} element={<PostProjectPage />} />
            <Route path={path.PROFILE} element={<ProfilePage />} />
            <Route path={path.FREELANCER_DETAIL} element={<ProfilePage />} />
            <Route path={path.SUBMIT_PROPOSAL} element={<SubmitProposalPage />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path={path.DASHBOARD} element={<DashboardPage />} />
            <Route path={path.MANAGE_PROJECTS} element={<ManageProjectsPage />} />
            <Route path={path.WALLET} element={<WalletPage />} />
            <Route path={path.CONTRACTS} element={<ContractsPage />} />
            <Route path={path.CONTRACT_AGREEMENT} element={<ContractAgreementPage />} />
            <Route path={path.CONTRACT_WORKSPACE} element={<ContractWorkspacePage />} />
            <Route path={path.MESSAGES} element={<MessagesPage />} />
            <Route path={path.MY_PROPOSALS} element={<MyProposalsPage />} />
            <Route path={path.NOTIFICATIONS} element={<NotificationsPage />} />
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
