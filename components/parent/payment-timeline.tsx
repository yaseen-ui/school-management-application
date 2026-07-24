"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Clock, AlertCircle, RotateCcw, IndianRupee } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FeePaymentEntry } from "@/hooks/use-parent-portal"

interface PaymentTimelineProps {
  payments: FeePaymentEntry[]
}

const statusIcons: Record<string, React.ElementType> = {
  paid: CheckCircle2,
  pending: Clock,
  failed: AlertCircle,
  cancelled: RotateCcw,
}
const statusColors: Record<string, string> = {
  paid: "text-emerald-500 bg-emerald-500/10",
  pending: "text-amber-500 bg-amber-500/10",
  failed: "text-red-500 bg-red-500/10",
  cancelled: "text-muted-foreground bg-muted/50",
}

export function PaymentTimeline({ payments }: PaymentTimelineProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center">
        <p className="text-sm text-muted-foreground">No payment history yet.</p>
      </div>
    )
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(val)

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 px-1">
        Payment History
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/50" />

        <div className="space-y-4">
          {payments.map((payment, index) => {
            const Icon = statusIcons[payment.status] || Clock
            const colorClass = statusColors[payment.status] || "text-muted-foreground"
            const hasRefunds = payment.refunds && payment.refunds.length > 0

            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="relative flex gap-4 pl-10"
              >
                {/* Dot on the line */}
                <div
                  className={cn(
                    "absolute left-[14px] top-1.5 h-3 w-3 rounded-full border-2 border-background ring-1 ring-border/30",
                    payment.status === "paid" ? "bg-emerald-500" : payment.status === "failed" ? "bg-red-500" : "bg-amber-500"
                  )}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(payment.amountPaid)}
                    </p>
                    <div className={cn("shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", colorClass)}>
                      <Icon className="h-3 w-3" />
                      <span className="capitalize">{payment.status}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>{new Date(payment.paymentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    {payment.feeHeadName && <span>· {payment.feeHeadName}</span>}
                    {payment.termName && <span>· {payment.termName}</span>}
                    {payment.paymentMethod && <span>· {payment.paymentMethod}</span>}
                  </div>

                  {/* Refunds */}
                  {hasRefunds && (
                    <div className="mt-2 space-y-1.5">
                      {payment.refunds.map((refund, ri) => (
                        <div key={ri} className="flex items-center gap-2 text-xs bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-1.5">
                          <RotateCcw className="h-3 w-3 text-red-500 shrink-0" />
                          <span className="text-red-600 font-medium">{formatCurrency(refund.amount)} refunded</span>
                          <span className="text-muted-foreground">· {refund.reason}</span>
                          <span className="text-muted-foreground ml-auto">{refund.refundDate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}