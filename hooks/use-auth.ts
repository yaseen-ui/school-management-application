"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth-store"
import { authApi } from "@/lib/api/auth"
import { config } from "@/lib/config"
import { hasRole } from "@/hooks/use-nav-groups"
import type { LoginRequest } from "@/lib/api/types"

export function useLogin() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.data?.user, response.data?.token)
      toast.success("Login successful", {
        description: `Welcome back, ${response.data?.user.fullName || "User"}!`,
      })

      // Redirect based on host type and user role
      if (config.isCompanyHost) {
        router.push("/tenants")
      } else if (hasRole(response.data?.user as any, "Parent")) {
        router.push("/parent-portal")
      } else {
        router.push("/dashboard")
      }
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message || "Invalid credentials",
      })
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const { logout } = useAuthStore()

  return () => {
    logout()
    authApi.logout()
    toast.success("Logged out successfully")

    if (config.isCompanyHost) {
      router.push("/login")
    } else {
      router.push("/home")
    }
  }
}

export function useDomainResolver() {
  const { setTenantInfo } = useAuthStore()

  return useQuery({
    queryKey: ["domain-resolve"],
    queryFn: async () => {
      if (config.isCompanyHost || typeof window === "undefined") {
        return null
      }

      const domain = window.location.origin
      const response = await authApi.resolveDomain({ domain })

      setTenantInfo(response.data)
      return response.data
    },
    enabled: config.isTenantHost,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  })
}

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, tenantId, tenantInfo } = useAuthStore()
  const logout = useLogout()

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    tenantId,
    tenantInfo,
    logout,
  }
}
