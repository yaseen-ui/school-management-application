import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { teacherAssignmentsApi } from "@/lib/api/teacher-assignments"
import { toast } from "@/components/ui/sonner"
import type { CreateTeacherAssignmentRequest } from "@/lib/api/teacher-assignments"

export function useTeacherAssignments(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["teacher-assignments", filters],
    queryFn: async () => {
      const response = await teacherAssignmentsApi.getAll(filters)
      return response.data.rows
    },
  })
}

export function useTeacherAssignment(id: string | null) {
  return useQuery({
    queryKey: ["teacher-assignments", id],
    queryFn: () => teacherAssignmentsApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateTeacherAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      data,
      overrideCapabilityCheck,
    }: {
      data: CreateTeacherAssignmentRequest
      overrideCapabilityCheck?: boolean
    }) => teacherAssignmentsApi.create(data, overrideCapabilityCheck),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] })
      toast.success("Teacher assignment created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create teacher assignment")
    },
  })
}

export function useUpdateTeacherAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTeacherAssignmentRequest> }) =>
      teacherAssignmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] })
      toast.success("Teacher assignment updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update teacher assignment")
    },
  })
}

export function useDeleteTeacherAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => teacherAssignmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] })
      toast.success("Teacher assignment deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete teacher assignment")
    },
  })
}

export function useEligibleTeachers(sectionSubjectId: string | null, role?: string) {
  return useQuery({
    queryKey: ["eligible-teachers", sectionSubjectId, role],
    queryFn: async () => {
      const response = await teacherAssignmentsApi.getEligibleTeachers(sectionSubjectId!, role)
      return response.data
    },
    enabled: !!sectionSubjectId,
  })
}
