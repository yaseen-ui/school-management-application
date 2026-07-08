import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface VisitorPurpose {
  id: string
  tenantId: string
  name: string
  description?: string
  requiresApproval: boolean
  approvalFrom: "headmaster" | "point_of_contact" | "admin"
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Visitor {
  id: string
  tenantId: string
  visitorType: "registered" | "non_registered"
  parentId?: string
  parentName?: string
  visitorName?: string
  visitorPhone?: string
  visitorEmail?: string
  purposeId: string
  purposeName?: string
  description?: string
  pointOfContactId?: string
  pointOfContactName?: string
  approvalStatus: "pending" | "approved" | "rejected" | "not_required"
  approvedById?: string
  approvedByName?: string
  approvedAt?: string
  rejectionReason?: string
  checkInTime?: string
  checkOutTime?: string
  status: "scheduled" | "checked_in" | "checked_out" | "cancelled"
  createdById?: string
  createdAt: string
  updatedAt: string
  notifications?: VisitorNotification[]
}

export interface VisitorNotification {
  id: string
  tenantId: string
  visitorId: string
  sentToId?: string
  type: string
  message?: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

export interface CreateVisitorRequest {
  visitorType?: "registered" | "non_registered"
  parentId?: string
  visitorName?: string
  visitorPhone?: string
  visitorEmail?: string
  purposeId: string
  description?: string
  pointOfContactId?: string
}

export const visitorsApi = {
  // Visitor Purposes
  getPurposes: () => apiClient.get<ApiResponse<VisitorPurpose[]>>("/visitor-purposes"),
  createPurpose: (data: Partial<VisitorPurpose>) => apiClient.post<ApiResponse<VisitorPurpose>>("/visitor-purposes", data),
  updatePurpose: (id: string, data: Partial<VisitorPurpose>) => apiClient.put<ApiResponse<VisitorPurpose>>(`/visitor-purposes/${id}`, data),
  deletePurpose: (id: string) => apiClient.delete<ApiResponse<null>>(`/visitor-purposes/${id}`),

  // Visitors
  getAll: (params?: Record<string, string>) => apiClient.get<ApiResponse<Visitor[]>>("/visitors", params),
  getActive: () => apiClient.get<ApiResponse<Visitor[]>>("/visitors/active"),
  getById: (id: string) => apiClient.get<ApiResponse<Visitor>>(`/visitors/${id}`),
  create: (data: CreateVisitorRequest) => apiClient.post<ApiResponse<Visitor>>("/visitors", data),
  checkIn: (id: string) => apiClient.post<ApiResponse<Visitor>>(`/visitors/${id}/check-in`),
  checkOut: (id: string) => apiClient.post<ApiResponse<Visitor>>(`/visitors/${id}/check-out`),
  approve: (id: string) => apiClient.post<ApiResponse<Visitor>>(`/visitors/${id}/approve`),
  reject: (id: string, reason?: string) => apiClient.post<ApiResponse<Visitor>>(`/visitors/${id}/reject`, { reason }),
  cancel: (id: string) => apiClient.post<ApiResponse<Visitor>>(`/visitors/${id}/cancel`),

  // Notifications
  getNotifications: (params?: Record<string, string>) => apiClient.get<ApiResponse<VisitorNotification[]>>("/visitor-notifications", params),
  markNotificationRead: (id: string) => apiClient.post<ApiResponse<VisitorNotification>>(`/visitor-notifications/${id}/read`),
}