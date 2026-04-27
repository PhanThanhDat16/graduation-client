import axiosInstance from '../utils/axiosInstance'
import type {
  DepositRequest,
  CreateWithdrawRequest,
  TransactionFilter,
  WithdrawRequestFilter,
  BalanceResponse,
  WalletResponse,
  DepositResponse,
  TransactionApiResponse,
  WithdrawRequestResponse,
  WithdrawRequestListResponse
} from '@/types/wallet'

export const walletService = {
  // ─── User: Balance ────────────────────────────────────────────────────────────
  getBalance: async () => {
    const res = await axiosInstance.get<BalanceResponse>('/wallets/balance')
    return res.data
  },

  // ─── User: My Wallet ──────────────────────────────────────────────────────────
  getWallet: async () => {
    const res = await axiosInstance.get<WalletResponse>('/wallets/me')
    return res.data
  },

  // ─── User: Deposit ────────────────────────────────────────────────────────────
  deposit: async (body: DepositRequest) => {
    const res = await axiosInstance.post<DepositResponse>('/wallets/deposit', body)
    return res.data
  },

  // ─── User: Transaction History ────────────────────────────────────────────────
  getTransactions: async (filter?: TransactionFilter) => {
    const res = await axiosInstance.get<TransactionApiResponse>('/wallets/transactions', {
      params: filter
    })
    return res.data
  },

  // ─── User: Create Withdraw Request ────────────────────────────────────────────
  createWithdrawRequest: async (body: CreateWithdrawRequest) => {
    const res = await axiosInstance.post<WithdrawRequestResponse>('/wallets/withdraw-requests', body)
    return res.data
  },

  // ─── User: My Withdraw Requests ───────────────────────────────────────────────
  getWithdrawRequests: async (filter?: WithdrawRequestFilter) => {
    const res = await axiosInstance.get<WithdrawRequestListResponse>('/wallets/withdraw-requests', {
      params: filter
    })
    return res.data
  },

  // ─── User: Cancel Withdraw Request ────────────────────────────────────────────
  cancelWithdrawRequest: async (id: string) => {
    const res = await axiosInstance.delete(`/wallets/withdraw-requests/${id}`)
    return res.data
  }
}
