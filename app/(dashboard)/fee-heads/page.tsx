"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ListOrdered, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFeeHeads, useDeleteFeeHead } from "@/hooks/use-fees"
import { CreateFeeHeadDialog } from "@/components/fees/create-fee-head-dialog"
import { ViewFeeHeadDialog } from "@/components/fees/view-fee-head-dialog"
import { EditFeeHeadDialog } from "@/components/fees/edit-fee-head-dialog"
import { DeleteFeeHeadDialog } from "@/components/fees/delete-fee-head-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import type { FeeHead } from "@/lib/api/fees"

export default function FeeHeadsPage() {
  const { data, isLoading } = useFeeHeads()
  const deleteFeeHead = useDeleteFeeHead()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFeeHead, setSelectedFeeHead] = useState<FeeHead | null>(null)

  const feeHeads: FeeHead[] = data || []

  const handleView = (feeHead: FeeHead) => {
    setSelectedFeeHead(feeHead)
    setViewDialogOpen(true)
  }

  const handleEdit = (feeHead: FeeHead) => {
    setSelectedFeeHead(feeHead)
    setEditDialogOpen(true)
  }

  const handleDelete = (feeHead: FeeHead) => {
    setSelectedFeeHead(feeHead)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedRows: FeeHead[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteFeeHead.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} fee head(s)`)
    } catch (error) {
      toast.error("Failed to delete some fee heads")
    }
  }

  const defaultColumns = [
    { field: "name", headerName: "Fee Head Name" },
    { field: "description", headerName: "Description" },
    { field: "isOptional", headerName: "Optional" },
    { field: "sortOrder", headerName: "Sort Order" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Fee Heads" description="Manage fee head categories for your institution">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Fee Head
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={feeHeads}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: FeeHead; field: string; value: unknown }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <ListOrdered className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.name}</span>
                </div>
              )
            }

            if (field === "description") {
              return <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
            }

            if (field === "isOptional") {
              return (
                <span className={`text-sm font-medium ${row.isOptional ? "text-amber-600" : "text-muted-foreground"}`}>
                  {row.isOptional ? "Optional" : "Required"}
                </span>
              )
            }

            if (field === "sortOrder") {
              return <span className="text-sm text-muted-foreground">{row.sortOrder}</span>
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof FeeHead] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: FeeHead) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(row)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(row)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <CreateFeeHeadDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewFeeHeadDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} feeHead={selectedFeeHead} />
      <EditFeeHeadDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} feeHead={selectedFeeHead} />
      <DeleteFeeHeadDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} feeHead={selectedFeeHead} />
    </>
  )
}
