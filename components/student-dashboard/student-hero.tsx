"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Users, GraduationCap, CalendarCheck } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { StudentDashboardData } from "@/lib/api/student-dashboard"

const statusStyles: Record<string, string> = {
  present: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  absent: "bg-red-500/15 text-red-700 dark:text-red-400",
  late: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  half_day: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  excused: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  leave: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
}

function formatStatus(status: string | null) {
  if (!status) return "Not marked"
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

interface StudentHeroProps {
  data: StudentDashboardData
  from: "parent" | "staff"
  backHref: string
  showSwitchChild?: boolean
}

export function StudentHero({ data, from, backHref, showSwitchChild }: StudentHeroProps) {
  const { student, enrollment, today } = data
  const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase()
  const att = today.attendanceStatus

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl gradient-primary p-5 sm:p-6 lg:p-8"
    >
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-white/8 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              {from === "parent" ? (showSwitchChild ? "Children" : "Back") : "Students"}
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-white text-xs font-medium border border-white/20">
            {from === "parent" ? <Users className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
            <span>{from === "parent" ? "Parent view" : "Staff view"}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-lg border border-white/20">
            <span className="text-xl sm:text-2xl font-bold text-white">{initials || "?"}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
              {student.fullName}
            </h1>
            <p className="text-white/75 text-sm mt-0.5 truncate">
              {[enrollment.gradeName, enrollment.sectionName && `Sec ${enrollment.sectionName}`, enrollment.rollNumber && `Roll ${enrollment.rollNumber}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {[enrollment.academicYearLabel, student.admissionNumber && `#${student.admissionNumber}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-white/15 text-white border border-white/20",
              att && statusStyles[att]
            )}
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            Today: {formatStatus(att)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
