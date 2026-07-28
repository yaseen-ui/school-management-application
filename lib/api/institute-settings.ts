import { apiClient } from "./client"
import type { ApiResponse, Tenant, UpdateTenantRequest } from "./types"

export type InstituteSettingsUpdate = Pick<
  UpdateTenantRequest,
  "schoolName" | "caption" | "logo" | "contactAddress" | "contactPhone" | "contactEmail"
>

export const instituteSettingsApi = {
  get: async (): Promise<Tenant> => {
    const response = await apiClient.get<ApiResponse<Tenant>>("/settings/institute")
    return response.data
  },

  update: async (data: InstituteSettingsUpdate): Promise<Tenant> => {
    const response = await apiClient.put<ApiResponse<Tenant>>("/settings/institute", data)
    return response.data
  },
}
