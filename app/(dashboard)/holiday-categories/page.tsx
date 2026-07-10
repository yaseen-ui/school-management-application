"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tag, Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable, type ApiColumn } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/sonner"
import { useHolidayCategories, useDeleteHolidayCategory } from "@/hooks/use-holidays"
import type { HolidayCategory } from "@/lib/api/holidays"
import { format } from "date-fns"

export default function HolidayCategoriesPage() {
  const router = useRouter()
  const { data, isLoading } = useHolidayCategories()
  const deleteCategory = useDeleteHolidayCategory()

  const categories: HolidayCategory[] = data || []

  const handleView = (cat: HolidayCategory) => {
    toast.info(cat.name, {
      description: cat.description || "No description",
    })
  }

  const handleEdit = (cat: HolidayCategory) => {
    router.push(`/holiday-categories/${cat.id}/edit`)
  }

  const handleDelete = (cat: HolidayCategory) => {
    if (confirm(`Are you sure you want to delete "${cat.name}"?`)) {
      deleteCategory.mutate(cat.id)
    }
  }

  const handleBulkDelete = (selectedRows: HolidayCategory[]) => {
    toast.info(`Delete ${selectedRows.length} category(ies)?`, {
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await Promise.all(selectedRows.map((row) => deleteCategory.mutateAsync(row.id)))
            toast.success(`Deleted ${selectedRows.length} category(ies)`)
          } catch {
            toast.error("Failed to delete some categories")
          }
        },
      },
    })
  }

  const apiColumns: ApiColumn[] = [
    { field: "name", headerName: "Category Name" },
    { field: "description", headerName: "Description" },
    { field: "sortOrder", headerName: "Sort Order" },
    { field: "isActive", headerName: "Active" },
    { field: "createdAt", headerName: "Created At" },
  ]

  const renderCell = ({ row, field }: { row: HolidayCategory; field: string; value: unknown }) => {
    switch (field) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium">{row.name}</span>
          </div>
        )
      case "description":
        return <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
      case "sortOrder":
        return <span className="text-sm text-muted-foreground">{row.sortOrder}</span>
      case "isActive":
        return <Badge variant={row.isActive ? "default" : "secondary"}>{row.isActive ? "Active" : "Inactive"}</Badge>
      case "createdAt":
        return <span className="text-sm text-muted-foreground">{format(new Date(row.createdAt), "MMM d, yyyy")}</span>
      default:
        return undefined
    }
  }

  const renderActions = (row: HolidayCategory) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleView(row)}>
          <Eye className="mr-2 h-4 w-4" />View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEdit(row)}>
          <Pencil className="mr-2 h-4 w-4" />Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(row)}>
          <Trash2 className="mr-2 h-4 w-4" />Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Holiday Categories" description="Manage categories for grouping holidays">
        <div className="flex gap-2">
          <Button onClick={() => router.push("/holiday-categories/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button variant="outline" onClick={() => router.push("/holidays")}>
            Back to Holidays
          </Button>
        </div>
      </PageHeader>

      <DynamicDataTable
        data={categories}
        apiColumns={apiColumns}
        isLoading={isLoading}
        renderCell={renderCell as any}
        renderActions={renderActions as any}
        onBulkDelete={handleBulkDelete}
        idField="id"
        searchPlaceholder="Search categories..."
      />
    </motion.div>
  )
}