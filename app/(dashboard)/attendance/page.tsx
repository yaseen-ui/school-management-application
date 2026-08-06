"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BarChart3, ClipboardCheck, Settings2 } from "lucide-react"

import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { PageHeader } from "@/components/shared/page-header"

const attendanceModules = [
  {
    title: "Attendance Types",
    description: "Create and manage shift, period, and exam attendance types.",
    href: "/attendance/types",
    icon: Settings2,
    label: "Configure types",
    accent: "from-violet-500/15 via-purple-500/5 to-transparent",
    iconStyle: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    borderStyle: "group-hover:border-violet-400/60",
  },
  {
    title: "Take Attendance",
    description: "Mark student attendance quickly with a mobile-friendly roster.",
    href: "/attendance/take",
    icon: ClipboardCheck,
    label: "Start attendance",
    accent: "from-blue-500/15 via-cyan-500/5 to-transparent",
    iconStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
    borderStyle: "group-hover:border-blue-400/60",
  },
  {
    title: "Attendance Register",
    description: "Review monthly and weekly attendance records by class.",
    href: "/attendance/register",
    icon: BarChart3,
    label: "View register",
    accent: "from-emerald-500/15 via-teal-500/5 to-transparent",
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    borderStyle: "group-hover:border-emerald-400/60",
  },
]

export default function AttendancePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-6xl"
    >
      <Breadcrumbs items={[{ label: "Attendance" }]} />
      <PageHeader
        title="Attendance"
        description="Configure attendance, mark students, and review records."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {attendanceModules.map((module, index) => {
          const Icon = module.icon

          return (
            <motion.div
              key={module.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="h-full"
            >
              <Link
                href={module.href}
                className={`group relative flex h-full min-h-52 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${module.borderStyle}`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${module.accent}`} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${module.iconStyle}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold tracking-tight">{module.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.description}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold text-primary">
                    <span>{module.label}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
