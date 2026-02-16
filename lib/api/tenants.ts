import { apiClient } from "./client"
import type { Tenant, CreateTenantRequest, UpdateTenantRequest, PaginatedResponse } from "./types"

export const tenantsApi = {
  getAll: (params?: Record<string, string>) => apiClient.get<PaginatedResponse<Tenant> | Tenant[]>("/tenants", params),

  getById: (id: string) => apiClient.get<Tenant>(`/tenants/${id}`),

  create: (data: CreateTenantRequest) => apiClient.post<Tenant>("/tenants", data),

  update: (id: string, data: UpdateTenantRequest) => apiClient.put<Tenant>(`/tenants/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/tenants/${id}`),
}
