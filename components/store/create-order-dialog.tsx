"use client"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Loader2, ShoppingCart, Plus, Trash2, Search, Package, X, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateStoreOrder, useStoreProducts, useStoreKits } from "@/hooks/use-store"
import { useEnrollments } from "@/hooks/use-enrollments"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface CreateOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface OrderItemEntry {
  id: string // unique id for this cart entry
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  kitId?: string
  kitReferenceId?: string
  kitName?: string
  isUnselected?: boolean // for kit items that user wants to exclude
}

export function CreateOrderDialog({ open, onOpenChange }: CreateOrderDialogProps) {
  const createOrder = useCreateStoreOrder()
  const { data: products } = useStoreProducts({ isActive: "true" })
  const { data: kits } = useStoreKits({ isActive: "true" })
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { data: enrollments } = useEnrollments(debouncedSearch ? { search: debouncedSearch } : undefined)

  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItemEntry[]>([])
  const [selectedProductId, setSelectedProductId] = useState("")
  const [selectedKitId, setSelectedKitId] = useState("")
  const [remarks, setRemarks] = useState("")

  // Generate a unique reference for kit grouping
  const generateKitRef = useCallback(() => {
    return `kit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  }, [])

  // Add individual product
  const addProduct = () => {
    if (!selectedProductId) return
    const product = products?.find((p) => p.id === selectedProductId)
    if (!product) return
    if (orderItems.some((item) => item.productId === selectedProductId && !item.kitId)) return

    setOrderItems([
      ...orderItems,
      {
        id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: Number(product.basePrice),
      },
    ])
    setSelectedProductId("")
  }

  // Add kit — expands kit into its items
  const addKit = () => {
    if (!selectedKitId) return
    const kit = kits?.find((k) => k.id === selectedKitId)
    if (!kit || !kit.items) return

    const kitRefId = generateKitRef()
    const kitItems: OrderItemEntry[] = kit.items.map((item) => ({
      id: `kititem_${kit.id}_${item.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      productId: item.productId || `nonstock_${item.id}`,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      kitId: kit.id,
      kitReferenceId: kitRefId,
      kitName: kit.name,
      isUnselected: false,
    }))

    setOrderItems([...orderItems, ...kitItems])
    setSelectedKitId("")
  }

  // Remove individual item (product or kit item)
  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  // Remove entire kit by kitReferenceId
  const removeKit = (kitReferenceId: string) => {
    setOrderItems(orderItems.filter((item) => item.kitReferenceId !== kitReferenceId))
  }

  // Toggle unselected state for a kit item
  const toggleKitItem = (id: string) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, isUnselected: !item.isUnselected } : item
      )
    )
  }

  // Update quantity for individual product (not kit items)
  const updateItemQuantity = (id: string, quantity: number) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id && !item.kitId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  // Get active (selected) items for total calculation
  const activeItems = orderItems.filter((item) => !item.isUnselected)
  const totalAmount = activeItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  // Group items by kitReferenceId for display
  const kitGroups = new Map<string, OrderItemEntry[]>()
  const standaloneItems = orderItems.filter((item) => !item.kitId)

  orderItems.filter((item) => item.kitId).forEach((item) => {
    const ref = item.kitReferenceId || ""
    if (!kitGroups.has(ref)) {
      kitGroups.set(ref, [])
    }
    kitGroups.get(ref)!.push(item)
  })

  const handleSubmit = async () => {
    if (!selectedEnrollmentId || activeItems.length === 0) return
    try {
      await createOrder.mutateAsync({
        enrollmentId: selectedEnrollmentId,
        items: activeItems.map((item) => ({
          productId: item.productId.startsWith("nonstock_") ? undefined : item.productId,
          kitId: item.kitId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        remarks: remarks || undefined,
      })
      resetForm()
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const resetForm = () => {
    setSelectedEnrollmentId("")
    setOrderItems([])
    setRemarks("")
    setSearchQuery("")
    setSelectedProductId("")
    setSelectedKitId("")
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Order</DialogTitle>
              <DialogDescription>Place a new order for a student.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Student Selection */}
            <div className="space-y-2">
              <Label>
                Student <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search student by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {enrollments && enrollments.length > 0 && (
                <div className="max-h-32 overflow-y-auto rounded-lg border">
                  {enrollments.map((enrollment: any) => (
                    <button
                      key={enrollment.id}
                      type="button"
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors ${
                        selectedEnrollmentId === enrollment.id ? "bg-accent font-medium" : ""
                      }`}
                      onClick={() => {
                        setSelectedEnrollmentId(enrollment.id)
                        setSearchQuery(
                          `${enrollment.student?.firstName || ""} ${enrollment.student?.lastName || ""} - ${enrollment.rollNumber || ""}`
                        )
                      }}
                    >
                      {enrollment.student?.firstName} {enrollment.student?.lastName} — {enrollment.rollNumber} ({enrollment.section?.sectionName})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Items Section */}
            <div className="space-y-3 rounded-lg border p-4">
              <Label className="text-base font-semibold">Add Items to Cart</Label>

              {/* Add Individual Product */}
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Individual Product</Label>
                  <div className="flex gap-2">
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} — ₹{Number(product.basePrice).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={addProduct} disabled={!selectedProductId}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add Kit */}
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Kit (Template)</Label>
                  <div className="flex gap-2">
                    <Select value={selectedKitId} onValueChange={setSelectedKitId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a kit" />
                      </SelectTrigger>
                      <SelectContent>
                        {kits?.map((kit) => (
                          <SelectItem key={kit.id} value={kit.id}>
                            <div className="flex items-center gap-2">
                              <Package className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{kit.name}</span>
                              <span className="text-muted-foreground">— ₹{Number(kit.totalPrice).toFixed(2)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={addKit} disabled={!selectedKitId}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Cart Items <span className="text-destructive">*</span>
                {orderItems.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({activeItems.length} selected)
                  </span>
                )}
              </Label>

              {orderItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                  No items added yet. Select products or kits above.
                </p>
              ) : (
                <div className="space-y-3">
                  {/* Standalone Products */}
                  {standaloneItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border p-3",
                        item.isUnselected && "opacity-50"
                      )}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">₹{item.unitPrice.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Qty:</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-sm"
                        />
                      </div>
                      <p className="text-sm font-medium w-20 text-right">
                        ₹{(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Kit Groups */}
                  {Array.from(kitGroups.entries()).map(([kitRefId, kitItems]) => {
                    const kitName = kitItems[0]?.kitName || "Kit"
                    const kitId = kitItems[0]?.kitId
                    const selectedKitItems = kitItems.filter((i) => !i.isUnselected)
                    const kitTotal = selectedKitItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

                    return (
                      <div key={kitRefId} className="rounded-lg border border-primary/20 overflow-hidden">
                        {/* Kit Header */}
                        <div className="flex items-center justify-between bg-primary/5 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">{kitName}</span>
                            <span className="text-xs text-muted-foreground">
                              ({selectedKitItems.length}/{kitItems.length} items)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">₹{kitTotal.toFixed(2)}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => removeKit(kitRefId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Kit Items — expanded by default */}
                        <div className="divide-y">
                          {kitItems.map((item) => (
                            <div
                              key={item.id}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 pl-8 transition-colors",
                                item.isUnselected && "opacity-40 bg-muted/30"
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => toggleKitItem(item.id)}
                                className={cn(
                                  "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                                  item.isUnselected
                                    ? "border-muted-foreground/30 bg-muted"
                                    : "border-primary bg-primary text-primary-foreground"
                                )}
                              >
                                {!item.isUnselected && <Check className="h-3 w-3" />}
                              </button>
                              <div className="flex-1">
                                <p
                                  className={cn(
                                    "text-sm",
                                    item.isUnselected && "line-through text-muted-foreground"
                                  )}
                                >
                                  {item.productName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ₹{item.unitPrice.toFixed(2)} × {item.quantity}
                                </p>
                              </div>
                              <p
                                className={cn(
                                  "text-sm font-medium w-20 text-right",
                                  item.isUnselected && "line-through text-muted-foreground"
                                )}
                              >
                                ₹{(item.unitPrice * item.quantity).toFixed(2)}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {/* Total */}
                  <div className="flex justify-end border-t pt-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {orderItems.length - activeItems.length} item(s) unselected
                      </p>
                      <p className="text-sm font-semibold">
                        Total: <span className="text-lg">₹{totalAmount.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Optional notes about this order"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={createOrder.isPending || !selectedEnrollmentId || activeItems.length === 0}
            >
              {createOrder.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
