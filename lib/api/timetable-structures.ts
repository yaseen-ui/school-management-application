import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface TimetableStructure {
  id: string
  tenantId: string
  name: string
  description?: string | null
  periodCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateTimetableStructureRequest {
  name: string
  description?: string | null
}

export const timetableStructuresApi = {
  getAll: () =>
    apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: TimetableStructure[] }>>(
      "/timetable-structures",
    ),

  getById: (id: string) => apiClient.get<ApiResponse<TimetableStructure>>(`/timetable-structures/${id}`),

  create: (data: CreateTimetableStructureRequest) =>
    apiClient.post<ApiResponse<TimetableStructure>>("/timetable-structures", data),

  update: (id: string, data: Partial<CreateTimetableStructureRequest>) =>
    apiClient.put<ApiResponse<TimetableStructure>>(`/timetable-structures/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/timetable-structures/${id}`),
}
