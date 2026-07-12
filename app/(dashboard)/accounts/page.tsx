"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Plus, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw, Loader2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { accountCategoriesApi, accountTransactionsApi, accountSummaryApi } from "@/lib/api/accounts"
import type { AccountCategory, AccountTransaction, LedgerSummary } from "@/lib/api/accounts"
import { teachersApi } from "@/lib/api/teachers"
import { studentsApi } from "@/lib/api/students"
import { parentsApi } from "@/lib/api/parents"
import type { Teacher } from "@/lib/api/teachers"
import type { Student } from "@/lib/api/students"
import type { Parent } from "@/lib/api/parents"
import { toast } from "sonner"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// ─── Category Dialogs ─────────────────────────────────────────────────────────

function CreateCategoryDialog({ open, onClose, onSuccess }: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", sortOrder: 0 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await accountCategoriesApi.create(form)
      toast.success("Category created successfully")
      onSuccess()
      onClose()
      setForm({ name: "", description: "", sortOrder: 0 })
    } catch (err: any) {
      toast.error(err?.message || "Failed to create category")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Create Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. For Inventory"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditCategoryDialog({ open, onClose, onSuccess, category }: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  category: AccountCategory | null
}) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", sortOrder: 0, isActive: true })

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description || "",
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return
    setLoading(true)
    try {
      await accountCategoriesApi.update(category.id, form)
      toast.success("Category updated successfully")
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err?.message || "Failed to update category")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !category) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm">Active</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteCategoryDialog({ open, onClose, onSuccess, category }: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  category: AccountCategory | null
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!category) return
    setLoading(true)
    try {
      await accountCategoriesApi.delete(category.id)
      toast.success("Category deleted successfully")
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete category")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !category) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2">Delete Category</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete <strong>{category.name}</strong>?
          {category._count && category._count.transactions > 0 && (
            <span className="block mt-1 text-destructive">
              This category has {category._count.transactions} transaction(s). It cannot be deleted until they are removed.
            </span>
          )}
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || (category._count?.transactions ?? 0) > 0}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Transaction Dialog ───────────────────────────────────────────────────────

