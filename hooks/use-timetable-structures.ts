import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { timetableStructuresApi } from "@/lib/api/timetable-structures"
import { toast } from "@/components/ui/sonner"
import type { CreateTimetableStructureRequest } from "@/lib/api/timetable-structures"

export function useTimetableStructures() {
  return useQuery({
    queryKey: ["timetable-structures"],
    queryFn: async () => {
      const response = await timetableStructuresApi.getAll()
      return response.data.rows
    },
  })
}

export function useTimetableStructure(id: string | null) {
  return useQuery({
    queryKey: ["timetable-structures", id],
    queryFn: () => timetableStructuresApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateTimetableStructure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTimetableStructureRequest) => timetableStructuresApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-structures"] })
      toast.success("Timetable structure created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create timetable structure")
    },
  })
}

export function useUpdateTimetableStructure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTimetableStructureRequest> }) =>
      timetableStructuresApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-structures"] })
      toast.success("Timetable structure updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update timetable structure")
    },
  })
}

export function useDeleteTimetableStructure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => timetableStructuresApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-structures"] })
      toast.success("Timetable structure deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete timetable structure")
    },
  })
}
