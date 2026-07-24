"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
} from "lucide-react"
import { useParentProfile, useChildrenAttendance, type ChildAttendance } from "@/hooks/use-parent-portal"
import { AttendanceHeatmap } from "@/components/parent/attendance-heatmap"
import { AttendanceSummaryCard } from "@/components/parent/attendance-summary-card"
import { cn } from "@/lib/utils"

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export default function AttendancePage() {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedChildIndex, setSelectedChildIndex] = useState(0)

  const { data: parent, isLoading: profileLoading } = useParentProfile()
  const { data: attendance, isLoading: attendanceLoading } = useChildrenAttendance(selectedMonth, selectedYear)

  const students = parent?.students ?? []
  const selectedChild = attendance?.[selectedChildIndex] ?? null

  // Month navigation
  const goPrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12)
      setSelectedYear((y) => y - 1)
    } else {
      setSelectedMonth((m) => m - 1)
    }
  }

  const goNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1)
      setSelectedYear((y) => y + 1)
    } else {
      setSelectedMonth((m) => m + 1)
    }
  }

  const isCurrentMonth = selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear()

  const isLoading = profileLoading || attendanceLoading

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/parent-portal"
            className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monthly attendance tracking</p>
          </div>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={goPrevMonth}
            className="h-9 w-9 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-[140px] text-center">
            <p className="text-sm font-semibold text-foreground">{monthNames[selectedMonth - 1]}</p>
            <p className="text-xs text-muted-foreground">{selectedYear}</p>
          </div>
          <button
            onClick={goNextMonth}
            disabled={isCurrentMonth}
            className={cn(
              "h-9 w-9 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-center transition-colors",
              isCurrentMonth ? "opacity-30 cursor-not-allowed" : "hover:bg-muted"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {isCurrentMonth && (
            <span className="text-[10px] font-medium text-primary bg-primary/5 rounded-full px-2 py-0.5">
              Current
            </span>
          )}
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="h-10 w-10 text-primary/60" />
          </motion.div>
        </div>
      ) : !attendance || attendance.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <CalendarCheck className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Attendance Data</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No attendance records found for this month. Data may not have been entered yet.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Child selector tabs - only show if multiple children */}
          {attendance.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {attendance.map((child: ChildAttendance, index: number) => (
                <button
                  key={child.studentId}
                  onClick={() => setSelectedChildIndex(index)}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedChildIndex === index
                      ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {child.studentName.split(" ")[0]}
                  {child.gradeName ? ` · ${child.gradeName}` : ""}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedChild && (
              <motion.div
                key={selectedChild.studentId + selectedMonth + selectedYear}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Child info banner */}
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-white">
                        {selectedChild.studentName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{selectedChild.studentName}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedChild.gradeName}
                        {selectedChild.sectionName ? ` · ${selectedChild.sectionName}` : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <AttendanceSummaryCard
                  present={selectedChild.summary.present}
                  absent={selectedChild.summary.absent}
                  late={selectedChild.summary.late}
                  totalSchoolDays={selectedChild.records.length}
                />

                {/* Heatmap Calendar */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Daily View
                    </h3>
                  </div>
                  <AttendanceHeatmap
                    records={selectedChild.records}
                    month={selectedMonth}
                    year={selectedYear}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}