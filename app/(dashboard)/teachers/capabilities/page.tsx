"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { GitBranch, Eye, Pencil, Trash2, Plus, MoreVertical, BookOpen } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTeacherCapabilities, useDeleteTeacherCapability } from "@/hooks/use-teacher-capabilities"
import { useTeachers } from "@/hooks/use-teachers"
import { CreateTeacherCapabilityDialog } from "@/components/teacher-capabilities/create-teacher-capability-dialog"
import { ViewTeacherCapabilityDialog } from "@/components/teacher-capabilities/view-teacher-capability-dialog"
import { EditTeacherCapabilityDialog } from "@/components/teacher-capabilities/edit-teacher-capability-dialog"
import { DeleteTeacherCapabilityDialog } from "@/components/teacher-capabilities/delete-teacher-capability-dialog"
import { toast } from "@/components/ui/sonner"
import type { TeacherCapability } from "@/lib/api/teacher-capabilities"

export default function TeacherCapabilitiesPage() {
  const { data: capabilitiesData, isLoading } = useTeacherCapabilities()
  const { data: teachersData } = useTeachers()
  const deleteCapability = useDeleteTeacherCapability()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createDialogTeacherId, setCreateDialogTeacherId] = useState<string | undefined>(undefined)
  const [createDialogDefaultData, setCreateDialogDefaultData] = useState<{
    courseId?: string
    gradeIds: string[]
    subjects: Array<{
      subjectId: string
      expertiseLevel: "beginner" | "intermediate" | "advanced" | "expert"
      isPrimary: boolean
      priorityScore: number
      canBeClassTeacher: boolean
      remarks: string | null
    }>
  } | undefined>(undefined)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCapability, setSelectedCapability] = useState<TeacherCapability | null>(null)

  const teachers = teachersData || []
  const capabilities = capabilitiesData || []

  // Group capabilities by teacher
  const teacherCapabilityMap = useMemo(() => {
    const map: Record<string, TeacherCapability[]> = {}
    capabilities.forEach((cap) => {
      const teacherId = cap.teacherId
      if (!map[teacherId]) map[teacherId] = []
      map[teacherId].push(cap)
    })
    return map
  }, [capabilities])

  // Build teacher rows with their subjects
  const teacherRows = useMemo(() => {
    return teachers.map((teacher: any) => {
      const teacherCaps = teacherCapabilityMap[teacher.id] || []
      const subjects = teacherCaps.map((cap) => cap.subject?.subjectName).filter(Boolean)
      const uniqueSubjects = [...new Set(subjects)]
      return {
        id: teacher.id,
        teacherId: teacher.id,
        teacherName: teacher.fullName,
        employeeCode: teacher.employeeCode,
        subjects: uniqueSubjects,
        subjectCount: uniqueSubjects.length,
        capabilityCount: teacherCaps.length,
        capabilities: teacherCaps,
      }
    })
  }, [teachers, teacherCapabilityMap])

  const defaultColumns = [
    { field: "teacherName", headerName: "Teacher" },
    { field: "subjects", headerName: "Subjects" },
    { field: "subjectCount", headerName: "Subject Count" },
    { field: "capabilityCount", headerName: "Total Capabilities" },
  ]

  const handleView = (row: any) => {
    if (row.capabilities && row.capabilities.length > 0) {
      setSelectedCapability(row.capabilities[0])
      setViewDialogOpen(true)
    }
  }

  const handleEdit = (row: any) => {
    // Open the create dialog with the teacher pre-selected and existing data pre-filled
    setCreateDialogTeacherId(row.teacherId)
    if (row.capabilities && row.capabilities.length > 0) {
      const caps = row.capabilities as TeacherCapability[]
      const courseId = caps.find((c) => c.courseId)?.courseId || undefined
      const gradeIds = [...new Set(caps.map((c) => c.gradeId).filter(Boolean))] as string[]
      const subjects = caps.map((c) => ({
        subjectId: c.subjectId,
        expertiseLevel: c.expertiseLevel,
        isPrimary: c.isPrimary,
        priorityScore: c.priorityScore,
        canBeClassTeacher: c.canBeClassTeacher,
        remarks: c.remarks || null,
      }))
      setCreateDialogDefaultData({ courseId, gradeIds, subjects })
    } else {
      setCreateDialogDefaultData(undefined)
    }
    setCreateDialogOpen(true)
  }

  const handleDelete = (row: any) => {
    if (row.capabilities && row.capabilities.length > 0) {
      setSelectedCapability(row.capabilities[0])
      setDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedCapability) return
    try {
      await deleteCapability.mutateAsync(selectedCapability.id)
      toast.success("Teacher capability deleted successfully")
      setDeleteDialogOpen(false)
      setSelectedCapability(null)
    } catch (error) {
      toast.error("Failed to delete teacher capability")
    }
  }

  const handleBulkDelete = async (selectedRows: any[]) => {
    try {
      const ids = selectedRows.map((row) => row.id)
      await Promise.all(ids.map((id) => deleteCapability.mutateAsync(id)))
      toast.success(`Successfully deleted ${ids.length} capability(ies)`)
    } catch (error) {
      toast.error("Failed to delete some capabilities")
    }
  }

  const renderCell = ({ row, field }: { row: any; field: string; value: unknown }) => {
    if (field === "teacherName") {
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <GitBranch className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-medium">{row.teacherName}</span>
            {row.employeeCode && (
              <p className="text-xs text-muted-foreground">{row.employeeCode}</p>
            )}
          </div>
        </div>
      )
    }

    if (field === "subjects") {
      return (
        <div className="flex flex-wrap gap-1">
          {row.subjects.length > 0 ? (
            row.subjects.map((subject: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                <BookOpen className="mr-1 h-3 w-3" />
                {subject}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No capabilities</span>
          )}
        </div>
      )
    }

    if (field === "subjectCount") {
      return <span className="font-medium">{row.subjectCount}</span>
    }

    if (field === "capabilityCount") {
      return <span className="font-medium">{row.capabilityCount}</span>
    }

    return undefined
  }

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
          data={teacherRows}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={renderCell}
          renderActions={(row: any) => (
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
                  Update
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

      <CreateTeacherCapabilityDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open)
          if (!open) {
            setCreateDialogTeacherId(undefined)
            setCreateDialogDefaultData(undefined)
          }
        }}
        defaultTeacherId={createDialogTeacherId}
        defaultData={createDialogDefaultData}
      />
      <ViewTeacherCapabilityDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} capability={selectedCapability} />
      <EditTeacherCapabilityDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} capability={selectedCapability} />
      <DeleteTeacherCapabilityDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} capability={selectedCapability} onConfirm={handleConfirmDelete} />
    </>
  )
}
