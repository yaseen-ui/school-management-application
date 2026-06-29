"use client"
import { motion } from "framer-motion"
import { UserCheck, IndianRupee, Calendar, Tag, Percent } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import type { StudentFee } from "@/lib/api/fees"

interface ViewStudentFeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentFee: StudentFee | null
}

export function ViewStudentFeeDialog({ open, onOpenChange, studentFee }: ViewStudentFeeDialogProps) {
  if (!studentFee) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Student Fee Details</DialogTitle>
              <DialogDescription>View fee structure assigned to student</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="font-medium">
                {studentFee.enrollment?.student?.firstName} {studentFee.enrollment?.student?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="font-medium">{studentFee.enrollment?.rollNumber || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Section</p>
              <p className="font-medium">{studentFee.enrollment?.section?.sectionName || "—"}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Actual Fee</p>
                <p className="text-lg font-bold">₹{studentFee.totalActualFee?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Negotiated Fee</p>
                <p className="text-lg font-bold text-green-600">₹{studentFee.totalNegotiatedFee?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {studentFee.discountType && (
            <div className="flex items-center gap-2">
              {studentFee.discountType === "percentage" ? (
                <Percent className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Tag className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Discount</p>
                <p className="font-medium">
                  {studentFee.discountType === "percentage"
                    ? `${studentFee.discountValue}%`
                    : `₹${studentFee.discountValue?.toLocaleString()}`}
                </p>
              </div>
            </div>
          )}

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Fee Heads</p>
            {studentFee.heads && studentFee.heads.length > 0 ? (
              <div className="space-y-2">
                {studentFee.heads.map((head) => (
                  <div key={head.id} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-medium">{head.feeHead?.name || "Unknown"}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Actual: ₹{head.actualAmount?.toLocaleString()}
                      </span>
                      <span className="text-green-600">
                        Negotiated: ₹{head.negotiatedAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No fee heads configured</p>
            )}
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Created: {format(new Date(studentFee.createdAt), "MMM d, yyyy")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={studentFee.allocationMethod === "equal" ? "secondary" : "outline"}>
              {studentFee.allocationMethod === "equal" ? "Equal Split" : "Custom"}
            </Badge>
            {studentFee._count && (
              <Badge variant="outline">{studentFee._count.payments} payment(s)</Badge>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
