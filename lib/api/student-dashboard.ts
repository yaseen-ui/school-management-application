import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface DashboardStudent {
  id: string
  fullName: string
  firstName: string
  lastName: string
  admissionNumber: string | null
}

export interface DashboardEnrollment {
  id: string
  rollNumber: string | null
  gradeId: string
  gradeName: string | null
  sectionId: string
  sectionName: string | null
  academicYearId: string
  academicYearLabel: string | null
  status: string
}

export interface DashboardExamOption {
  examId: string
  scheduleId: string
  name: string
  examName: string
  examType: string
  dateRange: { start: string | null; end: string | null }
  endDate: string | null
  isLatest: boolean
}

export interface SubjectClassAverage {
  avgMarks: number
  avgPercentage: number | null
  sampleSize: number
}

export interface DashboardSubject {
  subjectId: string | null
  subjectName: string
  marksObtained: number | null
  maxMarks: number
  passMarks: number
  isAbsent: boolean
  gradeLabel: string | null
  remarks: string | null
  breakup: unknown
  classAverage: SubjectClassAverage | null
}

export interface SelectedExam {
  scheduleId: string
  scheduleName: string
  examId: string
  examName: string
  examType: string
  overall: {
    total: number
    max: number
    percentage: number | null
    gradeLabel: string | null
    classAvgPercentage: number | null
  }
  subjects: DashboardSubject[]
}

export interface ProgressPoint {
  scheduleId: string
  name: string
  examName: string
  percentage: number | null
  totalMarks: number
  totalMaxMarks: number
  endDate: string | null
}

export interface AttendanceMonthSummary {
  present: number
  absent: number
  late: number
  half_day: number
  excused: number
  leave: number
  total: number
  percentage: number | null
}

export interface HeatmapDay {
  date: string
  status: string
  remarks: string | null
}

export interface TimelineItem {
  id: string
  at: string
  type: "exam_remark" | "attendance_remark" | "communication" | string
  title: string
  body: string
  subjectName: string | null
  teacherName: string | null
  deepLink?: string
}

export interface StudentDashboardData {
  student: DashboardStudent
  enrollment: DashboardEnrollment
  today: { attendanceStatus: string | null }
  exams: DashboardExamOption[]
  selectedExam: SelectedExam | null
  progress: ProgressPoint[]
  trendDelta: number | null
  attendance: {
    monthSummary: AttendanceMonthSummary
    heatmap: HeatmapDay[]
  }
  timeline: TimelineItem[]
  secondary: { feesDue: number | null }
  accessRole: "parent" | "staff" | string
}

export const studentDashboardApi = {
  get: (enrollmentId: string, examScheduleId?: string | null) => {
    const params: Record<string, string> = {}
    if (examScheduleId) params.examScheduleId = examScheduleId
    return apiClient.get<ApiResponse<StudentDashboardData>>(
      `/student-dashboard/${enrollmentId}`,
      Object.keys(params).length ? params : undefined
    )
  },
}
