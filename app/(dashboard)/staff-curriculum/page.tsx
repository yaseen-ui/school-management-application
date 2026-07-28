"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { UserCheck, GitBranch, UserCog, BookMarked, Clock, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const modules = [
  {
    title: "Staff",
    description: "Manage all employees including teachers, drivers, clerks, and other staff. Create, edit, and view detailed employee information.",
    icon: UserCheck,
    href: "/teachers",
    accent: "from-blue-500 to-indigo-500",
    surface: "from-blue-50/90 via-white to-indigo-50/40 dark:from-blue-950/30 dark:via-card dark:to-indigo-950/15",
    lightColor: "bg-gradient-to-br from-blue-100 to-indigo-100/70 ring-blue-200/70 dark:from-blue-950/70 dark:to-indigo-950/50 dark:ring-blue-800/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    hoverBorder: "hover:border-blue-300/70 dark:hover:border-blue-700/70",
    arrowColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Teacher Capabilities",
    description: "Define subject expertise and teaching capabilities for teachers. Map teachers to subjects they can teach.",
    icon: GitBranch,
    href: "/teachers/capabilities",
    accent: "from-emerald-500 to-teal-500",
    surface: "from-emerald-50/90 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-card dark:to-teal-950/15",
    lightColor: "bg-gradient-to-br from-emerald-100 to-teal-100/70 ring-emerald-200/70 dark:from-emerald-950/70 dark:to-teal-950/50 dark:ring-emerald-800/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    hoverBorder: "hover:border-emerald-300/70 dark:hover:border-emerald-700/70",
    arrowColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Teacher Assignments",
    description: "Assign teachers to subjects, sections, and roles for each academic year with eligibility checks.",
    icon: UserCog,
    href: "/teachers/assignments",
    accent: "from-violet-500 to-purple-500",
    surface: "from-violet-50/90 via-white to-purple-50/40 dark:from-violet-950/30 dark:via-card dark:to-purple-950/15",
    lightColor: "bg-gradient-to-br from-violet-100 to-purple-100/70 ring-violet-200/70 dark:from-violet-950/70 dark:to-purple-950/50 dark:ring-violet-800/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    hoverBorder: "hover:border-violet-300/70 dark:hover:border-violet-700/70",
    arrowColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Section Subjects",
    description: "Assign subjects to sections. Define which subjects each section studies and mark subjects as elective.",
    icon: BookMarked,
    href: "/section-subjects",
    accent: "from-amber-500 to-orange-500",
    surface: "from-amber-50/90 via-white to-orange-50/40 dark:from-amber-950/30 dark:via-card dark:to-orange-950/15",
    lightColor: "bg-gradient-to-br from-amber-100 to-orange-100/70 ring-amber-200/70 dark:from-amber-950/70 dark:to-orange-950/50 dark:ring-amber-800/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    hoverBorder: "hover:border-amber-300/70 dark:hover:border-amber-700/70",
    arrowColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Teacher Availability",
    description: "Plan and manage weekly availability schedules for teachers. Define available time slots for each day of the week.",
    icon: Clock,
    href: "/teachers/availability",
    accent: "from-rose-500 to-pink-500",
    surface: "from-rose-50/90 via-white to-pink-50/40 dark:from-rose-950/30 dark:via-card dark:to-pink-950/15",
    lightColor: "bg-gradient-to-br from-rose-100 to-pink-100/70 ring-rose-200/70 dark:from-rose-950/70 dark:to-pink-950/50 dark:ring-rose-800/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    hoverBorder: "hover:border-rose-300/70 dark:hover:border-rose-700/70",
    arrowColor: "text-rose-600 dark:text-rose-400",
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
    <div className="space-y-5">
      <Breadcrumbs items={[{ label: "Staff & Curriculum" }]} />
      <PageHeader
        title="Staff & Curriculum"
        description="Manage teachers, their capabilities, assignments, and section-subject mappings"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <motion.div key={module.href} variants={cardVariants} className="h-full">
              <Link
                href={module.href}
                className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card
                  className={`relative h-full gap-0 overflow-hidden border-border/70 bg-gradient-to-br py-0 shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.42)] motion-reduce:transform-none ${module.surface} ${module.hoverBorder}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${module.accent}`} />
                  <div
                    aria-hidden="true"
                    className={`absolute -right-12 -top-14 h-32 w-32 rounded-full bg-gradient-to-br opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.16] ${module.accent}`}
                  />

                  <CardHeader className="relative flex flex-row items-center gap-3 px-4 pt-4 pb-2.5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${module.lightColor}`}>
                      <Icon className={`h-[18px] w-[18px] ${module.iconColor}`} />
                    </div>
                    <CardTitle className="min-w-0 flex-1 text-base leading-5 tracking-tight">
                      {module.title}
                    </CardTitle>
                    <span
                      className={`flex h-7 w-7 shrink-0 translate-x-1 items-center justify-center rounded-full border border-current/10 bg-white/70 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:bg-white/5 ${module.arrowColor}`}
                      aria-hidden="true"
                    >
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </CardHeader>
                  <CardContent className="relative px-4 pb-4">
                    <CardDescription className="line-clamp-2 text-[13px] leading-5">
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
