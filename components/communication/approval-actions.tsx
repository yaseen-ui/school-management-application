"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X } from "lucide-react"

interface ApprovalActionsProps {
  onApprove: (remarks?: string) => void
  onReject: (reason: string) => void
  isApproving?: boolean
  isRejecting?: boolean
}

export function ApprovalActions({ onApprove, onReject, isApproving, isRejecting }: ApprovalActionsProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [approveRemarks, setApproveRemarks] = useState("")

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason.trim())
      setShowRejectDialog(false)
      setRejectReason("")
    }
  }

  const handleApprove = () => {
    onApprove(approveRemarks.trim() || undefined)
    setShowApproveDialog(false)
    setApproveRemarks("")
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
          onClick={() => setShowApproveDialog(true)}
          disabled={isApproving}
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => setShowRejectDialog(true)}
          disabled={isRejecting}
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>

      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Publication</DialogTitle>
            <DialogDescription>
              Add any remarks (optional) and confirm approval.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Approval remarks (optional)..."
            value={approveRemarks}
            onChange={(e) => setApproveRemarks(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Publication</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (required)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}