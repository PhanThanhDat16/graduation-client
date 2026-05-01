import { create } from 'zustand'
import { walletService } from '@/apis/walletService'
import type {
  Transaction,
  Pagination,
  TransactionFilter,
  WithdrawRequest,
  WithdrawRequestFilter,
  CreateWithdrawRequest
} from '@/types/wallet'
import { toast } from 'react-toastify'

// ─── State ─────────────────────────────────────────────────────────────────────
interface WalletState {
  // Balance
  balance: number
  balanceLoading: boolean

  // Transactions
  transactions: Transaction[]
  pagination: Pagination
  txLoading: boolean

  // Withdraw requests (user)
  withdrawRequests: WithdrawRequest[]
  withdrawRequestsLoading: boolean

  // Mutation loading
  loading: boolean

  // ── Actions ────────────────────────────────────────────────────────────────
  fetchBalance: () => Promise<void>
  fetchTransactions: (filter?: TransactionFilter) => Promise<void>
  fetchWithdrawRequests: (filter?: WithdrawRequestFilter) => Promise<void>
  createWithdrawRequest: (body: CreateWithdrawRequest) => Promise<boolean>
  cancelWithdrawRequest: (id: string) => Promise<boolean>
}

// ─── Store ─────────────────────────────────────────────────────────────────────
export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  balanceLoading: false,

  transactions: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  txLoading: false,

  withdrawRequests: [],
  withdrawRequestsLoading: false,

  loading: false,

  // ── Fetch balance ───────────────────────────────────────────────────────────
  fetchBalance: async () => {
    set({ balanceLoading: true })
    try {
      const res = await walletService.getBalance()
      set({ balance: res.data.balance })
    } catch (error) {
      console.error('fetchBalance failed:', error)
    } finally {
      set({ balanceLoading: false })
    }
  },

  // ── Fetch transaction history ───────────────────────────────────────────────
  fetchTransactions: async (filter?: TransactionFilter) => {
    set({ txLoading: true })
    try {
      const res = await walletService.getTransactions(filter)
      set({ transactions: res.data, pagination: res.pagination })
    } catch (error) {
      console.error('fetchTransactions failed:', error)
    } finally {
      set({ txLoading: false })
    }
  },

  // ── Fetch my withdraw requests ──────────────────────────────────────────────
  fetchWithdrawRequests: async (filter?: WithdrawRequestFilter) => {
    set({ withdrawRequestsLoading: true })
    try {
      const res = await walletService.getWithdrawRequests(filter)
      set({ withdrawRequests: res.data })
    } catch (error) {
      console.error('fetchWithdrawRequests failed:', error)
    } finally {
      set({ withdrawRequestsLoading: false })
    }
  },

  // ── Create withdraw request ─────────────────────────────────────────────────
  createWithdrawRequest: async (body: CreateWithdrawRequest) => {
    set({ loading: true })
    try {
      await walletService.createWithdrawRequest(body)
      // refresh balance after request
      await get().fetchBalance()
      toast.success('Yêu cầu rút tiền đã được tạo thành công!')
      return true
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Tạo yêu cầu rút tiền thất bại.'
      toast.error(msg)
      return false
    } finally {
      set({ loading: false })
    }
  },

  // ── Cancel withdraw request ─────────────────────────────────────────────────
  cancelWithdrawRequest: async (id: string) => {
    set({ loading: true })
    try {
      await walletService.cancelWithdrawRequest(id)
      set((s) => ({ withdrawRequests: s.withdrawRequests.filter((r) => r._id !== id) }))
      toast.success('Đã hủy yêu cầu rút tiền.')
      return true
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Hủy yêu cầu thất bại.')
      return false
    } finally {
      set({ loading: false })
    }
  }
}))
