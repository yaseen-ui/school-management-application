import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface Grade {
  gradeId: string
  tenantId: string
  courseId: string
  gradeName: string
  createdAt: string
  updatedAt: string
  courseName?: string // Optional, returned from list endpoint
}

export interface CreateGradeRequest {
  courseId: string
  gradeName: string
}

export interface UpdateGradeRequest {
  courseId: string
  gradeName: string
}

export interface GradeListData {
  rows: Grade[]
  columns: Array<{
    field: string
    headerName: string
  }>
}

export const gradesApi = {
  list: (courseId?: string) => {
    const url = courseId ? `/grades?courseId=${courseId}` : "/grades"
    return apiClient.get<ApiResponse<GradeListData>>(url)
  },

  getById: (id: string) => apiClient.get<ApiResponse<Grade>>(`/grades/${id}`),

  create: (data: CreateGradeRequest) => apiClient.post<ApiResponse<Grade>>("/grades", data),

  update: (id: string, data: UpdateGradeRequest) => apiClient.put<ApiResponse<Grade>>(`/grades/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/grades/${id}`),
}
