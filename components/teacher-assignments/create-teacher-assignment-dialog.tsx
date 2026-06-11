"use client"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateTeacherAssignment, useEligibleTeachers } from "@/hooks/use-teacher-assignments"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useSections } from "@/hooks/use-sections"
import { useSubjects } from "@/hooks/use-subjects"
import { Loader2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CreateTeacherAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  academicYearId: string
  sectionId: string
  subjectId: string
  teacherId: string
  role: string
  overrideCapabilityCheck: boolean
}

export function CreateTeacherAssignmentDialog({ open, onOpenChange }: CreateTeacherAssignmentDialogProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      role: "subject_teacher",
      overrideCapabilityCheck: false,
    },
  })
  const createAssignment = useCreateTeacherAssignment()
  const { data: academicYearsData } = useAcademicYears()
  const { data: sectionsData } = useSections()
  const { data: subjectsData } = useSubjects()

  const selectedSectionId = watch("sectionId")
  const selectedSubjectId = watch("subjectId")
  const selectedRole = watch("role")

  // Build sectionSubjectId from selected section + subject
  const sectionSubjectId = selectedSectionId && selectedSubjectId ? `${selectedSectionId}_${selectedSubjectId}` : null

  const { data: eligibleTeachers, isLoading: loadingEligible } = useEligibleTeachers(
    sectionSubjectId,
    selectedRole,
  )

  const academicYears = academicYearsData?.data?.rows || []
  const sections = sectionsData?.data?.rows || []
  const subjects = subjectsData || []

  const onSubmit = async (data: FormData) => {
    await createAssignment.mutateAsync({
      data: {
        academicYearId: data.academicYearId,
        teacherId: data.teacherId,
        sectionSubjectId: sectionSubjectId || "",
        role: data.role as any,
      },
      overrideCapabilityCheck: data.overrideCapabilityCheck,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Teacher Assignment</DialogTitle>
          <DialogDescription>Assign a teacher to a subject and section for an academic year</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="academicYearId">Academic Year *</Label>
            <Controller
              name="academicYearId"
              control={control}
              rules={{ required: "Academic year is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year: any) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.year || year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.academicYearId && <p className="text-sm text-destructive">{errors.academicYearId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sectionId">Section *</Label>
              <Controller
                name="sectionId"
                control={control}
                rules={{ required: "Section is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section: any) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.sectionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sectionId && <p className="text-sm text-destructive">{errors.sectionId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectId">Subject *</Label>
              <Controller
                name="subjectId"
                control={control}
                rules={{ required: "Subject is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subjectId && <p className="text-sm text-destructive">{errors.subjectId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subject_teacher">Subject Teacher</SelectItem>
                    <SelectItem value="class_teacher">Class Teacher</SelectItem>
                    <SelectItem value="assistant_teacher">Assistant Teacher</SelectItem>
                    <SelectItem value="lab_incharge">Lab Incharge</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {sectionSubjectId && (
            <div className="space-y-2">
              <Label>Eligible Teachers</Label>
              <Controller
                name="teacherId"
                control={control}
                rules={{ required: "Teacher is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingEligible ? "Loading..." : "Select a teacher"} />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleTeachers?.map((teacher: any) => (
                        <SelectItem key={teacher.teacherId} value={teacher.teacherId}>
                          <div className="flex items-center justify-between w-full gap-2">
                            <span>{teacher.fullName}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {teacher.expertiseLevel}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                      {(!eligibleTeachers || eligibleTeachers.length === 0) && !loadingEligible && (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                          No eligible teachers found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.teacherId && <p className="text-sm text-destructive">{errors.teacherId.message}</p>}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Controller
              name="overrideCapabilityCheck"
              control={control}
              render={({ field }) => (
                <Checkbox id="overrideCapabilityCheck" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="overrideCapabilityCheck" className="text-sm font-normal cursor-pointer flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              Override capability check (assign any teacher)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAssignment.isPending}>
              {createAssignment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Assignment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
