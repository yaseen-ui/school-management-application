import { apiClient } from "./client"

export interface Subject {
  id: string
  tenantId: string
  subjectName: string
  courseId: string
  isCommon: boolean
  createdAt: string
  updatedAt: string
  courseName?: string // Will be added by backend later
}

export interface CreateSubjectRequest {
  subjectName: string
  courseId: string
  isCommon: boolean
}

export interface UpdateSubjectRequest {
  subjectId: string
  subjectName: string
  isCommon: boolean
}

export interface SubjectListResponse {
  status: string
  data: Subject[]
  message: string
}

export interface SubjectResponse {
  status: string
  data: Subject
  message: string
}

export const subjectsApi = {
  list: (courseId?: string) => {
    if (courseId) {
      return apiClient.get<SubjectListResponse>(`/subjects/course/${courseId}`)
    }
    return apiClient.get<SubjectListResponse>("/subjects")
  },

  getById: (id: string) => apiClient.get<SubjectResponse>(`/subjects/${id}`),

  create: (data: CreateSubjectRequest) => apiClient.post<SubjectResponse>("/subjects", data),

  update: (id: string, data: UpdateSubjectRequest) => apiClient.put<SubjectResponse>(`/subjects/${id}`, data),

  delete: (id: string) => apiClient.delete<{ status: string; message: string }>(`/subjects/${id}`),
}
