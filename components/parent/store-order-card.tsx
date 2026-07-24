"use client"

import { motion } from "framer-motion"
import { Package, IndianRupee, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { OrderStatusTracker } from "./order-status-tracker"
import type { ChildStoreOrder } from "@/hooks/use-parent-portal"

interface StoreOrderCardProps {
  order: ChildStoreOrder
  index: number
}

export function StoreOrderCard({ order, index }: StoreOrderCardProps) {
  const [expanded, setExpanded] = useState(false)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(val)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 sm:p-5 cursor-pointer hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-violet-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {order.studentName}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.gradeName}{order.sectionName ? ` · ${order.sectionName}` : ""}
              </p>
            </div>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Order #{order.orderNumber}</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <IndianRupee className="h-3.5 w-3.5 text-foreground" />
              <span className="text-lg font-bold text-foreground">{formatCurrency(order.totalAmount).replace("₹", "")}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
            <p className={cn(
              "text-[10px] font-semibold uppercase mt-0.5 rounded-full px-2 py-0.5",
              order.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
            )}>
              {order.paymentStatus}
              {order.dueAmount > 0 ? ` · Due ${formatCurrency(order.dueAmount)}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="border-t border-border/30 px-4 sm:px-5 py-4 space-y-4"
        >
          {/* Status Tracker */}
          <OrderStatusTracker status={order.status} />

          {/* Items List */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-semibold text-foreground">{formatCurrency(item.totalPrice)}</p>
                    <p className={cn(
                      "text-[10px] rounded px-1.5 py-0.5 mt-0.5 inline-block",
                      item.status === "delivered" ? "bg-emerald-500/10 text-emerald-600" :
                      item.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                      "bg-muted/40 text-muted-foreground"
                    )}>
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/20">
            <span>Payment: {order.paymentMethod}</span>
            <span>Order #{order.orderNumber}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}