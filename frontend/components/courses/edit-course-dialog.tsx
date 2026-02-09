"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateCourse } from "@/hooks/use-courses"
import type { Course } from "@/lib/api/courses"

interface FormData {
  courseName: string
  description: string
}

interface EditCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
}

export function EditCourseDialog({ open, onOpenChange, course }: EditCourseDialogProps) {
  const { mutate: updateCourse, isPending } = useUpdateCourse()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    if (course && open) {
      reset({
        courseName: course.courseName,
        description: course.description,
      })
    }
  }, [course, open, reset])

  const onSubmit = (data: FormData) => {
    if (!course) return

    updateCourse(
      { id: course.id, data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Update course information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="courseName">
                Course Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="courseName"
                placeholder="e.g. Mathematics, Science, English"
                {...register("courseName", { required: "Course name is required" })}
              />
              {errors.courseName && <p className="text-sm text-destructive">{errors.courseName.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of the course..."
                rows={4}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
