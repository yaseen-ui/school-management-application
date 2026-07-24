import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface ParentStudent {
  id: string
  firstName: string
  lastName: string
  admissionNumber?: string
  gradeName?: string
  sectionName?: string
  isPrimary: boolean
}

export interface Parent {
  id: string
  tenantId: string
  userId?: string
  fullName: string
  phone?: string
  email?: string
  relation: string
  aadhaarNumber?: string
  occupation?: string
  isRegistered: boolean
  status: string
  students: ParentStudent[]
  createdAt: string
  updatedAt: string
}

export interface SendInviteResponse {
  parentId: string
  parentName: string
  phone?: string
  email?: string
  token: string
  tokenExpiresAt: string
  inviteLink: string
}

export interface InviteTokenData {
  fullName: string
  phone: string
  email: string
  relation: string
  missingFields: string[]
}

export interface RegisterParentRequest {
  token: string
  password: string
  email?: string
  phone?: string
}

export interface RegisterParentResponse {
  message: string
  email: string
  parent: Parent
}

export const parentsApi = {
  // Parent: Get own profile with children
  getMyProfile: () => apiClient.get<ApiResponse<Parent>>("/parent/me"),

  // Parent: Get children attendance for a month
  getMyChildrenAttendance: (month: number, year: number) =>
    apiClient.get<ApiResponse<any[]>>(`/parent/attendance?month=${month}&year=${year}`),

  // Parent: Get children exam results
  getMyChildrenResults: (examId?: string) =>
    apiClient.get<ApiResponse<any[]>>(`/parent/results${examId ? `?examId=${examId}` : ""}`),

  // Parent: Get children store orders
  getMyChildrenStoreOrders: () => apiClient.get<ApiResponse<any[]>>("/parent/store/orders"),

  // Parent: Get children leave requests
  getMyChildrenLeave: () => apiClient.get<ApiResponse<any[]>>("/parent/leave"),

  // Parent: Submit leave for child
  submitLeaveForChild: (data: {
    studentId: string
    leaveCategoryId: string
    startDate: string
    endDate: string
    startFraction?: string
    endFraction?: string
    reason: string
  }) => apiClient.post<ApiResponse<any>>("/parent/leave", data),

  // Parent: Get children fee details
  getMyChildrenFees: () => apiClient.get<ApiResponse<any[]>>("/parent/fees"),

  // Admin: List all parents
  getAll: () => apiClient.get<ApiResponse<Parent[]>>("/parents"),

  // Admin: Get single parent
  getById: (id: string) => apiClient.get<ApiResponse<Parent>>(`/parents/${id}`),

  // Admin: Send invite to parent
  sendInvite: (parentId: string) =>
    apiClient.post<ApiResponse<SendInviteResponse>>(`/parents/${parentId}/invite`),

  // Public: Validate invite token
  validateToken: (token: string) =>
    apiClient.get<ApiResponse<InviteTokenData>>(`/parents/invite/${token}`),

  // Public: Complete registration
  register: (data: RegisterParentRequest) =>
    apiClient.post<ApiResponse<RegisterParentResponse>>("/parents/register", data),
}