"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useUpdateSubjectOffering } from "@/hooks/use-subject-offerings"
import { useSubjects } from "@/hooks/use-subjects"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { Loader2 } from "lucide-react"
import type { SubjectOffering } from "@/lib/api/subject-offerings"

interface EditSubjectOfferingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offering: SubjectOffering | null
}

interface FormData {
  scope: string
  isElective: boolean
  weeklyPeriods: number
  status: string
}

export function EditSubjectOfferingDialog({ open, onOpenChange, offering }: EditSubjectOfferingDialogProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      scope: offering?.scope || "course_grade",
      isElective: offering?.isElective || false,
      weeklyPeriods: offering?.weeklyPeriods || 0,
      status: offering?.status || "active",
    },
  })
  const updateOffering = useUpdateSubjectOffering()

  const onSubmit = async (data: FormData) => {
    if (!offering) return
    await updateOffering.mutateAsync({
      id: offering.id,
      data: {
        scope: data.scope as any,
        isElective: data.isElective,
        weeklyPeriods: data.weeklyPeriods || null,
        status: data.status as any,
      },
    })
    onOpenChange(false)
  }

  if (!offering) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Subject Offering</DialogTitle>
          <DialogDescription>
            Update offering for {offering.subject?.subjectName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Subject</Label>
            <p className="text-sm font-medium">{offering.subject?.subjectName}</p>
          </div>

          <div className="space-y-2">
            <Label>Course / Grade</Label>
            <p className="text-sm text-muted-foreground">
              {offering.course?.courseName || "All Courses"} - {offering.grade?.gradeName || "All Grades"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope">Scope *</Label>
            <Controller
              name="scope"
              control={control}
              rules={{ required: "Scope is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_courses_all_grades">All Courses & All Grades</SelectItem>
                    <SelectItem value="course_all_grades">Specific Course - All Grades</SelectItem>
                    <SelectItem value="grade_all_courses">Specific Grade - All Courses</SelectItem>
                    <SelectItem value="course_grade">Specific Course & Grade</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklyPeriods">Weekly Periods</Label>
            <Controller
              name="weeklyPeriods"
              control={control}
              render={({ field }) => (
                <Input
                  id="weeklyPeriods"
                  type="number"
                  min={0}
                  placeholder="e.g., 5"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isElective"
              control={control}
              render={({ field }) => <Checkbox id="isElective" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isElective" className="text-sm font-normal cursor-pointer">
              This is an elective subject
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateOffering.isPending}>
              {updateOffering.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Offering
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
