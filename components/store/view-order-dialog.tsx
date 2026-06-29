"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { StoreOrder } from "@/lib/api/store"

interface ViewOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: StoreOrder | null
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  COLLECTED: "outline",
  CANCELLED: "destructive",
}

export function ViewOrderDialog({ open, onOpenChange, order }: ViewOrderDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>View order information and items.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Order ID</p>
              <p className="text-sm font-mono">{order.id.slice(0, 8)}...</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={statusVariant[order.status] || "secondary"}>
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Student</p>
              <p className="text-sm">
                {order.enrollment?.student?.firstName} {order.enrollment?.student?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
              <p className="text-sm">{order.enrollment?.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Section</p>
              <p className="text-sm">{order.enrollment?.section?.sectionName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-sm font-medium">₹{Number(order.totalAmount).toFixed(2)}</p>
            </div>
          </div>

          {order.remarks && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Remarks</p>
              <p className="text-sm">{order.remarks}</p>
            </div>
          )}

          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Order Items</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{Number(item.unitPrice).toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{Number(item.totalPrice).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Order Date</p>
              <p className="text-sm">{new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
