import axiosInstance from '@/utils/axiosInstance'
import type { CreateDisputePayload, SubmitReasonPayload, ProposeResolutionPayload } from '@/types/dispute'

export const disputeService = {
  // 1. Xem Dispute theo Contract ID (Rất quan trọng để FE biết contract này có đang bị dispute hay không)
  getDisputeByContract: (contractId: string) => axiosInstance.get(`/disputes/contract/${contractId}`),

  // 2. Lấy chi tiết 1 Dispute
  getDisputeById: (id: string) => axiosInstance.get(`/disputes/${id}`),

  // 3. Quét kiểm tra xem hết 1 tiếng chưa
  checkDeadline: (id: string) => axiosInstance.get(`/disputes/${id}/check-deadline`),

  // 4. Mở Dispute (Bước 1)
  createDispute: (data: CreateDisputePayload) => axiosInstance.post('/disputes', data),

  // 5. Điền lời khai (Bước 2)
  submitReason: (id: string, data: SubmitReasonPayload) => axiosInstance.post(`/disputes/${id}/reason`, data),

  // 6. Yêu cầu Admin phân xử (Bước 3)
  escalateDispute: (id: string) => axiosInstance.post(`/disputes/${id}/escalate`),

  // 7. Đề xuất giải pháp (Khi Admin đã join và chuyển sang Negotiating)
  proposeResolution: (id: string, data: ProposeResolutionPayload) =>
    axiosInstance.post(`/disputes/${id}/propose`, data),

  // 8. Đồng ý với đề xuất của đối phương
  agreeResolution: (id: string) => axiosInstance.post(`/disputes/${id}/agree`)
}
