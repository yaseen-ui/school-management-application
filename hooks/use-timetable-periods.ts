import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { timetablePeriodsApi } from "@/lib/api/timetable-periods"
import { toast } from "@/components/ui/sonner"
import type { CreateTimetablePeriodRequest } from "@/lib/api/timetable-periods"

export function useTimetablePeriods(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["timetable-periods", filters],
    queryFn: async () => {
      const response = await timetablePeriodsApi.getAll(filters)
      return response.data.rows
    },
  })
}

export function useTimetablePeriod(id: string | null) {
  return useQuery({
    queryKey: ["timetable-periods", id],
    queryFn: () => timetablePeriodsApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateTimetablePeriod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTimetablePeriodRequest) => timetablePeriodsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-periods"] })
      toast.success("Timetable period created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create timetable period")
    },
  })
}

export function useUpdateTimetablePeriod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTimetablePeriodRequest> }) =>
      timetablePeriodsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-periods"] })
      toast.success("Timetable period updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update timetable period")
    },
  })
}

export function useDeleteTimetablePeriod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => timetablePeriodsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-periods"] })
      toast.success("Timetable period deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete timetable period")
    },
  })
}
