"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Truck, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useVehicles, useDeleteVehicle } from "@/hooks/use-transportation"
import { ViewVehicleDialog } from "@/components/transportation/vehicles/view-vehicle-dialog"
import { DeleteVehicleDialog } from "@/components/transportation/vehicles/delete-vehicle-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { Vehicle } from "@/lib/api/transportation"
import Link from "next/link"

export default function VehiclesPage() {
  const { data: vehiclesData, isLoading } = useVehicles()
  const deleteVehicle = useDeleteVehicle()

  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Vehicle | null>(null)

  const vehicles: Vehicle[] = vehiclesData || []

  const handleView = (v: Vehicle) => {
    setSelected(v)
    setViewOpen(true)
  }

  const handleDelete = (v: Vehicle) => {
    setSelected(v)
    setDeleteOpen(true)
  }

  const handleBulkDelete = async (selectedRows: Vehicle[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteVehicle.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} vehicle(s)`)
    } catch {
      toast.error("Failed to delete some vehicles")
    }
  }

  const vehicleColumns = [
    { field: "name", headerName: "Name" },
    { field: "registrationNumber", headerName: "Registration No." },
    { field: "capacity", headerName: "Capacity" },
    { field: "status", headerName: "Status" },
    { field: "createdAt", headerName: "Created" },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Vehicles" },
        ]}
      />
      <PageHeader title="Vehicles" description="Manage vehicles like buses, vans, cars, etc.">
        <Link href="/transportation/vehicles/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <DynamicDataTable
          data={vehicles}
          apiColumns={vehicleColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field, value }: { row: Vehicle; field: string; value: unknown }) => {
            if (field === "capacity") {
              return <span>{row.capacity} seats</span>
            }
            if (field === "status") {
              return <span className="text-sm font-medium">{row.status}</span>
            }
            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof Vehicle] as string), "MMM d, yyyy")}
                </span>
              )
            }
            return undefined
          }}
          renderActions={(row: Vehicle) => (
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
                  <Link href={`/transportation/vehicles/${row.id}/edit`}>
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

      <ViewVehicleDialog open={viewOpen} onOpenChange={setViewOpen} vehicle={selected} />
      <DeleteVehicleDialog open={deleteOpen} onOpenChange={setDeleteOpen} vehicle={selected} />
    </div>
  )
}
