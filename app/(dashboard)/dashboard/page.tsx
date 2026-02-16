"use client"

import { motion } from "framer-motion"
import { Users, GraduationCap, Building2, BookOpen, Calendar, DollarSign, Activity } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { useAuth } from "@/hooks/use-auth"

const companyStats = [
  { title: "Total Tenants", value: "48", icon: Building2, trend: { value: 12, isPositive: true } },
  { title: "Active Users", value: "2,847", icon: Users, trend: { value: 8, isPositive: true } },
  { title: "Total Students", value: "45,231", icon: GraduationCap, trend: { value: 15, isPositive: true } },
  { title: "Monthly Revenue", value: "$124,500", icon: DollarSign, trend: { value: 5, isPositive: true } },
]

const tenantStats = [
  { title: "Total Students", value: "1,234", icon: GraduationCap, trend: { value: 5, isPositive: true } },
  { title: "Staff Members", value: "89", icon: Users, trend: { value: 2, isPositive: true } },
  { title: "Active Courses", value: "24", icon: BookOpen, trend: { value: 3, isPositive: true } },
  { title: "Attendance Rate", value: "94.5%", icon: Activity, trend: { value: 1.2, isPositive: true } },
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const { user, tenantName } = useAuth()
  const stats = config.isCompanyHost ? companyStats : tenantStats

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const displayName = user?.firstName || user?.fullName?.split(" ")[0] || "there"

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greeting()}, ${displayName}`}
        description={
          config.isCompanyHost
            ? "Here's what's happening across your platform today."
            : `Welcome to ${tenantName || "your dashboard"}. Here's your overview.`
        }
      >
        <Button className="gradient-primary text-primary-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          View Schedule
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {config.isCompanyHost ? (
                <>
                  <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                    <Building2 className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Add Tenant</p>
                      <p className="text-xs text-muted-foreground">Create new institute</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                    <Users className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Manage Users</p>
                      <p className="text-xs text-muted-foreground">Company staff</p>
                    </div>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                    <GraduationCap className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Add Student</p>
                      <p className="text-xs text-muted-foreground">New admission</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                    <BookOpen className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Create Course</p>
                      <p className="text-xs text-muted-foreground">Add new course</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                    <Users className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Add Staff</p>
                      <p className="text-xs text-muted-foreground">New employee</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                    <Calendar className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Schedule</p>
                      <p className="text-xs text-muted-foreground">Manage timetable</p>
                    </div>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New student enrolled", time: "2 minutes ago", icon: GraduationCap },
                  { action: "Course schedule updated", time: "15 minutes ago", icon: Calendar },
                  { action: "Staff member added", time: "1 hour ago", icon: Users },
                  { action: "Attendance marked", time: "2 hours ago", icon: Activity },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
