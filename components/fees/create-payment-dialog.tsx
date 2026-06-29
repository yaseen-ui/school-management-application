"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, CreditCard, IndianRupee, Banknote, Building2, Globe, Smartphone, CheckCircle2, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreatePayment, useStudentFees, useFeeTerms } from "@/hooks/use-fees"
import type { CreatePaymentRequest, StudentFee } from "@/lib/api/fees"
import { format } from "date-fns"

interface CreatePaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const paymentMethods = [
  { value: "cash", label: "Cash", icon: Banknote, color: "text-emerald-600" },
  { value: "bank_transfer", label: "Bank Transfer", icon: Building2, color: "text-blue-600" },
  { value: "cheque", label: "Cheque", icon: CreditCard, color: "text-purple-600" },
  { value: "online", label: "Online", icon: Globe, color: "text-cyan-600" },
  { value: "card", label: "Card", icon: Smartphone, color: "text-orange-600" },
]

export function CreatePaymentDialog({ open, onOpenChange }: CreatePaymentDialogProps) {
  const { data: studentFeesData } = useStudentFees()
  const { data: feeTermsData } = useFeeTerms()
  const createPayment = useCreatePayment()
  const studentFees: StudentFee[] = studentFeesData || []
  const feeTerms: any[] = feeTermsData || []
  const [selectedStudentFee, setSelectedStudentFee] = useState<StudentFee | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreatePaymentRequest>({
    defaultValues: {
      paymentDate: format(new Date(), "yyyy-MM-dd"),
    },
  })

  const onSubmit = async (data: CreatePaymentRequest) => {
    try {
      await createPayment.mutateAsync(data)
      reset()
      setSelectedStudentFee(null)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    setSelectedStudentFee(null)
    onOpenChange(false)
  }

  const handleStudentFeeChange = (value: string) => {
    setValue("studentFeeId", value)
    const selected = studentFees.find((sf) => sf.id === value) || null
    setSelectedStudentFee(selected)
  }

  const paymentProgress = selectedStudentFee
    ? Math.round((selectedStudentFee.totalPaid / selectedStudentFee.totalNegotiatedFee) * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Record Payment</DialogTitle>
              <DialogDescription>Enter payment details to record a fee collection</DialogDescription>
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
            {/* Student Fee Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Student <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={handleStudentFeeChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a student..." />
                </SelectTrigger>
                <SelectContent>
                  {studentFees.map((sf) => (
                    <SelectItem key={sf.id} value={sf.id}>
                      <span className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {sf.enrollment?.student?.firstName?.[0]}
                          {sf.enrollment?.student?.lastName?.[0]}
                        </span>
                        <span>
                          {sf.enrollment?.student?.firstName} {sf.enrollment?.student?.lastName}
                        </span>
                        <span className="text-muted-foreground">(₹{sf.balance.toLocaleString()} due)</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fee Summary Card */}
            {selectedStudentFee && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-muted/50 to-muted/20 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fee Summary</h4>
                  <span className={`text-xs font-medium ${selectedStudentFee.balance === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                    {selectedStudentFee.balance === 0 ? "Fully Paid" : `${paymentProgress}% Paid`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${paymentProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${paymentProgress === 100 ? "bg-emerald-500" : "bg-primary"}`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="rounded-lg bg-background/80 p-2.5 text-center">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Total Fee</p>
                    <p className="text-sm font-bold">₹{selectedStudentFee.totalNegotiatedFee.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-2.5 text-center">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Paid</p>
                    <p className="text-sm font-bold text-emerald-600">₹{selectedStudentFee.totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-2.5 text-center">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Balance</p>
                    <p className={`text-sm font-bold ${selectedStudentFee.balance === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      ₹{selectedStudentFee.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Fee Term */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Fee Term <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("termId", value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select fee term" />
                </SelectTrigger>
                <SelectContent>
                  {feeTerms.map((ft: any) => (
                    <SelectItem key={ft.id} value={ft.id}>
                      <span className="flex items-center gap-2">
                        <span>{ft.name}</span>
                        <span className="text-xs text-muted-foreground">
                          (Due: {new Date(ft.dueDate).toLocaleDateString()})
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount & Method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amountPaid" className="text-sm font-medium">
                  Amount <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="amountPaid"
                    type="number"
                    placeholder="0"
                    className="pl-9 h-10"
                    {...register("amountPaid", { valueAsNumber: true, min: 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Method <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("paymentMethod", value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <SelectItem key={method.value} value={method.value}>
                          <span className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${method.color}`} />
                            <span>{method.label}</span>
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transaction ID & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionId" className="text-sm font-medium">Transaction ID</Label>
                <Input
                  id="transactionId"
                  placeholder="e.g., TXN123456"
                  className="h-10"
                  {...register("transactionId")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate" className="text-sm font-medium">
                  Payment Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  className="h-10"
                  {...register("paymentDate", { required: "Payment date is required" })}
                />
                {errors.paymentDate && (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.paymentDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-sm font-medium">Remarks</Label>
              <Input
                id="remarks"
                placeholder="Optional remarks or notes..."
                className="h-10"
                {...register("remarks")}
              />
            </div>
          </motion.div>

          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              <CheckCircle2 className="mr-1 inline h-3 w-3 text-emerald-500" />
              All fields marked with * are required
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPayment.isPending} className="min-w-[140px]">
                {createPayment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Record Payment
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
