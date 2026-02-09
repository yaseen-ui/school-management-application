"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGrades, useDeleteGrade } from "@/hooks/use-grades"
import { CreateGradeDialog } from "@/components/grades/create-grade-dialog"
import { ViewGradeDialog } from "@/components/grades/view-grade-dialog"
import { EditGradeDialog } from "@/components/grades/edit-grade-dialog"
import { DeleteGradeDialog } from "@/components/grades/delete-grade-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"

interface GradeData {
  gradeId: string
  tenantId: string
  courseId: string
  gradeName: string
  createdAt: string
  updatedAt: string
  courseName?: string
}

export default function GradesPage() {
  const { data, isLoading } = useGrades()
  const deleteGrade = useDeleteGrade()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<GradeData | null>(null)

  const handleView = (grade: GradeData) => {
    setSelectedGrade(grade)
    setViewDialogOpen(true)
  }

  const handleEdit = (grade: GradeData) => {
    setSelectedGrade(grade)
    setEditDialogOpen(true)
  }

  const handleDelete = (grade: GradeData) => {
    setSelectedGrade(grade)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map((id) => deleteGrade.mutateAsync(id)))
      toast.success(`Successfully deleted ${selectedIds.length} grade(s)`)
    } catch (error) {
      toast.error("Failed to delete some grades")
    }
  }

  // Default columns if API doesn't provide them
  const defaultColumns = [
    { field: "courseName", headerName: "Course Name" },
    { field: "gradeName", headerName: "Grade Name" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ]

  useEffect(() => {
    console.log("[v0] Grades data:", data)
  }, [data])

  const columns = data?.columns || defaultColumns

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Grades" description="Manage grade levels and academic standards">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Grade
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={data?.rows || []}
          apiColumns={columns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="gradeId"
          renderCell={(row: GradeData, field: string) => {
            if (field === "gradeName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.gradeName}</span>
                </div>
              )
            }

            if (field === "courseName") {
              return <span className="font-medium text-muted-foreground">{row.courseName || "N/A"}</span>
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">{format(new Date(row[field]), "MMM d, yyyy")}</span>
              )
            }

            return undefined
          }}
          renderActions={(row: GradeData) => (
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

      <CreateGradeDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewGradeDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} grade={selectedGrade} />
      <EditGradeDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} grade={selectedGrade} />
      <DeleteGradeDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} grade={selectedGrade} />
    </>
  )
}
