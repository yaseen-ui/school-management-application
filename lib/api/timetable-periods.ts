import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export type PeriodType = "class" | "break" | "lunch" | "sports" | "leisure" | "study_hour"

export const PERIOD_TYPE_LABELS: Record<PeriodType, string> = {
  class: "Class",
  break: "Break",
  lunch: "Lunch",
  sports: "Sports",
  leisure: "Leisure",
  study_hour: "Study Hour",
}

export const PERIOD_TYPE_VARIANTS: Record<PeriodType, string> = {
  class: "default",
  break: "secondary",
  lunch: "warning",
  sports: "success",
  leisure: "outline",
  study_hour: "info",
}

export interface TimetablePeriod {
  id: string
  tenantId: string
  structureId: string
  name: string
  type: PeriodType
  startTime: number
  endTime: number
  sortOrder: number
  createdAt: string
  updatedAt: string
  structure?: {
    id: string
    name: string
  } | null
}

export interface CreateTimetablePeriodRequest {
  structureId: string
  name: string
  type?: PeriodType
  startTime: number
  endTime: number
  sortOrder?: number
}


export const timetablePeriodsApi = {
  getAll: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: TimetablePeriod[] }>>(
      `/timetable-periods${params ? `?${params}` : ""}`,
    )
  },

  getById: (id: string) => apiClient.get<ApiResponse<TimetablePeriod>>(`/timetable-periods/${id}`),

  create: (data: CreateTimetablePeriodRequest) =>
    apiClient.post<ApiResponse<TimetablePeriod>>("/timetable-periods", data),

  update: (id: string, data: Partial<CreateTimetablePeriodRequest>) =>
    apiClient.put<ApiResponse<TimetablePeriod>>(`/timetable-periods/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/timetable-periods/${id}`),
}

export const DAYS_OF_WEEK = [
  { value: 0, label: "Monday" },
  { value: 1, label: "Tuesday" },
  { value: 2, label: "Wednesday" },
  { value: 3, label: "Thursday" },
  { value: 4, label: "Friday" },
  { value: 5, label: "Saturday" },
]

// Helper to convert minutes to display time
export function minutesToTime(minutes: number): string {

  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}
