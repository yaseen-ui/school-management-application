"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Store,
  Loader2,
  FileText,
  Package,
} from "lucide-react"
import { useParentProfile, useChildrenStoreOrders, type ChildStoreOrder } from "@/hooks/use-parent-portal"
import { StoreOrderCard } from "@/components/parent/store-order-card"
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

export default function StorePage() {
  const { data: parent } = useParentProfile()
  const { data: orders, isLoading } = useChildrenStoreOrders()
  const [selectedChildIdx, setSelectedChildIdx] = useState(0)

  const students = parent?.students ?? []
  const uniqueStudentIds = [...new Set((orders ?? []).map((o) => o.studentId))]
  const selectedStudentId = uniqueStudentIds[selectedChildIdx] ?? ""
  const filteredOrders = (orders ?? []).filter((o) =>
    selectedStudentId ? o.studentId === selectedStudentId : true
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="h-10 w-10 text-primary/60" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Link
          href="/parent-portal"
          className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Store Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Uniform, books & supplies</p>
        </div>
      </motion.div>

      {/* Empty state */}
      {!orders || orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <Store className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No store orders have been placed for your children yet.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Child filter tabs */}
          {uniqueStudentIds.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedChildIdx(0)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  selectedChildIdx === 0 ||
                    (orders ?? [])
                      .filter((o) => orders?.[selectedChildIdx]?.studentName)
                      .length === 0
                    ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                All
              </button>
              {uniqueStudentIds.map((sid, idx) => {
                const order = orders.find((o) => o.studentId === sid)
                return (
                  <button
                    key={sid}
                    onClick={() => setSelectedChildIdx(idx + (orders[0]?.studentId === uniqueStudentIds[0] ? 0 : 0))}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      idx === selectedChildIdx
                        ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {order?.studentName?.split(" ")[0] ?? "Child"}
                  </button>
                )
              })}
            </div>
          )}

          {/* Orders list */}
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {filteredOrders.map((order, i) => (
              <StoreOrderCard key={order.id} order={order} index={i} />
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}