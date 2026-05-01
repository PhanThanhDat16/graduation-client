// ─── Wallet Types ─────────────────────────────────────────────────────────────

export type Page = 'wallet' | 'add-funds' | 'withdraw' | 'withdraw-requests' | 'bank-accounts'

export type TransactionType = 'deposit' | 'withdraw' | 'escrow_release' | 'admin_fee' | 'escrow_deposit' | 'refund'
export type PaymentMethod = 'vnpay' | 'momo' | 'wallet'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type WithdrawStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export interface Transaction {
  _id: string
  wallet_id: string
  amount: number
  type: TransactionType
  method_payment: PaymentMethod
  status: TransactionStatus
  user_id?: string
  contract_id?: string
  payer_type?: 'contractor' | 'freelancer' | 'admin'
  description?: string
  createdAt: string
  payment_order_id?: string
  payment_request_id?: string
  payment_order_info?: string
  vnp_ResponseCode?: string
  vnp_TransactionNo?: string
  vnp_PayDate?: string
}

export interface Wallet {
  _id: string
  user_id: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  message: string
  data: T[]
  pagination: Pagination
}

export interface PopulatedAccount {
  _id: string
  userId: {
    _id: string
    name: string
    avatar: string
    email: string
  }
  bankShortName: string
  accountNumber: string
  accountName: string
  logo: string
}

export interface WithdrawRequest {
  _id: string
  account_id: PopulatedAccount | string
  amount: number
  amountReceived: number
  status: WithdrawStatus
  admin_id?: string
  createdAt: string
  processed_at?: string
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface DepositRequest {
  amount: number
  method_payment: PaymentMethod
}

export interface CreateWithdrawRequest {
  amount: number
  account_id: string
}

export interface TransactionFilter {
  page?: number
  limit?: number
  type?: TransactionType
  method_payment?: PaymentMethod
  status?: TransactionStatus
}

export interface WithdrawRequestFilter {
  page?: number
  limit?: number
  status?: WithdrawStatus
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface BalanceResponse {
  message: string
  data: { balance: number }
}

export interface WalletResponse {
  message: string
  data: Wallet
}

export interface DepositResponse {
  message: string
  data: {
    wallet: Wallet
    transaction: Transaction
  }
}

export interface TransactionApiResponse {
  message: string
  data: Transaction[]
  pagination: Pagination
}

export interface WithdrawRequestResponse {
  message: string
  data: WithdrawRequest
}

export interface WithdrawRequestListResponse {
  message: string
  data: WithdrawRequest[]
  pagination: Pagination
}
