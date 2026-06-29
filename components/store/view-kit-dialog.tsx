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
import type { StoreKit } from "@/lib/api/store"

interface ViewKitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kit: StoreKit | null
}

export function ViewKitDialog({ open, onOpenChange, kit }: ViewKitDialogProps) {
  if (!kit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Kit Details</DialogTitle>
          <DialogDescription>View kit information and items.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{kit.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={kit.isActive ? "default" : "secondary"}>
                {kit.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Price</p>
              <p className="text-sm font-medium">₹{Number(kit.totalPrice).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Items Count</p>
              <p className="text-sm">{kit.items?.length || 0}</p>
            </div>
          </div>
          {kit.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{kit.description}</p>
            </div>
          )}

          {/* Assigned Sections */}
          {kit.sections && kit.sections.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Assigned Sections</p>
              <div className="flex flex-wrap gap-1">
                {kit.sections.map((s) => (
                  <Badge key={s.id} variant="outline">
                    {s.section?.sectionName || "—"}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {kit.items && kit.items.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Kit Items</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kit.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName || "—"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ₹{(Number(item.unitPrice || 0) * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{new Date(kit.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Updated At</p>
              <p className="text-sm">{new Date(kit.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
