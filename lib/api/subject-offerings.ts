import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface SubjectOffering {
  id: string
  tenantId: string
  subjectId: string
  courseId?: string | null
  gradeId?: string | null
  scope: "all_courses_all_grades" | "course_all_grades" | "grade_all_courses" | "course_grade"
  isElective: boolean
  weeklyPeriods?: number | null
  status: "active" | "inactive" | "suspended"
  createdAt: string
  updatedAt: string
  subject?: {
    id: string
    subjectName: string
    isCommon: boolean
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

export interface CreateSubjectOfferingRequest {
  subjectId: string
  courseId?: string | null
  gradeId?: string | null
  scope?: "all_courses_all_grades" | "course_all_grades" | "grade_all_courses" | "course_grade"
  isElective?: boolean
  weeklyPeriods?: number | null
  status?: "active" | "inactive" | "suspended"
}

export const subjectOfferingsApi = {
  getAll: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: SubjectOffering[] }>>(
      `/subject-offerings${params ? `?${params}` : ""}`,
    )
  },

  getById: (id: string) => apiClient.get<ApiResponse<SubjectOffering>>(`/subject-offerings/${id}`),

  create: (data: CreateSubjectOfferingRequest) =>
    apiClient.post<ApiResponse<SubjectOffering>>("/subject-offerings", data),

  update: (id: string, data: Partial<CreateSubjectOfferingRequest>) =>
    apiClient.put<ApiResponse<SubjectOffering>>(`/subject-offerings/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/subject-offerings/${id}`),
}
