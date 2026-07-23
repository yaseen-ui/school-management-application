import { apiClient } from "./client"
import type { ApiResponse } from "./types"

// ==================== Types ====================

export interface HostelBlock {
  id: string
  tenantId: string
  name: string
  code?: string | null
  description?: string | null
  gender?: "Male" | "Female" | "Other" | null
  status: string
  createdAt: string
  updatedAt: string
  _count?: { floors: number; sections: number; staffAssignments: number }
  floors?: HostelFloor[]
  sections?: HostelSection[]
  staffAssignments?: HostelStaffAssignment[]
}

export interface HostelFloor {
  id: string
  tenantId: string
  blockId: string
  floorNumber: number
  name?: string | null
  gender?: "Male" | "Female" | "Other" | null
  createdAt: string
  updatedAt: string
  _count?: { rooms: number }
  block?: { id: string; name: string }
  rooms?: HostelRoom[]
}

export interface HostelRoomType {
  id: string
  tenantId: string
  name: string
  description?: string | null
  defaultCapacity: number
  amenities?: string[] | null
  createdAt: string
  updatedAt: string
  _count?: { rooms: number; feeHeads: number }
}

export interface HostelRoom {
  id: string
  tenantId: string
  floorId: string
  roomTypeId: string
  roomNumber: string
  capacity: number
  status: string
  createdAt: string
  updatedAt: string
  roomType?: { id: string; name: string; defaultCapacity?: number; amenities?: string[] }
  floor?: { id: string; floorNumber: number; name?: string | null; block?: { id: string; name: string } }
  sectionRooms?: HostelSectionRoom[]
  studentAllocations?: StudentHostelAllocation[]
  _count?: { studentAllocations: number }
}

export interface HostelSection {
  id: string
  tenantId: string
  blockId: string
  sectionName: string
  description?: string | null
  createdAt: string
  updatedAt: string
  block?: { id: string; name: string }
  sectionRooms?: HostelSectionRoom[]
  studentAllocations?: StudentHostelAllocation[]
  _count?: { sectionRooms: number; studentAllocations: number }
}

export interface HostelSectionRoom {
  id: string
  tenantId: string
  sectionId: string
  roomId: string
  sortOrder: number
  createdAt: string
  updatedAt: string
  room?: { id: string; roomNumber: string; capacity: number; roomType?: { id: string; name: string } }
  section?: { id: string; sectionName: string }
}

export interface HostelStaffAssignment {
  id: string
  tenantId: string
  blockId: string
  teacherId: string
  role: "warden" | "in_charge" | "cook" | "mate" | "cleaner" | "other"
  fromDate: string
  toDate?: string | null
  status: string
  createdAt: string
  updatedAt: string
  teacher?: { id: string; fullName: string; phone?: string; employeeCode?: string }
  block?: { id: string; name: string }
}

export interface StudentHostelAllocation {
  id: string
  tenantId: string
  enrollmentId: string
  roomId: string
  sectionId?: string | null
  academicYearId: string
  fromDate: string
  toDate?: string | null
  status: string
  createdAt: string
  updatedAt: string
  room?: { id: string; roomNumber: string; floor?: { id: string; floorNumber: number; block?: { id: string; name: string } }; roomType?: { id: string; name: string } }
  section?: { id: string; sectionName: string }
  enrollment?: { id: string; rollNumber?: string | null; student?: { id: string; firstName: string; lastName: string }; grade?: { id: string; gradeName: string }; section?: { id: string; sectionName: string } }
}

// ==================== Request Types ====================

export interface CreateBlockRequest {
  name: string
  code?: string
  description?: string
  gender?: "Male" | "Female" | "Other"
}

export interface UpdateBlockRequest {
  name?: string
  code?: string
  description?: string
  gender?: "Male" | "Female" | "Other"
  status?: string
}

export interface CreateFloorRequest {
  blockId: string
  floorNumber: number
  name?: string
  gender?: "Male" | "Female" | "Other"
}

export interface UpdateFloorRequest {
  floorNumber?: number
  name?: string
  gender?: "Male" | "Female" | "Other" | null
}

export interface CreateRoomTypeRequest {
  name: string
  description?: string
  defaultCapacity?: number
  amenities?: string[]
}

export interface UpdateRoomTypeRequest {
  name?: string
  description?: string
  defaultCapacity?: number
  amenities?: string[]
}

export interface CreateRoomRequest {
  floorId: string
  roomTypeId: string
  roomNumber: string
  capacity: number
}

export interface UpdateRoomRequest {
  roomNumber?: string
  roomTypeId?: string
  capacity?: number
  status?: string
}

export interface CreateSectionRequest {
  blockId: string
  sectionId: string
  description?: string
}

export interface UpdateSectionRequest {
  description?: string
}

export interface AssignStaffRequest {
  blockId: string
  teacherId: string
  role: "warden" | "in_charge" | "cook" | "mate" | "cleaner" | "other"
  fromDate?: string
  toDate?: string
}

export interface UpdateStaffRequest {
  role?: string
  status?: string
  toDate?: string | null
}

export interface AllocateStudentRequest {
  enrollmentId: string
  roomId: string
  sectionId?: string | null
  academicYearId: string
  fromDate?: string
  toDate?: string
}

