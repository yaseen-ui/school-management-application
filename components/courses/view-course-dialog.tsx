"use client"

import { BookOpen, Calendar, Tag } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/api/courses"

interface ViewCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
}

export function ViewCourseDialog({ open, onOpenChange, course }: ViewCourseDialogProps) {
  if (!course) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            {course.courseName}
          </DialogTitle>
          <DialogDescription>Course details and information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
            <p className="text-sm text-foreground">{course.description}</p>
          </div>

          {/* Grades */}
          {course.grades && course.grades.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Assigned Grades
              </h4>
              <div className="flex flex-wrap gap-2">
                {course.grades.map((grade, index) => (
                  <Badge key={index} variant="secondary">
                    {grade}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{formatDate(course.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium">{formatDate(course.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
