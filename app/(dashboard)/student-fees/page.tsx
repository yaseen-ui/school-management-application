"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserCheck, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStudentFees, useDeleteStudentFee } from "@/hooks/use-fees"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { CreateStudentFeeDialog } from "@/components/fees/create-student-fee-dialog"
import { ViewStudentFeeDialog } from "@/components/fees/view-student-fee-dialog"
import { EditStudentFeeDialog } from "@/components/fees/edit-student-fee-dialog"
import { DeleteStudentFeeDialog } from "@/components/fees/delete-student-fee-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import type { StudentFee } from "@/lib/api/fees"
import type { Course } from "@/lib/api/courses"
import type { Grade } from "@/lib/api/grades"
import type { Section } from "@/lib/api/sections"

export default function StudentFeesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedGradeId, setSelectedGradeId] = useState<string>("")
  const [selectedSectionId, setSelectedSectionId] = useState<string>("")

  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades(selectedCourseId || undefined)
  const { data: sectionsData } = useSections(selectedGradeId || undefined)

  const courses: Course[] = coursesData?.data?.rows || []
  const grades: Grade[] = (gradesData as { rows: Grade[] } | undefined)?.rows || []
  const sections: Section[] = sectionsData?.data?.rows || []

  const filters: Record<string, string> = {}
  if (selectedSectionId) {
    filters.sectionId = selectedSectionId
  }

  const { data, isLoading } = useStudentFees(selectedSectionId ? filters : undefined)
  const deleteStudentFee = useDeleteStudentFee()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStudentFee, setSelectedStudentFee] = useState<StudentFee | null>(null)

  const studentFees: StudentFee[] = data || []

  const handleView = (studentFee: StudentFee) => {
    setSelectedStudentFee(studentFee)
    setViewDialogOpen(true)
  }

  const handleEdit = (studentFee: StudentFee) => {
    setSelectedStudentFee(studentFee)
    setEditDialogOpen(true)
  }

  const handleDelete = (studentFee: StudentFee) => {
    setSelectedStudentFee(studentFee)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedRows: StudentFee[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteStudentFee.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} student fee(s)`)
    } catch (error) {
      toast.error("Failed to delete some student fees")
    }
  }

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId)
    setSelectedGradeId("")
    setSelectedSectionId("")
  }

  const handleGradeChange = (gradeId: string) => {
    setSelectedGradeId(gradeId)
    setSelectedSectionId("")
  }

  const handleSectionChange = (sectionId: string) => {
    setSelectedSectionId(sectionId)
  }

  const defaultColumns = [
    { field: "student", headerName: "Student" },
    { field: "section", headerName: "Section" },
    { field: "academicYear", headerName: "Academic Year" },
    { field: "totalActualFee", headerName: "Actual Fee" },
    { field: "totalNegotiatedFee", headerName: "Negotiated Fee" },
    { field: "totalPaid", headerName: "Paid Amount" },
    { field: "totalRefunded", headerName: "Refunded" },
    { field: "balance", headerName: "Balance" },

    { field: "nextDueDate", headerName: "Next Due Date" },
    { field: "discountType", headerName: "Discount" },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Student Fees" description="Manage individual student fee records">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student Fee
          </Button>
        </PageHeader>

        {/* Hierarchical Filters */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Course</label>
            <Select value={selectedCourseId} onValueChange={handleCourseChange}>
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Grade</label>
            <Select
              value={selectedGradeId}
              onValueChange={handleGradeChange}
              disabled={!selectedCourseId}
            >
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder={selectedCourseId ? "Select Grade" : "Select Course First"} />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.gradeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Section</label>
            <Select
              value={selectedSectionId}
              onValueChange={handleSectionChange}
              disabled={!selectedGradeId}
            >
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder={selectedGradeId ? "Select Section" : "Select Grade First"} />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.sectionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSectionId && (
            <div className="flex items-end pb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCourseId("")
                  setSelectedGradeId("")
                  setSelectedSectionId("")
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <DynamicDataTable
          data={studentFees}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: StudentFee; field: string; value: unknown }) => {
            if (field === "student") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <UserCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.enrollment?.student?.firstName} {row.enrollment?.student?.lastName}</span>
                </div>
              )
            }

            if (field === "section") {
              return <span className="text-sm">{row.enrollment?.section?.sectionName || "—"}</span>
            }

            if (field === "academicYear") {
              return <span className="text-sm">—</span>
            }

            if (field === "totalActualFee") {
              return <span className="text-sm font-medium">₹{row.totalActualFee.toLocaleString()}</span>
            }

            if (field === "totalNegotiatedFee") {
              return <span className="text-sm font-medium">₹{row.totalNegotiatedFee.toLocaleString()}</span>
            }

            if (field === "totalPaid") {
              return (
                <span className="text-sm font-medium text-green-600">
                  ₹{row.totalPaid.toLocaleString()}
                </span>
              )
            }

            if (field === "totalRefunded") {
              return (
                <span className="text-sm font-medium text-red-500">
                  ₹{row.totalRefunded.toLocaleString()}
                </span>
              )
            }

            if (field === "balance") {

              const isOverdue = row.balance > 0 && row.nextDueDate && new Date(row.nextDueDate) < new Date()
              return (
                <span className={`text-sm font-medium ${row.balance === 0 ? "text-green-600" : isOverdue ? "text-red-600" : "text-amber-600"}`}>
                  {row.balance === 0 ? "₹0" : `₹${row.balance.toLocaleString()}`}
                </span>
              )
            }

            if (field === "nextDueDate") {
              if (!row.nextDueDate) return <span className="text-sm text-muted-foreground">—</span>
              const dueDate = new Date(row.nextDueDate)
              const isOverdue = dueDate < new Date()
              return (
                <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                  {format(dueDate, "MMM d, yyyy")}
                </span>
              )
            }

            if (field === "discountType") {
              return (
                <span className="text-sm">{row.discountType || "—"}</span>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof StudentFee] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: StudentFee) => (
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

      <CreateStudentFeeDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewStudentFeeDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} studentFee={selectedStudentFee} />
      <EditStudentFeeDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} studentFee={selectedStudentFee} />
      <DeleteStudentFeeDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} studentFee={selectedStudentFee} />
    </>
  )
}
