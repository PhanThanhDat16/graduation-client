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
  contractor_must_pay: number
  freelancer_must_pay: number
  contractor_remaining: number
  freelancer_remaining: number
}

export type UserSumary = Pick<UserProfile, '_id' | 'fullName' | 'avatar' | 'email'>
export type ProjectSummary = Pick<Project, '_id' | 'title' | 'description'>
// Cấu trúc một Hợp đồng (Lấy từ API)
export interface Contract {
  _id: string
  project_id: ProjectSummary
  application_id: string
  contractor_id: UserSumary
  freelancer_id: UserSumary
  description: string
  contractor_terms: string
  freelancer_terms: string

  total_amount: number
  admin_fee: number
  freelancer_deposit: number

  contractor_agreed: boolean
  freelancer_agreed: boolean
  deadline: string // ISO Date string

  contractor_paid: boolean
  freelancer_paid: boolean
  contractor_paid_amount: number
  freelancer_paid_amount: number

  status: ContractStatus
  escrow_status: EscrowStatus

  total_escrow_amount: number
  released_to_freelancer: number
  refunded_to_contractor: number
  refunded_to_freelancer: number
  admin_fee_collected: number

  payment_info: PaymentInfo

  createdAt: string
  updatedAt: string
}

// Params để Tạo Hợp đồng mới
export interface ContractCreateParams {
  project_id: string
  application_id: string
  freelancer_id: string
  description?: string
  contractor_terms?: string
  freelancer_terms?: string
  total_amount: number
  admin_fee?: number
  freelancer_deposit?: number
  deadline: string
}

// Params để Update Hợp đồng
export type ContractUpdateParams = Partial<
  Omit<ContractCreateParams, 'project_id' | 'application_id' | 'freelancer_id'>
>

// Params Query khi lấy danh sách
export interface ContractQueryParams {
  page?: number
  limit?: number
  status?: ContractStatus
  escrow_status?: EscrowStatus
  contractor_id?: string
  freelancer_id?: string
}
