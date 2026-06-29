import { apiClient } from "./client"
import type { ApiResponse } from "./types"

// ─── Fee Heads ───────────────────────────────────────────────────────────────

export interface FeeHead {
  id: string
  tenantId: string
  name: string
  description: string | null
  isOptional: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count?: {
    sectionFeeHeads: number
    studentFeeHeads: number
    payments: number
  } | null
}

export interface CreateFeeHeadRequest {
  name: string
  description?: string
  isOptional?: boolean
  sortOrder?: number
}

// ─── Section Fees ────────────────────────────────────────────────────────────

export interface SectionFeeHead {
  id: string
  feeHeadId: string
  amount: number
  feeHead?: { id: string; name: string } | null
}

export interface SectionFee {
  id: string
  tenantId: string
  sectionId: string
  academicYearId: string
  termCount: number
  createdAt: string
  updatedAt: string
  section?: {
    id: string
    sectionName: string
    grade?: { id: string; gradeName: string } | null
  } | null
  academicYear?: { id: string; name: string } | null
  heads?: SectionFeeHead[] | null
  _count?: { studentFees: number } | null
}

export interface CreateSectionFeeRequest {
  sectionId: string
  academicYearId: string
  termCount: number
  heads: Array<{ feeHeadId: string; amount: number }>
}

// ─── Fee Terms ───────────────────────────────────────────────────────────────

export interface FeeTerm {
  id: string
  tenantId: string
  sectionFeeId: string
  name: string
  dueDate: string
  sortOrder: number
  createdAt: string
  updatedAt: string
  sectionFee?: {
    id: string
    termCount: number
    section?: { id: string; sectionName: string } | null
    academicYear?: { id: string; name: string } | null
  } | null
  _count?: { payments: number } | null
}

export interface CreateFeeTermRequest {
  sectionFeeId: string
  name: string
  dueDate: string
  sortOrder?: number
}

// ─── Student Fees ────────────────────────────────────────────────────────────

export interface StudentFeeHead {
  id: string
  feeHeadId: string
  actualAmount: number
  negotiatedAmount: number
  feeHead?: { id: string; name: string } | null
}

export interface StudentFee {
  id: string
  tenantId: string
  enrollmentId: string
  totalActualFee: number
  totalNegotiatedFee: number
  totalPaid: number
  totalRefunded: number
  balance: number

  nextDueDate: string | null
  allocationMethod: string
  discountType: string | null
  discountValue: number
  discountReason: string | null
  headWiseDiscounts: any | null
  createdAt: string
  updatedAt: string
  enrollment?: {
    id: string
    rollNumber: string
    student?: { id: string; firstName: string; lastName: string } | null
    section?: { id: string; sectionName: string } | null
  } | null
  heads?: StudentFeeHead[] | null
  _count?: { payments: number } | null
}

export interface CreateStudentFeeRequest {
  enrollmentId: string
  totalActualFee: number
  totalNegotiatedFee: number
  allocationMethod?: string
  discountType?: string
  discountValue?: number
  discountReason?: string
  headWiseDiscounts?: any
  heads: Array<{ feeHeadId: string; actualAmount: number; negotiatedAmount: number }>
}

// ─── Payments ────────────────────────────────────────────────────────────────

export interface FeePayment {
  id: string
  tenantId: string
  studentFeeId: string
  termId: string | null
  feeHeadId: string | null
  amountPaid: number
  paymentMethod: string
  transactionId: string | null
  status: string
  paymentDate: string
  remarks: string | null
  collectedById: string | null
  createdAt: string
  updatedAt: string
  studentFee?: {
    id: string
    totalActualFee: number
    totalNegotiatedFee: number
    enrollment?: {
      id: string
      rollNumber: string
      student?: { id: string; firstName: string; lastName: string } | null
    } | null
  } | null
  term?: { id: string; name: string; dueDate: string; sortOrder: number } | null
  feeHead?: { id: string; name: string } | null
  collectedBy?: { id: string; fullName: string } | null
}

export interface CreatePaymentRequest {
  studentFeeId: string
  termId?: string
  feeHeadId?: string
  amountPaid: number
  paymentMethod: string
  transactionId?: string
  status?: string
  paymentDate: string
  remarks?: string
  collectedById?: string
}

// ─── Refunds ─────────────────────────────────────────────────────────────────

export interface FeeRefund {
  id: string
  tenantId: string
  paymentId: string
  amount: number
  reason: string
  refundDate: string
  processedById: string | null
  createdAt: string
  updatedAt: string
  payment?: {
    id: string
    amountPaid: number
    paymentMethod: string
    transactionId: string | null
    studentFee?: {
      id: string
      enrollment?: {
        id: string
        student?: { id: string; firstName: string; lastName: string } | null
      } | null
    } | null
  } | null
  processedBy?: { id: string; fullName: string } | null
}

