import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { subjectsApi } from "@/lib/api/subjects"
import { toast } from "@/components/ui/sonner"

export function useSubjects(courseId?: string) {
  return useQuery({
    queryKey: ["subjects", courseId],
    queryFn: async () => {
      const response = await subjectsApi.list(courseId)
      return response.data
    },
  })
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: ["subjects", id],
    queryFn: async () => {
      const response = await subjectsApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Subject created successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create subject")
    },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => subjectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Subject updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update subject")
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subjectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Subject deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete subject")
    },
  })
}
