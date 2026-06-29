"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { StoreProduct } from "@/lib/api/store"

interface ViewProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: StoreProduct | null
}

export function ViewProductDialog({ open, onOpenChange, product }: ViewProductDialogProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>View product information.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{product.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="text-sm">{product.category?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Base Price</p>
              <p className="text-sm font-medium">₹{Number(product.basePrice).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Stock Quantity</p>
              <p className="text-sm">{product.stockQuantity ?? 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Availability</p>
              <Badge variant={product.isGeneral ? "default" : "secondary"}>
                {product.isGeneral ? "General (All Sections)" : "Section-Specific"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={product.isActive ? "default" : "secondary"}>
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {product.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{product.description}</p>
            </div>
          )}

          {/* Section Assignments */}
          {!product.isGeneral && product.sectionAssignments && product.sectionAssignments.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Assigned Sections</p>
              <div className="flex flex-wrap gap-2">
                {product.sectionAssignments.map((sa) => (
                  <Badge key={sa.id} variant="outline" className="text-xs">
                    {sa.section?.sectionName || "Unknown Section"}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{new Date(product.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Updated At</p>
              <p className="text-sm">{new Date(product.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