function CreateTransactionDialog({ open, onClose, onSuccess, categories }: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  categories: AccountCategory[]
}) {
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [loadingParty, setLoadingParty] = useState(false)
  const [form, setForm] = useState({
    categoryId: "",
    type: "debit" as "debit" | "credit",
    amount: "",
    description: "",
    transactionDate: format(new Date(), "yyyy-MM-dd"),
    partyType: "",
    partyName: "",
    partyId: "",
  })

  // Fetch teachers or students when party type changes
  useEffect(() => {
    if (form.partyType === "teacher") {
      setLoadingParty(true)
      teachersApi.getAll().then((res) => {
        const data = res.data as any
        setTeachers(data?.rows || [])
      }).catch(() => {
        toast.error("Failed to load teachers")
      }).finally(() => {
        setLoadingParty(false)
      })
    } else if (form.partyType === "student") {
      setLoadingParty(true)
      studentsApi.list().then((res) => {
        const data = res.data as any
        setStudents(data?.rows || [])
      }).catch(() => {
        toast.error("Failed to load students")
      }).finally(() => {
        setLoadingParty(false)
      })
    } else if (form.partyType === "parent") {
      setLoadingParty(true)
      parentsApi.getAll().then((res) => {
        const data = res.data as any
        setParents(data || [])
      }).catch(() => {
        toast.error("Failed to load parents")
      }).finally(() => {
        setLoadingParty(false)
      })
    } else {
      setTeachers([])
      setStudents([])
      setParents([])
    }
    // Reset party name/id when party type changes
    setForm((prev) => ({ ...prev, partyName: "", partyId: "" }))
  }, [form.partyType])

  const handlePartySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    if (form.partyType === "teacher") {
      const teacher = teachers.find((t) => t.id === selectedId)
      setForm((prev) => ({
        ...prev,
        partyId: selectedId,
        partyName: teacher ? teacher.fullName : "",
      }))
      } else if (form.partyType === "student") {
      const student = students.find((s) => s.id === selectedId)
      setForm((prev) => ({
        ...prev,
        partyId: selectedId,
        partyName: student ? `${student.firstName} ${student.lastName}` : "",
      }))
    } else if (form.partyType === "parent") {
      const parent = parents.find((p) => p.id === selectedId)
      setForm((prev) => ({
        ...prev,
        partyId: selectedId,
        partyName: parent ? parent.fullName : "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) {
      toast.error("Please select a category")
      return
    }
    setLoading(true)
    try {
      await accountTransactionsApi.create({
        categoryId: form.categoryId,
        type: form.type,
        amount: parseFloat(form.amount),
        description: form.description || undefined,
        transactionDate: form.transactionDate || undefined,
        partyType: form.partyType || undefined,
        partyName: form.partyName || undefined,
        partyId: form.partyId || undefined,
      })
      toast.success("Transaction created successfully")
      onSuccess()
      onClose()
      setForm({
        categoryId: "",
        type: "debit",
        amount: "",
        description: "",
        transactionDate: format(new Date(), "yyyy-MM-dd"),
        partyType: "",
        partyName: "",
        partyId: "",
      })
    } catch (err: any) {
      toast.error(err?.message || "Failed to create transaction")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">New Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "debit" | "credit" })}
              >
                <option value="debit">Debit (Remove Amount)</option>
                <option value="credit">Credit (Add Amount)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories
                .filter((c) => c.isActive)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.transactionDate}
              onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
            />
          </div>

          {/* Party / Person Details */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Person / Party Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Party Type</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={form.partyType}
                  onChange={(e) => setForm({ ...form, partyType: e.target.value })}
                >
                  <option value="">Select type</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="staff">Staff</option>
                  <option value="vendor">Vendor</option>
                  <option value="parent">Parent</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {form.partyType === "teacher"
                    ? "Select Teacher"
                    : form.partyType === "student"
                    ? "Select Student"
                    : form.partyType === "parent"
                    ? "Select Parent"
                    : "Party Name"}
                </label>
                {(form.partyType === "teacher" || form.partyType === "student" || form.partyType === "parent") ? (
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={form.partyId}
                    onChange={handlePartySelect}
                    disabled={loadingParty}
                  >
                    <option value="">
                      {loadingParty ? "Loading..." : `Select ${form.partyType}`}
                    </option>
                    {form.partyType === "teacher" &&
                      teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.fullName}
                        </option>
                      ))}
                    {form.partyType === "student" &&
                      students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName}
                        </option>
                      ))}
                    {form.partyType === "parent" &&
                      parents.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.fullName}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={form.partyName}
                    onChange={(e) => setForm({ ...form, partyName: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : `Create ${form.type === "debit" ? "Debit" : "Credit"}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState("ledger")
  const [categories, setCategories] = useState<AccountCategory[]>([])
  const [transactions, setTransactions] = useState<AccountTransaction[]>([])
  const [summary, setSummary] = useState<LedgerSummary | null>(null)
  const [loading, setLoading] = useState(true)

  // Filter states for transactions
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all")

  // Dialog states
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [showDeleteCategory, setShowDeleteCategory] = useState(false)
  const [showCreateTransaction, setShowCreateTransaction] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [catRes, txRes, sumRes] = await Promise.all([
        accountCategoriesApi.list(),
        accountTransactionsApi.list(),
        accountSummaryApi.get(),
      ])
      setCategories(catRes.data?.rows || [])
      setTransactions(txRes.data?.rows || [])
      setSummary(sumRes.data)
    } catch (err) {
      console.error("Failed to fetch accounts data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filtered transactions based on type and category
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterType !== "all" && tx.type !== filterType) return false
      if (filterCategoryId !== "all" && tx.categoryId !== filterCategoryId) return false
      return true
    })
  }, [transactions, filterType, filterCategoryId])

  const totalDebit = summary?.totalDebit ?? 0
  const totalCredit = summary?.totalCredit ?? 0
  const balance = summary?.balance ?? 0

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts Ledger</h1>
          <p className="text-sm text-muted-foreground">Manage your school's financial transactions and categories</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreateTransaction(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits (Income)</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalCredit.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debits (Expenses)</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalDebit.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <div className={`h-4 w-4 ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {balance >= 0 ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ledger">Transactions</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="summary">Category Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-lg font-medium">All Transactions</h3>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="border rounded-md px-3 py-1.5 text-sm bg-background"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="credit">Credit (Income)</option>
                <option value="debit">Debit (Expense)</option>
              </select>
              <select
                className="border rounded-md px-3 py-1.5 text-sm bg-background"
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DynamicDataTable
              data={filteredTransactions}
              apiColumns={[
                { field: "transactionDate", headerName: "Date" },
                { field: "type", headerName: "Type" },
                { field: "category.name", headerName: "Category" },
                { field: "amount", headerName: "Amount" },
                { field: "partyType", headerName: "Party Type" },
                { field: "partyName", headerName: "Party Name" },
                { field: "description", headerName: "Description" },
                { field: "isVoided", headerName: "Voided", type: "boolean" },
              ]}
              isLoading={false}
              renderCell={({ field, value, row }: any) => {
                if (field === "type") {
                  const tx = row as AccountTransaction
                  return (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        tx.type === "credit"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                      )}
                    >
                      {tx.type === "credit" ? (
                        <ArrowUpCircle className="h-3 w-3" />
                      ) : (
                        <ArrowDownCircle className="h-3 w-3" />
                      )}
                      {tx.type === "credit" ? "Credit" : "Debit"}
                    </span>
                  )
                }
                if (field === "amount") {
                  const tx = row as AccountTransaction
                  return (
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        tx.type === "credit" ? "text-green-600" : "text-red-600",
                      )}
                    >
                      {tx.type === "credit" ? "+" : "-"}₹{Number(value).toLocaleString()}
                    </span>
                  )
                }
                return undefined
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Account Categories</h3>
            <Button size="sm" onClick={() => setShowCreateCategory(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DynamicDataTable
              data={categories}
              apiColumns={[
                { field: "name", headerName: "Category Name" },
                { field: "description", headerName: "Description" },
                { field: "sortOrder", headerName: "Sort Order" },
                { field: "isActive", headerName: "Active", type: "boolean" },
                { field: "_count.transactions", headerName: "Transactions" },
              ]}
              isLoading={false}
              renderActions={(row: any) => (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedCategory(row)
                      setShowEditCategory(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      setSelectedCategory(row)
                      setShowDeleteCategory(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          )}
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <h3 className="text-lg font-medium">Category-wise Summary</h3>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {summary?.categories.map((cat) => (
                <Card key={cat.categoryId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{cat.categoryName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credit:</span>
                        <span className="text-green-600 font-medium">₹{cat.credit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Debit:</span>
                        <span className="text-red-600 font-medium">₹{cat.debit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-1">
                        <span className="font-medium">Balance:</span>
                        <span className={`font-bold ${cat.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ₹{cat.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!summary?.categories || summary.categories.length === 0) && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-8">
                  No transactions yet. Create a transaction to see category summaries.
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateCategoryDialog
        open={showCreateCategory}
        onClose={() => setShowCreateCategory(false)}
        onSuccess={fetchData}
      />
      <EditCategoryDialog
        open={showEditCategory}
        onClose={() => { setShowEditCategory(false); setSelectedCategory(null) }}
        onSuccess={fetchData}
        category={selectedCategory}
      />
      <DeleteCategoryDialog
        open={showDeleteCategory}
        onClose={() => { setShowDeleteCategory(false); setSelectedCategory(null) }}
        onSuccess={fetchData}
        category={selectedCategory}
      />
      <CreateTransactionDialog
        open={showCreateTransaction}
        onClose={() => setShowCreateTransaction(false)}
        onSuccess={fetchData}
        categories={categories}
      />
    </div>
  )
}
