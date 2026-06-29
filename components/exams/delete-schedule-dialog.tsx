"use client"

import { motion } from "framer-motion"
import { Loader2, Calendar, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteExamSchedule } from "@/hooks/use-exams"
import type { ExamSchedule } from "@/lib/api/exams"

interface DeleteScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: ExamSchedule | null
}

export function DeleteScheduleDialog({ open, onOpenChange, schedule }: DeleteScheduleDialogProps) {
  const deleteSchedule = useDeleteExamSchedule()

  const handleDelete = async () => {
    if (!schedule) return
    try {
      await deleteSchedule.mutateAsync(schedule.id)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (!schedule) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Schedule</DialogTitle>
              <DialogDescription>This action cannot be undone</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-4"
        >
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{schedule.name}</p>
              <p className="text-sm text-muted-foreground">{schedule.section?.sectionName || "—"}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this schedule? This will also remove all associated papers and marks.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteSchedule.isPending}>
              {deleteSchedule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Schedule
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
