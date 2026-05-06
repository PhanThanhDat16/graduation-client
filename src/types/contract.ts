import type { Project } from './project'
import type { UserProfile } from './user'

// Các trạng thái của Hợp đồng
export type ContractStatus =
  | 'draft' // Bản nháp (Đang soạn)
  | 'pending_agreement' // Chờ 2 bên đồng ý
  | 'waiting_payment' // Chờ thanh toán cọc
  | 'running' // Đang thực hiện
  | 'submitted' // Freelancer đã nộp bài
  | 'completed' // Đã hoàn thành (Nghiệm thu)
  | 'dispute' // Đang tranh chấp
  | 'cancelled' // Đã huỷ

// Trạng thái giữ tiền (Escrow)
export type EscrowStatus = 'pending' | 'holding' | 'released' | 'refunded' | 'disputed'

// Thông tin thanh toán (API tính sẵn)
export interface PaymentInfo {
  contractorMustPay: number
  freelancerMustPay: number
  contractorRemaining: number
  freelancerRemaining: number
}

export type UserSumary = Pick<UserProfile, '_id' | 'fullName' | 'avatar' | 'email'>
export type ProjectSummary = Pick<Project, '_id' | 'title' | 'description'>
// Cấu trúc một Hợp đồng (Lấy từ API)
export interface Contract {
  _id: string
  projectId: ProjectSummary
  applicationId: string
  contractorId: UserSumary
  freelancerId: UserSumary
  description: string
  contractorTerms: string
  freelancerTerms: string

  totalAmount: number
  adminFee: number
  freelancerDeposit: number

  contractorAgreed: boolean
  freelancerAgreed: boolean
  deadline: string // ISO Date string

  contractorPaid: boolean
  freelancerPaid: boolean
  contractorPaidAmount: number
  freelancerPaidAmount: number

  status: ContractStatus
  escrowStatus: EscrowStatus

  totalEscrowAmount: number
  releasedToFreelancer: number
  refundedToContractor: number
  refundedToFreelancer: number
  adminFeeCollected: number

  paymentInfo: PaymentInfo

  createdAt: string
  updatedAt: string
}

// Params để Tạo Hợp đồng mới
export interface ContractCreateParams {
  projectId: string
  applicationId: string
  freelancerId: string
  description?: string
  contractorTerms?: string
  freelancerTerms?: string
  totalAmount: number
  adminFee?: number
  freelancerDeposit?: number
  deadline: string
}

// Params để Update Hợp đồng
export type ContractUpdateParams = Partial<Omit<ContractCreateParams, 'projectId' | 'applicationId' | 'freelancerId'>>

//Nộp sản phẩm
export interface SubmitContractPayload {
  githubLink?: string
  webLink?: string
}
// Params Query khi lấy danh sách
export interface ContractQueryParams {
  page?: number
  limit?: number
  status?: ContractStatus
  escrowStatus?: EscrowStatus
  contractorId?: string
  freelancerId?: string
}
