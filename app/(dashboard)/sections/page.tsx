"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, Plus, MoreHorizontal, Eye, Pencil, Trash2, Calendar, DoorOpen } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable, type ApiColumn } from "@/components/shared/dynamic-data-table"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSections } from "@/hooks/use-sections"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { toast } from "@/components/ui/sonner"
import { ViewSectionDialog } from "@/components/sections/view-section-dialog"
import { DeleteSectionDialog } from "@/components/sections/delete-section-dialog"
import type { Section } from "@/lib/api/sections"

export default function SectionsPage() {
  const router = useRouter()
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedGradeId, setSelectedGradeId] = useState<string>("")

  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades(selectedCourseId || undefined)
  const effectiveGradeId = selectedGradeId || undefined
  const effectiveCourseId = selectedCourseId || undefined
  const { data, isLoading } = useSections(effectiveGradeId, effectiveCourseId)

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)

  const courses: any[] = (coursesData as any)?.data?.rows || (coursesData as any)?.data || []
  const grades: any[] = (gradesData as any)?.rows || (gradesData as any)?.data?.rows || []
  const sections = (data?.data?.rows || []) as Section[]

  // Auto-select first course
  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id)
    }
  }, [courses, selectedCourseId])

  // Reset grade when course changes
  useEffect(() => {
    setSelectedGradeId("")
  }, [selectedCourseId])

  const apiColumns: ApiColumn[] = data?.data?.columns || [
    { field: "sectionName", headerName: "Section Name" },
    { field: "grade.gradeName", headerName: "Grade" },
    { field: "createdAt", headerName: "Created At" },
  ]

  const handleView = (section: Section) => {
    setSelectedSection(section)
    setIsViewOpen(true)
  }

  const handleEdit = (section: Section) => {
    router.push(`/sections/${section.id}/edit`)
  }

  const handleDelete = (section: Section) => {
    setSelectedSection(section)
    setIsDeleteOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderCell = ({ row, field, value }: { row: Section; field: string; value: unknown }) => {
    switch (field) {
      case "sectionName":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{row.sectionName}</p>
            </div>
          </div>
        )

      case "grade.gradeName":
        return <Badge variant="secondary">{row.grade?.gradeName || "N/A"}</Badge>

      case "room.roomNumber":
      case "room":
        if (!row.room) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <div className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{row.room.roomNumber}</p>
              <p className="text-xs text-muted-foreground">
                {row.room.floor.building.name} / {row.room.floor.name ?? `Floor ${row.room.floor.floorNumber}`}
              </p>
            </div>
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

  const renderActions = (row: Section) => (
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

  const handleBulkDelete = (selectedRows: Section[]) => {
    toast.info(`Delete ${selectedRows.length} section(s)?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => {
          toast.success(`Deleted ${selectedRows.length} section(s)`)
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
      <PageHeader title="Sections" description="Manage sections and class divisions in your institute">
        <Button onClick={() => router.push("/sections/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </PageHeader>

      {/* Course & Grade Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course: any) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Grade</label>
              <Select value={selectedGradeId || "all"} onValueChange={(v) => setSelectedGradeId(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All grades</SelectItem>
                  {grades.map((grade: any) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.gradeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isLoading && sections.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No sections yet"
          description="Get started by creating your first section for students."
          action={{
            label: "Add Section",
            onClick: () => router.push("/sections/create"),
          }}
        />
      ) : (
        <DynamicDataTable
          data={sections}
          apiColumns={apiColumns}
          renderCell={renderCell}
          renderActions={renderActions}
          onBulkDelete={handleBulkDelete}
          isLoading={isLoading}
          searchPlaceholder="Search sections..."
          idField="id"
        />
      )}

      <ViewSectionDialog open={isViewOpen} onOpenChange={setIsViewOpen} section={selectedSection} />
      <DeleteSectionDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} section={selectedSection} />
    </motion.div>
  )
}
