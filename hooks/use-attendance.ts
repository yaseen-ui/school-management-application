import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { attendanceApi } from "@/lib/api/attendance"
import { toast } from "@/components/ui/sonner"
import type { CreateAttendanceSessionRequest, UpsertMarkRequest } from "@/lib/api/attendance"

// ---- Sessions ----

export function useAttendanceSessions(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["attendance-sessions", filters],
    queryFn: async () => {
      const response = await attendanceApi.getAllSessions(filters)
      return response.data.rows
    },
  })
}

export function useAttendanceSession(id: string | null) {
  return useQuery({
    queryKey: ["attendance-sessions", id],
    queryFn: () => attendanceApi.getSessionById(id!),
    enabled: !!id,
  })
}

export function useCreateAttendanceSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAttendanceSessionRequest) => attendanceApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-sessions"] })
      queryClient.invalidateQueries({ queryKey: ["attendance-summary"] })
      toast.success("Attendance session created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create attendance session")
    },
  })
}

export function useUpdateAttendanceSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAttendanceSessionRequest> }) =>
      attendanceApi.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-sessions"] })
      toast.success("Attendance session updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update attendance session")
    },
  })
}

export function useDeleteAttendanceSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => attendanceApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-sessions"] })
      queryClient.invalidateQueries({ queryKey: ["attendance-summary"] })
      toast.success("Attendance session deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete attendance session")
    },
  })
}

// ---- Marks ----

export function useAttendanceMarks(sessionId: string | null) {
  return useQuery({
    queryKey: ["attendance-marks", sessionId],
    queryFn: async () => {
      const response = await attendanceApi.getMarksForSession(sessionId!)
      return response.data
    },
    enabled: !!sessionId,
  })
}

export function useUpsertAttendanceMark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertMarkRequest) => attendanceApi.upsertMark(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance-marks", variables.sessionId] })
      queryClient.invalidateQueries({ queryKey: ["attendance-sessions"] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save attendance mark")
    },
  })
}

export function useBulkUpsertAttendanceMarks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, marks }: { sessionId: string; marks: Omit<UpsertMarkRequest, "sessionId">[] }) =>
      attendanceApi.bulkUpsertMarks(sessionId, marks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance-marks", variables.sessionId] })
      queryClient.invalidateQueries({ queryKey: ["attendance-sessions"] })
      queryClient.invalidateQueries({ queryKey: ["attendance-summary"] })
      toast.success("Attendance marks saved successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save attendance marks")
    },
  })
}

export function useDeleteAttendanceMark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => attendanceApi.deleteMark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-marks"] })
      queryClient.invalidateQueries({ queryKey: ["attendance-sessions"] })
      toast.success("Attendance mark deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete attendance mark")
    },
  })
}

// ---- Reports ----

export function useAttendanceSummary(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["attendance-summary", filters],
    queryFn: async () => {
      const response = await attendanceApi.getAttendanceSummary(filters)
      return response.data
    },
  })
}

export function useStudentAttendance(enrollmentId: string | null, filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["student-attendance", enrollmentId, filters],
    queryFn: async () => {
      const response = await attendanceApi.getStudentAttendance(enrollmentId!, filters)
      return response.data
    },
    enabled: !!enrollmentId,
  })
}
