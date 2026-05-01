import { create } from 'zustand'
import { accountBankService } from '@/apis/accountBankService'
import type { IBankAccount, ICreateBankAccount, IUpdateStatusBankAccount } from '@/types/accountBank'

// ─── State ─────────────────────────────────────────────────────────────────────
interface BankAccountState {
  accounts: IBankAccount[]
  loading: boolean

  // ── Actions ────────────────────────────────────────────────────────────────
  fetchAccounts: () => Promise<void>
  createAccount: (data: ICreateBankAccount) => Promise<{ success: boolean; message: string }>
  toggleStatus: (id: string) => Promise<{ success: boolean; message: string }>
  deleteAccount: (id: string) => Promise<{ success: boolean; message: string }>
}

// ─── Store ─────────────────────────────────────────────────────────────────────
export const useBankAccountStore = create<BankAccountState>((set, get) => ({
  accounts: [],
  loading: false,

  // ── Fetch all bank accounts of current user ─────────────────────────────────
  fetchAccounts: async () => {
    set({ loading: true })
    try {
      const res = await accountBankService.getAllBankAccountsByUserId()
      set({ accounts: Array.isArray(res) ? res : [] })
    } catch (error) {
      console.error('fetchAccounts failed:', error)
    } finally {
      set({ loading: false })
    }
  },

  // ── Create new bank account ─────────────────────────────────────────────────
  createAccount: async (data: ICreateBankAccount) => {
    const { accounts } = get()

    // Guard: duplicate bank
    if (accounts.some((a) => a.bankShortName === data.bankShortName)) {
      return { success: false, message: 'Tài khoản ngân hàng này đã tồn tại' }
    }

    // Guard: max 4 accounts
    if (accounts.length >= 4) {
      return { success: false, message: 'Bạn chỉ có thể thêm tối đa 4 tài khoản' }
    }

    set({ loading: true })
    try {
      const res = await accountBankService.createBankAccount(data)
      set((s) => ({ accounts: [...s.accounts, res] }))
      return { success: true, message: `Tài khoản ${data.bankShortName} đã được kết nối.` }
    } catch (error) {
      console.error('createAccount failed:', error)
      return { success: false, message: 'Không thể thêm tài khoản, vui lòng thử lại' }
    } finally {
      set({ loading: false })
    }
  },

  // ── Toggle active / inactive ────────────────────────────────────────────────
  toggleStatus: async (id: string) => {
    const account = get().accounts.find((a) => a._id === id)
    if (!account) return { success: false, message: 'Tài khoản không tồn tại' }

    const newStatus: IUpdateStatusBankAccount['status'] = account.status === 'active' ? 'inactive' : 'active'

    set({ loading: true })
    try {
      await accountBankService.updateStatusBankAccountById(id, { status: newStatus })
      set((s) => ({
        accounts: s.accounts.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      }))
      const label = newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'
      return { success: true, message: `Đã ${label} tài khoản ${account.bankShortName}` }
    } catch (error) {
      console.error('toggleStatus failed:', error)
      return { success: false, message: 'Cập nhật trạng thái thất bại' }
    } finally {
      set({ loading: false })
    }
  },

  // ── Delete bank account ─────────────────────────────────────────────────────
  deleteAccount: async (id: string) => {
    set({ loading: true })
    try {
      await accountBankService.deleteBankAccountById(id)
      set((s) => ({ accounts: s.accounts.filter((a) => a._id !== id) }))
      return { success: true, message: 'Tài khoản đã được xóa.' }
    } catch (error) {
      console.error('deleteAccount failed:', error)
      return { success: false, message: 'Xóa tài khoản thất bại' }
    } finally {
      set({ loading: false })
    }
  }
}))
