"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FolderTree, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStoreCategories, useDeleteStoreCategory } from "@/hooks/use-store"
import { CreateCategoryDialog } from "@/components/store/create-category-dialog"
import { EditCategoryDialog } from "@/components/store/edit-category-dialog"
import { ViewCategoryDialog } from "@/components/store/view-category-dialog"
import { DeleteCategoryDialog } from "@/components/store/delete-category-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { StoreCategory } from "@/lib/api/store"

export default function StoreCategoriesPage() {
  const { data: categoriesData, isLoading: categoriesLoading } = useStoreCategories()
  const deleteCategory = useDeleteStoreCategory()

  const [createCategoryOpen, setCreateCategoryOpen] = useState(false)
  const [viewCategoryOpen, setViewCategoryOpen] = useState(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | null>(null)

  const categories: StoreCategory[] = categoriesData || []

  const handleViewCategory = (cat: StoreCategory) => {
    setSelectedCategory(cat)
    setViewCategoryOpen(true)
  }

  const handleEditCategory = (cat: StoreCategory) => {
    setSelectedCategory(cat)
    setEditCategoryOpen(true)
  }

  const handleDeleteCategory = (cat: StoreCategory) => {
    setSelectedCategory(cat)
    setDeleteCategoryOpen(true)
  }

  const handleBulkDeleteCategories = async (selectedRows: StoreCategory[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteCategory.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} category(s)`)
    } catch (error) {
      toast.error("Failed to delete some categories")
    }
  }

  const categoryColumns = [
    { field: "name", headerName: "Category Name" },
    { field: "description", headerName: "Description" },
    { field: "sortOrder", headerName: "Sort Order" },
    { field: "isActive", headerName: "Status" },
    { field: "_count", headerName: "Products" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Categories" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Categories" description="Manage store categories">
          <Button onClick={() => setCreateCategoryOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={categories}
          apiColumns={categoryColumns}
          isLoading={categoriesLoading}
          onBulkDelete={handleBulkDeleteCategories}
          idField="id"
          renderCell={({ row, field }: { row: StoreCategory; field: string; value: unknown }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <FolderTree className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.name}</span>
                </div>
              )
            }

            if (field === "description") {
              return <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
            }

            if (field === "sortOrder") {
              return <span className="text-sm text-muted-foreground">{row.sortOrder}</span>
            }

            if (field === "isActive") {
              return (
                <span className={`text-sm font-medium ${row.isActive ? "text-green-600" : "text-muted-foreground"}`}>
                  {row.isActive ? "Active" : "Inactive"}
                </span>
              )
            }

            if (field === "_count") {
              return <span className="text-sm text-muted-foreground">{row._count?.products ?? 0}</span>
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof StoreCategory] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: StoreCategory) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewCategory(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditCategory(row)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteCategory(row)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <CreateCategoryDialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen} />
      <ViewCategoryDialog open={viewCategoryOpen} onOpenChange={setViewCategoryOpen} category={selectedCategory} />
      <EditCategoryDialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen} category={selectedCategory} />
      <DeleteCategoryDialog open={deleteCategoryOpen} onOpenChange={setDeleteCategoryOpen} category={selectedCategory} />
    </>
  )
}
