"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface AttendanceSummaryCardProps {
  present: number
  absent: number
  late: number
  totalSchoolDays: number
  previousMonthPercent?: number
}

export function AttendanceSummaryCard({
  present,
  absent,
  late,
  totalSchoolDays,
  previousMonthPercent,
}: AttendanceSummaryCardProps) {
  const total = present + absent + late
  const percent = totalSchoolDays > 0 ? Math.round((present / totalSchoolDays) * 100) : 0
  const trend = previousMonthPercent !== undefined ? percent - previousMonthPercent : 0

  const getColor = (pct: number) => {
    if (pct >= 90) return "text-emerald-500"
    if (pct >= 75) return "text-amber-500"
    return "text-red-500"
  }

  const getBgColor = (pct: number) => {
    if (pct >= 90) return "from-emerald-500/20 to-emerald-500/5"
    if (pct >= 75) return "from-amber-500/20 to-amber-500/5"
    return "from-red-500/20 to-red-500/5"
  }

  const getStrokeColor = (pct: number) => {
    if (pct >= 90) return "stroke-emerald-500"
    if (pct >= 75) return "stroke-amber-500"
    return "stroke-red-500"
  }

  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br p-6",
        getBgColor(percent)
      )}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Ring Chart */}
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted-foreground/15"
            />
            {/* Progress ring */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={getStrokeColor(percent)}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={cn("text-2xl font-bold", getColor(percent))}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
            >
              {percent}%
            </motion.span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Attendance</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Monthly Summary</h3>
            {trend !== 0 && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5",
                  trend > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                )}
              >
                {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend)}% vs last month
              </motion.span>
            )}
            {trend === 0 && previousMonthPercent !== undefined && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground rounded-full px-2 py-0.5 bg-muted/30">
                <Minus className="h-3 w-3" />No change
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-xl bg-emerald-500/10">
              <p className="text-lg font-bold text-emerald-600">{present}</p>
              <p className="text-[10px] text-muted-foreground">Present</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-red-500/10">
              <p className="text-lg font-bold text-red-600">{absent}</p>
              <p className="text-[10px] text-muted-foreground">Absent</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-amber-500/10">
              <p className="text-lg font-bold text-amber-600">{late}</p>
              <p className="text-[10px] text-muted-foreground">Late</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {totalSchoolDays > 0
              ? `${total} out of ${totalSchoolDays} school days recorded`
              : "No attendance data for this month"}
          </p>
        </div>
      </div>
    </motion.div>
  )
}