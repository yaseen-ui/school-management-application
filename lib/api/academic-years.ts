import { apiClient } from "./client"

export interface AcademicYear {
  id: string
  tenantId: string
  name: string
  startDate: string
  endDate: string
  status: "draft" | "active" | "archived"
  createdAt: string
  updatedAt: string
}

export interface CreateAcademicYearRequest {
  name: string
  startDate: string
  endDate: string
}

export interface UpdateAcademicYearRequest {
  name: string
  startDate: string
  endDate: string
}

export interface AcademicYearListData {
  rows: AcademicYear[]
  columns: Array<{
    field: string
    headerName: string
  }>
}

export interface AcademicYearListResponse {
  status: string
  data: AcademicYearListData
  message: string
}

export interface AcademicYearResponse {
  status: string
  data: AcademicYear
  message: string
}

export const academicYearsApi = {
  getAll: () => apiClient.get<AcademicYearListResponse>("/academic-years"),

  getActive: () => apiClient.get<AcademicYearResponse>("/academic-years/active"),

  getById: (id: string) => apiClient.get<AcademicYearResponse>(`/academic-years/${id}`),

  create: (data: CreateAcademicYearRequest) => apiClient.post<AcademicYearResponse>("/academic-years", data),

  update: (id: string, data: UpdateAcademicYearRequest) =>
    apiClient.put<AcademicYearResponse>(`/academic-years/${id}`, data),

  activate: (id: string) => apiClient.post<AcademicYearResponse>(`/academic-years/${id}/activate`, {}),

  archive: (id: string) => apiClient.post<AcademicYearResponse>(`/academic-years/${id}/archive`, {}),
}
