"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Plus, MoreHorizontal, Eye, Pencil, Trash2, Calendar } from "lucide-react"
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
import { useCourses } from "@/hooks/use-courses"
import { toast } from "@/components/ui/sonner"
import { CreateCourseDialog } from "@/components/courses/create-course-dialog"
import { ViewCourseDialog } from "@/components/courses/view-course-dialog"
import { EditCourseDialog } from "@/components/courses/edit-course-dialog"
import { DeleteCourseDialog } from "@/components/courses/delete-course-dialog"
import type { Course } from "@/lib/api/courses"

export default function CoursesPage() {
  const { data, isLoading } = useCourses()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const courses = (data?.data?.rows || []) as Course[]
  const apiColumns: ApiColumn[] = data?.data?.columns || [
    { field: "courseName", headerName: "Course Name" },
    { field: "description", headerName: "Description" },
    { field: "grades", headerName: "Grades" },
    { field: "createdAt", headerName: "Created At" },
  ]

  const handleView = (course: Course) => {
    setSelectedCourse(course)
    setIsViewOpen(true)
  }

  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setIsEditOpen(true)
  }

  const handleDelete = (course: Course) => {
    setSelectedCourse(course)
    setIsDeleteOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderCell = ({ row, field, value }: { row: Course; field: string; value: unknown }) => {
    switch (field) {
      case "courseName":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{row.courseName}</p>
            </div>
          </div>
        )

      case "description":
        return (
          <p className="text-sm text-muted-foreground max-w-[300px] truncate" title={row.description}>
            {row.description}
          </p>
        )

      case "grades":
        if (!row.grades || row.grades.length === 0) {
          return <span className="text-sm text-muted-foreground">No grades assigned</span>
        }
        return (
          <div className="flex flex-wrap gap-1.5">
            {row.grades.slice(0, 3).map((grade, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {grade}
              </Badge>
            ))}
            {row.grades.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{row.grades.length - 3} more
              </Badge>
            )}
          </div>
        )

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

  const renderActions = (row: Course) => (
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

  const handleBulkDelete = (selectedRows: Course[]) => {
    toast.info(`Delete ${selectedRows.length} course(s)?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => {
          toast.success(`Deleted ${selectedRows.length} course(s)`)
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
      <PageHeader title="Courses" description="Manage courses offered by your institute">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </PageHeader>

      {!isLoading && courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Get started by adding your first course to the curriculum."
          action={{
            label: "Add Course",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : (
        <DynamicDataTable
          data={courses}
          apiColumns={apiColumns}
          renderCell={renderCell}
          renderActions={renderActions}
          onBulkDelete={handleBulkDelete}
          isLoading={isLoading}
          searchPlaceholder="Search courses..."
          idField="id"
        />
      )}

      <CreateCourseDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <ViewCourseDialog open={isViewOpen} onOpenChange={setIsViewOpen} course={selectedCourse} />
      <EditCourseDialog open={isEditOpen} onOpenChange={setIsEditOpen} course={selectedCourse} />
      <DeleteCourseDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} course={selectedCourse} />
    </motion.div>
  )
}
