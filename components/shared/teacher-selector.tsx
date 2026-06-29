"use client"

import { useFormContext } from "react-hook-form"
import { User } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTeachers } from "@/hooks/use-teachers"
import type { Teacher } from "@/lib/api/teachers"

interface TeacherSelectorProps {
  /** The field name in the form to store the selected teacherId */
  fieldName?: string
  /** Optional initial teacherId to pre-select (for edit mode) */
  initialTeacherId?: string
  /** Whether the field is required */
  required?: boolean
  /** Custom label for the dropdown */
  label?: string
}

export function TeacherSelector({
  fieldName = "sectionInChargeId",
  initialTeacherId,
  required = false,
  label,
}: TeacherSelectorProps) {
  const { data: teachers, isLoading } = useTeachers()
  const { setValue, watch, formState: { errors } } = useFormContext()

  const selectedTeacherId = watch(fieldName) || initialTeacherId || ""

  const handleTeacherChange = (teacherId: string) => {
    setValue(fieldName, teacherId, { shouldValidate: true })
  }

  return (
    <div className="space-y-2">
      <Label>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{label ?? "Teacher"}</span>
          {required && <span className="text-destructive">*</span>}
        </div>
      </Label>
      <Select
        value={selectedTeacherId}
        onValueChange={handleTeacherChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Loading teachers..." : "Select a teacher"} />
        </SelectTrigger>
        <SelectContent>
          {(teachers as Teacher[] | undefined)?.map((teacher) => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.fullName}
              {teacher.employeeCode ? ` (${teacher.employeeCode})` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[fieldName] && (
        <p className="text-sm text-destructive">{String(errors[fieldName]?.message ?? "")}</p>
      )}
    </div>
  )
}
