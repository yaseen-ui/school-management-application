"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2,
  ShoppingCart,
  Plus,
  Trash2,
  Search,
  Package,
  ShoppingBag,
  Filter,
  Minus,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  DollarSign,
  CreditCard,
  User,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  useCreateStoreOrder,
  useStoreCategories,
  useStoreProducts,
  useStoreKits,
} from "@/hooks/use-store"
import { useEnrollments } from "@/hooks/use-enrollments"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
import type { StoreProduct, StoreKit } from "@/lib/api/store"

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItemEntry {
  id: string
  productId: string | null
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  kitId?: string
  kitReferenceId?: string
  kitName?: string
  isUnselected?: boolean
}

interface StockIssue {
  productName: string
  requiredQuantity: number
  availableStock: number
  kitName?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DistributePage() {
  const createOrder = useCreateStoreOrder()
  const { data: categories } = useStoreCategories()
  const { data: products } = useStoreProducts({ isActive: "true" })
  const { data: kits } = useStoreKits({ isActive: "true" })

  // ── Student / Customer ──────────────────────────────────────────────────────
  const [customerType, setCustomerType] = useState<"student" | "external">("student")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { data: enrollments } = useEnrollments(debouncedSearch ? { search: debouncedSearch } : undefined)

  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("")
  const [selectedEnrollmentLabel, setSelectedEnrollmentLabel] = useState("")
  const [externalName, setExternalName] = useState("")
  const [externalPhone, setExternalPhone] = useState("")

  // ── Category filter ─────────────────────────────────────────────────────────
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")

  // ── Cart ────────────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState<CartItemEntry[]>([])
  const [remarks, setRemarks] = useState("")

  // ── Payment ─────────────────────────────────────────────────────────────────
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [transactionId, setTransactionId] = useState("")
  const [paymentMode, setPaymentMode] = useState("full")
  const [amountPaid, setAmountPaid] = useState("")
  const [offeredAmount, setOfferedAmount] = useState("")

  // ── Stock Check ─────────────────────────────────────────────────────────────
  const [stockIssues, setStockIssues] = useState<StockIssue[]>([])
  const [showStockDialog, setShowStockDialog] = useState(false)
  const [proceedWithPending, setProceedWithPending] = useState(false)

  // ── Filter products / kits ──────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!products) return []
    if (selectedCategoryId === "all") return products
    return products.filter((p) => p.categoryId === selectedCategoryId)
  }, [products, selectedCategoryId])

  const filteredKits = useMemo(() => {
    if (!kits) return []
    if (selectedCategoryId === "all") return kits
    return kits.filter((k) =>
      k.items?.some((item) => {
        const product = products?.find((p) => p.id === item.productId)
        return product?.categoryId === selectedCategoryId
      })
    )
  }, [kits, selectedCategoryId, products])

  // ── Cart calculations ───────────────────────────────────────────────────────
  const activeItems = useMemo(() => cartItems.filter((i) => !i.isUnselected), [cartItems])
  const totalAmount = useMemo(
    () => activeItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [activeItems]
  )
  const discountAmount = useMemo(() => {
    if (!offeredAmount) return 0
    const offered = Number(offeredAmount)
    return offered < totalAmount ? totalAmount - offered : 0
  }, [totalAmount, offeredAmount])
  const finalAmount = useMemo(() => {
    if (offeredAmount) return Number(offeredAmount)
    return totalAmount
  }, [totalAmount, offeredAmount])
  const paidAmount = useMemo(() => Number(amountPaid) || 0, [amountPaid])
  const dueAmount = useMemo(() => Math.max(0, finalAmount - paidAmount), [finalAmount, paidAmount])

  // ── Kit grouping for display ────────────────────────────────────────────────
  const kitGroups = useMemo(() => {
    const groups = new Map<string, CartItemEntry[]>()
    cartItems.filter((i) => i.kitId).forEach((item) => {
      const ref = item.kitReferenceId || ""
      if (!groups.has(ref)) groups.set(ref, [])
      groups.get(ref)!.push(item)
    })
    return groups
  }, [cartItems])

  const standaloneItems = useMemo(() => cartItems.filter((i) => !i.kitId), [cartItems])

  // ── Add product ─────────────────────────────────────────────────────────────
  const addProductToCart = useCallback((product: StoreProduct) => {
    const existing = cartItems.find(
      (i) => i.productId === product.id && !i.kitId && !i.isUnselected
    )
    if (existing) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * i.unitPrice }
            : i
        )
      )
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: generateId("prod"),
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: Number(product.basePrice),
          totalPrice: Number(product.basePrice),
        },
      ])
    }
  }, [cartItems])

  // ── Add kit (expands into individual items) ─────────────────────────────────
  const addKitToCart = useCallback((kit: StoreKit) => {
    if (!kit.items || kit.items.length === 0) return
    const kitRefId = generateId("kit")
    const newItems: CartItemEntry[] = kit.items.map((item) => ({
      id: generateId(`ki_${kit.id}`),
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.unitPrice) * item.quantity,
      kitId: kit.id,
      kitReferenceId: kitRefId,
      kitName: kit.name,
      isUnselected: false,
    }))
    setCartItems((prev) => [...prev, ...newItems])
  }, [])

  // ── Remove item ─────────────────────────────────────────────────────────────
  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  // ── Remove entire kit ───────────────────────────────────────────────────────
  const removeKit = useCallback((kitRefId: string) => {
    setCartItems((prev) => prev.filter((i) => i.kitReferenceId !== kitRefId))
  }, [])

  // ── Toggle kit item ─────────────────────────────────────────────────────────
  const toggleKitItem = useCallback((id: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isUnselected: !i.isUnselected } : i))
    )
  }, [])

  // ── Update quantity ─────────────────────────────────────────────────────────
  const updateQuantity = useCallback((id: string, newQty: number) => {
    if (newQty < 1) return
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice }
          : i
      )
    )
  }, [])

  // ── Clear cart ──────────────────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    setCartItems([])
    setRemarks("")
    setShowPayment(false)
    setAmountPaid("")
    setOfferedAmount("")
    setPaymentMethod("cash")
    setTransactionId("")
    setPaymentMode("full")
    setStockIssues([])
    setProceedWithPending(false)
  }, [])

  // ── Reset form ──────────────────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    clearCart()
    setSelectedEnrollmentId("")
    setSelectedEnrollmentLabel("")
    setSearchQuery("")
    setExternalName("")
    setExternalPhone("")
  }, [clearCart])

  // ── Stock Check ─────────────────────────────────────────────────────────────
  const performStockCheck = useCallback(async (): Promise<boolean> => {
    const itemsToCheck = activeItems.map((i) => ({
      productId: i.productId || undefined,
      kitId: i.kitId,
      productName: i.productName,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    }))

    try {
      const res = await fetch("/api/store/check-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-tenant-id": "default" },
        body: JSON.stringify({ items: itemsToCheck }),
      })
      const data = await res.json()
      if (data.data?.unavailableItems?.length > 0) {
        setStockIssues(data.data.unavailableItems)
        setShowStockDialog(true)
        return false
      }
      return true
    } catch {
      // If stock check fails, proceed anyway
      return true
    }
  }, [activeItems])

  // ── Submit Order ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (activeItems.length === 0) return

    // If we haven't checked stock yet, do it first
    if (!proceedWithPending) {
      const stockOk = await performStockCheck()
      if (!stockOk) return
    }

    const items = activeItems.map((i) => ({
      productId: i.productId || undefined,
      kitId: i.kitId,
      productName: i.productName,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    }))

    const orderPayload: any = {
      items,
      discountAmount: discountAmount || undefined,
      offeredAmount: offeredAmount ? Number(offeredAmount) : undefined,
      remarks: remarks || undefined,
    }

    if (customerType === "student") {
      orderPayload.enrollmentId = selectedEnrollmentId
      orderPayload.customerType = "student"
    } else {
      orderPayload.customerName = externalName
      orderPayload.customerPhone = externalPhone || undefined
      orderPayload.customerType = "external"
    }

    // Payment info
    if (showPayment && paidAmount > 0) {
      orderPayload.paymentMethod = paymentMethod
      orderPayload.transactionId = transactionId || undefined
      orderPayload.paymentMode = paymentMode
      orderPayload.amountPaid = paidAmount
      // offeredAmount already set above — the backend will calculate due
    }

    try {
      await createOrder.mutateAsync(orderPayload)
      resetForm()
    } catch {
      // Error handled by mutation
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ─── Left Column: Student Selector + Items Browser ─────────────────── */}
      <div className="lg:col-span-2 space-y-6">
        {/* Customer Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Select Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Customer Type Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={customerType === "student" ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomerType("student")}
              >
                <Building2 className="h-3.5 w-3.5 mr-1" />
                Student
              </Button>
              <Button
                type="button"
                variant={customerType === "external" ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomerType("external")}
              >
                <User className="h-3.5 w-3.5 mr-1" />
                External
              </Button>
            </div>

            {customerType === "student" ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search student by name or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {selectedEnrollmentLabel && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                    <Badge variant="outline" className="bg-primary/10">Selected</Badge>
                    <span className="text-sm font-medium">{selectedEnrollmentLabel}</span>
                    <Button
                      variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0"
                      onClick={() => { setSelectedEnrollmentId(""); setSelectedEnrollmentLabel(""); setSearchQuery("") }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {!selectedEnrollmentId && enrollments && enrollments.length > 0 && (
                  <ScrollArea className="max-h-40 rounded-lg border">
                    {enrollments.map((enrollment: any) => (
                      <button
                        key={enrollment.id}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                        onClick={() => {
                          setSelectedEnrollmentId(enrollment.id)
                          setSelectedEnrollmentLabel(
                            `${enrollment.student?.firstName || ""} ${enrollment.student?.lastName || ""} - ${enrollment.rollNumber || ""} (${enrollment.section?.sectionName || ""})`
                          )
                          setSearchQuery("")
                        }}
                      >
                        {enrollment.student?.firstName} {enrollment.student?.lastName} —{" "}
                        {enrollment.rollNumber} ({enrollment.section?.sectionName})
                      </button>
                    ))}
                  </ScrollArea>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Customer Name *</Label>
                  <Input
                    placeholder="Enter customer name"
                    value={externalName}
                    onChange={(e) => setExternalName(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Phone (optional)</Label>
                  <Input
                    placeholder="Enter phone number"
                    value={externalPhone}
                    onChange={(e) => setExternalPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browse Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Browse Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategoryId === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategoryId("all")}
              >
                All
              </Badge>
              {categories?.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategoryId === cat.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategoryId(cat.id)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>

            <Separator />

            {/* Products */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </h4>
              {filteredProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No products found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{Number(product.basePrice).toFixed(2)}
                          {product.stockQuantity > 0 && (
                            <span className="ml-2">Stock: {product.stockQuantity}</span>
                          )}
                        </p>
                      </div>
                      <Button
                        type="button" variant="ghost" size="sm" className="ml-2 shrink-0"
                        onClick={() => addProductToCart(product)}
                        disabled={
                          (customerType === "student" && !selectedEnrollmentId) ||
                          (customerType === "external" && !externalName)
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Kits */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Kits (Templates)
              </h4>
              {filteredKits.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No kits found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredKits.map((kit) => (
                    <div key={kit.id} className="rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{kit.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ₹{Number(kit.totalPrice).toFixed(2)}
                            {kit.items && <span className="ml-2">{kit.items.length} item(s)</span>}
                          </p>
                        </div>
                        <Button
                          type="button" variant="ghost" size="sm" className="ml-2 shrink-0"
                          onClick={() => addKitToCart(kit)}
                          disabled={
                            (customerType === "student" && !selectedEnrollmentId) ||
                            (customerType === "external" && !externalName)
                          }
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      {kit.items && kit.items.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {kit.items.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="flex justify-between text-xs text-muted-foreground pl-2 border-l-2 border-muted"
                            >
                              <span>{item.productName}</span>
                              <span>{item.quantity} × ₹{Number(item.unitPrice).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Right Column: Cart + Payment ──────────────────────────────────── */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart
                {cartItems.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeItems.length} selected
                  </Badge>
                )}
              </span>
              {cartItems.length > 0 && (
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearCart}>
                  Clear
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Your cart is empty</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Select a customer and add items from the left panel.
                </p>
              </div>
            ) : (
              <>
                <ScrollArea className="max-h-[350px] pr-2">
                  <div className="space-y-2">
                    {/* Standalone Products */}
                    {standaloneItems.map((item) => (
                      <div key={item.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">₹{item.unitPrice.toFixed(2)} each</p>
                          </div>
                          <Button
                            type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive shrink-0 ml-1"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              type="button" variant="outline" size="icon" className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              type="button" variant="outline" size="icon" className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm font-semibold">₹{item.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    {/* Kit Groups — expanded by default */}
                    {Array.from(kitGroups.entries()).map(([kitRefId, kitItems]) => {
                      const kitName = kitItems[0]?.kitName || "Kit"
                      const selectedKitItems = kitItems.filter((i) => !i.isUnselected)
                      const kitTotal = selectedKitItems.reduce((s, i) => s + i.totalPrice, 0)

                      return (
                        <div key={kitRefId} className="rounded-lg border border-primary/20 overflow-hidden">
                          {/* Kit Header */}
                          <div className="flex items-center justify-between bg-primary/5 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold">{kitName}</span>
                              <span className="text-xs text-muted-foreground">
                                ({selectedKitItems.length}/{kitItems.length})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">₹{kitTotal.toFixed(2)}</span>
                              <Button
                                type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive"
                                onClick={() => removeKit(kitRefId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Kit Items */}
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
                                    "flex h-4 w-4 items-center justify-center rounded border transition-colors shrink-0",
                                    item.isUnselected
                                      ? "border-muted-foreground/30 bg-muted"
                                      : "border-primary bg-primary text-primary-foreground"
                                  )}
                                >
                                  {!item.isUnselected && <Check className="h-2.5 w-2.5" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={cn("text-xs", item.isUnselected && "line-through text-muted-foreground")}>
                                    {item.productName}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                                  </p>
                                </div>
                                <p className={cn("text-xs font-medium shrink-0", item.isUnselected && "line-through text-muted-foreground")}>
                                  ₹{item.totalPrice.toFixed(2)}
                                </p>
                                <Button
                                  type="button" variant="ghost" size="icon" className="h-5 w-5 text-destructive shrink-0"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-2.5 w-2.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>

                  {/* Offered Price / Discount */}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Offered Price (optional)</Label>
                    <Input
                      type="number"
                      placeholder="Enter offered amount"
                      value={offeredAmount}
                      onChange={(e) => setOfferedAmount(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Section Toggle */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowPayment(!showPayment)}
                  >
                    <CreditCard className="h-3.5 w-3.5 mr-1" />
                    {showPayment ? "Hide Payment" : "Add Payment"}
                  </Button>

                  <AnimatePresence>
                    {showPayment && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <div className="space-y-1">
                          <Label className="text-xs">Payment Method</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Transaction ID (optional)</Label>
                          <Input
                            placeholder="e.g. UPI ref or card last 4"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Amount Paid</Label>
                          <Input
                            type="number"
                            placeholder="Enter amount paid"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>

                        {paidAmount > 0 && paidAmount < finalAmount && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-3 py-2">
                            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">Due: ₹{dueAmount.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                              A due record will be created for the remaining amount.
                            </p>
                          </div>
                        )}

                        {paidAmount >= finalAmount && finalAmount > 0 && (
                          <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 px-3 py-2">
                            <p className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                              <Check className="h-4 w-4" />
                              Payment complete
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Remarks */}
                <div className="space-y-1">
                  <Label className="text-xs">Remarks</Label>
                  <Textarea
                    placeholder="Optional notes..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="text-sm min-h-[50px]"
                  />
                </div>

                {/* Place Order */}
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={
                    createOrder.isPending ||
                    activeItems.length === 0 ||
                    (customerType === "student" && !selectedEnrollmentId) ||
                    (customerType === "external" && !externalName)
                  }
                >
                  {createOrder.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {showPayment && paidAmount > 0 ? "Complete Order & Payment" : "Place Order"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Stock Issue Dialog ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showStockDialog && stockIssues.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-lg shadow-lg max-w-md w-full mx-4 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Stock Issues Found</h3>
                  <p className="text-sm text-muted-foreground">
                    Some items are not available in sufficient quantity.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {stockIssues.map((issue, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-800/50 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{issue.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Required: {issue.requiredQuantity} | Available: {issue.availableStock}
                        {issue.kitName && <span> (from kit: {issue.kitName})</span>}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-300 shrink-0 ml-2">
                      Short by {issue.requiredQuantity - issue.availableStock}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <p className="text-sm text-muted-foreground">
                  You can still proceed with the order. Unavailable items will be marked as <strong>pending</strong> and can be collected later.
                </p>
                <div className="flex gap-2 justify-end mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowStockDialog(false)
                      setStockIssues([])
                    }}
                  >
                    Cancel Order
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      setShowStockDialog(false)
                      setProceedWithPending(true)
                      // Now submit the order
                      handleSubmit()
                    }}
                  >
                    Proceed Anyway
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
