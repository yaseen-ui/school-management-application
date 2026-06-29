"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Eye, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStoreKits, useDeleteStoreKit } from "@/hooks/use-store"
import { CreateKitDialog } from "@/components/store/create-kit-dialog"
import { ViewKitDialog } from "@/components/store/view-kit-dialog"
import { DeleteKitDialog } from "@/components/store/delete-kit-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { StoreKit } from "@/lib/api/store"

export default function StoreKitsPage() {
  const { data: kitsData, isLoading: kitsLoading } = useStoreKits()
  const deleteKit = useDeleteStoreKit()

  const [createKitOpen, setCreateKitOpen] = useState(false)
  const [viewKitOpen, setViewKitOpen] = useState(false)
  const [deleteKitOpen, setDeleteKitOpen] = useState(false)
  const [selectedKit, setSelectedKit] = useState<StoreKit | null>(null)

  const kits: StoreKit[] = kitsData || []

  const handleViewKit = (kit: StoreKit) => {
    setSelectedKit(kit)
    setViewKitOpen(true)
  }

  const handleDeleteKit = (kit: StoreKit) => {
    setSelectedKit(kit)
    setDeleteKitOpen(true)
  }

  const handleBulkDeleteKits = async (selectedRows: StoreKit[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteKit.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} kit(s)`)
    } catch (error) {
      toast.error("Failed to delete some kits")
    }
  }

  const kitColumns = [
    { field: "name", headerName: "Kit Name" },
    { field: "description", headerName: "Description" },
    { field: "sections", headerName: "Sections" },
    { field: "totalPrice", headerName: "Total Price" },
    { field: "isActive", headerName: "Status" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Kits" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Kits" description="Manage store kit templates">
          <Button onClick={() => setCreateKitOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Kit
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={kits}
          apiColumns={kitColumns}
          isLoading={kitsLoading}
          onBulkDelete={handleBulkDeleteKits}
          idField="id"
          renderCell={({ row, field }: { row: StoreKit; field: string; value: unknown }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.name}</span>
                </div>
              )
            }

            if (field === "description") {
              return <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
            }

            if (field === "sections") {
              if (row.sections && row.sections.length > 0) {
                return (
                  <div className="flex flex-wrap gap-1">
                    {row.sections.slice(0, 3).map((s) => (
                      <span key={s.id} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {s.section?.sectionName || "—"}
                      </span>
                    ))}
                    {row.sections.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{row.sections.length - 3} more</span>
                    )}
                  </div>
                )
              }
              return <span className="text-sm text-muted-foreground">All Sections</span>
            }

            if (field === "totalPrice") {
              return <span className="text-sm font-medium">₹{Number(row.totalPrice).toFixed(2)}</span>
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
                  {format(new Date(row[field as keyof StoreKit] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: StoreKit) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewKit(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteKit(row)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <CreateKitDialog open={createKitOpen} onOpenChange={setCreateKitOpen} />
      <ViewKitDialog open={viewKitOpen} onOpenChange={setViewKitOpen} kit={selectedKit} />
      <DeleteKitDialog open={deleteKitOpen} onOpenChange={setDeleteKitOpen} kit={selectedKit} />
    </>
  )
}
