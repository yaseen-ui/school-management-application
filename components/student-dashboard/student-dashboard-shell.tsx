"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { useStudentDashboard } from "@/hooks/use-student-dashboard"
import { ApiError } from "@/lib/api/client"
import { StudentHero } from "./student-hero"
import { ExamSelector } from "./exam-selector"
import { PerformancePanel } from "./performance-panel"
import { MarksTable } from "./marks-table"
import { AttendancePanel } from "./attendance-panel"
import { TeacherVoiceTimeline } from "./teacher-voice-timeline"
import { SecondaryStrip } from "./secondary-strip"
import { StudentDashboardSkeleton } from "./dashboard-skeletons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const reducedContainer = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
}

const reducedItem = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
}

interface StudentDashboardShellProps {
  enrollmentId: string
  from?: "parent" | "staff"
  /** When true, back link says "Children" and returns to parent launcher */
  showSwitchChild?: boolean
  backHref?: string
}

export function StudentDashboardShell({
  enrollmentId,
  from: fromProp,
  showSwitchChild = false,
  backHref: backHrefProp,
}: StudentDashboardShellProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const prefersReduced = useReducedMotion()

  const fromParam = searchParams.get("from")
  const from: "parent" | "staff" =
    fromProp ?? (fromParam === "staff" ? "staff" : "parent")

  const examFromUrl = searchParams.get("examScheduleId")
  const [localExamId, setLocalExamId] = useState<string | null>(null)
  const examScheduleId = localExamId ?? examFromUrl

  const { data, isLoading, isFetching, error, refetch } = useStudentDashboard(
    enrollmentId,
    examScheduleId
  )

  const backHref =
    backHrefProp ??
    (from === "parent" ? "/parent-portal" : "/students")

  const onExamChange = useCallback(
    (scheduleId: string) => {
      setLocalExamId(scheduleId)
      const params = new URLSearchParams(searchParams.toString())
      params.set("examScheduleId", scheduleId)
      if (!params.get("from")) params.set("from", from)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [from, pathname, router, searchParams]
  )

  const selectedScheduleId = useMemo(() => {
    if (examScheduleId) return examScheduleId
    return data?.selectedExam?.scheduleId ?? data?.exams?.[0]?.scheduleId ?? null
  }, [data, examScheduleId])

  const variants = prefersReduced
    ? { container: reducedContainer, item: reducedItem }
    : { container, item }

  if (isLoading && !data) {
    return <StudentDashboardSkeleton />
  }

  if (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message =
      error instanceof Error ? error.message : "Failed to load dashboard"

    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {status === 403
              ? "You can’t view this student"
              : status === 404
                ? "Student not found"
                : "Something went wrong"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">{message}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(backHref)}>
            Go back
          </Button>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return <StudentDashboardSkeleton />
  }

  return (
    <div className="space-y-6 pb-20 md:pb-10 relative">
      {isFetching && data && (
        <div className="absolute top-2 right-2 z-10" aria-live="polite">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      <StudentHero
        data={data}
        from={from}
        backHref={backHref}
        showSwitchChild={showSwitchChild || from === "parent"}
      />

      <motion.div
        key={selectedScheduleId ?? "none"}
        variants={variants.container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Exam scope */}
        <motion.div variants={variants.item}>
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-5">
              <ExamSelector
                exams={data.exams}
                value={selectedScheduleId}
                onChange={onExamChange}
                disabled={isFetching}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance USP */}
        <motion.div variants={variants.item}>
          <PerformancePanel
            selectedExam={data.selectedExam}
            progress={data.progress}
            trendDelta={data.trendDelta}
          />
        </motion.div>

        {/* Attendance + Teacher voice */}
        <motion.div
          variants={variants.item}
          className="grid gap-4 lg:grid-cols-2"
        >
          <AttendancePanel
            monthSummary={data.attendance.monthSummary}
            heatmap={data.attendance.heatmap}
            from={from}
          />
          <TeacherVoiceTimeline timeline={data.timeline} from={from} />
        </motion.div>

        {/* Marks table */}
        <motion.div variants={variants.item}>
          <MarksTable selectedExam={data.selectedExam} />
        </motion.div>

        {/* Secondary strip (parent only) */}
        <motion.div variants={variants.item}>
          <SecondaryStrip feesDue={data.secondary.feesDue} from={from} />
        </motion.div>
      </motion.div>
    </div>
  )
}
