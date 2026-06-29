import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { examApi } from "@/lib/api/exams"
import { toast } from "@/components/ui/sonner"
import type { CreateExamRequest, UpdateExamRequest, CreateScheduleRequest, CreatePaperRequest, UpsertMarkRequest } from "@/lib/api/exams"

// ─── Exams ──────────────────────────────────────────────────────────────────

export function useExams(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["exams", filters],
    queryFn: async () => {
      const response = await examApi.getAll(filters)
      return response.data.rows
    },
  })
}

export function useExam(id: string | null) {
  return useQuery({
    queryKey: ["exams", id],
    queryFn: () => examApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExamRequest) => examApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      toast.success("Exam created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create exam")
    },
  })
}

export function useUpdateExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamRequest }) =>
      examApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      toast.success("Exam updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update exam")
    },
  })
}

export function useDeleteExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      toast.success("Exam deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete exam")
    },
  })
}

// ─── Schedules ──────────────────────────────────────────────────────────────

export function useExamSchedules(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["exam-schedules", filters],
    queryFn: async () => {
      const response = await examApi.getAllSchedules(filters)
      return response.data.rows
    },
  })
}

export function useExamSchedule(id: string | null) {
  return useQuery({
    queryKey: ["exam-schedules", id],
    queryFn: () => examApi.getScheduleById(id!),
    enabled: !!id,
  })
}

export function useCreateExamSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => examApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-schedules"] })
      toast.success("Schedule created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create schedule")
    },
  })
}

export function useUpdateExamSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateScheduleRequest> }) =>
      examApi.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-schedules"] })
      toast.success("Schedule updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update schedule")
    },
  })
}

export function useDeleteExamSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-schedules"] })
      toast.success("Schedule deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete schedule")
    },
  })
}

// ─── Papers ─────────────────────────────────────────────────────────────────

export function useExamPapers(scheduleId: string | null) {
  return useQuery({
    queryKey: ["exam-papers", scheduleId],
    queryFn: async () => {
      const response = await examApi.getPapers(scheduleId!)
      return response.data.rows
    },
    enabled: !!scheduleId,
  })
}

export function useExamPaper(id: string | null) {
  return useQuery({
    queryKey: ["exam-papers", id],
    queryFn: () => examApi.getPaperById(id!),
    enabled: !!id,
  })
}

export function useUpsertExamPapers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ scheduleId, papers }: { scheduleId: string; papers: CreatePaperRequest[] }) =>
      examApi.upsertPapers(scheduleId, papers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-papers"] })
      queryClient.invalidateQueries({ queryKey: ["exam-schedules"] })
      toast.success("Papers updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update papers")
    },
  })
}

export function useUpdateExamPaper() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePaperRequest> }) =>
      examApi.updatePaper(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-papers"] })
      toast.success("Paper updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update paper")
    },
  })
}

export function useDeleteExamPaper() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => examApi.deletePaper(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-papers"] })
      toast.success("Paper deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete paper")
    },
  })
}

// ─── Marks ──────────────────────────────────────────────────────────────────

export function useExamMarks(paperId: string | null) {
  return useQuery({
    queryKey: ["exam-marks", paperId],
    queryFn: async () => {
      const response = await examApi.getMarks(paperId!)
      return response.data.rows
    },
    enabled: !!paperId,
  })
}

export function useUpsertExamMarks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ paperId, marks }: { paperId: string; marks: UpsertMarkRequest[] }) =>
      examApi.upsertMarks(paperId, marks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-marks"] })
      queryClient.invalidateQueries({ queryKey: ["exam-papers"] })
      toast.success("Marks updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update marks")
    },
  })
}

export function useStudentExamMarks(enrollmentId: string | null) {
  return useQuery({
    queryKey: ["student-exam-marks", enrollmentId],
    queryFn: async () => {
      const response = await examApi.getStudentMarks(enrollmentId!)
      return response.data
    },
    enabled: !!enrollmentId,
  })
}

// ─── Marks Grid & Results ────────────────────────────────────────────────────

export function useScheduleMarksGrid(scheduleId: string | null) {
  return useQuery({
    queryKey: ["schedule-marks-grid", scheduleId],
    queryFn: async () => {
      const response = await examApi.getScheduleMarksGrid(scheduleId!)
      return response.data
    },
    enabled: !!scheduleId,
  })
}

export function useUpsertStudentScheduleMarks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      scheduleId,
      enrollmentId,
      data,
    }: {
      scheduleId: string
      enrollmentId: string
      data: import("@/lib/api/exams").StudentMarksPayload
    }) => examApi.upsertStudentScheduleMarks(scheduleId, enrollmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-marks-grid"] })
      queryClient.invalidateQueries({ queryKey: ["schedule-results"] })
      toast.success("Marks saved successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save marks")
    },
  })
}

export function useScheduleResults(scheduleId: string | null) {
  return useQuery({
    queryKey: ["schedule-results", scheduleId],
    queryFn: async () => {
      const response = await examApi.getScheduleResults(scheduleId!)
      return response.data
    },
    enabled: !!scheduleId,
  })
}
