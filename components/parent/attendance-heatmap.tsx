"use client"

import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface DayRecord {
  date: string
  status: string
}

interface AttendanceHeatmapProps {
  records: DayRecord[]
  month: number
  year: number
}

const statusColors: Record<string, string> = {
  present: "bg-emerald-500",
  absent: "bg-red-500",
  late: "bg-amber-400",
}

const statusLabels: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
}

export function AttendanceHeatmap({ records, month, year }: AttendanceHeatmapProps) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay() // 0 = Sunday

  const recordMap = new Map<string, string>()
  records.forEach((r) => {
    recordMap.set(r.date, r.status)
  })

  // Build grid: array of { day, date, status }
  const days: { day: number | null; date: string | null; status: string | null }[] = []

  // Empty cells before the first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ day: null, date: null, status: null })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    const status = recordMap.get(dateStr) ?? null
    days.push({ day: d, date: dateStr, status })
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const presentCount = records.filter((r) => r.status === "present").length
  const absentCount = records.filter((r) => r.status === "absent").length
  const lateCount = records.filter((r) => r.status === "late").length
  const totalSchoolDays = records.length

  return (
    <div className="space-y-6">
      {/* Legend & Stats */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-emerald-500" />
          <span className="text-xs text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-red-500" />
          <span className="text-xs text-muted-foreground">Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-amber-400" />
          <span className="text-xs text-muted-foreground">Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-dashed border-muted-foreground/30 bg-transparent" />
          <span className="text-xs text-muted-foreground">No School / No Data</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 text-center">
          <p className="text-lg font-bold text-emerald-600">{presentCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Present</p>
        </div>
        <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-3 text-center">
          <p className="text-lg font-bold text-red-600">{absentCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Absent</p>
        </div>
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 text-center">
          <p className="text-lg font-bold text-amber-600">{lateCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Late</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:p-5">
        {/* Week day headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((wd) => (
            <div key={wd} className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider py-1">
              {wd}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          <TooltipProvider delayDuration={200}>
            {days.map((d, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.015, duration: 0.2 }}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200",
                      d.day === null
                        ? "bg-transparent"
                        : d.status
                          ? `${statusColors[d.status]} text-white shadow-sm`
                          : "bg-muted/40 text-muted-foreground/50",
                      d.date === todayStr && d.status
                        ? "ring-2 ring-offset-1 ring-offset-background ring-primary"
                        : "",
                      d.date === todayStr && !d.status
                        ? "border border-dashed border-muted-foreground/30"
                        : "",
                      d.day !== null && !d.status && "hover:bg-muted/60"
                    )}
                  >
                    {d.day}
                  </motion.div>
                </TooltipTrigger>
                {d.day !== null && d.date && (
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-medium">{d.date}</p>
                    <p className={cn("capitalize", d.status === "present" && "text-emerald-400", d.status === "absent" && "text-red-400", d.status === "late" && "text-amber-400", !d.status && "text-muted-foreground")}>
                      {d.status ? statusLabels[d.status] : "No record"}
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}