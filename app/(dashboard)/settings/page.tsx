"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Building2, ListOrdered } from "lucide-react"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const settingsCards = [
  {
    title: "Institute Settings",
    description: "Manage your institute profile, branding, contact details, and address.",
    href: "/settings/institute",
    icon: Building2,
    accent: "from-blue-500 to-indigo-500",
    surface: "from-blue-50/90 via-white to-indigo-50/40 dark:from-blue-950/30 dark:via-card dark:to-indigo-950/15",
    iconSurface: "from-blue-100 to-indigo-100/70 ring-blue-200/70 dark:from-blue-950/70 dark:to-indigo-950/50 dark:ring-blue-800/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    hoverBorder: "hover:border-blue-300/70 dark:hover:border-blue-700/70",
  },
  {
    title: "ID Grouping",
    description: "Configure automatic admission numbers and employee ID sequence patterns.",
    href: "/settings/id-sequences",
    icon: ListOrdered,
    accent: "from-violet-500 to-fuchsia-500",
    surface: "from-violet-50/90 via-white to-fuchsia-50/40 dark:from-violet-950/30 dark:via-card dark:to-fuchsia-950/15",
    iconSurface: "from-violet-100 to-fuchsia-100/70 ring-violet-200/70 dark:from-violet-950/70 dark:to-fuchsia-950/50 dark:ring-violet-800/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    hoverBorder: "hover:border-violet-300/70 dark:hover:border-violet-700/70",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
}

export default function SystemGroupingPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs items={[{ label: "System Grouping" }]} />
      <PageHeader
        title="System Grouping"
        description="Manage institute preferences and automatic identification formats"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid max-w-4xl gap-3.5 md:grid-cols-2"
      >
        {settingsCards.map((item) => {
          const Icon = item.icon

          return (
            <motion.div key={item.href} variants={cardVariants} className="h-full">
              <Link
                href={item.href}
                className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card
                  className={`relative h-full gap-0 overflow-hidden border-border/70 bg-gradient-to-br py-0 shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.42)] motion-reduce:transform-none ${item.surface} ${item.hoverBorder}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${item.accent}`} />
                  <div
                    aria-hidden="true"
                    className={`absolute -right-10 -top-12 h-28 w-28 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20 ${item.accent}`}
                  />

                  <CardHeader className="relative flex flex-row items-center gap-3 px-4 pt-4 pb-2.5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ${item.iconSurface}`}>
                      <Icon className={`h-[18px] w-[18px] ${item.iconColor}`} />
                    </div>
                    <CardTitle className="min-w-0 flex-1 text-base leading-5 tracking-tight">
                      {item.title}
                    </CardTitle>
                    <span
                      aria-hidden="true"
                      className={`flex h-7 w-7 shrink-0 translate-x-1 items-center justify-center rounded-full border border-current/10 bg-white/70 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:bg-white/5 ${item.iconColor}`}
                    >
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </CardHeader>
                  <CardContent className="relative px-4 pb-4">
                    <CardDescription className="text-[13px] leading-5">
                      {item.description}
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
