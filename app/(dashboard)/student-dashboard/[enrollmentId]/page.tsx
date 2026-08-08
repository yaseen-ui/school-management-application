"use client"

import { use } from "react"
import { useSearchParams } from "next/navigation"
import { StudentDashboardShell } from "@/components/student-dashboard/student-dashboard-shell"

export default function StudentDashboardPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>
}) {
  const { enrollmentId } = use(params)
  const searchParams = useSearchParams()
  const from = searchParams.get("from") === "staff" ? "staff" : "parent"

  return (
    <StudentDashboardShell
      enrollmentId={enrollmentId}
      from={from}
      showSwitchChild={from === "parent"}
    />
  )
}
