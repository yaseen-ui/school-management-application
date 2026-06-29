"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Plus, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRefunds } from "@/hooks/use-fees"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { PageHeader } from "@/components/shared/page-header"
import { CreateRefundDialog } from "@/components/fees/create-refund-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import type { FeeRefund } from "@/lib/api/fees"

export default function FeeRefundsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { data: refundsData, isLoading } = useRefunds()
  const refunds: FeeRefund[] = refundsData || []

  const totalRefunded = refunds.reduce((sum, r) => sum + (r.amount || 0), 0)

  const defaultColumns = [
    { field: "student", headerName: "Student" },
    { field: "amount", headerName: "Amount" },
    { field: "refundDate", headerName: "Date" },
    { field: "reason", headerName: "Reason" },
    { field: "processedBy", headerName: "Processed By" },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Fee Refunds" description="Manage fee refunds and adjustments">
          <Button variant="destructive" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Process Refund
          </Button>
        </PageHeader>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Refunded</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <RotateCcw className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                -₹{totalRefunded.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {refunds.length} refund transaction(s)
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <RotateCcw className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{refunds.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total refund transactions</p>
            </CardContent>
          </Card>
        </div>

        <DynamicDataTable
          data={refunds}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          idField="id"
          searchPlaceholder="Search by student name or reason..."
          renderCell={({ row, field }: { row: FeeRefund; field: string; value: unknown }) => {
            if (field === "student") {
              return (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-500/10 ring-1 ring-red-500/20">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      {row.payment?.studentFee?.enrollment?.student?.firstName?.[0]}
                      {row.payment?.studentFee?.enrollment?.student?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {row.payment?.studentFee?.enrollment?.student?.firstName}{" "}
                      {row.payment?.studentFee?.enrollment?.student?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Payment: ₹{row.payment?.amountPaid?.toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            }

            if (field === "amount") {
              return (
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  -₹{row.amount?.toLocaleString()}
                </span>
              )
            }

            if (field === "refundDate") {
              return (
                <span className="text-sm text-muted-foreground">
                  {row.refundDate
                    ? format(new Date(row.refundDate), "MMM d, yyyy")
                    : "—"}
                </span>
              )
            }

            if (field === "reason") {
              return (
                <div className="max-w-[250px]">
                  <p className="text-sm truncate" title={row.reason || ""}>
                    {row.reason || "—"}
                  </p>
                </div>
              )
            }

            if (field === "processedBy") {
              return (
                <span className="text-sm text-muted-foreground">
                  {row.processedBy?.fullName || "—"}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: FeeRefund) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <CreateRefundDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  )
}
