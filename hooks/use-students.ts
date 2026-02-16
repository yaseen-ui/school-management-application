import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { studentsApi } from "@/lib/api/students"
import type { CreateStudentRequest, UpdateStudentRequest } from "@/lib/api/students"
import { toast } from "sonner"

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await studentsApi.list()
      return response.data
    },
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      const response = await studentsApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStudentRequest) => studentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast.success("Student created successfully")
    },
    onError: () => {
      toast.error("Failed to create student")
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) => studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast.success("Student updated successfully")
    },
    onError: () => {
      toast.error("Failed to update student")
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast.success("Student deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete student")
    },
  })
}
