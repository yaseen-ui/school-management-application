import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface TeacherAvailabilitySlot {
  id: string
  tenantId: string
  teacherId: string
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
  startTime: number
  endTime: number
  isAvailable: boolean
  createdAt: string
  updatedAt: string
  teacher?: {
    id: string
    fullName: string
    employeeCode?: string
  }
}

export interface UpsertAvailabilityRequest {
  teacherId: string
  slots: Array<{
    dayOfWeek: string
    startTime: number
    endTime: number
    isAvailable: boolean
  }>
}

export const teacherAvailabilityApi = {
  getAll: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<TeacherAvailabilitySlot[]>>(
      `/teacher-availability${params ? `?${params}` : ""}`,
    )
  },

  getByTeacher: (teacherId: string) =>
    apiClient.get<ApiResponse<TeacherAvailabilitySlot[]>>(`/teacher-availability/teacher/${teacherId}`),

  upsertBulk: (data: UpsertAvailabilityRequest) =>
    apiClient.post<ApiResponse<TeacherAvailabilitySlot[]>>("/teacher-availability", data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/teacher-availability/${id}`),
}
