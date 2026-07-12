"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { AttendanceMarkingPage } from "@/components/attendance/attendance-marking-page"

export default function AttendancePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Take Attendance"
        description="Select section and attendance type, then mark each student"
      >
        <div className="flex gap-2">
          <Link href="/attendance/register">
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" /> Register
            </Button>
          </Link>
          <Link href="/attendance/types">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" /> Types
            </Button>
          </Link>
        </div>
      </PageHeader>

      <AttendanceMarkingPage />
    </motion.div>
  )
}