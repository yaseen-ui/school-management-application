"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getVehicleCategories,
  getVehicleCategory,
  createVehicleCategory,
  updateVehicleCategory,
  deleteVehicleCategory,
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getDriverAssignments,
  getDriverAssignment,
  createDriverAssignment,
  updateDriverAssignment,
  deleteDriverAssignment,
  getPickupPoints,
  getPickupPoint,
  createPickupPoint,
  updatePickupPoint,
  deletePickupPoint,
  getTransportAssignments,
  getTransportAssignment,
  createTransportAssignment,
  updateTransportAssignment,
  deleteTransportAssignment,
  autoAssignVehicles,
  findNearestPickupPoint,
  checkVehicleAvailability,
  type VehicleCategory,
  type Vehicle,
  type DriverAssignment,
  type PickupPoint,
  type TransportAssignment,
} from "@/lib/api/transportation"
import { toast } from "@/components/ui/sonner"

// ─── Vehicle Categories ──────────────────────────────────────────────────────

export function useVehicleCategories(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["vehicle-categories", params],
    queryFn: async () => {
      const response = await getVehicleCategories(params)
      return response.data?.rows || []
    },
  })
}

export function useVehicleCategory(id: string) {
  return useQuery({
    queryKey: ["vehicle-category", id],
    queryFn: async () => {
      return await getVehicleCategory(id)
    },
    enabled: !!id,
  })
}

export function useCreateVehicleCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<VehicleCategory>) => createVehicleCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-categories"] })
      toast.success("Vehicle category created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create vehicle category")
    },
  })
}

export function useUpdateVehicleCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VehicleCategory> }) =>
      updateVehicleCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-categories"] })
      toast.success("Vehicle category updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update vehicle category")
    },
  })
}

export function useDeleteVehicleCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteVehicleCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-categories"] })
      toast.success("Vehicle category deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete vehicle category")
    },
  })
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

export function useVehicles(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: async () => {
      const response = await getVehicles(params)
      return response.data?.rows || []
    },
  })
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      return await getVehicle(id)
    },
    enabled: !!id,
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Vehicle>) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create vehicle")
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) =>
      updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update vehicle")
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete vehicle")
    },
  })
}

// ─── Driver Assignments ──────────────────────────────────────────────────────

export function useDriverAssignments(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["driver-assignments", params],
    queryFn: async () => {
      const response = await getDriverAssignments(params)
      return response.data?.rows || []
    },
  })
}

export function useDriverAssignment(id: string) {
  return useQuery({
    queryKey: ["driver-assignment", id],
    queryFn: async () => {
      return await getDriverAssignment(id)
    },
    enabled: !!id,
  })
}

export function useCreateDriverAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<DriverAssignment>) => createDriverAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-assignments"] })
      toast.success("Driver assignment created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create driver assignment")
    },
  })
}

export function useUpdateDriverAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DriverAssignment> }) =>
      updateDriverAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-assignments"] })
      toast.success("Driver assignment updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update driver assignment")
    },
  })
}

export function useDeleteDriverAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDriverAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-assignments"] })
      toast.success("Driver assignment deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete driver assignment")
    },
  })
}

// ─── Pickup Points ───────────────────────────────────────────────────────────

export function usePickupPoints(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["pickup-points", params],
    queryFn: async () => {
      const response = await getPickupPoints(params)
      return response.data?.rows || []
    },
  })
}

export function usePickupPoint(id: string) {
  return useQuery({
    queryKey: ["pickup-point", id],
    queryFn: async () => {
      return await getPickupPoint(id)
    },
    enabled: !!id,
  })
}

export function useCreatePickupPoint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<PickupPoint>) => createPickupPoint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickup-points"] })
      toast.success("Pickup point created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create pickup point")
    },
  })
}

export function useUpdatePickupPoint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PickupPoint> }) =>
      updatePickupPoint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickup-points"] })
      toast.success("Pickup point updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update pickup point")
    },
  })
}

export function useDeletePickupPoint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePickupPoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickup-points"] })
      toast.success("Pickup point deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete pickup point")
    },
  })
}

// ─── Transport Assignments ───────────────────────────────────────────────────

export function useTransportAssignments(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["transport-assignments", params],
    queryFn: async () => {
      const response = await getTransportAssignments(params)
      return response.data?.rows || []
    },
  })
}

export function useTransportAssignment(id: string) {
  return useQuery({
    queryKey: ["transport-assignment", id],
    queryFn: async () => {
      return await getTransportAssignment(id)
    },
    enabled: !!id,
  })
}

export function useCreateTransportAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<TransportAssignment>) => createTransportAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-assignments"] })
      toast.success("Transport assignment created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create transport assignment")
    },
  })
}

export function useUpdateTransportAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransportAssignment> }) =>
      updateTransportAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-assignments"] })
      toast.success("Transport assignment updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update transport assignment")
    },
  })
}

export function useDeleteTransportAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransportAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-assignments"] })
      toast.success("Transport assignment deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete transport assignment")
    },
  })
}

// ─── Special Features ────────────────────────────────────────────────────────

export function useAutoAssignVehicles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => autoAssignVehicles(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["transport-assignments"] })
      toast.success(response.message || "Vehicles auto-assigned successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to auto-assign vehicles")
    },
  })
}

export function useNearestPickupPoint(latitude: number, longitude: number) {
  return useQuery({
    queryKey: ["nearest-pickup-point", latitude, longitude],
    queryFn: async () => {
      return await findNearestPickupPoint(latitude, longitude)
    },
    enabled: !!latitude && !!longitude,
  })
}

export function useVehicleAvailability(vehicleId: string) {
  return useQuery({
    queryKey: ["vehicle-availability", vehicleId],
    queryFn: async () => {
      return await checkVehicleAvailability(vehicleId)
    },
    enabled: !!vehicleId,
  })
}
