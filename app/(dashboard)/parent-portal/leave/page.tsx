"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CalendarClock,
  Loader2,
  Plus,
  FileText,
  Clock,
  Info,
} from "lucide-react"
import { useParentProfile, useChildrenLeave, type ChildLeaveRequest } from "@/hooks/use-parent-portal"
import { LeaveStatusBadge } from "@/components/parent/leave-status-badge"
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const statusTabOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const fractionLabels: Record<string, string> = {
  full_day: "Full Day",
  first_half: "First Half",
  second_half: "Second Half",
}

export default function LeavePage() {
  const router = useRouter()
  const { data: parent } = useParentProfile()
  const { data: leaveRequests, isLoading } = useChildrenLeave()
  const [statusFilter, setStatusFilter] = useState("all")

  const students = parent?.students ?? []
  const filteredRequests = (leaveRequests ?? []).filter((r) =>
    statusFilter === "all" ? true : r.status === statusFilter
  )

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
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/parent-portal"
            className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leave</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track & apply for leave</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/parent-portal/leave/apply")}
          className="shrink-0 h-10 px-4 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Apply Leave</span>
        </button>
      </motion.div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {statusTabOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              statusFilter === opt.value
                ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredRequests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Leave Requests</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            {statusFilter === "all"
              ? "No leave requests have been submitted yet. Tap the button to apply."
              : `No ${statusFilter} leave requests found.`}
          </p>
          <button
            onClick={() => router.push("/parent-portal/leave/apply")}
            className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Apply Leave
          </button>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {filteredRequests.map((request: ChildLeaveRequest) => (
            <motion.div
              key={request.id}
              variants={item}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:p-5 space-y-3"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate">
                    {request.studentName}
                    {request.gradeName ? ` · ${request.gradeName}` : ""}
                    {request.sectionName ? ` ${request.sectionName}` : ""}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {request.leaveCategoryName}
                  </p>
                </div>
                <LeaveStatusBadge status={request.status} />
              </div>

              {/* Date & duration */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-muted/30 p-2">
                  <p className="text-muted-foreground">From</p>
                  <p className="font-medium text-foreground">
                    {new Date(request.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {" · "}
                    {fractionLabels[request.startFraction] || request.startFraction}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/30 p-2">
                  <p className="text-muted-foreground">To</p>
                  <p className="font-medium text-foreground">
                    {new Date(request.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {" · "}
                    {fractionLabels[request.endFraction] || request.endFraction}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/30 p-2">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{request.calculatedDays} day(s)</p>
                </div>
              </div>

              {/* Reason */}
              <div className="flex items-start gap-2 text-xs">
                <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-muted-foreground line-clamp-2">{request.reason}</p>
              </div>

              {/* Approval chain */}
              {request.approvals && request.approvals.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div className="flex items-center gap-1 flex-wrap">
                    {request.approvals.map((step, i) => (
                      <span
                        key={step.id}
                        className={cn(
                          "text-[10px] rounded-full px-2 py-0.5 font-medium border",
                          step.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : step.status === "rejected"
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : "bg-muted/40 text-muted-foreground border-border/30"
                        )}
                      >
                        L{step.level}: {step.status}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Created date */}
              <p className="text-[10px] text-muted-foreground/60">
                Applied on {new Date(request.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}