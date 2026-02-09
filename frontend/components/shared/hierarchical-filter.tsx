"use client"

import { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { useSubjects } from "@/hooks/use-subjects"
import { Loader2 } from "lucide-react"

export type FilterType = "courses" | "grades" | "sections" | "subjects"

interface HierarchicalFilterProps {
  filters: FilterType[]
  names?: {
    courseId?: string
    gradeId?: string
    sectionId?: string
    subjectIds?: string
  }
  required?: {
    courseId?: boolean
    gradeId?: boolean
    sectionId?: boolean
    subjectIds?: boolean
  }
  onChange?: (values: {
    courseId?: string
    gradeId?: string
    sectionId?: string
    subjectIds?: string[]
  }) => void
  values?: {
    courseId?: string
    gradeId?: string
    sectionId?: string
    subjectIds?: string[]
  }
  labels?: {
    courseId?: string
    gradeId?: string
    sectionId?: string
    subjectIds?: string
  }
  disabled?: boolean
  compact?: boolean
}

export function HierarchicalFilter({
  filters,
  names = {
    courseId: "courseId",
    gradeId: "gradeId",
    sectionId: "sectionId",
    subjectIds: "subjectIds",
  },
  required = {},
  onChange,
  values: controlledValues,
  labels = {
    courseId: "Course",
    gradeId: "Grade",
    sectionId: "Section",
    subjectIds: "Subjects",
  },
  disabled = false,
  compact = false,
}: HierarchicalFilterProps) {
  const formContext = useFormContext()
  const isFormControlled = !!formContext

  const [localValues, setLocalValues] = useState<{
    courseId?: string
    gradeId?: string
    sectionId?: string
    subjectIds?: string[]
  }>(controlledValues || {})

  const currentValues = isFormControlled
    ? {
        courseId: formContext.watch(names.courseId!),
        gradeId: formContext.watch(names.gradeId!),
        sectionId: formContext.watch(names.sectionId!),
        subjectIds: formContext.watch(names.subjectIds!),
      }
    : controlledValues || localValues

  const { data: coursesData, isLoading: coursesLoading } = useCourses()
  const { data: gradesData, isLoading: gradesLoading } = useGrades(
    filters.includes("courses") ? currentValues.courseId : undefined,
  )
  const { data: sectionsData, isLoading: sectionsLoading } = useSections(
    filters.includes("grades") ? currentValues.gradeId : undefined,
  )
  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects(
    filters.includes("subjects") && filters.includes("courses") ? currentValues.courseId : undefined,
  )

  const courses = coursesData?.data?.rows || []
  const allGrades = gradesData?.rows || []
  const allSections = sectionsData?.data?.rows || []
  const subjects = subjectsData || []

  const filteredGrades = allGrades
  const filteredSections = allSections

  const handleChange = (field: string, value: string | string[]) => {
    const newValues = { ...currentValues, [field]: value }

    if (field === "courseId") {
      newValues.gradeId = undefined
      newValues.sectionId = undefined
      newValues.subjectIds = []
    } else if (field === "gradeId") {
      newValues.sectionId = undefined
    }

    if (isFormControlled) {
      formContext.setValue(field, value)
      if (field === "courseId") {
        formContext.setValue(names.gradeId!, undefined)
        formContext.setValue(names.sectionId!, undefined)
        formContext.setValue(names.subjectIds!, [])
      } else if (field === "gradeId") {
        formContext.setValue(names.sectionId!, undefined)
      }
    } else {
      setLocalValues(newValues)
    }

    onChange?.(newValues)
  }

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    const current = currentValues.subjectIds || []
    const newSubjectIds = checked ? [...current, subjectId] : current.filter((id) => id !== subjectId)
    handleChange(names.subjectIds!, newSubjectIds)
  }

  useEffect(() => {
    if (controlledValues && !isFormControlled) {
      setLocalValues(controlledValues)
    }
  }, [controlledValues, isFormControlled])

  const containerClass = compact ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "space-y-4"

  return (
    <div className={containerClass}>
      {/* Courses Dropdown */}
      {filters.includes("courses") && (
        <div className="space-y-2">
          <Label htmlFor={names.courseId}>
            {labels.courseId}
            {required.courseId && <span className="text-destructive ml-1">*</span>}
          </Label>
          {isFormControlled ? (
            <Controller
              name={names.courseId!}
              control={formContext.control}
              rules={{ required: required.courseId }}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleChange(names.courseId!, value)
                  }}
                  disabled={disabled || coursesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={coursesLoading ? "Loading..." : "Select course"} />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : courses.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No courses available</div>
                    ) : (
                      courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.courseName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <Select
              value={currentValues.courseId || ""}
              onValueChange={(value) => handleChange("courseId", value)}
              disabled={disabled || coursesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={coursesLoading ? "Loading..." : "Select course"} />
              </SelectTrigger>
              <SelectContent>
                {coursesLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : courses.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No courses available</div>
                ) : (
                  courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.courseName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Grades Dropdown */}
      {filters.includes("grades") && (
        <div className="space-y-2">
          <Label htmlFor={names.gradeId}>
            {labels.gradeId}
            {required.gradeId && <span className="text-destructive ml-1">*</span>}
          </Label>
          {isFormControlled ? (
            <Controller
              name={names.gradeId!}
              control={formContext.control}
              rules={{ required: required.gradeId }}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleChange(names.gradeId!, value)
                  }}
                  disabled={disabled || gradesLoading || (filters.includes("courses") && !currentValues.courseId)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        gradesLoading
                          ? "Loading..."
                          : filters.includes("courses") && !currentValues.courseId
                            ? "Select course first"
                            : "Select grade"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {gradesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : filteredGrades.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        {filters.includes("courses") && !currentValues.courseId
                          ? "Select a course first"
                          : "No grades available"}
                      </div>
                    ) : (
                      filteredGrades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.gradeName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <Select
              value={currentValues.gradeId || ""}
              onValueChange={(value) => handleChange("gradeId", value)}
              disabled={disabled || gradesLoading || (filters.includes("courses") && !currentValues.courseId)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    gradesLoading
                      ? "Loading..."
                      : filters.includes("courses") && !currentValues.courseId
                        ? "Select course first"
                        : "Select grade"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {gradesLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : filteredGrades.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    {filters.includes("courses") && !currentValues.courseId
                      ? "Select a course first"
                      : "No grades available"}
                  </div>
                ) : (
                  filteredGrades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.gradeName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Sections Dropdown */}
      {filters.includes("sections") && (
        <div className="space-y-2">
          <Label htmlFor={names.sectionId}>
            {labels.sectionId}
            {required.sectionId && <span className="text-destructive ml-1">*</span>}
          </Label>
          {isFormControlled ? (
            <Controller
              name={names.sectionId!}
              control={formContext.control}
              rules={{ required: required.sectionId }}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={disabled || sectionsLoading || (filters.includes("grades") && !currentValues.gradeId)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        sectionsLoading
                          ? "Loading..."
                          : filters.includes("grades") && !currentValues.gradeId
                            ? "Select grade first"
                            : "Select section"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionsLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : filteredSections.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        {filters.includes("grades") && !currentValues.gradeId
                          ? "Select a grade first"
                          : "No sections available"}
                      </div>
                    ) : (
                      filteredSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.sectionName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <Select
              value={currentValues.sectionId || ""}
              onValueChange={(value) => handleChange("sectionId", value)}
              disabled={disabled || sectionsLoading || (filters.includes("grades") && !currentValues.gradeId)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    sectionsLoading
                      ? "Loading..."
                      : filters.includes("grades") && !currentValues.gradeId
                        ? "Select grade first"
                        : "Select section"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {sectionsLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : filteredSections.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    {filters.includes("grades") && !currentValues.gradeId
                      ? "Select a grade first"
                      : "No sections available"}
                  </div>
                ) : (
                  filteredSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.sectionName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {filters.includes("subjects") && (
        <div className="space-y-2">
          <Label>
            {labels.subjectIds}
            {required.subjectIds && <span className="text-destructive ml-1">*</span>}
          </Label>
          <div className="rounded-lg border p-4 space-y-3 max-h-[200px] overflow-y-auto">
            {subjectsLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                {filters.includes("courses") && !currentValues.courseId
                  ? "Select a course first"
                  : "No subjects available"}
              </p>
            ) : (
              subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={subject.id}
                    checked={currentValues.subjectIds?.includes(subject.id)}
                    onCheckedChange={(checked) => handleSubjectToggle(subject.id, checked as boolean)}
                    disabled={disabled}
                  />
                  <label
                    htmlFor={subject.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {subject.subjectName}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
