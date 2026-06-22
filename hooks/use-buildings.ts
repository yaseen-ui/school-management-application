import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { buildingsApi, floorsApi, roomsApi } from "@/lib/api/buildings"
import { toast } from "@/components/ui/sonner"

// ---- Buildings ----

export function useBuildings() {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: () => buildingsApi.list(),
  })
}

export function useBuilding(id: string) {
  return useQuery({
    queryKey: ["buildings", id],
    queryFn: () => buildingsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateBuilding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: buildingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Building created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create building", {
        description: error.message,
      })
    },
  })
}

export function useUpdateBuilding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => buildingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Building updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update building", {
        description: error.message,
      })
    },
  })
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: buildingsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Building deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to delete building", {
        description: error.message,
      })
    },
  })
}

// ---- Floors ----

export function useFloors(buildingId?: string) {
  return useQuery({
    queryKey: ["floors", buildingId],
    queryFn: () => floorsApi.list(buildingId),
  })
}

export function useFloor(id: string) {
  return useQuery({
    queryKey: ["floors", id],
    queryFn: () => floorsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateFloor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: floorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] })
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Floor created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create floor", {
        description: error.message,
      })
    },
  })
}

export function useUpdateFloor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => floorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] })
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Floor updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update floor", {
        description: error.message,
      })
    },
  })
}

export function useDeleteFloor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: floorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] })
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Floor deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to delete floor", {
        description: error.message,
      })
    },
  })
}

// ---- Rooms ----

export function useRooms(floorId?: string) {
  return useQuery({
    queryKey: ["rooms", floorId],
    queryFn: () => roomsApi.list(floorId),
  })
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => roomsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roomsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      queryClient.invalidateQueries({ queryKey: ["floors"] })
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Room created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create room", {
        description: error.message,
      })
    },
  })
}

export function useUpdateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => roomsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      queryClient.invalidateQueries({ queryKey: ["floors"] })
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Room updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update room", {
        description: error.message,
      })
    },
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roomsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      queryClient.invalidateQueries({ queryKey: ["floors"] })
      queryClient.invalidateQueries({ queryKey: ["buildings"] })
      toast.success("Room deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to delete room", {
        description: error.message,
      })
    },
  })
}
