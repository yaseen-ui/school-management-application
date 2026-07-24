"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  Loader2,
  Send,
  CalendarIcon,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { useParentProfile, useLeaveCategories } from "@/hooks/use-parent-portal"
import { parentsApi } from "@/lib/api/parents"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const fractionOptions = [
  { value: "full_day", label: "Full Day" },
  { value: "first_half", label: "First Half" },
  { value: "second_half", label: "Second Half" },
]

export default function ApplyLeavePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: parent } = useParentProfile()
  const { data: categories, isLoading: catLoading } = useLeaveCategories()

  const students = parent?.students ?? []

  const [studentId, setStudentId] = useState("")
  const [leaveCategoryId, setLeaveCategoryId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startFraction, setStartFraction] = useState("full_day")
  const [endFraction, setEndFraction] = useState("full_day")
  const [reason, setReason] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submitMutation = useMutation({
    mutationFn: parentsApi.submitLeaveForChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-children-leave"] })
      toast.success("Leave request submitted successfully!")
      router.push("/parent-portal/leave")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit leave request.")
    },
  })

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!studentId) errs.studentId = "Please select a child"
    if (!leaveCategoryId) errs.leaveCategoryId = "Please select a leave type"
    if (!startDate) errs.startDate = "Start date is required"
    if (!endDate) errs.endDate = "End date is required"
    if (startDate && endDate && new Date(startDate) > new Date(endDate))
      errs.endDate = "End date must be after start date"
    if (!reason.trim()) errs.reason = "Reason is required"
    else if (reason.trim().length < 5) errs.reason = "Please provide at least 5 characters"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    submitMutation.mutate({
      studentId,
      leaveCategoryId,
      startDate,
      endDate,
      startFraction,
      endFraction,
      reason: reason.trim(),
    })
  }

  if (catLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="h-10 w-10 text-primary/60" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 md:pb-8 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Link
          href="/parent-portal/leave"
          className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Apply Leave</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Submit a leave request for your child</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 sm:p-6 space-y-5"
      >
        {/* Child selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Select Child
          </label>
          <div className="grid gap-2">
            {students.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => { setStudentId(student.id); setErrors((e) => ({ ...e, studentId: "" })) }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                  studentId === student.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/50 bg-muted/20 hover:border-border"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                  studentId === student.id
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{student.firstName} {student.lastName}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.gradeName}{student.sectionName ? ` · ${student.sectionName}` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {errors.studentId && (
            <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.studentId}</p>
          )}
        </div>

        {/* Leave type */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Leave Type</label>
          <select
            value={leaveCategoryId}
            onChange={(e) => { setLeaveCategoryId(e.target.value); setErrors((err) => ({ ...err, leaveCategoryId: "" })) }}
            className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Select leave type...</option>
            {(categories ?? []).filter((c: any) => c.applicantType === "student").map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.leaveCategoryId && (
            <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.leaveCategoryId}</p>
          )}
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setErrors((err) => ({ ...err, startDate: "" })) }}
              className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.startDate && (
              <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.startDate}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setErrors((err) => ({ ...err, endDate: "" })) }}
              className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.endDate && (
              <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Day fractions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Start Time</label>
            <select
              value={startFraction}
              onChange={(e) => setStartFraction(e.target.value)}
              className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {fractionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">End Time</label>
            <select
              value={endFraction}
              onChange={(e) => setEndFraction(e.target.value)}
              className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {fractionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); setErrors((err) => ({ ...err, reason: "" })) }}
            rows={3}
            placeholder="Explain the reason for leave..."
            className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          {errors.reason && (
            <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.reason}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          className="w-full rounded-2xl gradient-primary text-primary-foreground py-3.5 font-semibold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:shadow-primary/35 transition-shadow disabled:opacity-50"
        >
          {submitMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {submitMutation.isPending ? "Submitting..." : "Submit Leave Request"}
        </button>
      </motion.div>
    </div>
  )
}