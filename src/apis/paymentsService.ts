import axiosInstance from '../utils/axiosInstance'

export const paymentService = {
  // ─── MOMO ───
  createPaymentMoMo: async (body: { amount: number; type: string; method: string; description: string }) => {
    const res = await axiosInstance.post('/payment/momo/create', body)
    return res.data
  },

  getPaymentMoMo: async (id: string) => {
    const res = await axiosInstance.get(`/payment/momo/${id}`)
    return res.data
  },

  getPaymentsMoMo: async () => {
    const res = await axiosInstance.get('/payment/momo')
    return res.data
  },
  getPaymentByCodeMoMo: async (code: string) => {
    const res = await axiosInstance.get(`/payment/momo/code/${code}`)
    return res.data
  },
  // ─── VNPay ───
  createPaymentVNPay: async (body: { amount: number; type: string; method: string; description: string }) => {
    const res = await axiosInstance.post('/payment/vnpay/create', body)
    return res.data
  },
  getPaymentVNPay: async (id: string) => {
    const res = await axiosInstance.get(`/payment/vnpay/${id}`)
    return res.data
  },

  getPaymentsVNPay: async () => {
    const res = await axiosInstance.get('/payment/vnpay')
    return res.data
  },

  getPaymentByCodeVNPay: async (code: string) => {
    const res = await axiosInstance.get(`/payment/vnpay/code/${code}`)
    return res.data
  }
}
