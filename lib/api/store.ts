import { apiClient } from "./client"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoreCategory {
  id: string
  tenantId: string
  name: string
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    products: number
  }
}

export interface CreateStoreCategoryRequest {
  name: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export interface UpdateStoreCategoryRequest extends Partial<CreateStoreCategoryRequest> {}

export interface StoreProductSectionAssignment {
  id: string
  sectionId: string
  section?: {
    id: string
    sectionName: string
  }
}

export interface StoreProduct {
  id: string
  tenantId: string
  categoryId: string
  name: string
  description: string | null
  basePrice: number
  isGeneral: boolean
  stockQuantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
  }
  sectionAssignments?: StoreProductSectionAssignment[]
}

export interface CreateStoreProductRequest {
  categoryId: string
  name: string
  description?: string
  basePrice: number
  isGeneral?: boolean
  stockQuantity?: number
  isActive?: boolean
  sectionIds?: string[]
}

export interface UpdateStoreProductRequest extends Partial<CreateStoreProductRequest> {}

// ─── Kits ────────────────────────────────────────────────────────────────────

export interface StoreKitSectionAssignment {
  id: string
  sectionId: string
  section?: {
    id: string
    sectionName: string
  }
}

export interface StoreKit {
  id: string
  tenantId: string
  name: string
  description: string | null
  totalPrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  items?: StoreKitItem[]
  sections?: StoreKitSectionAssignment[]
}

export interface StoreKitItem {
  id: string
  kitId: string
  productId: string | null
  productName: string
  categoryName: string
  unitPrice: number
  quantity: number
  totalPrice: number
}

export interface CreateKitRequest {
  name: string
  description?: string
  items: { productId?: string; productName?: string; unitPrice?: number; quantity: number }[]
  sectionIds?: string[]
}

export interface UpdateKitRequest {
  name?: string
  description?: string
  isActive?: boolean
  items?: { productId?: string; productName?: string; unitPrice?: number; quantity: number }[]
  sectionIds?: string[]
}

export interface AddKitItemRequest {
  productId?: string
  productName: string
  unitPrice: number
  quantity: number
}

