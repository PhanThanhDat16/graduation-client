// Các trạng thái của một Dispute (Tranh chấp)
export type DisputeStatus =
  | 'pending_reasons'
  | 'waiting_escalation'
  | 'open'
  | 'negotiating'
  | 'admin_review'
  | 'resolved'
  | 'auto_closed'
  | 'staff_cancelled'

// Các loại hình giải quyết tranh chấp
export type ResolutionType = 'extend' | 'cancel' | 'split'

// Interface chính của Dispute trả về từ API
export interface Dispute {
  _id: string
  contractId: string | any // Có thể là string ID hoặc object Contract nếu populate
  contractorId: string | any
  freelancerId: string | any
  openedBy: string | any
  status: DisputeStatus
  resolutionType?: ResolutionType
  contractorReason?: string
  freelancerReason?: string
  contractorRequestedResolution?: string
  freelancerRequestedResolution?: string
  contractorAgreed?: boolean
  freelancerAgreed?: boolean
  freelancerAmount?: number
  contractorAmount?: number
  newDeadline?: string
  reasonDeadline?: string // Deadline 1 tiếng
  escalatedBy?: string | any
  staffId?: string | any
  staffCancelReason?: string
  staffDecision?: string
  escalatedAt?: string
  createdAt: string
  resolvedAt?: string
}

// Payload cho API Mở Dispute
export interface CreateDisputePayload {
  contractId: string
  reason: string
}

// Payload cho API Điền lời khai (Submit Reason)
export interface SubmitReasonPayload {
  reason: string
  requestedResolution: string
}

// Payload cho API Đề xuất thương lượng
export interface ProposeResolutionPayload {
  resolutionType: ResolutionType
  freelancerAmount?: number
  contractorAmount?: number
  newDeadline?: string
}
