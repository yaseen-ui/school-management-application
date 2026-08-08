"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  User,
  CalendarCheck,
  Trophy,
  DollarSign,
  CalendarClock,
  Bell,
  ArrowRight,
  Loader2,
  Users,
  ShoppingBag,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useParentProfile } from "@/hooks/use-parent-portal"
import type { ParentStudent } from "@/lib/api/parents"

const easeOut = [0.25, 0.46, 0.45, 0.94] as const

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
}

const quickLinks = [
  {
    title: "Fees",
    href: "/parent-portal/fees",
    icon: DollarSign,
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600",
    desc: "Payments & dues",
  },
  {
    title: "Inbox",
    href: "/parent-portal/communications",
    icon: Bell,
    bgColor: "bg-sky-500/10",
    textColor: "text-sky-600",
    desc: "School messages",
  },
  {
    title: "Leave",
    href: "/parent-portal/leave",
    icon: CalendarClock,
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-600",
    desc: "Apply for child",
  },
  {
    title: "Store",
    href: "/parent-portal/store",
    icon: ShoppingBag,
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    desc: "Orders & dues",
  },
]

function dashboardHref(student: ParentStudent) {
  if (!student.enrollmentId) return null
  return `/student-dashboard/${student.enrollmentId}?from=parent`
}

export default function ParentPortalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { data: parent, isLoading } = useParentProfile()

  const students: ParentStudent[] = parent?.students ?? []
  const withEnrollment = useMemo(
    () => students.filter((s: ParentStudent) => !!s.enrollmentId),
    [students]
  )

  // Exactly one child with enrollment → auto-open Student Dashboard (replace)
  useEffect(() => {
    if (isLoading) return
    if (withEnrollment.length === 1) {
      const href = dashboardHref(withEnrollment[0])
      if (href) {
        router.replace(href)
      }
    }
  }, [isLoading, withEnrollment, router])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const displayName = user?.fullName?.split(" ")[0] ?? "there"

  // Auto-open in progress (1 child)
  if (!isLoading && withEnrollment.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-primary/60" />
        </motion.div>
        <p className="text-sm text-muted-foreground">
          Opening {withEnrollment[0].firstName}&apos;s dashboard…
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl gradient-primary p-6 sm:p-8 lg:p-10"
      >
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-white/8 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-white/70 text-sm font-medium tracking-wide">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {greeting()}, <span className="text-white/90">{displayName}</span>
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-md">
              {students.length > 1
                ? "Select a child to view their progress, attendance, and teacher notes."
                : "Here’s how your children are doing."}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-white text-sm font-medium border border-white/20 shrink-0">
            <Users className="h-4 w-4" />
            <span>
              {students.length} {students.length === 1 ? "child" : "children"}
            </span>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10 text-primary/60" />
          </motion.div>
        </div>
      ) : students.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No children linked</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your account is not linked to any students yet. Please contact the school office.
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div variants={container} initial="hidden" animate="show">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 px-1">
              Your children
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((student: ParentStudent) => {
                const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`
                const href = dashboardHref(student)
                const card = (
                  <Card
                    className={`group border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 overflow-hidden h-full ${
                      href
                        ? "hover:bg-card hover:border-primary/30 hover:shadow-lg cursor-pointer"
                        : "opacity-80"
                    }`}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                        <span className="text-2xl font-bold text-white">{initials}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {student.gradeName}
                          {student.sectionName ? ` · ${student.sectionName}` : ""}
                        </p>
                        {student.admissionNumber && (
                          <p className="text-xs text-muted-foreground/60 mt-0.5">
                            #{student.admissionNumber}
                          </p>
                        )}
                        {student.academicYearLabel && (
                          <p className="text-xs text-muted-foreground/60 mt-0.5">
                            {student.academicYearLabel}
                          </p>
                        )}
                      </div>
                      {href ? (
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          View dashboard <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <p className="text-xs text-amber-600">
                          No active enrollment — contact school
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )

                return (
                  <motion.div key={student.id} variants={item}>
                    {href ? <Link href={href}>{card}</Link> : card}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Secondary quick actions */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 px-1">
              Quick actions
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <Link key={link.title} href={link.href}>
                  <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                    <CardContent className="p-5 flex flex-col items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl ${link.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                      >
                        <link.icon className={`h-5 w-5 ${link.textColor}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Also expose classic modules for multi-child families */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground px-1">
            <Link href="/parent-portal/attendance" className="inline-flex items-center gap-1 hover:text-primary">
              <CalendarCheck className="h-3.5 w-3.5" /> All attendance
            </Link>
            <span>·</span>
            <Link href="/parent-portal/results" className="inline-flex items-center gap-1 hover:text-primary">
              <Trophy className="h-3.5 w-3.5" /> All results
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
