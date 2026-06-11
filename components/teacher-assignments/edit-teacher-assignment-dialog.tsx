"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateTeacherAssignment } from "@/hooks/use-teacher-assignments"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { Loader2 } from "lucide-react"
import type { TeacherAssignment } from "@/lib/api/teacher-assignments"

interface EditTeacherAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: TeacherAssignment | null
}

interface FormData {
  academicYearId: string
  role: string
}

export function EditTeacherAssignmentDialog({ open, onOpenChange, assignment }: EditTeacherAssignmentDialogProps) {
  const {
    handleSubmit,
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      academicYearId: assignment?.academicYearId || "",
      role: assignment?.role || "subject_teacher",
    },
  })
  const updateAssignment = useUpdateTeacherAssignment()
  const { data: academicYearsData } = useAcademicYears()

  const academicYears = academicYearsData?.data?.rows || []

  const onSubmit = async (data: FormData) => {
    if (!assignment) return
    await updateAssignment.mutateAsync({
      id: assignment.id,
      data: {
        academicYearId: data.academicYearId,
        role: data.role as any,
      },
    })
    onOpenChange(false)
  }

  if (!assignment) return null

  const roleLabels: Record<string, string> = {
    subject_teacher: "Subject Teacher",
    class_teacher: "Class Teacher",
    assistant_teacher: "Assistant Teacher",
    lab_incharge: "Lab Incharge",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher Assignment</DialogTitle>
          <DialogDescription>
            Update assignment for {assignment.teacher?.fullName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Teacher</Label>
            <p className="text-sm font-medium">{assignment.teacher?.fullName}</p>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <p className="text-sm font-medium">{assignment.sectionSubject?.subject?.subjectName}</p>
          </div>

          <div className="space-y-2">
            <Label>Section</Label>
            <p className="text-sm font-medium">{assignment.sectionSubject?.section?.sectionName}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYearId">Academic Year</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
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
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateAssignment.isPending}>
              {updateAssignment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Assignment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
