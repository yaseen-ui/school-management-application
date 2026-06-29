"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFeeTerms, useDeleteFeeTerm } from "@/hooks/use-fees"
import { CreateFeeTermDialog } from "@/components/fees/create-fee-term-dialog"
import { ViewFeeTermDialog } from "@/components/fees/view-fee-term-dialog"
import { EditFeeTermDialog } from "@/components/fees/edit-fee-term-dialog"
import { DeleteFeeTermDialog } from "@/components/fees/delete-fee-term-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import type { FeeTerm } from "@/lib/api/fees"

export default function FeeTermsPage() {
  const { data, isLoading } = useFeeTerms()
  const deleteFeeTerm = useDeleteFeeTerm()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFeeTerm, setSelectedFeeTerm] = useState<FeeTerm | null>(null)

  const feeTerms: FeeTerm[] = data || []

  const handleView = (feeTerm: FeeTerm) => {
    setSelectedFeeTerm(feeTerm)
    setViewDialogOpen(true)
  }

  const handleEdit = (feeTerm: FeeTerm) => {
    setSelectedFeeTerm(feeTerm)
    setEditDialogOpen(true)
  }

  const handleDelete = (feeTerm: FeeTerm) => {
    setSelectedFeeTerm(feeTerm)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedRows: FeeTerm[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteFeeTerm.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} fee term(s)`)
    } catch (error) {
      toast.error("Failed to delete some fee terms")
    }
  }

  const defaultColumns = [
    { field: "name", headerName: "Term" },
    { field: "section", headerName: "Section" },
    { field: "academicYear", headerName: "Academic Year" },
    { field: "dueDate", headerName: "Due Date" },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Fee Terms" description="Manage fee payment terms and due dates">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Fee Term
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={feeTerms}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: FeeTerm; field: string; value: unknown }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.name}</span>
                </div>
              )
            }

            if (field === "section") {
              return <span className="text-sm">{row.sectionFee?.section?.sectionName || "—"}</span>
            }

            if (field === "academicYear") {
              return <span className="text-sm">{row.sectionFee?.academicYear?.name || "—"}</span>
            }

            if (field === "dueDate") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row.dueDate), "MMM d, yyyy")}
                </span>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof FeeTerm] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: FeeTerm) => (
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

      <CreateFeeTermDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewFeeTermDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} feeTerm={selectedFeeTerm} />
      <EditFeeTermDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} feeTerm={selectedFeeTerm} />
      <DeleteFeeTermDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} feeTerm={selectedFeeTerm} />
    </>
  )
}
