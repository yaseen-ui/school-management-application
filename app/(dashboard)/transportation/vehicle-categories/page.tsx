"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Car, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useVehicleCategories, useDeleteVehicleCategory } from "@/hooks/use-transportation"
import { ViewVehicleCategoryDialog } from "@/components/transportation/vehicle-categories/view-vehicle-category-dialog"
import { DeleteVehicleCategoryDialog } from "@/components/transportation/vehicle-categories/delete-vehicle-category-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { VehicleCategory } from "@/lib/api/transportation"
import Link from "next/link"

export default function VehicleCategoriesPage() {
  const { data: categoriesData, isLoading } = useVehicleCategories()
  const deleteCategory = useDeleteVehicleCategory()

  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<VehicleCategory | null>(null)

  const categories: VehicleCategory[] = categoriesData || []

  const handleView = (cat: VehicleCategory) => {
    setSelected(cat)
    setViewOpen(true)
  }

  const handleDelete = (cat: VehicleCategory) => {
    setSelected(cat)
    setDeleteOpen(true)
  }

  const handleBulkDelete = async (selectedRows: VehicleCategory[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteCategory.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} category(s)`)
    } catch {
      toast.error("Failed to delete some categories")
    }
  }

  const categoryColumns = [
    { field: "name", headerName: "Name" },
    { field: "type", headerName: "Type" },
    { field: "occupancy", headerName: "Occupancy" },
    { field: "isActive", headerName: "Status" },
    { field: "createdAt", headerName: "Created" },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Vehicle Categories" },
        ]}
      />
      <PageHeader title="Vehicle Categories" description="Manage vehicle categories like Deluxe Bus, AC Van, etc.">
        <Link href="/transportation/vehicle-categories/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <DynamicDataTable
          data={categories}
          apiColumns={categoryColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field, value }: { row: VehicleCategory; field: string; value: unknown }) => {
            if (field === "occupancy") {
              return <span>{row.occupancy} seats</span>
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
                  {format(new Date(row[field as keyof VehicleCategory] as string), "MMM d, yyyy")}
                </span>
              )
            }
            return undefined
          }}
          renderActions={(row: VehicleCategory) => (
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
                  <Link href={`/transportation/vehicle-categories/${row.id}/edit`}>
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

      <ViewVehicleCategoryDialog open={viewOpen} onOpenChange={setViewOpen} category={selected} />
      <DeleteVehicleCategoryDialog open={deleteOpen} onOpenChange={setDeleteOpen} category={selected} />
    </div>
  )
}
