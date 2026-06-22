import { TeacherAvailabilityCards } from "@/components/teacher-availability/teacher-availability-cards"
import { PageHeader } from "@/components/shared/page-header"

export default function TeacherAvailabilityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Availability"
        description="Plan and manage weekly availability schedules for teachers"
      />
      <TeacherAvailabilityCards />
    </div>
  )
}
