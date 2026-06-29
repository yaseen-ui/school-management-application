"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { BookMarked, Eye, Pencil, Trash2, Plus, MoreVertical, Layers } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useSectionSubjects, useDeleteSectionSubject } from "@/hooks/use-section-subjects"
import { CreateSectionSubjectDialog } from "@/components/section-subjects/create-section-subject-dialog"
import { ViewSectionSubjectDialog } from "@/components/section-subjects/view-section-subject-dialog"
import { EditSectionSubjectDialog } from "@/components/section-subjects/edit-section-subject-dialog"
import { DeleteSectionSubjectDialog } from "@/components/section-subjects/delete-section-subject-dialog"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { toast } from "@/components/ui/sonner"
import type { SectionSubject } from "@/lib/api/section-subjects"

interface GroupedSection {
  sectionId: string
  sectionName: string
  gradeName: string
  subjects: SectionSubject[]
}

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

  // Group section-subjects by section
  const groupedSections = useMemo<GroupedSection[]>(() => {
    const data = sectionSubjectsData || []
    const map = new Map<string, GroupedSection>()

    for (const item of data) {
      const sectionId = item.sectionId
      if (!map.has(sectionId)) {
        map.set(sectionId, {
          sectionId,
          sectionName: item.section?.sectionName || "Unknown",
          gradeName: item.section?.grade?.gradeName || "—",
          subjects: [],
        })
      }
      map.get(sectionId)!.subjects.push(item)
    }

    return Array.from(map.values())
  }, [sectionSubjectsData])

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

  const handleFilterChange = (values: { courseId?: string; gradeId?: string }) => {
    setCourseId(values.courseId || "")
    setGradeId(values.gradeId || "")
  }

  const coreSubjects = (subjects: SectionSubject[]) => subjects.filter((s) => !s.isElective)
  const electiveSubjects = (subjects: SectionSubject[]) => subjects.filter((s) => s.isElective)

  return (
    <>
      <Breadcrumbs items={[{ label: "Staff & Curriculum", href: "/staff-curriculum" }, { label: "Section Subjects" }]} />
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

        {/* Hierarchical Filter */}
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

        {/* Section-wise grouped table */}
        {isLoading ? (
          <TableSkeleton />
        ) : groupedSections.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No section subjects found"
            description={
              courseId || gradeId
                ? "Try changing the filter criteria to see more results."
                : "Get started by assigning subjects to sections."
            }
            action={
              !courseId && !gradeId
                ? { label: "Assign Subject", onClick: () => setCreateDialogOpen(true) }
                : undefined
            }
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Section</TableHead>
                    <TableHead className="w-[150px]">Grade</TableHead>
                    <TableHead>Core Subjects</TableHead>
                    <TableHead>Elective Subjects</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedSections.map((group) => (
                    <TableRow key={group.sectionId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10">
                            <BookMarked className="h-4 w-4 text-amber-600" />
                          </div>
                          <span className="font-medium">{group.sectionName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{group.gradeName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {coreSubjects(group.subjects).length > 0 ? (
                            coreSubjects(group.subjects).map((item) => (
                              <Badge key={item.id} variant="default" className="cursor-pointer" onClick={() => handleView(item)}>
                                {item.subject?.subjectName}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {electiveSubjects(group.subjects).length > 0 ? (
                            electiveSubjects(group.subjects).map((item) => (
                              <Badge
                                key={item.id}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => handleView(item)}
                              >
                                {item.subject?.subjectName}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {group.subjects.length === 1 ? (
                              <>
                                <DropdownMenuItem onClick={() => handleView(group.subjects[0])}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(group.subjects[0])}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(group.subjects[0])}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => {
                                  const first = group.subjects[0]
                                  setSelectedSectionSubject(first)
                                  setViewDialogOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Subjects
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
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
