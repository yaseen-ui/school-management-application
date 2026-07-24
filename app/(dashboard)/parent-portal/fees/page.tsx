"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  DollarSign,
  Loader2,
  FileText,
  IndianRupee,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { useParentProfile, useChildrenFees, type ChildFee } from "@/hooks/use-parent-portal"
import { FeeWalletCard } from "@/components/parent/fee-wallet-card"
import { DueCountdown } from "@/components/parent/due-countdown"
import { PaymentTimeline } from "@/components/parent/payment-timeline"
import { ShimmerButton } from "@/components/parent/shimmer-button"
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function FeesPage() {
  const { data: parent } = useParentProfile()
  const { data: childrenFees, isLoading } = useChildrenFees()
  const [selectedChildIdx, setSelectedChildIdx] = useState(0)

  const students = parent?.students ?? []
  const selectedChild = childrenFees?.[selectedChildIdx] ?? null

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(val)

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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Fees</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Payment & balance details</p>
        </div>
      </motion.div>

      {/* Empty state */}
      {!childrenFees || childrenFees.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Fee Records</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Fee details haven't been configured yet. Please check back later or contact the school administration.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Child selector tabs */}
          {childrenFees.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {childrenFees.map((child, idx) => (
                <button
                  key={child.studentId}
                  onClick={() => setSelectedChildIdx(idx)}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedChildIdx === idx
                      ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {child.studentName.split(" ")[0]}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedChild && (
              <motion.div
                key={selectedChild.studentId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Student Info */}
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{selectedChild.studentName}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedChild.gradeName}
                        {selectedChild.sectionName ? ` · ${selectedChild.sectionName}` : ""}
                        {selectedChild.rollNumber ? ` · Roll #${selectedChild.rollNumber}` : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wallet Card */}
                <FeeWalletCard
                  studentName={selectedChild.studentName}
                  totalNegotiatedFee={selectedChild.totalNegotiatedFee}
                  totalPaid={selectedChild.totalPaid}
                  balance={selectedChild.balance}
                  isEmpty={selectedChild.isEmpty}
                />

                {/* Due Countdown */}
                <DueCountdown
                  nextDueDate={selectedChild.nextDueDate}
                  balance={selectedChild.balance}
                />

                {/* Fee Breakdown — only if there are fee heads */}
                {selectedChild.feeHeads && selectedChild.feeHeads.length > 0 && (
                  <motion.div variants={container} initial="hidden" animate="show">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 px-1">
                      Fee Breakdown
                    </h3>
                    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:p-5 space-y-2 divide-y divide-border/30">
                      {selectedChild.feeHeads.map((head, i) => (
                        <motion.div
                          key={head.feeHeadId}
                          variants={item}
                          className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{head.feeHeadName}</p>
                            <p className="text-xs text-muted-foreground">
                              Actual: {formatCurrency(head.actualAmount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">
                              {formatCurrency(head.negotiatedAmount)}
                            </p>
                            {head.negotiatedAmount < head.actualAmount && (
                              <p className="text-[10px] text-emerald-600">
                                Save {formatCurrency(head.actualAmount - head.negotiatedAmount)}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {/* Total row */}
                      <div className="flex items-center justify-between pt-3">
                        <p className="text-sm font-semibold text-foreground">Total</p>
                        <p className="text-sm font-bold text-foreground">
                          {formatCurrency(selectedChild.totalNegotiatedFee)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Pay Now CTA */}
                {selectedChild.balance > 0 && (
                  <div className="flex justify-center">
                    <ShimmerButton onClick={() => {}}>
                      <IndianRupee className="h-4 w-4" />
                      Pay {formatCurrency(selectedChild.balance)}
                    </ShimmerButton>
                  </div>
                )}

                {/* Payment Timeline */}
                <PaymentTimeline payments={selectedChild.payments} />

                {/* Paid in Full Banner */}
                {!selectedChild.isEmpty && selectedChild.balance <= 0 && selectedChild.totalNegotiatedFee > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4 sm:p-5 flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">All Fees Paid</p>
                      <p className="text-xs text-muted-foreground">
                        Total of {formatCurrency(selectedChild.totalPaid)} has been paid. No outstanding balance.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}