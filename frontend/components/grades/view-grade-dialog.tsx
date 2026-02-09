"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface GradeData {
  gradeId: string
  tenantId: string
  courseId: string
  gradeName: string
  createdAt: string
  updatedAt: string
  courseName?: string
}

interface ViewGradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grade: GradeData | null
}

export function ViewGradeDialog({ open, onOpenChange, grade }: ViewGradeDialogProps) {
  if (!grade) return null

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Grade Details</DialogTitle>
              <DialogDescription>View grade information</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">{grade.gradeName}</h3>
            <p className="text-sm text-muted-foreground">Grade Level</p>
          </div>

          <div className="space-y-3">
            <InfoItem icon={BookOpen} label="Course" value={grade.courseName || "N/A"} />

            <InfoItem icon={Calendar} label="Created At" value={format(new Date(grade.created_at), "PPp")} />

            <InfoItem icon={Calendar} label="Last Updated" value={format(new Date(grade.updated_at), "PPp")} />
          </div>
        </motion.div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
