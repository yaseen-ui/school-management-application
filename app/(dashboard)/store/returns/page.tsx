"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { useStoreReturns } from "@/hooks/use-store"
import { CreateReturnDialog } from "@/components/store/create-return-dialog"
import { format } from "date-fns"
import type { StoreReturn } from "@/lib/api/store"

export default function StoreReturnsPage() {
  const { data: returnsData, isLoading: returnsLoading } = useStoreReturns()

  const [createReturnOpen, setCreateReturnOpen] = useState(false)

  const returns: StoreReturn[] = returnsData || []

  const returnColumns = [
    { field: "productName", headerName: "Product" },
    { field: "quantity", headerName: "Quantity" },
    { field: "refundAmount", headerName: "Refund Amount" },
    { field: "reason", headerName: "Reason" },
    { field: "returnedAt", headerName: "Returned At" },
  ];

  return (
    <>
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Returns" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Returns" description="Process product returns and exchanges">
          <Button onClick={() => setCreateReturnOpen(true)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Process Return
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={returns}
          apiColumns={returnColumns}
          isLoading={returnsLoading}
          idField="id"
          renderCell={({ row, field }: { row: StoreReturn; field: string; value: unknown }) => {
            if (field === "productName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/10">
                    <RotateCcw className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className="font-medium">{row.productName}</span>
                </div>
              )
            }

            if (field === "quantity") {
              return <span className="text-sm text-muted-foreground">{row.quantity}</span>
            }

            if (field === "refundAmount") {
              return <span className="text-sm font-medium text-green-600">₹{Number(row.refundAmount).toFixed(2)}</span>
            }

            if (field === "reason") {
              return <span className="text-sm text-muted-foreground">{row.reason || "—"}</span>
            }

            if (field === "returnedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row.returnedAt), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
        />
      </motion.div>

      <CreateReturnDialog open={createReturnOpen} onOpenChange={setCreateReturnOpen} />
    </>
  )
}
