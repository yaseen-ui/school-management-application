"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/sonner"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  createOrGetPayrollBatch,
  populatePayrollBatch,
  submitPayrollBatch,
  updatePayrollRecord,
  bulkUpdatePayrollRecords,
  getPayrollBatch,
  listPayrollBatches,
} from "@/lib/api/payroll"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
]

interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string
  actualSalary: number
  paidAmount: number
  status: string
  paymentMethod: string
}

interface PayrollBatch {
  id: string
  month: number
  year: number
  status: string
  records: PayrollRecord[]
}

export default function PayrollProcessingPage() {
  const queryClient = useQueryClient()

  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [batchId, setBatchId] = useState<string | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [editingAmounts, setEditingAmounts] = useState<Record<string, number>>({})
  const [editingStatuses, setEditingStatuses] = useState<Record<string, string>>({})

  // Fetch all batches to check if one exists for the selected month/year
  const { data: allBatches } = useQuery({
    queryKey: ["payroll-batches"],
    queryFn: listPayrollBatches,
  })

  // Auto-load batch when month/year changes if one already exists
  // Also runs on mount to restore previously processed batch
  useEffect(() => {
    // listPayrollBatches() returns res.data which is the array directly
    const batches = allBatches
    if (batches && batches.length > 0) {
      const existingBatch = batches.find(
        (b: { month: number; year: number; id: string }) =>
          b.month === selectedMonth && b.year === selectedYear
      )
      if (existingBatch) {
        setBatchId(existingBatch.id)
      }
    }
  }, [selectedMonth, selectedYear, allBatches])

  // Create or get batch
  const batchMutation = useMutation({
    mutationFn: () => createOrGetPayrollBatch({ month: selectedMonth, year: selectedYear }),
    onSuccess: (batch) => {
      // createOrGetPayrollBatch() returns res.data which is the batch object directly
      setBatchId(batch.id)
      queryClient.invalidateQueries({ queryKey: ["payroll-batch", batch.id] })
      toast.success("Payroll batch ready")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // Fetch batch data
  const { data: batchResponse, isLoading: batchLoading } = useQuery({
    queryKey: ["payroll-batch", batchId],
    queryFn: () => getPayrollBatch(batchId!),
    enabled: !!batchId,
  })

  // getPayrollBatch() returns res.data which is the batch object directly
  const batch: PayrollBatch | null = batchResponse || null
  // Map nested employee data to top-level fields
  const rawRecords = batch?.records || []
  const records: PayrollRecord[] = rawRecords.map((r: any) => ({
    ...r,
    employeeName: r.employee?.fullName || r.employeeName || "Unknown",
    employeeCode: r.employee?.employeeCode || r.employeeCode || "",
  }))

  // Populate batch with employees
  const populateMutation = useMutation({
    mutationFn: () => populatePayrollBatch(batchId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-batch", batchId] })
      toast.success("Payroll batch populated with employees")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // Submit batch
  const submitMutation = useMutation({
    mutationFn: () => submitPayrollBatch(batchId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-batch", batchId] })
      toast.success("Payroll batch submitted successfully! Accounts updated.")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // Update single record
  const updateRecordMutation = useMutation({
    mutationFn: (data: { id: string; paidAmount?: number; status?: string }) =>
      updatePayrollRecord(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-batch", batchId] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // Bulk update
  const bulkUpdateMutation = useMutation({
    mutationFn: (records: Array<{ id: string; paidAmount?: number; status?: string }>) =>
      bulkUpdatePayrollRecords(batchId!, records),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-batch", batchId] })
      setSelectedRows(new Set())
      toast.success("Bulk update completed")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleMonthChange = (month: string) => {
    setSelectedMonth(Number(month))
    setBatchId(null)
    setSelectedRows(new Set())
    setEditingAmounts({})
    setEditingStatuses({})
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(Number(year))
    setBatchId(null)
    setSelectedRows(new Set())
    setEditingAmounts({})
    setEditingStatuses({})
  }

  const handleLoadBatch = () => {
    batchMutation.mutate()
  }

  const toggleSelectAll = () => {
    if (selectedRows.size === records.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(records.map((r) => r.id)))
    }
  }

  const toggleRow = (id: string) => {
    const newSet = new Set(selectedRows)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedRows(newSet)
  }

  const handleAmountChange = (recordId: string, value: string) => {
    setEditingAmounts({ ...editingAmounts, [recordId]: Number(value) })
  }

  const handleStatusChange = (recordId: string, status: string) => {
    setEditingStatuses({ ...editingStatuses, [recordId]: status })
  }

  const handleSaveRecord = (record: PayrollRecord) => {
    const updates: { id: string; paidAmount?: number; status?: string } = { id: record.id }
    if (editingAmounts[record.id] !== undefined) {
      updates.paidAmount = editingAmounts[record.id]
    }
    if (editingStatuses[record.id] !== undefined) {
      updates.status = editingStatuses[record.id]
    }
    updateRecordMutation.mutate(updates)
  }

  const handleBulkStatusUpdate = (status: string) => {
    const updates = Array.from(selectedRows).map((id) => ({ id, status }))
    bulkUpdateMutation.mutate(updates)
  }

  const handleBulkAmountUpdate = () => {
    const updates = Array.from(selectedRows).map((id) => {
      const record = records.find((r) => r.id === id)
      return {
        id,
        paidAmount: editingAmounts[id] !== undefined ? editingAmounts[id] : record?.actualSalary,
      }
    })
    bulkUpdateMutation.mutate(updates)
  }

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find((o) => o.value === status)
    if (!option) return <Badge variant="outline">{status}</Badge>
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${option.color}`}>{option.label}</span>
  }

  const totalActualSalary = records.reduce((sum, r) => sum + Number(r.actualSalary || 0), 0)
  const totalPaidAmount = records.reduce((sum, r) => {
    const edited = editingAmounts[r.id]
    return sum + (edited !== undefined ? edited : Number(r.paidAmount || 0))
  }, 0)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Payroll Processing"
        description="Process monthly salary payments for employees"
      />

      {/* Month/Year Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payroll Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label>Month</Label>
              <Select value={String(selectedMonth)} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Year</Label>
              <Select value={String(selectedYear)} onValueChange={handleYearChange}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleLoadBatch} disabled={batchMutation.isPending}>
              {batchMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {batchId ? "Reload Batch" : "Load / Create Batch"}
            </Button>
            {batchId && batch?.status !== "completed" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => populateMutation.mutate()}
                  disabled={populateMutation.isPending}
                >
                  {populateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Populate Employees
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending || records.length === 0}
                >
                  {submitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  Submit & Update Accounts
                </Button>
              </>
            )}
            {batch?.status === "completed" && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm px-3 py-1">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Completed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      {selectedRows.size > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">
                {selectedRows.size} record(s) selected
              </span>
              <Select onValueChange={handleBulkStatusUpdate}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkAmountUpdate}
                disabled={bulkUpdateMutation.isPending}
              >
                Update Amounts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payroll Grid */}
      <Card>
        <CardContent className="p-0">
          {batchLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !batchId ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <DollarSign className="h-12 w-12 mb-3" />
              <p>Select a month/year and click "Load / Create Batch" to start</p>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-3" />
              <p>No employees in this batch. Click "Populate Employees" to add them.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectedRows.size === records.length && records.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Employee Code</TableHead>
                    <TableHead className="text-right">Actual Salary</TableHead>
                    <TableHead className="text-right">Paid Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(record.id)}
                          onCheckedChange={() => toggleRow(record.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{record.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.employeeCode || "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{Number(record.actualSalary || 0).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          className="w-28 h-8 text-right ml-auto"
                          value={
                            editingAmounts[record.id] !== undefined
                              ? editingAmounts[record.id]
                              : record.paidAmount || record.actualSalary || 0
                          }
                          onChange={(e) => handleAmountChange(record.id, e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editingStatuses[record.id] || record.status}
                          onValueChange={(v) => handleStatusChange(record.id, v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          Cash
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveRecord(record)}
                          disabled={updateRecordMutation.isPending}
                        >
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Footer */}
      {records.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm text-muted-foreground">Total Employees</span>
                  <p className="text-xl font-semibold">{records.length}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Actual Salary</span>
                  <p className="text-xl font-semibold">₹{totalActualSalary.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Paid Amount</span>
                  <p className="text-xl font-semibold text-green-600">₹{totalPaidAmount.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
