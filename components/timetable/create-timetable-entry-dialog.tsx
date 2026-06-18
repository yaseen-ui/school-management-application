"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSubjectOfferings } from "@/hooks/use-subject-offerings"
import { useTeacherAssignments } from "@/hooks/use-teacher-assignments"
import { useTimetablePeriods } from "@/hooks/use-timetable-periods"
import { useCreateTimetableEntry, useUpdateTimetableEntry } from "@/hooks/use-timetable-entries"
import { DAYS_OF_WEEK, PERIOD_TYPE_LABELS } from "@/lib/api/timetable-periods"
import { toast } from "@/components/ui/sonner"
import type { TimetableEntry } from "@/lib/api/timetable-entries"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  teacherAssignmentId: z.string().optional(),
  room: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface CreateTimetableEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: TimetableEntry | null
  defaultSectionId?: string
  defaultAcademicYearId?: string
  defaultPeriodId?: string
  defaultDayOfWeek?: number
}

export function CreateTimetableEntryDialog({
  open,
  onOpenChange,
  entry,
  defaultSectionId,
  defaultAcademicYearId,
  defaultPeriodId,
  defaultDayOfWeek,
}: CreateTimetableEntryDialogProps) {
  const isEditing = !!entry
  const createEntry = useCreateTimetableEntry()
  const updateEntry = useUpdateTimetableEntry()

  const { data: subjectOfferingsData } = useSubjectOfferings()
  const { data: teacherAssignmentsData } = useTeacherAssignments()
  const { data: periodsData } = useTimetablePeriods()

  const subjectOfferings: any[] = (subjectOfferingsData as any[]) || []
  const teacherAssignments: any[] = (teacherAssignmentsData as any[]) || []
  const periods: any[] = (periodsData as any[]) || []

  const [selectedSubjectId, setSelectedSubjectId] = useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: "",
      teacherAssignmentId: "",
      room: "",
    },
  })

  // Find the selected period to determine its type
  const selectedPeriod = useMemo(() => {
    const periodId = entry?.periodId || defaultPeriodId || ""
    return periods.find((p: any) => p.id === periodId)
  }, [periods, entry, defaultPeriodId])

  const isClassType = selectedPeriod?.type === "class"

  // Get the day label for display
  const dayLabel = useMemo(() => {
    const day = entry?.dayOfWeek ?? defaultDayOfWeek ?? -1
    const found = DAYS_OF_WEEK.find((d) => d.value === day)
    return found?.label || ""
  }, [entry, defaultDayOfWeek])

  // Populate form when editing
  useEffect(() => {
    if (entry) {
      form.reset({
        subjectId: entry.sectionSubject?.subject?.id || "",
        teacherAssignmentId: entry.teacherAssignmentId || "",
        room: entry.room || "",
      })
      setSelectedSubjectId(entry.sectionSubject?.subject?.id || "")
    } else {
      form.reset({
        subjectId: "",
        teacherAssignmentId: "",
        room: "",
      })
      setSelectedSubjectId("")
    }
  }, [entry, form, open])

  // Filter subject offerings by selected section
  const filteredSubjectOfferings = defaultSectionId
    ? subjectOfferings.filter((so: any) =>
        so.sectionId === defaultSectionId ||
        so.grade?.sections?.some((s: any) => s.id === defaultSectionId)
      )
    : subjectOfferings

  // Filter teacher assignments by selected section and subject
  const filteredTeacherAssignments = defaultSectionId && selectedSubjectId
    ? teacherAssignments.filter((ta: any) =>
        ta.sectionSubject?.section?.id === defaultSectionId &&
        ta.sectionSubject?.subject?.id === selectedSubjectId
      )
    : teacherAssignments

  const onSubmit = async (data: FormData) => {
    try {
      const periodId = entry?.periodId || defaultPeriodId || ""
      const dayOfWeek = entry?.dayOfWeek ?? defaultDayOfWeek ?? 0
      const academicYearId = entry?.academicYearId || defaultAcademicYearId || ""

      if (!periodId || !academicYearId || !defaultSectionId) {
        toast.error("Missing required context (period, academic year, or section)")
        return
      }

      const payload: any = {
        academicYearId,
        dayOfWeek,
        periodId,
        sectionSubjectId: "",
        teacherAssignmentId: data.teacherAssignmentId === "none" ? null : data.teacherAssignmentId || null,
        room: data.room || null,
      }

      // Find the sectionSubjectId from subject offerings
      const offering = subjectOfferings.find(
        (so: any) =>
          (so.sectionId === defaultSectionId || so.grade?.sections?.some((s: any) => s.id === defaultSectionId)) &&
          so.subjectId === data.subjectId
      )

      if (!offering) {
        // Try to find from teacher assignments
        const assignment = teacherAssignments.find(
          (ta: any) =>
            ta.sectionSubject?.section?.id === defaultSectionId &&
            ta.sectionSubject?.subject?.id === data.subjectId
        )
        if (assignment?.sectionSubjectId) {
          payload.sectionSubjectId = assignment.sectionSubjectId
        } else {
          toast.error("No section-subject mapping found for this section and subject combination")
          return
        }
      } else {
        payload.sectionSubjectId = offering.id
      }

      if (isEditing && entry) {
        await updateEntry.mutateAsync({ id: entry.id, data: payload })
        toast.success("Timetable entry updated successfully")
      } else {
        await createEntry.mutateAsync(payload)
        toast.success("Timetable entry created successfully")
      }
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save timetable entry")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Timetable Entry" : "Add Timetable Entry"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the subject, teacher, or room for this period"
              : "Assign a subject and teacher to this period"}
          </DialogDescription>
        </DialogHeader>

        {/* Context summary */}
        <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Day:</span>
            <span className="font-medium">{dayLabel}</span>
          </div>
          {selectedPeriod && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium">{selectedPeriod.name}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto">
                {PERIOD_TYPE_LABELS[selectedPeriod.type as keyof typeof PERIOD_TYPE_LABELS] || selectedPeriod.type}
              </Badge>
            </div>
          )}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isClassType ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="subjectId">Subject</Label>
                <Select
                  value={selectedSubjectId}
                  onValueChange={(v) => {
                    setSelectedSubjectId(v)
                    form.setValue("subjectId", v)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubjectOfferings.map((so: any) => (
                      <SelectItem key={so.id} value={so.subjectId || so.subject?.id}>
                        {so.subject?.subjectName || so.subjectName || "Unknown Subject"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.subjectId && (
                  <p className="text-sm text-destructive">{form.formState.errors.subjectId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherAssignmentId">Teacher (Optional)</Label>
                <Select
                  value={form.watch("teacherAssignmentId")}
                  onValueChange={(v) => form.setValue("teacherAssignmentId", v)}
                  disabled={!selectedSubjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedSubjectId
                        ? "Select subject first"
                        : "Select teacher (optional)"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No teacher assigned</SelectItem>
                    {filteredTeacherAssignments.map((ta: any) => (
                      <SelectItem key={ta.id} value={ta.id}>
                        {ta.teacher?.fullName || "Unknown Teacher"}
                        {ta.role ? ` (${ta.role})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              This is a <strong>{PERIOD_TYPE_LABELS[selectedPeriod?.type as keyof typeof PERIOD_TYPE_LABELS] || selectedPeriod?.type}</strong> period.
              No subject or teacher assignment needed.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="room">Room (Optional)</Label>
            <Input
              id="room"
              placeholder="e.g., Room 101, Lab A"
              {...form.register("room")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {isClassType && (
              <Button type="submit" disabled={createEntry.isPending || updateEntry.isPending}>
                {isEditing ? "Update" : "Create"}
              </Button>
            )}
            {!isClassType && (
              <Button type="submit" disabled={createEntry.isPending || updateEntry.isPending}>
                {isEditing ? "Update" : "Save Room"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
