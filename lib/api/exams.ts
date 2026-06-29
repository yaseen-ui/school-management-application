import { apiClient } from "./client"
import type { ApiResponse } from "./types"

// ─── Types ──────────────────────────────────────────────────────────────────

export type ExamType = "weekly" | "quarterly" | "half_yearly" | "annually"
export type ExamSource = "admin" | "custom"
export type ExamStatus = "draft" | "published" | "in_progress" | "completed" | "cancelled"
export type ScheduleStatus = "pending" | "scheduled" | "completed" | "cancelled"

export interface Exam {
  id: string
  tenantId: string
  academicYearId: string
  name: string
  description?: string | null
  examType: ExamType
  startDate: string
  endDate: string
  status: ExamStatus
  source: ExamSource
  gradingScaleId?: string | null
  createdAt: string
  updatedAt: string
  academicYear?: { id: string; name: string } | null
  gradingScale?: { id: string; name: string } | null
  targetGrades?: { id: string; grade: { id: string; gradeName: string } }[]
  targetSections?: { id: string; section: { id: string; sectionName: string; gradeId: string } }[]
  _count?: { schedules: number }
}

export interface ExamSchedule {
  id: string
  tenantId: string
  examId?: string | null
  sectionId: string
  name: string
  description?: string | null
  startDate: string
  endDate: string
  status: ScheduleStatus
  createdAt: string
  updatedAt: string
  exam?: { id: string; name: string; examType: ExamType } | null
  section?: { id: string; sectionName: string; grade: { id: string; gradeName: string } } | null
  papers?: ExamSchedulePaper[]
  _count?: { papers: number }
}

export interface ExamSchedulePaper {
  id: string
  tenantId: string
  scheduleId: string
  sectionSubjectId: string
  examDate: string
  startTime: string
  endTime: string
  durationMinutes?: number | null
  room?: string | null
  inChargeId?: string | null
  maxMarks: number
  passMarks: number
  createdAt: string
  updatedAt: string
  sectionSubject?: {
    id: string
    subject: { id: string; subjectName: string }
  } | null
  inCharge?: { id: string; fullName: string; employeeCode: string } | null
  _count?: { marks: number }
}

export interface ExamMark {
  id: string
  tenantId: string
  examPaperId: string
  enrollmentId: string
  marksObtained?: number | null
  isAbsent: boolean
  gradeLabel?: string | null
  remarks?: string | null
  createdAt: string
  updatedAt: string
  enrollment?: {
    id: string
    rollNumber: string
    student: { id: string; firstName: string; lastName: string }
  } | null
}

export interface TargetAudienceRow {
  courseId: string
  gradeId: string
  sectionIds: string[]
}

export interface CreateExamRequest {
  academicYearId: string
  name: string
  description?: string
  examType: ExamType
  startDate: string
  endDate: string
  gradingScaleId?: string
  isCommon?: boolean
  targetCourseIds?: string[]
  targetAudienceRows?: TargetAudienceRow[]
  targetGradeIds?: string[]
  targetSectionIds?: string[]
}

export interface UpdateExamRequest {
  name?: string
  description?: string
  examType?: ExamType
  startDate?: string
  endDate?: string
  status?: ExamStatus
  gradingScaleId?: string
  isCommon?: boolean
  targetCourseIds?: string[]
  targetAudienceRows?: TargetAudienceRow[]
  targetGradeIds?: string[]
  targetSectionIds?: string[]
}

export interface CreateScheduleRequest {
  examId?: string
  sectionId: string
  name: string
  description?: string
  startDate: string
  endDate: string
  papers?: CreatePaperRequest[]
}

export interface CreatePaperRequest {
  sectionSubjectId: string
  examDate: string
  startTime: string
  endTime: string
  durationMinutes?: number
  room?: string
  inChargeId?: string
  maxMarks?: number
  passMarks?: number
}

export interface UpsertMarkRequest {
  enrollmentId: string
  marksObtained?: number
  isAbsent?: boolean
  remarks?: string
  gradeLabel?: string
}

// ─── Marks Grid & Results Types ──────────────────────────────────────────────

export interface MarksGridPaper {
  paperId: string
  sectionSubjectId: string
  subjectName: string
  maxMarks: number
  passMarks: number
}

export interface MarksGridStudentMark {
  paperId: string
  marksObtained?: number | null
  isAbsent: boolean
  breakup?: Record<string, unknown> | null
  remarks?: string | null
}

export interface MarksGridStudent {
  enrollmentId: string
  rollNumber: string
  studentName: string
  marks: MarksGridStudentMark[]
}

