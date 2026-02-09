import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, DomainResolveResponse } from "@/lib/api/types"
import { apiClient } from "@/lib/api/client"

interface AuthState {
  user: User | null
  token: string | null
  tenantId: string | null
  tenantInfo: DomainResolveResponse | null // Store full tenant info
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  setTenantInfo: (tenantInfo: DomainResolveResponse) => void // Updated method
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenantId: null,
      tenantInfo: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, token) => {
        apiClient.setToken(token)
        set({ user, token, isAuthenticated: true, isLoading: false })
      },

      setTenantInfo: (tenantInfo) => {
        apiClient.setTenantId(tenantInfo.id)
        set({ tenantId: tenantInfo.id, tenantInfo })
      },

      logout: () => {
        apiClient.setToken(null)
        apiClient.setTenantId(null)
        set({
          user: null,
          token: null,
          tenantId: null,
          tenantInfo: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false)
          if (state.token) {
            apiClient.setToken(state.token)
          }
          if (state.tenantId) {
            apiClient.setTenantId(state.tenantId)
          }
        }
      },
    },
  ),
)