export interface CreateRefundRequest {
  paymentId: string
  amount: number
  reason: string
  refundDate: string
  processedById?: string
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export interface FeeSummary {
  totalCollected: number
  totalRefunded: number
  totalNegotiatedFee: number
  totalActualFee: number
  pendingPayments: number
  totalPayments: number
}

// ─── API Client ──────────────────────────────────────────────────────────────

export const feesApi = {
  // Fee Heads
  getFeeHeads: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: any[]; rows: FeeHead[] }>>(`/fee-heads${params ? `?${params}` : ""}`)
  },
  getFeeHead: (id: string) => apiClient.get<ApiResponse<FeeHead>>(`/fee-heads/${id}`),
  createFeeHead: (data: CreateFeeHeadRequest) => apiClient.post<ApiResponse<FeeHead>>("/fee-heads", data),
  updateFeeHead: (id: string, data: Partial<CreateFeeHeadRequest>) => apiClient.put<ApiResponse<FeeHead>>(`/fee-heads/${id}`, data),
  deleteFeeHead: (id: string) => apiClient.delete<ApiResponse<null>>(`/fee-heads/${id}`),

  // Section Fees
  getSectionFees: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: any[]; rows: SectionFee[] }>>(`/section-fees${params ? `?${params}` : ""}`)
  },
  getSectionFee: (id: string) => apiClient.get<ApiResponse<SectionFee>>(`/section-fees/${id}`),
  createSectionFee: (data: CreateSectionFeeRequest) => apiClient.post<ApiResponse<SectionFee>>("/section-fees", data),
  updateSectionFee: (id: string, data: Partial<CreateSectionFeeRequest>) => apiClient.put<ApiResponse<SectionFee>>(`/section-fees/${id}`, data),
  deleteSectionFee: (id: string) => apiClient.delete<ApiResponse<null>>(`/section-fees/${id}`),

  // Fee Terms
  getFeeTerms: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: any[]; rows: FeeTerm[] }>>(`/fee-terms${params ? `?${params}` : ""}`)
  },
  getFeeTerm: (id: string) => apiClient.get<ApiResponse<FeeTerm>>(`/fee-terms/${id}`),
  createFeeTerm: (data: CreateFeeTermRequest) => apiClient.post<ApiResponse<FeeTerm>>("/fee-terms", data),
  updateFeeTerm: (id: string, data: Partial<CreateFeeTermRequest>) => apiClient.put<ApiResponse<FeeTerm>>(`/fee-terms/${id}`, data),
  deleteFeeTerm: (id: string) => apiClient.delete<ApiResponse<null>>(`/fee-terms/${id}`),

  // Student Fees
  getStudentFees: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: any[]; rows: StudentFee[] }>>(`/student-fees${params ? `?${params}` : ""}`)
  },
  getStudentFee: (id: string) => apiClient.get<ApiResponse<StudentFee>>(`/student-fees/${id}`),
  createStudentFee: (data: CreateStudentFeeRequest) => apiClient.post<ApiResponse<StudentFee>>("/student-fees", data),
  updateStudentFee: (id: string, data: Partial<CreateStudentFeeRequest>) => apiClient.put<ApiResponse<StudentFee>>(`/student-fees/${id}`, data),
  deleteStudentFee: (id: string) => apiClient.delete<ApiResponse<null>>(`/student-fees/${id}`),

  // Payments
  getPayments: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: any[]; rows: FeePayment[] }>>(`/fee-payments${params ? `?${params}` : ""}`)
  },
  getPayment: (id: string) => apiClient.get<ApiResponse<FeePayment>>(`/fee-payments/${id}`),
  createPayment: (data: CreatePaymentRequest) => apiClient.post<ApiResponse<FeePayment>>("/fee-payments", data),
  updatePayment: (id: string, data: Partial<CreatePaymentRequest>) => apiClient.put<ApiResponse<FeePayment>>(`/fee-payments/${id}`, data),
  deletePayment: (id: string) => apiClient.delete<ApiResponse<null>>(`/fee-payments/${id}`),

  // Refunds
  getRefunds: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: any[]; rows: FeeRefund[] }>>(`/fee-refunds${params ? `?${params}` : ""}`)
  },
  createRefund: (data: CreateRefundRequest) => apiClient.post<ApiResponse<FeeRefund>>("/fee-refunds", data),

  // Summary
  getFeeSummary: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<FeeSummary>>(`/fees${params ? `?${params}` : ""}`)
  },
}
