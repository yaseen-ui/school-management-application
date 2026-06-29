import { TeacherAvailabilityCards } from "@/components/teacher-availability/teacher-availability-cards"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"

export default function TeacherAvailabilityPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Staff & Curriculum", href: "/staff-curriculum" }, { label: "Teacher Availability" }]} />
      <PageHeader
        title="Teacher Availability"
        description="Plan and manage weekly availability schedules for teachers"
      />
      <TeacherAvailabilityCards />
    </div>
  )
}
