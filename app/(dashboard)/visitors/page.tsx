"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LogIn,
  LogOut,
  Check,
  X,
  Ban,
  Plus,
  ShieldQuestion,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { CreateVisitorDialog } from "@/components/visitors/create-visitor-dialog"
import { useVisitors, useCheckIn, useCheckOut, useApproveVisitor, useRejectVisitor, useCancelVisitor } from "@/hooks/use-visitors"
import type { Visitor } from "@/lib/api/visitors"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

const approvalColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  not_required: "bg-slate-100 text-slate-600 border-slate-200",
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  checked_in: "bg-emerald-100 text-emerald-800 border-emerald-200",
  checked_out: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

export default function VisitorsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [tab, setTab] = useState("all")

  const filters: Record<string, string> | undefined =
    tab === "all" ? undefined :
    tab === "pending" ? { approvalStatus: "pending" } :
    tab === "active" ? undefined : undefined

  const { data: visitors, isLoading } = useVisitors(filters)

  const filteredVisitors = tab === "active"
    ? (visitors || []).filter(v => v.status === "scheduled" || v.status === "checked_in")
    : visitors || []

  const checkIn = useCheckIn()
  const checkOut = useCheckOut()
  const approve = useApproveVisitor()
  const reject = useRejectVisitor()
  const cancel = useCancelVisitor()

  const columns: ColumnDef<Visitor>[] = [
    {
      header: "Visitor",
      accessorKey: "visitorName",
      cell: ({ row }) => {
        const v = row.original
        const name = v.visitorType === "registered" ? v.parentName : v.visitorName
        return (
          <div>
            <div className="font-medium">{name || "—"}</div>
            <div className="text-xs text-muted-foreground">{v.visitorPhone || "—"}</div>
          </div>
        )
      },
    },
    {
      header: "Type",
      accessorKey: "visitorType",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.visitorType === "registered" ? "Parent" : "Visitor"}
        </Badge>
      ),
    },
    {
      header: "Purpose",
      accessorKey: "purposeName",
    },
    {
      header: "Point of Contact",
      accessorKey: "pointOfContactName",
      cell: ({ row }) => row.original.pointOfContactName || "—",
    },
    {
      header: "Approval",
      accessorKey: "approvalStatus",
      cell: ({ row }) => {
        const s = row.original.approvalStatus
        return (
          <Badge variant="outline" className={cn("capitalize", approvalColors[s] || "")}>
            {s.replace(/_/g, " ")}
          </Badge>
        )
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const s = row.original.status
        return (
          <Badge variant="outline" className={cn("capitalize", statusColors[s] || "")}>
            {s.replace(/_/g, " ")}
          </Badge>
        )
      },
    },
    {
      header: "Check In",
      accessorKey: "checkInTime",
      cell: ({ row }) => row.original.checkInTime ? format(new Date(row.original.checkInTime), "HH:mm") : "—",
    },
    {
      header: "Check Out",
      accessorKey: "checkOutTime",
      cell: ({ row }) => row.original.checkOutTime ? format(new Date(row.original.checkOutTime), "HH:mm") : "—",
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => {
        const v = row.original
        if (v.status === "cancelled" || v.status === "checked_out") return null
        return (
          <div className="flex gap-1">
            {v.status === "scheduled" && (
              <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => checkIn.mutate(v.id)} disabled={checkIn.isPending}>
                <LogIn className="h-3.5 w-3.5" />
              </Button>
            )}
            {v.status === "checked_in" && (
              <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => checkOut.mutate(v.id)} disabled={checkOut.isPending}>
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            )}
            {v.approvalStatus === "pending" && (
              <>
                <Button size="sm" variant="outline" className="h-8 px-2 text-emerald-600" onClick={() => approve.mutate(v.id)} disabled={approve.isPending}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 px-2 text-red-600" onClick={() => {
                  const reason = prompt("Reason for rejection:")
                  if (reason !== null) reject.mutate({ id: v.id, reason })
                }} disabled={reject.isPending}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            {v.status === "scheduled" && (
              <Button size="sm" variant="outline" className="h-8 px-2 text-red-600" onClick={() => cancel.mutate(v.id)} disabled={cancel.isPending}>
                <Ban className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Visitors" }]} />
      <PageHeader title="Visitors" description="Manage campus visitors and approvals">
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/visitors/manage-purposes">
              <ShieldQuestion className="h-4 w-4 mr-2" />
              Manage Purposes
            </Link>
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Visitor
          </Button>
        </div>
      </PageHeader>

      <div className="flex items-center gap-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DynamicDataTable
        data={filteredVisitors}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search visitors..."
        renderActions={(row) => null}
      />

      {showCreate && <CreateVisitorDialog open={showCreate} onOpenChange={setShowCreate} />}
    </div>
  )
}