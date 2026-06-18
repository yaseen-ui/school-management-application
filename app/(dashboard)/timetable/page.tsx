"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CalendarClock, Layers, Clock, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const modules = [
  {
    title: "Timetable Grid",
    description: "Visual timetable grid — assign subjects and teachers to periods for each day of the week across sections.",
    icon: CalendarClock,
    href: "/timetable/grid",
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Timetable Structures",
    description: "Define timetable structures (weekly schedules) that can be assigned to sections for the academic year.",
    icon: Layers,
    href: "/timetable-structures",
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Timetable Periods",
    description: "Configure time slots (periods) within each structure with start/end times, types, and sort order.",
    icon: Clock,
    href: "/timetable-periods",
    color: "from-violet-500 to-violet-600",
    lightColor: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
}

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable"
        description="Manage timetable structures, periods, and the visual timetable grid"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <motion.div key={module.href} variants={cardVariants}>
              <Link href={module.href} className="block h-full group">
                <Card className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${module.color}`} />

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`rounded-xl p-3 ${module.lightColor}`}>
                        <Icon className={`h-6 w-6 ${module.iconColor}`} />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-xl mt-4">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
