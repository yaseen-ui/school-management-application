"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { useCreateAttendanceSession, useUpdateAttendanceSession } from "@/hooks/use-attendance"
import { useSections } from "@/hooks/use-sections"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useUsers } from "@/hooks/use-users"
import { useTimetablePeriods } from "@/hooks/use-timetable-periods"
import { useTimetableStructures } from "@/hooks/use-timetable-structures"
import { useSectionSubjects } from "@/hooks/use-section-subjects"
import {
  ATTENDANCE_CONTEXT_TYPES,
  ATTENDANCE_SHIFTS,
  type AttendanceSession,
} from "@/lib/api/attendance"

const formSchema = z.object({
  academicYearId: z.string().min(1, "Academic year is required"),
  sectionId: z.string().min(1, "Section is required"),
  date: z.date({ required_error: "Date is required" }),
  contextType: z.string().default("regular"),
  contextName: z.string().optional(),
  periodId: z.string().optional(),
  sectionSubjectId: z.string().optional(),
  shift: z.string().optional(),
  takenById: z.string().optional(),
  notes: z.string().optional(),
})

interface CreateAttendanceSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session?: AttendanceSession | null
}

export function CreateAttendanceSessionDialog({
  open,
  onOpenChange,
  session,
}: CreateAttendanceSessionDialogProps) {
  const createSession = useCreateAttendanceSession()
  const updateSession = useUpdateAttendanceSession()
  const { data: sectionsData } = useSections()
  const { data: academicYearsData } = useAcademicYears()
  const { data: usersData } = useUsers()
  const { data: structuresData } = useTimetableStructures()
  const { data: sectionSubjectsData } = useSectionSubjects()

  const sections: any[] = ((sectionsData as any)?.data?.rows as any[]) || (sectionsData as unknown as any[]) || []
  const academicYears: any[] = ((academicYearsData as any)?.data?.rows as any[]) || (academicYearsData as unknown as any[]) || []
  const users: any[] = ((usersData as any)?.data?.rows as any[]) || (usersData as unknown as any[]) || []
  const structures: any[] = (structuresData as any[]) || []
  const sectionSubjects: any[] = (sectionSubjectsData as any[]) || []

  const [selectedSectionId, setSelectedSectionId] = useState<string>("")
  const [selectedStructureId, setSelectedStructureId] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      academicYearId: "",
      sectionId: "",
      date: new Date(),
      contextType: "regular",
      contextName: "",
      periodId: "",
      sectionSubjectId: "",
      shift: "",
      takenById: "",
      notes: "",
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (session) {
      form.reset({
        academicYearId: session.academicYearId,
        sectionId: session.sectionId,
        date: new Date(session.date),
        contextType: session.contextType,
        contextName: session.contextName || "",
        periodId: session.periodId || "",
        sectionSubjectId: session.sectionSubjectId || "",
        shift: session.shift || "",
        takenById: session.takenById || "",
        notes: session.notes || "",
      })
      setSelectedSectionId(session.sectionId)
    } else {
      form.reset({
        academicYearId: academicYears.find((y: any) => y.status === "active")?.id || "",
        sectionId: "",
        date: new Date(),
        contextType: "regular",
        contextName: "",
        periodId: "",
        sectionSubjectId: "",
        shift: "",
        takenById: "",
        notes: "",
      })
      setSelectedSectionId("")
    }
  }, [session, open, form, academicYears])

  // Get section's structure
  const selectedSection = sections.find((s: any) => s.id === selectedSectionId)
  const effectiveStructureId = selectedStructureId || selectedSection?.structureId || ""

  // Get periods for the section's structure
  const structureFilter = effectiveStructureId ? { structureId: effectiveStructureId } : undefined
  const { data: periodsData } = useTimetablePeriods(structureFilter)
  const periods: any[] = (periodsData || []).sort((a: any, b: any) => a.sortOrder - b.sortOrder)

  // Filter section subjects for the selected section
  const filteredSectionSubjects = sectionSubjects.filter(
    (ss: any) => ss.sectionId === selectedSectionId
  )

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      academicYearId: values.academicYearId,
      sectionId: values.sectionId,
      date: format(values.date, "yyyy-MM-dd"),
      contextType: values.contextType as any,
      contextName: values.contextName || undefined,
      periodId: values.periodId || undefined,
      sectionSubjectId: values.sectionSubjectId || undefined,
      shift: values.shift || undefined,
      takenById: values.takenById || undefined,
      notes: values.notes || undefined,
    }

    if (session) {
      await updateSession.mutateAsync({ id: session.id, data })
    } else {
      await createSession.mutateAsync(data)
    }

    onOpenChange(false)
  }

  const isSubmitting = createSession.isPending || updateSession.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{session ? "Edit Attendance Session" : "Create Attendance Session"}</DialogTitle>
          <DialogDescription>
            {session
              ? "Update the attendance session details"
              : "Create a new attendance session to mark student attendance"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="academicYearId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicYears.map((y: any) => (
                          <SelectItem key={y.id} value={y.id}>
                            {y.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedSectionId(value)
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sections.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.sectionName} {s.grade ? `(${s.grade.gradeName})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contextType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Context Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ATTENDANCE_CONTEXT_TYPES.map((ct) => (
                          <SelectItem key={ct.value} value={ct.value}>
                            {ct.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contextName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Context Name (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Midterm Exam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {effectiveStructureId && periods.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="periodId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period (optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {periods.map((p: any) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift (optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ATTENDANCE_SHIFTS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {selectedSectionId && filteredSectionSubjects.length > 0 && (
              <FormField
                control={form.control}
                name="sectionSubjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject (optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSectionSubjects.map((ss: any) => (
                          <SelectItem key={ss.id} value={ss.id}>
                            {ss.subject?.subjectName || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="takenById"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taken By (optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((u: any) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.fullName || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {session ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
