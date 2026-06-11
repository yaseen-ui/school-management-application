"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GitBranch, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTeacherCapabilities, useDeleteTeacherCapability } from "@/hooks/use-teacher-capabilities"
import { CreateTeacherCapabilityDialog } from "@/components/teacher-capabilities/create-teacher-capability-dialog"
import { ViewTeacherCapabilityDialog } from "@/components/teacher-capabilities/view-teacher-capability-dialog"
import { EditTeacherCapabilityDialog } from "@/components/teacher-capabilities/edit-teacher-capability-dialog"
import { DeleteTeacherCapabilityDialog } from "@/components/teacher-capabilities/delete-teacher-capability-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { TeacherCapability } from "@/lib/api/teacher-capabilities"

export default function TeacherCapabilitiesPage() {
  const { data: capabilitiesData, isLoading } = useTeacherCapabilities()
  const deleteCapability = useDeleteTeacherCapability()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCapability, setSelectedCapability] = useState<TeacherCapability | null>(null)

  const handleView = (capability: TeacherCapability) => {
    setSelectedCapability(capability)
    setViewDialogOpen(true)
  }

  const handleEdit = (capability: TeacherCapability) => {
    setSelectedCapability(capability)
    setEditDialogOpen(true)
  }

  const handleDelete = (capability: TeacherCapability) => {
    setSelectedCapability(capability)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map((id) => deleteCapability.mutateAsync(id)))
      toast.success(`Successfully deleted ${selectedIds.length} capability(ies)`)
    } catch (error) {
      toast.error("Failed to delete some capabilities")
    }
  }

  const defaultColumns = [
    { field: "teacher.fullName", headerName: "Teacher" },
    { field: "subject.subjectName", headerName: "Subject" },
    { field: "course.courseName", headerName: "Course" },
    { field: "grade.gradeName", headerName: "Grade" },
    { field: "expertiseLevel", headerName: "Expertise Level" },
    { field: "isPrimary", headerName: "Primary" },
    { field: "priorityScore", headerName: "Priority" },
    { field: "canBeClassTeacher", headerName: "Can Be Class Teacher" },
    { field: "createdAt", headerName: "Created At" },
  ]

  const capabilities = capabilitiesData || []

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Teacher Capabilities"
          description="Define which subjects and grades each teacher is qualified to teach"
        >
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Capability
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={capabilities}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={(row: TeacherCapability, field: string) => {
            if (field === "teacher.fullName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <GitBranch className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.teacher?.fullName}</span>
                </div>
              )
            }

            if (field === "subject.subjectName") {
              return <span>{row.subject?.subjectName}</span>
            }

            if (field === "course.courseName") {
              return <span className="text-muted-foreground">{row.course?.courseName || "—"}</span>
            }

            if (field === "grade.gradeName") {
              return <span className="text-muted-foreground">{row.grade?.gradeName || "—"}</span>
            }

            if (field === "expertiseLevel") {
              const variant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
                beginner: "outline",
                intermediate: "secondary",
                advanced: "default",
                expert: "destructive",
              }
              return (
                <Badge variant={variant[row.expertiseLevel] || "secondary"}>
                  {row.expertiseLevel.charAt(0).toUpperCase() + row.expertiseLevel.slice(1)}
                </Badge>
              )
            }

            if (field === "isPrimary" || field === "canBeClassTeacher") {
              const value = field === "isPrimary" ? row.isPrimary : row.canBeClassTeacher
              return value ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>
            }

            if (field === "priorityScore") {
              return <span className="font-medium">{row.priorityScore}</span>
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
          renderActions={(row: TeacherCapability) => (
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

      <CreateTeacherCapabilityDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewTeacherCapabilityDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} capability={selectedCapability} />
      <EditTeacherCapabilityDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} capability={selectedCapability} />
      <DeleteTeacherCapabilityDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} capability={selectedCapability} />
    </>
  )
}
