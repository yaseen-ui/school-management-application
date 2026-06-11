import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface TeacherAssignment {
  id: string
  tenantId: string
  academicYearId: string
  teacherId: string
  sectionSubjectId: string
  role: "subject_teacher" | "class_teacher" | "assistant_teacher" | "lab_incharge"
  createdAt: string
  updatedAt: string
  academicYear?: {
    id: string
    name: string
    status: string
  }
  teacher?: {
    id: string
    fullName: string
    employeeCode?: string
    email?: string
  }
  sectionSubject?: {
    id: string
    sectionId: string
    subjectId: string
    isElective: boolean
    section?: {
      id: string
      sectionName: string
      gradeId: string
      grade?: {
        id: string
        gradeName: string
        courseId: string
      }
    }
    subject?: {
      id: string
      subjectName: string
    }
  }
}

export interface CreateTeacherAssignmentRequest {
  academicYearId: string
  teacherId: string
  sectionSubjectId: string
  role?: "subject_teacher" | "class_teacher" | "assistant_teacher" | "lab_incharge"
}

export interface EligibleTeacher {
  teacherId: string
  fullName: string
  employeeCode?: string
  email?: string
  phone?: string
  yearsOfExperience?: number
  capabilityId: string
  expertiseLevel: string
  isPrimary: boolean
  priorityScore: number
  canBeClassTeacher: boolean
  matchSpecificity: number
}

export const teacherAssignmentsApi = {
  getAll: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: TeacherAssignment[] }>>(
      `/teacher-assignments${params ? `?${params}` : ""}`,
    )
  },

  getById: (id: string) => apiClient.get<ApiResponse<TeacherAssignment>>(`/teacher-assignments/${id}`),

  create: (data: CreateTeacherAssignmentRequest, overrideCapabilityCheck?: boolean) => {
    const params = overrideCapabilityCheck ? "?overrideCapabilityCheck=true" : ""
    return apiClient.post<ApiResponse<TeacherAssignment>>(`/teacher-assignments${params}`, data)
  },

  update: (id: string, data: Partial<CreateTeacherAssignmentRequest>) =>
    apiClient.put<ApiResponse<TeacherAssignment>>(`/teacher-assignments/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/teacher-assignments/${id}`),

  // Eligible teachers
  getEligibleTeachers: (sectionSubjectId: string, role?: string) => {
    const params = new URLSearchParams({ sectionSubjectId })
    if (role) params.set("role", role)
    return apiClient.get<ApiResponse<EligibleTeacher[]>>(`/teachers/eligible?${params.toString()}`)
  },
}
