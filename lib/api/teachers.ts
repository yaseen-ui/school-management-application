import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface Teacher {
  id: string
  tenantId: string
  userId?: string
  fullName: string
  email?: string
  phone?: string
  gender?: "Male" | "Female" | "Other"
  employeeCode?: string
  profilePhotoUrl?: string
  yearsOfExperience?: number
  createdAt: string
  updatedAt: string
  qualifications?: TeacherQualification[]
  employmentHistory?: TeacherEmploymentHistory[]
  user?: {
    id: string
    fullName: string
    email: string
  }
}

export interface TeacherQualification {
  id: string
  tenantId: string
  teacherId: string
  qualificationName: string
  specialization?: string
  institution?: string
  score?: number
  yearOfPassing?: number
  documentUrl?: string
  createdAt: string
  updatedAt: string
}

export interface TeacherEmploymentHistory {
  id: string
  tenantId: string
  teacherId: string
  organizationName: string
  role: string
  startDate?: string
  endDate?: string
  reasonForLeaving?: string
  experienceYears?: number
  createdAt: string
  updatedAt: string
}

export interface CreateTeacherRequest {
  fullName: string
  email?: string
  phone?: string
  gender?: "Male" | "Female" | "Other"
  employeeCode?: string
  profilePhotoUrl?: string
  yearsOfExperience?: number
  userId?: string
}

export interface CreateQualificationRequest {
  qualificationName: string
  specialization?: string
  institution?: string
  score?: number
  yearOfPassing?: number
  documentUrl?: string
}

export interface CreateEmploymentHistoryRequest {
  organizationName: string
  role: string
  startDate?: string
  endDate?: string
  reasonForLeaving?: string
  experienceYears?: number
}

export const teachersApi = {
  // Teacher CRUD
  getAll: () =>
    apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: Teacher[] }>>("/teachers"),

  getById: (id: string) => apiClient.get<ApiResponse<Teacher>>(`/teachers/${id}`),

  create: (data: CreateTeacherRequest) => apiClient.post<ApiResponse<Teacher>>("/teachers", data),

  update: (id: string, data: Partial<CreateTeacherRequest>) =>
    apiClient.put<ApiResponse<Teacher>>(`/teachers/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/teachers/${id}`),

  // Qualifications
  addQualification: (teacherId: string, data: CreateQualificationRequest) =>
    apiClient.post<ApiResponse<TeacherQualification>>(`/teachers/${teacherId}/qualifications`, data),

  getQualifications: (teacherId: string) =>
    apiClient.get<ApiResponse<TeacherQualification[]>>(`/teachers/${teacherId}/qualifications`),

  getQualificationById: (teacherId: string, qualificationId: string) =>
    apiClient.get<ApiResponse<TeacherQualification>>(`/teachers/${teacherId}/qualifications/${qualificationId}`),

  updateQualification: (teacherId: string, qualificationId: string, data: Partial<CreateQualificationRequest>) =>
    apiClient.put<ApiResponse<TeacherQualification>>(`/teachers/${teacherId}/qualifications/${qualificationId}`, data),

  deleteQualification: (teacherId: string, qualificationId: string) =>
    apiClient.delete<ApiResponse<null>>(`/teachers/${teacherId}/qualifications/${qualificationId}`),

  // Employment History
  addEmploymentHistory: (teacherId: string, data: CreateEmploymentHistoryRequest) =>
    apiClient.post<ApiResponse<TeacherEmploymentHistory>>(`/teachers/${teacherId}/employment-history`, data),

  getEmploymentHistory: (teacherId: string) =>
    apiClient.get<ApiResponse<TeacherEmploymentHistory[]>>(`/teachers/${teacherId}/employment-history`),

  getEmploymentHistoryById: (teacherId: string, employmentHistoryId: string) =>
    apiClient.get<ApiResponse<TeacherEmploymentHistory>>(
      `/teachers/${teacherId}/employment-history/${employmentHistoryId}`,
    ),

  updateEmploymentHistory: (
    teacherId: string,
    employmentHistoryId: string,
    data: Partial<CreateEmploymentHistoryRequest>,
  ) =>
    apiClient.put<ApiResponse<TeacherEmploymentHistory>>(
      `/teachers/${teacherId}/employment-history/${employmentHistoryId}`,
      data,
    ),

  deleteEmploymentHistory: (teacherId: string, employmentHistoryId: string) =>
    apiClient.delete<ApiResponse<null>>(`/teachers/${teacherId}/employment-history/${employmentHistoryId}`),
}
