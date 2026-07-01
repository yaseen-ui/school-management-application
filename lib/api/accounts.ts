import { apiClient } from "./client"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AccountCategory {
  id: string
  tenantId: string
  name: string
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    transactions: number
  }
}

export interface CreateAccountCategoryRequest {
  name: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export interface UpdateAccountCategoryRequest extends Partial<CreateAccountCategoryRequest> {}

export interface AccountTransaction {
  id: string
  tenantId: string
  categoryId: string
  type: "debit" | "credit"
  amount: number
  description: string | null
  transactionDate: string
  referenceType: string | null
  referenceId: string | null
  isVoided: boolean
  voidReason: string | null
  voidedAt: string | null
  voidedById: string | null
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
  }
}

export interface CreateAccountTransactionRequest {
  categoryId: string
  type: "debit" | "credit"
  amount: number
  description?: string
  transactionDate?: string
  referenceType?: string
  referenceId?: string
}

export interface UpdateAccountTransactionRequest {
  categoryId?: string
  type?: "debit" | "credit"
  amount?: number
  description?: string
  transactionDate?: string
}

export interface VoidTransactionRequest {
  voidReason?: string
  voidedById?: string
}

export interface LedgerCategorySummary {
  categoryId: string
  categoryName: string
  debit: number
  credit: number
  balance: number
}

export interface LedgerSummary {
  totalDebit: number
  totalCredit: number
  balance: number
  categories: LedgerCategorySummary[]
}

// ─── Categories API ───────────────────────────────────────────────────────────

export const accountCategoriesApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: AccountCategory[] }; message: string }>(
      "/accounts/categories",
      params,
    ),

  getById: (id: string) =>
    apiClient.get<{ status: string; data: AccountCategory; message: string }>(`/accounts/categories/${id}`),

  create: (data: CreateAccountCategoryRequest) =>
    apiClient.post<{ status: string; data: AccountCategory; message: string }>("/accounts/categories", data),

  update: (id: string, data: UpdateAccountCategoryRequest) =>
    apiClient.put<{ status: string; data: AccountCategory; message: string }>(`/accounts/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ status: string; data: null; message: string }>(`/accounts/categories/${id}`),
}

// ─── Transactions API ─────────────────────────────────────────────────────────

export const accountTransactionsApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: { columns: any[]; rows: AccountTransaction[] }; message: string }>(
      "/accounts/transactions",
      params,
    ),

  getById: (id: string) =>
    apiClient.get<{ status: string; data: AccountTransaction; message: string }>(`/accounts/transactions/${id}`),

  create: (data: CreateAccountTransactionRequest) =>
    apiClient.post<{ status: string; data: AccountTransaction; message: string }>("/accounts/transactions", data),

  update: (id: string, data: UpdateAccountTransactionRequest) =>
    apiClient.put<{ status: string; data: AccountTransaction; message: string }>(`/accounts/transactions/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ status: string; data: null; message: string }>(`/accounts/transactions/${id}`),

  void: (id: string, data: VoidTransactionRequest) =>
    apiClient.put<{ status: string; data: AccountTransaction; message: string }>(`/accounts/transactions/${id}/void`, data),
}

// ─── Ledger Summary API ───────────────────────────────────────────────────────

export const accountSummaryApi = {
  get: (params?: Record<string, string>) =>
    apiClient.get<{ status: string; data: LedgerSummary; message: string }>("/accounts/summary", params),
}
