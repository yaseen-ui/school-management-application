"use client"
import { motion } from "framer-motion"
import { ListOrdered, Calendar, Hash, FileText, CheckCircle2, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import type { FeeHead } from "@/lib/api/fees"

interface ViewFeeHeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feeHead: FeeHead | null
}

export function ViewFeeHeadDialog({ open, onOpenChange, feeHead }: ViewFeeHeadDialogProps) {
  if (!feeHead) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <ListOrdered className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{feeHead.name}</DialogTitle>
              <DialogDescription>Fee head details and configuration</DialogDescription>
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
                <FileText className="h-4 w-4" />
                <span>Name</span>
              </div>
              <p className="font-medium">{feeHead.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>Sort Order</span>
              </div>
              <p className="font-medium">{feeHead.sortOrder}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Description</span>
            </div>
            <p className="text-sm">{feeHead.description || "No description provided"}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {feeHead.isOptional ? (
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
              ) : (
                <XCircle className="h-4 w-4 text-green-500" />
              )}
              <span>Type</span>
            </div>
            <Badge variant={feeHead.isOptional ? "outline" : "default"}>
              {feeHead.isOptional ? "Optional" : "Required"}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created At</span>
              </div>
              <p className="text-sm">{format(new Date(feeHead.createdAt), "MMM d, yyyy")}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Updated At</span>
              </div>
              <p className="text-sm">{format(new Date(feeHead.updatedAt), "MMM d, yyyy")}</p>
            </div>
          </div>

          {feeHead._count && (
            <>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{feeHead._count.sectionFeeHeads}</p>
                  <p className="text-xs text-muted-foreground">Sections</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{feeHead._count.studentFeeHeads}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{feeHead._count.payments}</p>
                  <p className="text-xs text-muted-foreground">Payments</p>
                </div>
              </div>
            </>
          )}
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
