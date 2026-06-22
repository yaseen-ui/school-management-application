import { apiClient } from "./client"
import type { ApiResponse } from "./types"

export interface Building {
  id: string
  tenantId: string
  name: string
  code?: string | null
  description?: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    floors: number
  }
  floors?: Floor[]
}

export interface Floor {
  id: string
  tenantId: string
  buildingId: string
  floorNumber: number
  name?: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    rooms: number
  }
  rooms?: Room[]
}

export interface Room {
  id: string
  tenantId: string
  floorId: string
  roomNumber: string
  roomName?: string | null
  roomType: string
  roomCategory?: string | null
  capacity: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateBuildingRequest {
  name: string
  code?: string
  description?: string
}

export interface UpdateBuildingRequest {
  name?: string
  code?: string
  description?: string
}

export interface CreateFloorRequest {
  buildingId: string
  floorNumber: number
  name?: string
}

export interface UpdateFloorRequest {
  floorNumber?: number
  name?: string
}

export interface CreateRoomRequest {
  floorId: string
  roomNumber: string
  roomName?: string
  roomType?: string
  roomCategory?: string
  capacity: number
}

export interface UpdateRoomRequest {
  roomNumber?: string
  roomName?: string
  roomType?: string
  roomCategory?: string
  capacity?: number
  status?: string
}

export const buildingsApi = {
  list: () => apiClient.get<ApiResponse<Building[]>>("/buildings"),

  getById: (id: string) => apiClient.get<ApiResponse<Building>>(`/buildings/${id}`),

  create: (data: CreateBuildingRequest) => apiClient.post<ApiResponse<Building>>("/buildings", data),

  update: (id: string, data: UpdateBuildingRequest) => apiClient.put<ApiResponse<Building>>(`/buildings/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/buildings/${id}`),
}

export const floorsApi = {
  list: (buildingId?: string) => {
    const params = buildingId ? { buildingId } : undefined
    return apiClient.get<ApiResponse<Floor[]>>("/floors", params)
  },

  getById: (id: string) => apiClient.get<ApiResponse<Floor>>(`/floors/${id}`),

  create: (data: CreateFloorRequest) => apiClient.post<ApiResponse<Floor>>("/floors", data),

  update: (id: string, data: UpdateFloorRequest) => apiClient.put<ApiResponse<Floor>>(`/floors/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/floors/${id}`),
}

export const roomsApi = {
  list: (floorId?: string) => {
    const params = floorId ? { floorId } : undefined
    return apiClient.get<ApiResponse<Room[]>>("/rooms", params)
  },

  getById: (id: string) => apiClient.get<ApiResponse<Room>>(`/rooms/${id}`),

  create: (data: CreateRoomRequest) => apiClient.post<ApiResponse<Room>>("/rooms", data),

  update: (id: string, data: UpdateRoomRequest) => apiClient.put<ApiResponse<Room>>(`/rooms/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/rooms/${id}`),
}
