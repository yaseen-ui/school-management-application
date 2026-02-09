"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { rolesApi, type CreateRoleRequest, type UpdateRoleRequest } from "@/lib/api/roles"
import { toast } from "@/components/ui/sonner"

export function useRoles(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: async () => {
      const response = await rolesApi.getAll(params)
      return response.data
    },
  })
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: async () => {
      const response = await rolesApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Role created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create role", {
        description: error.message,
      })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) => rolesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Role updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update role", {
        description: error.message,
      })
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Role deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to delete role", {
        description: error.message,
      })
    },
  })
}
