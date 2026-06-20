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
import { useCreateBulkTeacherCapabilities } from "@/hooks/use-teacher-capabilities"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { Loader2, X } from "lucide-react"
import type { SubjectCapabilityConfig } from "@/lib/api/teacher-capabilities"

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
  courseId: string
  gradeIds: string[]
  subjectIds: string[]
}

export function CreateTeacherCapabilityDialog({ open, onOpenChange, defaultTeacherId, defaultData }: CreateTeacherCapabilityDialogProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>([])
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])
  const [subjectConfigs, setSubjectConfigs] = useState<Record<string, SubjectCapabilityConfig>>({})

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      teacherId: "",
      courseId: "",
      gradeIds: [],
      subjectIds: [],
    },
  })

  const watchedCourseId = watch("courseId")

  const createBulkCapabilities = useCreateBulkTeacherCapabilities()
  const { data: teachersData } = useTeachers()
  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades(watchedCourseId || undefined)
  const { data: subjectsData } = useSubjects(watchedCourseId || undefined)

  const teachers = teachersData || []
  const subjects = subjectsData || []
  const courses = coursesData?.data?.rows || []
  const grades = gradesData?.rows || []

  // Reset dependent fields when course changes
  useEffect(() => {
    setSelectedGradeIds([])
    setSelectedSubjectIds([])
    setSubjectConfigs({})
  }, [watchedCourseId])

  // Initialize config for newly selected subjects
  useEffect(() => {
    setSubjectConfigs((prev) => {
      const updated = { ...prev }
      selectedSubjectIds.forEach((subjectId) => {
        if (!updated[subjectId]) {
          updated[subjectId] = {
            subjectId,
            expertiseLevel: "intermediate",
            isPrimary: false,
            priorityScore: 50,
            canBeClassTeacher: false,
            remarks: null,
          }
        }
      })
      // Remove configs for deselected subjects
      Object.keys(updated).forEach((id) => {
        if (!selectedSubjectIds.includes(id)) {
          delete updated[id]
        }
      })
      return updated
    })
  }, [selectedSubjectIds])

  const updateSubjectConfig = useCallback(
    (subjectId: string, field: keyof SubjectCapabilityConfig, value: any) => {
      setSubjectConfigs((prev) => ({
        ...prev,
        [subjectId]: { ...prev[subjectId], [field]: value },
      }))
    },
    [],
  )

  const removeSubject = useCallback((subjectId: string) => {
    setSelectedSubjectIds((prev) => prev.filter((id) => id !== subjectId))
    setSubjectConfigs((prev) => {
      const updated = { ...prev }
      delete updated[subjectId]
      return updated
    })
  }, [])

  const toggleGrade = (gradeId: string) => {
    setSelectedGradeIds((prev) =>
      prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [...prev, gradeId],
    )
  }

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
    )
  }

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      const courseId = defaultData?.courseId || ""
      const gradeIds = defaultData?.gradeIds || []
      const subjectIds = defaultData?.subjects.map((s) => s.subjectId) || []
      const configs: Record<string, SubjectCapabilityConfig> = {}
      if (defaultData?.subjects) {
        defaultData.subjects.forEach((s) => {
          configs[s.subjectId] = {
            subjectId: s.subjectId,
            expertiseLevel: s.expertiseLevel,
            isPrimary: s.isPrimary,
            priorityScore: s.priorityScore,
            canBeClassTeacher: s.canBeClassTeacher,
            remarks: s.remarks,
          }
        })
      }
      reset({ teacherId: defaultTeacherId || "", courseId, gradeIds, subjectIds })
      setSelectedCourseId(courseId)
      setSelectedGradeIds(gradeIds)
      setSelectedSubjectIds(subjectIds)
      setSubjectConfigs(configs)
    }
  }, [open, reset, defaultTeacherId, defaultData])

  const onSubmit = async (data: FormData) => {
    if (selectedSubjectIds.length === 0) return

    const subjects = selectedSubjectIds.map((id) => subjectConfigs[id] || {
      subjectId: id,
      expertiseLevel: "intermediate",
      isPrimary: false,
      priorityScore: 50,
      canBeClassTeacher: false,
      remarks: null,
    })

    await createBulkCapabilities.mutateAsync({
      teacherId: data.teacherId,
      courseId: data.courseId || null,
      gradeIds: selectedGradeIds.length > 0 ? selectedGradeIds : undefined,
      subjects,
    })
    reset()
    setSelectedCourseId("")
    setSelectedGradeIds([])
    setSelectedSubjectIds([])
    setSubjectConfigs({})
    onOpenChange(false)
  }

  const getSubjectName = (subjectId: string) => {
    return subjects.find((s: any) => s.id === subjectId)?.subjectName || subjectId
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Teacher Capabilities</DialogTitle>
          <DialogDescription>
            Select a teacher, course, grades, and subjects to define their teaching capabilities
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="courseId">Course *</Label>
            <Controller
              name="courseId"
              control={control}
              rules={{ required: "Course is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedCourseId(value)
                  }}
                  value={field.value}
                >
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
              )}
            />
            {errors.courseId && <p className="text-sm text-destructive">{errors.courseId.message}</p>}
          </div>

          {/* Grade Multi-Select */}
          <div className="space-y-2">
            <Label>Grades</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px]">
              {!watchedCourseId ? (
                <span className="text-sm text-muted-foreground">Select a course first</span>
              ) : grades.length === 0 ? (
                <span className="text-sm text-muted-foreground">No grades available for this course</span>
              ) : (
                grades.map((grade: any) => {
                  const isSelected = selectedGradeIds.includes(grade.id)
                  return (
                    <Button
                      key={grade.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleGrade(grade.id)}
                    >
                      {grade.gradeName}
                      {isSelected && <X className="ml-1 h-3 w-3" />}
                    </Button>
                  )
                })
              )}
            </div>
          </div>

          {/* Subject Multi-Select */}
          <div className="space-y-2">
            <Label>Subjects *</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px]">
              {!watchedCourseId ? (
                <span className="text-sm text-muted-foreground">Select a course first</span>
              ) : subjects.length === 0 ? (
                <span className="text-sm text-muted-foreground">No subjects available for this course</span>
              ) : (
                subjects.map((subject: any) => {
                  const isSelected = selectedSubjectIds.includes(subject.id)
                  return (
                    <Button
                      key={subject.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSubject(subject.id)}
                    >
                      {subject.subjectName}
                      {isSelected && <X className="ml-1 h-3 w-3" />}
                    </Button>
                  )
                })
              )}
            </div>
            {selectedSubjectIds.length === 0 && (
              <p className="text-sm text-muted-foreground">Select at least one subject</p>
            )}
          </div>

          {/* Subject Configuration Table */}
          {selectedSubjectIds.length > 0 && (
            <div className="space-y-2">
              <Label>Subject Configurations</Label>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">Subject</TableHead>
                      <TableHead className="w-[110px]">Expertise</TableHead>
                      <TableHead className="w-[80px]">Priority</TableHead>
                      <TableHead className="w-[70px]">Primary</TableHead>
                      <TableHead className="w-[100px]">Class Teacher</TableHead>
                      <TableHead className="w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSubjectIds.map((subjectId) => {
                      const config = subjectConfigs[subjectId] || {
                        subjectId,
                        expertiseLevel: "intermediate",
                        isPrimary: false,
                        priorityScore: 50,
                        canBeClassTeacher: false,
                      }
                      return (
                        <TableRow key={subjectId}>
                          <TableCell className="font-medium text-sm">{getSubjectName(subjectId)}</TableCell>
                          <TableCell>
                            <Select
                              value={config.expertiseLevel}
                              onValueChange={(value) =>
                                updateSubjectConfig(subjectId, "expertiseLevel", value)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
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
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              className="h-8 w-16 text-xs"
                              value={config.priorityScore || ""}
                              onChange={(e) =>
                                updateSubjectConfig(subjectId, "priorityScore", parseInt(e.target.value) || 0)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={config.isPrimary}
                              onCheckedChange={(checked) =>
                                updateSubjectConfig(subjectId, "isPrimary", checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={config.canBeClassTeacher}
                              onCheckedChange={(checked) =>
                                updateSubjectConfig(subjectId, "canBeClassTeacher", checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => removeSubject(subjectId)}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBulkCapabilities.isPending || selectedSubjectIds.length === 0}
            >
              {createBulkCapabilities.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Capabilities ({selectedSubjectIds.length * (selectedGradeIds.length || 1)} records)
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
