"use client"

import { motion } from "framer-motion"
import { GraduationCap, User } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useParents } from "@/hooks/use-parents"

export default function ParentPortalPage() {
  const { user } = useAuth()
  const { data: parents, isLoading } = useParents()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const displayName = user?.fullName?.split(" ")[0] || "there"

  // Get the current parent (matches user)
  const currentParent = parents?.find((p) => p.userId === user?.id)

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greeting()}, ${displayName}`}
        description="Here are your children's profiles at a glance."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : currentParent?.students && currentParent.students.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {currentParent.students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {student.firstName} {student.lastName}
                      </CardTitle>
                      {student.admissionNumber && (
                        <CardDescription>#{student.admissionNumber}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grade</span>
                      <span className="font-medium">{student.gradeName || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Section</span>
                      <span className="font-medium">{student.sectionName || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Relation</span>
                      <span className="font-medium capitalize">
                        {student.isPrimary ? "Primary Guardian" : currentParent?.relation || "Guardian"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Students Linked</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your account is not yet linked to any students. Please contact the school administration.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}