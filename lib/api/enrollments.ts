import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface Enrollment {
  id: string
  tenantId: string
  studentId: string
  academicYearId: string
  gradeId: string
  sectionId: string
  rollNumber: string
  status: string
  joinedAt: string
  leftAt: string | null
  createdAt: string
  updatedAt: string
  student?: {
    id: string
    firstName: string
    lastName: string
  } | null
  section?: {
    id: string
    sectionName: string
  } | null
  academicYear?: {
    id: string
    name: string
  } | null
  grade?: {
    id: string
    gradeName: string
  } | null
}

export const enrollmentsApi = {
  getEnrollments: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<Enrollment[]>>(`/enrollments${params ? `?${params}` : ""}`)
  },
}
