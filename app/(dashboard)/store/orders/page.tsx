"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ClipboardList, Eye, Trash2, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStoreOrders, useUpdateStoreOrderStatus } from "@/hooks/use-store"
import { ViewOrderDialog } from "@/components/store/view-order-dialog"
import { format } from "date-fns"
import type { StoreOrder } from "@/lib/api/store"

export default function StoreOrdersPage() {
  const { data: ordersData, isLoading: ordersLoading } = useStoreOrders()
  const updateOrderStatus = useUpdateStoreOrderStatus()

  const [viewOrderOpen, setViewOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null)

  const orders: StoreOrder[] = ordersData || []

  const handleViewOrder = (order: StoreOrder) => {
    setSelectedOrder(order)
    setViewOrderOpen(true)
  }

  const handleConfirmOrder = (order: StoreOrder) => {
    updateOrderStatus.mutate({ id: order.id, data: { status: "CONFIRMED" } })
  }

  const handleCollectOrder = (order: StoreOrder) => {
    updateOrderStatus.mutate({ id: order.id, data: { status: "COLLECTED" } })
  }

  const handleCancelOrder = (order: StoreOrder) => {
    updateOrderStatus.mutate({ id: order.id, data: { status: "CANCELLED" } })
  }

  const orderColumns = [
    { field: "enrollment", headerName: "Student" },
    { field: "orderDate", headerName: "Order Date" },
    { field: "totalAmount", headerName: "Total Amount" },
    { field: "status", headerName: "Status" },
    { field: "remarks", headerName: "Remarks" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Orders" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Orders" description="View and manage store orders" />

        <DynamicDataTable
          data={orders}
          apiColumns={orderColumns}
          isLoading={ordersLoading}
          idField="id"
          renderCell={({ row, field }: { row: StoreOrder; field: string; value: unknown }) => {
            if (field === "enrollment") {
              return (
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {row.enrollment?.student?.firstName} {row.enrollment?.student?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">({row.enrollment?.rollNumber})</span>
                </div>
              )
            }

            if (field === "orderDate") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row.orderDate), "MMM d, yyyy")}
                </span>
              )
            }

            if (field === "totalAmount") {
              return <span className="text-sm font-medium">₹{Number(row.totalAmount).toFixed(2)}</span>
            }

            if (field === "status") {
              const statusColors: Record<string, string> = {
                PENDING: "text-yellow-600 bg-yellow-100",
                CONFIRMED: "text-blue-600 bg-blue-100",
                COLLECTED: "text-green-600 bg-green-100",
                CANCELLED: "text-red-600 bg-red-100",
              }
              return (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[row.status] || ""}`}>
                  {row.status}
                </span>
              )
            }

            if (field === "remarks") {
              return <span className="text-sm text-muted-foreground">{row.remarks || "—"}</span>
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof StoreOrder] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: StoreOrder) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewOrder(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {row.status === "PENDING" && (
                  <>
                    <DropdownMenuItem onClick={() => handleConfirmOrder(row)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Confirm
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCancelOrder(row)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel
                    </DropdownMenuItem>
                  </>
                )}
                {row.status === "CONFIRMED" && (
                  <DropdownMenuItem onClick={() => handleCollectOrder(row)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Mark Collected
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <ViewOrderDialog open={viewOrderOpen} onOpenChange={setViewOrderOpen} order={selectedOrder} />
    </>
  )
}
