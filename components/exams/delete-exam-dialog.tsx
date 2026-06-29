"use client"

import { motion } from "framer-motion"
import { Loader2, FileText, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteExam } from "@/hooks/use-exams"
import type { Exam } from "@/lib/api/exams"

interface DeleteExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exam: Exam | null
}

export function DeleteExamDialog({ open, onOpenChange, exam }: DeleteExamDialogProps) {
  const deleteExam = useDeleteExam()

  const handleDelete = async () => {
    if (!exam) return
    try {
      await deleteExam.mutateAsync(exam.id)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (!exam) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Exam</DialogTitle>
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
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{exam.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{exam.examType} Exam</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this exam? This will also remove all associated schedules, papers, and marks data.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteExam.isPending}>
              {deleteExam.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Exam
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
