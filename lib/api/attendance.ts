import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export type AttendanceContextType = "regular" | "exam" | "event" | "seminar" | "sports" | "assembly" | "lab" | "field_trip" | "other"
export type AttendanceStatus = "present" | "absent" | "late" | "half_day" | "excused"
export type AttendanceShift = "morning" | "afternoon" | "evening"

export interface AttendanceSession {
  id: string
  tenantId: string
  academicYearId: string
  sectionId: string
  takenById?: string | null
  date: string
  contextType: AttendanceContextType
  contextName?: string | null
  contextRefId?: string | null
  contextRefType?: string | null
  periodId?: string | null
  sectionSubjectId?: string | null
  shift?: AttendanceShift | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  academicYear?: { id: string; name: string } | null
  section?: { id: string; sectionName: string } | null
  takenBy?: { id: string; fullName: string } | null
  period?: { id: string; name: string; startTime: number; endTime: number } | null
  sectionSubject?: {
    id: string
    subject: { id: string; subjectName: string } | null
  } | null
  marks?: AttendanceMarkWithStudent[] | null
  _count?: { marks: number; present: number } | null
}

export interface AttendanceMark {
  id: string
  sessionId: string
  enrollmentId: string
  status: AttendanceStatus
  remarks?: string | null
  createdAt: string
  updatedAt: string
}

export interface AttendanceMarkWithStudent extends AttendanceMark {
  student?: {
    id: string
    firstName: string
    lastName: string
    rollNumber?: string | null
  } | null
}

export interface CreateAttendanceSessionRequest {
  academicYearId: string
  sectionId: string
  date: string
  takenById?: string | null
  contextType?: AttendanceContextType
  contextName?: string | null
  contextRefId?: string | null
  contextRefType?: string | null
  periodId?: string | null
  sectionSubjectId?: string | null
  shift?: AttendanceShift | null
  notes?: string | null
}

export interface UpsertMarkRequest {
  sessionId: string
  enrollmentId: string
  status: AttendanceStatus
  remarks?: string | null
}

export interface AttendanceSummary {
  totalSessions: number
  totalMarks: number
  present: number
  absent: number
  late: number
  halfDay: number
  excused: number
}

export interface StudentAttendanceRecord {
  id: string
  status: AttendanceStatus
  remarks?: string | null
  date: string
  contextType: AttendanceContextType
  contextName?: string | null
  period?: { id: string; name: string } | null
  subject?: { id: string; subjectName: string } | null
}

export const ATTENDANCE_CONTEXT_TYPES: { value: AttendanceContextType; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "exam", label: "Exam" },
  { value: "event", label: "Event" },
  { value: "seminar", label: "Seminar" },
  { value: "sports", label: "Sports" },
  { value: "assembly", label: "Assembly" },
  { value: "lab", label: "Lab" },
  { value: "field_trip", label: "Field Trip" },
  { value: "other", label: "Other" },
]

export const ATTENDANCE_STATUSES: { value: AttendanceStatus; label: string; color: string }[] = [
  { value: "present", label: "Present", color: "text-green-600 bg-green-100" },
  { value: "absent", label: "Absent", color: "text-red-600 bg-red-100" },
  { value: "late", label: "Late", color: "text-yellow-600 bg-yellow-100" },
  { value: "half_day", label: "Half Day", color: "text-orange-600 bg-orange-100" },
  { value: "excused", label: "Excused", color: "text-blue-600 bg-blue-100" },
]

export const ATTENDANCE_SHIFTS: { value: AttendanceShift; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
]

export const attendanceApi = {
  // Sessions
  getAllSessions: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<{ columns: Array<{ field: string; headerName: string }>; rows: AttendanceSession[] }>>(
      `/attendance/sessions${params ? `?${params}` : ""}`,
    )
  },

  getSessionById: (id: string) => apiClient.get<ApiResponse<AttendanceSession>>(`/attendance/sessions/${id}`),

  createSession: (data: CreateAttendanceSessionRequest) =>
    apiClient.post<ApiResponse<AttendanceSession>>("/attendance/sessions", data),

  updateSession: (id: string, data: Partial<CreateAttendanceSessionRequest>) =>
    apiClient.put<ApiResponse<AttendanceSession>>(`/attendance/sessions/${id}`, data),

  deleteSession: (id: string) => apiClient.delete<ApiResponse<null>>(`/attendance/sessions/${id}`),

  // Marks
  getMarksForSession: (sessionId: string) =>
    apiClient.get<ApiResponse<AttendanceMarkWithStudent[]>>(`/attendance/marks/session/${sessionId}`),

  upsertMark: (data: UpsertMarkRequest) =>
    apiClient.post<ApiResponse<AttendanceMark>>("/attendance/marks", data),

  bulkUpsertMarks: (sessionId: string, marks: Omit<UpsertMarkRequest, "sessionId">[]) =>
    apiClient.post<ApiResponse<{ results: AttendanceMark[]; errors: Array<{ mark: any; error: string }> }>>(
      "/attendance/marks/bulk",
      { sessionId, marks },
    ),

  deleteMark: (id: string) => apiClient.delete<ApiResponse<null>>(`/attendance/marks/${id}`),

  // Reports
  getAttendanceSummary: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<AttendanceSummary>>(`/attendance/summary${params ? `?${params}` : ""}`)
  },

  getStudentAttendance: (enrollmentId: string, filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<StudentAttendanceRecord[]>>(
      `/attendance/student/${enrollmentId}${params ? `?${params}` : ""}`,
    )
  },
}
