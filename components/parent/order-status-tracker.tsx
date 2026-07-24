"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Truck, PackageCheck, Clock } from "lucide-react"

interface OrderStatusTrackerProps {
  status: string
}

const steps = [
  { key: "ordered", label: "Ordered", icon: Circle },
  { key: "packed", label: "Packed", icon: PackageCheck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
]

const statusIndex: Record<string, number> = {
  ordered: 0,
  packed: 1,
  delivered: 2,
  cancelled: -1,
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIdx = statusIndex[status] ?? statusIndex["ordered"]

  if (currentIdx === -1) {
    return (
      <div className="flex items-center gap-2 text-xs py-2">
        <Clock className="h-3.5 w-3.5 text-red-500" />
        <span className="text-red-600 font-medium">Order Cancelled</span>
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx
          const isCurrent = idx === currentIdx
          const Icon = step.icon

          return (
            <div key={step.key} className="flex flex-1 items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.15, duration: 0.3, type: "spring" }}
                  className={cn(
                    "relative h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold",
                    isCompleted
                      ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-muted/50 text-muted-foreground border border-border/30"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/40"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-[9px] mt-1 text-center",
                    isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-1 mb-4">
                  <div className="h-0.5 rounded-full bg-muted/50 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary/60"
                      initial={{ width: "0%" }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ delay: idx * 0.15 + 0.2, duration: 0.4 }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}