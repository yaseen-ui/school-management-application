"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookMarked, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSectionSubjects, useDeleteSectionSubject } from "@/hooks/use-section-subjects"
import { CreateSectionSubjectDialog } from "@/components/section-subjects/create-section-subject-dialog"
import { ViewSectionSubjectDialog } from "@/components/section-subjects/view-section-subject-dialog"
import { EditSectionSubjectDialog } from "@/components/section-subjects/edit-section-subject-dialog"
import { DeleteSectionSubjectDialog } from "@/components/section-subjects/delete-section-subject-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { SectionSubject } from "@/lib/api/section-subjects"

export default function SectionSubjectsPage() {
  const { data: sectionSubjectsData, isLoading } = useSectionSubjects()
  const deleteSectionSubject = useDeleteSectionSubject()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSectionSubject, setSelectedSectionSubject] = useState<SectionSubject | null>(null)

  const handleView = (sectionSubject: SectionSubject) => {
    setSelectedSectionSubject(sectionSubject)
    setViewDialogOpen(true)
  }

  const handleEdit = (sectionSubject: SectionSubject) => {
    setSelectedSectionSubject(sectionSubject)
    setEditDialogOpen(true)
  }

  const handleDelete = (sectionSubject: SectionSubject) => {
    setSelectedSectionSubject(sectionSubject)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedRows: SectionSubject[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteSectionSubject.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} section subject(s)`)
    } catch (error) {
      toast.error("Failed to delete some section subjects")
    }
  }

  const defaultColumns = [
    { field: "section.sectionName", headerName: "Section" },
    { field: "section.grade.gradeName", headerName: "Grade" },
    { field: "subject.subjectName", headerName: "Subject" },
    { field: "isElective", headerName: "Type" },
    { field: "createdAt", headerName: "Created At" },
  ]

  const sectionSubjects = sectionSubjectsData || []

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Section Subjects"
          description="Assign subjects to sections and mark them as core or elective"
        >
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Subject
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={sectionSubjects}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: SectionSubject; field: string; value: unknown }) => {
            if (field === "section.sectionName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10">
                    <BookMarked className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="font-medium">{row.section?.sectionName}</span>
                </div>
              )
            }

            if (field === "section.grade.gradeName") {
              return <span className="text-muted-foreground">{row.section?.grade?.gradeName || "—"}</span>
            }

            if (field === "subject.subjectName") {
              return <span>{row.subject?.subjectName}</span>
            }

            if (field === "isElective") {
              return row.isElective ? (
                <Badge variant="secondary">Elective</Badge>
              ) : (
                <Badge variant="default">Core</Badge>
              )
            }

            if (field === "createdAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row.createdAt), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: SectionSubject) => (
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

      <CreateSectionSubjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewSectionSubjectDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} sectionSubject={selectedSectionSubject} />
      <EditSectionSubjectDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} sectionSubject={selectedSectionSubject} />
      <DeleteSectionSubjectDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} sectionSubject={selectedSectionSubject} />
    </>
  )
}
