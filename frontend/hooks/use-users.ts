"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/lib/api/users"
import { toast } from "@/components/ui/sonner"
import type { CreateUserRequest, UpdatePasswordRequest } from "@/lib/api/types"

export function useUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await usersApi.getAll(params)
      return response.data
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await usersApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create user", {
        description: error.message,
      })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserRequest> }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update user", {
        description: error.message,
      })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to delete user", {
        description: error.message,
      })
    },
  })
}

// Company users hooks
export function useCompanyUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["company-users", params],
    queryFn: async () => {
      const response = await usersApi.getAllCompany(params)
      return response.data
    },
  })
}

export function useCreateCompanyUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof usersApi.createCompany>[0]) => usersApi.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] })
      toast.success("Company user created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create company user", {
        description: error.message,
      })
    },
  })
}

// Password update hook
export function useUpdatePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePasswordRequest }) => usersApi.updatePassword(id, data),
    onSuccess: () => {
      toast.success("Password updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update password", {
        description: error.message,
      })
    },
  })
}
