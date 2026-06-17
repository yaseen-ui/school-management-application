import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface TimetableEntry {
  id: string
  tenantId: string
  academicYearId: string
  dayOfWeek: number
  periodId: string
  sectionSubjectId: string
  teacherAssignmentId?: string | null
  room?: string | null
  createdAt: string
  updatedAt: string
  academicYear?: { id: string; name: string } | null
  period?: { id: string; name: string; startTime: number; endTime: number; sortOrder: number } | null
  sectionSubject?: {
    id: string
    section: { id: string; sectionName: string } | null
    subject: { id: string; subjectName: string } | null
  } | null
  teacherAssignment?: {
    id: string
    teacher: { id: string; fullName: string } | null
  } | null
}

export interface CreateTimetableEntryRequest {
  academicYearId: string
  dayOfWeek: number
  periodId: string
  sectionSubjectId: string
  teacherAssignmentId?: string | null
  room?: string | null
}

export const DAYS_OF_WEEK = [
  { value: 0, label: "Monday" },
  { value: 1, label: "Tuesday" },
  { value: 2, label: "Wednesday" },
  { value: 3, label: "Thursday" },
  { value: 4, label: "Friday" },
  { value: 5, label: "Saturday" },
]

export const timetableEntriesApi = {
  getAll: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: TimetableEntry[] }>>(
      `/timetable-entries${params ? `?${params}` : ""}`,
    )
  },

  getById: (id: string) => apiClient.get<ApiResponse<TimetableEntry>>(`/timetable-entries/${id}`),

  create: (data: CreateTimetableEntryRequest) =>
    apiClient.post<ApiResponse<TimetableEntry>>("/timetable-entries", data),

  update: (id: string, data: Partial<CreateTimetableEntryRequest>) =>
    apiClient.put<ApiResponse<TimetableEntry>>(`/timetable-entries/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/timetable-entries/${id}`),

  bulkCreate: (entries: CreateTimetableEntryRequest[]) =>
    apiClient.post<ApiResponse<{ results: TimetableEntry[]; errors: Array<{ entry: any; error: string }> }>>(
      "/timetable-entries/bulk",
      { entries },
    ),

  getGridForSection: (sectionId: string, academicYearId: string) =>
    apiClient.get<ApiResponse<TimetableEntry[]>>(`/timetable-entries/grid/${sectionId}/${academicYearId}`),
}
