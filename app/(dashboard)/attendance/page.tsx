"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { AttendanceMarkingPage } from "@/components/attendance/attendance-marking-page"

export default function AttendancePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6"
    >
      <PageHeader
        title="Take Attendance"
        description="Select section and attendance type, then mark each student"
      >
        <div className="grid grid-cols-2 gap-2">
          <Link href="/attendance/register" className="min-w-0">
            <Button variant="outline" size="sm" className="w-full">
              <BarChart3 className="mr-1.5 h-4 w-4" /> Register
            </Button>
          </Link>
          <Link href="/attendance/types" className="min-w-0">
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="mr-1.5 h-4 w-4" /> Types
            </Button>
          </Link>
        </div>
      </PageHeader>

      <AttendanceMarkingPage />
    </motion.div>
  )
}
