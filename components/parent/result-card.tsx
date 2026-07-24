"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { SubjectResult } from "@/hooks/use-parent-portal"

interface ResultCardProps {
  subject: SubjectResult
  index: number
}

export function ResultCard({ subject, index }: ResultCardProps) {
  const { subjectName, maxMarks, passMarks, marksObtained, isAbsent } = subject

  const percent = marksObtained !== null && maxMarks > 0
    ? Math.round((marksObtained / maxMarks) * 100)
    : 0

  const isPassing = marksObtained !== null && marksObtained >= passMarks
  const getBarColor = () => {
    if (isAbsent) return "bg-muted-foreground/30"
    if (percent >= 80) return "bg-emerald-500"
    if (percent >= 60) return "bg-amber-500"
    if (percent >= 35) return "bg-orange-500"
    return "bg-red-500"
  }

  const getTextColor = () => {
    if (isAbsent) return "text-muted-foreground"
    if (percent >= 80) return "text-emerald-600"
    if (percent >= 60) return "text-amber-600"
    if (percent >= 35) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl hover:bg-accent/40 transition-colors"
    >
      {/* Subject name */}
      <div className="w-24 sm:w-32 shrink-0">
        <p className="text-sm font-medium text-foreground truncate">{subjectName}</p>
        <p className="text-[10px] text-muted-foreground">
          {isAbsent ? "Absent" : marksObtained !== null ? `${marksObtained}/${maxMarks}` : "N/A"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex-1 min-w-0">
        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", getBarColor())}
            initial={{ width: 0 }}
            animate={{ width: `${isAbsent ? 0 : Math.min(percent, 100)}%` }}
            transition={{ delay: index * 0.06 + 0.2, duration: 0.6, ease: "easeOut" }}
          />
        </div>
        {/* Pass mark indicator */}
        {!isAbsent && passMarks > 0 && maxMarks > 0 && (
          <div
            className="relative h-0"
            style={{ marginLeft: `${(passMarks / maxMarks) * 100}%` }}
          >
            <div className="absolute -top-1.5 h-3 w-0.5 rounded-full bg-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Percentage / Status */}
      <div className="shrink-0 text-right min-w-[48px]">
        {isAbsent ? (
          <span className="text-xs font-medium text-muted-foreground">Absent</span>
        ) : marksObtained !== null ? (
          <div>
            <p className={cn("text-sm font-bold", getTextColor())}>{percent}%</p>
            <p className="text-[10px] text-muted-foreground">
              {isPassing ? "Pass" : percent < 35 ? "Fail" : ""}
            </p>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
    </motion.div>
  )
}