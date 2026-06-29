"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  storeCategoriesApi,
  storeProductsApi,
  storeKitsApi,
  storeOrdersApi,
  storePendingItemsApi,
  storeStudentPurchasesApi,
  storeDuesApi,
  storeReturnsApi,
  type StoreCategory,
  type StoreProduct,
  type StoreKit,
  type StoreOrder,
  type StorePendingItem,
  type StoreDue,
  type StoreReturn,
  type CreateStoreCategoryRequest,
  type UpdateStoreCategoryRequest,
  type CreateStoreProductRequest,
  type UpdateStoreProductRequest,
  type CreateKitRequest,
  type UpdateKitRequest,
  type AddKitItemRequest,
  type UpdateKitItemRequest,
  type CreateOrderRequest,
  type UpdateOrderStatusRequest,
  type CreateDuePaymentRequest,
  type CreateReturnRequest,
} from "@/lib/api/store"
import { toast } from "@/components/ui/sonner"

// ─── Categories ───────────────────────────────────────────────────────────────

export function useStoreCategories(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["store-categories", params],
    queryFn: async () => {
      const response = await storeCategoriesApi.list(params)
      return response.data.rows || []
    },
  })
}

export function useStoreCategory(id: string) {
  return useQuery({
    queryKey: ["store-category", id],
    queryFn: async () => {
      const response = await storeCategoriesApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateStoreCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStoreCategoryRequest) => storeCategoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-categories"] })
      toast.success("Category created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category")
    },
  })
}

export function useUpdateStoreCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreCategoryRequest }) =>
      storeCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-categories"] })
      toast.success("Category updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category")
    },
  })
}

export function useDeleteStoreCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storeCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-categories"] })
      toast.success("Category deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category")
    },
  })
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useStoreProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["store-products", params],
    queryFn: async () => {
      const response = await storeProductsApi.list(params)
      return response.data.rows || []
    },
  })
}

export function useStoreProduct(id: string) {
  return useQuery({
    queryKey: ["store-product", id],
    queryFn: async () => {
      const response = await storeProductsApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateStoreProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStoreProductRequest) => storeProductsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-products"] })
      toast.success("Product created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product")
    },
  })
}

export function useUpdateStoreProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreProductRequest }) =>
      storeProductsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-products"] })
      toast.success("Product updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product")
    },
  })
}

export function useDeleteStoreProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storeProductsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-products"] })
      toast.success("Product deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product")
    },
  })
}

// ─── Kits ─────────────────────────────────────────────────────────────────────

export function useStoreKits(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["store-kits", params],
    queryFn: async () => {
      const response = await storeKitsApi.list(params)
      return response.data.rows || []
    },
  })
}

export function useStoreKit(id: string) {
  return useQuery({
    queryKey: ["store-kit", id],
    queryFn: async () => {
      const response = await storeKitsApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateStoreKit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateKitRequest) => storeKitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-kits"] })
      toast.success("Kit created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create kit")
    },
  })
}

export function useUpdateStoreKit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKitRequest }) =>
      storeKitsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-kits"] })
      toast.success("Kit updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update kit")
    },
  })
}

export function useDeleteStoreKit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storeKitsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-kits"] })
      toast.success("Kit deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete kit")
    },
  })
}

export function useAddStoreKitItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ kitId, data }: { kitId: string; data: AddKitItemRequest }) =>
      storeKitsApi.addItem(kitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-kit"] })
      toast.success("Item added to kit successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add item to kit")
    },
  })
}

export function useUpdateStoreKitItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ kitId, itemId, data }: { kitId: string; itemId: string; data: UpdateKitItemRequest }) =>
      storeKitsApi.updateItem(kitId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-kit"] })
      toast.success("Kit item updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update kit item")
    },
  })
}

export function useDeleteStoreKitItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ kitId, itemId }: { kitId: string; itemId: string }) =>
      storeKitsApi.deleteItem(kitId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-kit"] })
      toast.success("Kit item removed successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove kit item")
    },
  })
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function useStoreOrders(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["store-orders", params],
    queryFn: async () => {
      const response = await storeOrdersApi.list(params)
      return response.data.rows || []
    },
  })
}

export function useStoreOrder(id: string) {
  return useQuery({
    queryKey: ["store-order", id],
    queryFn: async () => {
      const response = await storeOrdersApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateStoreOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => storeOrdersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-orders"] })
      queryClient.invalidateQueries({ queryKey: ["store-pending-items"] })
      toast.success("Order created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create order")
    },
  })
}

export function useUpdateStoreOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      storeOrdersApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-orders"] })
      queryClient.invalidateQueries({ queryKey: ["store-pending-items"] })
      toast.success("Order status updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status")
    },
  })
}

// ─── Pending Items ────────────────────────────────────────────────────────────

export function useStorePendingItems(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["store-pending-items", params],
    queryFn: async () => {
      const response = await storePendingItemsApi.list(params)
      return response.data.rows || []
    },
  })
}

export function useCollectStorePendingItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storePendingItemsApi.collect(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-pending-items"] })
      queryClient.invalidateQueries({ queryKey: ["store-orders"] })
      toast.success("Item collected successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to collect item")
    },
  })
}

// ─── Student Purchases ────────────────────────────────────────────────────────

export function useStudentStorePurchases(enrollmentId: string, params?: Record<string, string>) {
  return useQuery({
    queryKey: ["store-student-purchases", enrollmentId, params],
    queryFn: async () => {
      const response = await storeStudentPurchasesApi.list(enrollmentId, params)
      return response.data.rows || []
    },
    enabled: !!enrollmentId,
  })
}

// ─── Dues ─────────────────────────────────────────────────────────────────────

export function useStoreDues(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["store-dues", params],
    queryFn: async () => {
      const response = await storeDuesApi.list(params)
      return response.data.rows || []
    },
  })
}

export function useStoreDue(id: string) {
  return useQuery({
    queryKey: ["store-due", id],
    queryFn: async () => {
      const response = await storeDuesApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateDuePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dueId, data }: { dueId: string; data: CreateDuePaymentRequest }) =>
      storeDuesApi.createPayment(dueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-dues"] })
      queryClient.invalidateQueries({ queryKey: ["store-due"] })
      toast.success("Payment recorded successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record payment")
    },
  })
}

// ─── Returns ──────────────────────────────────────────────────────────────────

export function useStoreReturns(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["store-returns", params],
    queryFn: async () => {
      const response = await storeReturnsApi.list(params)
      return response.data.rows || []
    },
  })
}

export function useCreateStoreReturn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReturnRequest) => storeReturnsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-returns"] })
      queryClient.invalidateQueries({ queryKey: ["store-orders"] })
      toast.success("Return processed successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process return")
    },
  })
}
