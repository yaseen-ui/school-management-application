"use client"

import { motion } from "framer-motion"
import { Package, Eye, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStorePendingItems, useCollectStorePendingItem } from "@/hooks/use-store"
import { format } from "date-fns"
import type { StorePendingItem } from "@/lib/api/store"

export default function StorePendingItemsPage() {
  const { data: pendingItemsData, isLoading: pendingItemsLoading } = useStorePendingItems()
  const collectPendingItem = useCollectStorePendingItem()

  const pendingItems: StorePendingItem[] = pendingItemsData || []

  const handleCollectItem = (item: StorePendingItem) => {
    collectPendingItem.mutate(item.id)
  }

  const pendingItemColumns = [
    { field: "productName", headerName: "Product" },
    { field: "quantity", headerName: "Quantity" },
    { field: "status", headerName: "Status" },
    { field: "collectedAt", headerName: "Collected At" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Pending Items" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Pending Items" description="Track items that were out of stock at order time" />

        <DynamicDataTable
          data={pendingItems}
          apiColumns={pendingItemColumns}
          isLoading={pendingItemsLoading}
          idField="id"
          renderCell={({ row, field }: { row: StorePendingItem; field: string; value: unknown }) => {
            if (field === "productName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.productName}</span>
                </div>
              )
            }

            if (field === "quantity") {
              return <span className="text-sm text-muted-foreground">{row.quantity}</span>
            }

            if (field === "status") {
              return (
                <span className={`text-sm font-medium ${row.status === "collected" ? "text-green-600" : "text-yellow-600"}`}>
                  {row.status}
                </span>
              )
            }

            if (field === "collectedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {row.collectedAt ? format(new Date(row.collectedAt), "MMM d, yyyy") : "—"}
                </span>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof StorePendingItem] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: StorePendingItem) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {row.status === "pending" && (
                  <DropdownMenuItem onClick={() => handleCollectItem(row)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Mark Collected
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>
    </>
  )
}
