import { create } from 'zustand'
import { paymentService } from '@/apis/paymentsService'

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface CreatePaymentBody {
  amount: number
  type: string
  method: string
  description: string
}

interface PaymentState {
  loading: boolean
  error: string | null

  // ── Actions ────────────────────────────────────────────────────────────────
  createMoMoPayment: (body: CreatePaymentBody) => Promise<{ payUrl?: string } | null>
  createVNPayPayment: (body: CreatePaymentBody) => Promise<{ paymentUrl?: string } | null>
  getMoMoPayment: (id: string) => Promise<any>
  getVNPayPayment: (id: string) => Promise<any>
  getMoMoPaymentByCode: (code: string) => Promise<any>
  getVNPayPaymentByCode: (code: string) => Promise<any>
  clearError: () => void
}

// ─── Store ─────────────────────────────────────────────────────────────────────
export const usePaymentStore = create<PaymentState>((set) => ({
  loading: false,
  error: null,

  // ── Create MoMo payment → returns payUrl ────────────────────────────────────
  createMoMoPayment: async (body: CreatePaymentBody) => {
    set({ loading: true, error: null })
    try {
      const res = await paymentService.createPaymentMoMo(body)
      return res.data // { payUrl: '...' }
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Tạo thanh toán MoMo thất bại.'
      set({ error: msg })
      return null
    } finally {
      set({ loading: false })
    }
  },

  // ── Create VNPay payment → returns paymentUrl ───────────────────────────────
  createVNPayPayment: async (body: CreatePaymentBody) => {
    set({ loading: true, error: null })
    try {
      const res = await paymentService.createPaymentVNPay(body)
      return res.data // { paymentUrl: '...' }
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Tạo thanh toán VNPay thất bại.'
      set({ error: msg })
      return null
    } finally {
      set({ loading: false })
    }
  },

  // ── Get payment detail ──────────────────────────────────────────────────────
  getMoMoPayment: async (id: string) => {
    set({ loading: true })
    try {
      const res = await paymentService.getPaymentMoMo(id)
      return res.data
    } catch (e: any) {
      set({ error: e?.response?.data?.message || 'Lỗi khi lấy thông tin MoMo' })
      return null
    } finally {
      set({ loading: false })
    }
  },

  getVNPayPayment: async (id: string) => {
    set({ loading: true })
    try {
      const res = await paymentService.getPaymentVNPay(id)
      return res.data
    } catch (e: any) {
      set({ error: e?.response?.data?.message || 'Lỗi khi lấy thông tin VNPay' })
      return null
    } finally {
      set({ loading: false })
    }
  },

  getMoMoPaymentByCode: async (code: string) => {
    set({ loading: true })
    try {
      const res = await paymentService.getPaymentByCodeMoMo(code)
      return res.data
    } catch (e: any) {
      set({ error: e?.response?.data?.message || 'Lỗi khi lấy thông tin MoMo' })
      return null
    } finally {
      set({ loading: false })
    }
  },

  getVNPayPaymentByCode: async (code: string) => {
    set({ loading: true })
    try {
      const res = await paymentService.getPaymentByCodeVNPay(code)
      return res.data
    } catch (e: any) {
      set({ error: e?.response?.data?.message || 'Lỗi khi lấy thông tin VNPay' })
      return null
    } finally {
      set({ loading: false })
    }
  },

  clearError: () => set({ error: null })
}))