export interface UpdateKitItemRequest {
  productName?: string
  unitPrice?: number
  quantity?: number
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface StoreOrderPendingItem {
  id: string
  productName: string
  quantity: number
  status: "pending" | "collected"
  collectedAt: string | null
  isPaid: boolean
  paidAt: string | null
}

export interface StoreOrderItem {
  id: string
  orderId: string
  productId: string | null
  kitId: string | null
  kitReferenceId: string | null
  productName: string
  unitPrice: number
  quantity: number
  totalPrice: number
  isReturned: boolean
  returnedAt: string | null
  pendingItems?: StoreOrderPendingItem[]
}

export interface StoreOrderDue {
  id: string
  totalDueAmount: number
  paidAmount: number
  status: "pending" | "partially_paid" | "settled"
}

export interface StoreOrder {
  id: string
  tenantId: string
  enrollmentId: string | null
  academicYearId: string | null
  orderDate: string
  totalAmount: number
  actualTotalAmount: number
  discountAmount: number
  offeredAmount: number | null
  customerName: string | null
  customerPhone: string | null
  customerType: "student" | "external"
  status: string
  remarks: string | null
  paymentMethod: string | null
  transactionId: string | null
  paymentMode: string | null
  createdAt: string
  updatedAt: string
  enrollment?: {
    id: string
    rollNumber: string
    student: { id: string; firstName: string; lastName: string }
    section: { id: string; sectionName: string }
  }
  academicYear?: { id: string; name: string }
  createdBy?: { id: string; fullName: string }
  items?: StoreOrderItem[]
  dues?: StoreOrderDue[]
}

export interface CreateOrderItemRequest {
  productId?: string
  kitId?: string
  productName: string
  unitPrice: number
  quantity: number
}

export interface CreateOrderRequest {
  enrollmentId?: string
  academicYearId?: string
  items: CreateOrderItemRequest[]
  discountAmount?: number
  offeredAmount?: number
  amountPaid?: number
  customerName?: string
  customerPhone?: string
  customerType?: "student" | "external"
  paymentMethod?: string
  transactionId?: string
  paymentMode?: string
  remarks?: string
  createdById?: string
}

export interface UpdateOrderStatusRequest {
  status: string
  remarks?: string
}

// ─── Pending Items ───────────────────────────────────────────────────────────

export interface StorePendingItem {
  id: string
  tenantId: string
  orderItemId: string
  productId: string | null
  productName: string
  quantity: number
  status: "pending" | "collected"
  collectedAt: string | null
  isPaid: boolean
  paidAt: string | null
  createdAt: string
  updatedAt: string
  orderItem?: {
    id: string
    productName: string
    order?: {
      id: string
      orderDate: string
      enrollment?: {
        id: string
        student?: { id: string; firstName: string; lastName: string }
      }
    }
  }
}

// ─── Dues ────────────────────────────────────────────────────────────────────

export interface StoreDuePayment {
  id: string
  amount: number
  paymentDate: string
  paymentMethod: string | null
  transactionId: string | null
}

export interface StoreDue {
  id: string
  tenantId: string
  orderId: string
  enrollmentId: string | null
  customerName: string
  customerPhone: string | null
  customerType: string
  totalDueAmount: number
  paidAmount: number
  status: "pending" | "partially_paid" | "settled"
  remarks: string | null
  createdAt: string
  updatedAt: string
  order?: {
    id: string
    orderDate: string
    totalAmount: number
  }
  payments?: StoreDuePayment[]
}

export interface CreateDuePaymentRequest {
  amount: number
  paymentDate?: string
  paymentMethod?: string
  transactionId?: string
  remarks?: string
}

// ─── Returns ─────────────────────────────────────────────────────────────────

export interface StoreReturn {
  id: string
  tenantId: string
  orderItemId: string
  productId: string | null
  productName: string
  quantity: number
  refundAmount: number
  reason: string | null
  returnedAt: string
  createdAt: string
  orderItem?: {
    id: string
    productName: string
  }
}

export interface CreateReturnRequest {
  orderItemId: string
  quantity?: number
  refundAmount?: number
  reason?: string
}

// ─── Categories API ───────────────────────────────────────────────────────────

export const storeCategoriesApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: StoreCategory[] }; message: string }>(
      "/store/categories",
      params,
    ),

  getById: (id: string) =>
    apiClient.get<{ status: string; data: StoreCategory; message: string }>(`/store/categories/${id}`),

  create: (data: CreateStoreCategoryRequest) =>
    apiClient.post<{ status: string; data: StoreCategory; message: string }>("/store/categories", data),

  update: (id: string, data: UpdateStoreCategoryRequest) =>
    apiClient.put<{ status: string; data: StoreCategory; message: string }>(`/store/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ status: string; data: null; message: string }>(`/store/categories/${id}`),
}

// ─── Products API ─────────────────────────────────────────────────────────────

export const storeProductsApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: StoreProduct[] }; message: string }>(
      "/store/products",
      params,
    ),

  getById: (id: string) =>
    apiClient.get<{ status: string; data: StoreProduct; message: string }>(`/store/products/${id}`),

  create: (data: CreateStoreProductRequest) =>
    apiClient.post<{ status: string; data: StoreProduct; message: string }>("/store/products", data),

  update: (id: string, data: UpdateStoreProductRequest) =>
    apiClient.put<{ status: string; data: StoreProduct; message: string }>(`/store/products/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ status: string; data: null; message: string }>(`/store/products/${id}`),
}

// ─── Kits API ─────────────────────────────────────────────────────────────────

