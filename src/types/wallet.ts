// ─── Wallet Types ─────────────────────────────────────────────────────────────

export type Page = 'wallet' | 'add-funds' | 'withdraw' | 'withdraw-requests' | 'bank-accounts'

export type TransactionType = 'deposit' | 'withdraw' | 'escrowRelease' | 'adminFee' | 'escrowDeposit' | 'refund'
export type PaymentMethod = 'vnpay' | 'momo' | 'wallet'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type WithdrawStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export interface Transaction {
  _id: string
  walletId: string
  amount: number
  type: TransactionType
  methodPayment: PaymentMethod
  status: TransactionStatus
  userId?: string
  contractId?: string
  payerType?: 'contractor' | 'freelancer' | 'admin'
  description?: string
  createdAt: string
  paymentOrderId?: string
  paymentRequestId?: string
  paymentOrderInfo?: string
  vnpResponseCode?: string
  vnpTransactionNo?: string
  vnpPayDate?: string
}

export interface Wallet {
  _id: string
  userId: string
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
  accountId: PopulatedAccount | string
  amount: number
  amountReceived: number
  status: WithdrawStatus
  adminId?: string
  createdAt: string
  processedAt?: string
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface DepositRequest {
  amount: number
  methodPayment: PaymentMethod
}

export interface CreateWithdrawRequest {
  amount: number
  accountId: string
}

export interface TransactionFilter {
  page?: number
  limit?: number
  type?: TransactionType
  methodPayment?: PaymentMethod
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
