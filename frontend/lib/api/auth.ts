import { apiClient } from "./client"
import type { LoginRequest, LoginResponse, DomainResolveRequest, DomainResolveResponse } from "./types"

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<LoginResponse>("/auth/login", data),

  resolveDomain: (data: DomainResolveRequest) => apiClient.post<{data: DomainResolveResponse}>("/public/domain", data),

  logout: () => {
    apiClient.setToken(null)
    apiClient.setTenantId(null)
  },
}
