"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarClock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DueCountdownProps {
  nextDueDate: string | null
  balance: number
}

export function DueCountdown({ nextDueDate, balance }: DueCountdownProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    if (!nextDueDate) {
      setDaysLeft(null)
      return
    }

    const dueDate = new Date(nextDueDate)
    const now = new Date()
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    setDaysLeft(Math.max(0, diffDays))
    setIsPast(diffDays < 0)
  }, [nextDueDate])

  const getUrgencyClass = () => {
    if (!daysLeft || balance <= 0) return ""
    if (daysLeft <= 3) return "from-red-500/10 to-red-500/5 border-red-500/20"
    if (daysLeft <= 7) return "from-amber-500/10 to-amber-500/5 border-amber-500/20"
    return "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20"
  }

  const getIconClass = () => {
    if (!daysLeft || balance <= 0) return "text-muted-foreground"
    if (daysLeft <= 3) return "text-red-500"
    if (daysLeft <= 7) return "text-amber-500"
    return "text-emerald-500"
  }

  const getDayTextClass = () => {
    if (!daysLeft || balance <= 0) return "text-foreground"
    if (daysLeft <= 3) return "text-red-600"
    if (daysLeft <= 7) return "text-amber-600"
    return "text-emerald-600"
  }

  return (
    <AnimatePresence>
      {nextDueDate && balance > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className={cn(
            "rounded-2xl border bg-gradient-to-br p-4 sm:p-5",
            getUrgencyClass()
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", getIconClass(), "bg-white/50 dark:bg-black/20")}>
              {isPast ? (
                <AlertTriangle className="h-5 w-5" />
              ) : daysLeft === 0 ? (
                <AlertTriangle className="h-5 w-5 animate-pulse" />
              ) : (
                <CalendarClock className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {isPast ? (
                <div>
                  <p className="text-sm font-semibold text-red-600">Payment Overdue</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Due date was {new Date(nextDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              ) : daysLeft !== null && daysLeft > 0 ? (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={cn("text-3xl font-bold", getDayTextClass())}>{daysLeft}</span>
                    <span className="text-xs text-muted-foreground">days remaining</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Due on {new Date(nextDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-foreground">Due Today</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(nextDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              )}
            </div>

            {/* Urgency pulse ring */}
            {daysLeft !== null && daysLeft <= 3 && daysLeft > 0 && (
              <div className="shrink-0 relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-400/20"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-400/15"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}