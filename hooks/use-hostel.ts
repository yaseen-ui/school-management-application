import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  hostelBlocksApi,
  hostelFloorsApi,
  hostelRoomTypesApi,
  hostelRoomsApi,
  hostelSectionsApi,
  hostelStaffApi,
  hostelAllocationsApi,
} from "@/lib/api/hostel"
import { toast } from "@/components/ui/sonner"

// ---- Blocks ----
export function useHostelBlocks() {
  return useQuery({ queryKey: ["hostel-blocks"], queryFn: () => hostelBlocksApi.list() })
}

export function useHostelBlock(id: string) {
  return useQuery({ queryKey: ["hostel-blocks", id], queryFn: () => hostelBlocksApi.getById(id), enabled: !!id })
}

export function useCreateHostelBlock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelBlocksApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-blocks"] }); toast.success("Block created") },
    onError: (e: Error) => toast.error("Failed to create block", { description: e.message }),
  })
}

export function useUpdateHostelBlock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => hostelBlocksApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-blocks"] }); toast.success("Block updated") },
    onError: (e: Error) => toast.error("Failed to update block", { description: e.message }),
  })
}

export function useDeleteHostelBlock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelBlocksApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-blocks"] }); toast.success("Block deleted") },
    onError: (e: Error) => toast.error("Failed to delete block", { description: e.message }),
  })
}

// ---- Floors ----
export function useHostelFloors(blockId?: string) {
  return useQuery({ queryKey: ["hostel-floors", blockId], queryFn: () => hostelFloorsApi.list(blockId) })
}

export function useCreateHostelFloor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelFloorsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-floors"] }); qc.invalidateQueries({ queryKey: ["hostel-blocks"] }); toast.success("Floor created") },
    onError: (e: Error) => toast.error("Failed to create floor", { description: e.message }),
  })
}

export function useUpdateHostelFloor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => hostelFloorsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-floors"] }); qc.invalidateQueries({ queryKey: ["hostel-blocks"] }); toast.success("Floor updated") },
    onError: (e: Error) => toast.error("Failed to update floor", { description: e.message }),
  })
}

export function useDeleteHostelFloor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelFloorsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-floors"] }); qc.invalidateQueries({ queryKey: ["hostel-blocks"] }); toast.success("Floor deleted") },
    onError: (e: Error) => toast.error("Failed to delete floor", { description: e.message }),
  })
}

// ---- Room Types ----
export function useHostelRoomTypes() {
  return useQuery({ queryKey: ["hostel-room-types"], queryFn: () => hostelRoomTypesApi.list() })
}

export function useCreateHostelRoomType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelRoomTypesApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-room-types"] }); toast.success("Room type created") },
    onError: (e: Error) => toast.error("Failed to create room type", { description: e.message }),
  })
}

export function useUpdateHostelRoomType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => hostelRoomTypesApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-room-types"] }); toast.success("Room type updated") },
    onError: (e: Error) => toast.error("Failed to update room type", { description: e.message }),
  })
}

export function useDeleteHostelRoomType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelRoomTypesApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-room-types"] }); toast.success("Room type deleted") },
    onError: (e: Error) => toast.error("Failed to delete room type", { description: e.message }),
  })
}

// ---- Rooms ----
export function useHostelRooms(filters?: { floorId?: string; roomTypeId?: string; status?: string }) {
  return useQuery({ queryKey: ["hostel-rooms", filters], queryFn: () => hostelRoomsApi.list(filters) })
}

export function useHostelRoom(id: string) {
  return useQuery({ queryKey: ["hostel-rooms", id], queryFn: () => hostelRoomsApi.getById(id), enabled: !!id })
}

export function useCreateHostelRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelRoomsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-rooms"] }); qc.invalidateQueries({ queryKey: ["hostel-blocks"] }); toast.success("Room created") },
    onError: (e: Error) => toast.error("Failed to create room", { description: e.message }),
  })
}

