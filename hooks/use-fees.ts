import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { feesApi } from "@/lib/api/fees"
import { toast } from "@/components/ui/sonner"
import type {
  CreateFeeHeadRequest,
  CreateSectionFeeRequest,
  CreateFeeTermRequest,
  CreateStudentFeeRequest,
  CreatePaymentRequest,
  CreateRefundRequest,
} from "@/lib/api/fees"

// ─── Fee Heads ───────────────────────────────────────────────────────────────

export function useFeeHeads(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["fee-heads", filters],
    queryFn: async () => {
      const response = await feesApi.getFeeHeads(filters)
      return response.data.rows
    },
  })
}

export function useFeeHead(id: string | null) {
  return useQuery({
    queryKey: ["fee-heads", id],
    queryFn: () => feesApi.getFeeHead(id!),
    enabled: !!id,
  })
}

export function useCreateFeeHead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFeeHeadRequest) => feesApi.createFeeHead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-heads"] })
      toast.success("Fee head created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create fee head")
    },
  })
}

export function useUpdateFeeHead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFeeHeadRequest> }) => feesApi.updateFeeHead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-heads"] })
      toast.success("Fee head updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update fee head")
    },
  })
}

export function useDeleteFeeHead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => feesApi.deleteFeeHead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-heads"] })
      toast.success("Fee head deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete fee head")
    },
  })
}

// ─── Section Fees ────────────────────────────────────────────────────────────

export function useSectionFees(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["section-fees", filters],
    queryFn: async () => {
      const response = await feesApi.getSectionFees(filters)
      return response.data.rows
    },
  })
}

export function useSectionFee(id: string | null) {
  return useQuery({
    queryKey: ["section-fees", id],
    queryFn: () => feesApi.getSectionFee(id!),
    enabled: !!id,
  })
}

export function useCreateSectionFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSectionFeeRequest) => feesApi.createSectionFee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section-fees"] })
      toast.success("Section fee created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create section fee")
    },
  })
}

export function useUpdateSectionFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSectionFeeRequest> }) => feesApi.updateSectionFee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section-fees"] })
      toast.success("Section fee updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update section fee")
    },
  })
}

export function useDeleteSectionFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => feesApi.deleteSectionFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section-fees"] })
      toast.success("Section fee deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete section fee")
    },
  })
}

// ─── Fee Terms ───────────────────────────────────────────────────────────────

export function useFeeTerms(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["fee-terms", filters],
    queryFn: async () => {
      const response = await feesApi.getFeeTerms(filters)
      return response.data.rows
    },
  })
}

export function useFeeTerm(id: string | null) {
  return useQuery({
    queryKey: ["fee-terms", id],
    queryFn: () => feesApi.getFeeTerm(id!),
    enabled: !!id,
  })
}

export function useCreateFeeTerm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFeeTermRequest) => feesApi.createFeeTerm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-terms"] })
      toast.success("Fee term created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create fee term")
    },
  })
}

export function useUpdateFeeTerm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFeeTermRequest> }) => feesApi.updateFeeTerm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-terms"] })
      toast.success("Fee term updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update fee term")
    },
  })
}

export function useDeleteFeeTerm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => feesApi.deleteFeeTerm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-terms"] })
      toast.success("Fee term deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete fee term")
    },
  })
}

// ─── Student Fees ────────────────────────────────────────────────────────────

export function useStudentFees(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["student-fees", filters],
    queryFn: async () => {
      const response = await feesApi.getStudentFees(filters)
      return response.data.rows
    },
  })
}

export function useStudentFee(id: string | null) {
  return useQuery({
    queryKey: ["student-fees", id],
    queryFn: () => feesApi.getStudentFee(id!),
    enabled: !!id,
  })
}

export function useCreateStudentFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateStudentFeeRequest) => feesApi.createStudentFee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-fees"] })
      toast.success("Student fee created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create student fee")
    },
  })
}

export function useUpdateStudentFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStudentFeeRequest> }) => feesApi.updateStudentFee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-fees"] })
      toast.success("Student fee updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update student fee")
    },
  })
}

export function useDeleteStudentFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => feesApi.deleteStudentFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-fees"] })
      toast.success("Student fee deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete student fee")
    },
  })
}

// ─── Payments ────────────────────────────────────────────────────────────────

export function usePayments(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["fee-payments", filters],
    queryFn: async () => {
      const response = await feesApi.getPayments(filters)
      return response.data.rows
    },
  })
}

export function usePayment(id: string | null) {
  return useQuery({
    queryKey: ["fee-payments", id],
    queryFn: () => feesApi.getPayment(id!),
    enabled: !!id,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => feesApi.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-payments"] })
      queryClient.invalidateQueries({ queryKey: ["student-fees"] })
      queryClient.invalidateQueries({ queryKey: ["fee-summary"] })
      toast.success("Payment recorded successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to record payment")
    },
  })
}

export function useUpdatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePaymentRequest> }) => feesApi.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-payments"] })
      toast.success("Payment updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update payment")
    },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => feesApi.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-payments"] })
      queryClient.invalidateQueries({ queryKey: ["fee-summary"] })
      toast.success("Payment deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete payment")
    },
  })
}

// ─── Refunds ─────────────────────────────────────────────────────────────────

export function useRefunds(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["fee-refunds", filters],
    queryFn: async () => {
      const response = await feesApi.getRefunds(filters)
      return response.data.rows
    },
  })
}

export function useCreateRefund() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRefundRequest) => feesApi.createRefund(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-refunds"] })
      queryClient.invalidateQueries({ queryKey: ["fee-payments"] })
      queryClient.invalidateQueries({ queryKey: ["fee-summary"] })
      toast.success("Refund processed successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process refund")
    },
  })
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export function useFeeSummary(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["fee-summary", filters],
    queryFn: async () => {
      const response = await feesApi.getFeeSummary(filters)
      return response.data
    },
  })
}
