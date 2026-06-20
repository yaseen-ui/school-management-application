import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface SectionSubjectRow {
  id: string
  tenantId: string
  sectionId: string
  subjectId: string
  isElective: boolean
  subject: {
    id: string
    tenantId: string
    subjectName: string
    courseId: string
    isCommon: boolean
    createdAt: string
    updatedAt: string
  }
}

export interface Section {
  id: string
  tenantId: string
  gradeId: string
  sectionName: string
  createdAt: string
  updatedAt: string
  grade?: {
    gradeName: string
  }
  sectionSubjects?: SectionSubjectRow[]
}

export interface CreateSectionRequest {
  sectionName: string
  gradeId: string
  subjectIds?: string[]
}

export interface UpdateSectionRequest {
  sectionId: string
  sectionName: string
  gradeId: string
  subjectIds?: string[]
}

export interface SectionListData {
  rows: Section[]
  columns: Array<{
    field: string
    headerName: string
  }>
}

export const sectionsApi = {
  list: (gradeId?: string, courseId?: string) => {
    const params = new URLSearchParams()
    if (gradeId) params.set("gradeId", gradeId)
    else if (courseId) params.set("courseId", courseId)
    const queryString = params.toString()
    const url = queryString ? `/sections?${queryString}` : "/sections"
    return apiClient.get<ApiResponse<SectionListData>>(url)
  },

  getById: (id: string) => apiClient.get<ApiResponse<Section>>(`/sections/${id}`),

  create: (data: CreateSectionRequest) => apiClient.post<ApiResponse<Section>>("/sections", data),

  update: (id: string, data: UpdateSectionRequest) => apiClient.put<ApiResponse<Section>>(`/sections/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/sections/${id}`),
}