export function useDeleteHostelRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelRoomsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-rooms"] }); qc.invalidateQueries({ queryKey: ["hostel-blocks"] }); toast.success("Room deleted") },
    onError: (e: Error) => toast.error("Failed to delete room", { description: e.message }),
  })
}

// ---- Sections ----
export function useHostelSections(blockId?: string) {
  return useQuery({ queryKey: ["hostel-sections", blockId], queryFn: () => hostelSectionsApi.list(blockId) })
}

export function useHostelSection(id: string) {
  return useQuery({ queryKey: ["hostel-sections", id], queryFn: () => hostelSectionsApi.getById(id), enabled: !!id })
}

export function useCreateHostelSection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelSectionsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-sections"] }); toast.success("Section created") },
    onError: (e: Error) => toast.error("Failed to create section", { description: e.message }),
  })
}

export function useUpdateHostelSection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => hostelSectionsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-sections"] }); toast.success("Section updated") },
    onError: (e: Error) => toast.error("Failed to update section", { description: e.message }),
  })
}

export function useDeleteHostelSection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelSectionsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-sections"] }); toast.success("Section deleted") },
    onError: (e: Error) => toast.error("Failed to delete section", { description: e.message }),
  })
}

export function useBatchAddRoomsToSection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sectionId, roomIds }: { sectionId: string; roomIds: string[] }) =>
      hostelSectionsApi.batchAddRooms(sectionId, roomIds),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-sections"] }); toast.success("Rooms assigned successfully") },
    onError: (e: Error) => toast.error("Failed to assign rooms", { description: e.message }),
  })
}

export function useAddRoomToSection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sectionId, roomId, sortOrder }: { sectionId: string; roomId: string; sortOrder?: number }) =>
      hostelSectionsApi.addRoom(sectionId, roomId, sortOrder),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-sections"] }); toast.success("Room added to section") },
    onError: (e: Error) => toast.error("Failed to add room", { description: e.message }),
  })
}

export function useRemoveRoomFromSection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sectionId, roomId }: { sectionId: string; roomId: string }) =>
      hostelSectionsApi.removeRoom(sectionId, roomId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-sections"] }); toast.success("Room removed from section") },
    onError: (e: Error) => toast.error("Failed to remove room", { description: e.message }),
  })
}

// ---- Staff ----
export function useHostelStaff(blockId?: string) {
  return useQuery({ queryKey: ["hostel-staff", blockId], queryFn: () => hostelStaffApi.list(blockId) })
}

export function useAssignHostelStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelStaffApi.assign,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-staff"] }); toast.success("Staff assigned") },
    onError: (e: Error) => toast.error("Failed to assign staff", { description: e.message }),
  })
}

export function useUpdateHostelStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => hostelStaffApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-staff"] }); toast.success("Staff assignment updated") },
    onError: (e: Error) => toast.error("Failed to update assignment", { description: e.message }),
  })
}

export function useDeleteHostelStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelStaffApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-staff"] }); toast.success("Staff assignment removed") },
    onError: (e: Error) => toast.error("Failed to remove assignment", { description: e.message }),
  })
}

// ---- Allocations ----
export function useHostelAllocations(filters?: { academicYearId?: string; roomId?: string; sectionId?: string; status?: string }) {
  return useQuery({ queryKey: ["hostel-allocations", filters], queryFn: () => hostelAllocationsApi.list(filters) })
}

export function useCreateHostelAllocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelAllocationsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-allocations"] }); toast.success("Student allocated") },
    onError: (e: Error) => toast.error("Failed to allocate student", { description: e.message }),
  })
}

export function useUpdateHostelAllocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => hostelAllocationsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-allocations"] }); toast.success("Allocation updated") },
    onError: (e: Error) => toast.error("Failed to update allocation", { description: e.message }),
  })
}

export function useDeleteHostelAllocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: hostelAllocationsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hostel-allocations"] }); toast.success("Allocation removed") },
    onError: (e: Error) => toast.error("Failed to remove allocation", { description: e.message }),
  })
}