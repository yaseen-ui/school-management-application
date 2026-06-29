"use client"
import { motion } from "framer-motion"
import { Loader2, AlertTriangle, DollarSign } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeleteSectionFee } from "@/hooks/use-fees"
import type { SectionFee } from "@/lib/api/fees"

interface DeleteSectionFeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionFee: SectionFee | null
}

export function DeleteSectionFeeDialog({ open, onOpenChange, sectionFee }: DeleteSectionFeeDialogProps) {
  const deleteSectionFee = useDeleteSectionFee()

  const handleDelete = async () => {
    if (!sectionFee) return
    try {
      await deleteSectionFee.mutateAsync(sectionFee.id)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[450px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/20 to-destructive/10">
              <DollarSign className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Section Fee</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this section fee? This action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {sectionFee && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium">{sectionFee.section?.sectionName || "Unknown Section"}</p>
                  <p className="text-sm text-muted-foreground">
                    {sectionFee.academicYear?.name} — {sectionFee.termCount} term(s)
                  </p>
                </div>
              </div>
            </div>
          )}

          {sectionFee?._count && sectionFee._count.studentFees > 0 && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Warning</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                This section fee has {sectionFee._count.studentFees} student fee record(s). Deleting it may affect related records.
              </p>
            </div>
          )}
        </motion.div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteSectionFee.isPending}>
            {deleteSectionFee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Section Fee
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
