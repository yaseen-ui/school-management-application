"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { UserCheck, GitBranch, UserCog, BookMarked, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const modules = [
  {
    title: "Teachers",
    description: "Manage teacher profiles, create, edit, and view detailed teacher information including qualifications and experience.",
    icon: UserCheck,
    href: "/teachers",
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Teacher Capabilities",
    description: "Define subject expertise and teaching capabilities for teachers. Map teachers to subjects they can teach.",
    icon: GitBranch,
    href: "/teachers/capabilities",
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Teacher Assignments",
    description: "Assign teachers to subjects, sections, and roles for each academic year with eligibility checks.",
    icon: UserCog,
    href: "/teachers/assignments",
    color: "from-violet-500 to-violet-600",
    lightColor: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Section Subjects",
    description: "Assign subjects to sections. Define which subjects each section studies and mark subjects as elective.",
    icon: BookMarked,
    href: "/section-subjects",
    color: "from-amber-500 to-amber-600",
    lightColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
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

export default function StaffCurriculumPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Curriculum"
        description="Manage teachers, their capabilities, assignments, and section-subject mappings"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
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
