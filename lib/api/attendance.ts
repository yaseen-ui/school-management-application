import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export type AttendanceStatus = "present" | "absent" | "late" | "half_day" | "excused"
export type AttendanceTypeCategory = "shift" | "period" | "exam"

export interface AttendanceType {
  id: string
  tenantId: string
  name: string
  category: AttendanceTypeCategory
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: { sessions: number }
}

export interface AttendanceSession {
  id: string
  tenantId: string
  academicYearId: string
  sectionId: string
  takenById?: string | null
  attendanceTypeId: string
  date: string
  periodId?: string | null
  sectionSubjectId?: string | null
  examScheduleId?: string | null
  shift?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  academicYear?: { id: string; name: string } | null
  section?: { id: string; sectionName: string } | null
  attendanceType?: { id: string; name: string; category: string } | null
  takenBy?: { id: string; fullName: string } | null
  period?: { id: string; name: string; startTime: number; endTime: number } | null
  sectionSubject?: {
    id: string
    subject: { id: string; subjectName: string } | null
  } | null
  examSchedule?: { id: string; name: string } | null
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

export interface CreateAttendanceTypeRequest {
  name: string
  category: AttendanceTypeCategory
  sortOrder?: number
  isActive?: boolean
}

export interface CreateAttendanceSessionRequest {
  academicYearId: string
  sectionId: string
  attendanceTypeId: string
  date: string
  takenById?: string | null
  periodId?: string | null
  sectionSubjectId?: string | null
  examScheduleId?: string | null
  shift?: string | null
  notes?: string | null
}

export interface MarkAttendanceRequest {
  academicYearId: string
  sectionId: string
  attendanceTypeId: string
  date: string
  periodId?: string | null
  examScheduleId?: string | null
  shift?: string | null
  marks: Array<{
    enrollmentId: string
    status: AttendanceStatus
    remarks?: string | null
  }>
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
  attendanceType?: { id: string; name: string; category: string } | null
  period?: { id: string; name: string } | null
  subject?: { id: string; subjectName: string } | null
}

export interface AttendanceContextOptions {
  attendanceType: { id: string; name: string; category: string }
  options: Array<{
    id: string
    name: string
    label: string
    type?: string
    startTime?: number
    endTime?: number
    sortOrder?: number
  }>
}

export interface AttendanceRegisterResult {
  enrollments: Array<{
    enrollmentId: string
    rollNumber: string | null
    studentName: string
  }>
  activeTypes: string[]
  attendance: Record<string, Record<string, Record<string, string>>>
}

export interface StudentAttendanceDetail {
  enrollmentId: string
  month: number
  year: number
  stats: {
    total: number
    present: number
    absent: number
    percentage: number
  }
  marks: Array<{
    date: string
    status: AttendanceStatus
    attendanceType: string | null
    remarks: string | null
  }>
}

export const ATTENDANCE_STATUSES: { value: AttendanceStatus; label: string; color: string }[] = [
  { value: "present", label: "Present", color: "text-green-600 bg-green-100" },
  { value: "absent", label: "Absent", color: "text-red-600 bg-red-100" },
  { value: "late", label: "Late", color: "text-yellow-600 bg-yellow-100" },
  { value: "half_day", label: "Half Day", color: "text-orange-600 bg-orange-100" },
  { value: "excused", label: "Excused", color: "text-blue-600 bg-blue-100" },
]

export const ATTENDANCE_TYPE_CATEGORIES: { value: AttendanceTypeCategory; label: string }[] = [
  { value: "shift", label: "Shift" },
  { value: "period", label: "Period" },
  { value: "exam", label: "Exam" },
]

export const attendanceApi = {
  // ---- Attendance Types ----
  getAllTypes: (filters?: Record<string, string>) => {
    const params = filters ? new URLSearchParams(filters).toString() : ""
    return apiClient.get<ApiResponse<AttendanceType[]>>(`/attendance/types${params ? `?${params}` : ""}`)
  },

  getTypeById: (id: string) => apiClient.get<ApiResponse<AttendanceType>>(`/attendance/types/${id}`),

  createType: (data: CreateAttendanceTypeRequest) =>
    apiClient.post<ApiResponse<AttendanceType>>("/attendance/types", data),

  updateType: (id: string, data: Partial<CreateAttendanceTypeRequest>) =>
    apiClient.put<ApiResponse<AttendanceType>>(`/attendance/types/${id}`, data),

  deleteType: (id: string) => apiClient.delete<ApiResponse<null>>(`/attendance/types/${id}`),

  // ---- Context Options ----
  getContextOptions: (sectionId: string, attendanceTypeId: string) =>
    apiClient.get<ApiResponse<AttendanceContextOptions>>(
      `/attendance/context-options?sectionId=${sectionId}&attendanceTypeId=${attendanceTypeId}`,
    ),

  // ---- Sessions ----
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

  // Combined mark (create session + marks in one call)
  markAttendance: (data: MarkAttendanceRequest) =>
    apiClient.put<ApiResponse<{ session: AttendanceSession; results: any[]; errors: any[] }>>("/attendance/sessions", data),

  // ---- Marks ----
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

  // ---- Reports ----
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

  // ---- Register / Detail ----
  getAttendanceRegister: (sectionId: string, month: number, year: number) =>
    apiClient.get<ApiResponse<AttendanceRegisterResult>>(
      `/attendance/register?sectionId=${sectionId}&month=${month}&year=${year}`,
    ),

  getStudentAttendanceDetail: (enrollmentId: string, month: number, year: number) =>
    apiClient.get<ApiResponse<StudentAttendanceDetail>>(
      `/attendance/register/student/${enrollmentId}?month=${month}&year=${year}`,
    ),
}