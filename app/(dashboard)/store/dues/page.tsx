"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, Eye, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStoreDues } from "@/hooks/use-store"
import { ViewDueDialog } from "@/components/store/view-due-dialog"
import { format } from "date-fns"
import type { StoreDue } from "@/lib/api/store"

export default function StoreDuesPage() {
  const { data: duesData, isLoading: duesLoading } = useStoreDues()

  const [viewDueOpen, setViewDueOpen] = useState(false)
  const [selectedDue, setSelectedDue] = useState<StoreDue | null>(null)

  const dues: StoreDue[] = duesData || []

  const handleViewDue = (due: StoreDue) => {
    setSelectedDue(due)
    setViewDueOpen(true)
  }

  const dueColumns = [
    { field: "customerName", headerName: "Customer" },
    { field: "customerType", headerName: "Type" },
    { field: "totalDueAmount", headerName: "Total Due" },
    { field: "paidAmount", headerName: "Paid" },
    { field: "status", headerName: "Status" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Dues" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Dues" description="Track and manage outstanding payments" />

        <DynamicDataTable
          data={dues}
          apiColumns={dueColumns}
          isLoading={duesLoading}
          idField="id"
          renderCell={({ row, field }: { row: StoreDue; field: string; value: unknown }) => {
            if (field === "customerName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="font-medium">{row.customerName}</span>
                </div>
              )
            }

            if (field === "customerType") {
              return <span className="text-sm text-muted-foreground">{row.customerType}</span>
            }

            if (field === "totalDueAmount") {
              return <span className="text-sm font-medium">₹{Number(row.totalDueAmount).toFixed(2)}</span>
            }

            if (field === "paidAmount") {
              return <span className="text-sm font-medium text-green-600">₹{Number(row.paidAmount).toFixed(2)}</span>
            }

            if (field === "status") {
              const statusColors: Record<string, string> = {
                pending: "text-red-600 bg-red-100",
                partially_paid: "text-yellow-600 bg-yellow-100",
                settled: "text-green-600 bg-green-100",
              }
              return (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[row.status] || ""}`}>
                  {row.status.replace("_", " ")}
                </span>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof StoreDue] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: StoreDue) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewDue(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <ViewDueDialog open={viewDueOpen} onOpenChange={setViewDueOpen} due={selectedDue} />
    </>
  )
}
