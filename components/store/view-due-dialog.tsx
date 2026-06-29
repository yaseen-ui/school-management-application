"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, DollarSign, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStoreDue, useCreateDuePayment } from "@/hooks/use-store"
import type { StoreDue } from "@/lib/api/store"

interface ViewDueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  due: StoreDue | null
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "destructive",
  partially_paid: "secondary",
  settled: "default",
}

export function ViewDueDialog({ open, onOpenChange, due }: ViewDueDialogProps) {
  const { data: dueDetails, isLoading } = useStoreDue(due?.id || "")
  const createPayment = useCreateDuePayment()

  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [transactionId, setTransactionId] = useState("")

  if (!due) return null

  const remainingAmount = dueDetails
    ? Number(dueDetails.totalDueAmount) - Number(dueDetails.paidAmount)
    : Number(due.totalDueAmount) - Number(due.paidAmount)

  const handleRecordPayment = async () => {
    const amount = parseFloat(paymentAmount)
    if (!amount || amount <= 0 || amount > remainingAmount) return

    try {
      await createPayment.mutateAsync({
        dueId: due.id,
        data: {
          amount,
          paymentMethod: paymentMethod || undefined,
          transactionId: transactionId || undefined,
        },
      })
      setPaymentAmount("")
      setPaymentMethod("")
      setTransactionId("")
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <DialogTitle>Due Details</DialogTitle>
              <DialogDescription>View and manage outstanding dues.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {/* Due Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer</p>
                <p className="text-sm font-medium">{dueDetails?.customerName || due.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={statusVariant[dueDetails?.status || due.status] || "secondary"}>
                  {dueDetails?.status || due.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Due</p>
                <p className="text-sm font-medium">₹{Number(dueDetails?.totalDueAmount || due.totalDueAmount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                <p className="text-sm font-medium text-green-600">₹{Number(dueDetails?.paidAmount || due.paidAmount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className="text-sm font-medium text-destructive">₹{remainingAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Type</p>
                <p className="text-sm">{dueDetails?.customerType || due.customerType}</p>
              </div>
            </div>

            {dueDetails?.remarks && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                <p className="text-sm">{dueDetails.remarks}</p>
              </div>
            )}

            {/* Payment History */}
            {dueDetails?.payments && dueDetails.payments.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Payment History</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dueDetails.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell>₹{Number(payment.amount).toFixed(2)}</TableCell>
                        <TableCell>{payment.paymentMethod || "—"}</TableCell>
                        <TableCell className="font-mono text-xs">{payment.transactionId || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Record Payment */}
            {remainingAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 rounded-lg border p-4"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Record Payment</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount">Amount (max ₹{remainingAmount.toFixed(2)})</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      min="0"
                      max={remainingAmount}
                      step="0.01"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-id">Transaction ID (optional)</Label>
                  <Input
                    id="transaction-id"
                    placeholder="Enter transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleRecordPayment}
                  disabled={
                    createPayment.isPending ||
                    !paymentAmount ||
                    parseFloat(paymentAmount) <= 0 ||
                    parseFloat(paymentAmount) > remainingAmount
                  }
                  className="w-full"
                >
                  {createPayment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Record Payment
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
