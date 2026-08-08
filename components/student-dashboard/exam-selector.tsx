"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DashboardExamOption } from "@/lib/api/student-dashboard"

interface ExamSelectorProps {
  exams: DashboardExamOption[]
  value: string | null
  onChange: (scheduleId: string) => void
  disabled?: boolean
}

export function ExamSelector({ exams, value, onChange, disabled }: ExamSelectorProps) {
  if (!exams.length) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        No released exam results yet
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
        Exam
      </span>
      <Select
        value={value ?? undefined}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full sm:w-[280px] rounded-xl bg-card">
          <SelectValue placeholder="Select exam" />
        </SelectTrigger>
        <SelectContent>
          {exams.map((exam) => (
            <SelectItem key={exam.scheduleId} value={exam.scheduleId}>
              <span className="flex items-center gap-2">
                {exam.name}
                {exam.isCustom && (
                  <span className="text-[10px] font-medium text-muted-foreground">Custom</span>
                )}
                {exam.isLatest && (
                  <span className="text-[10px] font-medium text-primary">Latest</span>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
