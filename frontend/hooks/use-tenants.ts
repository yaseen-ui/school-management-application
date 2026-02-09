"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { tenantsApi } from "@/lib/api/tenants"
import type { CreateTenantRequest, UpdateTenantRequest, ApiResponse, TenantListData } from "@/lib/api/types"

export function useTenants() {
  return useQuery<ApiResponse<TenantListData>>({
    queryKey: ["tenants"],
    queryFn: () => tenantsApi.getAll(),
  })
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: ["tenants", id],
    queryFn: () => tenantsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] })
      toast.success("Tenant created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create tenant", {
        description: error.message,
      })
    },
  })
}

export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantRequest }) => tenantsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] })
      toast.success("Tenant updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update tenant", {
        description: error.message,
      })
    },
  })
}

export function useDeleteTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tenantsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] })
      toast.success("Tenant deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to delete tenant", {
        description: error.message,
      })
    },
  })
}
