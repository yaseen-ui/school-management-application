"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSubjects, useDeleteSubject } from "@/hooks/use-subjects"
import { CreateSubjectDialog } from "@/components/subjects/create-subject-dialog"
import { ViewSubjectDialog } from "@/components/subjects/view-subject-dialog"
import { EditSubjectDialog } from "@/components/subjects/edit-subject-dialog"
import { DeleteSubjectDialog } from "@/components/subjects/delete-subject-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { Subject } from "@/lib/api/subjects"

export default function SubjectsPage() {
  const { data: subjectsData, isLoading } = useSubjects()
  const deleteSubject = useDeleteSubject()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  const handleView = (subject: Subject) => {
    setSelectedSubject(subject)
    setViewDialogOpen(true)
  }

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject)
    setEditDialogOpen(true)
  }

  const handleDelete = (subject: Subject) => {
    setSelectedSubject(subject)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map((id) => deleteSubject.mutateAsync(id)))
      toast.success(`Successfully deleted ${selectedIds.length} subject(s)`)
    } catch (error) {
      toast.error("Failed to delete some subjects")
    }
  }

  // Default columns matching API response
  const defaultColumns = [
    { field: "subjectName", headerName: "Subject Name" },
    { field: "courseName", headerName: "Course" },
    { field: "isCommon", headerName: "Availability" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ]

  const subjects = subjectsData || []

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Subjects" description="Manage academic subjects and their availability">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={subjects}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={(row: Subject, field: string) => {
            if (field === "subjectName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.subjectName}</span>
                </div>
              )
            }

            if (field === "courseName") {
              return <span className="font-medium text-muted-foreground">{row.courseName || "N/A"}</span>
            }

            if (field === "isCommon") {
              return (
                <Badge variant={row.isCommon ? "default" : "secondary"}>{row.isCommon ? "Common" : "Specific"}</Badge>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">{format(new Date(row[field]), "MMM d, yyyy")}</span>
              )
            }

            return undefined
          }}
          renderActions={(row: Subject) => (
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

      <CreateSubjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewSubjectDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} subject={selectedSubject} />
      <EditSubjectDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} subject={selectedSubject} />
      <DeleteSubjectDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} subject={selectedSubject} />
    </>
  )
}
