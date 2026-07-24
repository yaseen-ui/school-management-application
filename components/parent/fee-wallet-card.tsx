"use client"

import { motion } from "framer-motion"
import { Wallet, TrendingDown, IndianRupee } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeeWalletCardProps {
  studentName: string
  totalNegotiatedFee: number
  totalPaid: number
  balance: number
  isEmpty?: boolean
}

export function FeeWalletCard({
  studentName,
  totalNegotiatedFee,
  totalPaid,
  balance,
  isEmpty = false,
}: FeeWalletCardProps) {
  const percentPaid = totalNegotiatedFee > 0 ? Math.round((totalPaid / totalNegotiatedFee) * 100) : 0
  const isFullyPaid = balance <= 0 && totalNegotiatedFee > 0

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(val)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        isEmpty
          ? "bg-card/50 border border-border/50"
          : isFullyPaid
            ? "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white"
            : balance > 0
              ? "bg-gradient-to-br from-violet-600 to-indigo-800 text-white"
              : "bg-gradient-to-br from-violet-600 to-indigo-800 text-white"
      )}
    >
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/8 blur-2xl" />
      <div className="absolute -bottom-8 left-1/3 h-24 w-24 rounded-full bg-white/5 blur-xl" />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-medium text-white/80">
              {isEmpty ? "No fees configured" : "Fee Account"}
            </span>
          </div>
          {isFullyPaid && (
            <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 text-white uppercase tracking-wider">
              Paid
            </span>
          )}
          {!isEmpty && balance > 0 && (
            <span className="text-[10px] font-semibold bg-amber-400/30 backdrop-blur-sm rounded-full px-2.5 py-1 text-white uppercase tracking-wider">
              Due
            </span>
          )}
        </div>

        {/* Balance / Hero amount */}
        <div className="mb-6">
          <p className="text-sm text-white/60 mb-1">
            {isEmpty ? "No fee record for" : balance > 0 ? "Outstanding Balance" : "Total Fee"}
          </p>
          <div className="flex items-baseline gap-1">
            <IndianRupee className="h-5 w-5 text-white/70" />
            <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {isEmpty ? "—" : isFullyPaid || balance <= 0
                ? formatCurrency(totalNegotiatedFee).replace("₹", "")
                : formatCurrency(balance).replace("₹", "")}
            </span>
          </div>
          {!isEmpty && totalPaid > 0 && (
            <p className="text-xs text-white/50 mt-1">
              {formatCurrency(totalPaid)} paid of {formatCurrency(totalNegotiatedFee)}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {!isEmpty && totalNegotiatedFee > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>Progress</span>
              <span>{percentPaid}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white/80"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentPaid, 100)}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}