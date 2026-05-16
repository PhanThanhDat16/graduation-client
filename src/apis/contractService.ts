import type { ApiResponse, PaginatedResponse } from '@/types/utils'
import type {
  Contract,
  ContractCreateParams,
  ContractQueryParams,
  ContractUpdateParams,
  SubmitContractPayload
} from '@/types/contract'
import axiosInstance from '@/utils/axiosInstance'

export const contractService = {
  // 1. Tạo hợp đồng mới (Dành cho Contractor)
  createContract: async (body: ContractCreateParams) => {
    return await axiosInstance.post<ApiResponse<Contract>>('/contracts', body)
  },

  // 2. Lấy danh sách hợp đồng của tôi (Freelancer hoặc Contractor đang login)
  getMyContracts: async (params?: ContractQueryParams) => {
    return await axiosInstance.get<PaginatedResponse<Contract>>('/contracts/me', { params })
  },

  // 3. Lấy chi tiết 1 Hợp đồng
  getContractById: async (id: string) => {
    return await axiosInstance.get<ApiResponse<Contract>>(`/contracts/${id}`)
  },

  // 4. Cập nhật Hợp đồng (Khi đang ở draft hoặc pending_agreement)
  updateContract: async (id: string, body: ContractUpdateParams) => {
    return await axiosInstance.put<ApiResponse<Contract>>(`/contracts/${id}`, body)
  },

  // 5. Chấp thuận Hợp đồng (Cả 2 bên đều phải gọi hàm này)
  agreeToContract: async (id: string) => {
    return await axiosInstance.post<ApiResponse<null>>(`/contracts/${id}/agree`)
  },

  payContract: async (id: string) => {
    return await axiosInstance.post<ApiResponse<null>>(`/contracts/${id}/pay`)
  },

  // Freelancer nộp sản phẩm
  submitContract: (id: string, data: SubmitContractPayload) => {
    axiosInstance.post(`/contracts/${id}/submit`, data)
  },
  // Khách hàng nghiệm thu (Giải ngân)
  completeContract: async (id: string) => {
    return await axiosInstance.post<ApiResponse<null>>(`/contracts/${id}/complete`)
  },

  // 9. Huỷ hợp đồng (Chỉ huỷ được ở giai đoạn sớm)
  cancelContract: async (id: string) => {
    return await axiosInstance.post<ApiResponse<null>>(`/contracts/${id}/cancel`)
  },

  // 10. Gia hạn Hợp đồng
  extendDeadline: async (id: string, deadline: string) => {
    return await axiosInstance.post<ApiResponse<null>>(`/contracts/${id}/extend`, { deadline })
  }
}
