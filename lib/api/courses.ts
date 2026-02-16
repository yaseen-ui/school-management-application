import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface Course {
  id: string
  courseName: string
  description: string
  grades: string[]
  createdAt: string
  updatedAt: string
}

export interface CourseListData {
  rows: Course[]
  columns: { field: string; headerName: string }[]
}

export interface CreateCourseRequest {
  name: string
  description: string
}

export interface UpdateCourseRequest {
  name?: string
  description?: string
}

export const coursesApi = {
  getAll: () => apiClient.get<ApiResponse<CourseListData>>("/courses"),

  getById: (id: string) => apiClient.get<ApiResponse<Course>>(`/courses/${id}`),

  create: (data: CreateCourseRequest) => apiClient.post<ApiResponse<Course>>("/courses", data),

  update: (id: string, data: UpdateCourseRequest) => apiClient.put<ApiResponse<Course>>(`/courses/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/courses/${id}`),
}
