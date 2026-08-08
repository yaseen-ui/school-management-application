"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { BookMarked, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSectionSubjects, useDeleteSectionSubject } from "@/hooks/use-section-subjects"
import { CreateSectionSubjectDialog } from "@/components/section-subjects/create-section-subject-dialog"
import { ViewSectionSubjectDialog } from "@/components/section-subjects/view-section-subject-dialog"
import { EditSectionSubjectDialog } from "@/components/section-subjects/edit-section-subject-dialog"
import { DeleteSectionSubjectDialog } from "@/components/section-subjects/delete-section-subject-dialog"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { SectionSubject } from "@/lib/api/section-subjects"

export default function SectionSubjectsPage() {
  const [courseId, setCourseId] = useState<string>("")
  const [gradeId, setGradeId] = useState<string>("")

  const filters = useMemo(() => {
    const f: Record<string, string> = {}
    if (courseId) f.courseId = courseId
    if (gradeId) f.gradeId = gradeId
    return f
  }, [courseId, gradeId])

  const { data: sectionSubjectsData, isLoading } = useSectionSubjects(
    Object.keys(filters).length > 0 ? filters : undefined,
  )
  const deleteSectionSubject = useDeleteSectionSubject()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSectionSubject, setSelectedSectionSubject] = useState<SectionSubject | null>(null)

  const sectionSubjects = sectionSubjectsData || []

  const handleView = (sectionSubject: SectionSubject) => {
    setSelectedSectionSubject(sectionSubject)
    setViewDialogOpen(true)
  }

  const handleEdit = (sectionSubject: SectionSubject) => {
    setSelectedSectionSubject(sectionSubject)
    setEditDialogOpen(true)
  }

  const handleDelete = (sectionSubject: SectionSubject) => {
    setSelectedSectionSubject(sectionSubject)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedRows: SectionSubject[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteSectionSubject.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} assignment(s)`)
    } catch {
      toast.error("Failed to delete some section subjects")
    }
  }

  const handleFilterChange = (values: { courseId?: string; gradeId?: string }) => {
    setCourseId(values.courseId || "")
    setGradeId(values.gradeId || "")
  }

  const defaultColumns = [
    { field: "section.sectionName", headerName: "Section" },
    { field: "section.grade.gradeName", headerName: "Grade" },
    { field: "subject.subjectName", headerName: "Subject" },
    { field: "isElective", headerName: "Type" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Staff & Curriculum", href: "/staff-curriculum" },
          { label: "Section Subjects" },
        ]}
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Section Subjects"
          description="Assign subjects to sections and mark them as core or elective"
        >
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Subject
          </Button>
        </PageHeader>

        <Card>
          <CardContent className="pt-6">
            <HierarchicalFilter
              filters={["courses", "grades"]}
              onChange={handleFilterChange}
              labels={{
                courseId: "Course",
                gradeId: "Grade",
              }}
            />
          </CardContent>
        </Card>

        <DynamicDataTable
          data={sectionSubjects}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          searchPlaceholder="Search section subjects..."
          renderCell={({ row, field }: { row: SectionSubject; field: string; value: unknown }) => {
            if (field === "section.sectionName") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10">
                    <BookMarked className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="font-medium">{row.section?.sectionName || "—"}</span>
                </div>
              )
            }

            if (field === "section.grade.gradeName") {
              return (
                <span className="text-muted-foreground">{row.section?.grade?.gradeName || "—"}</span>
              )
            }

            if (field === "subject.subjectName") {
              return <span className="font-medium">{row.subject?.subjectName || "—"}</span>
            }

            if (field === "isElective") {
              return (
                <Badge variant={row.isElective ? "secondary" : "default"}>
                  {row.isElective ? "Elective" : "Core"}
                </Badge>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              const value = row[field as "createdAt" | "updatedAt"]
              return (
                <span className="text-sm text-muted-foreground">
                  {value ? format(new Date(value), "MMM d, yyyy") : "—"}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: SectionSubject) => (
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
                <DropdownMenuItem
                  onClick={() => handleDelete(row)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <CreateSectionSubjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewSectionSubjectDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        sectionSubject={selectedSectionSubject}
      />
      <EditSectionSubjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        sectionSubject={selectedSectionSubject}
      />
      <DeleteSectionSubjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        sectionSubject={selectedSectionSubject}
      />
    </>
  )
}
