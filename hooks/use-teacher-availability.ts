import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { teacherAvailabilityApi } from "@/lib/api/teacher-availability"
import { toast } from "@/components/ui/sonner"
import type { UpsertAvailabilityRequest } from "@/lib/api/teacher-availability"

export function useTeacherAvailability(teacherId: string | null) {
  return useQuery({
    queryKey: ["teacher-availability", teacherId],
    queryFn: async () => {
      if (!teacherId) return []
      const response = await teacherAvailabilityApi.getByTeacher(teacherId)
      return response.data
    },
    enabled: !!teacherId,
  })
}

export function useAllTeacherAvailability(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["teacher-availability", "all", filters],
    queryFn: async () => {
      const response = await teacherAvailabilityApi.getAll(filters)
      return response.data
    },
  })
}

export function useUpsertTeacherAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertAvailabilityRequest) => teacherAvailabilityApi.upsertBulk(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teacher-availability", variables.teacherId] })
      queryClient.invalidateQueries({ queryKey: ["teacher-availability", "all"] })
      toast.success("Teacher availability saved successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save teacher availability")
    },
  })
}

export function useDeleteTeacherAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => teacherAvailabilityApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-availability"] })
      toast.success("Availability slot deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete availability slot")
    },
  })
}
