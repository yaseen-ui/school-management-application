"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CalendarCheck, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { AttendanceMonthSummary, HeatmapDay } from "@/lib/api/student-dashboard"

const statusColors: Record<string, string> = {
  present: "bg-emerald-500",
  absent: "bg-red-500",
  late: "bg-amber-400",
  half_day: "bg-orange-400",
  excused: "bg-sky-400",
  leave: "bg-violet-400",
}

interface AttendancePanelProps {
  monthSummary: AttendanceMonthSummary
  heatmap: HeatmapDay[]
  from: "parent" | "staff"
}

export function AttendancePanel({ monthSummary, heatmap, from }: AttendancePanelProps) {
  const pct = monthSummary.percentage
  const ringPct = pct != null ? Math.min(100, Math.max(0, pct)) : 0
  // last 42 days for compact grid
  const recent = heatmap.slice(-42)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-emerald-600" />
          Attendance
        </CardTitle>
        {from === "parent" && (
          <Link
            href="/parent-portal/attendance"
            className="text-xs font-medium text-primary inline-flex items-center hover:underline"
          >
            Full calendar <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-5">
          {/* Ring */}
          <div className="relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <path
                className="text-muted/40"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-emerald-500"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${ringPct}, 100` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-foreground">
                {pct != null ? `${Math.round(pct)}%` : "—"}
              </span>
              <span className="text-[10px] text-muted-foreground">this month</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1 text-sm">
            <Stat label="Present" value={monthSummary.present} color="text-emerald-600" />
            <Stat label="Absent" value={monthSummary.absent} color="text-red-600" />
            <Stat label="Late" value={monthSummary.late} color="text-amber-600" />
            <Stat label="Leave" value={monthSummary.leave + monthSummary.excused} color="text-violet-600" />
          </div>
        </div>

        {/* Mini heatmap */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Recent days</p>
          {recent.length === 0 ? (
            <p className="text-xs text-muted-foreground">No attendance recorded yet.</p>
          ) : (
            <TooltipProvider delayDuration={150}>
              <div className="flex flex-wrap gap-1">
                {recent.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <span
                        className={cn(
                          "h-3 w-3 rounded-sm",
                          statusColors[day.status] ?? "bg-muted"
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {day.date}: {day.status.replace(/_/g, " ")}
                      {day.remarks ? ` — ${day.remarks}` : ""}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          )}
          <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-muted-foreground">
            <LegendDot color="bg-emerald-500" label="Present" />
            <LegendDot color="bg-red-500" label="Absent" />
            <LegendDot color="bg-amber-400" label="Late" />
            <LegendDot color="bg-violet-400" label="Leave" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div>
      <p className={cn("text-lg font-bold", color)}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("h-2 w-2 rounded-sm", color)} />
      {label}
    </span>
  )
}
