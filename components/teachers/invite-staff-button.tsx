"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Copy, CheckCircle, Users } from "lucide-react"
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
import type { Teacher } from "@/lib/api/teachers"

interface InviteResult {
  teacherId: string
  teacherName: string
  inviteLink: string
  tokenExpiresAt: string
  phone?: string
  email?: string
  employeeType?: string
}

interface InviteStaffButtonProps {
  /** Single teacher invite */
  teacherId?: string
  teacherName?: string
  /** Bulk invite via selected teachers array */
  selectedTeachers?: Teacher[]
  /** Variant for rendering in different contexts */
  variant?: "button" | "dropdown-item" | "icon"
  /** Children to render when variant is not "button" */
  children?: React.ReactNode
  /** Callback after successful invite(s) */
  onSuccess?: () => void
}

export function InviteStaffButton({
  teacherId,
  teacherName,
  selectedTeachers,
  variant = "button",
  children,
  onSuccess,
}: InviteStaffButtonProps) {
  const [open, setOpen] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [inviteResults, setInviteResults] = useState<InviteResult[]>([])

  const sendInvite = useMutation({
    mutationFn: async () => {
      const idsToInvite: string[] = teacherId
        ? [teacherId]
        : selectedTeachers?.map((t) => t.id) || []

      if (idsToInvite.length === 0) {
        throw new Error("No teachers selected")
      }

      // Call sendInvite for each ID sequentially to avoid overwhelming the server
      const results: InviteResult[] = []
      for (const id of idsToInvite) {
        const res = await teachersApi.sendInvite(id)
        results.push({
          teacherId: id,
          ...res.data,
        })
      }
      return results
    },
    onSuccess: (results) => {
      setInviteResults(results)
      setOpen(true)
      onSuccess?.()
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send invite"),
  })

  const handleCopy = (link: string, index: number) => {
    navigator.clipboard.writeText(link)
    setCopiedIndex(index)
    toast.success("Invite link copied to clipboard")
    setTimeout(() => setCopiedIndex(null), 3000)
  }

  const handleCopyAll = () => {
    const allLinks = inviteResults.map((r) => r.inviteLink).join("\n")
    navigator.clipboard.writeText(allLinks)
    toast.success(`Copied ${inviteResults.length} invite link(s)`)
  }

  const isBulk = !!(selectedTeachers && selectedTeachers.length > 0)
  const count = isBulk ? selectedTeachers!.length : teacherId ? 1 : 0
  const label = isBulk ? `Send Invites (${count})` : "Send Invite"

  if (variant === "dropdown-item") {
    return (
      <>
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            sendInvite.mutate()
          }}
          className="flex cursor-pointer items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Send className="mr-2 h-4 w-4" />
          Send Invite
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Sent</DialogTitle>
              <DialogDescription>
                Share this link with {teacherName || "staff"} to complete registration.
              </DialogDescription>
            </DialogHeader>

            {inviteResults.length > 0 && (
              <div className="space-y-4">
                {inviteResults.map((result, i) => (
                  <div key={result.teacherId} className="space-y-2">
                    {inviteResults.length > 1 && (
                      <p className="text-sm font-medium">{result.teacherName}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={result.inviteLink}
                        className="font-mono text-xs"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleCopy(result.inviteLink, i)}
                        className="shrink-0"
                      >
                        {copiedIndex === i ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="rounded-md bg-muted p-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{result.phone || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires</span>
                        <span className="font-medium">
                          {new Date(result.tokenExpiresAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {inviteResults.length > 1 && (
                  <Button variant="outline" size="sm" className="w-full" onClick={handleCopyAll}>
                    <Copy className="mr-2 h-3.5 w-3.5" />
                    Copy All Links
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <Button
        variant={isBulk ? "default" : "outline"}
        size="sm"
        onClick={() => sendInvite.mutate()}
        disabled={sendInvite.isPending || count === 0}
        className="gap-1.5"
      >
        {sendInvite.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isBulk ? (
          <Users className="h-3.5 w-3.5" />
        ) : (
          <Send className="h-3.5 w-3.5" />
        )}
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {inviteResults.length > 1
                ? `${inviteResults.length} Invites Sent`
                : "Invite Sent"}
            </DialogTitle>
            <DialogDescription>
              {inviteResults.length > 1
                ? "Share these links with staff to complete registration."
                : `Share this link with ${teacherName || "staff"} to complete registration.`}
            </DialogDescription>
          </DialogHeader>

          {inviteResults.length > 0 && (
            <div className="space-y-4">
              {inviteResults.map((result, i) => (
                <div key={result.teacherId} className="space-y-2">
                  {inviteResults.length > 1 && (
                    <p className="text-sm font-medium">{result.teacherName}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={result.inviteLink}
                      className="font-mono text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopy(result.inviteLink, i)}
                      className="shrink-0"
                    >
                      {copiedIndex === i ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="rounded-md bg-muted p-2 space-y-1 text-xs">
                    {result.phone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{result.phone}</span>
                      </div>
                    )}
                    {result.email && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{result.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span className="font-medium">
                        {new Date(result.tokenExpiresAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {inviteResults.length > 1 && (
                <Button variant="outline" size="sm" className="w-full" onClick={handleCopyAll}>
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Copy All Links
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
