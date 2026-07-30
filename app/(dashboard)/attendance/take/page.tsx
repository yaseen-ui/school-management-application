"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { AttendanceMarkingPage } from "@/components/attendance/attendance-marking-page"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"

export default function TakeAttendancePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6"
    >
      <div>
        <Breadcrumbs
          items={[
            { label: "Attendance", href: "/attendance" },
            { label: "Take Attendance" },
          ]}
        />
        <PageHeader
          title="Take Attendance"
          description="Select a class and attendance type, then mark each student."
        >
          <Button asChild variant="outline" size="sm">
            <Link href="/attendance">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Attendance
            </Link>
          </Button>
        </PageHeader>
      </div>

      <AttendanceMarkingPage />
    </motion.div>
  )
}
