"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Copy, CheckCircle, XCircle } from "lucide-react"
import { useSendInvite } from "@/hooks/use-parents"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface InviteParentButtonProps {
  parentId: string
  parentName: string
  isRegistered: boolean
}

export function InviteParentButton({ parentId, parentName, isRegistered }: InviteParentButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const sendInvite = useSendInvite()

  if (isRegistered) {
    return null
  }

  const handleSendInvite = () => {
    sendInvite.mutate(parentId, {
      onSuccess: () => setOpen(true),
    })
  }

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
        onClick={handleSendInvite}
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
              Share this link with {parentName} to complete registration.
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
                  <span className="text-muted-foreground">Parent</span>
                  <span className="font-medium">{sendInvite.data.data.parentName}</span>
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