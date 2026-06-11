import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface TeacherCapability {
  id: string
  tenantId: string
  teacherId: string
  subjectId: string
  courseId?: string | null
  gradeId?: string | null
  expertiseLevel: "beginner" | "intermediate" | "advanced" | "expert"
  isPrimary: boolean
  priorityScore: number
  canBeClassTeacher: boolean
  remarks?: string | null
  createdAt: string
  updatedAt: string
  teacher?: {
    id: string
    fullName: string
    employeeCode?: string
  }
  subject?: {
    id: string
    subjectName: string
  }
  course?: {
    id: string
    courseName: string
  } | null
  grade?: {
    id: string
    gradeName: string
  } | null
}

export interface CreateTeacherCapabilityRequest {
  teacherId: string
  subjectId: string
  courseId?: string | null
  gradeId?: string | null
  expertiseLevel?: "beginner" | "intermediate" | "advanced" | "expert"
  isPrimary?: boolean
  priorityScore?: number
  canBeClassTeacher?: boolean
  remarks?: string | null
}

export const teacherCapabilitiesApi = {
  getAll: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: TeacherCapability[] }>>(
      `/teacher-capabilities${params ? `?${params}` : ""}`,
    )
  },

  getById: (id: string) => apiClient.get<ApiResponse<TeacherCapability>>(`/teacher-capabilities/${id}`),

  create: (data: CreateTeacherCapabilityRequest) =>
    apiClient.post<ApiResponse<TeacherCapability>>("/teacher-capabilities", data),

  update: (id: string, data: Partial<CreateTeacherCapabilityRequest>) =>
    apiClient.put<ApiResponse<TeacherCapability>>(`/teacher-capabilities/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/teacher-capabilities/${id}`),
}
