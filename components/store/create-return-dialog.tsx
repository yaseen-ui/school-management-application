"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, RotateCcw, Search, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useStoreOrders, useCreateStoreReturn } from "@/hooks/use-store"
import { useDebounce } from "@/hooks/use-debounce"
import type { StoreOrder } from "@/lib/api/store"

interface CreateReturnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReturnDialog({ open, onOpenChange }: CreateReturnDialogProps) {
  const createReturn = useCreateStoreReturn()

  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { data: orders } = useStoreOrders(
    debouncedSearch ? { search: debouncedSearch, status: "completed" } : undefined
  )

  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null)
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set())
  const [remarks, setRemarks] = useState("")

  const handleSelectOrder = (order: StoreOrder) => {
    setSelectedOrder(order)
    setSelectedItemIds(new Set())
    setRemarks("")
    setSearchQuery("")
  }

  const toggleItem = (itemId: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const handleSubmit = async () => {
    if (!selectedOrder || selectedItemIds.size === 0) return

    // Process each selected item as a separate return
    for (const itemId of Array.from(selectedItemIds)) {
      const item = selectedOrder.items?.find((i) => i.id === itemId)
      if (!item) continue

      await createReturn.mutateAsync({
        orderItemId: itemId,
        quantity: item.quantity,
        refundAmount: Number(item.unitPrice) * item.quantity,
        reason: remarks || undefined,
      })
    }
  }

  const handleReset = () => {
    setSelectedOrder(null)
    setSelectedItemIds(new Set())
    setRemarks("")
    setSearchQuery("")
  }

  const selectedItems = selectedOrder?.items?.filter((item) => selectedItemIds.has(item.id)) || []

  const totalRefundAmount = selectedItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) handleReset()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/10">
              <RotateCcw className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <DialogTitle>Process Return / Exchange</DialogTitle>
              <DialogDescription>
                Select items from a completed order to return or exchange.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Step 1: Search Order */}
          {!selectedOrder && (
            <div className="space-y-3">
              <Label>Search Completed Order</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {orders && orders.length > 0 && (
                <ScrollArea className="max-h-48 rounded-lg border">
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors border-b last:border-b-0"
                      onClick={() => handleSelectOrder(order)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {order.customerName || `Order #${order.id.slice(0, 8)}`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} — {order.items?.length || 0} item(s)
                      </p>
                    </button>
                  ))}
                </ScrollArea>
              )}
              {orders && orders.length === 0 && searchQuery && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No completed orders found.
                </p>
              )}
            </div>
          )}

          {/* Step 2: Select Items */}
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {selectedOrder.customerName || `Order #${selectedOrder.id.slice(0, 8)}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Change Order
                </Button>
              </div>

              <Separator />

              <Label>Select items to return</Label>
              <div className="space-y-2">
                {(selectedOrder.items || []).map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedItemIds.has(item.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{Number(item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        ₹{(Number(item.unitPrice) * item.quantity).toFixed(2)}
                      </p>
                      {item.isReturned && (
                        <Badge variant="secondary" className="text-xs">
                          Returned
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Items Summary */}
              {selectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border p-4 space-y-3"
                >
                  <p className="text-sm font-medium">
                    {selectedItems.length} item(s) selected for return
                  </p>
                  <div className="space-y-1">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-muted-foreground"
                      >
                        <span>{item.productName}</span>
                        <span>₹{(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Refund Amount</span>
                    <span className="text-green-600">₹{totalRefundAmount.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="return-remarks">Remarks (optional)</Label>
                <Textarea
                  id="return-remarks"
                  placeholder="Reason for return..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="text-sm min-h-[60px]"
                />
              </div>

              {/* Submit */}
              <Button
                type="button"
                className="w-full"
                onClick={handleSubmit}
                disabled={createReturn.isPending || selectedItemIds.size === 0}
              >
                {createReturn.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Process Return (₹{totalRefundAmount.toFixed(2)})
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