export const storeKitsApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: StoreKit[] }; message: string }>(
      "/store/kits",
      params,
    ),

  getById: (id: string) =>
    apiClient.get<{ status: string; data: StoreKit; message: string }>(`/store/kits/${id}`),

  create: (data: CreateKitRequest) =>
    apiClient.post<{ status: string; data: StoreKit; message: string }>("/store/kits", data),

  update: (id: string, data: UpdateKitRequest) =>
    apiClient.put<{ status: string; data: StoreKit; message: string }>(`/store/kits/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ status: string; data: null; message: string }>(`/store/kits/${id}`),

  addItem: (kitId: string, data: AddKitItemRequest) =>
    apiClient.post<{ status: string; data: StoreKitItem; message: string }>(`/store/kits/${kitId}/items`, data),

  updateItem: (kitId: string, itemId: string, data: UpdateKitItemRequest) =>
    apiClient.put<{ status: string; data: StoreKitItem; message: string }>(`/store/kits/${kitId}/items/${itemId}`, data),

  deleteItem: (kitId: string, itemId: string) =>
    apiClient.delete<{ status: string; data: null; message: string }>(`/store/kits/${kitId}/items/${itemId}`),
}

// ─── Stock Check API ──────────────────────────────────────────────────────────

export interface StockCheckResult {
  allAvailable: boolean
  availableItems: {
    productId: string | null
    productName: string
    requiredQuantity: number
    availableStock: number
    kitId?: string
    kitName?: string
  }[]
  unavailableItems: {
    productId: string | null
    productName: string
    requiredQuantity: number
    availableStock: number
    kitId?: string
    kitName?: string
  }[]
}

export const storeCheckStockApi = {
  check: (data: { items: CreateOrderItemRequest[] }) =>
    apiClient.post<{ status: string; data: StockCheckResult; message: string }>("/store/check-stock", data),
}

// ─── Orders API ───────────────────────────────────────────────────────────────

export const storeOrdersApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: StoreOrder[] }; message: string }>(
      "/store/orders",
      params,
    ),

  getById: (id: string) =>
    apiClient.get<{ status: string; data: StoreOrder; message: string }>(`/store/orders/${id}`),

  create: (data: CreateOrderRequest) =>
    apiClient.post<{ status: string; data: StoreOrder; message: string }>("/store/orders", data),

  updateStatus: (id: string, data: UpdateOrderStatusRequest) =>
    apiClient.put<{ status: string; data: StoreOrder; message: string }>(`/store/orders/${id}/status`, data),
}

// ─── Pending Items API ────────────────────────────────────────────────────────

export const storePendingItemsApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: StorePendingItem[] }; message: string }>(
      "/store/pending-items",
      params,
    ),

  collect: (id: string) =>
    apiClient.put<{ status: string; data: StorePendingItem; message: string }>(`/store/pending-items/${id}/collect`),
}

// ─── Dues API ─────────────────────────────────────────────────────────────────

export const storeDuesApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: StoreDue[] }; message: string }>(
      "/store/dues",
      params,
    ),

  getById: (id: string) =>
    apiClient.get<{ status: string; data: StoreDue; message: string }>(`/store/dues/${id}`),

  createPayment: (dueId: string, data: CreateDuePaymentRequest) =>
    apiClient.post<{ status: string; data: StoreDuePayment; message: string }>(`/store/dues/${dueId}/payments`, data),
}

// ─── Returns API ──────────────────────────────────────────────────────────────

export const storeReturnsApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: StoreReturn[] }; message: string }>(
      "/store/returns",
      params,
    ),

  create: (data: CreateReturnRequest) =>
    apiClient.post<{ status: string; data: StoreReturn; message: string }>("/store/returns", data),
}

// ─── Student Purchases API ────────────────────────────────────────────────────

export const storeStudentPurchasesApi = {
  list: (enrollmentId: string, params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: StoreOrder[] }; message: string }>(
      `/store/students/${enrollmentId}/purchases`,
      params,
    ),
}
