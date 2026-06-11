"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookMarked, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSubjectOfferings, useDeleteSubjectOffering } from "@/hooks/use-subject-offerings"
import { CreateSubjectOfferingDialog } from "@/components/subject-offerings/create-subject-offering-dialog"
import { ViewSubjectOfferingDialog } from "@/components/subject-offerings/view-subject-offering-dialog"
import { EditSubjectOfferingDialog } from "@/components/subject-offerings/edit-subject-offering-dialog"
import { DeleteSubjectOfferingDialog } from "@/components/subject-offerings/delete-subject-offering-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { SubjectOffering } from "@/lib/api/subject-offerings"

export default function SubjectOfferingsPage() {
  const { data: offeringsData, isLoading } = useSubjectOfferings()
  const deleteOffering = useDeleteSubjectOffering()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedOffering, setSelectedOffering] = useState<SubjectOffering | null>(null)

  const handleView = (offering: SubjectOffering) => {
    setSelectedOffering(offering)
    setViewDialogOpen(true)
  }

  const handleEdit = (offering: SubjectOffering) => {
    setSelectedOffering(offering)
    setEditDialogOpen(true)
  }

  const handleDelete = (offering: SubjectOffering) => {
    setSelectedOffering(offering)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map((id) => deleteOffering.mutateAsync(id)))
      toast.success(`Successfully deleted ${selectedIds.length} subject offering(s)`)
    } catch (error) {
      toast.error("Failed to delete some subject offerings")
    }
  }

  const defaultColumns = [
    { field: "subject.subjectName", headerName: "Subject" },
    { field: "course.courseName", headerName: "Course" },
    { field: "grade.gradeName", headerName: "Grade" },
    { field: "scope", headerName: "Scope" },
    { field: "isElective", headerName: "Is Elective" },
    { field: "weeklyPeriods", headerName: "Weekly Periods" },
    { field: "status", headerName: "Status" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ]

  const offerings = offeringsData || []

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Subject Offerings" description="Manage which subjects are offered for courses and grades">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject Offering
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={offerings}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={(row: SubjectOffering, field: string) => {
            if (field === "subject.subjectName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <BookMarked className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.subject?.subjectName}</span>
                </div>
              )
            }

            if (field === "course.courseName") {
              return <span className="text-muted-foreground">{row.course?.courseName || "All Courses"}</span>
            }

            if (field === "grade.gradeName") {
              return <span className="text-muted-foreground">{row.grade?.gradeName || "All Grades"}</span>
            }

            if (field === "scope") {
              const scopeLabels: Record<string, string> = {
                all_courses_all_grades: "All Courses & Grades",
                course_all_grades: "Course - All Grades",
                grade_all_courses: "Grade - All Courses",
                course_grade: "Specific Course & Grade",
              }
              return <span className="text-sm">{scopeLabels[row.scope] || row.scope}</span>
            }

            if (field === "isElective") {
              return <Badge variant={row.isElective ? "secondary" : "outline"}>{row.isElective ? "Elective" : "Core"}</Badge>
            }

            if (field === "weeklyPeriods") {
              return <span className="font-medium">{row.weeklyPeriods || "—"}</span>
            }

            if (field === "status") {
              const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
                active: "default",
                inactive: "secondary",
                suspended: "destructive",
              }
              return (
                <Badge variant={statusVariant[row.status] || "secondary"}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof SubjectOffering] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: SubjectOffering) => (
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

      <CreateSubjectOfferingDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewSubjectOfferingDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} offering={selectedOffering} />
      <EditSubjectOfferingDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} offering={selectedOffering} />
      <DeleteSubjectOfferingDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} offering={selectedOffering} />
    </>
  )
}