export interface UpdateAllocationRequest {
  roomId?: string
  sectionId?: string | null
  status?: string
  toDate?: string | null
}

// ==================== API Functions ====================

export const hostelBlocksApi = {
  list: () => apiClient.get<ApiResponse<HostelBlock[]>>("/hostel/blocks"),
  getById: (id: string) => apiClient.get<ApiResponse<HostelBlock>>(`/hostel/blocks/${id}`),
  create: (data: CreateBlockRequest) => apiClient.post<ApiResponse<HostelBlock>>("/hostel/blocks", data),
  update: (id: string, data: UpdateBlockRequest) => apiClient.put<ApiResponse<HostelBlock>>(`/hostel/blocks/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/hostel/blocks/${id}`),
}

export const hostelFloorsApi = {
  list: (blockId?: string) => {
    const params = blockId ? { blockId } : undefined
    return apiClient.get<ApiResponse<HostelFloor[]>>("/hostel/floors", params)
  },
  getById: (id: string) => apiClient.get<ApiResponse<HostelFloor>>(`/hostel/floors/${id}`),
  create: (data: CreateFloorRequest) => apiClient.post<ApiResponse<HostelFloor>>("/hostel/floors", data),
  update: (id: string, data: UpdateFloorRequest) => apiClient.put<ApiResponse<HostelFloor>>(`/hostel/floors/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/hostel/floors/${id}`),
}

export const hostelRoomTypesApi = {
  list: () => apiClient.get<ApiResponse<HostelRoomType[]>>("/hostel/room-types"),
  create: (data: CreateRoomTypeRequest) => apiClient.post<ApiResponse<HostelRoomType>>("/hostel/room-types", data),
  update: (id: string, data: UpdateRoomTypeRequest) => apiClient.put<ApiResponse<HostelRoomType>>(`/hostel/room-types/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/hostel/room-types/${id}`),
}

export const hostelRoomsApi = {
  list: (filters?: { floorId?: string; roomTypeId?: string; status?: string }) => {
    const params = filters && Object.keys(filters).length > 0 ? filters : undefined
    return apiClient.get<ApiResponse<HostelRoom[]>>("/hostel/rooms", params)
  },
  getById: (id: string) => apiClient.get<ApiResponse<HostelRoom>>(`/hostel/rooms/${id}`),
  create: (data: CreateRoomRequest) => apiClient.post<ApiResponse<HostelRoom>>("/hostel/rooms", data),
  update: (id: string, data: UpdateRoomRequest) => apiClient.put<ApiResponse<HostelRoom>>(`/hostel/rooms/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/hostel/rooms/${id}`),
}

export const hostelSectionsApi = {
  list: (blockId?: string) => {
    const params = blockId ? { blockId } : undefined
    return apiClient.get<ApiResponse<HostelSection[]>>("/hostel/sections", params)
  },
  getById: (id: string) => apiClient.get<ApiResponse<HostelSection>>(`/hostel/sections/${id}`),
  create: (data: CreateSectionRequest) => apiClient.post<ApiResponse<HostelSection>>("/hostel/sections", data),
  update: (id: string, data: UpdateSectionRequest) => apiClient.put<ApiResponse<HostelSection>>(`/hostel/sections/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/hostel/sections/${id}`),
  addRoom: (sectionId: string, roomId: string, sortOrder?: number) =>
    apiClient.post<ApiResponse<HostelSectionRoom>>(`/hostel/sections/${sectionId}/rooms`, { roomId, sortOrder }),
  batchAddRooms: (sectionId: string, roomIds: string[]) =>
    apiClient.post<ApiResponse<{ count: number; rooms: { id: string }[] }>>(`/hostel/sections/${sectionId}/rooms/batch`, { roomIds }),
  removeRoom: (sectionId: string, roomId: string) =>
    apiClient.delete<ApiResponse<void>>(`/hostel/sections/${sectionId}/rooms/${roomId}`),
}

export const hostelStaffApi = {
  list: (blockId?: string) => {
    const params = blockId ? { blockId } : undefined
    return apiClient.get<ApiResponse<HostelStaffAssignment[]>>("/hostel/staff", params)
  },
  assign: (data: AssignStaffRequest) => apiClient.post<ApiResponse<HostelStaffAssignment>>("/hostel/staff", data),
  update: (id: string, data: UpdateStaffRequest) => apiClient.put<ApiResponse<HostelStaffAssignment>>(`/hostel/staff/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/hostel/staff/${id}`),
}

export const hostelAllocationsApi = {
  list: (filters?: { academicYearId?: string; roomId?: string; sectionId?: string; status?: string }) => {
    const params = filters && Object.keys(filters).length > 0 ? filters : undefined
    return apiClient.get<ApiResponse<StudentHostelAllocation[]>>("/hostel/allocations", params)
  },
  create: (data: AllocateStudentRequest) => apiClient.post<ApiResponse<StudentHostelAllocation>>("/hostel/allocations", data),
  update: (id: string, data: UpdateAllocationRequest) => apiClient.put<ApiResponse<StudentHostelAllocation>>(`/hostel/allocations/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/hostel/allocations/${id}`),
}
