"use client"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { useVisitorPurposes } from "@/hooks/use-visitors"
import { visitorsApi } from "@/lib/api/visitors"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface ManagePurposesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManagePurposesDialog({ open, onOpenChange }: ManagePurposesDialogProps) {
  const qc = useQueryClient()
  const { data: purposes, isLoading } = useVisitorPurposes()
  const [newName, setNewName] = useState("")
  const [description, setDescription] = useState("")
  const [approvalFrom, setApprovalFrom] = useState("admin")
  const [requiresApproval, setRequiresApproval] = useState(false)

  const createPurpose = useMutation({
    mutationFn: () => visitorsApi.createPurpose({ name: newName, description: description || undefined, requiresApproval, approvalFrom }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitor-purposes"] })
      setNewName("")
      setDescription("")
      toast.success("Purpose added")
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deletePurpose = useMutation({
    mutationFn: (id: string) => visitorsApi.deletePurpose(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitor-purposes"] })
      toast.success("Purpose deleted")
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const toggleStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      visitorsApi.updatePurpose(id, { isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitor-purposes"] })
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Purposes</DialogTitle>
          <DialogDescription>Configure visitor purposes for your school.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new */}
            <div className="rounded-lg border p-4 space-y-3">
            <Label className="text-sm font-medium">Add Purpose</Label>
            <Input
              placeholder="e.g., Meet Student"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => createPurpose.mutate()}
                disabled={!newName.trim() || createPurpose.isPending}
                className="flex-1"
              >
                {createPurpose.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Purpose
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="req-approval"
                  checked={requiresApproval}
                  onChange={(e) => setRequiresApproval(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="req-approval" className="text-xs cursor-pointer">Requires Approval</Label>
              </div>
              {requiresApproval && (
                <Select value={approvalFrom} onValueChange={setApprovalFrom}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="headmaster">Headmaster</SelectItem>
                    <SelectItem value="point_of_contact">Point of Contact</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* List existing */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
            ) : (purposes || []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No purposes yet. Add one above.
              </p>
            ) : (
              (purposes || []).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                    <p className="text-xs text-muted-foreground">
                      Approval: {p.requiresApproval ? `${p.approvalFrom}` : "Not required"}
                      {!p.isActive && " • Inactive"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() => toggleStatus.mutate({ id: p.id, isActive: !p.isActive })}
                    >
                      {p.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-red-600"
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"?`)) deletePurpose.mutate(p.id)
                      }}
                      disabled={deletePurpose.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}