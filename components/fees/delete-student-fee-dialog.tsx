"use client"
import { motion } from "framer-motion"
import { Loader2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteStudentFee } from "@/hooks/use-fees"
import type { StudentFee } from "@/lib/api/fees"

interface DeleteStudentFeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentFee: StudentFee | null
}

export function DeleteStudentFeeDialog({ open, onOpenChange, studentFee }: DeleteStudentFeeDialogProps) {
  const deleteStudentFee = useDeleteStudentFee()

  const handleDelete = async () => {
    if (!studentFee) return
    try {
      await deleteStudentFee.mutateAsync(studentFee.id)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (!studentFee) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Student Fee</DialogTitle>
              <DialogDescription>Are you sure you want to delete this student fee?</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium">
              {studentFee.enrollment?.student?.firstName} {studentFee.enrollment?.student?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              Roll: {studentFee.enrollment?.rollNumber} | Fee: ₹{studentFee.totalNegotiatedFee?.toLocaleString()}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the student fee record and all associated data.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteStudentFee.isPending}>
              {deleteStudentFee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
