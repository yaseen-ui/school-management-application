"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, RotateCcw, IndianRupee, AlertCircle, CheckCircle2, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateRefund, usePayments } from "@/hooks/use-fees"
import type { CreateRefundRequest, FeePayment } from "@/lib/api/fees"
import { format } from "date-fns"

interface CreateRefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateRefundDialog({ open, onOpenChange }: CreateRefundDialogProps) {
  const createRefund = useCreateRefund()
  const { data: paymentsData } = usePayments({ status: "paid" })
  const payments: FeePayment[] = paymentsData || []
  const [selectedPayment, setSelectedPayment] = useState<FeePayment | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<CreateRefundRequest>({
    defaultValues: {
      refundDate: format(new Date(), "yyyy-MM-dd"),
    },
  })

  const refundAmount = watch("amount")

  const onSubmit = async (data: CreateRefundRequest) => {
    try {
      await createRefund.mutateAsync(data)
      reset()
      setSelectedPayment(null)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    setSelectedPayment(null)
    onOpenChange(false)
  }

  const handlePaymentChange = (value: string) => {
    setValue("paymentId", value)
    const selected = payments.find((p) => p.id === value) || null
    setSelectedPayment(selected)
  }

  const isOverRefund = selectedPayment && refundAmount && Number(refundAmount) > selectedPayment.amountPaid

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/10 ring-1 ring-destructive/20">
              <RotateCcw className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-xl">Process Refund</DialogTitle>
              <DialogDescription>Issue a refund for a fee payment</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            {/* Payment Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Payment <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={handlePaymentChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select payment to refund..." />
                </SelectTrigger>
                <SelectContent>
                  {payments.map((payment) => (
                    <SelectItem key={payment.id} value={payment.id}>
                      <span className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">
                          {payment.studentFee?.enrollment?.student?.firstName?.[0]}
                          {payment.studentFee?.enrollment?.student?.lastName?.[0]}
                        </span>
                        <span>
                          {payment.studentFee?.enrollment?.student?.firstName}{" "}
                          {payment.studentFee?.enrollment?.student?.lastName}
                        </span>
                        <span className="text-muted-foreground">(₹{payment.amountPaid?.toLocaleString()})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Details Card */}
            {selectedPayment && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-muted/50 to-muted/20 p-4 space-y-2"
              >
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Details</h4>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg bg-background/80 p-2.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Amount Paid</p>
                    <p className="text-sm font-bold">₹{selectedPayment.amountPaid?.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-2.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Method</p>
                    <p className="text-sm font-bold capitalize">{selectedPayment.paymentMethod?.replace("_", " ")}</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-2.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Date</p>
                    <p className="text-sm font-bold">
                      {selectedPayment.paymentDate
                        ? format(new Date(selectedPayment.paymentDate), "MMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-2.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Transaction</p>
                    <p className="text-sm font-bold font-mono">{selectedPayment.transactionId || "—"}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Refund Amount & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Refund Amount <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    className="pl-9 h-10"
                    {...register("amount", { valueAsNumber: true, min: 0 })}
                  />
                </div>
                {isOverRefund && (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                    <AlertCircle className="h-3 w-3" />
                    Amount exceeds payment amount of ₹{selectedPayment.amountPaid.toLocaleString()}
                  </p>
                )}
                {selectedPayment && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Max refund: ₹{selectedPayment.amountPaid.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundDate" className="text-sm font-medium">Refund Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="refundDate"
                    type="date"
                    className="pl-9 h-10"
                    {...register("refundDate")}
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">Reason</Label>
              <Input
                id="reason"
                placeholder="e.g., Fee adjustment, duplicate payment, student withdrawal..."
                className="h-10"
                {...register("reason")}
              />
            </div>
          </motion.div>

          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              <AlertCircle className="mr-1 inline h-3 w-3 text-amber-500" />
              Refunds are irreversible
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={createRefund.isPending || !!isOverRefund} className="min-w-[140px]">
                {createRefund.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Process Refund
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
