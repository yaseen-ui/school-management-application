"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStoreProducts, useDeleteStoreProduct } from "@/hooks/use-store"
import { CreateProductDialog } from "@/components/store/create-product-dialog"
import { EditProductDialog } from "@/components/store/edit-product-dialog"
import { ViewProductDialog } from "@/components/store/view-product-dialog"
import { DeleteProductDialog } from "@/components/store/delete-product-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { StoreProduct } from "@/lib/api/store"

export default function StoreProductsPage() {
  const { data: productsData, isLoading: productsLoading } = useStoreProducts()
  const deleteProduct = useDeleteStoreProduct()

  const [createProductOpen, setCreateProductOpen] = useState(false)
  const [viewProductOpen, setViewProductOpen] = useState(false)
  const [editProductOpen, setEditProductOpen] = useState(false)
  const [deleteProductOpen, setDeleteProductOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null)

  const products: StoreProduct[] = productsData || []

  const handleViewProduct = (prod: StoreProduct) => {
    setSelectedProduct(prod)
    setViewProductOpen(true)
  }

  const handleEditProduct = (prod: StoreProduct) => {
    setSelectedProduct(prod)
    setEditProductOpen(true)
  }

  const handleDeleteProduct = (prod: StoreProduct) => {
    setSelectedProduct(prod)
    setDeleteProductOpen(true)
  }

  const handleBulkDeleteProducts = async (selectedRows: StoreProduct[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteProduct.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} product(s)`)
    } catch (error) {
      toast.error("Failed to delete some products")
    }
  }

  const productColumns = [
    { field: "name", headerName: "Product Name" },
    { field: "category", headerName: "Category" },
    { field: "basePrice", headerName: "Base Price" },
    { field: "isGeneral", headerName: "General" },
    { field: "stockQuantity", headerName: "Stock" },
    { field: "isActive", headerName: "Status" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Products" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Products" description="Manage store products">
          <Button onClick={() => setCreateProductOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={products}
          apiColumns={productColumns}
          isLoading={productsLoading}
          onBulkDelete={handleBulkDeleteProducts}
          idField="id"
          renderCell={({ row, field }: { row: StoreProduct; field: string; value: unknown }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.name}</span>
                </div>
              )
            }

            if (field === "category") {
              return <span className="text-sm text-muted-foreground">{row.category?.name || "—"}</span>
            }

            if (field === "basePrice") {
              return <span className="text-sm font-medium">₹{Number(row.basePrice).toFixed(2)}</span>
            }

            if (field === "isGeneral") {
              return (
                <div className="flex flex-col gap-1">
                  <span className={`text-sm font-medium ${row.isGeneral ? "text-blue-600" : "text-amber-600"}`}>
                    {row.isGeneral ? "General" : "Section-Specific"}
                  </span>
                  {!row.isGeneral && row.sectionAssignments && row.sectionAssignments.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {row.sectionAssignments.slice(0, 3).map((sa) => (
                        <span key={sa.id} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {sa.section?.sectionName || "—"}
                        </span>
                      ))}
                      {row.sectionAssignments.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{row.sectionAssignments.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              )
            }

            if (field === "stockQuantity") {
              return <span className="text-sm text-muted-foreground">{row.stockQuantity ?? 0}</span>
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
                  {format(new Date(row[field as keyof StoreProduct] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: StoreProduct) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewProduct(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditProduct(row)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteProduct(row)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <CreateProductDialog open={createProductOpen} onOpenChange={setCreateProductOpen} />
      <ViewProductDialog open={viewProductOpen} onOpenChange={setViewProductOpen} product={selectedProduct} />
      <EditProductDialog open={editProductOpen} onOpenChange={setEditProductOpen} product={selectedProduct} />
      <DeleteProductDialog open={deleteProductOpen} onOpenChange={setDeleteProductOpen} product={selectedProduct} />
    </>
  )
}
