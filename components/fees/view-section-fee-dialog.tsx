"use client"
import { motion } from "framer-motion"
import { DollarSign, Calendar, Hash, Building2, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import type { SectionFee } from "@/lib/api/fees"

interface ViewSectionFeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionFee: SectionFee | null
}

export function ViewSectionFeeDialog({ open, onOpenChange, sectionFee }: ViewSectionFeeDialogProps) {
  if (!sectionFee) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Section Fee Details</DialogTitle>
              <DialogDescription>
                {sectionFee.section?.sectionName} — {sectionFee.academicYear?.name}
              </DialogDescription>
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
                <Building2 className="h-4 w-4" />
                <span>Section</span>
              </div>
              <p className="font-medium">{sectionFee.section?.sectionName || "—"}</p>
              {sectionFee.section?.grade && (
                <p className="text-sm text-muted-foreground">{sectionFee.section.grade.gradeName}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Academic Year</span>
              </div>
              <p className="font-medium">{sectionFee.academicYear?.name || "—"}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>Number of Terms</span>
              </div>
              <p className="font-medium">{sectionFee.termCount}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Fee Heads</h4>
            {sectionFee.heads && sectionFee.heads.length > 0 ? (
              <div className="space-y-2">
                {sectionFee.heads.map((head) => (
                  <div key={head.id} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-medium">{head.feeHead?.name || "Unknown"}</span>
                    <span className="text-lg font-bold">₹{head.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No fee heads configured</p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created At</span>
              </div>
              <p className="text-sm">{format(new Date(sectionFee.createdAt), "MMM d, yyyy")}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Updated At</span>
              </div>
              <p className="text-sm">{format(new Date(sectionFee.updatedAt), "MMM d, yyyy")}</p>
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
