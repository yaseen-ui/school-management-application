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
    (set, get) => ({
      user: null,
      token: null,
      tenantId: null,
      tenantInfo: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, token) => {
        apiClient.setToken(token)
        // Company users never carry a school tenantId in the client (#13)
        if ((user as { userType?: string } | null)?.userType === "company") {
          apiClient.setTenantId(null)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            tenantId: null,
            tenantInfo: null,
          })
          return
        }
        set({ user, token, isAuthenticated: true, isLoading: false })
      },

      setTenantInfo: (tenantInfo) => {
        // Domain resolve is tenant-host only; still guard against company sessions
        const currentUser = get().user as { userType?: string } | null
        if (currentUser?.userType === "company") {
          apiClient.setTenantId(null)
          set({ tenantId: null, tenantInfo: null })
          return
        }
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
          // Company sessions must not restore a school tenantId (#13)
          const isCompany =
            (state.user as { userType?: string } | null)?.userType === "company"
          if (isCompany) {
            state.tenantId = null
            state.tenantInfo = null
            apiClient.setTenantId(null)
          } else if (state.tenantId) {
            apiClient.setTenantId(state.tenantId)
          }
        }
      },
    },
  ),
)
