"use client"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, UserCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateStudentFee } from "@/hooks/use-fees"
import type { StudentFee } from "@/lib/api/fees"

interface EditStudentFeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentFee: StudentFee | null
}

export function EditStudentFeeDialog({ open, onOpenChange, studentFee }: EditStudentFeeDialogProps) {
  const updateStudentFee = useUpdateStudentFee()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      totalActualFee: studentFee?.totalActualFee || 0,
      totalNegotiatedFee: studentFee?.totalNegotiatedFee || 0,
      discountType: studentFee?.discountType || "",
      discountValue: studentFee?.discountValue || 0,
    },
  })

  const onSubmit = async (data: any) => {
    if (!studentFee) return
    try {
      await updateStudentFee.mutateAsync({ id: studentFee.id, data })
      reset()
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  if (!studentFee) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Student Fee</DialogTitle>
              <DialogDescription>Update fee structure for student</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium">
                {studentFee.enrollment?.student?.firstName} {studentFee.enrollment?.student?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                Roll: {studentFee.enrollment?.rollNumber} | Section: {studentFee.enrollment?.section?.sectionName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalActualFee">
                  Actual Fee <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalActualFee"
                  type="number"
                  placeholder="0"
                  {...register("totalActualFee", { valueAsNumber: true, min: 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalNegotiatedFee">
                  Negotiated Fee <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalNegotiatedFee"
                  type="number"
                  placeholder="0"
                  {...register("totalNegotiatedFee", { valueAsNumber: true, min: 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  defaultValue={studentFee.discountType || ""}
                  onValueChange={(value) => setValue("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder="0"
                  {...register("discountValue", { valueAsNumber: true })}
                />
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateStudentFee.isPending}>
              {updateStudentFee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Student Fee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
