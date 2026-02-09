"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Plus, MoreHorizontal, Eye, Pencil, Trash2, Calendar } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable, type ApiColumn } from "@/components/shared/dynamic-data-table"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSections } from "@/hooks/use-sections"
import { toast } from "@/components/ui/sonner"
import { CreateSectionDialog } from "@/components/sections/create-section-dialog"
import { ViewSectionDialog } from "@/components/sections/view-section-dialog"
import { EditSectionDialog } from "@/components/sections/edit-section-dialog"
import { DeleteSectionDialog } from "@/components/sections/delete-section-dialog"
import type { Section } from "@/lib/api/sections"

export default function SectionsPage() {
  const { data, isLoading } = useSections()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)

  const sections = (data?.data?.rows || []) as Section[]
  const apiColumns: ApiColumn[] = data?.data?.columns || [
    { field: "sectionName", headerName: "Section Name" },
    { field: "gradeName", headerName: "Grade" },
    { field: "createdAt", headerName: "Created At" },
  ]

  const handleView = (section: Section) => {
    setSelectedSection(section)
    setIsViewOpen(true)
  }

  const handleEdit = (section: Section) => {
    setSelectedSection(section)
    setIsEditOpen(true)
  }

  const handleDelete = (section: Section) => {
    setSelectedSection(section)
    setIsDeleteOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderCell = ({ row, field, value }: { row: Section; field: string; value: unknown }) => {
    switch (field) {
      case "sectionName":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{row.sectionName}</p>
            </div>
          </div>
        )

      case "gradeName":
        return <Badge variant="secondary">{row.gradeName || "N/A"}</Badge>

      case "createdAt":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(row.createdAt)}
          </div>
        )

      case "updatedAt":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(row.updatedAt)}
          </div>
        )

      default:
        return undefined
    }
  }

  const renderActions = (row: Section) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(row)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const handleBulkDelete = (selectedRows: Section[]) => {
    toast.info(`Delete ${selectedRows.length} section(s)?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => {
          toast.success(`Deleted ${selectedRows.length} section(s)`)
        },
      },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader title="Sections" description="Manage sections and class divisions in your institute">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </PageHeader>

      {!isLoading && sections.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No sections yet"
          description="Get started by creating your first section for students."
          action={{
            label: "Add Section",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : (
        <DynamicDataTable
          data={sections}
          apiColumns={apiColumns}
          renderCell={renderCell}
          renderActions={renderActions}
          onBulkDelete={handleBulkDelete}
          isLoading={isLoading}
          searchPlaceholder="Search sections..."
          idField="id"
        />
      )}

      <CreateSectionDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <ViewSectionDialog open={isViewOpen} onOpenChange={setIsViewOpen} section={selectedSection} />
      <EditSectionDialog open={isEditOpen} onOpenChange={setIsEditOpen} section={selectedSection} />
      <DeleteSectionDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} section={selectedSection} />
    </motion.div>
  )
}
