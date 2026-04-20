const path = {
  // public
  HOME_PAGE: '/',
  // ABOUT: '/about',
  // CONTACT: '/contact',

  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  PASSWORD_SEND: '/password-send',

  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  FREELANCER_DETAIL: '/freelancers/:id',
  SUBMIT_PROPOSAL: '/submit-proposal/:id',

  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  FREELANCERS: '/freelancers',
  WALLET: '/wallet',
  ADD_FUNDS: '/wallet/add-funds',
  WITHDRAW: '/wallet/withdraw',
  WITHDRAW_REQUESTS: '/wallet/withdraw-requests',
  BANK_ACCOUNTS: '/wallet/bank-accounts',
  PAYMENT_RESULT: '/payment-result',
  POST_PROJECT: '/post-project',
  MANAGE_PROJECTS: '/manage-projects',
  MY_PROPOSALS: '/my-proposals',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',

  CONTRACTS: '/contracts', // Danh sách tất cả hợp đồng
  CONTRACT_AGREEMENT: '/contracts/agreement/:id', // Trang Thỏa thuận & Ký tên 24h
  CONTRACT_WORKSPACE: '/contracts/workspace/:id' // Phòng làm việc & Bàn giao (Bước 9, 10)
}

export default path
