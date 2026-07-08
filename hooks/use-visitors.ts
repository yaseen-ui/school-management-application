"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { visitorsApi } from "@/lib/api/visitors"
import { toast } from "sonner"

export function useVisitorPurposes() {
  return useQuery({
    queryKey: ["visitor-purposes"],
    queryFn: async () => {
      const r = await visitorsApi.getPurposes()
      return r.data
    },
  })
}

export function useVisitors(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["visitors", filters],
    queryFn: async () => {
      const r = await visitorsApi.getAll(filters)
      return r.data
    },
  })
}

export function useActiveVisitors() {
  return useQuery({
    queryKey: ["visitors", "active"],
    queryFn: async () => {
      const r = await visitorsApi.getActive()
      return r.data
    },
    refetchInterval: 15000, // auto-refresh every 15s for active visitors
  })
}

export function useCreateVisitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: visitorsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitors"] })
      toast.success("Visitor registered successfully")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useCheckIn() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: visitorsApi.checkIn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitors"] })
      toast.success("Visitor checked in")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useCheckOut() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: visitorsApi.checkOut,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitors"] })
      toast.success("Visitor checked out")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useApproveVisitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: visitorsApi.approve,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitors"] })
      toast.success("Visitor approved")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useRejectVisitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => visitorsApi.reject(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitors"] })
      toast.success("Visitor rejected")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useCancelVisitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: visitorsApi.cancel,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitors"] })
      toast.success("Visit cancelled")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}