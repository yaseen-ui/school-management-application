import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { teacherCapabilitiesApi } from "@/lib/api/teacher-capabilities"
import { toast } from "@/components/ui/sonner"
import type { CreateTeacherCapabilityRequest } from "@/lib/api/teacher-capabilities"

export function useTeacherCapabilities(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["teacher-capabilities", filters],
    queryFn: async () => {
      const response = await teacherCapabilitiesApi.getAll(filters)
      return response.data.rows
    },
  })
}

export function useTeacherCapability(id: string | null) {
  return useQuery({
    queryKey: ["teacher-capabilities", id],
    queryFn: () => teacherCapabilitiesApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateTeacherCapability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTeacherCapabilityRequest) => teacherCapabilitiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-capabilities"] })
      toast.success("Teacher capability created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create teacher capability")
    },
  })
}

export function useUpdateTeacherCapability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTeacherCapabilityRequest> }) =>
      teacherCapabilitiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-capabilities"] })
      toast.success("Teacher capability updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update teacher capability")
    },
  })
}

export function useDeleteTeacherCapability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => teacherCapabilitiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-capabilities"] })
      toast.success("Teacher capability deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete teacher capability")
    },
  })
}
