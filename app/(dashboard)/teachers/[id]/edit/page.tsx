"use client"

import { useParams } from "next/navigation"
import { StaffWizardPage } from "@/components/teachers/staff-wizard-page"
import { useTeachers } from "@/hooks/use-teachers"
import { Loader2 } from "lucide-react"

export default function EditStaffPage() {
  const params = useParams()
  const teacherId = params.id as string
  const { data: teachers, isLoading } = useTeachers()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const teacher = teachers?.find((t) => t.id === teacherId) || null

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Staff member not found.</p>
      </div>
    )
  }

  return <StaffWizardPage teacherToEdit={teacher} />
}