export interface MarksGridData {
  schedule: {
    id: string
    name: string
    sectionName: string
  }
  papers: MarksGridPaper[]
  students: MarksGridStudent[]
}

export interface StudentMarksPayload {
  marks: {
    paperId: string
    marksObtained?: number | null
    isAbsent?: boolean
    breakup?: Record<string, unknown> | null
    remarks?: string | null
  }[]
}

export interface ResultStudentEntry {
  enrollmentId: string
  rollNumber: string
  studentName: string
  subjectMarks: {
    paperId: string
    subjectName: string
    marksObtained?: number | null
    maxMarks: number
    passMarks: number
    isAbsent: boolean
  }[]
  totalMarks: number
  totalMaxMarks: number
  percentage: number
  isPassed: boolean
  rank: number
}

export interface ScheduleResultsData {
  schedule: {
    id: string
    name: string
    sectionName: string
  }
  papers: MarksGridPaper[]
  results: ResultStudentEntry[]
}

export interface ExamListData {
  rows: Exam[]
  columns: { field: string; headerName: string; type?: string }[]
}

export interface ScheduleListData {
  rows: ExamSchedule[]
  columns: { field: string; headerName: string; type?: string }[]
}

export interface PaperListData {
  rows: ExamSchedulePaper[]
  columns: { field: string; headerName: string; type?: string }[]
}

export interface MarkListData {
  rows: ExamMark[]
  columns: { field: string; headerName: string; type?: string }[]
}

// ─── API Client ─────────────────────────────────────────────────────────────

export const examApi = {
  // Exams
  getAll: (params?: Record<string, string>) =>
    apiClient.get<ApiResponse<ExamListData>>("/exams", params),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Exam>>(`/exams/${id}`),

  create: (data: CreateExamRequest) =>
    apiClient.post<ApiResponse<Exam>>("/exams", data),

  update: (id: string, data: UpdateExamRequest) =>
    apiClient.put<ApiResponse<Exam>>(`/exams/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/exams/${id}`),

  // Schedules
  getAllSchedules: (params?: Record<string, string>) =>
    apiClient.get<ApiResponse<ScheduleListData>>("/exams/schedules", params),

  getScheduleById: (id: string) =>
    apiClient.get<ApiResponse<ExamSchedule>>(`/exams/schedules/${id}`),

  createSchedule: (data: CreateScheduleRequest) =>
    apiClient.post<ApiResponse<ExamSchedule>>("/exams/schedules", data),

  updateSchedule: (id: string, data: Partial<CreateScheduleRequest>) =>
    apiClient.put<ApiResponse<ExamSchedule>>(`/exams/schedules/${id}`, data),

  deleteSchedule: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/exams/schedules/${id}`),

  // Papers
  getPapers: (scheduleId: string) =>
    apiClient.get<ApiResponse<PaperListData>>(`/exams/schedules/${scheduleId}/papers`),

  upsertPapers: (scheduleId: string, papers: CreatePaperRequest[]) =>
    apiClient.put<ApiResponse<ExamSchedule>>(`/exams/schedules/${scheduleId}/papers`, { papers }),

  getPaperById: (id: string) =>
    apiClient.get<ApiResponse<ExamSchedulePaper>>(`/exams/papers/${id}`),

  updatePaper: (id: string, data: Partial<CreatePaperRequest>) =>
    apiClient.put<ApiResponse<ExamSchedulePaper>>(`/exams/papers/${id}`, data),

  deletePaper: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/exams/papers/${id}`),

  // Marks
  getMarks: (paperId: string) =>
    apiClient.get<ApiResponse<MarkListData>>(`/exams/papers/${paperId}/marks`),

  upsertMarks: (paperId: string, marks: UpsertMarkRequest[]) =>
    apiClient.put<ApiResponse<ExamMark[]>>(`/exams/papers/${paperId}/marks`, { marks }),

  getStudentMarks: (enrollmentId: string) =>
    apiClient.get<ApiResponse<ExamMark[]>>(`/exams/students/${enrollmentId}/marks`),

  // Marks Grid & Results
  getScheduleMarksGrid: (scheduleId: string) =>
    apiClient.get<ApiResponse<MarksGridData>>(`/exams/schedules/${scheduleId}/marks-grid`),

  upsertStudentScheduleMarks: (scheduleId: string, enrollmentId: string, data: StudentMarksPayload) =>
    apiClient.put<ApiResponse<ExamMark[]>>(`/exams/schedules/${scheduleId}/students/${enrollmentId}/marks`, data),

  getScheduleResults: (scheduleId: string) =>
    apiClient.get<ApiResponse<ScheduleResultsData>>(`/exams/schedules/${scheduleId}/results`),
}
