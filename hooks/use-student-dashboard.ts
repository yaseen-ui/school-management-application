"use client"

import { useQuery } from "@tanstack/react-query"
import {
  studentDashboardApi,
  type StudentDashboardData,
} from "@/lib/api/student-dashboard"

export function useStudentDashboard(
  enrollmentId: string | null | undefined,
  examScheduleId?: string | null
) {
  return useQuery({
    queryKey: ["student-dashboard", enrollmentId, examScheduleId ?? "latest"],
    queryFn: async () => {
      if (!enrollmentId) return null
      const response = await studentDashboardApi.get(enrollmentId, examScheduleId)
      return (response.data ?? null) as StudentDashboardData | null
    },
    enabled: !!enrollmentId,
    staleTime: 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry auth failures
      if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}
