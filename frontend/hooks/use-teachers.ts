import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { teachersApi } from "@/lib/api/teachers"
import { toast } from "@/components/ui/sonner"
import type {
  CreateTeacherRequest,
  CreateQualificationRequest,
  CreateEmploymentHistoryRequest,
} from "@/lib/api/teachers"

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => teachersApi.getAll(),
  })
}

export function useTeacher(id: string | null) {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teachersApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTeacherRequest) => teachersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
      toast.success("Teacher created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create teacher")
    },
  })
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teacherId, data }: { teacherId: string; data: Partial<CreateTeacherRequest> }) =>
      teachersApi.update(teacherId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] })
      toast.success("Teacher updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update teacher")
    },
  })
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => teachersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
      toast.success("Teacher deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete teacher")
    },
  })
}

// Qualifications
export function useAddQualification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teacherId, data }: { teacherId: string; data: CreateQualificationRequest }) =>
      teachersApi.addQualification(teacherId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] })
      toast.success("Qualification added successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add qualification")
    },
  })
}

export function useUpdateQualification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      teacherId,
      qualificationId,
      data,
    }: {
      teacherId: string
      qualificationId: string
      data: Partial<CreateQualificationRequest>
    }) => teachersApi.updateQualification(teacherId, qualificationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] })
      toast.success("Qualification updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update qualification")
    },
  })
}

export function useDeleteQualification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teacherId, qualificationId }: { teacherId: string; qualificationId: string }) =>
      teachersApi.deleteQualification(teacherId, qualificationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] })
      toast.success("Qualification deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete qualification")
    },
  })
}

// Employment History
export function useAddEmploymentHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teacherId, data }: { teacherId: string; data: CreateEmploymentHistoryRequest }) =>
      teachersApi.addEmploymentHistory(teacherId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] })
      toast.success("Employment history added successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add employment history")
    },
  })
}

export function useUpdateEmploymentHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      teacherId,
      employmentHistoryId,
      data,
    }: {
      teacherId: string
      employmentHistoryId: string
      data: Partial<CreateEmploymentHistoryRequest>
    }) => teachersApi.updateEmploymentHistory(teacherId, employmentHistoryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] })
      toast.success("Employment history updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update employment history")
    },
  })
}

export function useDeleteEmploymentHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teacherId, employmentHistoryId }: { teacherId: string; employmentHistoryId: string }) =>
      teachersApi.deleteEmploymentHistory(teacherId, employmentHistoryId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] })
      toast.success("Employment history deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete employment history")
    },
  })
}
