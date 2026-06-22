"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCreateBulkTeacherCapabilities } from "@/hooks/use-teacher-capabilities"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { Loader2, X, Plus, ChevronDown, ChevronRight, BookOpen, GraduationCap, Layers, Users } from "lucide-react"
import type { SubjectCapabilityConfig, CourseCapabilityConfig, GradeCapabilityConfig, SectionSubjectConfig } from "@/lib/api/teacher-capabilities"

interface DefaultCapabilityData {
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
}

interface CreateTeacherCapabilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTeacherId?: string
  defaultData?: DefaultCapabilityData
}

interface FormData {
  teacherId: string
}

// ---- Types for the new nested structure ----
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

export function CreateTeacherCapabilityDialog({
  open,
  onOpenChange,
  defaultTeacherId,
  defaultData,
}: CreateTeacherCapabilityDialogProps) {
  const [courses, setCourses] = useState<CourseEntry[]>([])
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      teacherId: "",
    },
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

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({ teacherId: defaultTeacherId || "" })
      setCourses([])
      setSelectedCourseIds([])

      // If defaultData is provided, pre-populate the structure
      if (defaultData?.courseId && defaultData?.gradeIds && defaultData?.subjects) {
        const course = allCourses.find((c: any) => c.id === defaultData.courseId)
        if (course) {
          const gradeEntry: GradeEntry = {
            gradeId: defaultData.gradeIds[0] || "",
            gradeName: allGrades.find((g: any) => g.id === defaultData.gradeIds[0])?.gradeName || "",
            sections: [
              {
                sectionId: "",
                sectionName: "All Sections",
                subjects: defaultData.subjects.map((s) => ({
                  subjectId: s.subjectId,
                  expertiseLevel: s.expertiseLevel,
                  isPrimary: s.isPrimary,
                  priorityScore: s.priorityScore,
                  canBeClassTeacher: s.canBeClassTeacher,
                  remarks: s.remarks,
                })),
              },
            ],
            expanded: true,
          }
          setCourses([
            {
              courseId: defaultData.courseId,
              courseName: course.courseName,
              grades: [gradeEntry],
              expanded: true,
            },
          ])
          setSelectedCourseIds([defaultData.courseId])
        }
      }
    }
  }, [open, reset, defaultTeacherId, defaultData, allCourses, allGrades])

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
    setCourses((prev) =>
      prev.map((c) => (c.courseId === courseId ? { ...c, expanded: !c.expanded } : c))
    )
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
            {
              gradeId,
              gradeName: grade?.gradeName || "",
              sections: [],
              expanded: true,
            },
          ],
        }
      })
    )
  }

  const removeGrade = (courseId: string, gradeId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        return {
          ...course,
          grades: course.grades.filter((g) => g.gradeId !== gradeId),
        }
      })
    )
  }

  const toggleGradeExpanded = (courseId: string, gradeId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.courseId !== courseId) return course
        return {
          ...course,
          grades: course.grades.map((g) =>
            g.gradeId === gradeId ? { ...g, expanded: !g.expanded } : g
          ),
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
              sections: [
                ...grade.sections,
                {
                  sectionId,
                  sectionName: section?.sectionName || "",
                  subjects: [],
                },
              ],
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
            return {
              ...grade,
              sections: grade.sections.filter((s) => s.sectionId !== sectionId),
            }
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
                return {
                  ...section,
                  subjects: section.subjects.filter((s) => s.subjectId !== subjectId),
                }
              }),
            }
          }),
        }
      })
    )
  }

  const updateSubjectConfig = useCallback(
    (courseId: string, gradeId: string, sectionId: string, subjectId: string, field: keyof SubjectCapabilityConfig, value: any) => {
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

  // ---- Helper to get available grades for a course ----
  const availableGradesForCourse = (courseId: string) => {
    return allGrades.filter((g: any) => g.courseId === courseId)
  }

  // ---- Helper to get available sections for a grade ----
  const allSectionsForGrade = (gradeId: string) => {
    return (allSections as any[]).filter((s: any) => s.gradeId === gradeId)
  }

  // ---- Helper to get available subjects for a course ----
  const availableSubjectsForCourse = (courseId: string) => {
    return allSubjects.filter((s: any) => s.courseId === courseId)
  }

  // ---- Get subject name ----
  const getSubjectName = (subjectId: string) => {
    return allSubjects.find((s: any) => s.id === subjectId)?.subjectName || subjectId
  }

  // ---- Get section name ----
  const getSectionName = (sectionId: string) => {
    if (!sectionId) return "All Sections"
    const section = (allSections as any[]).find((s: any) => s.id === sectionId)
    return section?.sectionName || sectionId
  }

  // ---- Calculate total records ----
  const totalRecords = courses.reduce((sum, course) => {
    return (
      sum +
      course.grades.reduce((gradeSum, grade) => {
        return (
          gradeSum +
          grade.sections.reduce((sectionSum, section) => {
            return sectionSum + section.subjects.length
          }, 0)
        )
      }, 0)
    )
  }, 0)

  // ---- Submit ----
  const onSubmit = async (data: FormData) => {
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

    await createBulkCapabilities.mutateAsync(payload)
    reset()
    setCourses([])
    setSelectedCourseIds([])
    onOpenChange(false)
  }

  // ---- Available courses not yet added ----
  const availableCourses = allCourses.filter((c: any) => !selectedCourseIds.includes(c.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Teacher Capabilities</DialogTitle>
          <DialogDescription>
            Select a teacher, then add courses, grades, sections, and assign subjects to define their teaching capabilities
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Teacher Selection */}
          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher *</Label>
            <Controller
              name="teacherId"
              control={control}
              rules={{ required: "Teacher is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.teacherId && <p className="text-sm text-destructive">{errors.teacherId.message}</p>}
          </div>

          {/* Course Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Courses</Label>
              {availableCourses.length > 0 && (
                <Select onValueChange={(value) => addCourse(value)} value="">
                  <SelectTrigger className="w-[200px] h-8 text-xs">
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

            {courses.length === 0 && (
              <div className="text-sm text-muted-foreground p-4 border rounded-md text-center">
                No courses added yet. Select a course above to get started.
              </div>
            )}

            {/* Course Accordion */}
            <div className="space-y-3">
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
                          {course.expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
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
                      {/* Grade Selection */}
                      <div className="pl-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            Grades
                          </Label>
                          <Select
                            onValueChange={(value) => addGrade(course.courseId, value)}
                            value=""
                          >
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
                                  {grade.expanded ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
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
                                          onClick={() =>
                                            removeSection(course.courseId, grade.gradeId, section.sectionId)
                                          }
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
                                            .filter(
                                              (s: any) => !section.subjects.find((ss) => ss.subjectId === s.id)
                                            )
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
          </div>

          {/* Summary */}
          {totalRecords > 0 && (
            <div className="bg-muted/50 rounded-md p-3 text-sm">
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
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createBulkCapabilities.isPending || totalRecords === 0}>
              {createBulkCapabilities.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Capabilities ({totalRecords} record{totalRecords !== 1 ? "s" : ""})
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
