"use client"
import { motion } from "framer-motion"
import { CalendarDays, Calendar, Hash, Building2, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import type { FeeTerm } from "@/lib/api/fees"

interface ViewFeeTermDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feeTerm: FeeTerm | null
}

export function ViewFeeTermDialog({ open, onOpenChange, feeTerm }: ViewFeeTermDialogProps) {
  if (!feeTerm) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Fee Term Details</DialogTitle>
              <DialogDescription>{feeTerm.name}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 pt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Term Name</span>
              </div>
              <p className="font-medium">{feeTerm.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>Sort Order</span>
              </div>
              <p className="font-medium">{feeTerm.sortOrder}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Section</span>
              </div>
              <p className="font-medium">{feeTerm.sectionFee?.section?.sectionName || "—"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Academic Year</span>
              </div>
              <p className="font-medium">{feeTerm.sectionFee?.academicYear?.name || "—"}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due Date</span>
            </div>
            <p className="font-medium">{format(new Date(feeTerm.dueDate), "MMM d, yyyy")}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created At</span>
              </div>
              <p className="text-sm">{format(new Date(feeTerm.createdAt), "MMM d, yyyy")}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Updated At</span>
              </div>
              <p className="text-sm">{format(new Date(feeTerm.updatedAt), "MMM d, yyyy")}</p>
            </div>
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
