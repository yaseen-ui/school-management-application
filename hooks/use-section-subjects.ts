import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sectionSubjectsApi } from "@/lib/api/section-subjects"
import { toast } from "@/components/ui/sonner"
import type { CreateSectionSubjectRequest } from "@/lib/api/section-subjects"

export function useSectionSubjects(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["section-subjects", filters],
    queryFn: async () => {
      const response = await sectionSubjectsApi.getAll(filters)
      return response.data.rows
    },
  })
}

export function useSectionSubject(id: string | null) {
  return useQuery({
    queryKey: ["section-subjects", id],
    queryFn: () => sectionSubjectsApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateSectionSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSectionSubjectRequest) => sectionSubjectsApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["section-subjects"] })
      const count = response?.data?.length || 1
      toast.success(`${count} subject(s) assigned successfully`)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create section subject")
    },
  })
}

export function useUpdateSectionSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSectionSubjectRequest> }) =>
      sectionSubjectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section-subjects"] })
      toast.success("Section subject updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update section subject")
    },
  })
}

export function useDeleteSectionSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => sectionSubjectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section-subjects"] })
      toast.success("Section subject deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete section subject")
    },
  })
}
