"use client"
import { motion } from "framer-motion"
import { Loader2, AlertTriangle, ListOrdered } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeleteFeeHead } from "@/hooks/use-fees"
import type { FeeHead } from "@/lib/api/fees"

interface DeleteFeeHeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feeHead: FeeHead | null
}

export function DeleteFeeHeadDialog({ open, onOpenChange, feeHead }: DeleteFeeHeadDialogProps) {
  const deleteFeeHead = useDeleteFeeHead()

  const handleDelete = async () => {
    if (!feeHead) return
    try {
      await deleteFeeHead.mutateAsync(feeHead.id)
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
              <ListOrdered className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Fee Head</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this fee head? This action cannot be undone.
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
          {feeHead && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium">{feeHead.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {feeHead.description || "No description"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {feeHead?._count && (feeHead._count.sectionFeeHeads > 0 || feeHead._count.studentFeeHeads > 0 || feeHead._count.payments > 0) && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Warning</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                This fee head is being used by {feeHead._count.sectionFeeHeads} section(s), {feeHead._count.studentFeeHeads} student(s), and has {feeHead._count.payments} payment(s). Deleting it may affect related records.
              </p>
            </div>
          )}
        </motion.div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteFeeHead.isPending}>
            {deleteFeeHead.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Fee Head
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
