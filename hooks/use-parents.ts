"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { parentsApi } from "@/lib/api/parents"
import type { RegisterParentRequest } from "@/lib/api/parents"

export function useParents() {
  return useQuery({
    queryKey: ["parents"],
    queryFn: async () => {
      const response = await parentsApi.getAll()
      return response.data ?? []
    },
  })
}

export function useParent(id: string) {
  return useQuery({
    queryKey: ["parents", id],
    queryFn: async () => {
      const response = await parentsApi.getById(id)
      return response.data ?? null
    },
    enabled: !!id,
  })
}

export function useSendInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (parentId: string) => parentsApi.sendInvite(parentId),
    onSuccess: (response, parentId) => {
      toast.success("Invite sent successfully", {
        description: `An invitation link has been generated for ${response.data?.parentName ?? "the parent"}.`,
      })
      queryClient.invalidateQueries({ queryKey: ["parents"] })
    },
    onError: (error: Error) => {
      toast.error("Failed to send invite", {
        description: error.message,
      })
    },
  })
}

export function useValidateInviteToken(token: string) {
  return useQuery({
    queryKey: ["invite-token", token],
    queryFn: async () => {
      const response = await parentsApi.validateToken(token)
      return response.data ?? null
    },
    enabled: !!token,
    retry: false,
  })
}

export function useRegisterParent() {
  return useMutation({
    mutationFn: (data: RegisterParentRequest) => parentsApi.register(data),
    onSuccess: (response) => {
      toast.success(response?.message || "Registration successful", {
        description: "You can now sign in with your email and password.",
      })
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message,
      })
    },
  })
}