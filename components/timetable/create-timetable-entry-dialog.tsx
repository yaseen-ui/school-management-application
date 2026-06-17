"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useSections } from "@/hooks/use-sections"
import { useSubjectOfferings } from "@/hooks/use-subject-offerings"
import { useTeacherAssignments } from "@/hooks/use-teacher-assignments"
import { useTimetablePeriods } from "@/hooks/use-timetable-periods"
import { useTimetableStructures } from "@/hooks/use-timetable-structures"
import { useCreateTimetableEntry, useUpdateTimetableEntry } from "@/hooks/use-timetable-entries"
import { DAYS_OF_WEEK } from "@/lib/api/timetable-periods"
import { toast } from "@/components/ui/sonner"
import type { TimetableEntry } from "@/lib/api/timetable-entries"

const formSchema = z.object({
  academicYearId: z.string().min(1, "Academic year is required"),
  dayOfWeek: z.string().min(1, "Day is required"),
  structureId: z.string().min(1, "Timetable structure is required"),
  periodId: z.string().min(1, "Period is required"),
  sectionId: z.string().min(1, "Section is required"),
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
}

export function CreateTimetableEntryDialog({
  open,
  onOpenChange,
  entry,
  defaultSectionId,
  defaultAcademicYearId,
}: CreateTimetableEntryDialogProps) {
  const isEditing = !!entry
  const createEntry = useCreateTimetableEntry()
  const updateEntry = useUpdateTimetableEntry()

  const { data: academicYearsData } = useAcademicYears()
  const { data: sectionsData } = useSections()
  const { data: structuresData } = useTimetableStructures()
  const { data: subjectOfferingsData } = useSubjectOfferings()
  const { data: teacherAssignmentsData } = useTeacherAssignments()
  const { data: periodsData } = useTimetablePeriods()

  const academicYears: any[] = ((academicYearsData as any)?.data?.rows as any[]) || (academicYearsData as unknown as any[]) || []
  const sections: any[] = ((sectionsData as any)?.data?.rows as any[]) || (sectionsData as unknown as any[]) || []
  const structures: any[] = (structuresData as any[]) || []
  const subjectOfferings: any[] = (subjectOfferingsData as any[]) || []
  const teacherAssignments: any[] = (teacherAssignmentsData as any[]) || []
  const periods: any[] = (periodsData as any[]) || []


  const [selectedStructureId, setSelectedStructureId] = useState("")
  const [selectedSectionId, setSelectedSectionId] = useState("")
  const [selectedSubjectId, setSelectedSubjectId] = useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      academicYearId: defaultAcademicYearId || "",
      dayOfWeek: "",
      structureId: "",
      periodId: "",
      sectionId: defaultSectionId || "",
      subjectId: "",
      teacherAssignmentId: "",
      room: "",
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (entry) {
      form.reset({
        academicYearId: entry.academicYearId,
        dayOfWeek: String(entry.dayOfWeek),
        structureId: entry.period?.id ? "" : "",
        periodId: entry.periodId,
        sectionId: entry.sectionSubject?.section?.id || "",
        subjectId: entry.sectionSubject?.subject?.id || "",
        teacherAssignmentId: entry.teacherAssignmentId || "",
        room: entry.room || "",
      })
      setSelectedSectionId(entry.sectionSubject?.section?.id || "")
      setSelectedSubjectId(entry.sectionSubject?.subject?.id || "")
    } else {
      form.reset({
        academicYearId: defaultAcademicYearId || "",
        dayOfWeek: "",
        structureId: "",
        periodId: "",
        sectionId: defaultSectionId || "",
        subjectId: "",
        teacherAssignmentId: "",
        room: "",
      })
      setSelectedSectionId(defaultSectionId || "")
      setSelectedSubjectId("")
    }
  }, [entry, form, defaultAcademicYearId, defaultSectionId, open])

  // Filter periods by selected structure
  const filteredPeriods = selectedStructureId
    ? periods.filter((p: any) => p.structureId === selectedStructureId)
    : periods

  // Filter subject offerings by selected section
  const filteredSubjectOfferings = selectedSectionId
    ? subjectOfferings.filter((so: any) => so.sectionId === selectedSectionId || so.grade?.sections?.some((s: any) => s.id === selectedSectionId))
    : subjectOfferings

  // Filter teacher assignments by selected section and subject
  const filteredTeacherAssignments = selectedSectionId && selectedSubjectId
    ? teacherAssignments.filter((ta: any) =>
        ta.sectionSubject?.section?.id === selectedSectionId &&
        ta.sectionSubject?.subject?.id === selectedSubjectId
      )
    : teacherAssignments

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        academicYearId: data.academicYearId,
        dayOfWeek: parseInt(data.dayOfWeek),
        periodId: data.periodId,
        sectionSubjectId: "", // Will be resolved from section + subject
        teacherAssignmentId: data.teacherAssignmentId || null,
        room: data.room || null,
      }

      // Find the sectionSubjectId from subject offerings
      const offering = subjectOfferings.find(
        (so: any) =>
          (so.sectionId === data.sectionId || so.grade?.sections?.some((s: any) => s.id === data.sectionId)) &&
          so.subjectId === data.subjectId
      )

      if (!offering) {
        // Try to find from teacher assignments
        const assignment = teacherAssignments.find(
          (ta: any) =>
            ta.sectionSubject?.section?.id === data.sectionId &&
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Timetable Entry" : "Add Timetable Entry"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the timetable entry details"
              : "Assign a subject and teacher to a period for a specific day"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="academicYearId">Academic Year</Label>
            <Select
              value={form.watch("academicYearId")}
              onValueChange={(v) => form.setValue("academicYearId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((y: any) => (
                  <SelectItem key={y.id} value={y.id}>
                    {y.name} {y.status === "active" ? "(Active)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.academicYearId && (
              <p className="text-sm text-destructive">{form.formState.errors.academicYearId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Day</Label>
            <Select
              value={form.watch("dayOfWeek")}
              onValueChange={(v) => form.setValue("dayOfWeek", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={String(day.value)}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.dayOfWeek && (
              <p className="text-sm text-destructive">{form.formState.errors.dayOfWeek.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="structureId">Timetable Structure</Label>
            <Select
              value={selectedStructureId}
              onValueChange={(v) => {
                setSelectedStructureId(v)
                form.setValue("structureId", v)
                form.setValue("periodId", "")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select structure" />
              </SelectTrigger>
              <SelectContent>
                {structures.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodId">Period</Label>
            <Select
              value={form.watch("periodId")}
              onValueChange={(v) => form.setValue("periodId", v)}
              disabled={!selectedStructureId}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedStructureId ? "Select period" : "Select structure first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredPeriods
                  .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                  .map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.startTime && p.endTime ? `${p.startTime}-${p.endTime}` : ""})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {form.formState.errors.periodId && (
              <p className="text-sm text-destructive">{form.formState.errors.periodId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectionId">Section</Label>
            <Select
              value={selectedSectionId}
              onValueChange={(v) => {
                setSelectedSectionId(v)
                form.setValue("sectionId", v)
                setSelectedSubjectId("")
                form.setValue("subjectId", "")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.grade?.gradeName ? `${s.grade.gradeName} - ` : ""}{s.sectionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.sectionId && (
              <p className="text-sm text-destructive">{form.formState.errors.sectionId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectId">Subject</Label>
            <Select
              value={selectedSubjectId}
              onValueChange={(v) => {
                setSelectedSubjectId(v)
                form.setValue("subjectId", v)
              }}
              disabled={!selectedSectionId}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedSectionId ? "Select subject" : "Select section first"} />
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
              disabled={!selectedSectionId || !selectedSubjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedSectionId || !selectedSubjectId
                    ? "Select section and subject first"
                    : "Select teacher (optional)"
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No teacher assigned</SelectItem>
                {filteredTeacherAssignments.map((ta: any) => (
                  <SelectItem key={ta.id} value={ta.id}>
                    {ta.teacher?.fullName || "Unknown Teacher"}
                    {ta.role ? ` (${ta.role})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Button type="submit" disabled={createEntry.isPending || updateEntry.isPending}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
