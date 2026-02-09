import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gradesApi } from "@/lib/api/grades"
import { toast } from "@/components/ui/sonner"

export function useGrades(courseId?: string) {
  return useQuery({
    queryKey: ["grades", courseId], // Include courseId in query key for proper caching
    queryFn: async () => {
      const response = await gradesApi.list(courseId)
      return response.data
    },
  })
}

export function useGrade(id: string) {
  return useQuery({
    queryKey: ["grades", id],
    queryFn: async () => {
      const response = await gradesApi.getById(id)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: gradesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] })
      toast.success("Grade created successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create grade")
    },
  })
}

export function useUpdateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => gradesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] })
      toast.success("Grade updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update grade")
    },
  })
}

export function useDeleteGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: gradesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] })
      toast.success("Grade deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete grade")
    },
  })
}
