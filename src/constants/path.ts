const path = {
  // public
  HOME_PAGE: '/',
  AUTH_SUCCESS: '/auth/success',
  // ABOUT: '/about',
  // CONTACT: '/contact',

  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  PASSWORD_SEND: '/password-send',

  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  FREELANCERS: '/freelancers',
  FREELANCER_DETAIL: '/freelancers/:id',
  SUBMIT_PROPOSAL: '/submit-proposal/:projectId',

  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  WALLET: '/wallet',
  ADD_FUNDS: '/add-funds',
  WITHDRAW: '/withdraw',
  WITHDRAW_REQUESTS: '/withdraw-requests',
  BANK_ACCOUNTS: '/bank-accounts',
  PAYMENT_RESULT: '/payment-result',
  POST_PROJECT: '/post-project',
  EDIT_PROJECT: '/edit-project/:id',
  MANAGE_PROJECTS: '/manage-projects',
  PROJECT_APPLICATIONS: '/manage-projects/:projectId/applications',
  MY_APPLYCATIONS: '/applications/my',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  FREELANCERS: '/freelancers',

  CONTRACTS: '/contracts', // Danh sách tất cả hợp đồng
  CONTRACT_CREATE: '/contracts/create/:applicationId',
  CONTRACT_DETAIL: '/contracts/:id',
  CONTRACTS_AGREEMENT: '/contracts/agreement/:id', // Trang Thỏa thuận & Ký tên 24h
  CONTRACTS_WORKSPACE: '/contracts/workspace/:id', // Phòng làm việc & Bàn giao (Bước 9, 10)
  SETTINGS: '/settings'
}

export default path
