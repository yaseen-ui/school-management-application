import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface Section {
  subjects: any
  id: string
  tenantId: string
  gradeId: string
  sectionName: string
  createdAt: string
  updatedAt: string
  gradeName?: string // Returned from list endpoint
}

export interface CreateSectionRequest {
  sectionName: string
  gradeId: string
  subjectIds: string[]
}

export interface UpdateSectionRequest {
  sectionId: string
  sectionName: string
  gradeId: string
  subjectIds: string[]
}

export interface SectionListData {
  rows: Section[]
  columns: Array<{
    field: string
    headerName: string
  }>
}

export const sectionsApi = {
  list: (gradeId?: string) => {
    const url = gradeId ? `/sections?gradeId=${gradeId}` : "/sections"
    return apiClient.get<ApiResponse<SectionListData>>(url)
  },

  getById: (id: string) => apiClient.get<ApiResponse<Section>>(`/sections/${id}`),

  create: (data: CreateSectionRequest) => apiClient.post<ApiResponse<Section>>("/sections", data),

  update: (id: string, data: UpdateSectionRequest) => apiClient.put<ApiResponse<Section>>(`/sections/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/sections/${id}`),
}
