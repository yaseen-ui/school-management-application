"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserCog, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTeacherAssignments, useDeleteTeacherAssignment } from "@/hooks/use-teacher-assignments"
import { CreateTeacherAssignmentDialog } from "@/components/teacher-assignments/create-teacher-assignment-dialog"
import { ViewTeacherAssignmentDialog } from "@/components/teacher-assignments/view-teacher-assignment-dialog"
import { EditTeacherAssignmentDialog } from "@/components/teacher-assignments/edit-teacher-assignment-dialog"
import { DeleteTeacherAssignmentDialog } from "@/components/teacher-assignments/delete-teacher-assignment-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { TeacherAssignment } from "@/lib/api/teacher-assignments"

export default function TeacherAssignmentsPage() {
  const { data: assignmentsData, isLoading } = useTeacherAssignments()
  const deleteAssignment = useDeleteTeacherAssignment()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<TeacherAssignment | null>(null)

  const handleView = (assignment: TeacherAssignment) => {
    setSelectedAssignment(assignment)
    setViewDialogOpen(true)
  }

  const handleEdit = (assignment: TeacherAssignment) => {
    setSelectedAssignment(assignment)
    setEditDialogOpen(true)
  }

  const handleDelete = (assignment: TeacherAssignment) => {
    setSelectedAssignment(assignment)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedAssignment) return
    await deleteAssignment.mutateAsync(selectedAssignment.id)
    setDeleteDialogOpen(false)
    setSelectedAssignment(null)
  }

  const handleBulkDelete = async (selectedRows: TeacherAssignment[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteAssignment.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} assignment(s)`)
    } catch (error) {
      toast.error("Failed to delete some assignments")
    }
  }

  const defaultColumns = [
    { field: "teacher.fullName", headerName: "Teacher" },
    { field: "sectionSubject.subject.subjectName", headerName: "Subject" },
    { field: "sectionSubject.section.sectionName", headerName: "Section" },
    { field: "sectionSubject.section.grade.gradeName", headerName: "Grade" },
    { field: "academicYear.name", headerName: "Academic Year" },
    { field: "role", headerName: "Role" },
    { field: "createdAt", headerName: "Created At" },
  ]

  const assignments = assignmentsData || []

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Teacher Assignments"
          description="Assign teachers to subjects, sections, and grades for each academic year"
        >
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Assignment
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={assignments}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={(row: TeacherAssignment, field: string) => {
            if (field === "teacher.fullName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <UserCog className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.teacher?.fullName}</span>
                </div>
              )
            }

            if (field === "sectionSubject.subject.subjectName") {
              return <span>{row.sectionSubject?.subject?.subjectName}</span>
            }

            if (field === "sectionSubject.section.sectionName") {
              return <span>{row.sectionSubject?.section?.sectionName}</span>
            }

            if (field === "sectionSubject.section.grade.gradeName") {
              return <span className="text-muted-foreground">{row.sectionSubject?.section?.grade?.gradeName}</span>
            }

            if (field === "academicYear.name") {
              return <span className="text-muted-foreground">{row.academicYear?.name}</span>
            }

            if (field === "role") {
              const roleLabels: Record<string, string> = {
                subject_teacher: "Subject Teacher",
                class_teacher: "Class Teacher",
                assistant_teacher: "Assistant Teacher",
                lab_incharge: "Lab Incharge",
              }
              return (
                <Badge variant="secondary">{roleLabels[row.role] || row.role}</Badge>
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
          renderActions={(row: TeacherAssignment) => (
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

      <CreateTeacherAssignmentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewTeacherAssignmentDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} assignment={selectedAssignment} />
      <EditTeacherAssignmentDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} assignment={selectedAssignment} />
      <DeleteTeacherAssignmentDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} assignment={selectedAssignment} onConfirm={confirmDelete} />
    </>
  )
}
