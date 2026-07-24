"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  GraduationCap,
  User,
  CalendarCheck,
  FileText,
  DollarSign,
  CalendarClock,
  Bell,
  ArrowRight,
  Sparkles,
  Trophy,
  TrendingUp,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useParentProfile } from "@/hooks/use-parent-portal"

const easeOut = [0.25, 0.46, 0.45, 0.94] as const

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
}
const scale = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: easeOut } },
}

const quickLinks = [
  { title: "Attendance", href: "/parent-portal/attendance", icon: CalendarCheck, bgColor: "bg-emerald-500/10", textColor: "text-emerald-600", desc: "Track daily presence" },
  { title: "Results", href: "/parent-portal/results", icon: Trophy, bgColor: "bg-amber-500/10", textColor: "text-amber-600", desc: "Exam performance" },
  { title: "Fees", href: "/parent-portal/fees", icon: DollarSign, bgColor: "bg-violet-500/10", textColor: "text-violet-600", desc: "Payments & dues" },
  { title: "Leave", href: "/parent-portal/leave", icon: CalendarClock, bgColor: "bg-rose-500/10", textColor: "text-rose-600", desc: "Apply for child" },
]

export default function ParentPortalPage() {
  const { user } = useAuth()
  const { data: parent, isLoading } = useParentProfile()
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const displayName = user?.fullName?.split(" ")[0] ?? "there"
  const students = parent?.students ?? []
  const selectedStudent = students.find((s) => s.id === selectedChildId) ?? null

  // Reset selection if the list changes (e.g. refetch)
  useEffect(() => {
    if (selectedChildId && !students.find((s) => s.id === selectedChildId)) {
      setSelectedChildId(null)
    }
  }, [students, selectedChildId])

  // ─── Phase 1: Child Picker Landing ─────────────────────────────────
  if (!selectedStudent) {
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
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {greeting()},{" "}
                <span className="text-white/90">{displayName}</span>
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-md">
                Select your child to view their academic details.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-white text-sm font-medium border border-white/20">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Parent Portal</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
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
            <h3 className="text-xl font-semibold text-foreground mb-2">No Children Linked</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your account is not yet linked to any students. Please reach out to the school administration.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Child Cards Grid */}
            <motion.div variants={container} initial="hidden" animate="show">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 px-1">
                Select Your Child
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => {
                  const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`
                  return (
                    <motion.div key={student.id} variants={item}>
                      <Card
                        onClick={() => setSelectedChildId(student.id)}
                        className="group border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                      >
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                          {/* Avatar */}
                          <motion.div
                            whileHover={{ scale: 1.08 }}
                            className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow"
                          >
                            <span className="text-2xl font-bold text-white">{initials}</span>
                          </motion.div>
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
                          </div>
                          <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View Dashboard <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    )
  }

  // ─── Phase 2: Child Dashboard ──────────────────────────────────────
  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Compact Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl gradient-primary p-5 sm:p-6"
      >
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => setSelectedChildId(null)}
            className="shrink-0 h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-medium">
              {selectedStudent.gradeName} · {selectedStudent.sectionName}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
              {selectedStudent.firstName} {selectedStudent.lastName}
            </h1>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-white text-xs font-medium border border-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={selectedStudent.id} variants={container} initial="hidden" animate="show" exit="hidden" className="space-y-6">
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div variants={scale}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CalendarCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">Today</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">Present</p>
                  <p className="text-xs text-muted-foreground mt-1">Attendance</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={scale}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">Avg</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">85%</p>
                  <p className="text-xs text-muted-foreground mt-1">Performance</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={scale}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-violet-600" />
                    </div>
                    <span className="text-xs font-medium text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded-full">Next</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">12 Jun</p>
                  <p className="text-xs text-muted-foreground mt-1">Exam</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 px-1">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <motion.div key={link.title} variants={item}>
                  <Link href={link.href}>
                    <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                      <CardContent className="p-5 flex flex-col items-start gap-3">
                        <div className={`h-10 w-10 rounded-xl ${link.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <link.icon className={`h-5 w-5 ${link.textColor}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{link.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                        </div>
                        <div className="ml-auto -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detail Card */}
          <motion.div variants={scale}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedStudent.gradeName} · {selectedStudent.sectionName}
                      {selectedStudent.admissionNumber && (
                        <span className="ml-2 text-xs text-muted-foreground/60">#{selectedStudent.admissionNumber}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/parent-portal/results">
                      <Button size="sm" variant="outline" className="rounded-xl"><Trophy className="mr-1.5 h-4 w-4" />Results</Button>
                    </Link>
                    <Link href="/parent-portal/fees">
                      <Button size="sm" className="gradient-primary text-primary-foreground rounded-xl"><DollarSign className="mr-1.5 h-4 w-4" />View Fees</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements */}
          <motion.div variants={scale}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-rose-500" />
                    <h3 className="font-semibold text-foreground">Recent Announcements</h3>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Parent-Teacher Meeting", date: "June 20, 2026", time: "10:00 AM" },
                    { title: "Annual Day Celebration", date: "July 5, 2026", time: "5:00 PM" },
                    { title: "Mid-term Exam Schedule Released", date: "June 10, 2026", time: "9:00 AM" },
                  ].map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.date} · {a.time}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}