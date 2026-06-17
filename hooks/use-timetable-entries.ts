import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { timetableEntriesApi } from "@/lib/api/timetable-entries"
import { toast } from "@/components/ui/sonner"
import type { CreateTimetableEntryRequest } from "@/lib/api/timetable-entries"

export function useTimetableEntries(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["timetable-entries", filters],
    queryFn: async () => {
      const response = await timetableEntriesApi.getAll(filters)
      return response.data.rows
    },
  })
}

export function useTimetableEntry(id: string | null) {
  return useQuery({
    queryKey: ["timetable-entries", id],
    queryFn: () => timetableEntriesApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateTimetableEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTimetableEntryRequest) => timetableEntriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-entries"] })
      toast.success("Timetable entry created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create timetable entry")
    },
  })
}

export function useUpdateTimetableEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTimetableEntryRequest> }) =>
      timetableEntriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-entries"] })
      toast.success("Timetable entry updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update timetable entry")
    },
  })
}

export function useDeleteTimetableEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => timetableEntriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-entries"] })
      toast.success("Timetable entry deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete timetable entry")
    },
  })
}

export function useTimetableGrid(sectionId: string | null, academicYearId: string | null) {
  return useQuery({
    queryKey: ["timetable-grid", sectionId, academicYearId],
    queryFn: async () => {
      const response = await timetableEntriesApi.getGridForSection(sectionId!, academicYearId!)
      return response.data
    },
    enabled: !!sectionId && !!academicYearId,
  })
}
