import { apiClient } from "./client"

export interface Role {
  id: string
  roleName: string
  description: string
  permissions: string[]
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateRoleRequest {
  roleName: string
  description: string
  permissions: string[]
}

export interface UpdateRoleRequest {
  roleName: string
  description: string
  permissions: string[]
}

export interface RolesResponse {
  status: string
  data: Role[]
  message: string
}

export const rolesApi = {
  getAll: () => apiClient.get<RolesResponse>("/roles"),

  getById: (id: string) => apiClient.get<{ status: string; data: Role; message: string }>(`/roles/${id}`),

  create: (data: CreateRoleRequest) => apiClient.post<{ status: string; data: Role; message: string }>("/roles", data),

  update: (id: string, data: UpdateRoleRequest) =>
    apiClient.put<{ status: string; data: Role; message: string }>(`/roles/${id}`, data),

  delete: (id: string) => apiClient.delete<{ status: string; message: string }>(`/roles/${id}`),
}
