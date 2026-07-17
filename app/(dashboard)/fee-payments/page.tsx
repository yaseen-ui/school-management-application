"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IndianRupee, Plus, Eye, Trash2, CreditCard, Banknote, Building2, Globe, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePayments, useDeletePayment } from "@/hooks/use-fees"
import { DynamicDataTable, type CellRendererProps } from "@/components/shared/dynamic-data-table"
import { PageHeader } from "@/components/shared/page-header"
import { CreatePaymentDialog } from "@/components/fees/create-payment-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { usePermission, usePermissionsLoaded } from "@/hooks/use-permission"
import { ForbiddenPage } from "@/components/shared/forbidden-page"
import type { FeePayment } from "@/lib/api/fees"

const paymentMethodIcons: Record<string, React.ReactNode> = {
  cash: <Banknote className="h-3.5 w-3.5" />,
  bank_transfer: <Building2 className="h-3.5 w-3.5" />,
  cheque: <CreditCard className="h-3.5 w-3.5" />,
  online: <Globe className="h-3.5 w-3.5" />,
  card: <Smartphone className="h-3.5 w-3.5" />,
}

const paymentMethodColors: Record<string, string> = {
  cash: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  bank_transfer: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  cheque: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  online: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  card: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

export default function FeePaymentsPage() {
  const canAccess = usePermission('fee-payments:read')
  const isLoaded = usePermissionsLoaded()
  if (!canAccess && isLoaded) return <ForbiddenPage />
  return <FeePaymentsContent />
}

function FeePaymentsContent() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { data: paymentsData, isLoading } = usePayments()
  const deletePayment = useDeletePayment()
  const payments: FeePayment[] = paymentsData || []

  const totalCollected = payments
    .filter((p) => p.status === "paid" || p.status === "partial")
    .reduce((sum, p) => sum + (p.amountPaid || 0), 0)

  const handleDelete = async (payment: FeePayment) => {
    try {
      await deletePayment.mutateAsync(payment.id)
      toast.success("Payment deleted successfully")
    } catch (error) {
      toast.error("Failed to delete payment")
    }
  }

  const handleBulkDelete = async (selectedRows: FeePayment[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deletePayment.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} payment(s)`)
    } catch (error) {
      toast.error("Failed to delete some payments")
    }
  }

  const defaultColumns = [
    { field: "student", headerName: "Student" },
    { field: "amountPaid", headerName: "Amount" },
    { field: "paymentMethod", headerName: "Method" },
    { field: "paymentDate", headerName: "Date" },
    { field: "status", headerName: "Status" },
    { field: "transactionId", headerName: "Transaction ID" },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Fee Payments" description="Manage fee payments and collections">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{totalCollected.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <IndianRupee className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {payments.filter((p) => p.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <DynamicDataTable
          data={payments}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          searchPlaceholder="Search payments..."
          renderCell={({ row, field }: CellRendererProps<FeePayment>) => {
            if (field === "student") return <div><p className="text-sm font-medium">{row.studentFee?.enrollment?.student?.firstName} {row.studentFee?.enrollment?.student?.lastName}</p></div>
            if (field === "amountPaid") return <span className="text-sm font-semibold">₹{row.amountPaid?.toLocaleString()}</span>
            if (field === "paymentMethod") return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentMethodColors[row.paymentMethod] || "bg-gray-100"}`}>{paymentMethodIcons[row.paymentMethod]}{row.paymentMethod?.replace("_", " ")}</span>
            if (field === "paymentDate") return <span className="text-sm text-muted-foreground">{row.paymentDate ? format(new Date(row.paymentDate), "MMM d, yyyy") : "—"}</span>
            if (field === "status") { const s: Record<string, string> = { paid: "bg-emerald-100 text-emerald-700", partial: "bg-amber-100 text-amber-700", pending: "bg-gray-100 text-gray-600" }; return <Badge variant="outline" className={s[row.status] || ""}>{row.status}</Badge> }
            if (field === "transactionId") return <span className="text-sm font-mono">{row.transactionId || "—"}</span>
            return undefined
          }}
          renderActions={(row: FeePayment) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(row)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>
      <CreatePaymentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  )
}