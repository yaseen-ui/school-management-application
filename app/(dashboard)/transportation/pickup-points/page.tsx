"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePickupPoints, useDeletePickupPoint } from "@/hooks/use-transportation"
import { ViewPickupPointDialog } from "@/components/transportation/pickup-points/view-pickup-point-dialog"
import { DeletePickupPointDialog } from "@/components/transportation/pickup-points/delete-pickup-point-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { PickupPoint } from "@/lib/api/transportation"
import Link from "next/link"

export default function PickupPointsPage() {
  const { data: pointsData, isLoading } = usePickupPoints()
  const deletePickupPoint = useDeletePickupPoint()

  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<PickupPoint | null>(null)

  const points: PickupPoint[] = pointsData || []

  const handleView = (p: PickupPoint) => {
    setSelected(p)
    setViewOpen(true)
  }

  const handleDelete = (p: PickupPoint) => {
    setSelected(p)
    setDeleteOpen(true)
  }

  const handleBulkDelete = async (selectedRows: PickupPoint[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deletePickupPoint.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} pickup point(s)`)
    } catch {
      toast.error("Failed to delete some pickup points")
    }
  }

  const pointColumns = [
    { field: "name", headerName: "Name" },
    { field: "address", headerName: "Address" },
    { field: "latitude", headerName: "Latitude" },
    { field: "longitude", headerName: "Longitude" },
    { field: "isActive", headerName: "Status" },
    { field: "createdAt", headerName: "Created" },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Pickup Points" },
        ]}
      />
      <PageHeader title="Pickup Points" description="Manage pickup point locations with GPS coordinates">
        <Link href="/transportation/pickup-points/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Pickup Point
          </Button>
        </Link>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <DynamicDataTable
          data={points}
          apiColumns={pointColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field, value }: { row: PickupPoint; field: string; value: unknown }) => {
            if (field === "latitude") {
              return <span>{row.latitude.toFixed(4)}</span>
            }
            if (field === "longitude") {
              return <span>{row.longitude.toFixed(4)}</span>
            }
            if (field === "isActive") {
              return (
                <span className={`text-sm font-medium ${row.isActive ? "text-green-600" : "text-muted-foreground"}`}>
                  {row.isActive ? "Active" : "Inactive"}
                </span>
              )
            }
            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof PickupPoint] as string), "MMM d, yyyy")}
                </span>
              )
            }
            return undefined
          }}
          renderActions={(row: PickupPoint) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/transportation/pickup-points/${row.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(row)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <ViewPickupPointDialog open={viewOpen} onOpenChange={setViewOpen} pickupPoint={selected} />
      <DeletePickupPointDialog open={deleteOpen} onOpenChange={setDeleteOpen} pickupPoint={selected} />
    </div>
  )
}
