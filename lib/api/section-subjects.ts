import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface SectionSubject {
  id: string
  tenantId: string
  sectionId: string
  subjectId: string
  isElective: boolean
  createdAt: string
  updatedAt: string
  section?: {
    id: string
    sectionName: string
    grade?: {
      id: string
      gradeName: string
    } | null
  } | null
  subject?: {
    id: string
    subjectName: string
  } | null
}

export interface CreateSectionSubjectRequest {
  sectionId: string
  subjectIds: string[]
  isElective?: boolean
}

export const sectionSubjectsApi = {
  getAll: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: SectionSubject[] }>>(
      `/section-subjects${params ? `?${params}` : ""}`,
    )
  },

  getById: (id: string) => apiClient.get<ApiResponse<SectionSubject>>(`/section-subjects/${id}`),

  create: (data: CreateSectionSubjectRequest) =>
    apiClient.post<ApiResponse<SectionSubject[]>>("/section-subjects", data),

  update: (id: string, data: Partial<CreateSectionSubjectRequest>) =>
    apiClient.put<ApiResponse<SectionSubject>>(`/section-subjects/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/section-subjects/${id}`),
}
