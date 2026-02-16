import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sectionsApi } from "@/lib/api/sections"
import { toast } from "@/components/ui/sonner"

export function useSections(gradeId?: string) {
  return useQuery({
    queryKey: ["sections", gradeId], // Include gradeId in query key for proper caching and refetching
    queryFn: () => sectionsApi.list(gradeId),
  })
}

export function useSection(id: string) {
  return useQuery({
    queryKey: ["sections", id],
    queryFn: () => sectionsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sectionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] })
      toast.success("Section created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create section", {
        description: error.message,
      })
    },
  })
}

export function useUpdateSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => sectionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] })
      toast.success("Section updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update section", {
        description: error.message,
      })
    },
  })
}

export function useDeleteSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sectionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] })
      toast.success("Section deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to delete section", {
        description: error.message,
      })
    },
  })
}
