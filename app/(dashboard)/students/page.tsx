"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Plus, MoreHorizontal, Eye, Pencil, Trash2, Calendar } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { EmptyState } from "@/components/shared/empty-state"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStudents } from "@/hooks/use-students"
import { toast } from "@/components/ui/sonner"
import { CreateStudentWizard } from "@/components/students/create-student-wizard"
import { ViewStudentDialog } from "@/components/students/view-student-dialog"
import { DeleteStudentDialog } from "@/components/students/delete-student-dialog"
import type { Student } from "@/lib/api/students"

export default function StudentsPage() {
  const { data, isLoading } = useStudents()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const [filterValues, setFilterValues] = useState<{
    courseId?: string
    gradeId?: string
    sectionId?: string
  }>({})

  const students = Array.isArray(data?.rows) ? data.rows : []
  const apiColumns = Array.isArray(data?.columns) ? data.columns : []

  const filteredStudents = students.filter((student) => {
    if (filterValues.sectionId && student.sectionId !== filterValues.sectionId) {
      return false
    }
    if (filterValues.gradeId && !filterValues.sectionId && student.gradeId !== filterValues.gradeId) {
      return false
    }
    return true
  })

  const handleView = (student: Student) => {
    setSelectedStudent(student)
    setIsViewOpen(true)
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsCreateOpen(true)
  }

  const handleDelete = (student: Student) => {
    setSelectedStudent(student)
    setIsDeleteOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderCell = ({ row, field }: { row: Student; field: string; value: unknown }) => {
    switch (field) {
      case "firstName":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {row.firstName} {row.middleName} {row.lastName}
              </p>
              <p className="text-sm text-muted-foreground">ID: {row.id.slice(0, 8)}</p>
            </div>
          </div>
        )

      case "gender":
        return (
          <Badge variant={row.gender === "Male" ? "default" : "secondary"} className="capitalize">
            {row.gender}
          </Badge>
        )

      case "bloodGroup":
        return <Badge variant="outline">{row.bloodGroup}</Badge>

      case "dateOfBirth":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(row.dateOfBirth)}
          </div>
        )

      case "createdAt":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(row.createdAt)}
          </div>
        )

      default:
        return undefined
    }
  }

  const renderActions = (row: Student) => (
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

  const handleBulkDelete = (selectedRows: Student[]) => {
    toast.info(`Delete ${selectedRows.length} student(s)?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => {
          toast.success(`Deleted ${selectedRows.length} student(s)`)
        },
      },
    })
  }

  // Use columns from API if available, otherwise fallback to default columns
  const displayColumns = apiColumns.length > 0 ? apiColumns : [
    { field: "firstName", headerName: "Student Name" },
    { field: "dateOfBirth", headerName: "Date of Birth" },
    { field: "gender", headerName: "Gender" },
    { field: "bloodGroup", headerName: "Blood Group" },
    { field: "createdAt", headerName: "Enrolled On" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader title="Students" description="Manage student records and information">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </PageHeader>

      <Card className="p-6">
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-sm">Filter Students</h3>
          <p className="text-sm text-muted-foreground">Filter by course, grade, and section</p>
        </div>
        <HierarchicalFilter
          filters={["courses", "grades", "sections"]}
          values={filterValues}
          onChange={setFilterValues}
          labels={{
            courseId: "Course",
            gradeId: "Grade",
            sectionId: "Section",
          }}
          compact
        />
        {(filterValues.courseId || filterValues.gradeId || filterValues.sectionId) && (
          <div className="mt-4 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setFilterValues({})}>
              Clear Filters
            </Button>
            <p className="text-sm text-muted-foreground">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          </div>
        )}
      </Card>

      {!isLoading && students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students yet"
          description="Get started by adding your first student to the system."
          action={{
            label: "Add Student",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : (
        <DynamicDataTable<Record<string, unknown>>
          data={filteredStudents as unknown as Record<string, unknown>[]}
          apiColumns={displayColumns}
          renderCell={renderCell as any}
          renderActions={renderActions as any}
          onBulkDelete={handleBulkDelete as any}
          isLoading={isLoading}
          searchPlaceholder="Search students..."
          idField="id"
        />
      )}

      <CreateStudentWizard open={isCreateOpen} onOpenChange={setIsCreateOpen} studentToEdit={selectedStudent} />
      <ViewStudentDialog open={isViewOpen} onOpenChange={setIsViewOpen} student={selectedStudent} />
      <DeleteStudentDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} student={selectedStudent} />
    </motion.div>
  )
}
