import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { subjectOfferingsApi } from "@/lib/api/subject-offerings"
import { toast } from "@/components/ui/sonner"
import type { CreateSubjectOfferingRequest } from "@/lib/api/subject-offerings"

export function useSubjectOfferings(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["subject-offerings", filters],
    queryFn: async () => {
      const response = await subjectOfferingsApi.getAll(filters)
      return response.data.rows
    },
  })
}

export function useSubjectOffering(id: string | null) {
  return useQuery({
    queryKey: ["subject-offerings", id],
    queryFn: () => subjectOfferingsApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateSubjectOffering() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubjectOfferingRequest) => subjectOfferingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-offerings"] })
      toast.success("Subject offering created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create subject offering")
    },
  })
}

export function useUpdateSubjectOffering() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSubjectOfferingRequest> }) =>
      subjectOfferingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-offerings"] })
      toast.success("Subject offering updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update subject offering")
    },
  })
}

export function useDeleteSubjectOffering() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subjectOfferingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-offerings"] })
      toast.success("Subject offering deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete subject offering")
    },
  })
}
