"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Copy, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { teachersApi } from "@/lib/api/teachers"

interface InviteStaffButtonProps {
  teacherId: string
  teacherName: string
}

export function InviteStaffButton({ teacherId, teacherName }: InviteStaffButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const sendInvite = useMutation({
    mutationFn: () => teachersApi.sendInvite(teacherId),
    onSuccess: () => setOpen(true),
    onError: (error: Error) => toast.error(error.message || "Failed to send invite"),
  })

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success("Invite link copied to clipboard")
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => sendInvite.mutate()}
        disabled={sendInvite.isPending}
        className="gap-1.5"
      >
        {sendInvite.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Send className="h-3.5 w-3.5" />
        )}
        Send Invite
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Sent</DialogTitle>
            <DialogDescription>
              Share this link with {teacherName} to complete registration.
            </DialogDescription>
          </DialogHeader>

          {sendInvite.data?.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={sendInvite.data.data.inviteLink}
                  className="font-mono text-xs"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopy(sendInvite.data!.data!.inviteLink)}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="rounded-md bg-muted p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Staff</span>
                  <span className="font-medium">{sendInvite.data.data.teacherName}</span>
                </div>
                {sendInvite.data.data.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{sendInvite.data.data.phone}</span>
                  </div>
                )}
                {sendInvite.data.data.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{sendInvite.data.data.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{sendInvite.data.data.employeeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-medium">
                    {new Date(sendInvite.data.data.tokenExpiresAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}