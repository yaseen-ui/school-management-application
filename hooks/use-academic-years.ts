import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { academicYearsApi } from "@/lib/api/academic-years"
import type { CreateAcademicYearRequest, UpdateAcademicYearRequest } from "@/lib/api/academic-years"
import { toast } from "@/components/ui/sonner"

export function useAcademicYears() {
  return useQuery({
    queryKey: ["academic-years"],
    queryFn: () => academicYearsApi.getAll(),
  })
}

export function useActiveAcademicYear() {
  return useQuery({
    queryKey: ["academic-years", "active"],
    queryFn: () => academicYearsApi.getActive(),
  })
}

export function useAcademicYear(id: string | null) {
  return useQuery({
    queryKey: ["academic-years", id],
    queryFn: () => academicYearsApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAcademicYearRequest) => academicYearsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] })
      toast.success("Academic year created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create academic year")
    },
  })
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcademicYearRequest }) => academicYearsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] })
      toast.success("Academic year updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update academic year")
    },
  })
}

export function useActivateAcademicYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => academicYearsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] })
      toast.success("Academic year activated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to activate academic year")
    },
  })
}

export function useArchiveAcademicYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => academicYearsApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] })
      toast.success("Academic year archived successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to archive academic year")
    },
  })
}
