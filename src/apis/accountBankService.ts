import axiosInstance from '@/utils/axiosInstance'
import type { ICreateBankAccount, IUpdateBankAccount, IUpdateStatusBankAccount } from '@/types/accountBank'

export const accountBankService = {
  createBankAccount: async (body: ICreateBankAccount) => {
    const res = await axiosInstance.post('/accounts/bank', body)
    return res.data.data
  },
  getAllBankAccountsByUserId: async () => {
    const res = await axiosInstance.get('/accounts/bank/my-accounts')
    return res.data.data
  },
  getBankAccountById: async (id: string) => {
    const res = await axiosInstance.get(`/accounts/bank/${id}`)
    return res.data.data
  },
  updateBankAccountById: async (id: string, body: IUpdateBankAccount) => {
    const res = await axiosInstance.put(`/accounts/bank/${id}`, body)
    return res.data.data
  },
  updateStatusBankAccountById: async (id: string, body: IUpdateStatusBankAccount) => {
    const res = await axiosInstance.patch(`/accounts/bank/status/${id}`, body)
    return res.data.data
  },
  deleteBankAccountById: async (id: string) => {
    const res = await axiosInstance.delete(`/accounts/bank/${id}`)
    return res.data.data
  }
}
