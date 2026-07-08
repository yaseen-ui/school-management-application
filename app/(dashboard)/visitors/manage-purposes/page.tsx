"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { useVisitorPurposes } from "@/hooks/use-visitors"
import { visitorsApi } from "@/lib/api/visitors"
import type { VisitorPurpose } from "@/lib/api/visitors"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

export default function ManagePurposesPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const { data: purposes, isLoading } = useVisitorPurposes()
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newRequiresApproval, setNewRequiresApproval] = useState(false)
  const [newApprovalFrom, setNewApprovalFrom] = useState<"admin" | "headmaster" | "point_of_contact">("admin")
  const [editingId, setEditingId] = useState<string | null>(null)

  const createPurpose = useMutation({
    mutationFn: () => visitorsApi.createPurpose({
      name: newName,
      description: newDescription || undefined,
      requiresApproval: newRequiresApproval,
      approvalFrom: newApprovalFrom,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitor-purposes"] })
      setNewName("")
      setNewDescription("")
      setNewRequiresApproval(false)
      setNewApprovalFrom("admin")
      toast.success("Purpose created")
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

  const updatePurpose = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VisitorPurpose> }) =>
      visitorsApi.updatePurpose(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitor-purposes"] })
      setEditingId(null)
      toast.success("Purpose updated")
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const columns: ColumnDef<VisitorPurpose>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        if (editingId === row.original.id) {
          return (
            <Input
              defaultValue={row.original.name}
              className="h-8 w-40"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = e.currentTarget
                  updatePurpose.mutate({ id: row.original.id, data: { name: input.value } })
                }
              }}
            />
          )
        }
        return (
          <div>
            <span className="font-medium">{row.original.name}</span>
            {row.original.description && (
              <p className="text-xs text-muted-foreground">{row.original.description}</p>
            )}
          </div>
        )
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        if (editingId === row.original.id) {
          return (
            <Input
              defaultValue={row.original.description || ""}
              placeholder="Optional description"
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updatePurpose.mutate({ id: row.original.id, data: { description: e.currentTarget.value } })
                }
              }}
            />
          )
        }
        return <span className="text-sm text-muted-foreground">{row.original.description || "—"}</span>
      },
    },
    {
      header: "Requires Approval",
      accessorKey: "requiresApproval",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={row.original.requiresApproval}
            onChange={(e) => {
              updatePurpose.mutate({
                id: row.original.id,
                data: { requiresApproval: e.target.checked },
              })
            }}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">{row.original.requiresApproval ? "Yes" : "No"}</span>
        </div>
      ),
    },
    {
      header: "Approval From",
      accessorKey: "approvalFrom",
      cell: ({ row }) => {
        if (!row.original.requiresApproval) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <Select
            value={row.original.approvalFrom}
            onValueChange={(v) => {
              updatePurpose.mutate({
                id: row.original.id,
                data: { approvalFrom: v as "admin" | "headmaster" | "point_of_contact" },
              })
            }}
          >
            <SelectTrigger className="h-8 w-[150px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="headmaster">Headmaster</SelectItem>
              <SelectItem value="point_of_contact">Point of Contact</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "cursor-pointer",
            row.original.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-500 border-slate-200"
          )}
          onClick={() => {
            updatePurpose.mutate({ id: row.original.id, data: { isActive: !row.original.isActive } })
          }}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {editingId === row.original.id ? (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-emerald-600"
              onClick={() => setEditingId(null)}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2"
              onClick={() => setEditingId(row.original.id)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-red-600"
            onClick={() => {
              if (confirm(`Delete "${row.original.name}"?`)) deletePurpose.mutate(row.original.id)
            }}
            disabled={deletePurpose.isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Visitors", href: "/visitors" }, { label: "Manage Purposes" }]} />
      <PageHeader title="Manage Purposes" description="Configure visitor purposes and approval settings.">
        <Button variant="outline" onClick={() => router.push("/visitors")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Visitors
        </Button>
      </PageHeader>

      {/* Add new purpose */}
      <div className="rounded-lg border p-4 flex items-end gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium">Name</label>
          <Input
            placeholder="e.g., Meet Student"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium">Description (optional)</label>
          <Input
            placeholder="Brief description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            checked={newRequiresApproval}
            onChange={(e) => setNewRequiresApproval(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-xs">Requires Approval</span>
        </div>
        {newRequiresApproval && (
          <Select value={newApprovalFrom} onValueChange={(v) => setNewApprovalFrom(v as any)}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="headmaster">Headmaster</SelectItem>
              <SelectItem value="point_of_contact">Point of Contact</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          onClick={() => createPurpose.mutate()}
          disabled={!newName.trim() || createPurpose.isPending}
          className="h-9"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <DynamicDataTable
        data={purposes || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search purposes..."
        renderActions={(row) => null}
      />
    </div>
  )
}