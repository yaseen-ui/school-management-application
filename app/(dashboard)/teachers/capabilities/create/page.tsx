"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { useCreateBulkTeacherCapabilities } from "@/hooks/use-teacher-capabilities"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import {
  Loader2,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Layers,
  Users,
  ArrowLeft,
  Save,
} from "lucide-react"
import type { SubjectCapabilityConfig } from "@/lib/api/teacher-capabilities"
import { toast } from "@/components/ui/sonner"

// ---- Types for the nested structure ----
interface SubjectEntry extends SubjectCapabilityConfig {}

interface SectionEntry {
  sectionId: string
  sectionName: string
  subjects: SubjectEntry[]
}

interface GradeEntry {
  gradeId: string
  gradeName: string
  sections: SectionEntry[]
  expanded: boolean
}

interface CourseEntry {
  courseId: string
  courseName: string
  grades: GradeEntry[]
  expanded: boolean
}

export default function CreateTeacherCapabilitiesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [courses, setCourses] = useState<CourseEntry[]>([])
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])

  const teacherIdFromQuery = searchParams.get("teacherId")

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<{ teacherId: string }>({
    defaultValues: { teacherId: teacherIdFromQuery || "" },
  })

  const createBulkCapabilities = useCreateBulkTeacherCapabilities()
  const { data: teachersData } = useTeachers()
  const { data: coursesData } = useCourses()
  const { data: allGradesData } = useGrades()
  const { data: allSubjectsData } = useSubjects()
  const { data: allSectionsData } = useSections()

  const teachers = teachersData || []
  const allCourses = coursesData?.data?.rows || []
  const allGrades = allGradesData?.rows || []
  const allSubjects = allSubjectsData || []
  const allSections = allSectionsData?.data?.rows || allSectionsData || []

  const selectedTeacherId = watch("teacherId")

  // ---- Course management ----
  const addCourse = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) return
    const course = allCourses.find((c: any) => c.id === courseId)
    if (!course) return

    setCourses((prev) => [
      ...prev,
      {
        courseId,
        courseName: course.courseName,
        grades: [],
        expanded: true,
      },
    ])
    setSelectedCourseIds((prev) => [...prev, courseId])
  }

  const removeCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.courseId !== courseId))
    setSelectedCourseIds((prev) => prev.filter((id) => id !== courseId))
  }

  const toggleCourseExpanded = (courseId: string) => {
    setCourses((prev) => prev.map((c) => (c.courseId === courseId ? { ...c, expanded: !c.expanded } : c)))
  }

  // ---- Grade management ----
  const addGrade = (courseId: string, gradeId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        if (course.grades.find((g) => g.gradeId === gradeId)) return course
        const grade = allGrades.find((g: any) => g.id === gradeId)
        return {
          ...course,
          grades: [
            ...course.grades,
            { gradeId, gradeName: grade?.gradeName || "", sections: [], expanded: true },
          ],
        }
      })
    )
  }

  const removeGrade = (courseId: string, gradeId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        return { ...course, grades: course.grades.filter((g) => g.gradeId !== gradeId) }
      })
    )
  }

  const toggleGradeExpanded = (courseId: string, gradeId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        return {
          ...course,
          grades: course.grades.map((g) => (g.gradeId === gradeId ? { ...g, expanded: !g.expanded } : g)),
        }
      })
    )
  }

  // ---- Section management ----
  const addSection = (courseId: string, gradeId: string, sectionId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        return {
          ...course,
          grades: course.grades.map((grade) => {
            if (grade.gradeId !== gradeId) return grade
            if (grade.sections.find((s) => s.sectionId === sectionId)) return grade
            const section = allSectionsForGrade(gradeId).find((s: any) => s.id === sectionId)
            return {
              ...grade,
              sections: [...grade.sections, { sectionId, sectionName: section?.sectionName || "", subjects: [] }],
            }
          }),
        }
      })
    )
  }

  const removeSection = (courseId: string, gradeId: string, sectionId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        return {
          ...course,
          grades: course.grades.map((grade) => {
            if (grade.gradeId !== gradeId) return grade
            return { ...grade, sections: grade.sections.filter((s) => s.sectionId !== sectionId) }
          }),
        }
      })
    )
  }

  // ---- Subject management ----
  const addSubject = (courseId: string, gradeId: string, sectionId: string, subjectId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        return {
          ...course,
          grades: course.grades.map((grade) => {
            if (grade.gradeId !== gradeId) return grade
            return {
              ...grade,
              sections: grade.sections.map((section) => {
                if (section.sectionId !== sectionId) return section
                if (section.subjects.find((s) => s.subjectId === subjectId)) return section
                return {
                  ...section,
                  subjects: [
                    ...section.subjects,
                    {
                      subjectId,
                      expertiseLevel: "intermediate",
                      isPrimary: false,
                      priorityScore: 50,
                      canBeClassTeacher: false,
                      remarks: null,
                    },
                  ],
                }
              }),
            }
          }),
        }
      })
    )
  }

  const removeSubject = (courseId: string, gradeId: string, sectionId: string, subjectId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        return {
          ...course,
          grades: course.grades.map((grade) => {
            if (grade.gradeId !== gradeId) return grade
            return {
              ...grade,
              sections: grade.sections.map((section) => {
                if (section.sectionId !== sectionId) return section
                return { ...section, subjects: section.subjects.filter((s) => s.subjectId !== subjectId) }
              }),
            }
          }),
        }
      })
    )
  }

  const updateSubjectConfig = useCallback(
    (
      courseId: string,
      gradeId: string,
      sectionId: string,
      subjectId: string,
      field: keyof SubjectCapabilityConfig,
      value: any
    ) => {
      setCourses((prev) =>
        prev.map((course) => {
          if (course.courseId !== courseId) return course
          return {
            ...course,
            grades: course.grades.map((grade) => {
              if (grade.gradeId !== gradeId) return grade
              return {
                ...grade,
                sections: grade.sections.map((section) => {
                  if (section.sectionId !== sectionId) return section
                  return {
                    ...section,
                    subjects: section.subjects.map((subject) => {
                      if (subject.subjectId !== subjectId) return subject
                      return { ...subject, [field]: value }
                    }),
                  }
                }),
              }
            }),
          }
        })
      )
    },
    []
  )

  // ---- Helpers ----
  const availableGradesForCourse = (courseId: string) => allGrades.filter((g: any) => g.courseId === courseId)
  const allSectionsForGrade = (gradeId: string) => (allSections as any[]).filter((s: any) => s.gradeId === gradeId)
  const availableSubjectsForCourse = (courseId: string) => allSubjects.filter((s: any) => s.courseId === courseId)
  const getSubjectName = (subjectId: string) => allSubjects.find((s: any) => s.id === subjectId)?.subjectName || subjectId
  const getSectionName = (sectionId: string) => {
    if (!sectionId) return "All Sections"
    const section = (allSections as any[]).find((s: any) => s.id === sectionId)
    return section?.sectionName || sectionId
  }

  // ---- Calculate total records ----
  const totalRecords = courses.reduce(
    (sum, course) =>
      sum +
      course.grades.reduce(
        (gradeSum, grade) =>
          gradeSum + grade.sections.reduce((sectionSum, section) => sectionSum + section.subjects.length, 0),
        0
      ),
    0
  )

  // ---- Submit ----
  const onSubmit = async (data: { teacherId: string }) => {
    if (totalRecords === 0) return

    const payload = {
      teacherId: data.teacherId,
      courses: courses.map((course) => ({
        courseId: course.courseId,
        grades: course.grades.map((grade) => ({
          gradeId: grade.gradeId,
          sections: grade.sections.map((section) => ({
            sectionId: section.sectionId,
            subjects: section.subjects.map((subject) => ({
              subjectId: subject.subjectId,
              expertiseLevel: subject.expertiseLevel,
              isPrimary: subject.isPrimary,
              priorityScore: subject.priorityScore,
              canBeClassTeacher: subject.canBeClassTeacher,
              remarks: subject.remarks,
            })),
          })),
        })),
      })),
    }

    try {
      await createBulkCapabilities.mutateAsync(payload)
      toast.success(`Successfully created ${totalRecords} capability record(s)`)
      router.push("/teachers/capabilities")
    } catch (error) {
      toast.error("Failed to create capabilities")
    }
  }

  const availableCourses = allCourses.filter((c: any) => !selectedCourseIds.includes(c.id))

  return (
    <>
      <Breadcrumbs items={[{ label: "Staff & Curriculum", href: "/staff-curriculum" }, { label: "Teacher Capabilities", href: "/teachers/capabilities" }, { label: "Create" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Create Teacher Capabilities"
          description="Select a teacher, then add courses, grades, sections, and assign subjects to define their teaching capabilities"
      >
        <Button variant="outline" onClick={() => router.push("/teachers/capabilities")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Capabilities
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Teacher Selection */}
        <Card>
          <CardHeader className="py-4 px-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold">Select Teacher</span>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="max-w-md">
              <Label htmlFor="teacherId">Teacher *</Label>
              <Controller
                name="teacherId"
                control={control}
                rules={{ required: "Teacher is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher: any) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.fullName} {teacher.employeeCode ? `(${teacher.employeeCode})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.teacherId && <p className="text-sm text-destructive mt-1">{errors.teacherId.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Course Selection */}
        <Card>
          <CardHeader className="py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="font-semibold">Courses & Capabilities</span>
              </div>
              {availableCourses.length > 0 && (
                <Select onValueChange={(value) => addCourse(value)} value="">
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="+ Add Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.courseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-4">
            {courses.length === 0 && (
              <div className="text-sm text-muted-foreground p-8 border-2 border-dashed rounded-lg text-center">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No courses added yet.</p>
                <p className="text-xs mt-1">Select a course above to get started.</p>
              </div>
            )}

            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.courseId} className="border-primary/20">
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleCourseExpanded(course.courseId)}
                        >
                          {course.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">{course.courseName}</span>
                        <Badge variant="secondary" className="text-xs">
                          {course.grades.length} grade{course.grades.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeCourse(course.courseId)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>

                  {course.expanded && (
                    <CardContent className="px-4 pb-4 pt-0 space-y-3">
                      <div className="pl-6 space-y-2">
                        {/* Grade Selection */}
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            Grades
                          </Label>
                          <Select onValueChange={(value) => addGrade(course.courseId, value)} value="">
                            <SelectTrigger className="w-[180px] h-7 text-xs">
                              <SelectValue placeholder="+ Add Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableGradesForCourse(course.courseId)
                                .filter((g: any) => !course.grades.find((cg) => cg.gradeId === g.id))
                                .map((grade: any) => (
                                  <SelectItem key={grade.id} value={grade.id}>
                                    {grade.gradeName}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {course.grades.length === 0 && (
                          <p className="text-xs text-muted-foreground pl-2">No grades added yet.</p>
                        )}

                        {course.grades.map((grade) => (
                          <div key={grade.gradeId} className="border rounded-md p-3 space-y-2 bg-muted/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0"
                                  onClick={() => toggleGradeExpanded(course.courseId, grade.gradeId)}
                                >
                                  {grade.expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                </Button>
                                <span className="text-sm font-medium">{grade.gradeName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {grade.sections.length} section{grade.sections.length !== 1 ? "s" : ""}
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0"
                                onClick={() => removeGrade(course.courseId, grade.gradeId)}
                              >
                                <X className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>

                            {grade.expanded && (
                              <div className="pl-4 space-y-2">
                                {/* Section Selection */}
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    Sections
                                  </Label>
                                  <Select
                                    onValueChange={(value) => addSection(course.courseId, grade.gradeId, value)}
                                    value=""
                                  >
                                    <SelectTrigger className="w-[200px] h-7 text-xs">
                                      <SelectValue placeholder="+ Add Section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {allSectionsForGrade(grade.gradeId)
                                        .filter((s: any) => !grade.sections.find((gs) => gs.sectionId === s.id))
                                        .map((section: any) => (
                                          <SelectItem key={section.id} value={section.id}>
                                            {section.sectionName}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {grade.sections.length === 0 && (
                                  <p className="text-xs text-muted-foreground pl-2">
                                    No sections added yet. Select a section above.
                                  </p>
                                )}

                                {grade.sections.map((section) => (
                                  <div key={section.sectionId} className="border rounded-md p-2 space-y-2 bg-background">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium flex items-center gap-1">
                                        <Users className="h-3 w-3 text-muted-foreground" />
                                        {getSectionName(section.sectionId)}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {section.subjects.length} subject{section.subjects.length !== 1 ? "s" : ""}
                                        </Badge>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-5 w-5 p-0"
                                          onClick={() => removeSection(course.courseId, grade.gradeId, section.sectionId)}
                                        >
                                          <X className="h-3 w-3 text-destructive" />
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Subject Selection */}
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        Subjects
                                      </Label>
                                      <Select
                                        onValueChange={(value) =>
                                          addSubject(course.courseId, grade.gradeId, section.sectionId, value)
                                        }
                                        value=""
                                      >
                                        <SelectTrigger className="w-[180px] h-7 text-xs">
                                          <SelectValue placeholder="+ Add Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableSubjectsForCourse(course.courseId)
                                            .filter((s: any) => !section.subjects.find((ss) => ss.subjectId === s.id))
                                            .map((subject: any) => (
                                              <SelectItem key={subject.id} value={subject.id}>
                                                {subject.subjectName}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Subject Config Table */}
                                    {section.subjects.length > 0 && (
                                      <div className="border rounded-md overflow-hidden">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="text-xs w-[120px]">Subject</TableHead>
                                              <TableHead className="text-xs w-[90px]">Expertise</TableHead>
                                              <TableHead className="text-xs w-[60px]">Priority</TableHead>
                                              <TableHead className="text-xs w-[50px]">Primary</TableHead>
                                              <TableHead className="text-xs w-[80px]">Class Teacher</TableHead>
                                              <TableHead className="text-xs w-[30px]"></TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {section.subjects.map((subject) => (
                                              <TableRow key={subject.subjectId}>
                                                <TableCell className="text-xs font-medium py-1">
                                                  {getSubjectName(subject.subjectId)}
                                                </TableCell>
                                                <TableCell className="py-1">
                                                  <Select
                                                    value={subject.expertiseLevel}
                                                    onValueChange={(value) =>
                                                      updateSubjectConfig(
                                                        course.courseId,
                                                        grade.gradeId,
                                                        section.sectionId,
                                                        subject.subjectId,
                                                        "expertiseLevel",
                                                        value
                                                      )
                                                    }
                                                  >
                                                    <SelectTrigger className="h-7 text-xs">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="beginner">Beginner</SelectItem>
                                                      <SelectItem value="intermediate">Intermediate</SelectItem>
                                                      <SelectItem value="advanced">Advanced</SelectItem>
                                                      <SelectItem value="expert">Expert</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </TableCell>
                                                <TableCell className="py-1">
                                                  <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    className="h-7 w-14 text-xs"
                                                    value={subject.priorityScore || ""}
                                                    onChange={(e) =>
                                                      updateSubjectConfig(
                                                        course.courseId,
                                                        grade.gradeId,
                                                        section.sectionId,
                                                        subject.subjectId,
                                                        "priorityScore",
                                                        parseInt(e.target.value) || 0
                                                      )
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell className="py-1">
                                                  <Checkbox
                                                    checked={subject.isPrimary}
                                                    onCheckedChange={(checked) =>
                                                      updateSubjectConfig(
                                                        course.courseId,
                                                        grade.gradeId,
                                                        section.sectionId,
                                                        subject.subjectId,
                                                        "isPrimary",
                                                        checked === true
                                                      )
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell className="py-1">
                                                  <Checkbox
                                                    checked={subject.canBeClassTeacher}
                                                    onCheckedChange={(checked) =>
                                                      updateSubjectConfig(
                                                        course.courseId,
                                                        grade.gradeId,
                                                        section.sectionId,
                                                        subject.subjectId,
                                                        "canBeClassTeacher",
                                                        checked === true
                                                      )
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell className="py-1">
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() =>
                                                      removeSubject(
                                                        course.courseId,
                                                        grade.gradeId,
                                                        section.sectionId,
                                                        subject.subjectId
                                                      )
                                                    }
                                                  >
                                                    <X className="h-3 w-3 text-destructive" />
                                                  </Button>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {totalRecords > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Summary: </span>
                  {courses.length} course{courses.length !== 1 ? "s" : ""},{" "}
                  {courses.reduce((s, c) => s + c.grades.length, 0)} grade
                  {courses.reduce((s, c) => s + c.grades.length, 0) !== 1 ? "s" : ""},{" "}
                  {courses.reduce((s, c) => s + c.grades.reduce((gs, g) => gs + g.sections.length, 0), 0)} section
                  {courses.reduce((s, c) => s + c.grades.reduce((gs, g) => gs + g.sections.length, 0), 0) !== 1
                    ? "s"
                    : ""}{" "}
                  → <strong>{totalRecords} capability record{totalRecords !== 1 ? "s" : ""}</strong>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={createBulkCapabilities.isPending || totalRecords === 0 || !selectedTeacherId}
                >
                  {createBulkCapabilities.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Capabilities ({totalRecords} record{totalRecords !== 1 ? "s" : ""})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Actions when no records */}
        {totalRecords === 0 && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => router.push("/teachers/capabilities")}>
              Cancel
            </Button>
            <Button type="submit" disabled={createBulkCapabilities.isPending || totalRecords === 0 || !selectedTeacherId}>
              {createBulkCapabilities.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Capabilities
            </Button>
          </div>
        )}
      </form>
    </motion.div>
    </>
  )
}
