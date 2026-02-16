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
import { useCreateCourse } from "@/hooks/use-courses"

interface FormData {
  courseName: string
  description: string
}

interface CreateCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCourseDialog({ open, onOpenChange }: CreateCourseDialogProps) {
  const { mutate: createCourse, isPending } = useCreateCourse()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      courseName: "",
      description: "",
    },
  })

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = (data: FormData) => {
    createCourse(data, {
      onSuccess: () => {
        onOpenChange(false)
        reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>Create a new course for your institute.</DialogDescription>
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
                {...register("courseName", { required: "Course courseName is required" })}
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
              Create Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
