"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSectionFees, useDeleteSectionFee } from "@/hooks/use-fees"
import { CreateSectionFeeDialog } from "@/components/fees/create-section-fee-dialog"
import { ViewSectionFeeDialog } from "@/components/fees/view-section-fee-dialog"
import { EditSectionFeeDialog } from "@/components/fees/edit-section-fee-dialog"
import { DeleteSectionFeeDialog } from "@/components/fees/delete-section-fee-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import type { SectionFee } from "@/lib/api/fees"

export default function SectionFeesPage() {
  const { data, isLoading } = useSectionFees()
  const deleteSectionFee = useDeleteSectionFee()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSectionFee, setSelectedSectionFee] = useState<SectionFee | null>(null)

  const sectionFees: SectionFee[] = data || []

  const handleView = (sectionFee: SectionFee) => {
    setSelectedSectionFee(sectionFee)
    setViewDialogOpen(true)
  }

  const handleEdit = (sectionFee: SectionFee) => {
    setSelectedSectionFee(sectionFee)
    setEditDialogOpen(true)
  }

  const handleDelete = (sectionFee: SectionFee) => {
    setSelectedSectionFee(sectionFee)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedRows: SectionFee[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteSectionFee.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} section fee(s)`)
    } catch (error) {
      toast.error("Failed to delete some section fees")
    }
  }

  const defaultColumns = [
    { field: "section", headerName: "Section" },
    { field: "academicYear", headerName: "Academic Year" },
    { field: "termCount", headerName: "Terms" },
    { field: "allocationMethod", headerName: "Allocation" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Section Fees" description="Configure fee structures for each section">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section Fee
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={sectionFees}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: SectionFee; field: string; value: unknown }) => {
            if (field === "section") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.section?.sectionName || "—"}</span>
                </div>
              )
            }

            if (field === "academicYear") {
              return <span className="text-sm">{row.academicYear?.name || "—"}</span>
            }

            if (field === "termCount") {
              return <span className="text-sm font-medium">{row.termCount}</span>
            }

            if (field === "allocationMethod") {
              return (
                <span className="text-sm capitalize">{row.allocationMethod}</span>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof SectionFee] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: SectionFee) => (
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

      <CreateSectionFeeDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewSectionFeeDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} sectionFee={selectedSectionFee} />
      <EditSectionFeeDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} sectionFee={selectedSectionFee} />
      <DeleteSectionFeeDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} sectionFee={selectedSectionFee} />
    </>
  )
}
